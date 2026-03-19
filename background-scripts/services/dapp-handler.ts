import { Logger } from "@extension-scripts/logger/logger.class";
import { BrowserApiUtil } from "./browser-api-util";
import {
    DappMessage,
    DappMessageType,
    DappPermission,
    PendingDappRequest,
    SUPPORTED_CHAINS,
    isSupportedChain,
    chainIdToHex,
    getChainConfig,
    hexToChainId,
} from "@shared/types/dapp.types";
import { getPreferredChainIdForOrigin } from "@shared/services/dapp-mapping.service";

// ─── Constants ────────────────────────────────────────────────────────────────

/** How long a pending dApp request lives before it auto-expires (5 minutes). */
const DAPP_REQUEST_TIMEOUT_MS = 5 * 60 * 1000;

/** chrome.storage.local key that holds all granted dApp permissions. */
const PERMISSIONS_STORAGE_KEY = "dapp_permissions";

/** Prefix used for per-request storage keys, allowing restore after service-worker restart. */
const PENDING_REQUEST_STORAGE_PREFIX = "pending_dapp_request_";

/** Total time budget for retrying a tab message (exponential backoff up to 60s). */
const TAB_MESSAGE_TIMEOUT_MS = 60 * 1000;

/** Starting delay for the exponential backoff when a tab message fails. */
const TAB_MESSAGE_INITIAL_DELAY_MS = 100;

/** Maximum delay between individual retry attempts (caps the exponential growth). */
const TAB_MESSAGE_MAX_DELAY_MS = 5000;

// ─── Types ────────────────────────────────────────────────────────────────────

/** A pending request as persisted to chrome.storage.local (adds expiry / display fields). */
interface StoredPendingDappRequest extends PendingDappRequest {
    expiresAt: number;
    favicon: string;
    hostname: string;
    verifyStatus: "UNKNOWN";
}

/**
 * An entry in the per-origin coalescing queue.
 * When multiple connection requests arrive for the same origin simultaneously,
 * they are queued here so they all receive the same approval/rejection outcome.
 */
interface CoalescedConnect {
    requestId: string;
    tabId?: number;
}

// ─── Module-level RPC proxy helper ───────────────────────────────────────────

/**
 * Forwards a read-only JSON-RPC call directly to the configured chain RPC endpoint.
 * This avoids opening any UI — it is used for methods like eth_blockNumber, eth_getBalance, etc.
 *
 * @param payload  - The RPC payload (method, params, chainId in hex).
 * @param sendResponse - Chrome extension sendResponse callback.
 */
async function handleRpcProxy(
    payload: { method?: string; params?: any[]; chainId?: string },
    sendResponse: (response: any) => void
): Promise<void> {
    const { method, params = [], chainId: chainIdHex } = payload || {};
    const chainId = chainIdHex ? hexToChainId(chainIdHex) : 1;
    const chainConfig = getChainConfig(chainId);
    const rpcUrl = chainConfig?.rpcUrl;

    if (!rpcUrl) {
        sendResponse({
            success: false,
            error: { code: -32603, message: `Zelf Wallet: No RPC URL for chain ${chainId}. Read-only methods require a configured RPC.` },
        });
        return;
    }

    try {
        const res = await fetch(rpcUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params: Array.isArray(params) ? params : [] }),
        });
        const json = await res.json();

        if (json.error) {
            sendResponse({
                success: false,
                error: { code: json.error.code ?? -32603, message: json.error.message || "RPC error" },
            });
            return;
        }

        sendResponse({ success: true, data: json.result });
    } catch (err: any) {
        Logger.error("DAPP_RPC_PROXY error:", err);
        sendResponse({
            success: false,
            error: { code: -32603, message: err?.message || "RPC proxy failed" },
        });
    }
}

// ─── DappHandler class ────────────────────────────────────────────────────────

export class DappHandler {
    // ── Singleton ──────────────────────────────────────────────────────────────

    private static instance: DappHandler;

    /**
     * Returns the singleton DappHandler instance, creating it on first call.
     * Using a singleton ensures the in-memory pending-request state is shared
     * across all background message handlers.
     */
    public static getInstance(browserApi: BrowserApiUtil): DappHandler {
        if (!DappHandler.instance) {
            DappHandler.instance = new DappHandler(browserApi);
        }
        return DappHandler.instance;
    }

    // ── In-memory state ────────────────────────────────────────────────────────

    /** All requests awaiting user approval (in-memory; also persisted to storage). */
    private pendingRequests: Map<string, PendingDappRequest> = new Map();

    /** setTimeout handles indexed by requestId — used to cancel timers on resolution. */
    private timeoutHandles: Map<string, ReturnType<typeof setTimeout>> = new Map();

    /**
     * Per-origin coalescing queue for connection requests.
     * The first entry is the "leader" that opens the UI; subsequent ones piggyback
     * and receive the same approval/rejection result.
     */
    private pendingConnectsByOrigin: Map<string, CoalescedConnect[]> = new Map();

    /** Promise guard so _restorePendingRequests only runs once per service-worker lifecycle. */
    private restorePendingRequestsPromise: Promise<void> | null = null;

    // ── Constructor ────────────────────────────────────────────────────────────

    private constructor(private browserApi: BrowserApiUtil) {
        // Kick off storage restoration immediately so in-flight requests survive
        // service-worker restarts without needing a separate call.
        void this.restorePendingRequests();
    }

    // ─── Public API ───────────────────────────────────────────────────────────

    /**
     * Idempotent: restores any pending requests from chrome.storage.local into
     * memory after a service-worker restart. Safe to call multiple times.
     */
    async restorePendingRequests(): Promise<void> {
        if (!this.restorePendingRequestsPromise) {
            this.restorePendingRequestsPromise = this._restorePendingRequests();
        }
        return this.restorePendingRequestsPromise;
    }

    /**
     * Main entry point for all messages arriving from content scripts / the extension UI.
     * Dispatches to the appropriate private handler based on the message type.
     *
     * For messages that require async work longer than Chrome's ~5 s message-channel
     * timeout, `sendResponse` is called immediately with `{ pending: true }` and the
     * result is later pushed back via `_notifyTab`.
     *
     * @param message      - Typed dApp message from the content script.
     * @param sender       - Chrome message sender (contains tab info).
     * @param sendResponse - Must be called to keep the message channel alive.
     */
    async handleDappMessage(
        message: DappMessage,
        sender: { tab?: { id?: number; url?: string } },
        sendResponse: (response: any) => void
    ): Promise<void> {
        const { type, payload, requestId, origin } = message;
        const senderOrigin = origin || (sender.tab?.url ? new URL(sender.tab.url).origin : "");

        try {
            switch (type) {
                // ── Connection ────────────────────────────────────────────────
                case "DAPP_REQUEST_ACCOUNTS":
                case "DAPP_CONNECT":
                    // Respond immediately — storage I/O + chrome.windows.create can exceed the 5 s limit.
                    sendResponse({ success: true, pending: true });
                    void this._handleConnectionRequest(requestId, senderOrigin, payload, sender.tab?.id).catch((error) => {
                        Logger.error("Failed to handle connection request after immediate response:", error);
                    });
                    break;

                case "DAPP_GET_ACCOUNTS":
                    await this._handleGetAccounts(senderOrigin, sendResponse);
                    break;

                // ── Signing ───────────────────────────────────────────────────
                case "DAPP_SEND_TRANSACTION":
                case "DAPP_SIGN_TRANSACTION":
                    sendResponse({ success: true, pending: true });
                    void this._handleSignTransaction(requestId, senderOrigin, payload, sender.tab?.id).catch((error) => {
                        Logger.error("Failed to handle sign transaction after immediate response:", error);
                    });
                    break;

                case "DAPP_SIGN_MESSAGE":
                    sendResponse({ success: true, pending: true });
                    void this._handleSignMessage(requestId, senderOrigin, payload, sender.tab?.id).catch((error) => {
                        Logger.error("Failed to handle sign message after immediate response:", error);
                    });
                    break;

                // ── Chain management ──────────────────────────────────────────
                case "DAPP_SWITCH_CHAIN":
                    await this._handleSwitchChain(requestId, senderOrigin, payload, sendResponse);
                    break;

                case "DAPP_ADD_CHAIN":
                    this._handleAddChain(payload, sendResponse);
                    break;

                case "DAPP_CHAIN_ID":
                    await this._handleGetChainId(senderOrigin, sendResponse);
                    break;

                // ── Disconnect ────────────────────────────────────────────────
                case "DAPP_DISCONNECT":
                    await this._handleDisconnect(senderOrigin, sendResponse);
                    break;

                case "DAPP_FORCE_DISCONNECT_SITE":
                    await this._handleForceDisconnectSite(payload?.origin, sendResponse);
                    break;

                case "DAPP_FORCE_DISCONNECT_ALL":
                    await this._handleForceDisconnectAll(sendResponse);
                    break;

                // ── Pending request lifecycle ─────────────────────────────────
                case "DAPP_GET_PENDING":
                    await this._handleGetPending(requestId, sendResponse);
                    break;

                case "DAPP_APPROVAL_RESULT":
                    sendResponse({ success: true });
                    void this._handleApprovalResult(payload).catch((error) => {
                        Logger.error("Failed to process dApp approval result:", error);
                    });
                    break;

                case "DAPP_SIGNING_RESULT":
                    sendResponse({ success: true });
                    void this._handleSigningResult(payload).catch((error) => {
                        Logger.error("Failed to process dApp signing result:", error);
                    });
                    break;

                case "DAPP_CANCEL_PENDING_FOR_ORIGIN":
                    await this._handleCancelPendingForOrigin(senderOrigin, sendResponse);
                    break;

                case "DAPP_CLEANUP_REQUESTS":
                    await this._handleCleanupRequests(sendResponse);
                    break;

                // ── RPC proxy ─────────────────────────────────────────────────
                case "DAPP_RPC_PROXY":
                    await handleRpcProxy(payload, sendResponse);
                    break;

                default:
                    sendResponse({ success: false, error: `Unknown dApp message type: ${type}` });
            }
        } catch (error) {
            Logger.error(`DappHandler error for ${type}:`, error);
            sendResponse({ success: false, error: (error as Error).message });
        }
    }

    /**
     * Returns a single pending request by ID (in-memory lookup only).
     * Used externally by the background script to retrieve request data for the approval UI.
     */
    getPendingRequest(requestId: string): PendingDappRequest | undefined {
        return this.pendingRequests.get(requestId);
    }

    /**
     * Returns all currently pending requests (in-memory).
     * Used externally to render a list of outstanding approvals.
     */
    getAllPendingRequests(): PendingDappRequest[] {
        return Array.from(this.pendingRequests.values());
    }

    // ─── Broadcast helpers (public — called from outside the class) ───────────

    /**
     * Broadcasts an `accountsChanged` event to every non-extension tab.
     * Called when the active wallet account changes globally.
     *
     * @param accounts - New account list (empty array = disconnected).
     */
    async broadcastAccountsChanged(accounts: string[]): Promise<void> {
        await this._broadcastToAllTabs("DAPP_ACCOUNTS_CHANGED", { accounts });
    }

    /**
     * Broadcasts an `accountsChanged` event only to tabs whose origin matches
     * `targetOrigin`. Used when a single site is force-disconnected.
     *
     * @param targetOrigin - The origin to target (e.g. "https://app.uniswap.org").
     * @param accounts     - New account list (empty array = disconnected).
     */
    async broadcastAccountsChangedByOrigin(targetOrigin: string, accounts: string[]): Promise<void> {
        try {
            const tabs = this.browserApi.tabs as any;
            if (!tabs?.query || !tabs?.sendMessage) return;

            const allTabs = await tabs.query({});

            for (const tab of allTabs) {
                if (!tab.id || !tab.url || tab.url.startsWith("chrome-extension://")) continue;

                try {
                    const tabOrigin = new URL(tab.url).origin;
                    if (tabOrigin === targetOrigin) {
                        await tabs.sendMessage(tab.id, {
                            type: "DAPP_ACCOUNTS_CHANGED",
                            payload: { accounts },
                        });
                    }
                } catch {
                    // Ignore URL parsing errors or tabs without a content script
                }
            }
        } catch (error) {
            Logger.error(`Error broadcasting accounts change for origin ${targetOrigin}:`, error);
        }
    }

    // ─── Connection handlers ──────────────────────────────────────────────────

    /**
     * Handles eth_requestAccounts / wallet_connect.
     *
     * Flow:
     * 1. If the origin already has a valid permission, return the cached accounts immediately.
     * 2. If another connect for this origin is already in-flight (and still alive), coalesce
     *    the request so only one approval popup is shown.
     * 3. Otherwise, open a fresh approval UI popup.
     *
     * @param requestId - Unique request ID from the dApp.
     * @param origin    - Requesting dApp origin.
     * @param payload   - Original request payload (may contain chainId, method).
     * @param tabId     - Tab ID of the dApp (used to push the response back).
     */
    private async _handleConnectionRequest(requestId: string, origin: string, payload: any, tabId?: number): Promise<void> {
        // Short-circuit: origin already connected — return cached accounts without opening UI.
        const existingPermission = await this._getPermission(origin);
        const isRequestPermissions = payload?.method === "wallet_requestPermissions";

        if (existingPermission && existingPermission.accounts.length > 0 && !isRequestPermissions) {
            this._resolveRequest(requestId, existingPermission.accounts);
            await this._notifyTab(tabId, "DAPP_PROVIDER_RESPONSE", {
                requestId,
                result: existingPermission.accounts,
            });
            return;
        }

        // Coalesce: join an existing in-flight connect queue for this origin.
        if (this._tryCoalesceConnect(origin, requestId, tabId)) return;

        // No existing connect in-flight — register as the leader and open the UI.
        this.pendingConnectsByOrigin.set(origin, [{ requestId, tabId }]);

        const chainId = await this._resolveChainIdForConnect(origin, payload);

        const pendingRequest: PendingDappRequest = {
            id: requestId,
            type: "DAPP_CONNECT",
            origin,
            tabId,
            method: "eth_requestAccounts",
            params: payload,
            chainId,
            timestamp: Date.now(),
            timeoutMs: DAPP_REQUEST_TIMEOUT_MS,
        };

        this._addPendingRequest(pendingRequest);
        await this._persistPendingToStorage(requestId, pendingRequest);
        await this._openApprovalUI("connect", requestId, tabId);
    }

    /**
     * Handles eth_accounts — returns the stored accounts for an origin without
     * triggering any user interaction. Updates `lastUsed` timestamp on the permission.
     *
     * @param origin       - dApp origin.
     * @param sendResponse - Chrome extension sendResponse callback.
     */
    private async _handleGetAccounts(origin: string, sendResponse: (response: any) => void): Promise<void> {
        const permission = await this._getPermission(origin);

        if (permission) {
            permission.lastUsed = Date.now();
            await this._savePermission(permission);
            sendResponse({ success: true, data: permission.accounts });
        } else {
            sendResponse({ success: true, data: [] });
        }
    }

    /**
     * Handles eth_sendTransaction / eth_signTransaction.
     * Requires the origin to have an existing permission (wallet must be connected first).
     * Opens the signing approval UI popup.
     *
     * @param requestId - Unique request ID.
     * @param origin    - dApp origin.
     * @param payload   - Transaction params.
     * @param tabId     - Originating tab (for push-back response).
     */
    private async _handleSignTransaction(requestId: string, origin: string, payload: any, tabId?: number): Promise<void> {
        if (!await this._requirePermission(origin, requestId, tabId)) return;

        const txParams = payload?.params || payload;
        const txChainId = payload?.chainId || (Array.isArray(txParams) && txParams[0]?.chainId ? parseInt(txParams[0].chainId, 16) : undefined);
        const resolvedChainId = txChainId || (await this._getActiveChainId(origin));

        const pendingRequest: PendingDappRequest = {
            id: requestId,
            type: "DAPP_SIGN_TRANSACTION",
            origin,
            tabId,
            method: payload?.method || "eth_sendTransaction",
            params: txParams,
            chainId: resolvedChainId,
            timestamp: Date.now(),
            timeoutMs: DAPP_REQUEST_TIMEOUT_MS,
        };

        await this._registerAndShowSigningRequest(pendingRequest);
    }

    /**
     * Handles personal_sign / eth_signTypedData_v4 etc.
     * Requires the origin to have an existing permission.
     * Opens the signing approval UI popup.
     *
     * @param requestId - Unique request ID.
     * @param origin    - dApp origin.
     * @param payload   - Signing params (method + params array).
     * @param tabId     - Originating tab.
     */
    private async _handleSignMessage(requestId: string, origin: string, payload: any, tabId?: number): Promise<void> {
        if (!await this._requirePermission(origin, requestId, tabId)) return;

        const resolvedChainId = await this._getActiveChainId(origin);

        const pendingRequest: PendingDappRequest = {
            id: requestId,
            type: "DAPP_SIGN_MESSAGE",
            origin,
            tabId,
            method: payload?.method || "personal_sign",
            params: payload?.params || payload,
            chainId: resolvedChainId,
            timestamp: Date.now(),
            timeoutMs: DAPP_REQUEST_TIMEOUT_MS,
        };

        await this._registerAndShowSigningRequest(pendingRequest);
    }

    // ─── Chain handlers ───────────────────────────────────────────────────────

    /**
     * Handles wallet_switchEthereumChain.
     * Validates the requested chain is supported, updates the stored permission's
     * chainId, and broadcasts a chainChanged event to all tabs.
     *
     * @param requestId    - Unused here but kept for signature consistency.
     * @param origin       - dApp origin.
     * @param payload      - Contains the target chainId (hex string).
     * @param sendResponse - Synchronous response callback.
     */
    private async _handleSwitchChain(requestId: string, origin: string, payload: any, sendResponse: (response: any) => void): Promise<void> {
        const chainId = typeof payload?.chainId === "string" ? parseInt(payload.chainId, 16) : payload?.chainId;

        if (!isSupportedChain(chainId)) {
            sendResponse({
                success: false,
                error: { code: 4902, message: `Unrecognized chain ID ${chainIdToHex(chainId)}. Try adding the chain first.` },
            });
            return;
        }

        const permission = await this._getPermission(origin);
        if (permission) {
            permission.chainId = chainId;
            permission.lastUsed = Date.now();
            await this._savePermission(permission);
        }

        await this._broadcastChainChanged(chainId);
        sendResponse({ success: true, data: null });
    }

    /**
     * Handles wallet_addEthereumChain.
     * Zelf currently only supports chains that are pre-configured, so this either
     * succeeds silently (chain already known) or returns EIP-1193 error 4902.
     *
     * @param payload      - Contains the chainId to add.
     * @param sendResponse - Synchronous response callback.
     */
    private _handleAddChain(payload: any, sendResponse: (response: any) => void): void {
        const chainId = typeof payload?.chainId === "string" ? parseInt(payload.chainId, 16) : payload?.chainId;

        if (isSupportedChain(chainId)) {
            sendResponse({ success: true, data: null });
        } else {
            sendResponse({
                success: false,
                error: { code: 4902, message: "Zelf Wallet does not support adding custom chains at this time." },
            });
        }
    }

    /**
     * Handles eth_chainId — returns the hex chain ID currently active for the origin.
     *
     * @param origin       - dApp origin.
     * @param sendResponse - Synchronous response callback.
     */
    private async _handleGetChainId(origin: string, sendResponse: (response: any) => void): Promise<void> {
        const chainId = await this._getActiveChainId(origin);
        sendResponse({ success: true, data: chainIdToHex(chainId) });
    }

    // ─── Disconnect handlers ──────────────────────────────────────────────────

    /**
     * Handles wallet_revokePermissions (user-initiated disconnect from the dApp).
     * Removes the stored permission and clears any stale coalescing state for the origin.
     *
     * @param origin       - dApp origin to disconnect.
     * @param sendResponse - Synchronous response callback.
     */
    private async _handleDisconnect(origin: string, sendResponse: (response: any) => void): Promise<void> {
        await this._removePermission(origin);
        // Clear any stale coalesced connect entry so a subsequent reconnect
        // doesn't silently piggyback on a dead session.
        this.pendingConnectsByOrigin.delete(origin);
        sendResponse({ success: true });
    }

    /**
     * Admin-initiated force-disconnect of a single origin.
     * Removes its permission and pushes an `accountsChanged([])` event to all its tabs.
     *
     * @param origin       - dApp origin to force-disconnect.
     * @param sendResponse - Synchronous response callback.
     */
    private async _handleForceDisconnectSite(origin: string, sendResponse: (response: any) => void): Promise<void> {
        if (!origin) {
            sendResponse({ success: false, error: "Origin is required" });
            return;
        }

        try {
            await this._removePermission(origin);
            sendResponse({ success: true });
            void this.broadcastAccountsChangedByOrigin(origin, []);
        } catch (error) {
            Logger.error("Failed to force disconnect site:", error);
            sendResponse({ success: false, error: (error as Error).message });
        }
    }

    /**
     * Admin-initiated force-disconnect of ALL origins.
     * Wipes the entire permissions object and broadcasts `accountsChanged([])` globally.
     *
     * @param sendResponse - Synchronous response callback.
     */
    private async _handleForceDisconnectAll(sendResponse: (response: any) => void): Promise<void> {
        try {
            await this.browserApi.setStorageItem(PERMISSIONS_STORAGE_KEY, {});
            sendResponse({ success: true });
            void this.broadcastAccountsChanged([]);
        } catch (error) {
            Logger.error("Failed to force disconnect all sites:", error);
            sendResponse({ success: false, error: (error as Error).message });
        }
    }

    // ─── Pending request lifecycle ────────────────────────────────────────────

    /**
     * Retrieves and returns the data for a pending request.
     * Called by the approval UI to populate its display (hostname, favicon, params, etc.).
     *
     * @param requestId    - The pending request to fetch.
     * @param sendResponse - Synchronous response callback.
     */
    private async _handleGetPending(requestId: string, sendResponse: (response: any) => void): Promise<void> {
        const pending = await this._getPendingRequest(requestId);

        if (!pending) {
            sendResponse({ success: false, error: "No pending request found" });
            return;
        }

        const hostname = this._getHostname(pending.origin);
        const chainId = pending.chainId || (await this._getActiveChainId(pending.origin));

        sendResponse({
            success: true,
            data: {
                origin: pending.origin,
                hostname,
                favicon: `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`,
                chainId,
                method: pending.method,
                params: pending.params,
                verifyStatus: "UNKNOWN",
            },
        });
    }

    /**
     * Processes the result of a connection approval/rejection from the extension UI.
     *
     * On approval: saves the granted permission, notifies the originating dApp tab,
     * and fans out the same result to any coalesced requests for the same origin.
     * On rejection: sends a 4001 error to all waiting requests.
     *
     * @param payload - Contains requestId, approved flag, accounts array, and chainId.
     */
    private async _handleApprovalResult(payload: any): Promise<void> {
        const { requestId, approved, accounts, chainId } = payload;
        const pending = await this._getPendingRequest(requestId);

        if (!pending) {
            Logger.warn(`No pending dApp approval request found for ${requestId}`);
            return;
        }

        if (approved && accounts) {
            await this._savePermission({
                origin: pending.origin,
                accounts,
                chainId: chainId || 1404,
                connectedAt: Date.now(),
                lastUsed: Date.now(),
            });
        }

        const responsePayload = approved && accounts
            ? { result: accounts }
            : { error: { code: 4001, message: "User rejected the request" } };

        await this._notifyTab(pending.tabId, "DAPP_PROVIDER_RESPONSE", { requestId, ...responsePayload });
        this._removePendingRequest(requestId);

        // Fan out the same outcome to any coalesced requests for this origin.
        await this._resolveCoalescedConnects(pending.origin, responsePayload);
    }

    /**
     * Processes the result of a signing operation from the extension UI.
     *
     * Pushes either the signed result or a rejection error back to the dApp tab.
     *
     * @param payload - Contains requestId, result (signature), and optional error.
     */
    private async _handleSigningResult(payload: any): Promise<void> {
        const { requestId, result, error } = payload;
        const pending = await this._getPendingRequest(requestId);

        if (!pending) {
            Logger.warn(`No pending dApp signing request found for ${requestId}`);
            return;
        }

        const responsePayload = result
            ? { requestId, result }
            : { requestId, error: error || { code: 4001, message: "User rejected the request" } };

        await this._notifyTab(pending.tabId, "DAPP_PROVIDER_RESPONSE", responsePayload);
        this._removePendingRequest(requestId);
    }

    /**
     * Cancels all pending requests originating from a given origin.
     * Used when the dApp explicitly requests cleanup (e.g. before re-connecting).
     * Also triggers a storage cleanup pass.
     *
     * @param origin       - Origin whose pending requests should be cancelled.
     * @param sendResponse - Synchronous response callback.
     */
    private async _handleCancelPendingForOrigin(origin: string, sendResponse: (response: any) => void): Promise<void> {
        try {
            const toCancel = Array.from(this.pendingRequests.values()).filter((r) => r.origin === origin);

            for (const pending of toCancel) {
                await this._notifyTab(pending.tabId, "DAPP_PROVIDER_RESPONSE", {
                    requestId: pending.id,
                    error: { code: 4001, message: "Connection cancelled - previous request cleared" },
                });
                this._removePendingRequest(pending.id);
            }

            if (toCancel.length > 0) {
                Logger.info(`[Dapp Cancel] Cancelled ${toCancel.length} pending request(s) for origin ${origin}`);
            }

            await this._handleCleanupRequests(sendResponse);
        } catch (error) {
            Logger.error("[Dapp Cancel] Failed to cancel pending requests:", error);
            sendResponse({ success: false, error: (error as Error).message });
        }
    }

    /**
     * Scans chrome.storage.local for pending-request entries that are orphaned
     * (no longer in memory) or expired, and removes them.
     *
     * @param sendResponse - Synchronous response callback with `{ removedCount }`.
     */
    private async _handleCleanupRequests(sendResponse: (response: any) => void): Promise<void> {
        try {
            const allItems = await this.browserApi.getAllStorageItems();
            const keysToRemove: string[] = [];

            for (const key of Object.keys(allItems)) {
                if (!key.startsWith(PENDING_REQUEST_STORAGE_PREFIX)) continue;

                const requestId = key.replace(PENDING_REQUEST_STORAGE_PREFIX, "");
                const stored = this._normalizeStoredPendingRequest(allItems[key], requestId);

                if (!stored || this._isStoredPendingExpired(stored)) {
                    keysToRemove.push(key);
                }
            }

            if (keysToRemove.length > 0) {
                Logger.info(`[Dapp Cleanup] Found ${keysToRemove.length} orphaned dapp requests. Removing:`, keysToRemove);
                await this.browserApi.removeStorageItems(keysToRemove);
                Logger.info(`[Dapp Cleanup] Removed ${keysToRemove.length} orphaned requests.`);
            } else {
                Logger.info("[Dapp Cleanup] No orphaned dapp requests found.");
            }

            sendResponse({ success: true, removedCount: keysToRemove.length });
        } catch (error) {
            Logger.error("[Dapp Cleanup] Failed to cleanup dapp requests:", error);
            sendResponse({ success: false, error: (error as Error).message });
        }
    }

    // ─── In-memory pending request management ─────────────────────────────────

    /**
     * Registers a pending request in memory and schedules its auto-expiry timeout.
     * If the request is already expired (e.g. restored from old storage), expires it immediately.
     *
     * @param request - The full PendingDappRequest to register.
     */
    private _addPendingRequest(request: PendingDappRequest): void {
        // Cancel any previous timeout for this ID (handles re-registration after restore).
        const existingTimeout = this.timeoutHandles.get(request.id);
        if (existingTimeout) clearTimeout(existingTimeout);

        this.pendingRequests.set(request.id, request);

        const remainingMs = request.timestamp + request.timeoutMs - Date.now();
        if (remainingMs <= 0) {
            void this._expirePendingRequest(request.id);
            return;
        }

        const timeout = setTimeout(() => void this._expirePendingRequest(request.id), remainingMs);
        this.timeoutHandles.set(request.id, timeout);
    }

    /**
     * Removes a pending request from memory, clears its timeout, and deletes it from storage.
     *
     * @param requestId - ID of the request to remove.
     */
    private _removePendingRequest(requestId: string): void {
        this.pendingRequests.delete(requestId);

        const timeout = this.timeoutHandles.get(requestId);
        if (timeout) {
            clearTimeout(timeout);
            this.timeoutHandles.delete(requestId);
        }

        this.browserApi.removeStorageItems(this._getPendingStorageKey(requestId)).catch(() => {});
    }

    /**
     * Resolves a pending request synchronously (using a stored resolve callback).
     * Used when an already-connected origin requests accounts and no UI is needed.
     *
     * @param requestId - ID of the request to resolve.
     * @param result    - Value to resolve with.
     */
    private _resolveRequest(requestId: string, result: any): void {
        const pending = this.pendingRequests.get(requestId);
        if (pending?.resolve) pending.resolve(result);
        this._removePendingRequest(requestId);
    }

    /**
     * Fires the timeout error for an expired request: notifies the dApp tab,
     * resolves any coalesced connects with the same error, then removes the request.
     *
     * @param requestId - ID of the expired request.
     */
    private async _expirePendingRequest(requestId: string): Promise<void> {
        const pending = this.pendingRequests.get(requestId) || (await this._getStoredPendingRequest(requestId));
        const errorPayload = { error: { code: -32000, message: "Request timed out" } };

        if (pending) {
            await this._notifyTab(pending.tabId, "DAPP_PROVIDER_RESPONSE", { requestId, ...errorPayload });
            await this._resolveCoalescedConnects(pending.origin, errorPayload);
        }

        this._removePendingRequest(requestId);
    }

    /**
     * Looks up a pending request, falling back to storage if not found in memory.
     * Re-registers the request in memory if it was found only in storage.
     *
     * @param requestId - ID of the request to find.
     * @returns The request, or null if not found / expired.
     */
    private async _getPendingRequest(requestId: string): Promise<PendingDappRequest | null> {
        const inMemory = this.pendingRequests.get(requestId);
        if (inMemory) return inMemory;

        const stored = await this._getStoredPendingRequest(requestId);
        if (!stored) return null;

        this._addPendingRequest(stored);
        return this.pendingRequests.get(requestId) || stored;
    }

    // ─── Storage helpers ──────────────────────────────────────────────────────

    /**
     * Persists a pending request to chrome.storage.local so it survives
     * service-worker restarts.
     *
     * @param requestId - Key to store under.
     * @param request   - The request to persist.
     */
    private async _persistPendingToStorage(requestId: string, request: PendingDappRequest): Promise<void> {
        await this.browserApi.setStorageItem(this._getPendingStorageKey(requestId), this._buildStoredPendingRequest(request));
    }

    /**
     * Reads and validates a single pending request directly from storage.
     * Returns null if the entry is missing, malformed, or expired.
     *
     * @param requestId - ID of the request to load.
     */
    private async _getStoredPendingRequest(requestId: string): Promise<StoredPendingDappRequest | null> {
        const stored = await this.browserApi.getStorageItem(this._getPendingStorageKey(requestId));
        const normalized = this._normalizeStoredPendingRequest(stored, requestId);

        if (!normalized) return null;

        if (this._isStoredPendingExpired(normalized)) {
            this._removePendingRequest(requestId);
            return null;
        }

        return normalized;
    }

    /**
     * On service-worker startup: scans all storage keys for pending request entries,
     * re-registers valid ones in memory, and deletes expired/malformed ones.
     */
    private async _restorePendingRequests(): Promise<void> {
        try {
            const allItems = await this.browserApi.getAllStorageItems();
            const keysToRemove: string[] = [];

            for (const [key, value] of Object.entries(allItems)) {
                if (!key.startsWith(PENDING_REQUEST_STORAGE_PREFIX)) continue;

                const requestId = key.replace(PENDING_REQUEST_STORAGE_PREFIX, "");
                const stored = this._normalizeStoredPendingRequest(value, requestId);

                if (!stored || this._isStoredPendingExpired(stored)) {
                    keysToRemove.push(key);
                    continue;
                }

                if (!this.pendingRequests.has(stored.id)) {
                    this._addPendingRequest(stored);
                }
            }

            if (keysToRemove.length > 0) {
                await this.browserApi.removeStorageItems(keysToRemove);
            }
        } catch (error) {
            Logger.error("Failed to restore pending dApp requests:", error);
        }
    }

    /**
     * Reads the permissions map from storage and returns the permission for a given origin.
     *
     * @param origin - The dApp origin to look up.
     * @returns The stored DappPermission, or null if not found.
     */
    private async _getPermission(origin: string): Promise<DappPermission | null> {
        try {
            const permissions = await this.browserApi.getStorageItem(PERMISSIONS_STORAGE_KEY);
            if (!permissions) return null;
            return permissions[origin] || null;
        } catch {
            return null;
        }
    }

    /**
     * Saves (creates or updates) a dApp permission to storage.
     *
     * @param permission - The permission object to save.
     */
    private async _savePermission(permission: DappPermission): Promise<void> {
        try {
            const permissions = (await this.browserApi.getStorageItem(PERMISSIONS_STORAGE_KEY)) || {};
            permissions[permission.origin] = permission;
            await this.browserApi.setStorageItem(PERMISSIONS_STORAGE_KEY, permissions);
        } catch (error) {
            Logger.error("Error saving dApp permission:", error);
        }
    }

    /**
     * Removes the stored permission for a given origin.
     *
     * @param origin - The dApp origin to remove.
     */
    private async _removePermission(origin: string): Promise<void> {
        try {
            const permissions = (await this.browserApi.getStorageItem(PERMISSIONS_STORAGE_KEY)) || {};
            delete permissions[origin];
            await this.browserApi.setStorageItem(PERMISSIONS_STORAGE_KEY, permissions);
        } catch (error) {
            Logger.error("Error removing dApp permission:", error);
        }
    }

    // ─── Permission guard ─────────────────────────────────────────────────────

    /**
     * Checks that the origin has an active permission with at least one account.
     * If not, sends a 4100 Unauthorized error directly to the dApp tab and returns false.
     * Callers should return early when this returns false.
     *
     * @param origin    - dApp origin to check.
     * @param requestId - Used to build the error response.
     * @param tabId     - Tab to notify on failure.
     * @returns true if the origin is authorized, false otherwise.
     */
    private async _requirePermission(origin: string, requestId: string, tabId?: number): Promise<boolean> {
        const permission = await this._getPermission(origin);

        if (!permission || permission.accounts.length === 0) {
            await this._notifyTab(tabId, "DAPP_PROVIDER_RESPONSE", {
                requestId,
                error: { code: 4100, message: "Unauthorized - connect wallet first" },
            });
            return false;
        }

        return true;
    }

    // ─── Coalescing helpers ───────────────────────────────────────────────────

    /**
     * Tries to add the request to an existing in-flight connect queue for this origin.
     * Returns true if the request was coalesced (caller should stop processing).
     * Returns false if no valid in-flight connect exists (caller should open a fresh UI).
     *
     * Stale entries (where the leader request is no longer in pendingRequests) are
     * cleaned up automatically, preventing silent swallowing of reconnect attempts.
     *
     * @param origin    - dApp origin.
     * @param requestId - New request ID to potentially queue.
     * @param tabId     - Tab ID of the new request.
     */
    private _tryCoalesceConnect(origin: string, requestId: string, tabId?: number): boolean {
        const existing = this.pendingConnectsByOrigin.get(origin);
        if (!existing || existing.length === 0) return false;

        const leaderRequestId = existing[0].requestId;

        if (this.pendingRequests.has(leaderRequestId)) {
            // Genuine in-flight connect — join the queue.
            existing.push({ requestId, tabId });
            return true;
        }

        // Stale entry (e.g. after disconnect or service-worker restart) — clean up and fall through.
        Logger.warn(`[DappHandler] Stale coalesced connect for ${origin}, clearing and opening fresh UI`);
        this.pendingConnectsByOrigin.delete(origin);
        return false;
    }

    /**
     * Fans out the leader's approval/rejection result to all coalesced requests for the origin.
     * Clears the origin's entry from the map after notifying all waiters.
     *
     * @param origin          - The origin whose coalesced queue should be resolved.
     * @param responsePayload - The result or error to send to each queued request.
     */
    private async _resolveCoalescedConnects(origin: string, responsePayload: Record<string, any>): Promise<void> {
        const coalesced = this.pendingConnectsByOrigin.get(origin);
        this.pendingConnectsByOrigin.delete(origin);

        if (!coalesced || coalesced.length === 0) return;

        for (const entry of coalesced) {
            await this._notifyTab(entry.tabId, "DAPP_PROVIDER_RESPONSE", {
                requestId: entry.requestId,
                ...responsePayload,
            });
        }
    }

    // ─── Chain ID resolution ──────────────────────────────────────────────────

    /**
     * Determines the active chainId for a given origin.
     * Priority: origin-specific permission → global active_chain_id → first supported chain.
     *
     * @param origin - dApp origin.
     * @returns The numeric chain ID to use.
     */
    private async _getActiveChainId(origin: string): Promise<number> {
        const permission = await this._getPermission(origin);
        if (permission?.chainId) return permission.chainId;

        const globalChainId = await this.browserApi.getStorageItem("active_chain_id");
        if (globalChainId && typeof globalChainId === "number") return globalChainId;

        return SUPPORTED_CHAINS[0].chainId;
    }

    /**
     * Resolves the chainId to use for a new connection request.
     * Honours the payload's explicit chainId, then the origin's preferred chain,
     * then falls back to the globally active chain.
     *
     * @param origin  - dApp origin.
     * @param payload - Connection request payload (may contain chainId).
     * @returns Numeric chain ID.
     */
    private async _resolveChainIdForConnect(origin: string, payload: any): Promise<number> {
        const activeChainId = await this._getActiveChainId(origin);

        if (payload?.chainId) {
            return typeof payload.chainId === "string"
                ? parseInt(payload.chainId, 16)
                : payload.chainId;
        }

        const preferredChainId = getPreferredChainIdForOrigin(origin);
        return preferredChainId ?? activeChainId;
    }

    // ─── Signing request helper ───────────────────────────────────────────────

    /**
     * Shared logic for transaction and message signing requests:
     * registers the request in memory + storage, then opens the signing approval UI.
     *
     * @param pendingRequest - The fully constructed pending request to register.
     */
    private async _registerAndShowSigningRequest(pendingRequest: PendingDappRequest): Promise<void> {
        this._addPendingRequest(pendingRequest);
        await this._persistPendingToStorage(pendingRequest.id, pendingRequest);
        await this._openApprovalUI("sign", pendingRequest.id, pendingRequest.tabId);
    }

    // ─── UI popup ─────────────────────────────────────────────────────────────

    /**
     * Opens the extension approval popup window for a given page (e.g. "connect", "sign").
     * Positions the popup at the top-right of the currently focused browser window.
     * On failure, sends an error back to the dApp tab and removes the pending request.
     *
     * @param page      - Route segment to open (e.g. "connect" → /dapp/connect?requestId=…).
     * @param requestId - The pending request ID embedded in the URL.
     * @param tabId     - Tab to notify if the popup can't be opened.
     */
    private async _openApprovalUI(page: string, requestId: string, tabId?: number): Promise<void> {
        const notifyError = (msg: string) => {
            void this._notifyTab(tabId, "DAPP_PROVIDER_RESPONSE", {
                requestId,
                error: { code: -32603, message: msg },
            });
            this._removePendingRequest(requestId);
        };

        try {
            const runtime = this.browserApi.runtime;
            if (!runtime) {
                notifyError("Extension runtime not available");
                return;
            }

            const extensionUrl = (runtime as any).getURL(`index.html#/dapp/${page}?requestId=${requestId}`);
            const { left, top } = await this._getPopupPosition();

            const createdWindow = await chrome.windows.create({
                url: extensionUrl,
                type: "popup",
                width: 440,
                height: 680,
                left,
                top,
                focused: true,
            });

            // Ensure the popup is in the foreground (handles rare cases where it opens behind).
            if (createdWindow?.id) {
                await chrome.windows.update(createdWindow.id, { focused: true });
            }
        } catch (error) {
            Logger.error("Error opening approval UI:", error);
            notifyError("Failed to open wallet approval window. Please try again.");
        }
    }

    /**
     * Calculates the pixel position for the approval popup.
     * Attempts to place it at the top-right of the last focused browser window.
     * Falls back to a sensible default if the window geometry is unavailable.
     *
     * @returns An object with `left` and `top` pixel offsets (both >= 0).
     */
    private async _getPopupPosition(): Promise<{ left: number; top: number }> {
        const defaults = { left: 400, top: 80 };

        try {
            const currentWindow = await chrome.windows.getLastFocused();
            if (currentWindow?.width && currentWindow.left !== undefined) {
                return {
                    left: Math.max(0, currentWindow.left + currentWindow.width - 450),
                    top: Math.max(0, currentWindow.top || defaults.top),
                };
            }
        } catch (error) {
            Logger.warn("Failed to get last focused window, using default popup position:", error);
        }

        return defaults;
    }

    // ─── Tab messaging ────────────────────────────────────────────────────────

    /**
     * Sends a message to a specific tab's content script.
     * No-ops silently if tabId is undefined.
     *
     * @param tabId   - Target tab ID.
     * @param type    - Message type (e.g. "DAPP_PROVIDER_RESPONSE").
     * @param payload - Message payload.
     * @returns true if the message was delivered, false otherwise.
     */
    private async _notifyTab(tabId: number | undefined, type: string, payload: any): Promise<boolean> {
        if (!tabId) return false;
        return this._waitForTabAndSendMessage(tabId, { type, payload });
    }

    /**
     * Broadcasts a message to all non-extension tabs.
     * Skips tabs without a content script silently.
     *
     * @param type    - Message type to broadcast.
     * @param payload - Message payload.
     */
    private async _broadcastToAllTabs(type: string, payload: any): Promise<void> {
        try {
            const tabs = this.browserApi.tabs as any;
            if (!tabs?.query || !tabs?.sendMessage) return;

            const allTabs = await tabs.query({});

            for (const tab of allTabs) {
                if (!tab.id || !tab.url || tab.url.startsWith("chrome-extension://")) continue;

                try {
                    await tabs.sendMessage(tab.id, { type, payload });
                } catch {
                    // Tab may not have the content script — ignore
                }
            }
        } catch (error) {
            Logger.error(`Error broadcasting ${type}:`, error);
        }
    }

    /**
     * Broadcasts a chainChanged event to all open tabs.
     *
     * @param chainId - Numeric chain ID that is now active.
     */
    private async _broadcastChainChanged(chainId: number): Promise<void> {
        await this._broadcastToAllTabs("DAPP_CHAIN_CHANGED", { chainId: chainIdToHex(chainId) });
    }

    /**
     * Attempts to send a message to a tab's content script, retrying with
     * exponential backoff for up to `timeoutMs` milliseconds.
     *
     * This is necessary because after a biometric auth or a long-running background
     * operation, the content script may need a moment to become ready.
     *
     * Retry schedule: 100ms → 200ms → 400ms → ... → capped at 5000ms.
     *
     * @param tabId     - Target tab ID.
     * @param message   - The message object to send.
     * @param timeoutMs - Total time budget for all retries (default: 60 s).
     * @returns true if the message was eventually delivered, false if timed out.
     */
    private async _waitForTabAndSendMessage(
        tabId: number,
        message: any,
        timeoutMs: number = TAB_MESSAGE_TIMEOUT_MS
    ): Promise<boolean> {
        const tabs = this.browserApi.tabs as any;
        if (!tabs?.sendMessage) return false;

        const deadline = Date.now() + timeoutMs;
        let delay = TAB_MESSAGE_INITIAL_DELAY_MS;
        let attempt = 0;

        while (Date.now() < deadline) {
            attempt++;

            try {
                await tabs.sendMessage(tabId, message);
                if (attempt > 1) {
                    Logger.info(`[DappHandler] Tab ${tabId} notified after ${attempt} attempt(s)`);
                }
                return true;
            } catch {
                const remaining = deadline - Date.now();
                if (remaining <= 0) break;

                const waitMs = Math.min(delay, remaining, TAB_MESSAGE_MAX_DELAY_MS);
                Logger.warn(
                    `[DappHandler] Tab ${tabId} not ready (attempt ${attempt}), retrying in ${waitMs}ms (${Math.round(remaining / 1000)}s left)`
                );
                await new Promise((resolve) => setTimeout(resolve, waitMs));
                delay = Math.min(delay * 2, TAB_MESSAGE_MAX_DELAY_MS);
            }
        }

        Logger.error("[DappHandler] Timed out trying to notify tab", { tabId, messageType: message?.type, attempts: attempt });
        return false;
    }

    // ─── Data model helpers ───────────────────────────────────────────────────

    /**
     * Returns the storage key for a given pending request ID.
     *
     * @param requestId - Request ID to build the key for.
     */
    private _getPendingStorageKey(requestId: string): string {
        return `${PENDING_REQUEST_STORAGE_PREFIX}${requestId}`;
    }

    /**
     * Safely extracts the hostname from an origin URL string.
     * Returns the raw string if URL parsing fails.
     *
     * @param origin - Origin URL (e.g. "https://app.uniswap.org").
     */
    private _getHostname(origin: string): string {
        try {
            return new URL(origin).hostname;
        } catch {
            return origin;
        }
    }

    /**
     * Converts a live PendingDappRequest into the StoredPendingDappRequest shape
     * that is written to chrome.storage.local (adds expiry timestamp, favicon, hostname).
     *
     * @param request - The request to serialize.
     */
    private _buildStoredPendingRequest(request: PendingDappRequest): StoredPendingDappRequest {
        const hostname = this._getHostname(request.origin);
        return {
            ...request,
            chainId: request.chainId || 1404,
            expiresAt: request.timestamp + request.timeoutMs,
            favicon: `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`,
            hostname,
            verifyStatus: "UNKNOWN",
        };
    }

    /**
     * Validates and normalizes a raw storage value into a StoredPendingDappRequest.
     * Applies safe defaults for missing/invalid fields so old storage formats are handled gracefully.
     * Returns null if the stored value is fundamentally invalid (missing origin).
     *
     * @param stored    - Raw value from chrome.storage.local.
     * @param requestId - Fallback ID if stored.id is missing.
     */
    private _normalizeStoredPendingRequest(stored: any, requestId: string): StoredPendingDappRequest | null {
        if (!stored || typeof stored !== "object" || !stored.origin) return null;

        const hostname = typeof stored.hostname === "string" && stored.hostname
            ? stored.hostname
            : this._getHostname(stored.origin);

        const timeoutMs = typeof stored.timeoutMs === "number" && stored.timeoutMs > 0
            ? stored.timeoutMs
            : DAPP_REQUEST_TIMEOUT_MS;

        const timestamp = typeof stored.timestamp === "number" && stored.timestamp > 0
            ? stored.timestamp
            : Date.now();

        const expiresAt = typeof stored.expiresAt === "number" && stored.expiresAt > 0
            ? stored.expiresAt
            : timestamp + timeoutMs;

        return {
            id: typeof stored.id === "string" && stored.id ? stored.id : requestId,
            type: stored.type || "DAPP_CONNECT",
            origin: stored.origin,
            tabId: typeof stored.tabId === "number" ? stored.tabId : undefined,
            method: stored.method || "eth_requestAccounts",
            params: stored.params,
            chainId: typeof stored.chainId === "number" ? stored.chainId : 1404,
            timestamp,
            timeoutMs,
            expiresAt,
            favicon: stored.favicon || `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`,
            hostname,
            verifyStatus: "UNKNOWN",
        };
    }

    /**
     * Returns true if a stored pending request has passed its expiry timestamp.
     *
     * @param request - The stored request to check.
     */
    private _isStoredPendingExpired(request: StoredPendingDappRequest): boolean {
        return request.expiresAt <= Date.now();
    }
}
