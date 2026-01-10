import { Logger } from "../../extension-scripts/logger/logger.class";
import { BrowserApiUtil } from "./browser-api-util";

export class ExtensionLifecycle {
    private readonly DEFAULT_INDEX = "index.html";

    constructor(private browserApi: BrowserApiUtil) {}

    initialize() {
        this._validateServiceWorkerContext();
        this._setupServiceWorkerEvents();
        this._setupSidePanel();
        this._setupEventListeners();
        this._scheduleServiceWorkerNotification();
    }

    private _setupSidePanel() {
        this._setupChromeSidePanel();
        this._setupFirefoxSidePanel();
    }

    private _setupEventListeners() {
        this._setupInstallListeners();
        this._setupRuntimeListeners();
        this._setupGlobalMessageListener();
    }

    private async _notifyServiceWorkerReady(): Promise<void> {
        try {
            // Get all tabs and notify them that service worker is ready
            if (!this.browserApi.has("tabs")) return;

            const tabsApi = this.browserApi.tabs as any;

            if (!tabsApi?.query) return;

            const tabs = await tabsApi.query({});

            let successCount = 0;

            for (const tab of tabs) {
                if (!tab.id) continue;

                try {
                    if (!tabsApi?.sendMessage) continue;

                    await tabsApi.sendMessage(tab.id, {
                        type: "SERVICE_WORKER_READY",
                    });

                    successCount++;
                } catch (error) {
                    // Tab might not have content script loaded yet, ignore
                }
            }

            // If no tabs were successfully notified, retry after a short delay
            if (successCount !== 0 || !tabs.length) return;

            setTimeout(() => {
                this._notifyServiceWorkerReady();
            }, 1000);
        } catch (error) {
            Logger.error("Error notifying content scripts:", error);
        }
    }

    private _validateServiceWorkerContext(): void {
        if (typeof self === "undefined") {
            Logger.error("Service worker is NOT running in correct context");
        } else {
            Logger.log("Service worker is running in correct context");
        }
    }

    private _setupServiceWorkerEvents(): void {
        if (typeof self === "undefined") return;

        self.addEventListener("install", (event) => {
            Logger.log("Service worker installing...");

            (event as any).waitUntil((self as any).skipWaiting());
        });

        self.addEventListener("activate", (event) => {
            Logger.log("Service worker activating...");

            (event as any).waitUntil(
                (self as any).clients
                    .claim()
                    .then(() => {
                        Logger.log("Service worker activated successfully");
                        this._notifyServiceWorkerReady();
                        return Promise.resolve();
                    })
                    .catch((error: any) => {
                        Logger.error("Service worker activation failed:", error);
                        this._notifyServiceWorkerReady();
                        return Promise.resolve();
                    })
            );
        });
    }

    private _setupChromeSidePanel(): void {
        if (!this.browserApi.sidePanel) return;

        (this.browserApi.sidePanel as any).setOptions({
            path: this.DEFAULT_INDEX,
            enabled: true,
        });
    }

    private _setupFirefoxSidePanel(): void {
        if (!this.browserApi.isBrowser) return;

        (this.browserApi.sidebarAction as any)?.setPanel({ panel: this.DEFAULT_INDEX });

        (this.browserApi.menus as any)?.onClicked.addListener(() => {
            if (this.browserApi.sidebarAction) (this.browserApi.sidebarAction as any).open();
        });
    }

    private _setupInstallListeners(): void {
        if (this.browserApi.isBrowser) {
            (this.browserApi.runtime as any)?.onInstalled.addListener(() => {
                Logger.log("Extension installed (Firefox)");
            });
        } else if (this.browserApi.isChrome && this.browserApi.has("runtime")) {
            (this.browserApi.runtime as any)?.onInstalled.addListener(() => {
                Logger.log("Extension installed (Chrome)");
            });
        }
    }

    private _setupRuntimeListeners(): void {
        if (!this.browserApi.has("runtime")) return;

        (this.browserApi.runtime as any)?.onStartup.addListener(() => {
            Logger.log("Background: Extension startup");
        });

        (this.browserApi.runtime as any)?.onSuspend.addListener(() => {
            Logger.log("Background: Extension suspending");
        });
    }

    private _setupGlobalMessageListener(): void {
        if (typeof self === "undefined") return;

        self.addEventListener("message", (event) => {
            // Handle global messages if needed
        });
    }

    private _scheduleServiceWorkerNotification(): void {
        // For cases where the service worker is already active, notify immediately
        // This handles the case where the service worker doesn't go through install/activate
        setTimeout(() => {
            this._notifyServiceWorkerReady();
        }, 100);
    }
}
