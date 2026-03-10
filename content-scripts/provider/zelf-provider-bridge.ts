/**
 * Zelf Provider Bridge (Content Script)
 *
 * Runs in the content script context. Bridges messages between
 * the in-page provider (zelf-inpage.ts) and the background service worker.
 */

import "webextension-polyfill";

const DAPP_MESSAGE_TYPES = [
    "DAPP_REQUEST_ACCOUNTS",
    "DAPP_CONNECT",
    "DAPP_GET_ACCOUNTS",
    "DAPP_SEND_TRANSACTION",
    "DAPP_SIGN_TRANSACTION",
    "DAPP_SIGN_MESSAGE",
    "DAPP_SWITCH_CHAIN",
    "DAPP_ADD_CHAIN",
    "DAPP_CHAIN_ID",
    "DAPP_DISCONNECT",
];

function injectPageScript(): void {
    try {
        const script = document.createElement("script");
        script.src = chrome.runtime.getURL("zelf-inpage.js");
        script.setAttribute("data-zelf-extension-id", chrome.runtime.id);
        (document.head || document.documentElement).appendChild(script);
        script.onload = () => script.remove();
    } catch (error) {
        console.error("Zelf: Failed to inject provider script:", error);
    }
}

function setupMessageBridge(): void {
    window.addEventListener("message", async (event) => {
        if (event.source !== (window as any)) return;
        if (!event.data || event.data.source !== "zelf-inpage") return;

        const { type, payload, requestId } = event.data;

        if (!DAPP_MESSAGE_TYPES.includes(type)) return;

        if (typeof chrome === "undefined" || !chrome.runtime) {
            console.error("Zelf: Extension context invalidated. Please refresh the page. (Missing chrome.runtime)");
            window.postMessage(
                {
                    source: "zelf-content-script",
                    type: "DAPP_PROVIDER_RESPONSE",
                    requestId,
                    payload: {
                        error: {
                            code: -32603,
                            message: "Extension context invalidated. Please refresh the page.",
                        },
                    },
                },
                "*"
            );
            return;
        }

        try {
            const response = await chrome.runtime.sendMessage({
                type,
                payload,
                requestId,
                origin: window.location.origin,
            });

            if (response && !response.pending) {
                window.postMessage(
                    {
                        source: "zelf-content-script",
                        type: "DAPP_PROVIDER_RESPONSE",
                        requestId,
                        payload: response.data !== undefined ? { result: response.data } : response,
                    },
                    "*"
                );
            }
        } catch (error: any) {
            const errorMessage = error?.message || "Internal error";
            const isContextInvalidated = errorMessage.includes("Extension context invalidated");
            
            window.postMessage(
                {
                    source: "zelf-content-script",
                    type: "DAPP_PROVIDER_RESPONSE",
                    requestId,
                    payload: {
                        error: {
                            code: -32603,
                            message: isContextInvalidated
                                ? "Zelf Wallet Extension was updated or reloaded in the background. Please refresh the page to continue."
                                : errorMessage,
                        },
                    },
                },
                "*"
            );
        }
    });

    chrome.runtime.onMessage.addListener((message) => {
        const { type, payload } = message;

        switch (type) {
            case "DAPP_PROVIDER_RESPONSE":
            case "DAPP_ACCOUNTS_CHANGED":
            case "DAPP_CHAIN_CHANGED":
                window.postMessage(
                    {
                        source: "zelf-content-script",
                        type,
                        requestId: payload?.requestId,
                        payload,
                    },
                    "*"
                );
                break;
        }
    });
}

injectPageScript();
setupMessageBridge();
