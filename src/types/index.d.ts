/// <reference types="chrome"/>

import { Browser } from "webextension-polyfill";

declare global {
    const browser: Browser;
}
