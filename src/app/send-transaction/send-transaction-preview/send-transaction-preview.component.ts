import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ChromeService } from "app/chrome.service";
import { EthereumService } from "app/eth.service";
import { TransactionService } from "app/transaction.service";
import { Wallet } from "app/wallet";

@Component({
	selector: "app-send-transaction-preview",
	templateUrl: "./send-transaction-preview.component.html",
	styleUrls: ["../../main.scss", "./send-transaction-preview.component.scss", "../send-transaction.component.scss"],
})
export class SendTransactionPreviewComponent implements OnInit {
	shareables: any;
	@ViewChild("searchNgForm") searchNgForm!: NgForm;
	searchForm!: UntypedFormGroup;
	transactionData!: any;
	loaded: Boolean;
	wallet!: Wallet;

	constructor(
		private _formBuilder: UntypedFormBuilder,
		private _transactionService: TransactionService,
		private _router: Router,
		private _chromeService: ChromeService,
		private _ethService: EthereumService
	) {
		this.shareables = {
			view: "home",
		};

		this.transactionData = this._transactionService.getTransactionData();

		this.loaded = false;
	}

	async ngOnInit(): Promise<any> {
		const temp_transactionData = await this._chromeService.getItem("temp_transactionData");

		if (temp_transactionData && !this.transactionData) {
			this.transactionData = temp_transactionData;
		}

		if (!this.transactionData) {
			this._router.navigate(["send-transaction"]);

			return;
		}

		this.wallet = await this._chromeService.getItem("wallet");

		this.searchForm = this._formBuilder.group({
			address: [this.transactionData.destination.ethAddress, []],
			amount: [0, [Validators.required]],
		});

		this._getAccountDetails();

		this.loaded = true;
	}

	async _getAccountDetails(): Promise<any> {
		const sampleWallet = "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5";

		// tsting
		this._ethService.changeNetwork(true);

		const balance = await this._ethService.getBalanceByAddress(sampleWallet);

		if (!this.wallet.assets) this.wallet.assets = [];

		this.wallet.assets.push({
			asset: "ETH",
			balance: Number(balance),
		});

		console.log({ wallet: this.wallet });
	}

	cancel(): void {}

	goBack(): void {
		this._router.navigate(["/send-transaction"]);
	}

	goNext(): void {
		this._setTransactionData();

		this._router.navigate(["/send-transaction-confirm"]);
	}

	_setTransactionData(): void {}
}
