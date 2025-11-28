import { Browser, Tabs } from "webextension-polyfill";

import { AutofillMessage, DecryptionRequest, MessagePayload, MessageSender, SendResponse } from "@shared/types/autofill.types";
import { Logger } from "@extension-scripts/logger/logger.class";
import { BackgroundCredentialManager } from "./background-credential-manager";
import { BrowserApiUtil } from "./browser-api-util";

export class MessageHandler {
    private static instance: MessageHandler;

    private credentialManager: BackgroundCredentialManager;
    private pendingDecryptionRequests?: Map<string, number>;
    private pendingPopupRoute?: string;
    private pendingDecryptionData?: DecryptionRequest;

    public static getInstance(browserApi: BrowserApiUtil): MessageHandler {
        if (!MessageHandler.instance) {
            MessageHandler.instance = new MessageHandler(browserApi);
        }

        return MessageHandler.instance;
    }

    private constructor(private browserApi: BrowserApiUtil) {
        this.credentialManager = BackgroundCredentialManager.getInstance(this.browserApi);
    }

    private async _navigatePopupToRoute(route: string) {
        try {
            // For popup mode, we don't need to find a tab - the popup will handle navigation
            // The popup will check for pending decryption data and navigate accordingly
        } catch (error) {
            Logger.error("Error navigating popup to route:", error);
        }
    }

    private async _sendDecryptionDataToPopup() {
        try {
            if (!this.pendingDecryptionData) return;

            const runtime = this.browserApi.runtime;

            if (!runtime) return;

            try {
                await (runtime as any).sendMessage({
                    type: "PASSWORD_DECRYPTOR_DATA",
                    payload: this.pendingDecryptionData,
                });

                this.pendingDecryptionData = undefined;
            } catch (error) {
                Logger.error("MessageHandler: Error sending decryption data to popup:", error);
            }
        } catch (error) {
            Logger.error("MessageHandler: Error in sendDecryptionDataToPopup:", error);
        }
    }

    /**
     * Notify all content scripts that the service worker is ready
     * This is called when the extension UI is opened to ensure content scripts
     * know the service worker is available even if it didn't go through activation
     */
    private async _notifyContentScriptsServiceWorkerReady(): Promise<void> {
        try {
            if (!this.browserApi.has("tabs")) return;

            const tabsApi = this.browserApi.tabs as any;

            if (!tabsApi?.query) return;

            const tabs = await tabsApi.query({});

            let successCount = 0;

            for (const tab of tabs) {
                if (!tab.id || !tab.url || tab.url.startsWith("chrome-extension://")) continue;

                try {
                    if (!tabsApi?.sendMessage) continue;

                    await tabsApi.sendMessage(tab.id, {
                        type: "SERVICE_WORKER_READY",
                    });

                    successCount++;
                } catch (error) {
                    continue;
                }
            }
        } catch (error) {
            Logger.error("MessageHandler: Error notifying content scripts:", error);
        }
    }

    /**
     * Handle close popup request
     */
    private async _handleClosePopup(payload: MessagePayload, sender: MessageSender): Promise<void> {
        try {
            if (typeof chrome !== "undefined" && chrome.runtime) {
                chrome.runtime.sendMessage({
                    type: "CLOSE_POPUP",
                    payload: {},
                });
            } else {
                Logger.warn("MessageHandler: Chrome runtime not available for sending close message");
            }
        } catch (error) {
            Logger.error("MessageHandler: Error closing popup:", error);
        }
    }

    async handleAutofillMessage(
        message: { type: AutofillMessage["type"]; payload?: MessagePayload },
        sender: MessageSender,
        sendResponse: SendResponse
    ) {
        const timeout = setTimeout(() => {
            sendResponse({ success: false, error: "Request timeout" });
        }, 8000);

        try {
            switch (message.type) {
                case "GET_PASSWORDS":
                    const passwords = await this.credentialManager.getPasswords(message.payload?.website || "");

                    sendResponse({ success: true, data: passwords });

                    break;
                case "CREATE_PASSWORD":
                    await this._handleCreatePassword(message.payload || {}, sendResponse);

                    break;
                case "AUTHENTICATE":
                    await this._handleAuthenticate(sendResponse);

                    break;
                case "OPEN_BIOMETRICS_MODAL":
                    await this._handleOpenBiometricsModal();

                    sendResponse({ success: true });

                    break;
                case "OPEN_PASSWORD_DECRYPTOR":
                    await this._handleOpenPasswordDecryptor(message.payload || {}, sender);

                    sendResponse({ success: true });

                    break;
                case "SEND_DECRYPTION_DATA_TO_POPOUT":
                    await this._handleSendDecryptionDataToPopout(message.payload || {});

                    sendResponse({ success: true });

                    break;
                case "DECRYPTION_RESULT_FROM_POPOUT":
                    await this._handleDecryptionResultFromPopout(message.payload || {});

                    sendResponse({ success: true });

                    break;
                case "CLOSE_POPUP":
                    await this._handleClosePopup(message.payload || {}, sender);

                    sendResponse({ success: true });

                    break;
                case "POPUP_READY":
                    if (this.pendingPopupRoute) {
                        this._navigatePopupToRoute(this.pendingPopupRoute);

                        this.pendingPopupRoute = undefined;
                    }

                    if (this.pendingDecryptionData) {
                        this._sendDecryptionDataToPopup();
                    }

                    sendResponse({ success: true });

                    break;
                case "FILL_PASSWORD_FORM":
                    await this._handleFillPasswordForm(message.payload || {}, sender, sendResponse);

                    break;
                default:
                    sendResponse({ success: false, error: "Unknown message type [BACKGROUND SCRIPT]" });
            }

            clearTimeout(timeout);
        } catch (error) {
            clearTimeout(timeout);

            sendResponse({ success: false, error: (error as Error).message });
        }
    }

    private async _handleCreatePassword(payload: MessagePayload, sendResponse: SendResponse) {
        try {
            const urlInfo = payload?.urlInfo || null;
            const tab = (await this._openExtensionUI("zelf-keys/passwords/new")) as Tabs.Tab;

            if (tab) {
                await this._waitForTabAndSendMessage(tab.id as number, {
                    type: "CREATE_PASSWORD",
                    payload: { urlInfo },
                });

                this._notifyContentScriptsServiceWorkerReady();
            }

            sendResponse({ success: true });
        } catch (error) {
            sendResponse({ success: false, error: (error as Error).message });
        }
    }

    private async _handleAuthenticate(sendResponse: SendResponse) {
        try {
            const isAuthenticated = await this.credentialManager.isAuthenticated();

            sendResponse({ success: isAuthenticated });
        } catch (error) {
            sendResponse({ success: false, error: (error as Error).message });
        }
    }

    private async _handleOpenBiometricsModal(): Promise<void> {
        try {
            await this._openExtensionUI("biometrics");

            this._notifyContentScriptsServiceWorkerReady();
        } catch (error) {
            Logger.error("Error opening biometrics modal:", error);
        }
    }

    private async _handleOpenPasswordDecryptor(payload: MessagePayload, sender: MessageSender) {
        try {
            const tabId = await this._openExtensionUI("popout-decryptor");

            if (tabId) {
                this.pendingDecryptionRequests = this.pendingDecryptionRequests || new Map();

                if (payload.requestId && sender.tab?.id) {
                    this.pendingDecryptionRequests.set(payload.requestId, sender.tab.id);
                }

                this._notifyContentScriptsServiceWorkerReady();
            } else {
                Logger.error("MessageHandler: Failed to open password decryptor popout");
            }
        } catch (error) {
            Logger.error("MessageHandler: Error opening password decryptor:", error);
        }
    }

    private async _handleSendDecryptionDataToPopout(payload: MessagePayload): Promise<void> {
        try {
            if (!payload.requestId || !payload.publicData) throw new Error("Invalid payload for decryption data");

            this.pendingDecryptionData = payload as DecryptionRequest;
        } catch (error) {
            Logger.error("MessageHandler: Error sending decryption data to popout:", error);
        }
    }

    private async _handleDecryptionResultFromPopout(payload: MessagePayload): Promise<void> {
        try {
            const originalTabId = payload.requestId ? this.pendingDecryptionRequests?.get(payload.requestId) : undefined;

            if (originalTabId) {
                await this._sendDecryptionResultToTab(originalTabId, payload.result);

                this._cleanupDecryptionRequest(payload.requestId);
            } else {
                Logger.error("MessageHandler: No original tab ID found for request:", payload.requestId);
            }
        } catch (error) {
            Logger.error("Error handling decryption result from popout:", error);
        }
    }

    private async _openExtensionUI(page: string): Promise<Tabs.Tab | number | null> {
        try {
            const runtime = this.browserApi.runtime;

            if (!runtime) {
                Logger.error("Runtime API not available");
                return null;
            }

            if (page === "popout-decryptor") {
                this.pendingPopupRoute = page;

                return await this._openPopup();
            }

            return await this._openAsTab(runtime, page);
        } catch (error) {
            Logger.error("Error opening extension UI:", error);
            return null;
        }
    }

    private async _waitForTabAndSendMessage(tabId: number, message: any, maxRetries: number = 20, retryDelay: number = 500) {
        const tabs = this.browserApi.tabs as Browser["tabs"];

        if (!tabs) {
            Logger.error("Tabs API not available");
            return;
        }

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                await tabs.sendMessage(tabId, { type: "PING" });
                await tabs.sendMessage(tabId, message);

                return;
            } catch (error) {
                if (attempt === maxRetries) {
                    Logger.error("Max retries reached, failed to send message to tab", tabId);
                    return;
                }

                await new Promise((resolve) => setTimeout(resolve, retryDelay));
            }
        }
    }

    private async _sendDecryptionResultToTab(tabId: number, result: any): Promise<void> {
        const tabs = this.browserApi.tabs;

        if (!tabs) {
            Logger.error("Tabs API not available");
            return;
        }

        await (tabs as any).sendMessage(tabId, {
            type: "DECRYPTION_RESULT",
            payload: result,
        });
    }

    private _cleanupDecryptionRequest(requestId?: string): void {
        if (!requestId) return;

        this.pendingDecryptionRequests?.delete(requestId);
    }

    private async _openPopup(): Promise<number | null> {
        const action = this.browserApi.action;

        if (!action) {
            Logger.error("Action API not available");
            return null;
        }

        try {
            await (action as any).openPopup();

            return -1;
        } catch (popupError: any) {
            Logger.error("Failed to open popup:", popupError);

            return null;
        }
    }

    private async _openAsTab(runtime: any, page: string): Promise<any | null> {
        const extensionUrl = runtime.getURL(`index.html#/${page}`);
        const tabs = this.browserApi.tabs;

        if (!tabs) {
            Logger.error("Tabs API not available");

            return null;
        }

        const newTab = await (tabs as any).create({
            url: extensionUrl,
            active: true,
        });

        return newTab;
    }

    private async _handleFillPasswordForm(payload: MessagePayload, sender: MessageSender, sendResponse: SendResponse): Promise<void> {
        try {
            if (!sender.tab?.id) throw new Error("No tab ID provided for form wait request");

            const tabs = this.browserApi.tabs;

            if (!tabs) throw new Error("Tabs API not available");

            await (tabs as any).sendMessage(sender.tab.id, {
                type: "FILL_PASSWORD_FORM",
                payload,
            });

            sendResponse({ success: true });
        } catch (error) {
            Logger.error("MessageHandler: Error handling wait for form ready:", error);

            sendResponse({ success: false, error: (error as Error).message });
        }
    }
}
