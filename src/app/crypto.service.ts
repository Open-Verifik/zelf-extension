import { Injectable } from "@angular/core";
import { HttpWrapperService } from "./http-wrapper.service";
import { Observable } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class CryptoService {
	private apiUrl = "https://api.coingecko.com/api/v3/simple/price";
	private ethScanKey = "Z34TM6TYEI1Q686YNBQUPACM84B5ZDEKCW"; // Replace with your Etherscan API Key
	private ethScanUrl = "https://api.etherscan.io/api";

	constructor(private _httpWrapper: HttpWrapperService) {}

	getCryptoPrice(coin: string, currency: string = "usd"): Promise<any> {
		return this._httpWrapper.sendRequest("get", `${this.apiUrl}?ids=${coin}&vs_currencies=${currency}`);
	}

	getTokens(address: string): Promise<any> {
		const url = `${this.ethScanUrl}?module=account&action=tokentx&address=${address}&page=1&offset=100&sort=asc&apikey=${this.ethScanKey}`;

		return this._httpWrapper.sendRequest("get", url);
	}
}
