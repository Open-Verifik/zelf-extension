import { inject, provideAppInitializer } from "@angular/core";

import { ChromeService } from "../../chrome.service";
import { DomainService } from "../../domain.service";
import { ThemeService } from "../../theme.service";
import { WalletService } from "../../wallet.service";

async function initializeDomains(): Promise<void> {
    const domainService = inject(DomainService);
    const themeService = inject(ThemeService);
    const walletService = inject(WalletService);
    const chromeService = inject(ChromeService);

    try {
        const loadedFromCache = await loadDomainsFromCache(domainService, themeService, walletService);

        if (loadedFromCache) {
            await ensureZelfDomainAvailable(domainService);
            await initializeTheme(domainService, themeService, walletService, chromeService);

            return;
        }

        await loadDomainsFromAPI(domainService, themeService, walletService);
        await ensureZelfDomainAvailable(domainService);
        await initializeTheme(domainService, themeService, walletService, chromeService);
    } catch (error) {
        console.error("Error loading domains:", error);
        await ensureZelfDomainAvailable(domainService);
        await initializeTheme(domainService, themeService, walletService, chromeService);
    }
}

async function loadDomainsFromCache(domainService: DomainService, themeService: ThemeService, walletService: WalletService): Promise<boolean> {
    try {
        const isCacheValid = await domainService.isCacheValid();

        if (!isCacheValid) return false;

        await domainService.loadDomainsFromStorage();
        await applyDefaultThemeIfNeeded(domainService, themeService, walletService);

        return true;
    } catch (error) {
        console.error("Error loading domains from cache:", error);
        return false;
    }
}

async function loadDomainsFromAPI(domainService: DomainService, themeService: ThemeService, walletService: WalletService): Promise<void> {
    try {
        await domainService.getDomains();
    } catch (error) {
        console.error("Error loading domains from API:", error);
    } finally {
        await applyDefaultThemeIfNeeded(domainService, themeService, walletService);
    }
}

async function applyDefaultThemeIfNeeded(domainService: DomainService, themeService: ThemeService, walletService: WalletService): Promise<void> {
    try {
        const wallet = await walletService.getCurrentWallet();

        if (wallet?.publicData?.domain) return;

        await ensureZelfDomainAvailable(domainService);

        const zelfConfig = domainService.getDomainLicense("zelf");

        if (zelfConfig?.themeSettings?.zns) {
            await themeService.applyThemeForDomain("zelf");
        }
    } catch (error) {
        console.error("Error applying default theme:", error);
    }
}

async function ensureZelfDomainAvailable(domainService: DomainService): Promise<void> {
    const zelfConfig = domainService.getDomainLicense("zelf");

    if (!zelfConfig) {
        const fallbackConfigs = domainService.defaultFallbackDomainConfigs;
        const zelfFallback = fallbackConfigs.find((config) => config.name === "zelf");

        if (!zelfFallback) return;

        const domainConfigs = domainService.domainConfigs;

        domainConfigs["zelf"] = zelfFallback;
    }
}

async function initializeTheme(
    domainService: DomainService,
    themeService: ThemeService,
    walletService: WalletService,
    chromeService: ChromeService
): Promise<void> {
    try {
        let domain: string | null = null;

        const currentWallet = await walletService.getCurrentWallet();

        if (currentWallet?.publicData?.domain) {
            domain = currentWallet.publicData.domain;
        } else {
            const storedDomain = await chromeService.getItem<string>("domain");

            if (storedDomain) domain = storedDomain;
        }

        if (domain) {
            const domainConfig = domainService.getDomainLicense(domain);

            if (domainConfig) {
                await themeService.applyThemeForDomain(domain);

                return;
            }
        }

        await applyZelfTheme(domainService, themeService);
    } catch (error) {
        console.error("Error initializing theme:", error);
        await applyZelfTheme(domainService, themeService);
    }
}

async function applyZelfTheme(domainService: DomainService, themeService: ThemeService): Promise<void> {
    let zelfConfig = domainService.getDomainLicense("zelf");

    if (!zelfConfig) {
        const fallbackConfigs = domainService.defaultFallbackDomainConfigs;
        const zelfFallback = fallbackConfigs.find((config) => config.name === "zelf");

        if (zelfFallback) {
            domainService.domainConfigs["zelf"] = zelfFallback;
            zelfConfig = zelfFallback;
        }
    }

    if (zelfConfig) {
        await themeService.applyThemeForDomain("zelf");
    }
}

export function provideDomainInitializer() {
    return provideAppInitializer(initializeDomains);
}
