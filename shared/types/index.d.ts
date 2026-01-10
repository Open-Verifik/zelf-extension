/// <reference types="chrome"/>

import type { Browser } from "webextension-polyfill";

declare global {
    const browser: Browser;

    interface Window {
        ethereum?: any;
    }

    interface WindowEventMap {
        localstorage: CustomEvent<{ key: string; oldValue: string; newValue: string }>;
    }
}
