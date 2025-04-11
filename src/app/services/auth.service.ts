import moment from "moment";

import { HttpClient, HttpContext } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { ChromeService } from "app/chrome.service";
import { DISABLE_GLOBAL_EXCEPTION_HANDLING } from "app/interceptors/interceptor.model";
import { environment } from "environments/environment";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    private _accessToken: string = "";
    private _accessTokenExpiresAt: number = 0;

    constructor(private _httpClient: HttpClient, private _chromeService: ChromeService) {}

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

    private async _requestAuthToken(fingerprint: string): Promise<{ data: { token: string; expiresAt: number } }> {
        return await _request(
            this._httpClient.post(
                `${environment.apiUrl}/api/sessions`,
                {
                    identifier: _simpleHash(fingerprint),
                },
                { headers: {}, context: new HttpContext().set(DISABLE_GLOBAL_EXCEPTION_HANDLING, true) }
            )
        );
    }

    async checkAccessToken(): Promise<string> {
        if (!this._accessToken || !this._accessTokenExpiresAt) {
            this._accessToken = (await this._chromeService.getItem("accessToken")) || "";
            this._accessTokenExpiresAt = (await this._chromeService.getItem("accessTokenExpiresAt")) || 0;
        }

        const isValidToken = this._isValidToken();

        if (isValidToken) return this._accessToken;

        const fingerprint = this._generateFingerprint();
        const newAuthToken = await this._requestAuthToken(fingerprint);

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
