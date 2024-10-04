import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { HttpWrapperService } from "./http-wrapper.service";

@Injectable({
	providedIn: "root",
})
export class IpfsService {
	baseUrl: String = environment.apiUrl;

	constructor(private _httpWrapper: HttpWrapperService) {}

	queryByZelfName(zelfName: string): Promise<any> {
		return this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/ipfs`, {
			key: "zelfName",
			value: zelfName,
		});
	}
}
