/// <reference types="webextension-polyfill"/>

const DEFAULT_INDEX = "index.html";
const TAB_ID_STORAGE_KEY = "extensionTabId";
const TAB_OPEN_STORAGE_KEY = "isExtensionTabOpen";

browser?.sidebarAction?.setPanel({ panel: DEFAULT_INDEX });

// firefox specific
browser.menus?.create({
    id: "open-sidebar",
    title: "Open Sidebar",
    contexts: ["all"],
});

// firefox specific
browser.menus?.onClicked.addListener(() => {
    console.log(` browser.menus.onClicked.addListener ~ browser:`, browser);
    if (browser.sidebarAction) browser.sidebarAction.open();
});

// Listener for tab closure
browser.tabs.onRemoved.addListener(async (closedTabId) => {
    const items = await browser.storage.local.get([TAB_ID_STORAGE_KEY]);

    if (items[TAB_ID_STORAGE_KEY] === closedTabId) {
        browser.storage.local.set({
            [TAB_OPEN_STORAGE_KEY]: false,
            [TAB_ID_STORAGE_KEY]: null,
        });
    }
});

// Listener for tab update
browser.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    if (!chrome?.sidePanel) {
        browser.sidebarAction.setPanel({ panel: DEFAULT_INDEX, tabId });

        return;
    }

    await chrome?.sidePanel?.setOptions({
        tabId,
        path: DEFAULT_INDEX,
        enabled: true,
    });
});

const openFullPage = () => {
    browser.storage.local.get([TAB_OPEN_STORAGE_KEY, TAB_ID_STORAGE_KEY, "wallet", "wallets"]).then((items) => {
        const url = browser.runtime.getURL("index.html");

        browser.tabs.create({ url }).then((tab) => {
            if (!tab || !tab.id) return;

            browser.storage.local.set({
                [TAB_OPEN_STORAGE_KEY]: true,
                [TAB_ID_STORAGE_KEY]: tab.id,
            });
        });
    });
};

browser.runtime.onInstalled.addListener(() => {
    openFullPage();
});
