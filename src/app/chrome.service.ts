import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class ChromeService {
	constructor() {}

	// Check if running in a Chrome extension environment
	private isExtension = Boolean(typeof chrome !== "undefined" && chrome.storage && chrome.runtime);

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
			} else {
				try {
					localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
					resolve();
				} catch (error) {
					reject(error);
				}
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

						resolve(item?.includes("{") ? JSON.parse(item) : item);
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
}
