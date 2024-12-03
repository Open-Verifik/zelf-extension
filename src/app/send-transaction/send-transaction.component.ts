import { Component, OnInit } from "@angular/core";

import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { EthereumService } from "app/eth.service";
import { Wallet } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { ZelfNameService } from "app/zelf-name-service.service";

@Component({
	selector: "send-transaction",
	templateUrl: "./send-transaction.component.html",
	styleUrls: ["./send-transaction.component.scss", "../main.scss"],
})
export class SendTransactionComponent implements OnInit {
	shareables: any;
	session: any;
	wallet?: Wallet;
	tokens?: Array<any> = [];

	constructor(
		private _walletService: WalletService,
		private snackBar: MatSnackBar,
		private _router: Router,
		private _ethService: EthereumService,
		private _zelfNameService: ZelfNameService
	) {
		this.shareables = {
			view: "pickReceiver",
		};

		this.tokens = [];
	}

	async ngOnInit(): Promise<any> {
		this.session = this._walletService.getSessionData();

		const wallet = await this._walletService.retrieveWallet();

		this.tokens = [];

		this._getETHDetails(wallet);
	}

	async _getETHDetails(wallet: Wallet): Promise<any> {
		if (!wallet) return;

		this.wallet = wallet;

		if (!this.wallet?.ethAddress) return;

		const details = await this._ethService.getWalletDetails(this.wallet.ethAddress);

		for (let index = 0; index < details.data.tokenHoldings.tokens.length; index++) {
			const token = details.data.tokenHoldings.tokens[index];

			if (["ERC-20"].includes(token.tokenType) && token.price) {
				this.tokens?.push({ ...token, network: "Ethereum" });
			}
		}

		console.log({ tokens: this.tokens });
	}

	getTokens(network: string, tokens: Array<any>): void {}

	cancel(): void {
		this._router.navigate(["/home"]);
	}
}
