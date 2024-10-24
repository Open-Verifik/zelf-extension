import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { HttpWrapperService } from "./http-wrapper.service";
import { TranslocoService } from "@ngneat/transloco";
import { BehaviorSubject, Observable } from "rxjs";
import * as faceapi from "@vladmandic/face-api";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import * as openpgp from "openpgp";
import { ChromeService } from "./chrome.service";
import { Asset, Wallet, WalletModel } from "./wallet";

@Injectable({
	providedIn: "root",
})
export class WalletService {
	baseUrl: String = environment.apiUrl;
	private _faceapi: BehaviorSubject<any> = new BehaviorSubject(null);
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
	wallet: any;

	constructor(
		private _httpWrapper: HttpWrapperService,
		private _translocoService: TranslocoService,
		private _breakpointObserver: BreakpointObserver,
		private chromeService: ChromeService
	) {
		this.deviceData = this.getDeviceDetails();

		this.loadModels();

		this._breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).subscribe((result) => {
			this.deviceData.isMobile = result.matches;

			this.deviceData.time = result.matches ? 500 : 250;
		});

		this.deviceData.OS = this.detectOS();
	}

	getDeviceData() {
		return this.deviceData;
	}

	getSessionData() {
		return this.sessionData;
	}

	getWallet() {
		if (this.wallet) return this.wallet;

		const wallet = this.chromeService.getItem("wallet");

		return wallet;
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

		const steps = [...this.sessionData.steps];

		this.sessionData.steps = [];

		setTimeout(() => {
			this.sessionData.steps = steps;
		}, 150);
	}

	async restoreSession(): Promise<any> {
		const wallets = (await this.chromeService.getItem("wallets")) || [];

		const currentWallet = new WalletModel((await this.chromeService.getItem("wallet")) || {});

		localStorage.removeItem("unlockWallet");

		localStorage.removeItem("importWallet");

		localStorage.removeItem("zelfName");

		if (currentWallet.ethAddress) {
			wallets.push(currentWallet);

			this.chromeService.setItem("wallets", wallets);
			// localStorage.setItem("wallets", JSON.stringify(wallets));

			this.chromeService.removeItem("wallet");
			// localStorage.removeItem("wallet");
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
		return;
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

	generateUniqueId(): any {
		const navigatorInfo = window.navigator;

		const screenInfo = window.screen;

		let uniqueString = `${navigatorInfo.userAgent}-${navigatorInfo.language}-${navigatorInfo.platform}-${screenInfo.height}x${screenInfo.width}`;

		return { hash: this.simpleHash(uniqueString), userAgent: navigatorInfo.userAgent, height: screenInfo.height, width: screenInfo.width };
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

		return this._httpWrapper.sendRequest("post", url, data, {
			Headers: {},
		});
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

		this.chromeService.setItem("wallet", wallet);

		if (!index) {
			for (let _index = 0; _index < wallets.length; _index++) {
				const _wallet = wallets[_index];

				if (_wallet.ethAddress === wallet.ethAddress) index = _index;
			}
		}

		if (index !== undefined) {
			wallets[index] = wallet;

			this.chromeService.setItem("wallets", wallets);
		}
	}
}
