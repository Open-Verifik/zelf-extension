import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { HttpWrapperService } from "../http-wrapper.service";

/**
 * Interface for storing a password via ZelfKeys API
 */
export interface StorePasswordRequest {
    website: string; // Website name (e.g., "Stripe")
    username: string; // Account name (e.g., "miguel@verifik.co")
    password: string; // Password
    folder?: string;
    insideFolder?: boolean;
    notes?: string;
    faceBase64: string; // Encrypted face image from biometrics
    masterPassword: string; // Wallet master password (encrypted)
}

/**
 * Interface for storing a ZOTP via ZelfKeys API
 */
export interface StoreZOTPRequest {
    username: string; // Account name (e.g., "miguel@verifik.co")
    setupKey: string; // TOTP setup key (secret)
    issuer: string; // Issuer name (e.g., "Stripe")
    folder?: string;
    insideFolder?: boolean;
    faceBase64: string; // Encrypted face image from biometrics
    masterPassword: string; // Wallet master password (encrypted)
}

/**
 * Interface for retrieving encrypted data
 */
export interface RetrieveRequest {
    zelfProof: string; // Wallet zelfProof
    faceBase64: string; // Encrypted face image from biometrics
    password?: string; // Optional password for additional security
}

/**
 * Interface for previewing encrypted data (metadata only)
 */
export interface PreviewRequest {
    zelfProof: string; // Wallet zelfProof
    faceBase64: string; // Encrypted face image from biometrics
}

/**
 * Interface for listing stored items
 */
export interface ListRequest {
    category: "password" | "notes" | "credit_card" | "contact" | "zotp";
}

/**
 * Service for interacting with ZelfKeys API
 * Handles storage, retrieval, and management of encrypted passwords/ZOTPs
 */
@Injectable({
    providedIn: "root",
})
export class ZelfKeysService {
    private readonly baseUrl: string = environment.apiUrl;
    private readonly apiPath: string = "/api/zelf-keys";

    constructor(private _httpWrapper: HttpWrapperService) {}

    /**
     * Store a password in ZelfKeys
     * @param request - Store password request with all required fields
     * @returns Promise with the stored item response (wrapped in { data })
     */
    async storePassword(request: StorePasswordRequest): Promise<any> {
        const url = `${this.baseUrl}${this.apiPath}/store/password`;

        return this._httpWrapper.sendRequest("post", url, request);
    }

    /**
     * Store a ZOTP in ZelfKeys
     * @param request - Store ZOTP request with all required fields
     * @returns Promise with the stored item response (wrapped in { data })
     */
    async storeZOTP(request: StoreZOTPRequest): Promise<any> {
        const url = `${this.baseUrl}${this.apiPath}/store/zotp`;

        return this._httpWrapper.sendRequest("post", url, request);
    }

    /**
     * Retrieve and decrypt a stored password/ZOTP
     * @param request - Retrieve request with zelfProof and faceBase64
     * @returns Promise with the decrypted data
     */
    async retrieve(request: RetrieveRequest): Promise<any> {
        const url = `${this.baseUrl}${this.apiPath}/retrieve`;

        return this._httpWrapper.sendRequest("post", url, request);
    }

    /**
     * Preview stored item metadata without decrypting
     * @param request - Preview request with zelfProof and faceBase64
     * @returns Promise with the preview data (metadata only)
     */
    async preview(request: PreviewRequest): Promise<any> {
        const url = `${this.baseUrl}${this.apiPath}/preview`;

        return this._httpWrapper.sendRequest("post", url, request);
    }

    /**
     * List all stored items in a category
     * @param category - Category to list (password, notes, credit_card, contact, zotp)
     * @returns Promise with the list of items
     */
    async list(category: "password" | "notes" | "credit_card" | "contact" | "zotp"): Promise<any> {
        const url = `${this.baseUrl}${this.apiPath}/list`;

        return this._httpWrapper.sendRequest("get", url, { category });
    }

    /**
     * List all ZOTPs (passwords with folder="ZOTP")
     * This is a convenience method that filters the password list
     * @param zelfProof - Wallet zelfProof for authentication
     * @param faceBase64 - Encrypted face image from biometrics
     * @returns Promise with the list of ZOTPs
     */
    async listZOTPs(zelfProof: string, faceBase64: string): Promise<any> {
        // First, get the preview list to see metadata without decrypting
        const previewRequest: PreviewRequest = {
            zelfProof,
            faceBase64,
        };

        // We'll need to use the list endpoint and then filter by folder
        // For now, we'll use the list endpoint and filter client-side
        const response = await this.list("password");

        if (!response?.data || !Array.isArray(response.data)) {
            return { data: [] };
        }

        // Filter items where folder is "ZOTP"
        const zotps = response.data.filter((item: any) => item.folder === "ZOTP");

        return { data: zotps };
    }

    /**
     * Delete a ZelfKey by ID
     * @param id - IPFS ID of the ZelfKey to delete
     * @param faceBase64 - Encrypted face image from biometrics
     * @param masterPassword - Encrypted master password
     * @returns Promise with the deletion response
     */
    async delete(id: string, faceBase64: string, masterPassword: string): Promise<any> {
        const url = `${this.baseUrl}${this.apiPath}/delete/${id}`;

        return this._httpWrapper.sendRequest("put", url, {
            faceBase64,
            masterPassword,
        });
    }
}
