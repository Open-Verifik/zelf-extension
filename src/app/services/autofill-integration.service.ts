import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { AutofillMessage, AutofillResponse, MessageSender, SendResponse, UrlInfo } from "@shared/types/autofill.types";
import { AutofillDataService, AutofillUrlInfo } from "./autofill-data.service";
import { PopoutCommunicationService, PopoutDecryptionData } from "./popout-communication.service";

@Injectable({
    providedIn: "root",
})
export class AutofillIntegrationService {
    private isListening = false;
    private pendingFillData = new Map<number, any>();

    constructor(
        private _autofillDataService: AutofillDataService,
        private _popoutCommunicationService: PopoutCommunicationService,
        private _router: Router
    ) {
        this._setupMessageListener();
    }

    private _setupMessageListener(): void {
        if (this.isListening) return;

        if (typeof chrome !== "undefined" && chrome.runtime) {
            chrome.runtime.onMessage.addListener((message: any, sender: MessageSender, sendResponse: SendResponse) => {
                const willHandle = this._handleMessage(message, sender, sendResponse);

                // Only return true if we're handling the message (to keep channel open for async)
                // If we return false/undefined, the message can be handled by other listeners (background script)
                return willHandle;
            });
        }

        this.isListening = true;
    }

    private _handleMessage(message: any, sender: MessageSender, sendResponse: SendResponse): boolean {
        // Only handle messages intended for the extension page
        // Messages from content scripts (sender.tab exists) should go to background script
        // Messages from background (no sender.tab) might be for extension page
        const isFromContentScript = sender.tab !== undefined;
        const extensionPageMessageTypes = ["PING", "CREATE_PASSWORD", "AUTOFILL_CREATE_PASSWORD_DATA", "PASSWORD_DECRYPTOR_DATA"];

        // If message is from content script and not an extension page message type, don't handle it
        // This allows the background script to receive it
        if (isFromContentScript && !extensionPageMessageTypes.includes(message.type)) return false;

        try {
            switch (message.type) {
                case "PING":
                    sendResponse({ success: true });

                    return true;
                case "CREATE_PASSWORD":
                    this._handleCreatePassword(message.payload, sendResponse);

                    return true;
                case "AUTOFILL_CREATE_PASSWORD_DATA":
                    this._handleAutofillCreatePasswordData(message.payload, sendResponse);

                    return true;
                case "PASSWORD_DECRYPTOR_DATA":
                    this._handlePasswordDecryptorData(message.payload, sendResponse);

                    return true;
                default:
                    return false;
            }
        } catch (error) {
            console.error("Error handling autofill message:", error);

            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

            sendResponse({ success: false, error: errorMessage });

            return true;
        }
    }

    private _handleAutofillCreatePasswordData(payload: { urlInfo: any }, sendResponse: SendResponse): void {
        try {
            this._autofillDataService.setUrlInfo(payload.urlInfo);

            sendResponse({ success: true });
        } catch (error) {
            console.error("Error handling autofill create password data:", error);

            const errorMessage = error instanceof Error ? error.message : "Failed to handle autofill data";

            sendResponse({ success: false, error: errorMessage });
        }
    }

    private _handleCreatePassword(payload: { urlInfo: UrlInfo }, sendResponse: SendResponse): void {
        try {
            this._autofillDataService.setUrlInfo(payload.urlInfo as AutofillUrlInfo);

            sendResponse({ success: true });
        } catch (error) {
            console.error("Error handling create password:", error);

            const errorMessage = error instanceof Error ? error.message : "Failed to handle create password";

            sendResponse({ success: false, error: errorMessage });
        }
    }

    private _handlePasswordDecryptorData(payload: PopoutDecryptionData, sendResponse: SendResponse): void {
        try {
            this._popoutCommunicationService.setDecryptionData(payload);

            this._router.navigateByUrl("/popout-decryptor", { replaceUrl: true });

            sendResponse({ success: true });
        } catch (error) {
            console.error("Error handling password decryptor data:", error);

            const errorMessage = error instanceof Error ? error.message : "Failed to handle password decryptor data";

            sendResponse({ success: false, error: errorMessage });
        }
    }

    public async sendMessageToContentScript(message: AutofillMessage): Promise<AutofillResponse> {
        return new Promise((resolve, reject) => {
            if (typeof chrome !== "undefined" && chrome.runtime) {
                chrome.runtime.sendMessage(message, (response: AutofillResponse) => {
                    if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
                    else resolve(response);
                });
            } else {
                reject(new Error("Chrome extension runtime not available"));
            }
        });
    }

    public async waitForFormAndFill(tabId: number, fillData: any): Promise<void> {
        try {
            this.pendingFillData.set(tabId, fillData);

            if (typeof chrome === "undefined" || !chrome.tabs) {
                throw new Error("Chrome tabs API not available");
            }

            try {
                await chrome.scripting.executeScript({
                    target: { tabId },
                    files: ["autofill.js"],
                });
            } catch (error) {
                console.error("Content script might already be loaded:", error);
            }

            await new Promise((resolve) => setTimeout(resolve, 500));

            let attempts = 0;

            const maxAttempts = 3;
            const retryDelay = 1000; // 1 second between attempts

            while (attempts < maxAttempts) {
                try {
                    await chrome.tabs.sendMessage(tabId, {
                        type: "FILL_PASSWORD_FORM",
                        payload: { tabId, fillData },
                    });

                    this.pendingFillData.delete(tabId);
                    return;
                } catch (error) {
                    attempts++;

                    if (attempts === maxAttempts) throw error;

                    await new Promise((resolve) => setTimeout(resolve, retryDelay));
                }
            }
        } catch (error) {
            this.pendingFillData.delete(tabId);
            console.error("Error waiting for form and filling:", error);

            throw error;
        }
    }
}
