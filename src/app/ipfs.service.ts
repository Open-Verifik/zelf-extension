import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { HttpWrapperService } from "./http-wrapper.service";
import { ChromeService } from "./chrome.service";

@Injectable({
	providedIn: "root",
})
export class IpfsService {
	baseUrl: String = environment.apiUrl;
	variables: any;
	zelfName: string = "";
	zelfFile: any;

	constructor(private _httpWrapper: HttpWrapperService, private chromeService: ChromeService) {
		this.variables = {
			zelfName: null,
			zelfFile: null,
		};

		this._initZelfName();
	}

	async _initZelfName(): Promise<any> {
		const zelfName = (await this.chromeService.getItem("zelfName")) || "";

		if (zelfName) this.variables.zelfName = zelfName;
	}

	setZelfName(zelfName: string): void {
		this.variables.zelfName = zelfName;
	}

	setZelfFile(ipfsFile: any): void {
		this.variables.zelfFile = ipfsFile;
	}

	getZelfName(): string {
		return this.variables.zelfName;
	}

	getZelfFile(): string {
		return this.variables.zelfFile;
	}

	queryByZelfName(zelfName: string): Promise<any> {
		return this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/open/ipfs`, {
			key: "zelfName",
			value: zelfName,
		});
	}

	queryByKeyValue(key: string, value: string): Promise<any> {
		return this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/open/ipfs`, {
			key,
			value,
		});
	}
}
