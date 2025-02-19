import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class ChromeService {
	private _isExtension = Boolean(typeof chrome !== "undefined" && chrome.storage && chrome.runtime);
	private _isSidePanel = false;
	private tabStorageKey = "isTabOpen";
	private _isSidePanel$ = new BehaviorSubject<boolean>(false);

	constructor() {
		if (!this.isExtension) return;

		chrome.tabs.onRemoved.addListener(async (closedTabId) => {
			const storedTabId = await this.getItem("tabId");

			if (storedTabId !== closedTabId) return;

			await this.setItem(this.tabStorageKey, false);
		});

		chrome.tabs.query({ active: true, lastFocusedWindow: true, windowType: "panel" }).then(([tab]) => {
			this._isSidePanel = !tab;
			this._isSidePanel$.next(this._isSidePanel);
		});
	}

	get isSidePanel$(): BehaviorSubject<boolean> {
		return this._isSidePanel$;
	}

	get isExtension(): boolean {
		return this._isExtension;
	}

	get isPopOut(): boolean {
		return chrome?.extension ? chrome.extension.getViews({ type: "popup" }).length > 0 : false;
	}

	get isSidePanel(): boolean {
		return this._isSidePanel;
	}

	async setItem(key: string, value: any): Promise<void> {
		return new Promise((resolve, reject) => {
			if (this.isExtension) {
				chrome.storage.local.set({ [key]: value }, () => {
					if (chrome.runtime.lastError) {
						reject(chrome.runtime.lastError);
					} else {
						resolve();
					}
				});
			}

			try {
				localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));

				resolve();
			} catch (error) {
				reject(error);
			}
		});
	}

	async getItem(key: string, overrideSource?: string): Promise<any> {
		let source = this.isExtension ? "extension" : "web";

		if (overrideSource) {
			source = ["extension", "web"].includes(overrideSource) ? overrideSource : source;
		}

		return new Promise((resolve, reject) => {
			switch (source) {
				case "extension":
					chrome.storage.local.get(key, (result) => {
						if (chrome.runtime.lastError) {
							reject(chrome.runtime.lastError);
						} else {
							resolve(result[key]);
						}
					});

					break;

				default:
					try {
						const item = localStorage.getItem(key);

						if (!item) resolve("");

						resolve(item?.includes("{") || item?.includes("[]") ? JSON.parse(item) : item);
					} catch (error) {
						reject(error);
					}
			}
		});
	}

	removeItem(key: string): Promise<void> {
		return new Promise((resolve, reject) => {
			if (this.isExtension) {
				chrome.storage.local.remove(key, () => {
					if (chrome.runtime.lastError) {
						reject(chrome.runtime.lastError);
					} else {
						resolve();
					}
				});
			} else {
				try {
					localStorage.removeItem(key);
					resolve();
				} catch (error) {
					reject(error);
				}
			}
		});
	}

	async isExtensionTabOpen(): Promise<boolean> {
		if (!this.isExtension) return false;

		return new Promise((resolve) => {
			const baseUrl = chrome.runtime.getURL("#/onboarding");

			chrome.tabs.query({}, (tabs) => {
				const isTabOpen = tabs.some((tab) => tab.url?.startsWith(baseUrl));
				resolve(isTabOpen);
			});
		});
	}

	async openFullPage(path: string): Promise<void> {
		if (!this.isExtension) return;

		chrome.tabs.getCurrent((currentTab) => {
			if (currentTab) return; // No need to open a new tab if running in the current tab

			try {
				const url = chrome.runtime.getURL("index.html");

				chrome.tabs.create({ url: `${url}#${path}` }, async (tab) => {
					if (tab.id) {
						try {
							await this.setItem(this.tabStorageKey, true);

							await this.setItem("tabId", tab.id);
						} catch (error) {
							console.error("Failed to update tab state:", error);
						}
					}
				});
			} catch (exception) {
				console.error("Failed to open tab:", exception);
			}
		});
	}

	async closeTab(tabId?: number): Promise<void> {
		if (!this.isExtension) return;

		if (!tabId) tabId = await this.getItem("tabId");
		if (!tabId) return;

		chrome.tabs.remove(tabId);
	}

	async openSidePanel(): Promise<void> {
		if (!this.isExtension) return;

		const [window] = await chrome.windows.getAll({ populate: true });

		if (!window?.id) return;

		if (!this.isPopOut) {
			const tabs = await chrome.tabs.query({});

			if (tabs.length > 1) {
				const [tab] = await chrome.tabs.query({
					active: true,
					lastFocusedWindow: true,
				});

				const tabId = tab?.id;

				if (!tabId) return;

				await this.closeTab(tabId);
			}
		} else {
			const views = chrome.extension.getViews({ type: "popup" });

			if (views.length > 0) {
				const popupWindow = views[0];

				popupWindow.close();
			}
		}

		await chrome.sidePanel.open({ windowId: window.id });
		await chrome.sidePanel.setOptions({
			path: "index.html",
			enabled: true,
		});
	}
}
