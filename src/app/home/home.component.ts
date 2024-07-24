/// <reference types="chrome"/>
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CryptoService } from "app/crypto.service";
import { EthereumService } from "app/eth.service";
import { Wallet, WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { environment } from "environments/environment";
@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["../main.scss", "./home.component.scss"],
})
export class HomeComponent implements OnInit {
	title: string = "something";
	wallet!: Wallet;
	balances: any;
	selectedTab: string;
	view: string;
	shareables: any;

	constructor(
		private _router: Router,
		private _walletService: WalletService,
		private _ethService: EthereumService,
		private _cryptoService: CryptoService
	) {
		this.balances = {};

		this.view = "home";

		this.selectedTab = "assets";

		this.shareables = {
			view: this.view,
			selectedTab: this.selectedTab,
		};
	}

	openFullPage(): void {
		// Use chrome.runtime.getURL to get the full URL of the extension page
		try {
			const url = chrome.runtime.getURL("index.html");

			chrome.tabs.create({ url });
		} catch (exception) {}

		this.view = this.view === "home" ? "activeAccountPage" : "home";
	}

	ngOnInit(): void {
		let wallet = JSON.parse(localStorage.getItem("wallet") || "");

		const wallets = localStorage.getItem("wallets");

		if (!wallet && (!wallets || wallets.length < 10)) {
			this._router.navigate(["/onboarding"]);

			return;
		}

		if (!wallet && wallets) {
			wallet = JSON.parse(wallets || "[]")[0];

			localStorage.setItem("wallet", JSON.stringify(wallet || ""));
		}

		this._getWallet(wallet);

		// this._testing();
	}

	async _testing(): Promise<any> {
		const fakeAccount = this._ethService.createAccount();

		this._ethService.importAccount(fakeAccount.privateKey);

		const _getAccount = this._ethService.getAccount();

		const balance = await this._ethService.getBalance();

		_getAccount.subscribe(async (value) => {
			const _balance = await this._ethService.getBalanceByAddress(value);

			this.balances = {
				eth: parseFloat(_balance).toFixed(5),
			};
		});
	}

	async _getWallet(wallet: any): Promise<any> {
		this.wallet = new WalletModel(wallet);

		if (!this.wallet.ethAddress) return;

		const ethBalance = await this._ethService.getBalanceByAddress(this.wallet.ethAddress);

		this.balances = {
			eth: parseFloat(ethBalance).toFixed(5),
		};

		this.getPrices();

		// this.getTokens();
	}

	getTokens(): void {
		this._cryptoService.getTokens(this.wallet.ethAddress).subscribe((data) => {
			// console.log({ tokens: data });
		});
	}

	getPrices(): void {
		this._cryptoService.getCryptoPrice("ethereum").subscribe((data) => {
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
