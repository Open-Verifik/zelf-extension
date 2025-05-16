/// <reference types="webextension-polyfill"/>

const DEFAULT_INDEX = "index.html";
const TAB_ID_STORAGE_KEY = "extensionTabId";
const TAB_OPEN_STORAGE_KEY = "isExtensionTabOpen";

const openFullPage = () => {
    browser.storage.local.get([TAB_OPEN_STORAGE_KEY, TAB_ID_STORAGE_KEY]).then(() => {
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

browser?.sidebarAction?.setPanel({ panel: DEFAULT_INDEX });

chrome?.sidePanel?.setOptions({
    path: DEFAULT_INDEX,
    enabled: true,
});

// firefox specific
browser.menus?.onClicked.addListener(() => {
    if (browser.sidebarAction) browser.sidebarAction.open();
});

browser.runtime.onInstalled.addListener(() => {
    openFullPage();
});
