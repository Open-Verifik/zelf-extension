import * as openpgp from "openpgp";

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { ChromeService } from "./chrome.service";
import moment from "moment";
import { environment } from "environments/environment";

@Injectable({
    providedIn: "root",
})
export class HttpWrapperService {
    private publicKey!: string;

    public tail: Array<any> = [];

    get progress(): boolean {
        return !!this.tail.length;
    }

    constructor(private _http: HttpClient, private _chromeService: ChromeService) {}

    async _getAccessToken(): Promise<string> {
        const authToken: string = (await this._chromeService.getItem("accessToken")) || "";
        const accessTokenExpiresAt = (await this._chromeService.getItem("accessTokenExpiresAt")) || 0;

        const isTokenExpired = moment.utc(accessTokenExpiresAt * 1000).isBefore(moment.utc());

        // const diffInSeconds = moment.utc(accessTokenExpiresAt * 1000).diff(moment.utc(), "seconds");

        // const expirationDate = moment.utc(accessTokenExpiresAt * 1000).format("YYYY-MM-DD HH:mm:ss");

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

            const newAuthToken = await this.request(
                this._http.post(
                    `${environment.apiUrl}/api/sessions`,
                    {
                        identifier: this.simpleHash(uniqueString),
                    },
                    { headers: {} }
                )
            );

            await this._chromeService.setItem("accessToken", newAuthToken.data.token);

            await this._chromeService.setItem("accessTokenExpiresAt", newAuthToken.data.expiresAt);

            return newAuthToken.data.token;
        }

        return authToken;
    }

    private simpleHash(input: string): string {
        let hash = 0;

        if (input.length === 0) {
            return hash.toString();
        }

        for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);

            hash = (hash << 5) - hash + char;

            hash = hash & hash; // Convert to 32bit integer
        }

        return hash.toString();
    }

    /**
     * Send request
     * @param method - to determine which function we will be using
     * @param url - URL that we will be requesting information from
     * @param params - params that can go into the body or the query string param
     * @param options - headers or some other sort of params
     */
    async sendRequest<T = any>(method: string, url: string, params: any = {}, options: any = {}): Promise<any> {
        method = method.toLocaleLowerCase();

        const authToken = await this._getAccessToken();

        let headers: any = {
            timeout: 20,
        };

        if (authToken) {
            headers["Authorization"] = `Bearer ${authToken}`;
        }

        // Additional header or options logic here
        if (params.encryption) {
            // Handle encryption
        }

        try {
            switch (method) {
                case "get":
                    return this.request(this._http.get<T>(url, { params, headers, ...options }));
                case "post":
                    return this.request(this._http.post<T>(url, params, { headers, ...options }));
                case "put":
                    return this.request(this._http.put<T>(url, params, { headers, ...options }));
                case "delete":
                    return this.request(this._http.delete<T>(url, { headers, ...options }));
                default:
                    throw new Error("Method not provided or unsupported");
            }
        } catch (error) {
            console.error("Error in sendRequest:", error);
            throw error;
        }
    }

    // // Helper method to process HTTP requests (just an example of what it might look like)
    private request(httpCall: any): Promise<any> {
        return httpCall
            .toPromise()
            .then((response: any) => response)
            .catch((error: any) => {
                throw error;
            });
    }

    setPublicKey(publicKey: string): void {
        this.publicKey = publicKey;
    }

    async encryptMessage(data: string): Promise<any> {
        if (!data) return data;

        if (!this.publicKey) throw new Error("cannot_encrypt_message");

        const publicKey = await openpgp.readKey({ armoredKey: this.publicKey }); // armoredKey > quitarle la armadura

        const encryptedMessage = await openpgp.encrypt({
            message: await openpgp.createMessage({ text: data }),
            encryptionKeys: publicKey,
        });

        return encryptedMessage;
    }

    // async decryptMessage(encryptedMessage: string, privateKeyArmored: string, passphrase: string): Promise<string> {
    // 	// const privateKey = await openpgp.readKey({ armoredKey: privateKeyArmored });
    // 	// await privateKey.decrypt(passphrase);
    // 	// const message = await openpgp.readMessage({
    // 	// 	armoredMessage: encryptedMessage,
    // 	// });
    // 	// const { data: decrypted } = await openpgp.decrypt({
    // 	// 	message,
    // 	// 	decryptionKeys: privateKey,
    // 	// });
    // 	// return decrypted;
    // }
}
