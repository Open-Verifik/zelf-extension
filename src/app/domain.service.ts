import { Injectable } from "@angular/core";

import { environment } from "../environments/environment";
import { ChromeService } from "./chrome.service";
import { DomainLicense } from "./core/models/domain.type";
import { HttpWrapperService } from "./http-wrapper.service";

export interface DomainResponse {
    success: boolean;
    data: { [domainName: string]: DomainLicense };
}

@Injectable({
    providedIn: "root",
})
export class DomainService {
    private readonly apiUrl = environment.apiUrl;
    private readonly CACHE_DURATION_MINUTES = 60;
    private readonly CACHE_TIMESTAMP_KEY = "domainCacheTimestamp";
    private readonly DOMAIN_KEYS_KEY = "domainKeys";

    private _domainKeys: string[] = [];
    private _domainConfigs: { [domainName: string]: DomainLicense } = {};

    constructor(
        private httpWrapper: HttpWrapperService,
        private chromeService: ChromeService
    ) {}

    get defaultFallbackDomainConfigs(): DomainLicense[] {
        return [
            {
                name: "zelf",
                type: "license",
                holdSuffix: ".hold",
                status: "active",
                owner: "miguel@zelf.world",
                description: "Official Zelf domain",
                features: [],
                tags: {
                    minLength: 1,
                    maxLength: 27,
                    allowedChars: {},
                    reserved: ["www", "api", "admin", "support", "help", "google"],
                    customRules: [],
                    payment: {
                        methods: ["coinbase", "crypto", "stripe"],
                        currencies: ["BTC", "ETH", "USDC", "BDAG", "ZNS", "AVAX"],
                        discounts: { yearly: 0.1, lifetime: 0.2 },
                        rewardPrice: 10,
                        whitelist: {},
                        pricingTable: {},
                    },
                    storage: {
                        keyPrefix: "zelfName",
                        ipfsEnabled: true,
                        arweaveEnabled: true,
                        walrusEnabled: true,
                        backupEnabled: false,
                    },
                    wallet: {
                        networks: {
                            ethereum: { enabled: true },
                            solana: { enabled: true },
                            bitcoin: { enabled: true },
                            blockdag: { enabled: true },
                            avalanche: { enabled: true },
                            binance: { enabled: true },
                            polygon: { enabled: true },
                            sui: { enabled: true },
                        },
                    },
                },
                zelfkeys: {
                    plans: [],
                    payment: { whitelist: {}, pricingTable: {} },
                    storage: {
                        keyPrefix: "zelfKey",
                        ipfsEnabled: true,
                        arweaveEnabled: true,
                        walrusEnabled: true,
                        backupEnabled: false,
                    },
                },
                storage: {
                    keyPrefix: "zelfName",
                    ipfsEnabled: true,
                    arweaveEnabled: true,
                    walrusEnabled: true,
                    backupEnabled: false,
                },
                metadata: {
                    launchDate: "2023-01-01",
                    version: "1.0.0",
                    documentation: "https://docs.zelf.world",
                    support: "standard",
                },
                startDate: "",
                endDate: "",
                stripe: undefined,
                themeSettings: {
                    zns: {
                        enabled: true,
                        currentMode: "light",
                        lightMode: {
                            colors: {
                                background: "#ffffff",
                                backgroundSecondary: "#f9f9fc",
                                border: "#e3e3e3",
                                borderHover: "#c3c6cf",
                                button: "#181818",
                                buttonHover: "#303030",
                                buttonSecondary: "#E9ECEF",
                                buttonSecondaryHover: "#E9ECEF",
                                buttonSecondaryText: "#495057",
                                buttonText: "#ffffff",
                                card: "#ffffff",
                                cardBorder: "#eeedf1",
                                error: "#dc362e",
                                errorText: "#ffeee9",
                                header: "#181818",
                                headerText: "#ffffff",
                                primary: "#181818",
                                secondary: "#ff5721",
                                shadow: "rgba(0, 0, 0, 0.1)",
                                success: "#1ea446",
                                successText: "#e7f8ed",
                                text: "#181818",
                                textMuted: "#73777f",
                                textSecondary: "#96939e",
                                warning: "#de6800",
                                warningText: "#ffeee9",
                            },
                        },
                        darkMode: {
                            colors: {
                                background: "#181818",
                                backgroundSecondary: "#1F1F1F",
                                border: "#3A3A3A",
                                borderHover: "#4A4A4A",
                                button: "#E8E8E8",
                                buttonHover: "#CFCFCF",
                                buttonSecondary: "#2A2A2A",
                                buttonSecondaryHover: "#3A3A3A",
                                buttonSecondaryText: "#E8E8E8",
                                buttonText: "#181818",
                                card: "#1F1F1F",
                                cardBorder: "#3A3A3A",
                                error: "#dc362e",
                                errorText: "#E8E8E8",
                                header: "#181818",
                                headerText: "#E8E8E8",
                                primary: "#E8E8E8",
                                secondary: "#ff5721",
                                shadow: "rgba(0, 0, 0, 0.3)",
                                success: "#1ea446",
                                successText: "#E8E8E8",
                                text: "#E8E8E8",
                                textMuted: "#73777f",
                                textSecondary: "#96939e",
                                warning: "#de6800",
                                warningText: "#E8E8E8",
                            },
                        },
                    },
                },
            },
        ];
    }

    get domainConfigs(): { [domainName: string]: DomainLicense } {
        return this._domainConfigs;
    }

    get domainKeys(): string[] {
        return this._domainKeys;
    }

    async getDomains(): Promise<DomainResponse> {
        const queryParams = { includeNonPaid: environment.includeNonPaidDomains };

        const response = await this.httpWrapper.sendRequest<DomainResponse>("get", `${this.apiUrl}/api/tags/domains`, queryParams);

        if (response.data) {
            this._domainKeys = Object.keys(response.data);
            this._domainConfigs = response.data;

            await this._saveDomainsToStorage();
        }

        return response;
    }

    getDomainLicense(domainName: string): DomainLicense | undefined {
        return this._domainConfigs[domainName];
    }

    private async _saveDomainsToStorage(): Promise<void> {
        try {
            const timestamp = Date.now();

            await this.chromeService.setItem(this.CACHE_TIMESTAMP_KEY, timestamp.toString());
            await this.chromeService.setItem(this.DOMAIN_KEYS_KEY, this._domainKeys);

            for (const [domainName, config] of Object.entries(this._domainConfigs)) {
                await this.chromeService.setItem(`domainConfig_${domainName}`, config);
            }
        } catch (error) {
            console.error("Error saving domains to localStorage:", error);
        }
    }

    async loadDomainsFromStorage(): Promise<DomainLicense[]> {
        try {
            const keysData = await this.chromeService.getItem<string[]>(this.DOMAIN_KEYS_KEY);

            if (keysData) this._domainKeys = Array.isArray(keysData) ? keysData : JSON.parse(keysData);

            this._domainConfigs = {};

            for (const domainName of this._domainKeys) {
                const config = await this.chromeService.getItem<DomainLicense>(`domainConfig_${domainName}`);

                if (config) this._domainConfigs[domainName] = config;
            }

            return Object.values(this._domainConfigs);
        } catch (error) {
            console.error("Error loading domains from localStorage:", error);

            return [];
        }
    }

    async isCacheValid(): Promise<boolean> {
        try {
            const timestampData = await this.chromeService.getItem(this.CACHE_TIMESTAMP_KEY);

            if (!timestampData) return false;

            const cacheTimestamp = parseInt(timestampData);
            const now = Date.now();

            const cacheAgeMinutes = (now - cacheTimestamp) / (1000 * 60);

            return cacheAgeMinutes < this.CACHE_DURATION_MINUTES;
        } catch (error) {
            return false;
        }
    }

    async getCacheAgeMinutes(): Promise<number> {
        try {
            const timestampData = await this.chromeService.getItem(this.CACHE_TIMESTAMP_KEY);

            if (!timestampData) return -1;

            const cacheTimestamp = parseInt(timestampData);
            const now = Date.now();

            return (now - cacheTimestamp) / (1000 * 60);
        } catch (error) {
            return -1;
        }
    }
}
