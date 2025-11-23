import { PasswordEntry } from "@shared/types/autofill.types";
import { DecryptedPasswordData } from "../types/autofill.types";
import { TagModel } from "@shared/types/tag.types";
import { Logger } from "@extension-scripts/logger/logger.class";
import { environment } from "@extension-scripts/environments/environment";

// Chrome extension API declaration
declare const chrome: any;

export class CredentialManagerService {
    private readonly API_BASE_URL = environment.apiBaseUrl;
    private readonly ZELF_KEYS_ROUTE = `/api/zelf-keys`;

    private static instance: CredentialManagerService;

    private accessKey: string | null = null;
    private accessKeyExpiry: number | null = null;

    public static getInstance(): CredentialManagerService {
        if (!CredentialManagerService.instance) {
            CredentialManagerService.instance = new CredentialManagerService();
        }

        return CredentialManagerService.instance;
    }

    constructor() {
        this.loadAccessKeyFromStorage();
    }

    /**
     * Load access key from localStorage
     */
    private async loadAccessKeyFromStorage(): Promise<void> {
        try {
            if (typeof chrome !== "undefined" && chrome.storage) {
                const result = await chrome.storage.local.get(["zelfKeyJWT", "zelfKeyJWTExpiry"]);
                this.accessKey = result.zelfKeyJWT || null;
                this.accessKeyExpiry = result.zelfKeyJWTExpiry || null;
            }
        } catch (error) {
            Logger.error("Error loading access key from storage:", error);
        }
    }

    /**
     * Save access key to localStorage
     */
    private async saveAccessKeyToStorage(): Promise<void> {
        try {
            if (typeof chrome !== "undefined" && chrome.storage) {
                await chrome.storage.local.set({
                    zelfKeyJWT: this.accessKey,
                    zelfKeyJWTExpiry: this.accessKeyExpiry,
                });
            }
        } catch (error) {
            Logger.error("Error saving access key to storage:", error);
        }
    }

    /**
     * Get the current access key if valid
     */
    public getAccessKey(): string | null {
        if (this.accessKey && this.accessKeyExpiry && Date.now() < this.accessKeyExpiry) {
            return this.accessKey;
        }

        // Clear expired token
        this.accessKey = null;
        this.accessKeyExpiry = null;
        return null;
    }

    /**
     * Set a new access key
     */
    public setAccessKey(token: string, expiry?: number): void {
        this.accessKey = token;
        this.accessKeyExpiry = expiry || Date.now() + 24 * 60 * 60 * 1000; // Default 24 hours
        this.saveAccessKeyToStorage();
    }

    /**
     * Clear the access key
     */
    public clearAccessKey(): void {
        this.accessKey = null;
        this.accessKeyExpiry = null;
        this.saveAccessKeyToStorage();
    }

    /**
     * Check if user is authenticated
     */
    public isAuthenticated(): boolean {
        return !!this.getAccessKey();
    }

    /**
     * Initialize session and get access key
     */
    public async initializeSession(): Promise<boolean> {
        try {
            // Check if we already have a valid access key
            if (this.isAuthenticated()) {
                return true;
            }

            // Get wallet data from storage (returns TagModel instance)
            const wallet = await this.getWalletFromStorage();
            if (!wallet?.publicData?.ethAddress) {
                Logger.error("No wallet found in storage");
                return false;
            }

            // Make API call to get new session
            // Use TagModel getters for consistent data access
            const response = await this.makeApiCall("POST", "/api/sessions", {
                address: wallet.publicData.ethAddress,
                identifier: wallet.fullTagName || wallet.tagName || wallet.name,
                tagName: wallet.tagName || undefined,
                domain: wallet.domain || undefined,
            });

            if (response?.data?.token) {
                this.setAccessKey(response.data.token);
                return true;
            }

            return false;
        } catch (error) {
            Logger.error("Error initializing session:", error);
            return false;
        }
    }

    /**
     * Get wallet data from storage
     * Returns TagModel instance for consistent data structure
     */
    private async getWalletFromStorage(): Promise<TagModel | null> {
        try {
            if (typeof chrome !== "undefined" && chrome.storage) {
                const result = await chrome.storage.local.get(["wallet", "accessKey"]);

                if (!result.wallet) {
                    return null;
                }

                // Convert raw wallet data to TagModel instance
                const wallet = new TagModel(result.wallet);

                // Note: accessKey is stored separately and not part of TagModel
                // If needed, it can be accessed via result.accessKey
                return wallet;
            }
            return null;
        } catch (error) {
            Logger.error("Error getting wallet from storage:", error);
            return null;
        }
    }

    /**
     * Get passwords for a specific website
     */
    public async getPasswords(website: string): Promise<PasswordEntry[]> {
        try {
            // Ensure we have a valid session
            if (!(await this.initializeSession())) {
                Logger.error("Failed to initialize session");
                return [];
            }

            // Get all passwords
            const response = await this.makeApiCall("GET", `${this.ZELF_KEYS_ROUTE}/list?category=password`);

            if (!response?.data) {
                return [];
            }

            // Filter passwords for the specific website
            const targetDomain = website.replace(/^https?:\/\//, "").replace(/^www\./, "");

            const passwords: PasswordEntry[] = response.data
                .filter((password: any) => password.publicData?.type === "website_password")
                .filter((password: any) => {
                    if (!website) return true;

                    const passwordDomain = password.publicData?.website ? new URL(password.publicData.website).hostname : undefined;

                    return (
                        passwordDomain === targetDomain ||
                        password.publicData?.website?.includes(targetDomain) ||
                        password.publicData?.website === targetDomain
                    );
                });

            return passwords;
        } catch (error) {
            Logger.error("Error getting passwords:", error);
            return [];
        }
    }

    /**
     * Decrypt a password
     */
    public async decryptPassword(passwordId: string): Promise<DecryptedPasswordData | null> {
        try {
            // Ensure we have a valid session
            if (!(await this.initializeSession())) {
                Logger.error("Failed to initialize session");
                return null;
            }

            const response = await this.makeApiCall("POST", `${this.ZELF_KEYS_ROUTE}/retrieve`, {
                id: passwordId,
            });

            if (response?.data) {
                return response.data as DecryptedPasswordData;
            }

            return null;
        } catch (error) {
            Logger.error("Error decrypting password:", error);
            return null;
        }
    }

    /**
     * Make API call with authentication
     */
    private async makeApiCall(method: string, endpoint: string, data?: any): Promise<any> {
        const accessKey = this.getAccessKey();
        if (!accessKey) {
            throw new Error("No valid access key available");
        }

        const url = `${this.API_BASE_URL}${endpoint}`;
        const options: RequestInit = {
            method,
            headers: {
                Authorization: `Bearer ${accessKey}`,
                "Content-Type": "application/json",
            },
        };

        if (data && (method === "POST" || method === "PUT")) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`API call failed: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    }

    /**
     * Store a new password
     */
    public async storePassword(passwordData: any): Promise<boolean> {
        try {
            // Ensure we have a valid session
            if (!(await this.initializeSession())) {
                Logger.error("Failed to initialize session");
                return false;
            }

            const response = await this.makeApiCall("POST", `${this.ZELF_KEYS_ROUTE}/store/password`, passwordData);
            return !!response?.data;
        } catch (error) {
            Logger.error("Error storing password:", error);
            return false;
        }
    }
}
