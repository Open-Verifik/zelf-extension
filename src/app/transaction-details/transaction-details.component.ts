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

	goNext(): void {
		// this._router.navigate(["/send-transaction-bridge"]);
	}

	cancel(): void {
		this._router.navigate(["/home"]);
	}
}
