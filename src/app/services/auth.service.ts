import moment from "moment";

import { HttpClient, HttpContext } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { ChromeService } from "app/chrome.service";
import { DISABLE_GLOBAL_EXCEPTION_HANDLING } from "app/interceptors/interceptor.model";
import { WalletService } from "app/wallet.service";
import { environment } from "environments/environment";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    private _accessToken: string = "";
    private _accessTokenExpiresAt: number = 0;

    constructor(
        private _httpClient: HttpClient,
        private _chromeService: ChromeService,
        private _walletService: WalletService
    ) {
        this._chromeService.onWalletChanged$.subscribe(async (wallet) => {
            if (!wallet) return;

            await this.reauthenticateSession();
        });
    }

    private _generateFingerprint(): string {
        const fingerprintParts = [
            navigator.userAgent,
            navigator.language,
            screen.colorDepth.toString(),
            screen.width.toString(),
            screen.height.toString(),
            navigator.platform,
            navigator.hardwareConcurrency.toString(),
            Intl.DateTimeFormat().resolvedOptions().timeZone,
        ];

        return fingerprintParts.join("|");
    }

    private _isValidToken(): boolean {
        if (!this._accessToken || !this._accessTokenExpiresAt) return false;

        return moment.unix(this._accessTokenExpiresAt).local().isAfter(moment());
    }

    private async _requestAuthToken(
        fingerprint: string,
        tagName?: string | null,
        domain?: string | null,
        killSession: boolean = false
    ): Promise<{ data: { token: string; expiresAt: number } }> {
        const payload: any = {
            identifier: _simpleHash(fingerprint),
        };

        // Include tagName and domain if available
        if (tagName) payload.tagName = tagName;
        if (domain) payload.domain = domain;
        if (killSession) payload.killSession = 1;

        return await _request(
            this._httpClient.post(`${environment.apiUrl}/api/sessions`, payload, {
                headers: {},
                context: new HttpContext().set(DISABLE_GLOBAL_EXCEPTION_HANDLING, true),
            })
        );
    }

    async checkAccessToken(): Promise<string> {
        if (!this._accessToken || !this._accessTokenExpiresAt) {
            this._accessToken = (await this._chromeService.getItem("accessToken")) || "";
            this._accessTokenExpiresAt = (await this._chromeService.getItem("accessTokenExpiresAt")) || 0;
        }

        const isValidToken = this._isValidToken();

        if (isValidToken) return this._accessToken;

        // Get current wallet to extract tagName and domain for new token
        let tagName: string | null = null;
        let domain: string | null = null;

        try {
            const currentWallet = await this._walletService.getCurrentWallet();

            if (currentWallet) {
                // Get tagName (without domain suffix, e.g., "miguel")
                tagName = currentWallet.tagName || currentWallet.name || null;

                // Get domain from publicData, default to "zelf" if not available
                domain = currentWallet.publicData?.domain || "zelf";
            } else {
                // No wallet available, use default domain
                domain = "zelf";
            }
        } catch (error) {
            // If wallet service fails, use default domain
            console.warn("Could not get current wallet for token generation:", error);
            domain = "zelf";
        }

        const fingerprint = this._generateFingerprint();
        const newAuthToken = await this._requestAuthToken(fingerprint, tagName, domain);

        this._accessToken = newAuthToken.data.token;
        this._accessTokenExpiresAt = newAuthToken.data.expiresAt;

        await this._chromeService.setItem("accessToken", newAuthToken.data.token);
        await this._chromeService.setItem("accessTokenExpiresAt", newAuthToken.data.expiresAt);

        return this._accessToken;
    }

    async reauthenticateSession(): Promise<string> {
        let tagName: string | null = null;
        let domain: string | null = null;

        try {
            const currentWallet = await this._walletService.getCurrentWallet();

            if (currentWallet) {
                tagName = currentWallet.tagName || currentWallet.name || null;
                domain = currentWallet.publicData?.domain || "zelf";
            } else {
                domain = "zelf";
            }
        } catch (error) {
            domain = "zelf";
        }

        const fingerprint = this._generateFingerprint();
        const newAuthToken = await this._requestAuthToken(fingerprint, tagName, domain, true);

        this._accessToken = newAuthToken.data.token;
        this._accessTokenExpiresAt = newAuthToken.data.expiresAt;

        await this._chromeService.setItem("accessToken", newAuthToken.data.token);
        await this._chromeService.setItem("accessTokenExpiresAt", newAuthToken.data.expiresAt);

        return this._accessToken;
    }
}

const _request = async (httpCall: any): Promise<any> => {
    return httpCall
        .toPromise()
        .then((response: any) => response)
        .catch((error: any) => {
            throw error;
        });
};

const _simpleHash = (input: string): string => {
    let hash = 0;

    if (input.length === 0) return hash.toString();

    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);

        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }

    return hash.toString();
};
