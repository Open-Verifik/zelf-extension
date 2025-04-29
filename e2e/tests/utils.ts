import * as puppeteer from "puppeteer";

const baseUrl = process.env["baseUrl"] ?? "http://localhost:4200/";

let browser: puppeteer.Browser;
let page: puppeteer.Page;

interface BrowserHookOptions {
    devtools?: boolean;
    extensionPath?: string;
    headless?: boolean;
    slowMo?: number;
}

export function setupBrowserHooks(path = "", options: BrowserHookOptions = {}): void {
    beforeAll(async () => {
        const launchOptions: puppeteer.LaunchOptions = {
            args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1280,720"],
            defaultViewport: { width: 1280, height: 720 },
            devtools: true || options.devtools || false,
            headless: options.headless !== undefined ? options.headless : false,
            slowMo: options.slowMo || (options.headless ? 0 : 50),
        };

        if (options.extensionPath) {
            launchOptions.args?.push(`--load-extension=${options.extensionPath}`);
            launchOptions.args?.push(`--disable-extensions-except=${options.extensionPath}`);
        }

        browser = await puppeteer.launch(launchOptions);
    });

    beforeEach(async () => {
        page = await browser.newPage();

        await page.goto(`${baseUrl}${path}`, {
            waitUntil: "networkidle0",
            timeout: 30000,
        });
    });

    afterEach(async () => {
        await page?.close();
    });

    afterAll(async () => {
        await browser?.close();
    });
}

export function setupBrowserHooksAuto(path = "", options: Omit<BrowserHookOptions, "headless"> = {}): void {
    const headless = process.env.E2E_HEADLESS === "true";

    setupBrowserHooks(path, { ...options, headless });
}

export function getBrowserState(): {
    browser: puppeteer.Browser;
    page: puppeteer.Page;
    baseUrl: string;
} {
    if (!browser) throw new Error("No browser state found! Ensure `setupBrowserHooks()` is called.");

    return {
        browser,
        page,
        baseUrl,
    };
}
