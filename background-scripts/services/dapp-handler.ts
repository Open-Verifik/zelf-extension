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

                case "DAPP_APPROVAL_RESULT":
                    this._handleApprovalResult(payload);
                    sendResponse({ success: true });
                    break;

                case "DAPP_SIGNING_RESULT":
                    this._handleSigningResult(payload);
                    sendResponse({ success: true });
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

    private async _handleConnectionRequest(requestId: string, origin: string, payload: any, tabId?: number): Promise<void> {
        const existingPermission = await this._getPermission(origin);

        if (existingPermission && existingPermission.accounts.length > 0) {
            this._resolveRequest(requestId, existingPermission.accounts);
            await this._notifyTab(tabId, "DAPP_PROVIDER_RESPONSE", {
                requestId,
                result: existingPermission.accounts,
            });
            return;
        }

        const pendingRequest: PendingDappRequest = {
            id: requestId,
            type: "DAPP_CONNECT",
            origin,
            tabId,
            method: "eth_requestAccounts",
            params: payload,
            timestamp: Date.now(),
            timeoutMs: DAPP_REQUEST_TIMEOUT_MS,
        };

        this._addPendingRequest(pendingRequest);
        await this._openApprovalUI("connect", requestId);
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

        const pendingRequest: PendingDappRequest = {
            id: requestId,
            type: "DAPP_SIGN_TRANSACTION",
            origin,
            tabId,
            method: payload?.method || "eth_sendTransaction",
            params: payload?.params || payload,
            chainId: payload?.chainId,
            timestamp: Date.now(),
            timeoutMs: DAPP_REQUEST_TIMEOUT_MS,
        };

        this._addPendingRequest(pendingRequest);
        await this._openApprovalUI("sign", requestId);
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

        const pendingRequest: PendingDappRequest = {
            id: requestId,
            type: "DAPP_SIGN_MESSAGE",
            origin,
            tabId,
            method: payload?.method || "personal_sign",
            params: payload?.params || payload,
            timestamp: Date.now(),
            timeoutMs: DAPP_REQUEST_TIMEOUT_MS,
        };

        this._addPendingRequest(pendingRequest);
        await this._openApprovalUI("sign", requestId);
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
        const permission = await this._getPermission(origin);
        const chainId = permission?.chainId || 1404; // Default to BlockDAG

        sendResponse({ success: true, data: chainIdToHex(chainId) });
    }

    private async _handleDisconnect(origin: string, sendResponse: (response: any) => void): Promise<void> {
        await this._removePermission(origin);
        sendResponse({ success: true });
    }

    private _handleApprovalResult(payload: any): void {
        const { requestId, approved, accounts, chainId } = payload;
        const pending = this.pendingRequests.get(requestId);

        if (!pending) return;

        if (approved && accounts) {
            this._savePermission({
                origin: pending.origin,
                accounts,
                chainId: chainId || 1404,
                connectedAt: Date.now(),
                lastUsed: Date.now(),
            });

            this._notifyTab(pending.tabId, "DAPP_PROVIDER_RESPONSE", {
                requestId,
                result: accounts,
            });
        } else {
            this._notifyTab(pending.tabId, "DAPP_PROVIDER_RESPONSE", {
                requestId,
                error: { code: 4001, message: "User rejected the request" },
            });
        }

        this._removePendingRequest(requestId);
    }

    private _handleSigningResult(payload: any): void {
        const { requestId, result, error } = payload;
        const pending = this.pendingRequests.get(requestId);

        if (!pending) return;

        if (result) {
            this._notifyTab(pending.tabId, "DAPP_PROVIDER_RESPONSE", { requestId, result });
        } else {
            this._notifyTab(pending.tabId, "DAPP_PROVIDER_RESPONSE", {
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

    private async _openApprovalUI(page: string, requestId: string): Promise<void> {
        try {
            const runtime = this.browserApi.runtime;
            if (!runtime) return;

            const extensionUrl = (runtime as any).getURL(`index.html#/dapp/${page}?requestId=${requestId}`);
            const tabs = this.browserApi.tabs;

            if (!tabs) return;

            await (tabs as any).create({
                url: extensionUrl,
                active: true,
            });
        } catch (error) {
            Logger.error("Error opening approval UI:", error);
        }
    }
}
