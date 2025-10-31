import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpWrapperService } from "./http-wrapper.service";
import { ChromeService } from "./chrome.service";

export interface DomainConfig {
    name: string;
    type: string;
    holdSuffix: string;
    status: "active" | "inactive" | "suspended";
    owner?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    features: Array<{
        name: string;
        code: string;
        description: string;
        enabled: boolean;
    }>;
    tags: {
        minLength: number;
        maxLength: number;
        allowedChars?: object;
        reserved?: string[];
        customRules?: string[];
        payment: {
            methods: string[];
            currencies: string[];
            discounts?: {
                yearly?: number;
                lifetime?: number;
            };
            rewardPrice?: number;
            whitelist?: object;
            pricingTable: object;
        };
        storage: {
            keyPrefix: string;
            ipfsEnabled: boolean;
            arweaveEnabled: boolean;
            walrusEnabled: boolean;
            backupEnabled?: boolean;
        };
    };
    zelfkeys: {
        plans: any[];
        payment: {
            whitelist?: object;
            pricingTable: object;
        };
        storage: {
            keyPrefix: string;
            ipfsEnabled: boolean;
            arweaveEnabled: boolean;
            walrusEnabled: boolean;
            backupEnabled?: boolean;
        };
    };
    storage: {
        keyPrefix: string;
        ipfsEnabled: boolean;
        arweaveEnabled: boolean;
        walrusEnabled: boolean;
        backupEnabled?: boolean;
    };
    stripe?: {
        productId?: string;
        priceId?: string;
        latestInvoiceId?: string;
        amountPaid?: number;
        paidAt?: string;
    };
    metadata?: {
        launchDate?: string;
        version?: string;
        documentation?: string;
        support?: "standard" | "premium" | "enterprise";
        logo?: string;
    };
    themeSettings?: {
        zns?: {
            enabled: boolean;
            currentMode: "light" | "dark";
            lightMode?: {
                colors?: { [key: string]: string };
            };
            darkMode?: {
                colors?: { [key: string]: string };
            };
        };
        zelfkeys?: {
            enabled: boolean;
            currentMode: "light" | "dark";
            lightMode?: {
                colors?: { [key: string]: string };
            };
            darkMode?: {
                colors?: { [key: string]: string };
            };
        };
    };
}

export interface DomainResponse {
    success: boolean;
    data: { [domainName: string]: DomainConfig };
}

@Injectable({
    providedIn: "root",
})
export class DomainService {
    private readonly apiUrl = environment.apiUrl;
    private domainKeys: string[] = [];
    private domainConfigs: { [domainName: string]: DomainConfig } = {};

    // Cache configuration
    private readonly CACHE_DURATION_MINUTES = 60; // Configurable cache duration
    private readonly CACHE_TIMESTAMP_KEY = "domainCacheTimestamp";
    private readonly DOMAIN_KEYS_KEY = "domainKeys";

    constructor(
        private httpWrapper: HttpWrapperService,
        private chromeService: ChromeService
    ) {}

    /**
     * Get all available domains
     * @returns Promise<DomainResponse>
     */
    async getDomains(): Promise<DomainResponse> {
        const queryParams = { includeNonPaid: environment.includeNonPaidDomains };

        const response = await this.httpWrapper.sendRequest<DomainResponse>("get", `${this.apiUrl}/api/tags/domains`, queryParams);

        console.log({ response: response.data });

        if (response.data) {
            // Save domain keys (just the names)
            this.domainKeys = Object.keys(response.data);

            // Save full domain configurations
            this.domainConfigs = response.data;

            // Save to localStorage via ChromeService
            await this.saveDomainsToStorage();
        }

        return response;
    }

    /**
     * Get domain keys (just the names like ['zelf', 'bdag', 'avax'])
     * @returns string[]
     */
    getDomainKeys(): string[] {
        return this.domainKeys;
    }

    /**
     * Get domain configuration by name
     * @param domainName - The domain name to get configuration for
     * @returns DomainConfig | undefined
     */
    getDomainConfig(domainName: string): DomainConfig | undefined {
        console.log({ domainName, domainConfigs: this.domainConfigs });
        return this.domainConfigs[domainName];
    }

    /**
     * Get all domain configurations
     * @returns { [domainName: string]: DomainConfig }
     */
    getAllDomainConfigs(): { [domainName: string]: DomainConfig } {
        return this.domainConfigs;
    }

    /**
     * Save domains to localStorage via ChromeService
     */
    private async saveDomainsToStorage(): Promise<void> {
        try {
            const timestamp = Date.now();

            // Save cache timestamp
            await this.chromeService.setItem(this.CACHE_TIMESTAMP_KEY, timestamp.toString());

            // Save domain keys
            await this.chromeService.setItem(this.DOMAIN_KEYS_KEY, JSON.stringify(this.domainKeys));

            // Save each domain configuration individually
            for (const [domainName, config] of Object.entries(this.domainConfigs)) {
                await this.chromeService.setItem(`domainConfig_${domainName}`, JSON.stringify(config));
            }
        } catch (error) {
            console.error("Error saving domains to localStorage:", error);
        }
    }

    /**
     * Load domains from localStorage via ChromeService
     */
    async loadDomainsFromStorage(): Promise<void> {
        try {
            // Load domain keys
            const keysData = await this.chromeService.getItem(this.DOMAIN_KEYS_KEY);
            if (keysData) {
                this.domainKeys = JSON.parse(keysData);
            }

            // Load domain configurations
            this.domainConfigs = {};
            for (const domainName of this.domainKeys) {
                const configData = await this.chromeService.getItem(`domainConfig_${domainName}`);
                if (configData) {
                    this.domainConfigs[domainName] = JSON.parse(configData);
                }
            }
        } catch (error) {
            console.error("Error loading domains from localStorage:", error);
        }
    }

    /**
     * Check if cached domains are still valid (not expired)
     * @returns boolean - true if cache is valid, false if expired
     */
    async isCacheValid(): Promise<boolean> {
        try {
            const timestampData = await this.chromeService.getItem(this.CACHE_TIMESTAMP_KEY);

            if (!timestampData) return false; // No cache timestamp means no valid cache

            const cacheTimestamp = parseInt(timestampData);

            const now = Date.now();

            const cacheAgeMinutes = (now - cacheTimestamp) / (1000 * 60);

            return cacheAgeMinutes < this.CACHE_DURATION_MINUTES;
        } catch (error) {
            console.error("Error checking cache validity:", error);
            return false;
        }
    }

    /**
     * Get cache age in minutes
     * @returns number - cache age in minutes, or -1 if no cache
     */
    async getCacheAgeMinutes(): Promise<number> {
        try {
            const timestampData = await this.chromeService.getItem(this.CACHE_TIMESTAMP_KEY);
            if (!timestampData) return -1; // No cache

            const cacheTimestamp = parseInt(timestampData);
            const now = Date.now();
            return (now - cacheTimestamp) / (1000 * 60);
        } catch (error) {
            console.error("Error getting cache age:", error);
            return -1;
        }
    }

    /**
     * Set cache duration in minutes (for testing or configuration)
     * @param minutes - cache duration in minutes
     */
    setCacheDuration(minutes: number): void {
        (this as any).CACHE_DURATION_MINUTES = minutes;
    }
}
