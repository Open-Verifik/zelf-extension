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

	searchZelfName(key = "zelfName", value: string, captchaToken: string): Promise<any> {
		return this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/zelf-name-service/search`, {
			key,
			value,
			captchaToken,
		});
	}

	setZelfName(zelfName: string, price: number): void {
		this.variables.zelfName = zelfName;

		this.variables.price = price;

		zelfName ? localStorage.setItem("zelfName", zelfName) : localStorage.removeItem("zelfName");
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

	getZelfName(): string {
		return this.variables.zelfName || localStorage.getItem("zelfName");
	}

	getZelfFile(): string {
		return this.variables.zelfFile;
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
