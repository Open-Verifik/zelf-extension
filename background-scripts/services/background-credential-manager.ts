import { BrowserApiUtil } from "./browser-api-util";
import { TagModel } from "@shared/types/tag.types";
import { Logger } from "../../extension-scripts/logger/logger.class";
import { environment } from "../../extension-scripts/environments/environment";

export interface PasswordPublicData {
    category: string;
    folder?: string;
    keyOwner: string;
    timestamp: string;
    type: string;
    username?: string;
    website?: string;
}

export interface PasswordItem {
    id: string;
    cid: string;
    url: string;
    publicData: PasswordPublicData;
    zelfProofQRCode?: string;
    zelfProof?: string;
    createdAt: string;
}

export interface ZelfKeysListResponse {
    data: {
        success: boolean;
        message: string;
        category: string;
        data: PasswordItem[];
        timestamp: string;
        fullTagName: string;
        searchCategory: string;
        totalCount: number;
    };
}

export interface PasswordEntry {
    id: string;
    website?: string;
    domain?: string;
    url?: string;
    name?: string;
    username?: string;
    publicData?: PasswordPublicData;
    cid?: string;
    zelfProofQRCode?: string;
    zelfProof?: string;
    createdAt?: string;
}

export interface DecryptedPasswordData {
    metadata: {
        username: string;
        password: string;
    };
}

export class BackgroundCredentialManager {
    private readonly API_BASE_URL = environment.apiBaseUrl;
    private readonly ZELF_KEYS_ROUTE = `/api/zelf-keys`;

    private static instance: BackgroundCredentialManager;

    private _accessToken: string | null = null;
    private _accessTokenExpiry: number | null = null;

    public static getInstance(browserApi?: BrowserApiUtil): BackgroundCredentialManager {
        if (!BackgroundCredentialManager.instance) {
            BackgroundCredentialManager.instance = new BackgroundCredentialManager(browserApi);
        }

        return BackgroundCredentialManager.instance;
    }

    constructor(private browserApi?: BrowserApiUtil) {
        this.loadAccessTokenFromStorage().catch((error) => {
            Logger.error("Error loading JWT from storage in constructor:", error);
        });
    }

    /**
     * Load JWT from storage (replicating Angular service behavior)
     * Note: Uses accessTokenExpiresAt (Unix timestamp) to match AuthService
     */
    private async loadAccessTokenFromStorage(): Promise<void> {
        try {
            if (this.browserApi?.has("storage")) {
                const result = await (this.browserApi.storage as any).local.get(["accessToken", "accessTokenExpiresAt", "accessTokenExpiry"]);

                // Support both naming conventions for backward compatibility
                this._accessToken = result.accessToken || null;
                const expiresAt = result.accessTokenExpiresAt || result.accessTokenExpiry || null;

                // Convert Unix timestamp to milliseconds if needed, or use as-is if already in milliseconds
                if (expiresAt) {
                    // If expiresAt is a Unix timestamp (seconds), convert to milliseconds
                    // Unix timestamps are typically 10 digits, milliseconds are 13 digits
                    this._accessTokenExpiry = expiresAt < 1e12 ? expiresAt * 1000 : expiresAt;
                } else {
                    this._accessTokenExpiry = null;
                }

                if (this.isTokenExpired()) {
                    this.clearExpiredToken();

                    await this.setAccessTokenToStorage();
                }
            } else {
                Logger.error("Storage API not available through BrowserApiUtil");
            }
        } catch (error) {
            Logger.error("Error loading JWT from storage:", error);
        }
    }

    /**
     * Save JWT to storage (replicating Angular service behavior)
     * Note: Uses accessTokenExpiresAt (Unix timestamp) to match AuthService
     */
    private async setAccessTokenToStorage(): Promise<void> {
        try {
            if (this.browserApi?.has("storage")) {
                // Convert milliseconds to Unix timestamp (seconds) to match AuthService format
                const expiresAt = this._accessTokenExpiry ? Math.floor(this._accessTokenExpiry / 1000) : null;

                await (this.browserApi.storage as any).local.set({
                    accessToken: this._accessToken,
                    accessTokenExpiresAt: expiresAt,
                });
            } else {
                Logger.error("Storage API not available through BrowserApiUtil");
            }
        } catch (error) {
            Logger.error("Error saving JWT to storage:", error);
        }
    }

    public async getAccessToken(): Promise<string | null> {
        // Always refresh from storage first so the background picks up any token the
        // main app or popout may have just written (e.g. after reauthenticateSession).
        // Without this, the background's in-memory token can race ahead of storage and
        // cause JWT/identifier mismatches with the popout's PGP session key.
        await this.loadAccessTokenFromStorage();

        if (this.hasValidToken()) return this._accessToken;

        const sessionResult = await this.initSession();

        return sessionResult?.data?.token || null;
    }

    public clearAccessToken(): void {
        this._accessToken = null;
        this._accessTokenExpiry = null;

        this.setAccessTokenToStorage();
    }

    public async isAuthenticated(): Promise<boolean> {
        const accessToken = await this.getAccessToken();

        return !!accessToken;
    }

    private isTokenExpired(): boolean {
        return !!(this._accessToken && this._accessTokenExpiry && Date.now() >= this._accessTokenExpiry);
    }

    private hasValidToken(): boolean {
        return !!(this._accessToken && this._accessTokenExpiry && Date.now() < this._accessTokenExpiry);
    }

    private clearExpiredToken(): void {
        this._accessToken = null;
        this._accessTokenExpiry = null;
    }

    private filterPasswordsByWebsite(data: PasswordItem[], website: string): PasswordEntry[] {
        if (!Array.isArray(data)) {
            Logger.warn("filterPasswordsByWebsite: data is not an array", data);
            return [];
        }

        return data
            .filter((password) => password.publicData?.type === "password" && this.matchesWebsite(password, website))
            .map((password) => this.mapPasswordItemToEntry(password));
    }

    private matchesWebsite(password: PasswordItem, website: string): boolean {
        if (!website) return true;

        const targetDomain = website.replace(/^https?:\/\//, "").replace(/^www\./, "");
        const passwordWebsite = password.publicData?.website;

        if (!passwordWebsite) return false;

        try {
            const passwordDomain = new URL(passwordWebsite).hostname;

            return passwordDomain === targetDomain || passwordWebsite.includes(targetDomain) || passwordWebsite === targetDomain;
        } catch {
            return passwordWebsite.includes(targetDomain) || passwordWebsite === targetDomain;
        }
    }

    private mapPasswordItemToEntry(item: PasswordItem): PasswordEntry {
        return {
            id: item.id,
            cid: item.cid,
            url: item.url,
            website: item.publicData?.website,
            username: item.publicData?.username,
            publicData: item.publicData,
            zelfProofQRCode: item.zelfProofQRCode,
            zelfProof: item.zelfProof,
            createdAt: item.createdAt,
        };
    }

    public async initSession(): Promise<any> {
        if (this.hasValidToken()) return { data: { token: this._accessToken } };

        const { wallet } = await this.getAllWalletsFromStorage();

        if (!wallet?.publicData?.ethAddress) {
            throw new Error("No wallet found in storage - user needs to authenticate first");
        }

        const tagName = wallet.tagName || wallet.name || null;
        const domain = wallet.domain || "zelf";

        // Prefer the canonical session identifier persisted by the in-app AuthService
        // (a device-fingerprint hash). This keeps the JWT identifier aligned with the
        // PGP session key the popout uses to encrypt requests. Only fall back to the
        // wallet's full tag name if the main app has never booted yet — and warn so we
        // can catch ordering issues.
        let identifier: string | null = null;

        try {
            if (this.browserApi?.has("storage")) {
                const stored = await (this.browserApi.storage as any).local.get(["sessionIdentifier"]);
                identifier = stored?.sessionIdentifier || null;
            }
        } catch (error) {
            Logger.warn("Could not read sessionIdentifier from storage:", error);
        }

        if (!identifier) {
            identifier = wallet.fullTagName || wallet.publicData?.ethAddress || null;

            Logger.warn(
                "BackgroundCredentialManager.initSession: sessionIdentifier missing in storage, falling back to wallet tag identifier",
                { fallbackIdentifier: identifier }
            );
        }

        const url = `${this.API_BASE_URL}/api/sessions`;
        const payload: any = {
            address: wallet.publicData.ethAddress,
            identifier: identifier || wallet.publicData.ethAddress, // Fallback to ethAddress if no identifier
        };

        if (tagName) payload.tagName = tagName;
        if (domain) payload.domain = domain;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Session initialization failed: ${response.status} ${response.statusText}`);
        }

        const responseData = await response.json();

        if (responseData?.data?.token) {
            // Handle both Unix timestamp (seconds) and milliseconds formats
            const expiresAt = responseData.data.expiresAt;

            if (expiresAt) {
                // If expiresAt is a Unix timestamp (seconds), convert to milliseconds
                this._accessTokenExpiry = expiresAt < 1e12 ? expiresAt * 1000 : expiresAt;
            } else {
                // Default to 24 hours if not provided
                this._accessTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
            }

            this._accessToken = responseData.data.token;

            await this.setAccessTokenToStorage();
        }

        return responseData;
    }

    /**
     * Get all wallets from storage (replicating getAllWalletsFromStorage from Angular service)
     * Matches the pattern from WalletService.getAllWalletsFromStorage()
     * Uses TagModel for consistent data structure
     */
    private async getAllWalletsFromStorage(): Promise<{ wallet: TagModel | null; wallets: TagModel[] }> {
        try {
            if (!this.browserApi?.has("storage")) return { wallet: null, wallets: [] };

            const result = await (this.browserApi.storage as any).local.get(["wallet", "wallets"]);

            // Convert raw data to TagModel instances
            const wallet = result.wallet ? new TagModel(result.wallet) : null;
            const wallets = (result.wallets || []).map((w: any) => new TagModel(w));

            // Check if wallet has valid publicData with ethAddress (matching WalletService pattern)
            if (!wallet?.publicData?.ethAddress && !wallet?.publicData?.tagName) {
                if (!wallets.length) return { wallet, wallets: [] };

                // Set first wallet as current if no current wallet
                const firstWallet = wallets[0];

                await (this.browserApi.storage as any).local.set({ wallet: firstWallet });

                return { wallet: firstWallet, wallets };
            }

            return { wallet, wallets };
        } catch (error) {
            Logger.error("Error getting wallets from storage:", error);

            return { wallet: null, wallets: [] };
        }
    }

    public async listStoredPasswords(): Promise<ZelfKeysListResponse> {
        const accessToken = await this.getAccessToken();

        if (!accessToken) throw new Error("Unable to authenticate with ZelfKey API");

        return this.makeApiCall("GET", `${this.ZELF_KEYS_ROUTE}/list?category=password`);
    }

    public async getPasswords(website: string): Promise<PasswordEntry[]> {
        try {
            const response = await this.listStoredPasswords();
            const data = response?.data?.data || [];

            return this.filterPasswordsByWebsite(data, website);
        } catch (error) {
            Logger.error("Error getting passwords:", error);
            return [];
        }
    }

    /**
     * Make API call with authentication (replicating HttpWrapperService behavior)
     */
    private async makeApiCall(method: string, endpoint: string, data?: any): Promise<any> {
        const accessToken = await this.getAccessToken();

        if (!accessToken) throw new Error("No valid JWT token available");

        const url = `${this.API_BASE_URL}${endpoint}`;

        const options: RequestInit = {
            method,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        };

        if (data && (method === "POST" || method === "PUT")) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);

        if (!response.ok) throw new Error(`API call failed: ${response.status} ${response.statusText}`);

        return await response.json();
    }

    /**
     * Store a new password
     */
    public async storePassword(passwordData: any): Promise<boolean> {
        try {
            await this.initSession();

            const accessToken = await this.getAccessToken();

            if (!accessToken) {
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
