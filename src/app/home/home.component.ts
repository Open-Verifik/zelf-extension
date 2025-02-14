/// <reference types="chrome"/>
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BlockchainNetworksService } from "app/blockchain-networks.service";
import { ChromeService } from "app/chrome.service";
import { EthereumService } from "app/eth.service";
import { SolanaService } from "app/solana.service";
import { Asset, ETHTransaction, Wallet, WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { Subject, takeUntil } from "rxjs";

@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.scss", "../main.scss"],
})
export class HomeComponent implements OnInit {
	private unsubscriber$: Subject<void> = new Subject<void>();

	title: string = "something";
	wallet!: Wallet;
	wallets!: Array<Wallet>;
	balances: any;
	selectedAsset!: Asset;
	view?: string;
	shareables: any;
	activity!: Array<ETHTransaction>;
	tokens!: Array<any>;
	NFTs!: Array<any>;
	selectedNetwork!: string;
	balancesLoaded: boolean = false;

	constructor(
		private _router: Router,
		private route: ActivatedRoute,
		private _walletService: WalletService,
		private _ethService: EthereumService,
		private _chromeService: ChromeService,
		private _blockchainNetworkService: BlockchainNetworksService,
		private _solanaService: SolanaService
	) {
		this.balances = {};

		this.view = this.route.snapshot.queryParamMap.get("view") || "home";

		this.shareables = {
			view: this.view,
			selectedTab: "assets",
			wallet: {},
		};

		this.NFTs = [];

		this.tokens = [];

		localStorage.removeItem("unlockWallet");
	}

	async ngOnInit(): Promise<any> {
		this.selectedNetwork = await this._blockchainNetworkService._initNetwork();
		this.wallet = await this._setWallet();

		await this._getBalances();

		this.route.queryParamMap.pipe(takeUntil(this.unsubscriber$)).subscribe(async (params) => {
			const _view = params.get("view");

			switch (_view) {
				case "home":
					if (_view !== this.view) {
						this.balancesLoaded = false;
						this.wallet = await this._setWallet();

						this._getBalances();
					}

					break;

				default:
					break;
			}

			if (_view) {
				this.view = _view;
			}
		});
	}

	ngOnDestroy(): void {
		this.unsubscriber$.next();
		this.unsubscriber$.complete();
	}

	async _getBalances(): Promise<any> {
		if (this.balancesLoaded) return;

		this.tokens = [];

		await this._getETHDetails();
		await this._getSolanaDetails();

		this.balancesLoaded = true;
	}

	openFullPage(): void {
		try {
			const url = chrome.runtime.getURL("index.html");

			chrome.tabs.create({ url });
		} catch (exception) {
			alert(exception);
		}
	}

	async _setWallet(): Promise<any> {
		let wallet = await this._chromeService.getItem("wallet");

		if (!wallet?.ethAddress && !wallet?.solanaAddress) {
			this.wallets = await this._chromeService.getItem("wallets");

			wallet = this.wallets[0];

			this._chromeService.setItem("wallet", wallet);

			if (!wallet?.ethAddress && !wallet?.solanaAddress) {
				this._router.navigate(["/onboarding"]);

				return;
			}
		}

		this.shareables.wallet = new WalletModel(wallet);

		return this.shareables.wallet;
	}

	async _getSolanaDetails(): Promise<any> {
		if (!this.wallet?.solanaAddress) return;

		const details = await this._solanaService.getWalletDetails(this.wallet?.solanaAddress);

		if (!details) return;

		if (details.data.balance) {
			this.selectedAsset.fiatBalance += Number(details.data.fiatBalance);
		}

		this.getTokens("Solana", details.data.tokenHoldings.tokens);
	}

	async _getETHDetails(): Promise<any> {
		if (!this.wallet?.ethAddress) return;

		const details = await this._ethService.getWalletDetails(this.wallet.ethAddress);

		this.selectedAsset = new Asset({
			asset: details.data.account.asset,
			fiatBalance: Number(details.data.fiatBalance),
			balance: details.data.balance,
			price: details.data.account.price,
		});

		this.activity = [];

		for (let index = 0; index < details.data.transactions.length; index++) {
			const transaction = details.data.transactions[index];

			this.activity.push(new ETHTransaction(transaction));
		}

		this.getTokens("Ethereum", details.data.tokenHoldings.tokens);
	}

	getTokens(network: string, tokens: Array<any>): void {
		for (let index = 0; index < tokens.length; index++) {
			const token = tokens[index];

			if (["ERC-20", "ETH"].includes(token.tokenType) && token.price) {
				this.tokens.push({ ...token, network });
			} else if (["NFT"].includes(token.tokenType)) {
				this.NFTs.push({ ...token, network });
			}

			if (network === "Solana") {
				const _token = { ...token, symbol: token.symbol || token.name, network };

				if (_token.name === "Zelf") {
					_token.symbol = "ZNS";
				}

				this.tokens.push(_token);
			}
		}
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
