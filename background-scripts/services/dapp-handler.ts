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
} from "@shared/types/dapp.types";
import { getPreferredChainIdForOrigin } from "@shared/services/dapp-mapping.service";

const DAPP_REQUEST_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
const PERMISSIONS_STORAGE_KEY = "dapp_permissions";

export class DappHandler {
    private static instance: DappHandler;
    private pendingRequests: Map<string, PendingDappRequest> = new Map();
    private timeoutHandles: Map<string, ReturnType<typeof setTimeout>> = new Map();

    public static getInstance(browserApi: BrowserApiUtil): DappHandler {
        if (!DappHandler.instance) {
            DappHandler.instance = new DappHandler(browserApi);
        }

        return DappHandler.instance;
    }

    private constructor(private browserApi: BrowserApiUtil) {}

    async handleDappMessage(
        message: DappMessage,
        sender: { tab?: { id?: number; url?: string } },
        sendResponse: (response: any) => void
    ): Promise<void> {
        const { type, payload, requestId, origin } = message;
        const senderOrigin = origin || (sender.tab?.url ? new URL(sender.tab.url).origin : "");

        try {
            switch (type) {
                case "DAPP_REQUEST_ACCOUNTS":
                case "DAPP_CONNECT":
                    await this._handleConnectionRequest(requestId, senderOrigin, payload, sender.tab?.id);
                    sendResponse({ success: true, pending: true });
                    break;

                case "DAPP_GET_ACCOUNTS":
                    await this._handleGetAccounts(senderOrigin, sendResponse);
                    break;

                case "DAPP_SEND_TRANSACTION":
                case "DAPP_SIGN_TRANSACTION":
                    await this._handleSignTransaction(requestId, senderOrigin, payload, sender.tab?.id);
                    sendResponse({ success: true, pending: true });
                    break;

                case "DAPP_SIGN_MESSAGE":
                    await this._handleSignMessage(requestId, senderOrigin, payload, sender.tab?.id);
                    sendResponse({ success: true, pending: true });
                    break;

                case "DAPP_SWITCH_CHAIN":
                    await this._handleSwitchChain(requestId, senderOrigin, payload, sendResponse);
                    break;

                case "DAPP_ADD_CHAIN":
                    this._handleAddChain(payload, sendResponse);
                    break;

                case "DAPP_CHAIN_ID":
                    await this._handleGetChainId(senderOrigin, sendResponse);
                    break;

                case "DAPP_DISCONNECT":
                    await this._handleDisconnect(senderOrigin, sendResponse);
                    break;

                case "DAPP_GET_PENDING":
                    this._handleGetPending(requestId, sendResponse);
                    break;

                case "DAPP_APPROVAL_RESULT":
                    await this._handleApprovalResult(payload);
                    sendResponse({ success: true });
                    break;

                case "DAPP_SIGNING_RESULT":
                    await this._handleSigningResult(payload);
                    sendResponse({ success: true });
                    break;

                case "DAPP_CLEANUP_REQUESTS":
                    await this._handleCleanupRequests(sendResponse);
                    break;

                case "DAPP_CANCEL_PENDING_FOR_ORIGIN":
                    await this._handleCancelPendingForOrigin(senderOrigin, sendResponse);
                    break;

                case "DAPP_FORCE_DISCONNECT_SITE":
                    await this._handleForceDisconnectSite(payload?.origin, sendResponse);
                    break;

                case "DAPP_FORCE_DISCONNECT_ALL":
                    await this._handleForceDisconnectAll(sendResponse);
                    break;

                default:
                    sendResponse({ success: false, error: `Unknown dApp message type: ${type}` });
            }
        } catch (error) {
            Logger.error(`DappHandler error for ${type}:`, error);
            sendResponse({ success: false, error: (error as Error).message });
        }
    }

    getPendingRequest(requestId: string): PendingDappRequest | undefined {
        return this.pendingRequests.get(requestId);
    }

    getAllPendingRequests(): PendingDappRequest[] {
        return Array.from(this.pendingRequests.values());
    }

    private async _getActiveChainId(origin: string): Promise<number> {
        const permission = await this._getPermission(origin);
        if (permission?.chainId) return permission.chainId;

        const globalChainId = await this.browserApi.getStorageItem("active_chain_id");
        if (globalChainId && typeof globalChainId === "number") return globalChainId;

        return SUPPORTED_CHAINS[0].chainId;
    }

    private async _handleConnectionRequest(requestId: string, origin: string, payload: any, tabId?: number): Promise<void> {
        const existingPermission = await this._getPermission(origin);

        // If method is explicitly wallet_requestPermissions, bypass the cache and force the UI
        const isRequestPermissions = payload?.method === "wallet_requestPermissions";

        if (existingPermission && existingPermission.accounts.length > 0 && !isRequestPermissions) {
            this._resolveRequest(requestId, existingPermission.accounts);
            await this._notifyTab(tabId, "DAPP_PROVIDER_RESPONSE", {
                requestId,
                result: existingPermission.accounts,
            });
            return;
        }

        let hostname = "";
        try {
            hostname = new URL(origin).hostname;
        } catch {
            hostname = origin;
        }

        const activeChainId = await this._getActiveChainId(origin);
        let chainId = payload?.chainId ? (typeof payload.chainId === "string" ? parseInt(payload.chainId, 16) : payload.chainId) : activeChainId;

        // Smart default for known dApps (e.g., core.app -> Avalanche, Zelf/nft -> BlockDAG)
        if (!payload?.chainId) {
            const preferredChainId = getPreferredChainIdForOrigin(origin);
            if (preferredChainId) {
                chainId = preferredChainId;
            }
        }

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

        await this.browserApi.setStorageItem(`pending_dapp_request_${requestId}`, {
            origin,
            hostname,
            favicon: `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`,
            chainId,
            verifyStatus: "UNKNOWN",
            method: "eth_requestAccounts",
        });

        await this._openApprovalUI("connect", requestId, tabId);
    }

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

    private async _handleSignTransaction(requestId: string, origin: string, payload: any, tabId?: number): Promise<void> {
        const permission = await this._getPermission(origin);

        if (!permission || permission.accounts.length === 0) {
            await this._notifyTab(tabId, "DAPP_PROVIDER_RESPONSE", {
                requestId,
                error: { code: 4100, message: "Unauthorized - connect wallet first" },
            });
            return;
        }

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

        this._addPendingRequest(pendingRequest);
        await this._persistPendingToStorage(requestId, pendingRequest);
        await this._openApprovalUI("sign", requestId, tabId);
    }

    private async _handleSignMessage(requestId: string, origin: string, payload: any, tabId?: number): Promise<void> {
        const permission = await this._getPermission(origin);

        if (!permission || permission.accounts.length === 0) {
            await this._notifyTab(tabId, "DAPP_PROVIDER_RESPONSE", {
                requestId,
                error: { code: 4100, message: "Unauthorized - connect wallet first" },
            });
            return;
        }

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

        this._addPendingRequest(pendingRequest);
        await this._persistPendingToStorage(requestId, pendingRequest);
        await this._openApprovalUI("sign", requestId, tabId);
    }

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

    private async _handleGetChainId(origin: string, sendResponse: (response: any) => void): Promise<void> {
        const chainId = await this._getActiveChainId(origin);
        sendResponse({ success: true, data: chainIdToHex(chainId) });
    }

    private async _handleDisconnect(origin: string, sendResponse: (response: any) => void): Promise<void> {
        await this._removePermission(origin);
        sendResponse({ success: true });
    }

    private async _handleGetPending(requestId: string, sendResponse: (response: any) => void): Promise<void> {
        const pending = this.pendingRequests.get(requestId);
        if (!pending) {
            sendResponse({ success: false, error: "No pending request found" });
            return;
        }

        let hostname = "";
        try {
            hostname = new URL(pending.origin).hostname;
        } catch {
            hostname = pending.origin;
        }

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

    private async _handleApprovalResult(payload: any): Promise<void> {
        const { requestId, approved, accounts, chainId } = payload;
        const pending = this.pendingRequests.get(requestId);

        if (!pending) return;

        if (approved && accounts) {
            await this._savePermission({
                origin: pending.origin,
                accounts,
                chainId: chainId || 1404,
                connectedAt: Date.now(),
                lastUsed: Date.now(),
            });
        }

        if (pending.tabId) {
            try {
                const tabs = this.browserApi.tabs as any;
                if (tabs?.update) {
                    await tabs.update(pending.tabId, { active: true });
                }
            } catch {
                // Tab may have been closed; continue with notify
            }
        }

        if (approved && accounts) {
            await this._notifyTab(pending.tabId, "DAPP_PROVIDER_RESPONSE", {
                requestId,
                result: accounts,
            });
        } else {
            await this._notifyTab(pending.tabId, "DAPP_PROVIDER_RESPONSE", {
                requestId,
                error: { code: 4001, message: "User rejected the request" },
            });
        }

        this._removePendingRequest(requestId);
    }

    private async _handleSigningResult(payload: any): Promise<void> {
        const { requestId, result, error } = payload;
        const pending = this.pendingRequests.get(requestId);

        if (!pending) return;

        if (result) {
            await this._notifyTab(pending.tabId, "DAPP_PROVIDER_RESPONSE", { requestId, result });
        } else {
            await this._notifyTab(pending.tabId, "DAPP_PROVIDER_RESPONSE", {
                requestId,
                error: error || { code: 4001, message: "User rejected the request" },
            });
        }

        this._removePendingRequest(requestId);
    }

    private _addPendingRequest(request: PendingDappRequest): void {
        this.pendingRequests.set(request.id, request);

        const timeout = setTimeout(() => {
            const pending = this.pendingRequests.get(request.id);
            if (pending) {
                this._notifyTab(pending.tabId, "DAPP_PROVIDER_RESPONSE", {
                    requestId: request.id,
                    error: { code: -32000, message: "Request timed out" },
                });
                this._removePendingRequest(request.id);
            }
        }, request.timeoutMs);

        this.timeoutHandles.set(request.id, timeout);
    }

    private _removePendingRequest(requestId: string): void {
        this.pendingRequests.delete(requestId);
        const timeout = this.timeoutHandles.get(requestId);
        if (timeout) {
            clearTimeout(timeout);
            this.timeoutHandles.delete(requestId);
        }
        this.browserApi.setStorageItem(`pending_dapp_request_${requestId}`, null).catch(() => {});
    }

    private async _persistPendingToStorage(requestId: string, request: PendingDappRequest): Promise<void> {
        let hostname = "";
        try {
            hostname = new URL(request.origin).hostname;
        } catch {
            hostname = request.origin;
        }

        await this.browserApi.setStorageItem(`pending_dapp_request_${requestId}`, {
            origin: request.origin,
            hostname,
            favicon: `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`,
            chainId: request.chainId || 1404,
            verifyStatus: "UNKNOWN",
            method: request.method,
            params: request.params,
        });
    }

    private _resolveRequest(requestId: string, result: any): void {
        const pending = this.pendingRequests.get(requestId);
        if (pending?.resolve) {
            pending.resolve(result);
        }
        this._removePendingRequest(requestId);
    }

    private async _getPermission(origin: string): Promise<DappPermission | null> {
        try {
            const permissions = await this.browserApi.getStorageItem(PERMISSIONS_STORAGE_KEY);
            if (!permissions) return null;
            return permissions[origin] || null;
        } catch {
            return null;
        }
    }

    private async _savePermission(permission: DappPermission): Promise<void> {
        try {
            const permissions = (await this.browserApi.getStorageItem(PERMISSIONS_STORAGE_KEY)) || {};
            permissions[permission.origin] = permission;
            await this.browserApi.setStorageItem(PERMISSIONS_STORAGE_KEY, permissions);
        } catch (error) {
            Logger.error("Error saving dApp permission:", error);
        }
    }

    private async _removePermission(origin: string): Promise<void> {
        try {
            const permissions = (await this.browserApi.getStorageItem(PERMISSIONS_STORAGE_KEY)) || {};
            delete permissions[origin];
            await this.browserApi.setStorageItem(PERMISSIONS_STORAGE_KEY, permissions);
        } catch (error) {
            Logger.error("Error removing dApp permission:", error);
        }
    }

    private async _notifyTab(tabId: number | undefined, type: string, payload: any): Promise<void> {
        if (!tabId) return;

        try {
            const tabs = this.browserApi.tabs as any;
            if (!tabs?.sendMessage) return;

            await tabs.sendMessage(tabId, { type, payload });
        } catch (error) {
            Logger.error("Error notifying tab:", error);
        }
    }

    private async _broadcastChainChanged(chainId: number): Promise<void> {
        try {
            const tabs = this.browserApi.tabs as any;
            if (!tabs?.query) return;

            const allTabs = await tabs.query({});
            const hexChainId = chainIdToHex(chainId);

            for (const tab of allTabs) {
                if (!tab.id || !tab.url || tab.url.startsWith("chrome-extension://")) continue;

                try {
                    await tabs.sendMessage(tab.id, {
                        type: "DAPP_CHAIN_CHANGED",
                        payload: { chainId: hexChainId },
                    });
                } catch {
                    // Tab may not have content script
                }
            }
        } catch (error) {
            Logger.error("Error broadcasting chain change:", error);
        }
    }

    async broadcastAccountsChanged(accounts: string[]): Promise<void> {
        try {
            const tabs = this.browserApi.tabs as any;
            if (!tabs?.query) return;

            const allTabs = await tabs.query({});

            for (const tab of allTabs) {
                if (!tab.id || !tab.url || tab.url.startsWith("chrome-extension://")) continue;

                try {
                    await tabs.sendMessage(tab.id, {
                        type: "DAPP_ACCOUNTS_CHANGED",
                        payload: { accounts },
                    });
                } catch {
                    // Tab may not have content script
                }
            }
        } catch (error) {
            Logger.error("Error broadcasting accounts change:", error);
        }
    }

    async broadcastAccountsChangedByOrigin(targetOrigin: string, accounts: string[]): Promise<void> {
        try {
            const tabs = this.browserApi.tabs as any;
            if (!tabs?.query) return;

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
                    // Ignore URL parsing errors or content script missing
                }
            }
        } catch (error) {
            Logger.error(`Error broadcasting accounts change for origin ${targetOrigin}:`, error);
        }
    }

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

    private async _handleCleanupRequests(sendResponse: (response: any) => void): Promise<void> {
        try {
            const allItems = await this.browserApi.getAllStorageItems();
            const keysToRemove: string[] = [];

            for (const key of Object.keys(allItems)) {
                if (key.startsWith("pending_dapp_request_")) {
                    const requestId = key.replace("pending_dapp_request_", "");
                    if (!this.pendingRequests.has(requestId)) {
                        keysToRemove.push(key);
                    }
                }
            }

            if (keysToRemove.length > 0) {
                Logger.info(`[Dapp Cleanup] Found ${keysToRemove.length} orphaned dapp requests in chrome.storage.local. Removing:`, keysToRemove);
                await this.browserApi.removeStorageItems(keysToRemove);
                Logger.info(`[Dapp Cleanup] Successfully cleaned up ${keysToRemove.length} orphaned internal requests.`);
            } else {
                Logger.info(`[Dapp Cleanup] No orphaned dapp requests found in chrome.storage.local.`);
            }

            sendResponse({ success: true, removedCount: keysToRemove.length });
        } catch (error) {
            Logger.error("[Dapp Cleanup] Failed to cleanup dapp requests:", error);
            sendResponse({ success: false, error: (error as Error).message });
        }
    }

    private async _handleForceDisconnectSite(origin: string, sendResponse: (response: any) => void): Promise<void> {
        if (!origin) {
            sendResponse({ success: false, error: "Origin is required" });

            return;
        }

        try {
            await this._removePermission(origin);

            // Broadcast the disconnect event back to the specific dApp
            await this.broadcastAccountsChangedByOrigin(origin, []);

            sendResponse({ success: true });
        } catch (error) {
            Logger.error("Failed to force disconnect site:", error);
            sendResponse({ success: false, error: (error as Error).message });
        }
    }

    private async _handleForceDisconnectAll(sendResponse: (response: any) => void): Promise<void> {
        try {
            await this.browserApi.setStorageItem(PERMISSIONS_STORAGE_KEY, {});

            // Broadcast the empty accounts to all connected dApps
            await this.broadcastAccountsChanged([]);

            sendResponse({ success: true });
        } catch (error) {
            Logger.error("Failed to force disconnect all sites:", error);
            sendResponse({ success: false, error: (error as Error).message });
        }
    }

    private async _openApprovalUI(page: string, requestId: string, tabId?: number): Promise<void> {
        const notifyError = (msg: string) => {
            this._notifyTab(tabId, "DAPP_PROVIDER_RESPONSE", {
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

            // Close any existing dapp approval windows to avoid stale requestIds and hidden popups
            try {
                const windows = await chrome.windows.getAll({ populate: true });
                const dappPattern = "#/dapp/";
                for (const win of windows) {
                    const tabs = win.tabs || [];
                    const hasDappTab = tabs.some((t: { url?: string }) => t?.url?.includes(dappPattern));
                    if (hasDappTab && win.id) {
                        await chrome.windows.remove(win.id);
                    }
                }
            } catch (err) {
                Logger.warn("Failed to close existing dapp windows:", err);
            }

            // Calculate position to open at the top-right of the current screen/window
            let left = 400;
            let top = 80;

            try {
                const currentWindow = await chrome.windows.getLastFocused();
                if (currentWindow && currentWindow.width && currentWindow.left !== undefined) {
                    left = currentWindow.left + currentWindow.width - 450;
                    top = currentWindow.top || 80;
                }
            } catch (error) {
                Logger.warn("Failed to get last focused window, using default position:", error);
            }

            const createdWindow = await chrome.windows.create({
                url: extensionUrl,
                type: "popup",
                width: 440,
                height: 680,
                left: Math.max(0, left),
                top: Math.max(0, top),
                focused: true,
            });

            // Ensure popup is focused and visible (handles edge cases where it opens behind)
            if (createdWindow?.id) {
                await chrome.windows.update(createdWindow.id, { focused: true });
            }
        } catch (error) {
            Logger.error("Error opening approval UI:", error);
            notifyError("Failed to open wallet approval window. Please try again.");
        }
    }
}
