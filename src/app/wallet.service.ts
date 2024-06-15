import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { HttpWrapperService } from "./http-wrapper.service";
import { TranslocoService } from "@ngneat/transloco";
import { BehaviorSubject, Observable } from "rxjs";
import * as faceapi from "@vladmandic/face-api";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import * as openpgp from "openpgp";

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
		private _breakpointObserver: BreakpointObserver
	) {
		this.deviceData = this.getDeviceDetails();

		this.loadModels();

		this._breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).subscribe((result) => {
			this.deviceData.isMobile = result.matches;

			this.deviceData.time = result.matches ? 500 : 250;
		});

		this.deviceData.OS = this.detectOS();

		const wallet = localStorage.getItem("wallet");

		if (wallet) {
			this.wallet = JSON.parse(wallet);
		}
	}

	getDeviceData() {
		return this.deviceData;
	}

	getSessionData() {
		return this.sessionData;
	}

	getWallet() {
		if (this.wallet) return this.wallet;

		if (!localStorage.getItem("wallet")) return null;

		return JSON.parse(localStorage.getItem("wallet") || "{}");
	}

	setSteps(steps: Array<any>): void {
		this.sessionData.steps = steps;
	}

	goToNextStep(stepIndex: number): void {
		const step = this.sessionData.steps[stepIndex];

		const previousStep = this.sessionData.steps[stepIndex - 1];

		if (step) {
			step.isActive = true;

			step.isCompleted = false;
		}

		if (previousStep) {
			previousStep.isActive = false;

			previousStep.isCompleted = true;
		}

		this.sessionData.step = stepIndex;
	}

	restoreSession(): void {
		localStorage.removeItem("wallet");

		localStorage.removeItem("walletId");

		this.sessionData.step = 0;
		this.sessionData.password = "";
		this.sessionData.usePassword = false;
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

			// Detect touch capabilities
			touchSupported: "ontouchstart" in window,

			// Detect geolocation capabilities
			geolocationSupported: "geolocation" in navigator,

			// Browser online/offline status
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

		const uniqueString = `${navigatorInfo.userAgent}-${navigatorInfo.language}-${navigatorInfo.platform}-${screenInfo.height}x${screenInfo.width}`;

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

	findWallet(adress: string): Observable<any> {
		return this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/wallets`);
	}

	requestWallet(walletId: string): Observable<any> {
		return this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/wallets/${walletId}`);
	}

	createLivenessSession(data: any): Observable<any> {
		let url = `${this.baseUrl}/api/sessions`;

		return this._httpWrapper.sendRequest("post", url, data, {
			Headers: {},
		});
	}

	createWallet(data: any): Observable<any> {
		return this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/wallets`, data);
	}

	decryptWAllet(data: any): Observable<any> {
		return this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/wallets/decrypt`, data);
	}

	importWallet(data: any): Observable<any> {
		return this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/wallets/import`, data);
	}

	createAppRegistration(data: any): Observable<any> {
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
}
