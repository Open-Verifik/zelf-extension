import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpWrapperService } from "./http-wrapper.service";
import { environment } from "environments/environment";

@Injectable({
	providedIn: "root",
})
export class SolanaService {
	baseUrl: String = environment.apiUrl;

	constructor(private http: HttpClient, private _httpWrapper: HttpWrapperService) {}

	getWalletDetails(address: string): Promise<any> {
		return this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/solana/address/${address}`);
	}
}
