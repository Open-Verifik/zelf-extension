import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpWrapperService } from "./http-wrapper.service";
import { environment } from "environments/environment";

@Injectable({
	providedIn: "root",
})
export class SolanaService {
	baseUrl: String = environment.apiUrl;
	tokens: Array<any> = [];

	constructor(private http: HttpClient, private _httpWrapper: HttpWrapperService) {}

	getWalletDetails(address?: string): Promise<any> {
		return this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/solana/address/${address}`);
	}

	formatTokens(tokens: Array<any>): void {
		for (let index = 0; index < tokens.length; index++) {
			const token = tokens[index];

			const _token = { ...token, symbol: token.symbol || token.name, network: "Solana" };

			if (_token.name === "Zelf") {
				_token.symbol = "ZNS";
			}

			this.tokens.push(_token);
		}
	}

	clearTokens(): void {
		this.tokens = [];
	}
}
