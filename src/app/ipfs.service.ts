import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { HttpWrapperService } from "./http-wrapper.service";

@Injectable({
	providedIn: "root",
})
export class IpfsService {
	baseUrl: String = environment.apiUrl;
	zelfName: string = "";

	constructor(private _httpWrapper: HttpWrapperService) {}

	setZelfName(zelfName: string): void {
		this.zelfName = zelfName;
	}

	getZelfName(zelfName: string): string {
		return this.zelfName;
	}

	queryByZelfName(zelfName: string): Promise<any> {
		return this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/ipfs`, {
			key: "zelfName",
			value: zelfName,
		});
	}
}
