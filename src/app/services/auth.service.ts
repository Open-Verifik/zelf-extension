import moment from "moment";

import { HttpClient, HttpContext } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { ChromeService } from "app/chrome.service";
import { DISABLE_GLOBAL_EXCEPTION_HANDLING } from "app/interceptors/interceptor.model";
import { TagModel } from "app/tags.service";
import { WalletService } from "app/wallet.service";
import { environment } from "environments/environment";
import { generateUniqueFingerprint, simpleHash } from "app/core/utils/fingerprint.util";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    private _accessToken: string = "";
    private _accessTokenExpiresAt: number = 0;

    constructor(
        private _chromeService: ChromeService,
        private _httpClient: HttpClient,
        private _walletService: WalletService
    ) {
    }

    private async _requestAuthToken(
        fingerprint: string,
        tagName?: string | null,
        domain?: string | null,
        ethAddress?: string | null,
        killSession: boolean = false
    ): Promise<{ data: { token: string; expiresAt: number } }> {
        const payload: any = {
            identifier: simpleHash(fingerprint),
        };

        // Include tagName and domain if available
        if (domain) payload.domain = domain;
        if (ethAddress) payload.ethAddress = ethAddress;
        if (killSession) payload.killSession = 1;
        if (tagName) payload.tagName = tagName;

        return await _request(
            this._httpClient.post(`${environment.apiUrl}/api/sessions`, payload, {
                headers: {},
                context: new HttpContext().set(DISABLE_GLOBAL_EXCEPTION_HANDLING, true),
            })
        );
    }

    private _isValidToken(): boolean {
        if (!this._accessToken || !this._accessTokenExpiresAt) return false;

        return moment.unix(this._accessTokenExpiresAt).local().isAfter(moment());
    }

    getJwtSessionTag(token: string): { tagName: string | null; domain: string | null } {
        try {
            const payloadPart = token.split(".")[1];
            if (!payloadPart) return { tagName: null, domain: null };

            const payload = JSON.parse(atob(payloadPart.replace(/-/g, "+").replace(/_/g, "/")));

            return {
                tagName: payload?.tagName ?? null,
                domain: payload?.domain ?? null,
            };
        } catch {
            return { tagName: null, domain: null };
        }
    }

    getJwtIdentifier(token: string): string | null {
        try {
            const payloadPart = token.split(".")[1];
            if (!payloadPart) return null;

            const payload = JSON.parse(atob(payloadPart.replace(/-/g, "+").replace(/_/g, "/")));

            return payload?.identifier ?? null;
        } catch {
            return null;
        }
    }

    private async _resolveWalletParams(): Promise<{ tagName: string | null; domain: string | null; ethAddress: string | null }> {
        let tagName: string | null = null;
        let domain: string | null = null;
        let ethAddress: string | null = null;

        try {
            const currentWallet = await this._walletService.getCurrentWallet();

            if (currentWallet) {
                tagName = currentWallet.tagName || currentWallet.name || null;
                domain = currentWallet.publicData?.domain || "zelf";
                ethAddress = currentWallet.publicData?.ethAddress || null;
            } else {
                domain = "zelf";
            }
        } catch (error) {
            console.warn("Could not get current wallet for token generation:", error);
            domain = "zelf";
        }

        return { tagName, domain, ethAddress };
    }

    private async _persistSession(
        token: string,
        expiresAt: number,
        sessionIdentifier: string
    ): Promise<void> {
        this._accessToken = token;
        this._accessTokenExpiresAt = expiresAt;

        await this._chromeService.setItem("accessToken", token);
        await this._chromeService.setItem("accessTokenExpiresAt", expiresAt);
        await this._chromeService.setItem("sessionIdentifier", sessionIdentifier);
    }

    jwtMatchesCurrentWallet(token: string, wallet: Partial<TagModel> | null | undefined): boolean {
        if (!token || !wallet) return false;

        const jwtTag = this.getJwtSessionTag(token);
        const walletTagName = (wallet.tagName || wallet.name || "").trim().toLowerCase();
        const walletDomain = (wallet.publicData?.domain || "zelf").trim().toLowerCase();
        const jwtTagName = (jwtTag.tagName || "").trim().toLowerCase();
        const jwtDomain = (jwtTag.domain || "zelf").trim().toLowerCase();

        if (!walletTagName || !jwtTagName) return false;

        return walletTagName === jwtTagName && walletDomain === jwtDomain;
    }

    async ensureAccessTokenForCurrentWallet(options: { forceReauth?: boolean } = {}): Promise<string> {
        const { forceReauth = false } = options;

        if (!this._accessToken || !this._accessTokenExpiresAt) {
            this._accessToken = (await this._chromeService.getItem("accessToken")) || "";
            this._accessTokenExpiresAt = (await this._chromeService.getItem("accessTokenExpiresAt")) || 0;
        }

        const wallet = await this._walletService.getCurrentWallet();
        const tokenValid = this._isValidToken();
        const tokenMatchesWallet = tokenValid && this.jwtMatchesCurrentWallet(this._accessToken, wallet);

        if (!forceReauth && tokenMatchesWallet) {
            return this._accessToken;
        }

        if (tokenValid && !tokenMatchesWallet) {
            const jwtTag = this.getJwtSessionTag(this._accessToken);
            console.log("[Zelf Keys] JWT mismatch — reauthing", {
                storageTag: wallet?.tagName || wallet?.name || null,
                jwtTag: jwtTag.tagName,
            });
        }

        return this.reauthenticateSession();
    }

    async checkAccessToken(): Promise<string> {
        if (!this._accessToken || !this._accessTokenExpiresAt) {
            this._accessToken = (await this._chromeService.getItem("accessToken")) || "";
            this._accessTokenExpiresAt = (await this._chromeService.getItem("accessTokenExpiresAt")) || 0;
        }

        const isValidToken = this._isValidToken();

        if (isValidToken) {
            // Detect identifier drift between the stored JWT and the current device fingerprint
            // (e.g. background script may have created a session under a different identifier).
            // When they don't match, the PGP session key the client uses to encrypt requests will
            // not match the private key the backend looks up by JWT identifier → 412/409 errors.
            const { tagName, domain, ethAddress } = await this._resolveWalletParams();
            const expectedIdentifier = simpleHash(generateUniqueFingerprint(ethAddress, tagName, domain));
            const jwtIdentifier = this.getJwtIdentifier(this._accessToken);

            if (jwtIdentifier && jwtIdentifier !== expectedIdentifier) {
                console.log("[Zelf Keys] session identifier mismatch — reauthing", {
                    jwtIdentifier,
                    expectedIdentifier,
                });

                return this.reauthenticateSession();
            }

            return this._accessToken;
        }

        const { tagName, domain, ethAddress } = await this._resolveWalletParams();

        try {
            const fingerprint = generateUniqueFingerprint(ethAddress, tagName, domain);
            const sessionIdentifier = simpleHash(fingerprint);
            const newAuthToken = await this._requestAuthToken(fingerprint, tagName, domain, ethAddress);

            await this._persistSession(newAuthToken.data.token, newAuthToken.data.expiresAt, sessionIdentifier);

            return this._accessToken;
        } catch (error) {
            this._accessToken = "";
            this._accessTokenExpiresAt = 0;

            await this._chromeService.removeItem("accessToken");
            await this._chromeService.removeItem("accessTokenExpiresAt");
            await this._chromeService.removeItem("sessionIdentifier");

            throw error;
        }
    }

    async reauthenticateSession(): Promise<string> {
        const { tagName, domain, ethAddress } = await this._resolveWalletParams();

        const fingerprint = generateUniqueFingerprint(ethAddress, tagName, domain);
        const sessionIdentifier = simpleHash(fingerprint);
        const newAuthToken = await this._requestAuthToken(fingerprint, tagName, domain, ethAddress, true);

        await this._persistSession(newAuthToken.data.token, newAuthToken.data.expiresAt, sessionIdentifier);

        return this._accessToken;
    }
}

const _request = async (httpCall: any): Promise<any> => {
    try {
        return await httpCall.toPromise();
    } catch (error: any) {
        throw error;
    }
};
