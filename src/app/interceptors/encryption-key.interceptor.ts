import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { catchError, from, lastValueFrom, throwError } from "rxjs";

import { environment } from "environments/environment";
import { ChromeService } from "app/chrome.service";
import { HttpWrapperService } from "app/http-wrapper.service";
import { WalletService } from "app/wallet.service";
import { generateUserFingerprint } from "app/core/utils/fingerprint.util";

/**
 * Interceptor to handle encryption key mismatch errors (412)
 * When the server returns a 412 error with "encryption_key_didnt_match",
 * this interceptor will refresh the public key and retry the request
 */
@Injectable()
export class EncryptionKeyInterceptor implements HttpInterceptor {
    private _isRefreshing = false;
    private _refreshPromise: Promise<void> | null = null;

    constructor(
        private _chromeService: ChromeService,
        private _httpWrapperService: HttpWrapperService,
        private _walletService: WalletService
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return from(this.handle(req, next));
    }

    async handle(req: HttpRequest<any>, next: HttpHandler) {
        try {
            return await lastValueFrom(
                next.handle(req).pipe(
                    catchError((error: HttpErrorResponse) => {
                        // Check if this is a 412 encryption key mismatch error
                        if (this._isEncryptionKeyError(error)) {
                            return from(this._handleEncryptionKeyError(req, next));
                        }
                        return throwError(() => error);
                    })
                )
            );
        } catch (error) {
            throw error;
        }
    }

    /**
     * Check if the error is a 412 encryption key mismatch
     */
    private _isEncryptionKeyError(error: HttpErrorResponse): boolean {
        if (error.status !== 412) return false;

        // Check both error.error.message and error.message
        // Backend returns: { message: "encryption_key_didnt_match", code: "PreconditionFailed" }
        const errorMessage = error.error?.message || error.message || "";

        // Only catch this specific error, not all 412 errors
        return errorMessage.includes("encryption_key_didnt_match");
    }

    /**
     * Handle encryption key error by refreshing the public key and retrying
     */
    private async _handleEncryptionKeyError(req: HttpRequest<any>, next: HttpHandler): Promise<any> {
        // If already refreshing, wait for that to complete
        if (this._isRefreshing && this._refreshPromise) {
            await this._refreshPromise;
            return lastValueFrom(next.handle(req));
        }

        // Start refreshing
        this._isRefreshing = true;
        this._refreshPromise = this._refreshPublicKey();

        try {
            await this._refreshPromise;

            // Retry the original request with the new public key
            return await lastValueFrom(next.handle(req));
        } catch (refreshError) {
            console.error("Failed to refresh public key:", refreshError);
            throw refreshError;
        } finally {
            this._isRefreshing = false;
            this._refreshPromise = null;
        }
    }

    /**
     * Refresh the public key by fetching it from the server
     * This mirrors the logic in session-initializer.provider.ts
     */
    private async _refreshPublicKey(): Promise<void> {
        const apiUrl = environment.apiUrl;

        // Get wallet data for unique fingerprint
        let walletAddress: string | null = null;
        let tagName: string | null = null;
        let domain: string | null = null;

        try {
            const currentWallet = await this._walletService.getCurrentWallet();
            if (currentWallet) {
                walletAddress = currentWallet.publicData?.ethAddress || null;
                tagName = currentWallet.tagName || currentWallet.name || null;
                domain = currentWallet.publicData?.domain || "zelf";
            }
        } catch (error) {
            console.warn("Could not get wallet for fingerprint during refresh:", error);
        }

        // Generate the same unique identifier used for session
        const { hash } = generateUserFingerprint(walletAddress, tagName, domain);

        const url = `${apiUrl}/api/sessions/yek-cilbup`;

        try {
            const response = await this._httpWrapperService.sendRequest("get", url, {
                identifier: hash,
            });

            const publicKey = response.data;

            // Update the stored public key
            await this._chromeService.setItem("publicKey", publicKey);
            this._httpWrapperService.setPublicKey(publicKey);
        } catch (error) {
            console.error("Error refreshing public key:", error);
            throw error;
        }
    }
}
