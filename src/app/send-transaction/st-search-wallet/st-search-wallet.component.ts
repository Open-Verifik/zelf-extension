import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { ChromeService } from "app/chrome.service";
import { EthereumService } from "app/eth.service";
import { TransactionService } from "app/transaction.service";
import { Wallet, WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { ZelfNameService } from "app/zelf-name-service.service";
import { environment } from "environments/environment";
import { Observable, debounceTime, distinctUntilChanged, map } from "rxjs";

@Component({
	selector: "st-search-wallet",
	templateUrl: "./st-search-wallet.component.html",
	styleUrls: ["../send-transaction.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class StSearchWalletComponent implements OnInit {
	@Input() shareables: any;
	searchForm!: UntypedFormGroup;
	searchQuery$!: Observable<string>;
	potentialWallet: any;
	session: any;
	myAccounts!: Array<Wallet>;
	loaded: boolean;
	destination!: any;
	walletToSearch!: string;
	domainToPurchase!: any;

	constructor(
		private _formBuilder: UntypedFormBuilder,
		private snackBar: MatSnackBar,
		private _walletService: WalletService,
		private _chromeService: ChromeService,
		private _transactionService: TransactionService,
		private _router: Router,
		private _ethService: EthereumService,
		private _zelfNameService: ZelfNameService
	) {
		this.loaded = false;
	}

	async ngOnInit(): Promise<any> {
		this.myAccounts = [];

		const currentWallet = new WalletModel((await this._chromeService.getItem("wallet")) || {});

		const wallets = (await this._chromeService.getItem("wallets")) || [];

		for (let index = 0; index < wallets.length; index++) {
			const wallet = new WalletModel({ index, ...wallets[index] });

			if (currentWallet.ethAddress === wallet.ethAddress) continue;

			this.myAccounts.push(wallet);
		}

		this.searchForm = this._formBuilder.group({
			address: ["", []],
		});

		this.loaded = true;
	}

	async pasteFromClipboard() {
		try {
			// Check if the Clipboard API is supported
			if (navigator.clipboard && navigator.clipboard.readText) {
				const clipboardText = await navigator.clipboard.readText();

				if (clipboardText.trim()) {
					this.searchForm.patchValue({ address: clipboardText });

					this.potentialWallet = clipboardText;

					this.triggerSearch();
				}
			} else {
				console.error("Clipboard API is not supported in your browser.");
			}
		} catch (error) {
			console.error("Failed to read clipboard content:", error);
		}
	}

	triggerSearch(triggeredBy: string = "subscribe"): void {
		this.shareables.loading = true;

		this.domainToPurchase = null;

		if (triggeredBy === "enter" && this.searchForm.value.address.trim()) {
			this.walletToSearch = this.searchForm.value.address;
		}

		if (!this.walletToSearch) {
			this.potentialWallet = null;

			this.shareables.loading = false;
			return;
		}

		const key = this.walletToSearch.includes(".zelf") ? "zelfName" : "ethAddress";

		this._zelfNameService
			.searchZelfName(key, this.walletToSearch)
			.then((response) => {
				if (!response.data || response.data.price) {
					this._validateAddress(response.data);

					this.shareables.loading = false;
					return;
				}

				const zelfProofObject = (response.data.arweave || response.data.ipfs)[0];

				// found the zelf name
				this.potentialWallet = new WalletModel(zelfProofObject);

				this.shareables.loading = false;
			})
			.catch((error) => {
				console.error({ error });

				this.startAgain();
			});
	}

	_validateAddress(payload: any): void {
		if (this.walletToSearch.includes(".zelf") && payload.price) {
			// it can be purchased
			this.domainToPurchase = payload;

			return;
		}

		this.domainToPurchase = null;

		if (!this._ethService.checkIfValidAddress(this.walletToSearch)) {
			this.snackBar.open("account not found", "OK");

			this.startAgain();

			return;
		}

		this.potentialWallet = new WalletModel({
			ethAddress: this.walletToSearch,
		});
	}

	startAgain(): void {
		this.potentialWallet = null;

		if (this.session) {
			this.session.identifier = null;
		}

		this.searchForm.patchValue({ address: "" });

		this.shareables.loading = false;
	}

	selectAccount(wallet: Wallet): void {
		this._transactionService.setTransactionData({
			receiver: wallet,
		});

		this._chromeService.setItem("temp_transactionData", { receiver: wallet });

		this._router.navigate(["/send-transaction-preview"]);
	}

	isZNSCardVisible(): boolean {
		const isVisible = Boolean(
			(this.potentialWallet && !this.potentialWallet?.name) || (this.domainToPurchase && this.domainToPurchase.zelfName === this.walletToSearch)
		);

		return isVisible;
	}
}
