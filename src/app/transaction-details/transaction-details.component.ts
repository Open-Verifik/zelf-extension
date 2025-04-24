import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ChromeService } from "app/chrome.service";
import { EthereumService } from "app/eth.service";
import { TransactionService } from "app/transaction.service";
import { TransactionModel, WalletModel, Transaction, Wallet } from "app/wallet";
import { WalletService } from "app/wallet.service";

@Component({
    selector: "app-transaction-details",
    templateUrl: "./transaction-details.component.html",
    styleUrls: ["./transaction-details.component.scss", "../main.scss"],
    standalone: false
})
export class TransactionDetailsComponent implements OnInit {
	details!: any;

	constructor(
		private _transactionService: TransactionService,
		private _router: Router,
		private _chromeService: ChromeService,
		private _ethService: EthereumService,
		private _walletService: WalletService
	) {}

	async ngOnInit(): Promise<any> {
		this.details = await this._chromeService.getItem("transactionDetails");

		if (!this.details) {
			this._router.navigate(["/home"]);
		}

		this._formatData();
	}

	_formatData(): void {}

	viewOnExplorer(): void {
		const transactionId = this.details.transactionId;
		switch (this.details.asset) {
			case "ETH":
				const etherscanUrl = `https://etherscan.io/tx/${transactionId}`;

				window.open(etherscanUrl, "_blank");

				break;

			default:
				break;
		}
		// this._router.navigate(["/send-transaction-bridge"]);
	}

	openAddressExplorer(address: string): void {
		switch (this.details.asset) {
			case "ETH":
				const etherscanUrl = `https://etherscan.io/address/${address}`;

				window.open(etherscanUrl, "_blank");

				break;

			default:
				break;
		}
	}

	cancel(): void {
		this._router.navigate(["/home"]);
	}
}
