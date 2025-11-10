import { Injectable } from "@angular/core";
import { ChromeService } from "../chrome.service";

export interface FormData {
    [key: string]: any;
}

export interface ApiResult {
    success: boolean;
    zelfProof: string;
    zelfQR: string;
    NFT?: {
        success: boolean;
        tokenId: string;
        transactionHash: string;
        recipient: string;
        cost: string;
        metadata: any;
        metadataUrl: string;
        explorerUrl: string;
        owner: string;
        contractAddress: string;
    };
    ipfs?: {
        hash: string;
        gatewayUrl: string;
        pinSize: number;
        timestamp: string;
        name: string;
        metadata: any;
    };
    publicData?: any;
    message: string;
}

@Injectable({
    providedIn: "root",
})
export class DataPassingService {
    private dataStore: { [key: string]: FormData } = {};
    private resultStore: { [key: string]: ApiResult } = {};

    constructor(private chromeService: ChromeService) {
        // Load any existing data from localStorage on service initialization
        // Use setTimeout to avoid blocking constructor
        setTimeout(() => {
            this.loadFromStorage();
        }, 0);
    }

    /**
     * Store form data for a specific form type
     */
    async storeData(formType: string, data: FormData): Promise<void> {
        this.dataStore[formType] = data;
        await this.saveToStorage();
    }

    /**
     * Retrieve form data for a specific form type
     */
    getData(formType: string): FormData | null {
        const data = this.dataStore[formType];
        return data || null;
    }

    /**
     * Store API result for a specific form type
     */
    async storeResult(formType: string, result: ApiResult): Promise<void> {
        this.resultStore[formType] = result;
        await this.saveToStorage();
    }

    /**
     * Retrieve API result for a specific form type
     */
    getResult(formType: string): ApiResult | null {
        const result = this.resultStore[formType];
        return result || null;
    }

    /**
     * Clear form data for a specific form type
     */
    clearData(formType: string): void {
        // also store it from the chrome storage
        this.chromeService.removeItem(`zelfDataPassing`);
        delete this.dataStore[formType];
    }

    /**
     * Clear result data for a specific form type
     */
    clearResult(formType: string): void {
        delete this.resultStore[formType];
    }

    /**
     * Clear all data for a specific form type (both form and result)
     */
    async clearAll(formType: string): Promise<void> {
        this.clearData(formType);
        this.clearResult(formType);
        await this.saveToStorage();
    }

    /**
     * Check if form data exists for a specific form type
     */
    hasData(formType: string): boolean {
        return !!this.dataStore[formType];
    }

    /**
     * Check if result data exists for a specific form type
     */
    hasResult(formType: string): boolean {
        return !!this.resultStore[formType];
    }

    /**
     * Get all stored data for debugging
     */
    getAllData(): { formData: { [key: string]: FormData }; resultData: { [key: string]: ApiResult } } {
        return {
            formData: { ...this.dataStore },
            resultData: { ...this.resultStore },
        };
    }

    /**
     * Save data to localStorage for persistence
     */
    private async saveToStorage(): Promise<void> {
        try {
            const storageData = {
                dataStore: this.dataStore,
                resultStore: this.resultStore,
                timestamp: Date.now(),
            };

            if (this.chromeService.isExtension) {
                // Use Chrome storage for extension
                await this.chromeService.setItem("zelfDataPassing", storageData);
            } else {
                // Use localStorage for web
                localStorage.setItem("zelfDataPassing", JSON.stringify(storageData));
            }
        } catch (error) {
            console.error("Error saving to storage:", error);
        }
    }

    /**
     * Load data from localStorage on service initialization
     */
    private async loadFromStorage(): Promise<void> {
        try {
            let storageData: any = null;

            if (this.chromeService.isExtension) {
                // Use Chrome storage for extension
                storageData = await this.chromeService.getItem("zelfDataPassing");
            } else {
                // Use localStorage for web
                const localData = localStorage.getItem("zelfDataPassing");
                storageData = localData ? JSON.parse(localData) : null;
            }

            if (storageData) {
                const maxAge = 24 * 60 * 60 * 1000; // 24 hours

                // Check if data is not too old
                if (Date.now() - storageData.timestamp < maxAge) {
                    this.dataStore = storageData.dataStore || {};
                    this.resultStore = storageData.resultStore || {};
                } else {
                    this.clearAllStorage();
                }
            }
        } catch (error) {
            console.error("Error loading from storage:", error);
            // Clear potentially corrupted data
            this.clearAllStorage();
        }
    }

    /**
     * Clear all data from both memory and storage
     */
    clearAllStorage(): void {
        this.dataStore = {};
        this.resultStore = {};

        try {
            if (this.chromeService.isExtension) {
                this.chromeService.removeItem("zelfDataPassing");
            } else {
                localStorage.removeItem("zelfDataPassing");
            }
        } catch (error) {
            console.error("Error clearing storage:", error);
        }
    }

    /**
     * Manually clear storage for a specific form type
     */
    async clearStorageForType(formType: string): Promise<void> {
        await this.clearAll(formType);
    }

    /**
     * Get storage info for debugging
     */
    getStorageInfo(): { isExtension: boolean; hasChromeService: boolean; storageKeys: string[] } {
        return {
            isExtension: this.chromeService.isExtension,
            hasChromeService: !!this.chromeService,
            storageKeys: Object.keys(this.dataStore).concat(Object.keys(this.resultStore)),
        };
    }
}
