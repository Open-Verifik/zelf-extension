import { Browser } from "webextension-polyfill";

export class BrowserApiUtil {
    private _chrome: typeof chrome | null = null;
    private _browser: Browser | null = null;
    private _isChrome = false;
    private _isBrowser = false;

    constructor() {
        this.initializeApis();
    }

    initializeApis() {
        this.initializeChromeApi();
        this.initializeBrowserApi();
    }

    get(moduleName: string) {
        return this.getChromeModule(moduleName) || this.getBrowserModule(moduleName) || null;
    }

    // Check if a module exists
    has(moduleName: string) {
        return this.get(moduleName) !== null;
    }

    get runtime() {
        const runtime = this.get("runtime");
        if (!runtime) return null;

        return {
            ...runtime,
            sendMessage: (message: any, callback?: (response: any) => void) => {
                return this.handleSendMessage(runtime, message, callback);
            },
        };
    }

    // Get storage API
    get storage() {
        return this.get("storage");
    }

    // Get tabs API
    get tabs() {
        return this.get("tabs");
    }

    // Get windows API
    get windows() {
        return this.get("windows");
    }

    // Get menus API
    get menus() {
        return this.get("menus");
    }

    // Get sidePanel (Chrome) or sidebarAction (Firefox) - these are different APIs
    get sidePanel() {
        if (this._isChrome) {
            return this._chrome?.sidePanel;
        }
        return null;
    }

    get sidebarAction() {
        if (this._isBrowser) {
            return this._browser?.sidebarAction;
        }
        return null;
    }

    // Get extension API (Firefox only)
    get extension() {
        if (this._isBrowser) {
            return this._browser?.extension;
        }
        return null;
    }

    // Get action API (Chrome) or browserAction (Firefox)
    get action() {
        if (this._isChrome) {
            return this._chrome?.action;
        }
        if (this._isBrowser) {
            return this._browser?.browserAction;
        }
        return null;
    }

    // Convenience getters
    get isExtension() {
        return this._isChrome || this._isBrowser;
    }

    get isChrome() {
        return this._isChrome;
    }

    get isBrowser() {
        return this._isBrowser;
    }

    // Smart sendMessage that handles both Chrome and Firefox
    sendMessage(message: any, callback?: (response: any) => void) {
        const runtime = this.runtime;
        if (!runtime) {
            throw new Error("Runtime API not available");
        }

        if (this._isChrome) {
            // Chrome uses callback
            (runtime as any).sendMessage(message, callback);
        } else if (this._isBrowser) {
            // Firefox returns Promise
            return (runtime as any).sendMessage(message);
        }
    }

    // Smart addMessageListener
    addMessageListener(listener: (message: any, sender: any, sendResponse: (response?: any) => void) => void) {
        const runtime = this.get("runtime");
        if (runtime) {
            (runtime as any).onMessage.addListener(listener);
        }
    }

    // Smart storage operations
    async getStorageItem(key: string) {
        const storage = this.storage as any;
        if (!storage?.local) return null;

        const result = await storage.local.get(key);
        return result[key];
    }

    async setStorageItem(key: string, value: any) {
        const storage = this.storage as any;
        if (!storage?.local) return;

        await storage.local.set({ [key]: value });
    }

    async getAllStorageItems(): Promise<Record<string, any>> {
        const storage = this.storage as any;
        if (!storage?.local) return {};
        return await storage.local.get(null);
    }

    async removeStorageItems(keys: string | string[]) {
        const storage = this.storage as any;
        if (!storage?.local) return;
        await storage.local.remove(keys);
    }

    private initializeChromeApi(): void {
        if (typeof chrome !== "undefined") {
            this._chrome = chrome;
            this._isChrome = true;
        }
    }

    private initializeBrowserApi(): void {
        if (typeof browser !== "undefined") {
            this._browser = browser;
            this._isBrowser = true;
        }
    }

    private getChromeModule(moduleName: string) {
        return this._isChrome && this._chrome?.[moduleName as keyof typeof chrome] ? this._chrome[moduleName as keyof typeof chrome] : null;
    }

    private getBrowserModule(moduleName: string) {
        return this._isBrowser && this._browser?.[moduleName as keyof Browser] ? this._browser[moduleName as keyof Browser] : null;
    }

    private handleSendMessage(runtime: any, message: any, callback?: (response: any) => void) {
        if (this._isChrome) {
            runtime.sendMessage(message, callback);
        } else if (this._isBrowser) {
            return runtime.sendMessage(message);
        }
    }
}
