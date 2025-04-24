import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ChromeService } from "app/chrome.service";
import { EthereumService } from "app/eth.service";
import { SolanaService } from "app/solana.service";
import { TransactionService } from "app/transaction.service";
import { Asset, Transaction, TransactionModel, Wallet } from "app/wallet";
import { WalletService } from "app/wallet.service";

@Component({
    selector: "app-send-transaction-preview",
    templateUrl: "./send-transaction-preview.component.html",
    styleUrls: ["../../main.scss", "./send-transaction-preview.component.scss", "../send-transaction.component.scss"],
    standalone: false
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
		private _solanaService: SolanaService,
		private _walletService: WalletService
	) {
		this.shareables = {
			view: "pickReceiver",
		};

		this.transactionData = this._transactionService.getTransactionData();

		this.loaded = false;
	}

	async ngOnInit(): Promise<any> {
		const transactionToSend = this.transactionData ? null : await this._chromeService.getItem("temp_transactionData");

		if (transactionToSend && !this.transactionData) {
			this.transactionData = new TransactionModel(transactionToSend);
		}

		if (!this.transactionData?.receiver) {
			this._router.navigate(["send-transaction"]);

			return;
		}

		this.wallet = await this._chromeService.getItem("wallet");

		this.wallets = await this._chromeService.getItem("wallets");

		this.transactionData.receiver.selectedAddress = this.transactionData.receiver.ethAddress; // starts with ethAddress

		// based on the network it should get either ethAddress or solanaAddress from the receiver
		if (this.transactionData.network === "Solana") {
			this.transactionData.receiver.selectedAddress = this.transactionData.receiver.solanaAddress;
		}

		this.transactionData.receiver.selectedShortAddress = this._walletService.getShortAddress(this.transactionData.receiver.selectedAddress);

		this.searchForm = this._formBuilder.group({
			address: [this.transactionData.receiver.selectedShortAddress, []],
			amount: [0, [Validators.required]],
		});

		this._getAccountDetails();

		this.loaded = true;
	}

	async _getGasFees(): Promise<any> {
		let fees;

		switch (this.transactionData.network) {
			case "Ethereum":
				fees = await this._ethService.getGasPrices();
				break;

			case "Solana":
				fees = await this._solanaService.getGasPrices();

				break;

			default:
				break;
		}

		this.fees = fees.data;
	}

	async _getAccountDetails(): Promise<any> {
		this.selectedAsset = new Asset({
			asset: this.transactionData.asset,
			fiatBalance: this.transactionData.fiatBalance,
			balance: this.transactionData.balance,
			price: this.transactionData.price,
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
				fiatAmount: this.getAmountView(),
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
		return Number((this.searchForm.value.amount * this.selectedAsset.price).toFixed(9));
	}

	selectMax(): void {
		this.amountViewType = "USD";

		this.searchForm.patchValue({ amount: Number(this.selectedAsset.balance) });
	}

	isNextDisabled(): boolean {
		if (!this.searchForm?.value?.amount || !this.wallet || !this.wallet.assets) return true;

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

	cancel(): void {
		this._router.navigate(["/send-transaction"]);
	}
}
