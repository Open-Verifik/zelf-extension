import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { ChromeService } from "app/chrome.service";
import { EthereumService } from "app/eth.service";
import { TransactionService } from "app/transaction.service";
import { Wallet, WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { environment } from "environments/environment";
import { Observable, debounceTime, distinctUntilChanged, map } from "rxjs";

@Component({
	selector: "st-search-wallet",
	templateUrl: "./st-search-wallet.component.html",
	styleUrls: ["../send-transaction.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class StSearchWalletComponent implements OnInit {
	searchForm!: UntypedFormGroup;
	searchQuery$!: Observable<string>;
	potentialWallet: any;
	session: any;
	myAccounts!: Array<Wallet>;
	loaded: boolean;
	destination!: any;
	walletToSearch!: string;

	constructor(
		private _formBuilder: UntypedFormBuilder,
		private snackBar: MatSnackBar,
		private _walletService: WalletService,
		private _chromeService: ChromeService,
		private _transactionService: TransactionService,
		private _router: Router,
		private _ethService: EthereumService
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

		this.searchQuery$ = this.searchForm.get("address")!.valueChanges.pipe(
			debounceTime(1000), // wait for 300ms pause in events
			distinctUntilChanged(), // ignore if next search query is same as previous
			map((value) => value.trim()) // map the value to the trimmed string
		);

		this.searchQuery$.subscribe((query) => {
			this.walletToSearch = query;

			this.triggerSearch();
		});

		this.loaded = true;
	}

	triggerSearch(): void {
		if (!this.walletToSearch) {
			this.potentialWallet = null;

			return;
		}

		this._walletService
			.findWallet(this.walletToSearch)
			.then((response) => {
				this.potentialWallet = new WalletModel(response.data);
				console.log({ response: this.potentialWallet });
			})
			.catch((error) => {
				if (!this._ethService.checkIfValidAddress(this.walletToSearch)) {
					this.snackBar.open("account not found", "OK");

					this.startAgain();

					return;
				}

				this.potentialWallet = new WalletModel({
					ethAddress: this.walletToSearch,
				});
			});
	}

	startAgain(): void {
		this.potentialWallet = null;

		this.session.identifier = null;

		this.searchForm.patchValue({ address: "" });
	}

	selectAccount(wallet: Wallet): void {
		this._transactionService.setTransactionData({
			destination: wallet,
		});

		this._chromeService.setItem("temp_transactionData", { destination: wallet });

		this._router.navigate(["/send-transaction-preview"]);
	}
}
