/// <reference types="chrome"/>
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { BlockchainNetworksService } from "app/blockchain-networks.service";
import { ChromeService } from "app/chrome.service";
import { EthereumService } from "app/eth.service";
import { SolanaService } from "app/solana.service";
import { Asset, ETHTransaction, Wallet, WalletModel } from "app/wallet";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss", "../main.scss"],
})
export class HomeComponent implements OnInit {
    activity!: Array<ETHTransaction>;
    balances: any;
    balancesLoaded: boolean = false;
    NFTs!: Array<any>;
    scanImplemented: boolean = false;
    selectedAsset!: Asset;
    selectedNetwork!: string;
    shareables: any;
    tokens!: Array<any>;
    view?: string;
    wallet!: Wallet;
    wallets!: Array<Wallet>;

    constructor(
        private _router: Router,
        private route: ActivatedRoute,
        private _ethService: EthereumService,
        private _chromeService: ChromeService,
        private _blockchainNetworkService: BlockchainNetworksService,
        private _solanaService: SolanaService
    ) {
        this.balances = {};
        this.view = this.route.snapshot.queryParamMap.get("view") || "home";

        this.shareables = {
            selectedTab: "assets",
            view: this.view,
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

        this.route.queryParamMap.subscribe(async (params) => {
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

    private async _getBalances(): Promise<any> {
        if (this.balancesLoaded) return;

        this.tokens = [];

        await this._getETHDetails();
        await this._getSolanaDetails();

        this.balancesLoaded = true;
    }

    private async _getETHDetails(): Promise<any> {
        if (!this.wallet?.ethAddress) return;

        const details = await this._ethService.getWalletDetails(this.wallet.ethAddress);

        this.selectedAsset = new Asset({
            asset: details.data.account.asset,
            balance: details.data.balance,
            fiatBalance: Number(details.data.fiatBalance),
            price: details.data.account.price,
        });

        this.activity = [];

        for (let index = 0; index < details.data.transactions.length; index++) {
            const transaction = details.data.transactions[index];

            this.activity.push(new ETHTransaction(transaction));
        }

        this._getTokens("Ethereum", details.data.tokenHoldings.tokens);
    }

    private async _getSolanaDetails(): Promise<any> {
        const details = await this._solanaService.getWalletDetails(this.wallet.solanaAddress);

        if (!details) return;

        if (details.data.balance) {
            this.selectedAsset.fiatBalance += Number(details.data.fiatBalance);
        }

        this._getTokens("Solana", details.data.tokenHoldings.tokens);
    }

    private _getTokens(network: string, tokens: Array<any>): void {
        const _tempTokens = [...this.tokens];
        const _tempNFTs = [...this.NFTs];

        for (let index = 0; index < tokens.length; index++) {
            const token = tokens[index];

            if (["ERC-20", "ETH"].includes(token.tokenType) && token.price) {
                _tempTokens.push({ ...token, network });
            } else if (["NFT"].includes(token.tokenType)) {
                _tempNFTs.push({ ...token, network });
            }

            if (network === "Solana") {
                const _token = { ...token, symbol: token.symbol || token.name, network };

                if (_token.name === "Zelf") {
                    _token.symbol = "ZNS";
                }

                _tempTokens.push(_token);
            }
        }

        this.tokens = _tempTokens;
        this.NFTs = _tempNFTs;
    }

    private async _setWallet(): Promise<any> {
        let wallet = await this._chromeService.getItem("wallet");

        if (!wallet) {
            this.wallets = await this._chromeService.getItem("wallets");

            wallet = this.wallets[0];

            this._chromeService.setItem("wallet", wallet);

            if (!wallet) {
                this._router.navigate(["/onboarding"]);
                return;
            }
        }

        this.shareables.wallet = new WalletModel(wallet);

        return this.shareables.wallet;
    }

    private _updateView(newView: string): void {
        this.view = newView;

        this._router.navigate([], {
            relativeTo: this.route, // Keep the current route
            queryParams: { view: this.view }, // Set new query params
            queryParamsHandling: "merge", // Merge with existing query params
        });
    }

    openActivePage(): void {
        this.shareables.view = this.shareables.view === "home" ? "activeAccountPage" : "home";

        this._updateView(this.shareables.view);
    }

    selectTab(tab: string): void {
        this.shareables.selectedTab = tab;
    }

    sendTransaction(): void {
        this._router.navigate(["/send-transaction"]);
    }
}
