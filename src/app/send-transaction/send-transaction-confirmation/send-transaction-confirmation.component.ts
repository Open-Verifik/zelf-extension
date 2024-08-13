import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ChromeService } from "app/chrome.service";
import { EthereumService } from "app/eth.service";
import { TransactionService } from "app/transaction.service";
import { Transaction, Wallet, WalletModel } from "app/wallet";

@Component({
	selector: "app-send-transaction-confirmation",
	templateUrl: "./send-transaction-confirmation.component.html",
	styleUrls: ["./send-transaction-confirmation.component.scss", "../../main.scss"],
})
export class SendTransactionConfirmationComponent implements OnInit {
	transactionData!: Transaction;
	wallet!: Wallet;
	gasPrices: any;
	selectedGasFee: any;

	constructor(
		private _transactionService: TransactionService,
		private _router: Router,
		private _chromeService: ChromeService,
		private _ethService: EthereumService
	) {
		this.transactionData = this._transactionService.getTransactionData();

		if (!this.transactionData) {
			this.goBack();

			return;
		}
	}

	async ngOnInit(): Promise<any> {
		this.wallet = new WalletModel((await this._chromeService.getItem("wallet")) || {});

		if (!this.transactionData?.sender) {
			this.transactionData.sender = this.wallet;
		}

		// this._ethService.getGasPrices().subscribe((response) => {
		// 	this.gasPrices = response["result"];
		// 	console.log({ gasPrices: this.gasPrices });
		// });
	}

	goBack(): void {
		this._router.navigate(["/send-transaction-preview"]);
	}

	goNext(): void {
		this._setTransactionData();

		this._router.navigate(["/send-transaction-bridge"]);
	}

	_setTransactionData(): void {
		this.selectedGasFee = this.displayGasInUSD(this.gasPrices.ProposeGasPrice);

		this._transactionService.setTransactionData(
			{
				gasFee: this.selectedGasFee,
				total: this.transactionData.price + this.selectedGasFee,
			},
			true
		);
	}

	displayGasInUSD(unit: string): number {
		return (parseFloat(unit) / 1e9) * this.transactionData.price * 21000;
	}

	getTotal(unit: string): number {
		return this.transactionData.price + this.displayGasInUSD(unit);
	}
}
