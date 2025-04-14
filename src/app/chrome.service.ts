import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { WalletModel } from "./wallet";

@Injectable({
    providedIn: "root",
})
export class ChromeService {
    private _isPopout$ = new BehaviorSubject<boolean>(false);
    private _isSidePanel$ = new BehaviorSubject<boolean>(false);
    private _wallet$ = new BehaviorSubject<WalletModel>({} as WalletModel);
    private _wallets$ = new BehaviorSubject<WalletModel[]>([] as WalletModel[]);

    private _tabId?: number;
    private _isExtension = Boolean(typeof browser !== "undefined" && browser.storage && browser.runtime);
    private _isSidePanel = false;
    private _isPopout = false;
    private _tabStorageKey = "isTabOpen";

    constructor() {
        if (!this.isExtension) return;

        browser.tabs.getCurrent().then((tab) => {
            this._tabId = tab?.id;

            this._isPopout = window === browser.extension.getViews({ type: "popup" })[0];
            this._isPopout$.next(this._isPopout);

            this._isSidePanel = !this._isPopout && !this._tabId;
            this._isSidePanel$.next(this._isSidePanel);
        });

        browser.tabs.onRemoved.addListener(async (closedTabId) => {
            const storedTabId = await this.getItem("tabId");

            if (storedTabId !== closedTabId) return;

            await this.setItem(this._tabStorageKey, false);
        });

        browser.storage.local.onChanged.addListener((changes) => {
            changes.wallet
                ? this._wallet$.next(changes.wallet.newValue ? (new WalletModel(changes.wallet.newValue) as WalletModel) : ({} as WalletModel))
                : ({} as WalletModel);

            changes.wallets
                ? this._wallets$.next(
                      ((changes.wallets.newValue as WalletModel[]) || ([] as WalletModel[]))?.map((wallet: any) => new WalletModel(wallet || {}))
                  )
                : ([] as WalletModel[]);
        });
    }

    get isExtension(): boolean {
        return this._isExtension;
    }

    get isPopout(): boolean {
        return this._isPopout;
    }

    get isPopout$(): BehaviorSubject<boolean> {
        return this._isPopout$;
    }

    get isSidePanel(): boolean {
        return this._isSidePanel;
    }

    get isSidePanel$(): BehaviorSubject<boolean> {
        return this._isSidePanel$;
    }

    get onWalletChanged$(): BehaviorSubject<WalletModel> {
        return this._wallet$;
    }

    get onWalletsChanged$(): BehaviorSubject<WalletModel[]> {
        return this._wallets$;
    }

    async closeTab(): Promise<void> {
        if (!this.isExtension || !this._tabId) return;

        browser.tabs.remove(this._tabId);
    }

    async copyToClipboard(value: string): Promise<void> {
        if (navigator?.clipboard) {
            navigator?.clipboard.writeText(value);

            return;
        }

        const input = document.createElement("input");

        input.value = value;

        document.body.appendChild(input);

        input.select();

        document.execCommand("copy");
        document.body.removeChild(input);
    }

    async getItem<T = any>(key: string, overrideSource?: string): Promise<T> {
        let source = this.isExtension ? "extension" : "web";

        if (overrideSource) {
            source = ["extension", "web"].includes(overrideSource) ? overrideSource : source;
        }

        return new Promise((resolve, reject) => {
            switch (source) {
                case "extension":
                    browser.storage.local
                        .get(key)
                        .then((result) => {
                            resolve(result[key] as T);
                        })
                        .catch(reject);

                    break;

                default:
                    try {
                        const item = localStorage.getItem(key);

                        try {
                            if (!item) resolve("" as T);

                            const result = JSON.parse(item as string);

                            resolve(result as T);
                        } catch (error) {
                            resolve(item as T);
                        }
                    } catch (error) {
                        reject(error);
                    }
            }
        });
    }

    async isExtensionTabOpen(): Promise<boolean> {
        if (!this.isExtension) return false;

        return new Promise((resolve) => {
            const baseUrl = browser.runtime.getURL("#/onboarding");

            browser.tabs.query({}).then((tabs) => {
                const isTabOpen = tabs.some((tab) => tab.url?.startsWith(baseUrl));

                resolve(isTabOpen);
            });
        });
    }

    async openFullPage(path: string): Promise<void> {
        if (!this.isExtension) return;

        const currentTab = await browser.tabs.getCurrent();

        if (currentTab) return; // No need to open a new tab if running in the current tab

        try {
            const url = browser.runtime.getURL("index.html");

            browser.tabs.create({ url: `${url}#${path}` }).then(async (tab) => {
                if (!tab?.id) return;

                try {
                    await this.setItem(this._tabStorageKey, true);
                    await this.setItem("tabId", tab.id);
                } catch (error) {
                    console.error("Failed to update tab state:", error);
                }
            });
        } catch (exception) {
            console.error("Failed to open tab:", exception);
        }
    }

    async openSidePanel(): Promise<void> {
        if (!this.isExtension) return;

        const [window] = await browser.windows.getAll({ populate: true });

        if (!window?.id) return;

        if (this.isPopout) {
            const views = browser.extension.getViews({ type: "popup" });

            if (views.length) views[0].close();
        } else {
            const tabs = await browser.tabs.query({ active: true, lastFocusedWindow: true });

            if (tabs.length > 1 && tabs[0].id === this._tabId) await this.closeTab();
        }

        if (chrome?.sidePanel) {
            await chrome.sidePanel.open({ windowId: window.id });
            await chrome.sidePanel.setOptions({
                path: "index.html",
                enabled: true,
            });
        }
    }

    async removeItem(key: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.isExtension) {
                browser.storage.local.remove(key).then(resolve).catch(reject);

                return;
            }

            try {
                localStorage.removeItem(key);

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    async setItem(key: string, value: any): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.isExtension) {
                browser.storage.local
                    .set({ [key]: value })
                    .then(resolve)
                    .catch(reject);

                return;
            }

            try {
                const isObjectOrArray = typeof value === "object" && value !== null;
                localStorage.setItem(key, isObjectOrArray ? JSON.stringify(value) : value);

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    async clearLocalStorage(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.isExtension) {
                browser.storage.local.clear().then(resolve).catch(reject);

                return;
            }

            try {
                localStorage.clear();

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    async getItemSession<T = any>(key: string): Promise<T> {
        return new Promise((resolve, reject) => {
            if (this.isExtension) {
                browser.storage.session
                    .get(key)
                    .then((result) => {
                        resolve(result[key] as T);
                    })
                    .catch(reject);
            } else {
                try {
                    const item = sessionStorage.getItem(key);

                    try {
                        if (!item) resolve("" as T);

                        const result = JSON.parse(item as string);

                        resolve(result as T);
                    } catch (error) {
                        resolve(item as T);
                    }
                } catch (error) {
                    reject(error);
                }
            }
        });
    }

    async setItemSession(key: string, value: any): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.isExtension) {
                browser.storage.session
                    .set({ [key]: value })
                    .then(resolve)
                    .catch(reject);
            } else {
                try {
                    const isObjectOrArray = typeof value === "object" && value !== null;
                    sessionStorage.setItem(key, isObjectOrArray ? JSON.stringify(value) : value);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }
        });
    }

    async removeItemSession(key: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.isExtension) {
                browser.storage.session.remove(key).then(resolve).catch(reject);
            } else {
                try {
                    sessionStorage.removeItem(key);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }
        });
    }

    async clearSessionStorage(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.isExtension) {
                browser.storage.session.clear().then(resolve).catch(reject);
            } else {
                try {
                    sessionStorage.clear();

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }
        });
    }
}
