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
                themeSettings: undefined,
            },
            {
                name: "bdag",
                type: "license",
                holdSuffix: ".hold",
                status: "active",
                owner: "miguel@zelf.world",
                description: "BDAG domain",
                features: [],
                tags: {
                    minLength: 1,
                    maxLength: 27,
                    allowedChars: {},
                    reserved: ["www", "api", "admin"],
                    customRules: [],
                    payment: {
                        methods: ["crypto"],
                        currencies: ["BDAG"],
                        whitelist: {},
                        pricingTable: {},
                        discounts: undefined,
                        rewardPrice: 0,
                    },
                    storage: {
                        keyPrefix: "bdagName",
                        ipfsEnabled: true,
                        arweaveEnabled: false,
                        walrusEnabled: false,
                        backupEnabled: false,
                    },
                },
                zelfkeys: {
                    plans: [],
                    payment: { whitelist: {}, pricingTable: {} },
                    storage: {
                        keyPrefix: "bdagKey",
                        ipfsEnabled: true,
                        arweaveEnabled: false,
                        walrusEnabled: false,
                        backupEnabled: false,
                    },
                },
                storage: {
                    keyPrefix: "bdagName",
                    ipfsEnabled: true,
                    arweaveEnabled: false,
                    walrusEnabled: false,
                    backupEnabled: false,
                },
                metadata: undefined,
                startDate: "",
                endDate: "",
            },
            {
                name: "avax",
                type: "license",
                holdSuffix: ".hold",
                status: "active",
                owner: "miguel@zelf.world",
                description: "AVAX domain",
                features: [],
                tags: {
                    minLength: 1,
                    maxLength: 27,
                    allowedChars: {},
                    reserved: ["www", "api", "admin"],
                    customRules: [],
                    payment: {
                        methods: ["crypto"],
                        currencies: ["AVAX"],
                        whitelist: {},
                        pricingTable: {},
                        discounts: undefined,
                        rewardPrice: 0,
                    },
                    storage: {
                        keyPrefix: "avaxName",
                        ipfsEnabled: true,
                        arweaveEnabled: false,
                        walrusEnabled: false,
                        backupEnabled: false,
                    },
                },
                zelfkeys: {
                    plans: [],
                    payment: { whitelist: {}, pricingTable: {} },
                    storage: {
                        keyPrefix: "avaxKey",
                        ipfsEnabled: true,
                        arweaveEnabled: false,
                        walrusEnabled: false,
                        backupEnabled: false,
                    },
                },
                storage: {
                    keyPrefix: "avaxName",
                    ipfsEnabled: true,
                    arweaveEnabled: false,
                    walrusEnabled: false,
                    backupEnabled: false,
                },
                metadata: undefined,
                startDate: "",
                endDate: "",
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

            await this.chromeService.setItemSession(this.CACHE_TIMESTAMP_KEY, timestamp.toString());
            await this.chromeService.setItemSession(this.DOMAIN_KEYS_KEY, JSON.stringify(this._domainKeys));

            for (const [domainName, config] of Object.entries(this._domainConfigs)) {
                await this.chromeService.setItemSession(`domainConfig_${domainName}`, JSON.stringify(config));
            }
        } catch (error) {
            console.error("Error saving domains to localStorage:", error);
        }
    }

    async loadDomainsFromStorage(): Promise<void> {
        try {
            const keysData = await this.chromeService.getItemSession(this.DOMAIN_KEYS_KEY);

            if (keysData) this._domainKeys = JSON.parse(keysData);

            this._domainConfigs = {};

            for (const domainName of this._domainKeys) {
                const configData = await this.chromeService.getItemSession(`domainConfig_${domainName}`);

                if (configData) this._domainConfigs[domainName] = JSON.parse(configData);
            }
        } catch (error) {
            console.error("Error loading domains from localStorage:", error);
        }
    }

    async isCacheValid(): Promise<boolean> {
        try {
            const timestampData = await this.chromeService.getItemSession(this.CACHE_TIMESTAMP_KEY);

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
            const timestampData = await this.chromeService.getItemSession(this.CACHE_TIMESTAMP_KEY);

            if (!timestampData) return -1;

            const cacheTimestamp = parseInt(timestampData);
            const now = Date.now();

            return (now - cacheTimestamp) / (1000 * 60);
        } catch (error) {
            return -1;
        }
    }
}
