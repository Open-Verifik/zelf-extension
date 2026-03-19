import "webextension-polyfill";

import { Logger } from "@extension-scripts/logger/logger.class";
import { BrowserApiUtil } from "./services/browser-api-util";
import { MessageHandler } from "./services/message-handler";
import { DappHandler } from "./services/dapp-handler";
import { ExtensionLifecycle } from "./services/extension-lifecycle";

const browserApi = new BrowserApiUtil();

const extensionLifecycle = new ExtensionLifecycle(browserApi);

extensionLifecycle.initialize();

const messageHandler = MessageHandler.getInstance(browserApi);
const dappHandler = DappHandler.getInstance(browserApi);
void dappHandler.restorePendingRequests();

if (!browserApi.has("runtime")) {
    Logger.error("Runtime API not available - extension cannot function");

    throw new Error("Runtime API not available");
}

browserApi.addMessageListener((message, sender, sendResponse) => {
    if (message.type && message.type.startsWith("DAPP_")) {
        dappHandler.handleDappMessage(message, sender, sendResponse);
        return true;
    }

    if (message.type && message.type.startsWith("WC_")) {
        return false;
    }

    messageHandler.handleAutofillMessage(message, sender, sendResponse);
    return true;
});
