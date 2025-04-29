import { Page, ElementHandle } from "puppeteer";

/**
 * Helpers for E2E testing with Puppeteer
 */
export class TestHelpers {
    /**
     * Wait for an element to be visible and return it
     */
    static async waitForElement(page: Page, selector: string, timeout = 5000): Promise<ElementHandle<Element> | null> {
        try {
            const element = await page.waitForSelector(selector, { visible: true, timeout });
            return element;
        } catch (error) {
            await page.screenshot({ path: `e2e/build/error-${Date.now()}.png` });
            throw error;
        }
    }

    /**
     * Click an element and wait for navigation
     */
    static async clickAndWaitForNavigation(page: Page, selector: string, options = {}): Promise<void> {
        try {
            const navigationPromise = page.waitForNavigation({
                waitUntil: "networkidle0",
                timeout: 10000,
            });

            await page.click(selector);
            await navigationPromise;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Fill an input field
     */
    static async fillInput(page: Page, selector: string, value: string): Promise<void> {
        try {
            await page.waitForSelector(selector, { visible: true, timeout: 5000 });
            await page.click(selector, { clickCount: 3 }); // Triple click to select all existing text
            await page.type(selector, value);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get text content from an element
     */
    static async getTextContent(page: Page, selector: string): Promise<string | null> {
        try {
            await page.waitForSelector(selector, { visible: true, timeout: 5000 });
            return await page.$eval(selector, (el) => el.textContent?.trim() || null);
        } catch (error) {
            return null;
        }
    }

    /**
     * Wait for a specific time (only use when absolutely necessary)
     */
    static async delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
