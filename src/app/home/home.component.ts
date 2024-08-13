/// <reference types="chrome"/>
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ChromeService } from "app/chrome.service";
import { CryptoService } from "app/crypto.service";
import { EthereumService } from "app/eth.service";
import { Asset, ETHTransaction, Wallet, WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";

@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["../main.scss", "./home.component.scss"],
})
export class HomeComponent implements OnInit {
	title: string = "something";
	wallet!: Wallet;
	wallets!: Array<Wallet>;
	balances: any;
	selectedAsset!: Asset;
	view: string;
	shareables: any;
	activity!: Array<ETHTransaction>;

	constructor(
		private _router: Router,
		private _walletService: WalletService,
		private _ethService: EthereumService,
		private _cryptoService: CryptoService,
		private _chromeService: ChromeService
	) {
		this.balances = {};

		this.view = "home";

		this.shareables = {
			view: this.view,
			selectedTab: "activity",
		};
	}

	openFullPage(): void {
		try {
			const url = chrome.runtime.getURL("index.html");

			chrome.tabs.create({ url });
		} catch (exception) {
			alert(exception);
		}
	}

	async ngOnInit(): Promise<any> {
		let wallet = await this._chromeService.getItem("wallet");

		const wallets = (await this._chromeService.getItem("wallets")) || [];

		if (!wallet && (!wallets || !wallets.length)) {
			this._router.navigate(["/onboarding"]);

			return;
		}

		if (wallet) {
			wallet = new WalletModel(wallet);
		}

		if (wallets) {
			this.wallets = [];

			for (let index = 0; index < wallets.length; index++) {
				const _wallet = wallets[index];

				this.wallets.push(new WalletModel(_wallet));
			}
		}

		if (!wallet?.ethAddress && wallets) {
			wallet = wallets[0];

			this._chromeService.setItem("wallet", wallet || "");
		}

		this._getWallet(wallet);
	}

	async _getWallet(wallet: Wallet): Promise<any> {
		this.wallet = wallet;

		this.wallet.ethAddress = "0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97";

		if (!this.wallet.ethAddress) return;

		const details = await this._ethService.getWalletDetails(this.wallet.ethAddress);

		this.selectedAsset = new Asset({
			asset: details.data.account.asset,
			fiatBalance: details.data.account.fiatValue,
			balance: details.data.balance,
			price: details.data.account.price,
		});

		this.activity = [];

		for (let index = 0; index < details.data.transactions.length; index++) {
			const transaction = details.data.transactions[index];

			this.activity.push(new ETHTransaction(transaction));
		}

		console.log({ activity: this.activity });

		this._walletService.updateAssetValues(this.wallet, this.selectedAsset, this.wallets, undefined);

		this.getPrices();

		// this.getTokens();
	}

	getTokens(): void {
		this._cryptoService.getTokens(this.wallet.ethAddress).then((data) => {
			console.log({ tokens: data });
		});
	}

	getPrices(): void {
		this._cryptoService.getCryptoPrice("ethereum").then((data) => {
			this.balances.ethPrice = parseFloat(`${data.ethereum.usd * this.balances.eth}`).toFixed(5);

			// console.log({ balances: this.balances, data });
		});
	}

	_redirectToOnboarding(): void {
		this._router.navigate(["/onboarding"]);
	}

	getAddress(): string {
		const address = this.wallet?.publicData?.ethAddress || "";

		if (!address) return "";

		return this._walletService.getDisplayableAddress(address);
	}

	openAccountsPage(): void {
		this.shareables.view = this.shareables.view === "home" ? "accountsPage" : "home";
	}

	selectTab(tab: string): void {
		this.shareables.selectedTab = tab;
	}

	sendTransaction(): void {
		this._router.navigate(["/send-transaction"]);
	}
}
