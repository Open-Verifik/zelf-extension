import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { BlockchainNetworksService } from "app/blockchain-networks.service";
import { ChromeService } from "app/chrome.service";
import { EthereumService } from "app/eth.service";
import { SolanaService } from "app/solana.service";
import { Asset, Wallet } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "home",
    styleUrls: ["./home.component.scss", "../main.scss"],
    templateUrl: "./home.component.html",
})
export class HomeComponent implements OnInit, OnDestroy {
    private unsubscriber$: Subject<void> = new Subject<void>();

    balances: any;
    balancesLoading: boolean = false;
    NFTs!: Array<any>;
    scanImplemented: boolean = false;
    selectedAsset!: Asset;
    selectedNetwork!: string;
    shareables: any;
    tokens!: Array<any>;
    view?: string;
    wallet!: Wallet;

    constructor(
        private _blockchainNetworkService: BlockchainNetworksService,
        private _changeDetectionRef: ChangeDetectorRef,
        private _chromeService: ChromeService,
        private _ethService: EthereumService,
        private _router: Router,
        private _solanaService: SolanaService,
        private _walletService: WalletService,
        private route: ActivatedRoute
    ) {
        this.balances = {};
        this.balancesLoading = false;
        this.view = this.route.snapshot.queryParamMap.get("view") || "home";

        this.shareables = {
            selectedTab: "assets",
            view: this.view,
            wallet: {},
        };

        this.NFTs = [];
        this.tokens = [];

        this._chromeService.onWalletChanged$.pipe(takeUntil(this.unsubscriber$)).subscribe(async () => {
            if (this.balancesLoading) return;

            this.balancesLoading = true;

            await this._setWallet();
            await this._getBalances();
        });
    }

    async ngOnInit(): Promise<any> {
        this.selectedNetwork = await this._blockchainNetworkService._initNetwork();
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    private async _getBalances(): Promise<any> {
        this.tokens = [];
        this.NFTs = [];

        await this._getETHDetails();
        await this._getSolanaDetails();
        await this._getAvalancheDetails();

        this.balancesLoading = false;
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

        this._getTokens("Ethereum", details.data.tokenHoldings.tokens);
    }
    private async _getAvalancheDetails(): Promise<any> {
        if (!this.wallet?.ethAddress) return;

        try {
            console.log("Getting AVAX details...");
            const details = await this._ethService.getAvalancheWalletDetails(this.wallet.ethAddress);

            if (details?.data) {
                if (details.data.tokenHoldings?.tokens) {
                    this._getTokens("Avalanche", details.data.tokenHoldings.tokens);
                }
            }

            this._changeDetectionRef.detectChanges();
        } catch (error) {
            console.error("Error getting AVAX details:", error);
        }
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
        console.log("Raw tokens received:", tokens);
        for (let index = 0; index < tokens.length; index++) {
            const token = tokens[index];

            if (!token.symbol) {
                continue;
            }

            if (["ERC-20", "ETH", "AVAX"].includes(token.tokenType)) {
                if (["ETH", "AVAX"].includes(token.tokenType)) {
                    this.tokens.push(token);
                } else {
                    const formattedToken = {
                        ...token,
                        network,
                        balance: parseFloat(token.balance || "0"),
                        fiatBalance: parseFloat(token.fiatBalance || "0"),
                        price: parseFloat(token.price || "0"),
                    };
                    this.tokens.push(formattedToken);
                }
            } else if (["NFT"].includes(token.tokenType)) {
                this.NFTs.push({ ...token, network });
            }

            if (network === "Solana") {
                const _token = {
                    ...token,
                    symbol: token.symbol || token.name,
                    network,
                    balance: parseFloat(token.balance || "0"),
                    fiatBalance: parseFloat(token.fiatBalance || "0"),
                    price: parseFloat(token.price || "0"),
                };

                if (_token.name === "Zelf") {
                    _token.symbol = "ZNS";
                }

                this.tokens.push(_token);
            }
        }

        this.tokens = this.tokens.filter(
            (token, index, self) => token.symbol && index === self.findIndex((t) => t.symbol === token.symbol && t.network === token.network)
        );

        console.log("Processed tokens:", this.tokens);
        this._changeDetectionRef.detectChanges();
    }

    private async _setWallet(): Promise<any> {
        const wallet = await this._walletService.getFirstWalletFromStorage();

        this.shareables.wallet = wallet;

        this.wallet = this.shareables.wallet;
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
