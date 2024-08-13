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
	tokens!: Array<any>;
	NFTs!: Array<any>;

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
			selectedTab: "assets",
		};

		this.NFTs = [];

		this.tokens = [];
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
		const wallet = await this._setWallet();

		this._getWalletDetails(wallet);
	}

	async _setWallet(): Promise<any> {
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

		return wallet;
	}

	async _getWalletDetails(wallet: Wallet): Promise<any> {
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

		this._walletService.updateAssetValues(this.wallet, this.selectedAsset, this.wallets, undefined);

		this.getTokens(details.data.tokenHoldings.tokens);
	}

	getTokens(tokens: Array<any>): void {
		for (let index = 0; index < tokens.length; index++) {
			const token = tokens[index];

			if (["ERC-20"].includes(token.tokenType) && token.price) {
				this.tokens.push(token);
			} else if (["NFT"].includes(token.tokenType)) {
				this.NFTs.push(token);
			}
		}

		console.log({ nfts: this.NFTs });
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
