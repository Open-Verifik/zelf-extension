import { setupBrowserHooksAuto, getBrowserState } from "../../../e2e/tests/utils";

describe("CTA Sheet Component E2E Tests", function () {
    setupBrowserHooksAuto("#/e2e-test/sheet", {
        devtools: !process.env.E2E_HEADLESS || process.env.E2E_HEADLESS !== "true",
    });

    afterEach(async function () {
        const { page } = getBrowserState();

        await page.evaluate(() => window.localStorage.removeItem("e2e-test-wallet"));
    });

    it("should display the cta-sheet test page", async function () {
        const { page } = getBrowserState();

        await page.waitForSelector("#open-cta-sheet", { visible: true, timeout: 10000 });
        await page.click("#open-cta-sheet");
        await page.waitForSelector(".cta-sheet", { visible: true, timeout: 10000 });

        const element = await page.$(".cta-sheet");

        expect(element).not.toBeNull();
    });

    it("should close when clicking the close button", async function () {
        const { page } = getBrowserState();

        await page.waitForSelector("#open-cta-sheet", { visible: true });
        await page.click("#open-cta-sheet");
        await page.waitForSelector(".cta-sheet", { visible: true });

        await page.waitForSelector(".cta-sheet__exit", { visible: true });
        await page.click(".cta-sheet__exit");

        await page.waitForFunction(
            () => {
                const element = document.querySelector(".cta-sheet");
                return !element || getComputedStyle(element).opacity === "0";
            },
            { timeout: 5000 }
        );

        expect(await page.evaluate(() => document.querySelector(".cta-sheet"))).toBeNull();
    });

    it("should show soon style for Mainnet with 30-16 days remaining", async function () {
        const { page } = getBrowserState();

        const mockWallet = {
            publicData: {
                type: "mainnet",
                zelfName: "testname",
                isFullyExpired: false,
                expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
            },
        };

        await page.evaluate((wallet) => {
            window.localStorage.setItem("e2e-test-wallet", JSON.stringify(wallet));
        }, mockWallet);

        await page.waitForSelector("#open-cta-sheet", { visible: true });
        await page.click("#open-cta-sheet");
        await page.waitForSelector(".cta-sheet", { visible: true });

        const hasSoonStyle = await page.evaluate(() => {
            return !!document.querySelector(".cta-sheet__status-bubble--soon");
        });

        expect(hasSoonStyle).toBe(true);

        const preTitleMessage = await page.evaluate(() => {
            return document.querySelector(".cta-sheet__pretitle")?.textContent;
        });

        expect(preTitleMessage).toContain("Thanks for subscribing");

        const infoTitleMessage = await page.evaluate(() => {
            return document.querySelector(".cta-sheet__info-pretitle")?.textContent;
        });

        expect(infoTitleMessage).toContain("You've subscribed to");

        const infoDescriptionMessage = await page.evaluate(() => {
            return document.querySelector(".cta-sheet__description")?.textContent;
        });

        expect(infoDescriptionMessage).toContain("Resubscribe within");

        const buttons = await page.$$(".cta-sheet__actions-buttons-container .zelf-button");

        expect(buttons.length).toBe(2);

        const buttonTexts = await Promise.all(buttons.map(async (button) => await button.evaluate((el) => el.textContent?.trim())));

        expect(buttonTexts).toContain("Purchase now");
        expect(buttonTexts).toContain("Do it later");
    });

    it("should show soon style for Hold with 30-16 days remaining", async function () {
        const { page } = getBrowserState();

        const mockWallet = {
            publicData: {
                type: "hold",
                zelfName: "testname",
                isFullyExpired: false,
                expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
            },
        };

        await page.evaluate((wallet) => {
            window.localStorage.setItem("e2e-test-wallet", JSON.stringify(wallet));
        }, mockWallet);

        await page.waitForSelector("#open-cta-sheet", { visible: true });
        await page.click("#open-cta-sheet");
        await page.waitForSelector(".cta-sheet", { visible: true });

        const hasSoonStyle = await page.evaluate(() => {
            return !!document.querySelector(".cta-sheet__status-bubble--soon");
        });

        expect(hasSoonStyle).toBe(true);

        const preTitleMessage = await page.evaluate(() => {
            return document.querySelector(".cta-sheet__pretitle")?.textContent;
        });

        expect(preTitleMessage).toContain("Thanks for reserving");

        const infoTitleMessage = await page.evaluate(() => {
            return document.querySelector(".cta-sheet__info-pretitle")?.textContent;
        });

        expect(infoTitleMessage).toContain("You've reserved");

        const infoDescriptionMessage = await page.evaluate(() => {
            return document.querySelector(".cta-sheet__description")?.textContent;
        });

        expect(infoDescriptionMessage).toContain("Complete your purchase within");

        const buttons = await page.$$(".cta-sheet__actions-buttons-container .zelf-button");

        expect(buttons.length).toBe(2);

        const buttonTexts = await Promise.all(buttons.map(async (button) => await button.evaluate((el) => el.textContent?.trim())));

        expect(buttonTexts).toContain("Purchase now");
        expect(buttonTexts).toContain("Do it later");
    });

    it("should show soon style for Mainnet with 15-7 days remaining", async function () {
        const { page } = getBrowserState();

        const now = Date.now();
        const expiresAtDate = new Date(now + 10 * 24 * 60 * 60 * 1000 + 20 * 1000); // 10 + 20 seconds from now
        const expiresAt = expiresAtDate.toISOString();
        const daysBetweenNowAndExpiresAt = Math.floor((expiresAtDate.getTime() - now) / (1000 * 60 * 60 * 24));

        const mockWallet = {
            publicData: {
                type: "mainnet",
                zelfName: "testname",
                isFullyExpired: false,
                expiresAt,
            },
        };

        await page.evaluate((wallet) => {
            window.localStorage.setItem("e2e-test-wallet", JSON.stringify(wallet));
        }, mockWallet);

        await page.waitForSelector("#open-cta-sheet", { visible: true });
        await page.click("#open-cta-sheet");
        await page.waitForSelector(".cta-sheet", { visible: true });

        const hasSoonStyle = await page.evaluate(() => {
            return !!document.querySelector(".cta-sheet__status-bubble--soon");
        });

        expect(hasSoonStyle).toBe(true);

        const preTitleMessage = await page.evaluate(() => {
            return document.querySelector(".cta-sheet__pretitle")?.textContent?.trim();
        });

        expect(preTitleMessage).toContain(`Keep ${mockWallet.publicData.zelfName.toUpperCase()} yours`);

        const infoPretitleMessage = await page.evaluate(() => {
            return document.querySelector(".cta-sheet__info-pretitle")?.textContent;
        });

        expect(infoPretitleMessage).toContain("Secure it now");

        const infoTitleMessage = await page.evaluate(() => {
            return document.querySelector(".cta-sheet__info-title")?.textContent;
        });

        expect(infoTitleMessage).toContain(`Only ${daysBetweenNowAndExpiresAt} days left`);

        const infoDescriptionMessage = await page.evaluate(() => {
            return document.querySelector(".cta-sheet__description")?.textContent;
        });

        expect(infoDescriptionMessage).toContain("Have you explored the benefits");

        const buttons = await page.$$(".cta-sheet__actions-buttons-container .zelf-button");

        expect(buttons.length).toBe(2);

        const buttonTexts = await Promise.all(buttons.map(async (button) => await button.evaluate((el) => el.textContent?.trim())));

        expect(buttonTexts).toContain("Purchase now");
        expect(buttonTexts).toContain("Do it later");
    });

    it("should show soon style for Hold with 15-7 days remaining", async function () {
        const { page } = getBrowserState();

        const now = Date.now();
        const expiresAtDate = new Date(now + 10 * 24 * 60 * 60 * 1000 + 20 * 1000); // 10 + 20 seconds from now
        const expiresAt = expiresAtDate.toISOString();
        const daysBetweenNowAndExpiresAt = Math.floor((expiresAtDate.getTime() - now) / (1000 * 60 * 60 * 24));

        const mockWallet = {
            publicData: {
                type: "hold",
                zelfName: "testname",
                isFullyExpired: false,
                expiresAt,
            },
        };

        await page.evaluate((wallet) => {
            window.localStorage.setItem("e2e-test-wallet", JSON.stringify(wallet));
        }, mockWallet);

        await page.waitForSelector("#open-cta-sheet", { visible: true });
        await page.click("#open-cta-sheet");
        await page.waitForSelector(".cta-sheet", { visible: true });

        const hasSoonStyle = await page.evaluate(() => {
            return !!document.querySelector(".cta-sheet__status-bubble--soon");
        });

        expect(hasSoonStyle).toBe(true);

        const preTitleMessage = await page.evaluate(() => {
            return document.querySelector(".cta-sheet__pretitle")?.textContent?.trim();
        });

        expect(preTitleMessage).toContain(`Make ${mockWallet.publicData.zelfName.toUpperCase()} yours`);

        const infoPretitleMessage = await page.evaluate(() => {
            return document.querySelector(".cta-sheet__info-pretitle")?.textContent;
        });

        expect(infoPretitleMessage).toContain("Secure it now");

        const infoTitleMessage = await page.evaluate(() => {
            return document.querySelector(".cta-sheet__info-title")?.textContent;
        });

        expect(infoTitleMessage).toContain(`Only ${daysBetweenNowAndExpiresAt} days left`);

        const infoDescriptionMessage = await page.evaluate(() => {
            return document.querySelector(".cta-sheet__description")?.textContent;
        });

        expect(infoDescriptionMessage).toContain("Have you explored the benefits");

        const buttons = await page.$$(".cta-sheet__actions-buttons-container .zelf-button");

        expect(buttons.length).toBe(2);

        const buttonTexts = await Promise.all(buttons.map(async (button) => await button.evaluate((el) => el.textContent?.trim())));

        expect(buttonTexts).toContain("Purchase now");
        expect(buttonTexts).toContain("Do it later");
    });

    it("should show warning style for Mainnet with <7 days remaining", async function () {
        const { page } = getBrowserState();

        const now = Date.now();
        const expiresAtDate = new Date(now + 6 * 24 * 60 * 60 * 1000 + 20 * 1000); // 6 + 20 seconds from now
        const expiresAt = expiresAtDate.toISOString();
        const daysBetweenNowAndExpiresAt = Math.floor((expiresAtDate.getTime() - now) / (1000 * 60 * 60 * 24));

        const mockWallet = {
            publicData: {
                type: "mainnet",
                zelfName: "testname",
                isFullyExpired: false,
                expiresAt,
            },
        };

        await page.evaluate((wallet) => {
            window.localStorage.setItem("e2e-test-wallet", JSON.stringify(wallet));
        }, mockWallet);

        await page.waitForSelector("#open-cta-sheet", { visible: true });
        await page.click("#open-cta-sheet");
        await page.waitForSelector(".cta-sheet", { visible: true });

        const hasWarningStyle = await page.evaluate(() => {
            return !!document.querySelector(".cta-sheet__status-bubble--warning");
        });

        expect(hasWarningStyle).toBe(true);

        const hasZelfChip = await page.evaluate(() => {
            return !!document.querySelector(".zelf-chip");
        });

        expect(hasZelfChip).toBe(true);

        const preTitleMessage = await page.evaluate(() => {
            return document.querySelector(".cta-sheet__pretitle")?.textContent?.trim();
        });

        expect(preTitleMessage).toContain("Love your ZelfName");

        const infoPretitleMessage = await page.evaluate(() => {
            return document.querySelector(".cta-sheet__info-pretitle")?.textContent;
        });

        expect(infoPretitleMessage).toContain(`With just ${daysBetweenNowAndExpiresAt} days left`);

        const infoTitleMessage = await page.evaluate(() => {
            return document.querySelector(".cta-sheet__info-title")?.textContent;
        });

        expect(infoTitleMessage).toContain("What do you think?");

        const buttons = await page.$$(".cta-sheet__actions-buttons-container .zelf-button");

        expect(buttons.length).toBe(2);

        const buttonTexts = await Promise.all(buttons.map(async (button) => await button.evaluate((el) => el.textContent?.trim())));

        expect(buttonTexts).toContain("Purchase now");
        expect(buttonTexts).toContain("Do it later");
    });

    it("should show warning style for Hold with <7 days remaining", async function () {
        const { page } = getBrowserState();

        const now = Date.now();
        const expiresAtDate = new Date(now + 6 * 24 * 60 * 60 * 1000 + 20 * 1000); // 6 + 20 seconds from now
        const expiresAt = expiresAtDate.toISOString();
        const daysBetweenNowAndExpiresAt = Math.floor((expiresAtDate.getTime() - now) / (1000 * 60 * 60 * 24));

        const mockWallet = {
            publicData: {
                type: "hold",
                zelfName: "testname",
                isFullyExpired: false,
                expiresAt,
            },
        };

        await page.evaluate((wallet) => {
            window.localStorage.setItem("e2e-test-wallet", JSON.stringify(wallet));
        }, mockWallet);

        await page.waitForSelector("#open-cta-sheet", { visible: true });
        await page.click("#open-cta-sheet");
        await page.waitForSelector(".cta-sheet", { visible: true });

        const hasWarningStyle = await page.evaluate(() => {
            return !!document.querySelector(".cta-sheet__status-bubble--warning");
        });

        expect(hasWarningStyle).toBe(true);

        const hasZelfChip = await page.evaluate(() => {
            return !!document.querySelector(".zelf-chip");
        });

        expect(hasZelfChip).toBe(true);

        const preTitleMessage = await page.evaluate(() => {
            return document.querySelector(".cta-sheet__pretitle")?.textContent?.trim();
        });

        expect(preTitleMessage).toContain("Love your ZelfName");

        const infoPretitleMessage = await page.evaluate(() => {
            return document.querySelector(".cta-sheet__info-pretitle")?.textContent;
        });

        expect(infoPretitleMessage).toContain(`With just ${daysBetweenNowAndExpiresAt} days left`);

        const infoTitleMessage = await page.evaluate(() => {
            return document.querySelector(".cta-sheet__info-title")?.textContent;
        });

        expect(infoTitleMessage).toContain("What do you think?");

        const buttons = await page.$$(".cta-sheet__actions-buttons-container .zelf-button");

        expect(buttons.length).toBe(2);

        const buttonTexts = await Promise.all(buttons.map(async (button) => await button.evaluate((el) => el.textContent?.trim())));

        expect(buttonTexts).toContain("Purchase now");
        expect(buttonTexts).toContain("Do it later");
    });

    it("should display considerations with 7 days remaining", async function () {
        const { page } = getBrowserState();

        const mockWallet = {
            publicData: {
                type: "hold",
                zelfName: "testname",
                isFullyExpired: false,
                expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            },
        };

        await page.evaluate((wallet) => {
            window.localStorage.setItem("e2e-test-wallet", JSON.stringify(wallet));
        }, mockWallet);

        await page.waitForSelector("#open-cta-sheet", { visible: true });
        await page.click("#open-cta-sheet");
        await page.waitForSelector(".cta-sheet", { visible: true });

        const infoPretitle = await page.evaluate(() => {
            return document.querySelector(".cta-sheet__info-pretitle")?.textContent;
        });

        expect(infoPretitle).toContain("With just");

        const expandableText = await page.evaluate(() => {
            return document.querySelector(".expandable__text")?.textContent;
        });

        const expandableContent = await page.evaluate(() => {
            return !!document.querySelector(".expandable__content");
        });

        expect(expandableContent).toBe(true);
        expect(expandableText).toContain("Yes, because");
    });

    it("should expand considerations on click", async function () {
        const { page } = getBrowserState();

        const mockWallet = {
            publicData: {
                type: "hold",
                zelfName: "testname",
                isFullyExpired: false,
                expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            },
        };

        await page.evaluate((wallet) => {
            window.localStorage.setItem("e2e-test-wallet", JSON.stringify(wallet));
        }, mockWallet);

        await page.waitForSelector("#open-cta-sheet", { visible: true });
        await page.click("#open-cta-sheet");
        await page.waitForSelector(".cta-sheet", { visible: true });

        const expandableBeforeClick = await page.evaluate(() => {
            return !document.querySelector(".expandable__content--active");
        });

        expect(expandableBeforeClick).toBe(true);

        await page.evaluate((selector) => {
            (document.querySelector(selector) as HTMLElement)?.click();
        }, ".expandable__label");

        const expandableAfterClick = await page.evaluate(() => {
            return !!document.querySelector(".expandable__content--active");
        });

        expect(expandableAfterClick).toBe(true);
    });
});
