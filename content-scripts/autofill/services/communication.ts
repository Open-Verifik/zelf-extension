import { AutofillMessage, AutofillResponse, DecryptedPasswordData, DetectedForm, PasswordEntry } from "@shared/types/autofill.types";
import { Logger } from "@extension-scripts/logger/logger.class";
import { FormDetector } from "./form-detector";

// Chrome extension API declaration
declare const chrome: any;

export class CommunicationService {
    private static instance: CommunicationService;
    private serviceWorkerReadyCallbacks: (() => void)[] = [];
    private formDetector: FormDetector;

    public static getInstance(): CommunicationService {
        if (!CommunicationService.instance) CommunicationService.instance = new CommunicationService();

        return CommunicationService.instance;
    }

    private constructor() {
        this.formDetector = new FormDetector();
    }

    public async getPasswords(website: string): Promise<PasswordEntry[]> {
        try {
            const response: AutofillResponse = await this.sendMessage({
                type: "GET_PASSWORDS",
                payload: { website },
            });

            if (response.success && response.data) {
                return response.data as PasswordEntry[];
            }

            return [];
        } catch (error) {
            Logger.error("Error fetching passwords:", error);
            return [];
        }
    }

    public async decryptPassword(requestId: string): Promise<DecryptedPasswordData | null> {
        try {
            const response: AutofillResponse = await this.sendMessage({
                type: "DECRYPT_PASSWORD",
                payload: { requestId },
            });

            if (response.success && response.data) {
                return response.data as DecryptedPasswordData;
            }
            return null;
        } catch (error) {
            Logger.error("Error decrypting password:", error);
            return null;
        }
    }

    public async createPassword(urlInfo?: any): Promise<void> {
        try {
            await this.sendMessage({
                type: "CREATE_PASSWORD",
                payload: { urlInfo },
            });
        } catch (error) {
            Logger.error("Error opening create password:", error);
        }
    }

    public async authenticate(): Promise<boolean> {
        try {
            const response: AutofillResponse = await this.sendMessage({
                type: "AUTHENTICATE",
                payload: {},
            });

            return response.success;
        } catch (error) {
            Logger.error("Error authenticating:", error);
            return false;
        }
    }

    public sendMessage(message: AutofillMessage): Promise<AutofillResponse> {
        return new Promise((resolve, reject) => {
            Logger.log("Sending message to background script:", message);

            if (typeof chrome !== "undefined" && chrome.runtime) {
                const timeout = setTimeout(() => {
                    Logger.error("Message timeout after 10 seconds");

                    reject(new Error("Message timeout - background script did not respond"));
                }, 10000);

                chrome.runtime.sendMessage(message, (response: any) => {
                    clearTimeout(timeout);

                    Logger.log("Received response from background script:", response);

                    if (chrome.runtime.lastError) {
                        Logger.error("Chrome runtime error:", chrome.runtime.lastError);

                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        resolve(response);
                    }
                });
            } else {
                reject(new Error("Chrome extension runtime not available"));
            }
        });
    }

    public setupMessageListener(): void {
        if (typeof chrome !== "undefined" && chrome.runtime) {
            chrome.runtime.onMessage.addListener((message: any, sender: any, sendResponse: any) => {
                const willHandle = this._handleMessage(message, sendResponse);

                return willHandle;
            });
        }
    }

    private _handleMessage(message: any, sendResponse: (response: any) => void): boolean {
        if (message.type === "SERVICE_WORKER_READY") {
            this.serviceWorkerReadyCallbacks.forEach((callback) => callback());

            sendResponse({ success: true });

            return true;
        }

        if (message.type === "FILL_PASSWORD_FORM") {
            const fillData = message.payload?.fillData;
            const tabId = message.payload?.tabId;

            if (!tabId) {
                Logger.error("No tab ID provided in FILL_PASSWORD_FORM message");

                sendResponse({ success: false, error: "No tab ID provided" });

                return true;
            }

            this._waitForFormReady(fillData);

            sendResponse({ success: true });

            return true;
        }

        return false;
    }

    private _waitForFormReady(fillData?: any): void {
        if (document.readyState !== "complete") {
            window.addEventListener("load", () => this._checkForFormsAndNotify(fillData));

            return;
        }

        this._checkForFormsAndNotify(fillData);
    }

    private _checkForFormsAndNotify(fillData?: any): void {
        const currentForms = this.formDetector.getCurrentForms();

        if (currentForms.length) {
            this._fillFormFields(fillData, currentForms);

            return;
        }

        // Set up mutation observer for dynamic form loading
        const observer = new MutationObserver(() => {
            const observerForms = this.formDetector.getCurrentForms();

            if (!observerForms.length) return;

            observer.disconnect();

            this._fillFormFields(fillData, observerForms);
        });

        observer.observe(document.body, {
            attributeFilter: ["type"], // Watch for input type changes
            attributes: true,
            childList: true,
            subtree: true,
        });

        // Timeout after 10 seconds
        setTimeout(() => {
            observer.disconnect();

            const timeoutForms = this.formDetector.getCurrentForms();

            if (timeoutForms.length > 0) this._fillFormFields(fillData, timeoutForms);
        }, 10000);
    }

    public onServiceWorkerReady(callback: () => void): void {
        this.serviceWorkerReadyCallbacks.push(callback);
    }

    private _fillFormFields(data: { username: string; password: string }, currentForms: DetectedForm[]): void {
        Logger.log("Attempting to fill form fields with:", { username: data.username, password: "***" });

        const fillField = (field: HTMLInputElement, value: string) => {
            field.value = value;
            field.dispatchEvent(new Event("input", { bubbles: true }));
            field.dispatchEvent(new Event("change", { bubbles: true }));
        };

        if (currentForms.length === 0) {
            Logger.warn("No forms detected");
            return;
        }

        let usernameField: HTMLInputElement | null = null;
        let passwordField: HTMLInputElement | null = null;

        for (const form of currentForms) {
            for (const field of form.fields) {
                if (!usernameField && (field.type === "username" || field.type === "email")) {
                    usernameField = field.element;
                }
                if (!passwordField && field.type === "password") {
                    passwordField = field.element;
                }
                if (usernameField && passwordField) break;
            }
            if (usernameField && passwordField) break;
        }

        if (usernameField) {
            Logger.log("Found username field:", usernameField);
            fillField(usernameField, data.username);
        } else {
            Logger.warn("No username field found");
        }

        if (passwordField) {
            Logger.log("Found password field:", passwordField);
            fillField(passwordField, data.password);
        } else {
            Logger.warn("No password field found");
        }
    }
}
