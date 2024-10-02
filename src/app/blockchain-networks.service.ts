import { Injectable } from "@angular/core";
import { ChromeService } from "./chrome.service";

@Injectable({
	providedIn: "root",
})
export class BlockchainNetworksService {
	selectedNetwork!: string;

	constructor(private _chromeService: ChromeService) {}

	async _initNetwork(): Promise<any> {
		this.selectedNetwork = await this._chromeService.getItem("network");

		if (!this.selectedNetwork) {
			this.selectedNetwork = "eth";

			await this._chromeService.setItem("network", this.selectedNetwork);
		}

		return this.selectedNetwork;
	}

	getSelectedNetwork(): string {
		return this.selectedNetwork || "ETH";
	}

	async setSelectedNetwork(code: string): Promise<any> {
		this.selectedNetwork = code;

		await this._chromeService.setItem("network", this.selectedNetwork);
	}
}
