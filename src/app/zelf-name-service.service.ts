import { Injectable } from "@angular/core";

import { environment } from "../environments/environment";
import { HttpWrapperService } from "./http-wrapper.service";
import { ChromeService } from "./chrome.service";
import { VaultService } from "./vault.service";
import { WalletModel } from "./wallet";
import { WalletService } from "./wallet.service";

export type ZelfFlow = "create" | "import" | "unlock" | "recover" | "";

@Injectable({
    providedIn: "root",
})
export class ZelfNameService {
    baseUrl: String = environment.apiUrl;
    variables: any;

    constructor(
        private _httpWrapper: HttpWrapperService,
        private _chromeService: ChromeService,
        private _vaultService: VaultService,
        private _walletService: WalletService
    ) {
        this.variables = {
            duration: 1,
            price: 0,
            zelfFile: null,
            zelfName: null,
            zelfProof: null,
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

    private _shouldRefreshWallets = async (): Promise<boolean> => {
        const walletTtl = await this._chromeService.getItemSession("walletTtl");

        if (!walletTtl || walletTtl < Date.now()) {
            this._chromeService.setItemSession("walletTtl", Date.now() + 1000 * 60 * 30);

            return true;
        }

        return false;
    };

    generateArNS(zelfName: string): string {
        return `https://${zelfName.replace(".", "_")}.arweave.zelf.world`;
    }

    decryptZelfName(payload: any): Promise<any> {
        const promise = this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/zelf-name-service/v2/decrypt`, payload);

        promise.then(() => this._vaultService.setLastVerified());

        return promise;
    }

    leaseZelfName(payload: any): Promise<any> {
        const promise = this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/zelf-name-service/v2/lease`, payload);

        promise.then(() => this._vaultService.setLastVerified());

        return promise;
    }

    zelfNameLeaseRecovery(payload: any): Promise<any> {
        const promise = this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/zelf-name-service/v2/lease-recovery`, payload);

        promise.then(() => this._vaultService.setLastVerified());

        return promise;
    }

    searchZelfName(key = "zelfName", value: string, captchaToken?: string): Promise<any> {
        const query: { key: string; value: string; captchaToken?: string } = { key, value };

        if (captchaToken) query.captchaToken = captchaToken;

        if (query.key === "zelfName") {
            query.value = query.value.toLowerCase();
        }

        return this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/zelf-name-service/v2/search`, query);
    }

    searchZelfNameV2(key = "zelfName", value: string, captchaToken?: string): Promise<any> {
        const query: { key: string; value: string; captchaToken?: string } = { key, value };

        if (query.key === "zelfName") {
            query.value = query.value.toLowerCase();
        }

        if (captchaToken) query.captchaToken = captchaToken;

        return this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/zelf-name-service/v2/search`, query);
    }

    previewZelfName(zelfName?: string, captchaToken?: string): Promise<any> {
        const query: { zelfName?: string; captchaToken?: string } = { zelfName };

        if (captchaToken) query.captchaToken = captchaToken;

        return this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/zelf-name-service/v2/search`, query);
    }

    previewZelfProof(zelfProof: string, captchaToken?: string): Promise<any> {
        const query: { zelfProof: string; os: string; captchaToken?: string } = { zelfProof, os: "DESKTOP" };

        if (captchaToken) query.captchaToken = captchaToken;

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

    async setNewZelfName(newZelfName: string): Promise<void> {
        this.variables.newZelfName = newZelfName;

        await this._chromeService.setItem("newZelfName", newZelfName);
    }

    async setMnemonicCount(value: 12 | 24 | 0): Promise<void> {
        this.variables.mnemonicCount = value;

        await this._chromeService.setItem("mnemonicCount", value);
    }

    async setFlow(flow: ZelfFlow): Promise<void> {
        this.variables.flow = flow;

        await this._chromeService.setItem("flow", flow);
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

    async getMnemonicCount(): Promise<12 | 24 | 0> {
        return this.variables.mnemonicCount || (await this._chromeService.getItem("mnemonicCount"));
    }

    async getZelfNameObject(): Promise<any> {
        return this.variables.zelfNameObject || (await this._chromeService.getItem("zelfNameObject")) || null;
    }

    async getNewZelfName(): Promise<any> {
        return this.variables.newZelfName || (await this._chromeService.getItem("newZelfName")) || "";
    }

    async getFlow(): Promise<ZelfFlow> {
        return this.variables.flow || (await this._chromeService.getItem("flow")) || "";
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

    async refreshAllWalletsPublicData(wallets: WalletModel[], forceRefresh = false): Promise<boolean> {
        const shouldRefreshWallets = forceRefresh || (await this._shouldRefreshWallets());

        if (!shouldRefreshWallets) return false;

        for (const wallet of wallets) {
            await this.refreshWalletPublicData(wallet);
        }

        return true;
    }

    async refreshWalletPublicData(wallet: WalletModel): Promise<WalletModel | null> {
        if (!wallet || !wallet.publicData?.zelfName) return null;

        const response = await this.searchZelfName("zelfName", wallet.publicData.zelfName);

        if (!response.data.ipfs?.length && !response.data.arweave?.length && response.data?.price) {
            (wallet as WalletModel)?.updatePublicData({
                ...wallet.publicData,
                expiresAt: new Date(new Date().setHours(0, 0, 0, 0)).toString(),
            });

            await this._walletService.updateWallet(wallet);

            return wallet;
        }

        const publicData = response.data.ipfs?.length ? response.data.ipfs[0]?.publicData : response.data.arweave?.[0]?.publicData;

        if (!publicData || !wallet) return null;

        (wallet as WalletModel)?.updatePublicData(publicData);

        await this._walletService.updateWallet(wallet);

        return wallet;
    }
}
