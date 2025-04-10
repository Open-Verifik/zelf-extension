import moment from "moment";

import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import type { ResolveFn } from "@angular/router";

import { ChromeService } from "app/chrome.service";
import { environment } from "environments/environment";

export const JWTResolver: ResolveFn<boolean> = async () => {
    const _chromeService = inject(ChromeService);
    const _httpClient = inject(HttpClient);

    await _getAccessToken(_chromeService, _httpClient);

    return true;
};

const _getAccessToken = async (_chromeService: ChromeService, _httpClient: HttpClient): Promise<void> => {
    const authToken: string = (await _chromeService.getItem("accessToken")) || "";
    const accessTokenExpiresAt = (await _chromeService.getItem("accessTokenExpiresAt")) || 0;
    const isTokenExpired = moment.utc(accessTokenExpiresAt * 1000).isBefore(moment.utc());

    if (!authToken || !accessTokenExpiresAt || isTokenExpired) {
        const fingerprintParts = [
            navigator.userAgent, // Browser and OS info
            navigator.language, // Primary language
            screen.colorDepth.toString(), // Screen color depth
            screen.width.toString(), // Screen width
            screen.height.toString(), // Screen height
            navigator.platform, // Platform/OS
            navigator.hardwareConcurrency.toString(), // Number of CPU cores
            Intl.DateTimeFormat().resolvedOptions().timeZone, // Timezone
        ];

        // Join all parts and create a simple hash
        const uniqueString = fingerprintParts.join("|");

        const newAuthToken = await _request(
            _httpClient.post(
                `${environment.apiUrl}/api/sessions`,
                {
                    identifier: _simpleHash(uniqueString),
                },
                { headers: {} }
            )
        );

        await _chromeService.setItem("accessToken", newAuthToken.data.token);
        await _chromeService.setItem("accessTokenExpiresAt", newAuthToken.data.expiresAt);
    }
};

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
        hash = hash & hash; // Convert to 32bit integer
    }

    return hash.toString();
};
