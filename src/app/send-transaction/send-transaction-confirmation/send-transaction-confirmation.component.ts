import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ChromeService } from "app/chrome.service";
import { EthereumService } from "app/eth.service";
import { TransactionService } from "app/transaction.service";
import { Transaction, Wallet, WalletModel, TransactionModel } from "app/wallet";

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
		const temp = localStorage.getItem("temp_transactionData");

		if (temp) this.transactionData = new TransactionModel(JSON.parse(temp));

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

		if (this.transactionData.asset === "ETH") {
			this._getETHGasFees();
		}
	}

	async _getETHGasFees(): Promise<any> {
		const fees = await this._ethService.getGasPrices();

		if (this.transactionData.tokenType === "ETH") {
			this.transactionData.gasFee = Number(fees.data.average.cost.replace("$", ""));
		} else if (this.transactionData.tokenType === "ERC-20") {
			for (let index = 0; index < fees.data.featuredActions.length; index++) {
				const featureGasObject = fees.data.featuredActions[index];

				if (featureGasObject.action === "Swap") {
					this.transactionData.gasFee = Number(featureGasObject.average);
				}
			}
		}
	}

	goBack(): void {
		this._router.navigate(["/send-transaction-preview"]);
	}

	goNext(): void {
		this._setTransactionData();

		this._router.navigate(["/send-transaction-bridge"]);
	}

	_setTransactionData(): void {
		this._transactionService.setTransactionData(
			{
				gasFee: this.transactionData.gasFee,
				fiatTotal: this.transactionData.fiatAmount + this.transactionData.gasFee,
			},
			true
		);
	}

	cancel(): void {
		this._router.navigate(["/send-transaction-preview"]);
	}
}
