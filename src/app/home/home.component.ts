import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { firstValueFrom } from "rxjs";

import { BlockchainNetworksService } from "app/blockchain-networks.service";
import { BlockchainTransactionsService } from "app/services/blockchain-transactions.service";
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
        private _blockchainTransactionsService: BlockchainTransactionsService,
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
        this.balancesLoading = true;

        try {
            const response = await firstValueFrom(this._blockchainTransactionsService.getAddressData(this.wallet));
            console.log("Full response:", response);

            if (response?.ethereum?.data?.account) {
                this.selectedAsset = new Asset({
                    asset: response.ethereum.data.account.asset,
                    balance: response.ethereum.data.balance,
                    fiatBalance: Number(response.ethereum.data.fiatBalance),
                    price: response.ethereum.data.account.price,
                    network: "Ethereum",
                });
            }

            if (response?.ethereum?.data?.tokenHoldings?.tokens) {
                console.log("Processing Ethereum tokens:", response.ethereum.data.tokenHoldings.tokens);
                this._processTokens("Ethereum", response.ethereum.data.tokenHoldings.tokens);
            }

            if (response?.solana?.data?.tokenHoldings?.tokens) {
                console.log("Processing Solana tokens:", response.solana.data.tokenHoldings.tokens);
                this._processTokens("Solana", response.solana.data.tokenHoldings.tokens);
            }

            if (response?.avalanche?.data?.tokenHoldings?.tokens) {
                console.log("Processing Avalanche tokens:", response.avalanche.data.tokenHoldings.tokens);
                this._processTokens("Avalanche", response.avalanche.data.tokenHoldings.tokens);
            }

            await this._getETHDetails();
            await this._getSolanaDetails();
            await this._getAvalancheDetails();
        } catch (error) {
            console.error("Error getting tokens:", error);
        }

        this.balancesLoading = false;
        this._changeDetectionRef.detectChanges();
    }

    private _processTokens(network: string, tokens: Array<any>): void {
        console.log(`Processing ${network} tokens:`, tokens);

        for (const token of tokens) {
            if (!token.symbol && !token.name) continue;

            const formattedToken = {
                ...token,
                network,
                balance: parseFloat(token.amount || token.balance || "0"),
                fiatBalance: token.fiatBalance !== null ? parseFloat(token.fiatBalance || "0") : null,
                price: parseFloat(token.price || "0"),

                image: token.image,
            };

            const existingTokenIndex = this.tokens.findIndex((t) => t.symbol === formattedToken.symbol && t.network === formattedToken.network);

            if (existingTokenIndex === -1) {
                this.tokens.push(formattedToken);
            }
        }

        console.log(`Final tokens array:`, this.tokens);
        this._changeDetectionRef.detectChanges();
    }

    private async _getETHDetails(): Promise<any> {
        if (!this.wallet?.ethAddress) return;

        const details = await this._ethService.getWalletDetails(this.wallet.ethAddress);

        if (details?.data?.tokenHoldings?.tokens) {
            const newTokens = details.data.tokenHoldings.tokens.filter(
                (token: any) => !this.tokens.some((t) => t.symbol === token.symbol && t.network === "Ethereum")
            );
            if (newTokens.length > 0) {
                this._processTokens("Ethereum", newTokens);
            }
        }
    }

    private async _getSolanaDetails(): Promise<any> {
        if (!this.wallet?.solanaAddress) return;

        const details = await this._solanaService.getWalletDetails(this.wallet.solanaAddress);

        if (details?.data?.tokenHoldings?.tokens) {
            this._processTokens("Solana", details.data.tokenHoldings.tokens);
        }
    }

    private async _getAvalancheDetails(): Promise<any> {
        if (!this.wallet?.ethAddress) return;

        try {
            console.log("Getting AVAX details...");
            const details = await this._ethService.getAvalancheWalletDetails(this.wallet.ethAddress);

            if (details?.data?.tokenHoldings?.tokens) {
                this._processTokens("Avalanche", details.data.tokenHoldings.tokens);
            }
        } catch (error) {
            console.error("Error getting AVAX details:", error);
        }
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
