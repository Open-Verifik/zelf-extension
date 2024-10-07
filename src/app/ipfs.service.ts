import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { HttpWrapperService } from "./http-wrapper.service";
import { ChromeService } from "./chrome.service";

@Injectable({
	providedIn: "root",
})
export class IpfsService {
	baseUrl: String = environment.apiUrl;
	zelfName: string = "";

	constructor(private _httpWrapper: HttpWrapperService, private chromeService: ChromeService) {
		this._initZelfName();
	}

	async _initZelfName(): Promise<any> {
		const zelfName = (await this.chromeService.getItem("zelfName")) || "";

		if (zelfName) this.zelfName = zelfName;
	}

	async setZelfName(zelfName: string): Promise<any> {
		this.zelfName = zelfName;

		return this.chromeService.setItem("zelfName", this.zelfName);
	}

	getZelfName(): string {
		return this.zelfName;
	}

	queryByZelfName(zelfName: string): Promise<any> {
		return this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/ipfs`, {
			key: "zelfName",
			value: zelfName,
		});
	}

	queryByKeyValue(key: string, value: string): Promise<any> {
		return this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/ipfs`, {
			key,
			value,
		});
	}
}
