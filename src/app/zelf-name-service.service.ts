import { Injectable } from "@angular/core";

import { environment } from "../environments/environment";
import { HttpWrapperService } from "./http-wrapper.service";
import { ChromeService } from "./chrome.service";
import { WalletModel } from "./wallet";

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

    get zelfNamePricing(): any {
        return {
            1: { 1: 240, 2: 432, 3: 612, 4: 768, 5: 900, lifetime: 3600 },
            2: { 1: 120, 2: 216, 3: 306, 4: 384, 5: 450, lifetime: 1800 },
            3: { 1: 72, 2: 130, 3: 184, 4: 230, 5: 270, lifetime: 1080 },
            4: { 1: 36, 2: 65, 3: 92, 4: 115, 5: 135, lifetime: 540 },
            5: { 1: 30, 2: 54, 3: 76, 4: 96, 5: 112, lifetime: 450 },
            "6-15": { 1: 24, 2: 43, 3: 61, 4: 77, 5: 90, lifetime: 360 },
            16: { 1: 23, 2: 41, 3: 59, 4: 74, 5: 86, lifetime: 345 },
            17: { 1: 22, 2: 40, 3: 56, 4: 70, 5: 82, lifetime: 330 },
            18: { 1: 21, 2: 38, 3: 54, 4: 67, 5: 79, lifetime: 315 },
            19: { 1: 20, 2: 36, 3: 51, 4: 64, 5: 75, lifetime: 300 },
            20: { 1: 19, 2: 34, 3: 48, 4: 61, 5: 72, lifetime: 285 },
            21: { 1: 18, 2: 32, 3: 46, 4: 58, 5: 68, lifetime: 270 },
            22: { 1: 17, 2: 31, 3: 43, 4: 54, 5: 64, lifetime: 255 },
            23: { 1: 16, 2: 29, 3: 41, 4: 51, 5: 60, lifetime: 240 },
            24: { 1: 15, 2: 27, 3: 38, 4: 48, 5: 56, lifetime: 225 },
            25: { 1: 14, 2: 25, 3: 36, 4: 45, 5: 53, lifetime: 210 },
            26: { 1: 13, 2: 23, 3: 33, 4: 42, 5: 49, lifetime: 195 },
            27: { 1: 12, 2: 22, 3: 31, 4: 38, 5: 45, lifetime: 180 },
        };
    }

    searchZelfName(key = "zelfName", value: string, captchaToken?: string): Promise<any> {
        const query: { key: string; value: string; captchaToken?: string } = { key, value };

        if (captchaToken) query.captchaToken = captchaToken;

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

    getZelfFile(): string {
        return this.variables.zelfFile;
    }

    async setZelfNameObject(zelfNameObject: any): Promise<void> {
        this.variables.zelfNameObject = zelfNameObject;

        await this._chromeService.setItem("zelfNameObject", zelfNameObject);
    }

    async setZelfProof(zelfProof: string): Promise<void> {
        this.variables.zelfProof = zelfProof;

        await this._chromeService.setItem("zelfProof", zelfProof);
    }

    async setDuration(duration: any): Promise<void> {
        this.variables.duration = duration;

        await this._chromeService.setItem("duration", duration);
    }

    async setReferral(referralZelfName: string): Promise<void> {
        this.variables.referralZelfName = referralZelfName;

        await this._chromeService.setItem("referralZelfName", referralZelfName);
    }

    async getZelfNameObject(): Promise<any> {
        return new WalletModel(this.variables.zelfNameObject || (await this._chromeService.getItem("zelfNameObject")) || {});
    }

    async getReferral(): Promise<any> {
        return this.variables.referralZelfName || (await this._chromeService.getItem("referralZelfName"));
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

    async getZelfProof(): Promise<string> {
        return this.variables.zelfProof || (await this._chromeService.getItem("zelfProof"));
    }

    leaseZelfName(payload: any): Promise<any> {
        return this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/zelf-name-service/v2/lease`, payload);
    }

    decryptZelfName(payload: any): Promise<any> {
        return this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/zelf-name-service/decrypt`, payload);
    }
}
