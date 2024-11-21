console.log("Background service worker initialized");

// Persistent state keys
const TAB_OPEN_STORAGE_KEY = "isExtensionTabOpen";
const TAB_ID_STORAGE_KEY = "extensionTabId";

// Function to open the extension as a tab
const openFullPage = () => {
	chrome.storage.local.get([TAB_OPEN_STORAGE_KEY, TAB_ID_STORAGE_KEY, "wallet", "wallets"], (items) => {
		const isTabOpen = items[TAB_OPEN_STORAGE_KEY] || false;
		const wallet = items.wallet || {};
		const wallets = items.wallets || [];
		const walletKeys = Object.keys(wallet);

		if (!isTabOpen && !walletKeys.length && wallets.length < 10) {
			const url = chrome.runtime.getURL("index.html");

			chrome.tabs.create({ url }, (tab) => {
				if (tab.id) {
					chrome.storage.local.set({
						[TAB_OPEN_STORAGE_KEY]: true,
						[TAB_ID_STORAGE_KEY]: tab.id,
					});
				}
			});
		}
	});
};

// Listener for tab closure
chrome.tabs.onRemoved.addListener((closedTabId) => {
	chrome.storage.local.get([TAB_ID_STORAGE_KEY], (items) => {
		if (items[TAB_ID_STORAGE_KEY] === closedTabId) {
			chrome.storage.local.set({
				[TAB_OPEN_STORAGE_KEY]: false,
				[TAB_ID_STORAGE_KEY]: null,
			});
			console.log("Extension tab closed. State reset.");
		}
	});
});

// Trigger the full-page open on certain events
chrome.action.onClicked.addListener(() => {
	openFullPage();
});

chrome.runtime.onInstalled.addListener(() => {
	console.log("Extension installed or updated.");
	openFullPage();
});

openFullPage();
