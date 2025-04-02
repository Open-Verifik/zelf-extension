import * as faceapi from "@vladmandic/face-api";
import * as openpgp from "openpgp";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { environment } from "environments/environment";

import { ChromeService } from "./chrome.service";
import { HttpWrapperService } from "./http-wrapper.service";
import { Asset, Transaction, Wallet, WalletModel } from "./wallet";

type UserFingerPrint = {
    hash: string;
    userAgent: string;
    height: number;
    width: number;
};

@Injectable({
    providedIn: "root",
})
export class WalletService {
    private _assetImageMap: Map<string, string> = new Map();
    private _faceapi: BehaviorSubject<any> = new BehaviorSubject(null);
    private _userFingerPrint!: UserFingerPrint;

    private _BTC_REGEX = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/;
    private _ETH_REGEX = /^(0x)?[0-9a-fA-F]{40}$/;
    private _SOL_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

    private _BTC_TRANSACTION_REGEX = /^[a-fA-F0-9]{64}$/; // Bitcoin transaction hash
    private _ETH_TRANSACTION_REGEX = /^0x([A-Fa-f0-9]{64})$/; // Ethereum transaction hash
    private _SOL_TRANSACTION_REGEX = /^[A-HJ-NP-Za-km-z1-9]{88}$/; // Solana transaction hash

    baseUrl: String = environment.apiUrl;
    zelfProof: string = "";

    deviceData: any = {
        generalInformation: [],
    };

    sessionData: any = {
        type: "",
        step: 0,
        wordsCount: 12,
        navigationStep: 1,
        password: "",
        usePassword: false,
        phrase: "",
        wallet: null,
    };

    constructor(private _httpWrapper: HttpWrapperService, private _breakpointObserver: BreakpointObserver, private _chromeService: ChromeService) {
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

        return {
            hash: this.simpleHash(uniqueString),
            userAgent: navigatorInfo.userAgent,
            height: screenInfo.height,
            width: screenInfo.width,
        };
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

    get BTCTransactionRegex(): RegExp {
        return this._BTC_TRANSACTION_REGEX;
    }

    get ETHTransactionRegex(): RegExp {
        return this._ETH_TRANSACTION_REGEX;
    }

    get SOLTransactionRegex(): RegExp {
        return this._SOL_TRANSACTION_REGEX;
    }

    getAssetImage(symbol: string): string {
        const cachedImage = this._assetImageMap.get(symbol);

        if (cachedImage) return cachedImage;

        if (!symbol) return "";

        let assetSrc: string = "";

        if (symbol === "ZNS") assetSrc = "./assets/icons/icon128.png";
        else assetSrc = `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/refs/heads/master/128/color/${symbol.toLowerCase()}.png`;

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
            "currentZelfName",
            "duration",
            "durationToken",
            "importWallet",
            "network",
            "password",
            "referralZelfName",
            "unlockWallet",
            "zelfFile",
            "zelfName",
            "zelfPrice",
            "zelfProof",
            "zelfReward",
        ];

        await Promise.all(keysToRemove.map((key) => this._chromeService.removeItem(key)));

        if (currentWallet?.ethAddress) {
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
        if (wallet) wallet = new WalletModel(wallet);

        if (!wallet?.ethAddress && wallets) {
            wallet = new WalletModel(wallets[0]);

            this._chromeService.setItem("wallet", wallet || "");
        }

        return wallet;
    }

    getShortAddress(address: string): string {
        const firstPart = address.slice(0, 12);
        const lastPart = address.slice(-8);

        return `${firstPart}...${lastPart}`;
    }

    async getAllWalletsFromStorage(): Promise<{ wallet: Partial<WalletModel> | null; wallets: WalletModel[] }> {
        const wallet = (await this._chromeService.getItem<Partial<Wallet> | null>("wallet")) || {};
        const wallets = await this.getWalletsFromStorage();

        if (!wallet?.ethAddress) {
            if (!wallets.length) return { wallet, wallets: [] };

            this._chromeService.setItem("wallet", wallet);
            this._chromeService.setItem("wallets", wallets);
        }

        return { wallet, wallets };
    }

    async getCurrentWallet(): Promise<Partial<WalletModel> | null> {
        let wallet = (await this._chromeService.getItem<Partial<Wallet> | null>("wallet")) || {};

        if (wallet?.ethAddress) wallet = new WalletModel(wallet);

        return wallet;
    }

    async getFirstWalletFromStorage(): Promise<Partial<WalletModel> | null> {
        let wallet = (await this._chromeService.getItem<Partial<Wallet> | null>("wallet")) || {};

        if (wallet?.ethAddress) wallet = new WalletModel(wallet);
        else {
            const wallets = await this.getWalletsFromStorage();

            if (!wallets.length) return {};

            const shiftedWallet = wallets.shift();

            wallet = shiftedWallet || {};

            this._chromeService.setItem("wallet", wallet);
            this._chromeService.setItem("wallets", wallets);
        }

        return wallet;
    }

    async updateCurrentWallet(wallet: Partial<WalletModel>): Promise<void> {
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

            return wallet;
        });

        if (hasUpdate) await this._chromeService.setItem("wallets", newWallets);
    }

    async getWalletsFromStorage(): Promise<WalletModel[]> {
        return ((await this._chromeService.getItem<Wallet[]>("wallets")) || []).map((wallet: Wallet) => new WalletModel(wallet));
    }

    async switchWallet(selectedWallet: WalletModel): Promise<void> {
        const wallet = (await this._chromeService.getItem<Partial<Wallet> | null>("wallet")) || {};

        if (selectedWallet.publicData.zelfName === wallet.publicData?.zelfName) return;

        const wallets = (await this._chromeService.getItem<Wallet[]>("wallets")) || [];
        const newWallets = wallets.filter((_wallet) => _wallet.publicData.zelfName !== selectedWallet.publicData.zelfName);

        await this._chromeService.setItem("wallet", selectedWallet);
        await this._chromeService.setItem("wallets", [wallet, ...newWallets]);
    }

    async logoutOfWallet(walletToRemove: WalletModel): Promise<boolean> {
        const { wallet: currentWallet, wallets } = await this.getAllWalletsFromStorage();

        let isLastWallet = true;

        if (!wallets.length) return isLastWallet;

        isLastWallet = false;

        if (currentWallet?.publicData?.zelfName === walletToRemove.publicData.zelfName) {
            await this._chromeService.removeItem("wallet");

            const wallet = wallets.shift();

            this._chromeService.setItem("wallet", wallet);
            this._chromeService.setItem("wallets", wallets);
        } else {
            const newWallets = wallets.filter((_wallet: WalletModel) => _wallet.publicData.zelfName !== walletToRemove.publicData.zelfName);

            this._chromeService.setItem("wallets", newWallets);
        }

        return isLastWallet;
    }

    async setWalletsToColdStorage(): Promise<void> {
        const wallet = await this._chromeService.getItem<WalletModel | null>("wallet");

        if (!wallet?.ethAddress) return;

        const wallets = await this.getWalletsFromStorage();

        const walletExistsInWallets = wallets.some((_wallet) => {
            wallet.name === _wallet.name;
        });

        if (!walletExistsInWallets) wallets.unshift(wallet);

        this._chromeService.setItem("wallet", {});
        this._chromeService.setItem("wallets", wallets);
    }

    async removeDuplicateWalletsInStorage(): Promise<void> {
        const { wallet, wallets } = await this.getAllWalletsFromStorage();

        if (!wallets.length || !wallet) return;

        const filteredWallets = wallets.filter((_wallet) => _wallet.publicData.zelfName !== wallet.publicData?.zelfName);

        await this._chromeService.setItem("wallets", filteredWallets);
    }

    public isValidEVMAddress(address: string): boolean {
        if (!this._ETH_REGEX.test(address)) {
            return false;
        }

        if (!address.startsWith("0x")) {
            address = "0x" + address;
        }

        address = address.toLowerCase();

        try {
            const addressHash = this.simpleHash(address.slice(2));
            const checksumAddress =
                "0x" +
                address
                    .slice(2)
                    .split("")
                    .map((char, index) => {
                        if (isNaN(parseInt(char, 16))) return char;
                        return parseInt(addressHash[index], 16) >= 8 ? char.toUpperCase() : char;
                    })
                    .join("");

            return address === checksumAddress.toLowerCase();
        } catch (error) {
            console.error("Error validating EVM address checksum:", error);
            return false;
        }
    }

    public async validateEVMAddressOnChain(address: string): Promise<boolean> {
        try {
            if (!this.isValidEVMAddress(address)) {
                return false;
            }

            const response = await this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/validate-address?address=${address}`);

            return response?.isValid || false;
        } catch (error) {
            console.error("Error validating EVM address on chain:", error);
            return false;
        }
    }

    public async getPendingTransaction(transactionHash: string): Promise<any> {
        if (!transactionHash) return;

        const pendingTransactions = await this._chromeService.getItem<any>("pendingTransactions");

        if (!pendingTransactions) return null;

        return pendingTransactions[transactionHash] || null;
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

        if (!pendingTransactions) {
            await this._chromeService.setItem("pendingTransactions", { [transaction.transactionHash]: transaction });
        } else {
            if (pendingTransactions[transaction.transactionHash]) return;

            pendingTransactions[transaction.transactionHash] = transaction;

            await this._chromeService.setItem("pendingTransactions", pendingTransactions);
        }
    }
}
