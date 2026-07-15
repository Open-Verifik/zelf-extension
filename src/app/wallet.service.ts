import * as faceapi from "@vladmandic/face-api";
import * as openpgp from "openpgp";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { environment } from "environments/environment";
import {
    readPublicDataDotAddress,
    readPublicDataKsmAddress,
    tryHealPublicDataXlmToCanonical,
    type PGP,
} from "@shared/types/tag.types";
import { TagModel } from "./tags.service";
import { ChromeService } from "./chrome.service";
import { HttpWrapperService } from "./http-wrapper.service";
import { Asset, Wallet } from "@shared/types/wallet.types";
import { generateDeviceFingerprint, simpleHash, UserFingerPrint } from "./core/utils/fingerprint.util";

/** Display-only fake SS58-shaped string for receive rows before substrate address exists (not an on-chain address). */
export const SUBSTRATE_ADDRESS_PLACEHOLDER = "1nm2Abc…xxxxxxxxxxxxxxxxxxxxx";

export type Network = {
    symbol: string;
    name: string;
    address: string;
    image: string;
    /** When true, `address` is `SUBSTRATE_ADDRESS_PLACEHOLDER` and the user must run decrypt to materialize DOT/KSM. */
    needsSubstrateAddress?: boolean;
};

@Injectable({
    providedIn: "root",
})
export class WalletService {
    private static readonly SWAP_RECEIPT_DISPLAY_KEY = "swapReceiptDisplay";

    private _assetImageMap: Map<string, string> = new Map();
    private _faceapi: BehaviorSubject<any> = new BehaviorSubject(null);
    private _userFingerPrint!: UserFingerPrint;

    private _BTC_REGEX = /^(?:(?:bc1|tb1|1|32)[a-zA-HJ-NP-Z0-9]{25,59})$/;
    private _ETH_REGEX = /^(0x)?[0-9a-fA-F]{40}$/;
    private _SOL_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    private _SUI_REGEX = /^(0x)?[0-9a-fA-F]{64}$/;

    private _BTC_TRANSACTION_REGEX = /^[a-fA-F0-9]{64}$/; // Bitcoin transaction hash
    private _ETH_TRANSACTION_REGEX = /^0x([A-Fa-f0-9]{64})$/; // Ethereum transaction hash
    private _SOL_TRANSACTION_REGEX = /^[A-HJ-NP-Za-km-z1-9]{88}$/; // Solana transaction hash
    private _SUI_TRANSACTION_REGEX = /^(0x)?[0-9a-fA-F]{64}$/; // Sui transaction hash

    baseUrl: String = environment.apiUrl;
    zelfProof: string = "";

    deviceData: any = {
        generalInformation: [],
    };

    sessionData: any = {
        type: "",
        wordsCount: 12,
        navigationStep: 1,
        password: "",
        usePassword: false,
        phrase: "",
        wallet: null,
    };

    constructor(
        private _httpWrapper: HttpWrapperService,
        private _breakpointObserver: BreakpointObserver,
        private _chromeService: ChromeService
    ) {
        this.deviceData = this.getDeviceDetails();

        this._userFingerPrint = this.getUserFingerprint();

        this.loadModels();

        this._breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).subscribe((result) => {
            this.deviceData.isMobile = result.matches;
            this.deviceData.time = result.matches ? 500 : 250;
        });

        this.deviceData.OS = this.detectOS();
    }

    private _generateUserFingerPrint(): UserFingerPrint {
        const navigatorInfo = window.navigator;
        const screenInfo = window.screen;

        const fingerprintString = generateDeviceFingerprint();

        return {
            hash: simpleHash(fingerprintString),
            userAgent: navigatorInfo.userAgent,
            height: screenInfo.height,
            width: screenInfo.width,
        };
    }

    get TagRegex(): RegExp {
        // Matches tag names with exactly one dot: tagName.domain
        // Ensures:
        // - Starts with a letter (cannot start with a dot)
        // - Followed by zero or more letters/numbers
        // - Exactly one dot separator
        // - Domain part (letters, numbers, or hyphens)
        // - Does NOT match multiple dots (e.g., "a.b.c" will fail)
        return /^[a-zA-Z][a-zA-Z0-9]*\.[a-zA-Z0-9-]+$/i;
    }

    get TagRegexNoPostfix(): RegExp {
        return /^[a-zA-Z][a-zA-Z0-9]*$/i;
    }

    get BTCRegex(): RegExp {
        return this._BTC_REGEX;
    }

    get ETHRegex(): RegExp {
        return this._ETH_REGEX;
    }

    get SOLRegex(): RegExp {
        return this._SOL_REGEX;
    }

    get SUIRegex(): RegExp {
        return this._SUI_REGEX;
    }

    get BTCTransactionRegex(): RegExp {
        return this._BTC_TRANSACTION_REGEX;
    }

    get ETHTransactionRegex(): RegExp {
        return this._ETH_TRANSACTION_REGEX;
    }

    get SOLTransactionRegex(): RegExp {
        return this._SOL_TRANSACTION_REGEX;
    }

    get SUITransactionRegex(): RegExp {
        return this._SUI_TRANSACTION_REGEX;
    }

    setAssetImage(symbol: string, imageSrc: string): void {
        if (!symbol || !imageSrc) return;

        const cachedImage = this._assetImageMap.get(symbol);

        if (cachedImage) return;

        if (!imageSrc) this._assetImageMap.set(symbol, "./assets/tokens/placeholder-coin.png");
        else this._assetImageMap.set(symbol, imageSrc);
    }

    getAssetImage(symbol: string, imageSrc?: string): string {
        if (!symbol) return "./assets/tokens/placeholder-coin.png";

        const cachedImage = this._assetImageMap.get(symbol);

        if (cachedImage) return cachedImage;

        let assetSrc: string = "";

        switch (symbol) {
            case "AVAX":
                assetSrc = "./assets/networks/avax.png";
                break;
            case "SOL":
                assetSrc = "./assets/networks/sol.svg";
                break;
            case "ETH":
                assetSrc = "./assets/networks/eth.png";
                break;
            case "BDAG":
            case "BlockDAG":
                assetSrc = "./assets/networks/bdag.png";
                break;
            case "SUI":
                assetSrc = "./assets/networks/sui.svg";
                break;
            case "TON":
                assetSrc = "./assets/networks/ton.png";
                break;
            case "BNB":
            case "BSC":
                assetSrc = "./assets/networks/bnb.png";
                break;
            case "POL":
            case "MATIC":
                assetSrc = "./assets/networks/pol.png";
                break;
            case "BTC":
                assetSrc = "./assets/networks/btc.png";
                break;
            case "XLM":
                assetSrc = "./assets/icons/xlm_logo.svg";
                break;
            case "DOT":
                assetSrc = "./assets/networks/dot.svg";
                break;
            case "KSM":
                assetSrc = "./assets/networks/ksm.svg";
                break;
            case "ZNS":
                assetSrc = "./assets/tokens/zns.png";
                break;
        }

        if (assetSrc) {
            this._assetImageMap.set(symbol, assetSrc);

            return assetSrc;
        }

        if (imageSrc) {
            assetSrc = imageSrc;
        } else {
            assetSrc = "./assets/tokens/placeholder-coin.png";
        }

        this._assetImageMap.set(symbol, assetSrc);

        return assetSrc;
    }

    getDeviceData() {
        return this.deviceData;
    }

    getSessionData() {
        return this.sessionData;
    }

    setSteps(steps: Array<any>): void {
        this.sessionData.steps = steps;
    }

    goToNextStep(stepIndex: number): void {
        for (let index = 0; index < this.sessionData.steps.length; index++) {
            const step = this.sessionData.steps[index];

            if (index < stepIndex) {
                step.isActive = false;
                step.isCompleted = true;

                continue;
            }

            if (index === stepIndex) {
                step.isActive = true;
                step.isCompleted = false;
            }
        }

        this.sessionData.step = stepIndex;

        this.sessionData.steps.forEach((step: any, index: number) => {
            step.isActive = index === stepIndex;
            step.isCompleted = index < stepIndex;
        });

        this.sessionData.steps = [...this.sessionData.steps];
    }

    async restoreSession(): Promise<any> {
        let { wallet: currentWallet, wallets } = await this.getAllWalletsFromStorage();

        if (!wallets) wallets = [];

        const keysToRemove = [
            "currentTagName",
            "duration",
            "durationToken",
            "importWallet",
            "network",
            "password",
            "referralTagName",
            "unlockWallet",
            "zelfFile",
            "tagName",
            "zelfPrice",
            "zelfProof",
            "zelfReward",
        ];

        await Promise.all(keysToRemove.map((key) => this._chromeService.removeItem(key)));

        if (currentWallet?.publicData?.ethAddress) {
            this._chromeService.setItem("wallets", [currentWallet, ...wallets]);
            this._chromeService.removeItem("wallet");
        }

        this.sessionData.step = 0;
        this.sessionData.password = "";
        this.sessionData.usePassword = false;
        this.sessionData.showBiometrics = false;
        this.sessionData.showBiometricsInstructions = false;
        this.sessionData.phrase = null;
        this.sessionData.navigationStep = 1;
    }

    get faceapi$(): Observable<boolean> {
        return this._faceapi.asObservable();
    }

    async loadModels(): Promise<void> {
        const promises = [];

        promises.push(faceapi.nets.ssdMobilenetv1.loadFromUri("assets/models"));
        promises.push(faceapi.nets.faceLandmark68Net.loadFromUri("assets/models"));

        await Promise.allSettled(promises);

        this._faceapi.next(true);
    }

    detectOS() {
        const userAgent = window.navigator.userAgent.toLowerCase();

        if (/android/.test(userAgent)) {
            return "ANDROID";
        } else if (/iphone|ipad|ipod/.test(userAgent)) {
            return "IOS";
        }

        return "DESKTOP";
    }

    getDeviceDetails(): any {
        if (this.deviceData.generalInformation.length) return;

        const details = {
            // Navigator properties
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            appName: navigator.appName,
            appVersion: navigator.appVersion,
            language: navigator.language,
            onLine: navigator.onLine,
            cookiesEnabled: navigator.cookieEnabled,
            doNotTrack: navigator.doNotTrack,

            // Screen properties
            screenResolution: `${screen.width} x ${screen.height}`,
            screenAvailableResolution: `${screen.availWidth} x ${screen.availHeight}`,
            colorDepth: screen.colorDepth,
            pixelDepth: screen.pixelDepth,

            // Window properties
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            outerWidth: window.outerWidth,
            outerHeight: window.outerHeight,

            touchSupported: "ontouchstart" in window,

            geolocationSupported: "geolocation" in navigator,

            onlineStatus: navigator.onLine ? "Online" : "Offline",
        };

        this.deviceData.generalInformation.push(
            { key: "device", value: details.platform },
            { key: "language", value: details.language },
            { key: "userAgent", value: details.userAgent }
        );

        return details;
    }

    getUserFingerprint(): any {
        if (this._userFingerPrint) return this._userFingerPrint;

        this._userFingerPrint = this._generateUserFingerPrint();

        return this._userFingerPrint;
    }

    findWallet(address: string): Promise<any> {
        return this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/wallets?address=${address}`);
    }

    requestWallet(walletId: string): Promise<any> {
        return this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/my-wallets/${walletId}`);
    }

    createLivenessSession(data: any): Promise<any> {
        let url = `${this.baseUrl}/api/sessions`;

        return this._httpWrapper.sendRequest(
            "post",
            url,
            {
                ...data,
                isWebExtension: this._chromeService.isExtension,
            },
            {
                Headers: {},
            }
        );
    }

    createWallet(data: any): Promise<any> {
        return this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/my-wallets`, {
            ...data,
            password: data.password || undefined,
        });
    }

    decryptWallet(data: any): Promise<any> {
        return this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/my-wallets/decrypt`, data);
    }

    importWallet(data: any): Promise<any> {
        return this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/my-wallets/import`, data);
    }

    previewWallet(zelfProof: string): Promise<any> {
        return this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/wallets/preview`, {
            zelfProof,
        });
    }

    createAppRegistration(data: any): Promise<any> {
        return this._httpWrapper.sendRequest("post", `${this.baseUrl}/v2/app-registrations`, data);
    }

    async generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
        const { privateKey, publicKey } = await openpgp.generateKey({
            type: "ecc",
            curve: "curve25519",
            userIDs: [{ name: "Your Name", email: "your.email@example.com" }],
            passphrase: "your_passphrase",
        });

        return { publicKey, privateKey };
    }

    async encryptMessage(plainTextMessage: string, publicKeyArmored: string): Promise<any> {
        const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

        const encryptedMessage = await openpgp.encrypt({
            message: await openpgp.createMessage({ text: plainTextMessage }),
            encryptionKeys: publicKey,
        });

        return encryptedMessage;
    }

    getDisplayableAddress(address: string): string {
        if (!address) return "";

        const firstPart = address.slice(0, 8);
        const lastPart = address.slice(-6);
        return `${firstPart}...${lastPart}`;
    }

    updateAssetValues(wallet: Wallet, syncingAsset: Asset, wallets: Array<Wallet>, index?: number): void {
        if (!wallet.ethAddress || !syncingAsset.asset) return;

        if (!wallet.assets) {
            wallet.assets = [syncingAsset];
        }

        let found = false;

        for (let _index = 0; _index < wallet.assets.length; _index++) {
            const _asset = wallet.assets[_index];

            if (_asset.asset === syncingAsset.asset) {
                found = true;
                _asset.balance = syncingAsset.balance;

                _asset.price = syncingAsset.price;
            }
        }

        if (!found) {
            wallet.assets.push(syncingAsset);
        }

        this._chromeService.setItem("wallet", wallet);

        if (!index) {
            for (let _index = 0; _index < wallets.length; _index++) {
                const _wallet = wallets[_index];

                if (_wallet.ethAddress === wallet.ethAddress) index = _index;
            }
        }

        if (index !== undefined) {
            wallets[index] = wallet;

            this._chromeService.setItem("wallets", wallets);
        }
    }

    /**
     * returns my current wallet
     * @returns Wallet
     */
    async retrieveWallet(): Promise<any> {
        let wallet = await this._chromeService.getItem("wallet");

        const wallets = (await this._chromeService.getItem("wallets")) || [];

        if (!wallet && (!wallets || !wallets.length)) return null;

        if (wallet) {
            const rawPd = wallet.publicData as Record<string, unknown> | undefined | null;
            const healedPd = tryHealPublicDataXlmToCanonical(rawPd ?? undefined);

            if (healedPd) {
                wallet = { ...wallet, publicData: healedPd };
                await this._chromeService.setItem("wallet", wallet);
            }

            wallet = new TagModel(wallet);
        }

        if (!wallet?.publicData?.ethAddress && wallets) {
            wallet = new TagModel(wallets[0]);

            this._chromeService.setItem("wallet", wallet || "");
        }

        return wallet;
    }

    getShortAddress(address: string): string {
        const firstPart = address.slice(0, 12);
        const lastPart = address.slice(-8);

        return `${firstPart}...${lastPart}`;
    }

    async getAllWalletsFromStorage(): Promise<{ wallet: Partial<TagModel> | null; wallets: TagModel[] }> {
        const wallet = await this.getCurrentWallet();
        const wallets = await this.getWalletsFromStorage();

        return { wallet, wallets };
    }

    async ensureWalletStateIsValid(): Promise<void> {
        const wallet = await this.getCurrentWallet();
        const wallets = await this.getWalletsFromStorage();

        if (!wallet?.publicData?.tagName && wallets.length > 0) {
            const firstWallet = wallets[0];
            const remainingWallets = wallets.slice(1);

            await this._chromeService.setItems({
                wallet: firstWallet,
                wallets: remainingWallets,
            });

            return;
        }

        const currentWalletTagName = wallet?.fullTagName;

        if (!currentWalletTagName) return;

        const walletsWithoutCurrent = wallets.filter((w) => w.fullTagName !== currentWalletTagName);

        if (walletsWithoutCurrent.length !== wallets.length) {
            await this._chromeService.setItem("wallets", walletsWithoutCurrent);
        }
    }

    async getCurrentWallet(): Promise<Partial<TagModel> | null> {
        const storedWallet = await this._chromeService.getItem<Partial<TagModel> | null>("wallet");
        const rawPd = storedWallet?.publicData as Record<string, unknown> | undefined | null;
        const healedPd = tryHealPublicDataXlmToCanonical(rawPd ?? undefined);

        if (storedWallet && healedPd) {
            const healed = { ...storedWallet, publicData: healedPd };

            await this._chromeService.setItem("wallet", healed);

            return new TagModel(healed) || {};
        }

        return new TagModel(storedWallet) || {};
    }

    async getFirstWalletFromStorage(): Promise<Partial<TagModel> | null> {
        const wallet = (await this.getCurrentWallet()) || {};

        const hasValidWallet = wallet?.name || wallet?.publicData?.tagName || wallet?.fullTagName || wallet?._id;

        if (hasValidWallet) return new TagModel(wallet);

        const wallets = await this.getWalletsFromStorage();

        if (!wallets.length) return {};

        return new TagModel(wallets[0] || {});
    }

    /** Same logical Zelf identity (full tag + domain), using TagModel normalization for stored POJOs. */
    walletIdentityEquals(a: Partial<TagModel>, b: Partial<TagModel>): boolean {
        const ma = new TagModel(a as any);
        const mb = new TagModel(b as any);
        const af = ma.fullTagName;
        const bf = mb.fullTagName;

        return !!af && af === bf;
    }

    private _hasMeaningfulPgp(pgp: TagModel["pgp"] | undefined | null): boolean {
        return !!(pgp?.encryptedMessage?.trim() && pgp?.privateKey?.trim());
    }

    /**
     * Refresh/public-data updates often pass tags without `pgp`. Keep prior stored keys unless incoming
     * includes non-empty armored material (e.g. after decrypt).
     */
    private _mergeWalletUpdatePreservingPgp(existing: Partial<TagModel> | null | undefined, walletToUpdate: Partial<TagModel>): TagModel {
        const incoming = new TagModel(walletToUpdate as any);

        if (!existing) return incoming;

        const prior = new TagModel(existing as any);

        if (!this._hasMeaningfulPgp(incoming.pgp) && this._hasMeaningfulPgp(prior.pgp)) {
            const priorPgp = prior.pgp as PGP;

            incoming.pgp = {
                encryptedMessage: priorPgp.encryptedMessage,
                privateKey: priorPgp.privateKey,
            };
        }

        return incoming;
    }

    async updateWallet(walletToUpdate: Partial<TagModel>): Promise<void> {
        if (!walletToUpdate || !walletToUpdate.publicData?.tagName) return;

        const { wallet, wallets } = await this.getAllWalletsFromStorage();
        const incomingModel = new TagModel(walletToUpdate as any);

        if (wallet && this.walletIdentityEquals(wallet, incomingModel)) {
            const merged = this._mergeWalletUpdatePreservingPgp(wallet, walletToUpdate);

            await this._chromeService.setItem("wallet", merged);

            return;
        }

        const index = wallets.findIndex((w) => w.fullTagName === incomingModel.fullTagName);

        if (index === -1) return;

        const merged = this._mergeWalletUpdatePreservingPgp(wallets[index], walletToUpdate);

        wallets[index] = merged;

        await this._chromeService.setItem("wallets", wallets);
    }

    async updateCurrentWallet(wallet: Partial<TagModel>): Promise<void> {
        await this._chromeService.setItem("wallet", wallet);
    }

    async clearPGPKeys(): Promise<void> {
        const wallet = await this.getCurrentWallet();
        const wallets = await this.getWalletsFromStorage();

        if (wallet && wallet.pgp) {
            delete wallet.pgp;

            this._chromeService.setItem("wallet", wallet);
        }

        let hasUpdate = false;

        const newWallets = (wallets || []).map((_wallet) => {
            if (!_wallet?.pgp) return _wallet;

            delete _wallet.pgp;
            hasUpdate = true;

            return _wallet;
        });

        if (hasUpdate) await this._chromeService.setItem("wallets", newWallets);
    }

    async getWalletsFromStorage(): Promise<TagModel[]> {
        const rawList = ((await this._chromeService.getItem<Partial<TagModel>[]>("wallets")) || []) as Partial<TagModel>[];
        let mutated = false;
        const healedList = rawList.map((w) => {
            const rawPd = w?.publicData as Record<string, unknown> | undefined | null;
            const healedPd = tryHealPublicDataXlmToCanonical(rawPd ?? undefined);

            if (healedPd) {
                mutated = true;

                return { ...w, publicData: healedPd };
            }

            return w;
        });

        if (mutated) {
            await this._chromeService.setItem("wallets", healedList);
        }

        const wallets = healedList.map((wallet) => new TagModel(wallet));

        // Deduplicate wallets by fullTagName to prevent duplicates
        const seen = new Set<string>();
        return wallets.filter((wallet) => {
            const tagName = wallet.fullTagName;

            if (!tagName || seen.has(tagName)) {
                return false;
            }

            seen.add(tagName);

            return true;
        });
    }

    async switchWallet(selectedWallet: TagModel): Promise<void> {
        const oldRaw = (await this._chromeService.getItem<Partial<TagModel> | null>("wallet")) || {};
        const oldCurrentWalletModel = new TagModel(oldRaw as any);
        const selected = selectedWallet instanceof TagModel ? selectedWallet : new TagModel(selectedWallet as any);

        if (this.walletIdentityEquals(oldCurrentWalletModel, selected)) {
            await this._chromeService.setItem("wallet", selected);

            return;
        }

        const otherWallets = (await this._chromeService.getItem<TagModel[]>("wallets")) || [];

        for (let index = 0; index < otherWallets.length; index++) {
            const _wallet = otherWallets[index];

            otherWallets[index] = new TagModel(_wallet);
        }

        const oldCurrentWalletIsSet = Boolean(
            oldCurrentWalletModel._id ||
                oldCurrentWalletModel.fullTagName ||
                oldCurrentWalletModel.name ||
                oldCurrentWalletModel.publicData?.tagName
        );

        const selectedFilteredFromOtherWallets = otherWallets.filter((_wallet) => _wallet.fullTagName !== selected.fullTagName);

        let updatedWalletsArray: TagModel[] = [];

        if (oldCurrentWalletIsSet) {
            const walletsWithoutOldCurrent = selectedFilteredFromOtherWallets.filter((_wallet) => {
                if (oldCurrentWalletModel.fullTagName && _wallet.fullTagName === oldCurrentWalletModel.fullTagName) return false;
                if (oldCurrentWalletModel._id && _wallet._id === oldCurrentWalletModel._id) return false;
                return true;
            });

            updatedWalletsArray = [oldCurrentWalletModel, ...walletsWithoutOldCurrent];
        } else {
            updatedWalletsArray = selectedFilteredFromOtherWallets;
        }

        await this._chromeService.setItems({
            domain: selected.publicData?.domain,
            tagName: selected.tagName,
            wallet: selected,
            wallets: updatedWalletsArray,
        });
    }

    async checkIfLastWallet(): Promise<boolean> {
        const { wallet: currentWallet, wallets } = await this.getAllWalletsFromStorage();

        return (currentWallet?.publicData?.ethAddress && !wallets.length) || (!currentWallet?.publicData?.ethAddress && wallets.length === 1);
    }

    async deleteZelfProof(walletToRemove: TagModel): Promise<void> {
        const { wallet: currentWallet, wallets } = await this.getAllWalletsFromStorage();

        if (currentWallet?.fullTagName === walletToRemove.fullTagName) {
            await this._chromeService.removeItem("wallet");

            const wallet = wallets.shift();

            this._chromeService.setItem("wallet", wallet);
            this._chromeService.setItem("wallets", wallets);
        } else {
            const newWallets = wallets.filter((_wallet: TagModel) => _wallet.fullTagName !== walletToRemove.fullTagName);

            this._chromeService.setItem("wallets", newWallets);
        }
    }

    async setWalletsToColdStorage(): Promise<void> {
        const storedWallet = await this._chromeService.getItem<TagModel | null>("wallet");

        if (!storedWallet?.publicData?.tagName) return;

        const wallet = new TagModel(storedWallet);

        const wallets = await this.getWalletsFromStorage();

        const walletExistsInWallets = wallets.some((_wallet) => wallet.fullTagName === _wallet.fullTagName);

        if (!walletExistsInWallets) wallets.unshift(wallet);

        this._chromeService.setItem("wallet", {});
        this._chromeService.setItem("wallets", wallets);
    }

    async removeDuplicateWalletsInStorage(): Promise<void> {
        const { wallet, wallets } = await this.getAllWalletsFromStorage();

        if (!wallets.length || !wallet) return;

        const filteredWallets = wallets.filter((_wallet) => _wallet.fullTagName !== wallet.fullTagName);

        await this._chromeService.setItem("wallets", filteredWallets);
    }

    public isValidEVMAddress(address: string): boolean {
        return this._ETH_REGEX.test(address);
    }

    public isValidSuiAddress(address: string): boolean {
        return this._SUI_REGEX.test(address);
    }

    public async validateEVMAddressOnChain(address: string): Promise<boolean> {
        try {
            if (!this.isValidEVMAddress(address)) return false;

            const response = await this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/validate-address?address=${address}`);

            return response?.isValid || false;
        } catch (error) {
            console.error("Error validating EVM address on chain:", error);

            return false;
        }
    }

    public async validateSUIAddressOnChain(address: string): Promise<boolean> {
        try {
            if (!this.isValidSuiAddress(address)) return false;

            const response = await this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/validate-sui-address?address=${address}`);

            return response?.isValid || false;
        } catch (error) {
            console.error("Error validating SUI address on chain:", error);

            return false;
        }
    }

    public async getPendingTransaction(transactionHash: string): Promise<any> {
        if (!transactionHash) return;

        const pendingTransactions = await this._chromeService.getItem<any>("pendingTransactions");

        if (!pendingTransactions) return null;

        const lower = String(transactionHash).trim().toLowerCase();

        return pendingTransactions[transactionHash] || pendingTransactions[lower] || null;
    }

    /**
     * Persists user-facing swap legs (what they signed) by tx hash. Unlike pendingTransactions,
     * this is not removed when the receipt loads — so activity/history still overlays correctly.
     */
    public async getSwapReceiptDisplay(transactionHash: string): Promise<any | null> {
        const key = this._normalizeTransactionHashKey(transactionHash);

        if (!key) return null;

        const all = await this._chromeService.getItem<Record<string, any>>(WalletService.SWAP_RECEIPT_DISPLAY_KEY);

        return all?.[key] ?? null;
    }

    private _normalizeTransactionHashKey(hash: string): string | null {
        const s = String(hash || "")
            .trim()
            .toLowerCase();

        return s || null;
    }

    private _swapReceiptDisplaySnapshot(t: any): Record<string, unknown> {
        return {
            amount: t.amount,
            asset: t.asset,
            date: t.date,
            fee: t.fee,
            from: t.from,
            image: t.image,
            network: t.network,
            swapIntentFromSymbol: t.swapIntentFromSymbol,
            swapIntentToSymbol: t.swapIntentToSymbol,
            targetAddress: t.targetAddress,
            targetAmount: t.targetAmount,
            targetImage: t.targetImage,
            targetNetwork: t.targetNetwork,
            targetSymbol: t.targetSymbol,
            tokenType: t.tokenType,
            to: t.to,
            total: t.total,
            transactionHash: t.transactionHash || t.hash,
            type: t.type,
        };
    }

    private async _persistSwapReceiptDisplay(storageKey: string, transaction: any): Promise<void> {
        if (String(transaction?.type || "").toLowerCase() !== "swap") return;

        const key = this._normalizeTransactionHashKey(storageKey);

        if (!key) return;

        const payload = this._swapReceiptDisplaySnapshot(transaction);
        const all = (await this._chromeService.getItem<Record<string, unknown>>(WalletService.SWAP_RECEIPT_DISPLAY_KEY)) || {};

        all[key] = payload;

        await this._chromeService.setItem(WalletService.SWAP_RECEIPT_DISPLAY_KEY, all);
    }

    public async removePendingTransaction(transactionHash: string): Promise<any> {
        if (!transactionHash) return;

        const pendingTransactions = await this._chromeService.getItem<any>("pendingTransactions");

        if (!pendingTransactions) return null;

        delete pendingTransactions[transactionHash];

        await this._chromeService.setItem("pendingTransactions", pendingTransactions);
    }

    public async addTransactionToPending(transaction: any): Promise<void> {
        const pendingTransactions = await this._chromeService.getItem<any>("pendingTransactions");

        const bigIntKeys = Object.keys(transaction).filter((key) => {
            return typeof transaction[key] === "bigint";
        });

        for (const key of bigIntKeys) {
            delete transaction[key];
        }

        const storageKey = transaction.transactionHash || transaction.hash;

        if (!storageKey) {
            console.warn("addTransactionToPending: missing transactionHash/hash, skipping persist");

            return;
        }

        let storedForSwapDisplay: any;

        if (!pendingTransactions) {
            await this._chromeService.setItem("pendingTransactions", { [storageKey]: transaction });
            storedForSwapDisplay = transaction;
        } else {
            const existingTransaction = pendingTransactions[storageKey];

            // If transaction already exists, merge intelligently to preserve original amount, fee, and total
            if (existingTransaction) {
                const mergedTransaction = this._mergePendingTransaction(existingTransaction, transaction);
                pendingTransactions[storageKey] = mergedTransaction;
            } else {
                pendingTransactions[storageKey] = transaction;
            }

            await this._chromeService.setItem("pendingTransactions", pendingTransactions);
            storedForSwapDisplay = pendingTransactions[storageKey];
        }

        await this._persistSwapReceiptDisplay(storageKey, storedForSwapDisplay);
    }

    /**
     * Merges a new transaction update with an existing pending transaction.
     * Preserves original amount, fee, and total from the existing transaction if they are valid.
     * Only updates status and other newer data from the update.
     *
     * This is a shared utility method used by:
     * - addTransactionToPending() - when updating pending transactions in storage
     * - TransactionReceiptComponent - when merging API response with pending transaction for display
     */
    public mergeTransactionData(original: any, update: any): any {
        if (!original) return update;
        if (!update) return original;

        // Preserve original amount if it exists and is valid (not 0, NaN, or missing)
        // Only update if update amount is valid and matches the original (within small tolerance for floating point)
        const originalAmount = original.amount;
        const updateAmount = update.amount;
        const originalAmountNum = Number(originalAmount);
        const updateAmountNum = Number(updateAmount);

        // Check if update amount is invalid (0, NaN, undefined, null, empty string, or falsy)
        const isUpdateAmountInvalid = !updateAmount || updateAmountNum === 0 || isNaN(updateAmountNum);

        // Check if amounts match (within small tolerance for floating point precision)
        const amountMatches =
            !isNaN(originalAmountNum) &&
            originalAmountNum > 0 &&
            !isNaN(updateAmountNum) &&
            updateAmountNum > 0 &&
            Math.abs(originalAmountNum - updateAmountNum) < 0.00000001;

        // Preserve original if: original is valid AND (update is invalid OR update doesn't match original)
        const shouldPreserveAmount = !isNaN(originalAmountNum) && originalAmountNum > 0 && (isUpdateAmountInvalid || !amountMatches);

        // Preserve original fee if it exists and is valid
        const originalFee = original.fee;
        const updateFee = update.fee;
        const originalFeeNum = Number(originalFee);
        const updateFeeNum = Number(updateFee);
        const isUpdateFeeInvalid = !updateFee || updateFeeNum === 0 || isNaN(updateFeeNum);
        const shouldPreserveFee = !isNaN(originalFeeNum) && originalFeeNum > 0 && isUpdateFeeInvalid;

        // Preserve original fiatFee if it exists and is valid
        const originalFiatFee = original.fiatFee;
        const updateFiatFee = update.fiatFee;
        const originalFiatFeeNum = Number(originalFiatFee);
        const updateFiatFeeNum = Number(updateFiatFee);
        const isUpdateFiatFeeInvalid = !updateFiatFee || updateFiatFeeNum === 0 || isNaN(updateFiatFeeNum);
        const shouldPreserveFiatFee = !isNaN(originalFiatFeeNum) && originalFiatFeeNum > 0 && isUpdateFiatFeeInvalid;

        // Preserve original total if it exists and is valid
        const originalTotal = original.total;
        const updateTotal = update.total;
        const originalTotalNum = Number(originalTotal);
        const updateTotalNum = Number(updateTotal);
        const isUpdateTotalInvalid = !updateTotal || updateTotalNum === 0 || isNaN(updateTotalNum);
        const shouldPreserveTotal = !isNaN(originalTotalNum) && originalTotalNum > 0 && isUpdateTotalInvalid;

        const originalIsSwap = String(original?.type || "").toLowerCase() === "swap";
        const mergedType = String(update?.type || original?.type || "").toLowerCase();
        const isSwap = mergedType === "swap" || originalIsSwap;

        const normSwapAddr = (a: unknown): string => {
            if (a === undefined || a === null) return "";
            const s = String(a).trim().toLowerCase();

            return s.startsWith("0x") ? s : s;
        };

        let swapOutputMismatch = false;

        if (isSwap) {
            const origOut = normSwapAddr(original.targetAddress ?? original.targetToken);
            const updOut = normSwapAddr(update.targetToken ?? update.targetAddress);

            swapOutputMismatch = origOut.length > 0 && updOut.length > 0 && origOut !== updOut;
        }

        // Merge: update takes precedence for most fields, but preserve critical fields from original
        // IMPORTANT: Put the critical fields AFTER the spread to ensure they override update values
        return {
            ...update,
            // Preserve amount from original if update has invalid amount
            amount: shouldPreserveAmount ? originalAmount : amountMatches ? updateAmount : originalAmount,
            // Preserve fee from original if update has invalid fee
            fee: shouldPreserveFee ? originalFee : isUpdateFeeInvalid ? originalFee : updateFee,
            // Preserve fiatFee from original if update has invalid fiatFee
            fiatFee: shouldPreserveFiatFee ? originalFiatFee : isUpdateFiatFeeInvalid ? originalFiatFee : updateFiatFee,
            // Preserve total from original if update has invalid total
            total: shouldPreserveTotal ? originalTotal : isUpdateTotalInvalid ? originalTotal : updateTotal,
            // Preserve other important fields from original if they exist
            date: original.date || update.date,
            from: original.from || update.from,
            to: original.to || update.to,
            network: original.network || update.network,
            tokenType: original.tokenType || update.tokenType,
            symbol: original.symbol || update.symbol,
            // Update status from update (this is expected to change)
            status: update.status || original.status,
            // Pending swap output token ≠ API last-transfer token (e.g. LiFi hop): keep user-facing labels
            ...(swapOutputMismatch
                ? {
                      targetSymbol: original.targetSymbol,
                      targetAmount: original.targetAmount,
                      targetImage: original.targetImage,
                      targetAddress: original.targetAddress,
                      targetNetwork: original.targetNetwork,
                      targetToken: original.targetToken ?? original.targetAddress,
                  }
                : {}),
            ...(originalIsSwap ? { type: "swap" } : {}),
        };
    }

    /**
     * Private alias for mergeTransactionData - kept for backward compatibility
     * @deprecated Use mergeTransactionData() instead
     */
    private _mergePendingTransaction(existing: any, update: any): any {
        return this.mergeTransactionData(existing, update);
    }

    public async getWalletAddressByTokenType(tokenType: string): Promise<string> {
        const wallet = await this.getCurrentWallet();

        if (!wallet) return "";

        let address = "";

        if (
            tokenType === "ETH" ||
            tokenType === "AVAX" ||
            tokenType === "POL" ||
            tokenType === "MATIC" ||
            tokenType === "ERC-20" ||
            tokenType === "BEP-20" ||
            tokenType === "BNB"
        ) {
            address = wallet?.publicData?.ethAddress || "";
        } else if (tokenType === "BDAG" || tokenType === "BDAG-20") {
            address = wallet?.publicData?.ethAddress || "";
        } else if (tokenType === "SOL" || tokenType === "SPL") {
            address = wallet?.publicData?.solanaAddress || "";
        } else if (tokenType === "BTC") {
            address = wallet?.publicData?.btcAddress || "";
        } else if (tokenType === "SUI" || tokenType === "SUI_TOKEN") {
            address = wallet?.publicData?.suiAddress || "";
        } else if (tokenType === "TON" || tokenType === "ton") {
            address = wallet?.publicData?.tonAddress || "";
        } else if (tokenType === "XLM" || tokenType === "STELLAR") {
            address = wallet?.publicData?.xlmAddress || "";
        }

        return address;
    }

    public async getAvailableWalletNetworks(wallet: Partial<TagModel> | null): Promise<Network[]> {
        const _wallet = wallet || (await this.getCurrentWallet());

        if (!_wallet) return [];

        const networks: Network[] = [];

        if (_wallet?.publicData?.blockDAGAddress) {
            networks.push({
                // blockDAG address
                address: _wallet?.publicData?.blockDAGAddress || _wallet?.publicData?.ethAddress || "",
                image: this.getAssetImage("BDAG"),
                name: "BlockDAG",
                symbol: "BDAG",
            });
        }

        if (_wallet?.publicData?.ethAddress) {
            networks.push(
                {
                    address: _wallet?.publicData?.ethAddress,
                    image: this.getAssetImage("ETH"),
                    name: "Ethereum",
                    symbol: "ETH",
                },
                {
                    address: _wallet?.publicData?.ethAddress,
                    image: this.getAssetImage("AVAX"),
                    name: "Avalanche",
                    symbol: "AVAX",
                },
                {
                    address: _wallet?.publicData?.ethAddress,
                    image: this.getAssetImage("BNB"),
                    name: "Binance",
                    symbol: "BNB",
                },
                {
                    address: _wallet?.publicData?.ethAddress,
                    image: this.getAssetImage("MATIC"),
                    name: "Polygon",
                    symbol: "MATIC",
                }
            );
        }

        if (_wallet?.publicData?.btcAddress) {
            networks.push({
                address: _wallet?.publicData?.btcAddress,
                image: this.getAssetImage("BTC"),
                name: "Bitcoin",
                symbol: "BTC",
            });
        }

        if (_wallet?.publicData?.solanaAddress) {
            networks.push({
                address: _wallet?.publicData?.solanaAddress,
                image: this.getAssetImage("SOL"),
                name: "Solana",
                symbol: "SOL",
            });
        }

        if (_wallet?.publicData?.suiAddress) {
            networks.push({
                address: _wallet?.publicData?.suiAddress,
                image: this.getAssetImage("SUI"),
                name: "Sui",
                symbol: "SUI",
            });
        }

        if (_wallet?.publicData?.tonAddress) {
            networks.push({
                address: _wallet?.publicData?.tonAddress,
                image: this.getAssetImage("TON"),
                name: "Ton",
                symbol: "TON",
            });
        }

        if (_wallet?.publicData?.xlmAddress) {
            networks.push({
                address: _wallet?.publicData?.xlmAddress || "",
                image: this.getAssetImage("XLM"),
                name: "Stellar",
                symbol: "XLM",
            });
        }

        const pdForSubstrate = _wallet?.publicData as Record<string, unknown> | null | undefined;
        const dotAddr = readPublicDataDotAddress(pdForSubstrate);
        const ksmAddr = readPublicDataKsmAddress(pdForSubstrate);
        if (dotAddr) {
            networks.push({
                address: dotAddr,
                image: this.getAssetImage("DOT"),
                name: "Polkadot",
                symbol: "DOT",
            });
        }

        if (ksmAddr) {
            networks.push({
                address: ksmAddr,
                image: this.getAssetImage("KSM"),
                name: "Kusama",
                symbol: "KSM",
            });
        }

        return networks;
    }
}
