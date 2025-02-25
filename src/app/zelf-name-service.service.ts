import { Injectable } from "@angular/core";

import { environment } from "../environments/environment";
import { HttpWrapperService } from "./http-wrapper.service";
import { ChromeService } from "./chrome.service";

@Injectable({
    providedIn: "root",
})
export class ZelfNameService {
    baseUrl: String = environment.apiUrl;
    variables: any;

    constructor(private _httpWrapper: HttpWrapperService, private _chromeService: ChromeService) {
        this.variables = {
            zelfName: null,
            price: 0,
            zelfFile: null,
            zelfProof: null,
            duration: 1,
        };
    }

    async cleanVariables(): Promise<void> {
        const keys = ["zelfProof", "zelfFile", "zelfName", "zelfPrice", "zelfReward", "duration", "accessToken"];

        await Promise.all(
            keys.map(async (key) => {
                return this._chromeService.removeItem(key);
            })
        );
    }

    searchZelfName(key = "zelfName", value: string, captchaToken?: string): Promise<any> {
        const query: { key: string; value: string; captchaToken?: string } = { key, value };

        if (captchaToken) {
            query.captchaToken = captchaToken;
        }

        return this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/zelf-name-service/search`, query);
    }

    previewZelfName(zelfName?: string, captchaToken?: string): Promise<any> {
        const query: { zelfName?: string; captchaToken?: string } = { zelfName };

        if (captchaToken) {
            query.captchaToken = captchaToken;
        }

        return this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/zelf-name-service/search`, query);
    }

    previewZelfProof(zelfProof: string, captchaToken?: string): Promise<any> {
        const query: { zelfProof: string; os: string; captchaToken?: string } = { zelfProof, os: "DESKTOP" };

        if (captchaToken) {
            query.captchaToken = captchaToken;
        }

        return this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/zelf-name-service/preview-zelfproof`, query);
    }

    async setZelfName(zelfName: string, priceObject: any = {}): Promise<void> {
        this.variables.zelfName = zelfName;

        const setPromise = zelfName ? this._chromeService.setItem("zelfName", zelfName) : this._chromeService.removeItem("zelfName");

        setPromise.then(() => {
            if (!priceObject) return;

            this.variables.price = priceObject.price;
            this.variables.reward = priceObject.reward;

            this._chromeService.setItem("zelfPrice", priceObject.price);
            this._chromeService.setItem("zelfReward", priceObject.reward);
        });
    }

    setZelfFile(zelfNameObject: any): void {
        this.variables.zelfFile = zelfNameObject;
    }

    setZelfProof(zelfProof: string): void {
        this.variables.zelfProof = zelfProof;
    }

    async setDuration(duration: any): Promise<void> {
        this.variables.duration = duration;

        await this._chromeService.setItem("duration", duration);
    }

    async setReferral(referralZelfName: string): Promise<void> {
        await this._chromeService.setItem("referralZelfName", referralZelfName);
    }

    async getReferral(): Promise<any> {
        return await this._chromeService.getItem("referralZelfName");
    }

    async getZelfName(): Promise<string> {
        return this.variables.zelfName || (await this._chromeService.getItem("zelfName"));
    }

    async getZelfPrice(): Promise<any> {
        return this.variables.price || (await this._chromeService.getItem("zelfPrice"));
    }

    async getZelfReward(): Promise<any> {
        return this.variables.reward || (await this._chromeService.getItem("zelfReward"));
    }

    async getDuration(): Promise<any> {
        return this.variables.duration || (await this._chromeService.getItem("duration"));
    }

    getZelfFile(): string {
        return this.variables.zelfFile;
    }

    getZelfProof(): string {
        return this.variables.zelfProof;
    }

    leaseZelfName(payload: any): Promise<any> {
        return this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/zelf-name-service/v2/lease`, payload);
    }

    decryptZelfName(payload: any): Promise<any> {
        return this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/zelf-name-service/decrypt`, payload);
    }
}
