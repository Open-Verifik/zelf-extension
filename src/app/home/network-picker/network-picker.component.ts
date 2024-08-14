import { Component, Input, OnInit } from "@angular/core";
import { BlockchainNetworksService } from "app/blockchain-networks.service";
import { ChromeService } from "app/chrome.service";

@Component({
	selector: "home-network-picker",
	templateUrl: "./network-picker.component.html",
	styleUrls: ["./network-picker.component.scss"],
})
export class NetworkPickerComponent implements OnInit {
	@Input() shareables: any;
	loaded: boolean;
	selectedNetwork!: string;

	constructor(private _chromeService: ChromeService, private _blockchainNetworkService: BlockchainNetworksService) {
		this.loaded = true;
	}

	async ngOnInit(): Promise<any> {
		this.selectedNetwork = await this._chromeService.getItem("network");

		if (!this.selectedNetwork) {
			this.selectedNetwork = "eth";

			await this._chromeService.setItem("network", this.selectedNetwork);
		}
	}

	async selectThisNetwork(code: string): Promise<any> {
		this.selectedNetwork = code;

		await this._blockchainNetworkService.setSelectedNetwork(code);

		switch (code) {
			case "sepolia":
				break;
			case "eth":
				break;
			default:
				break;
		}

		this.shareables.view = "home";
	}
}
