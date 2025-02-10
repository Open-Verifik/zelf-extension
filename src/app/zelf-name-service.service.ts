import { Injectable } from "@angular/core";

import { environment } from "../environments/environment";
import { HttpWrapperService } from "./http-wrapper.service";

@Injectable({
	providedIn: "root",
})
export class ZelfNameService {
	baseUrl: String = environment.apiUrl;
	variables: any;

	constructor(private _httpWrapper: HttpWrapperService) {
		this.variables = {
			zelfName: null,
			price: 0,
			zelfFile: null,
			zelfProof: null,
			duration: 1,
		};
	}

	cleanVariables(): void {
		const keys = ["zelfProof", "zelfFile", "zelfName", "zelfPrice", "zelfReward", "duration"];

		keys.forEach((key) => {
			localStorage.removeItem(key);
		});
	}

	searchZelfName(key = "zelfName", value: string, captchaToken?: string): Promise<any> {
		return this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/zelf-name-service/search`, {
			key,
			value,
			captchaToken,
		});
	}

	previewZelfName(zelfName?: string, captchaToken?: string): Promise<any> {
		return this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/zelf-name-service/search`, {
			zelfName,
			captchaToken,
		});
	}

	previewZelfProof(zelfProof: string, captchaToken?: string): Promise<any> {
		return this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/zelf-name-service/preview-zelfproof`, {
			os: "DESKTOP",
			zelfProof,
			captchaToken,
		});
	}

	setZelfName(zelfName: string, priceObject: any = {}): void {
		this.variables.zelfName = zelfName;

		zelfName ? localStorage.setItem("zelfName", zelfName) : localStorage.removeItem("zelfName");

		if (priceObject?.price) {
			this.variables.price = priceObject.price;
			this.variables.reward = priceObject.reward;
			localStorage.setItem("zelfPrice", `${priceObject?.price}`);
			localStorage.setItem("zelfReward", `${priceObject?.reward}`);
		}
	}

	setZelfFile(zelfNameObject: any): void {
		this.variables.zelfFile = zelfNameObject;
	}

	setZelfProof(zelfProof: string): void {
		this.variables.zelfProof = zelfProof;
	}

	setDuration(duration: any): void {
		this.variables.duration = duration;

		localStorage.setItem("duration", duration);
	}

	setReferral(referralZelfName: string): void {
		localStorage.setItem("referralZelfName", referralZelfName);
	}

	getReferral(): any {
		return localStorage.getItem("referralZelfName");
	}

	getZelfName(): string {
		return this.variables.zelfName || localStorage.getItem("zelfName");
	}

	getZelfFile(): string {
		return this.variables.zelfFile;
	}

	getZelfPrice(): any {
		return this.variables.price || localStorage.getItem("zelfPrice");
	}

	getZelfReward(): any {
		return this.variables.reward || localStorage.getItem("zelfReward");
	}

	getZelfProof(): string {
		return this.variables.zelfProof;
	}

	getDuration(): any {
		return this.variables.duration || localStorage.getItem("duration");
	}

	leaseZelfName(payload: any): Promise<any> {
		return this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/zelf-name-service/lease`, payload);
	}

	decryptZelfName(payload: any): Promise<any> {
		return this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/zelf-name-service/decrypt`, payload);
	}
}
