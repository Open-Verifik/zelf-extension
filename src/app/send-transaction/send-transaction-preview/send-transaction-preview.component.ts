import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ChromeService } from "app/chrome.service";
import { EthereumService } from "app/eth.service";
import { TransactionService } from "app/transaction.service";
import { Asset, Transaction, TransactionModel, Wallet } from "app/wallet";
import { WalletService } from "app/wallet.service";

@Component({
	selector: "app-send-transaction-preview",
	templateUrl: "./send-transaction-preview.component.html",
	styleUrls: ["../../main.scss", "./send-transaction-preview.component.scss", "../send-transaction.component.scss"],
})
export class SendTransactionPreviewComponent implements OnInit {
	shareables: any;
	@ViewChild("searchNgForm") searchNgForm!: NgForm;
	searchForm!: UntypedFormGroup;
	transactionData!: Transaction;
	loaded: Boolean;
	wallet!: Wallet;
	amountViewType: string = "USD";
	wallets!: Array<Wallet>;
	selectedAsset!: Asset;
	fees!: any;

	constructor(
		private _formBuilder: UntypedFormBuilder,
		private _transactionService: TransactionService,
		private _router: Router,
		private _chromeService: ChromeService,
		private _ethService: EthereumService,
		private _walletService: WalletService
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
			this.transactionData = new TransactionModel(temp_transactionData);
		}

		if (!this.transactionData?.receiver) {
			this._router.navigate(["send-transaction"]);

			return;
		}

		this.wallet = await this._chromeService.getItem("wallet");

		this.wallets = await this._chromeService.getItem("wallets");

		this.searchForm = this._formBuilder.group({
			address: [this.transactionData.receiver.ethAddress, []],
			amount: [0, [Validators.required]],
		});

		this._getAccountDetails();

		this._getGasFees();

		this.loaded = true;
	}

	async _getGasFees(): Promise<any> {
		const fees = await this._ethService.getGasPrices();

		this.fees = fees.data;

		console.log({ fees: this.fees });
	}

	async _getAccountDetails(): Promise<any> {
		const sampleWallet = "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5";

		this._ethService.changeNetwork(true);

		const details = await this._ethService.getWalletDetails(sampleWallet);

		this.selectedAsset = new Asset({
			asset: details.data.account.asset,
			fiatBalance: details.data.account.fiatValue,
			balance: details.data.balance,
			price: details.data.account.price,
		});

		this._walletService.updateAssetValues(this.wallet, this.selectedAsset, this.wallets, undefined);
	}

	goBack(): void {
		this._router.navigate(["/send-transaction"]);
	}

	goNext(): void {
		const canContinue = this._setTransactionData();

		if (!canContinue) return;

		this._router.navigate(["/send-transaction-confirm"]);
	}

	_setTransactionData(): boolean {
		this.amountViewType = "USD";

		this._transactionService.setTransactionData(
			{
				amount: this.searchForm.value.amount,
				asset: this.selectedAsset.asset,
				balance: this.selectedAsset.balance,
				price: this.getAmountView(),
			},
			true
		);

		return !this.isNextDisabled();
	}

	switchAmountView(): void {
		if (!this.wallet.assets) return;

		const previousAmount = this.getAmountView();

		this.searchForm.patchValue({ amount: previousAmount });

		this.amountViewType = this.amountViewType === "USD" ? this.selectedAsset.asset : "USD";
	}

	getAmountView(): number {
		if (!this.amountViewType || !this.searchForm?.value?.amount || !this.wallet || !this.wallet.assets) return 0;
		switch (this.amountViewType) {
			case "USD":
				return Number((this.searchForm.value.amount * this.selectedAsset.price).toFixed(9));

			default:
				return this.searchForm.value.amount / this.selectedAsset.price;
		}
	}

	selectMax(): void {
		this.amountViewType = "USD";

		this.searchForm.patchValue({ amount: this.selectedAsset.balance });
	}

	isNextDisabled(): boolean {
		if (!this.amountViewType || !this.searchForm?.value?.amount || !this.wallet || !this.wallet.assets) return true;

		let isDisabled = true;
		switch (this.amountViewType) {
			case "USD": // the input is in ETH
				isDisabled = Boolean(this.searchForm.value.amount > this.selectedAsset.balance);

				break;
			default: // the input is in USD
				isDisabled = Boolean(this.searchForm.value.amount / this.selectedAsset.price > this.selectedAsset.balance);
		}

		return isDisabled;
	}
}
