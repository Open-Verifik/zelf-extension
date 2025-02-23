console.log("Background service worker initialized");

// Persistent state keys
const TAB_OPEN_STORAGE_KEY = "isExtensionTabOpen";
const TAB_ID_STORAGE_KEY = "extensionTabId";

const DEFAULT_INDEX = "index.html";

chrome?.sidePanel?.setPanelBehavior({ path: DEFAULT_INDEX, enabled: true });

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

// Listener for tab update
chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    await chrome.sidePanel.setOptions({
        tabId,
        path: DEFAULT_INDEX,
        enabled: true,
    });
});

// Trigger the full-page open on certain events
chrome.action.onClicked.addListener(() => {
    openFullPage();
});

chrome.runtime.onConnect.addListener(function (port) {
    console.log(`port:`, port);
});

chrome.runtime.onMessage.addListener((request) => {
    console.log(`chrome.runtime.onMessage.addListener ~ request:`, request);
});
