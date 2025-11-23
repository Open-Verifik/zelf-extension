import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { HttpWrapperService } from "../http-wrapper.service";
import { AuthService } from "./auth.service";

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

    constructor(
        private _httpWrapper: HttpWrapperService,
        private _authService: AuthService
    ) {}

    /**
     * Retrieve a password (wrapper around generic retrieve for clarity)
     */
    async retrievePassword(zelfProof: string, faceBase64: string, password?: string): Promise<any> {
        const token = await this._authService.checkAccessToken();
        const payload: any = { zelfProof, faceBase64 };

        if (password) payload.password = password;

        return this._httpWrapper.sendRequest("post", `${this.baseUrl}${this.apiPath}/retrieve`, payload, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    /**
     * List passwords stored via ZelfKeys
     */
    async listPasswords(): Promise<any> {
        const token = await this._authService.checkAccessToken();
        return this._httpWrapper.sendRequest(
            "get",
            `${this.baseUrl}${this.apiPath}/list?category=password`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
    }

    /**
     * List notes stored via ZelfKeys
     */
    async listNotes(): Promise<any> {
        const token = await this._authService.checkAccessToken();
        return this._httpWrapper.sendRequest(
            "get",
            `${this.baseUrl}${this.apiPath}/list?category=notes`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
    }

    /**
     * Store encrypted notes
     */
    async storeNotes(request: {
        title: string;
        keyValuePairs: any;
        folder?: string;
        insideFolder?: boolean;
        faceBase64: string;
        masterPassword?: string;
        zelfProof?: string;
    }): Promise<any> {
        const token = await this._authService.checkAccessToken();
        return this._httpWrapper.sendRequest("post", `${this.baseUrl}${this.apiPath}/store/notes`, request, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }

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
        const token = await this._authService.checkAccessToken();
        const url = `${this.baseUrl}${this.apiPath}/retrieve`;
        return this._httpWrapper.sendRequest("post", url, request, {
            headers: { Authorization: `Bearer ${token}` },
        });
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
     * List all stored items, optionally filtered by category
     * @param category - Optional category to filter (password, notes, credit_card, contact, zotp). If omitted, returns all items.
     * @returns Promise with the list of items
     */
    async list(category?: "password" | "notes" | "credit_card" | "contact" | "zotp"): Promise<any> {
        const url = `${this.baseUrl}${this.apiPath}/list`;

        return this._httpWrapper.sendRequest("get", url, category ? { category } : {});
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
     * Store a password in ZelfKeys with auth header
     */
    async storePasswordWithAuth(request: StorePasswordRequest & { name?: string }): Promise<any> {
        const token = await this._authService.checkAccessToken();
        const url = `${this.baseUrl}${this.apiPath}/store/password`;

        return this._httpWrapper.sendRequest("post", url, request, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    /**
     * Store a credit card in ZelfKeys with auth header
     */
    async storeCreditCard(request: {
        cardName: string;
        cardNumber: string;
        expiryMonth: string;
        expiryYear: string;
        folder?: string;
        insideFolder?: boolean;
        cvv?: string;
        bankName?: string;
        faceBase64: string;
        masterPassword?: string;
        zelfProof?: string;
    }): Promise<any> {
        const token = await this._authService.checkAccessToken();
        const url = `${this.baseUrl}${this.apiPath}/store/credit-card`;
        return this._httpWrapper.sendRequest("post", url, request, {
            headers: { Authorization: `Bearer ${token}` },
        });
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

    /**
     * Parse category string to extract the category name
     * Example: "user.zelf_password" -> "password"
     * @param category - Full category string (e.g., "user.zelf_password")
     * @returns Parsed category name (everything after the last underscore)
     */
    static parseCategory(category: string | null | undefined): string | null {
        if (!category) return null;

        // Find the last underscore in the category string
        const lastUnderscoreIndex = category.lastIndexOf("_");

        if (lastUnderscoreIndex === -1) {
            // No underscore found, return the original category
            return category;
        }

        // Return everything after the last underscore
        return category.substring(lastUnderscoreIndex + 1);
    }
}
