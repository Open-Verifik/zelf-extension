import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class ChromeService {
	private isExtension = Boolean(typeof chrome !== "undefined" && chrome.storage && chrome.runtime);
	private tabStorageKey = "isTabOpen";

	constructor() {
		if (this.isExtension) {
			chrome.tabs.onRemoved.addListener(async (closedTabId) => {
				const storedTabId = await this.getItem("tabId");
				if (storedTabId === closedTabId) {
					// Reset the tab state
					await this.setItem(this.tabStorageKey, false);
				}
			});
		}
	}

	setItem(key: string, value: any): Promise<void> {
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

	getItem(key: string, overrideSource?: string): Promise<any> {
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
		if (!this.isExtension) {
			return false;
		}

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

	getIsExtension(): boolean {
		return this.isExtension;
	}

	isInExtensionPopOut(): boolean {
		return chrome?.extension ? chrome.extension.getViews({ type: "popup" }).length > 0 : false;
	}
}
