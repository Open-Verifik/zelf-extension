import { Injectable } from "@angular/core";
import { ChromeService } from "../chrome.service";
import { ZOTP } from "../models/zotp.model";
import { ZelfKeysService } from "./zelf-keys.service";

@Injectable({
    providedIn: "root",
})
export class ZOTPService {
    private readonly STORAGE_KEY = "zotps"; // Local cache for performance
    private _cache: ZOTP[] | null = null; // In-memory cache

    constructor(
        private _chromeService: ChromeService,
        private _zelfKeysService: ZelfKeysService
    ) {}

    /**
     * Load ZOTPs from ZelfKeys API and update local cache
     * @param zelfProof - Wallet zelfProof
     * @param faceBase64 - Encrypted face image from biometrics
     */
    async loadZOTPsFromZelfKeys(zelfProof: string, faceBase64: string): Promise<ZOTP[]> {
        try {
            const response = await this._zelfKeysService.listZOTPs(zelfProof, faceBase64);
            const zotps: ZOTP[] = [];

            if (response?.data && Array.isArray(response.data)) {
                // Map ZelfKeys response to ZOTP format
                for (const item of response.data) {
                    const zotp: ZOTP = {
                        id: item.id || this.generateId(),
                        name: item.username || "",
                        secret: item.password || "", // This is encrypted in ZelfKeys
                        issuer: item.website || undefined,
                        algorithm: "SHA1", // Default, could be stored in notes
                        digits: 6, // Default
                        period: 30, // Default
                        createdAt: item.createdAt || Date.now(),
                        updatedAt: item.updatedAt || Date.now(),
                        isDecrypted: false,
                        zelfProof: zelfProof,
                        zelfKeysId: item.id,
                    };

                    // Parse additional metadata from notes if available
                    if (item.notes) {
                        try {
                            const notes = JSON.parse(item.notes);
                            if (notes.algorithm) zotp.algorithm = notes.algorithm;
                            if (notes.digits) zotp.digits = notes.digits;
                            if (notes.period) zotp.period = notes.period;
                        } catch {
                            // Notes is not JSON, ignore
                        }
                    }

                    zotps.push(zotp);
                }
            }

            // Update local cache
            this._cache = zotps;
            await this._chromeService.setItem(this.STORAGE_KEY, zotps);

            return zotps;
        } catch (error) {
            console.error("Error loading ZOTPs from ZelfKeys:", error);
            // Fallback to local cache if API fails
            return this.getAllZOTPs();
        }
    }

    /**
     * Store ZOTP to ZelfKeys API
     * @param zotp - ZOTP to store
     * @param faceBase64 - Encrypted face image from biometrics
     * @param masterPassword - Encrypted master password
     */
    async storeZOTPToZelfKeys(zotp: ZOTP, faceBase64: string, masterPassword: string): Promise<ZOTP> {
        if (!zotp.zelfProof) {
            throw new Error("zelfProof is required to store ZOTP");
        }

        // Map ZOTP to ZelfKeys ZOTP format (using the new /store/zotp endpoint)
        const storeRequest = {
            username: zotp.name,
            setupKey: zotp.secret, // Plain secret (will be encrypted by API)
            issuer: zotp.issuer || "Unknown",
            folder: "ZOTP",
            insideFolder: false,
            faceBase64: faceBase64,
            masterPassword: masterPassword, // Encrypted master password
        };

        try {
            const response = await this._zelfKeysService.storeZOTP(storeRequest);

            // Response structure: { data: { zelfProof, zelfProofQRCode, ipfs, type, message } }
            const responseData = response?.data || {};

            // Update ZOTP with full response data
            const updatedZotp: ZOTP = {
                ...zotp,
                zelfKeysId: responseData.ipfs?.id || zotp.zelfKeysId,
                zelfProofQRCode: responseData.zelfProofQRCode || zotp.zelfProofQRCode,
                ipfs: responseData.ipfs || zotp.ipfs,
                createdAt: responseData.ipfs?.created_at ? new Date(responseData.ipfs.created_at).getTime() : zotp.createdAt,
                updatedAt: responseData.ipfs?.updated_at ? new Date(responseData.ipfs.updated_at).getTime() : Date.now(),
            };

            // Save full response to localStorage and update cache
            await this._saveFullResponseToStorage(updatedZotp, responseData);

            return updatedZotp;
        } catch (error) {
            console.error("Error storing ZOTP to ZelfKeys:", error);
            throw error;
        }
    }

    /**
     * Retrieve decrypted secret from ZelfKeys
     * @param zotp - ZOTP to retrieve
     * @param faceBase64 - Encrypted face image from biometrics
     */
    async retrieveZOTPSecret(zotp: ZOTP, faceBase64: string): Promise<string> {
        if (!zotp.zelfProof) {
            throw new Error("zelfProof is required to retrieve ZOTP");
        }

        try {
            const response = await this._zelfKeysService.retrieve({
                zelfProof: zotp.zelfProof,
                faceBase64: faceBase64,
            });

            // Find the specific ZOTP in the response
            // The response should contain the decrypted password
            if (response?.data) {
                // If response is an array, find by zelfKeysId
                if (Array.isArray(response.data)) {
                    const item = response.data.find((item: any) => item.id === zotp.zelfKeysId);
                    return item?.password || "";
                }
                // If response is a single item
                return response.data.password || "";
            }

            throw new Error("No data returned from ZelfKeys");
        } catch (error) {
            console.error("Error retrieving ZOTP secret:", error);
            throw error;
        }
    }

    /**
     * Get all ZOTPs from local cache
     */
    async getAllZOTPs(): Promise<ZOTP[]> {
        if (this._cache) {
            return this._cache;
        }

        const zotps = await this._chromeService.getItem<ZOTP[]>(this.STORAGE_KEY);
        this._cache = zotps || [];

        return this._cache;
    }

    async getZOTP(id: string): Promise<ZOTP | null> {
        const zotps = await this.getAllZOTPs();

        return zotps.find((z) => z.id === id) || null;
    }

    /**
     * Save ZOTP to local cache (for backward compatibility during transition)
     * Note: For new ZOTPs, use storeZOTPToZelfKeys instead
     */
    async saveZOTP(zotp: ZOTP): Promise<void> {
        const zotps = await this.getAllZOTPs();
        const existingIndex = zotps.findIndex((z) => z.id === zotp.id);

        if (existingIndex >= 0) {
            zotps[existingIndex] = { ...zotp, updatedAt: Date.now() };
        } else {
            zotps.push({
                ...zotp,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
        }

        this._cache = zotps;
        await this._chromeService.setItem(this.STORAGE_KEY, zotps);
    }

    /**
     * Add ZOTP to local cache
     */
    private async _addToCache(zotp: ZOTP): Promise<void> {
        const zotps = await this.getAllZOTPs();
        const existingIndex = zotps.findIndex((z) => z.id === zotp.id || z.zelfKeysId === zotp.zelfKeysId);

        if (existingIndex >= 0) {
            zotps[existingIndex] = { ...zotp, updatedAt: Date.now() };
        } else {
            zotps.push({
                ...zotp,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
        }

        this._cache = zotps;
        await this._chromeService.setItem(this.STORAGE_KEY, zotps);
    }

    async deleteZOTP(id: string): Promise<void> {
        const zotps = await this.getAllZOTPs();
        const filtered = zotps.filter((z) => z.id !== id);

        this._cache = filtered;
        await this._chromeService.setItem(this.STORAGE_KEY, filtered);
    }

    async searchZOTPs(query: string): Promise<ZOTP[]> {
        const zotps = await this.getAllZOTPs();
        const lowerQuery = query.toLowerCase().trim();

        if (!lowerQuery) return zotps;

        return zotps.filter((z) => {
            const nameMatch = z.name.toLowerCase().includes(lowerQuery);
            const issuerMatch = z.issuer?.toLowerCase().includes(lowerQuery);

            return nameMatch || issuerMatch;
        });
    }

    generateId(): string {
        return `zotp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Clear local cache (useful for forcing refresh)
     */
    clearCache(): void {
        this._cache = null;
    }

    /**
     * Save full backend response to localStorage
     * @param zotp - Updated ZOTP object
     * @param responseData - Full response data from backend
     */
    private async _saveFullResponseToStorage(zotp: ZOTP, responseData: any): Promise<void> {
        try {
            // Save the full response data to a separate storage key for reference
            const responseKey = `zotp_response_${zotp.id}`;
            await this._chromeService.setItem(responseKey, {
                zotpId: zotp.id,
                zelfKeysId: zotp.zelfKeysId,
                response: responseData,
                savedAt: Date.now(),
            });

            // Update local cache with the ZOTP (which includes all response data)
            await this._addToCache(zotp);
        } catch (error) {
            console.error("Error saving full response to storage:", error);
            // Don't throw - this is supplementary data
        }
    }
}
