import { CurrencyPipe, NgClass, NgFor, NgIf } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatButtonModule } from "@angular/material/button";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";
import { firstValueFrom, Subject, take, takeUntil } from "rxjs";

import { AssetService } from "app/asset.service";
import { BlockchainNetworksService } from "app/blockchain-networks.service";
import { ChromeService } from "app/chrome.service";
import { FooterComponent } from "app/footer/footer.component";
import { BlockchainTransactionsService } from "app/services/blockchain-transactions.service";
import { Wallet, WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { HomeHeaderComponent } from "./home-header/home-header.component";
import { TokenCardComponent } from "./token-card/token-card.component";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";
import { ZelfNameService } from "app/zelf-name-service.service";

@Component({
    imports: [
        CurrencyPipe,
        FlexLayoutModule,
        FooterComponent,
        HomeHeaderComponent,
        MatButtonModule,
        NgClass,
        NgFor,
        NgIf,
        RouterLink,
        TokenCardComponent,
        TranslocoModule,
        ZelfLoaderComponent,
    ],
    selector: "home",
    styleUrls: ["./home.component.scss", "../main.scss"],
    templateUrl: "./home.component.html",
})
export class HomeComponent implements OnInit, OnDestroy {
    private unsubscriber$: Subject<void> = new Subject<void>();
    private unsubscriberForBalances$: Subject<void> = new Subject<void>();

    balances: any;
    balancesLoading: boolean = false;
    NFTs!: Array<any>;
    selectedNetwork!: string;
    shareables: any;
    tokens!: Array<any>;
    totalFiatBalance: number = 0;
    view?: string;
    wallet!: Wallet;

    constructor(
        private _assetService: AssetService,
        private _blockchainNetworkService: BlockchainNetworksService,
        private _blockchainTransactionsService: BlockchainTransactionsService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _chromeService: ChromeService,
        private _router: Router,
        private _walletService: WalletService,
        private _zelfNameService: ZelfNameService,
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
    }

    async ngOnInit(): Promise<any> {
        this.selectedNetwork = await this._blockchainNetworkService._initNetwork();

        this._chromeService.onWalletChanged$.pipe(takeUntil(this.unsubscriber$)).subscribe(this._initializeWallet);
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();

        this.unsubscriberForBalances$.next();
        this.unsubscriberForBalances$.complete();
    }

    private async _getBalances(): Promise<any> {
        this.balancesLoading = true;
        this.tokens = [];
        this.NFTs = [];

        const sessionTokens = await this._assetService.loadTokensFromSession();

        if (sessionTokens.length > 0) {
            let totalFiatBalance = 0;

            sessionTokens.forEach((token) => {
                if (token.fiatBalance) totalFiatBalance += parseFloat(token.fiatBalance);
            });

            this.tokens = sessionTokens;
            this.totalFiatBalance = totalFiatBalance;

            this.balancesLoading = false;

            this._changeDetectorRef.detectChanges();

            return;
        }

        try {
            const response = await firstValueFrom(
                this._blockchainTransactionsService.getAddressData(this.wallet).pipe(takeUntil(this.unsubscriberForBalances$))
            );

            const result = await this._assetService.processTokensFromResponse(response);

            this.tokens = result.tokens;
            this.totalFiatBalance = result.totalFiatBalance;

            this._changeDetectorRef.detectChanges();
        } catch (error) {
            console.error("Error getting tokens:", error);
        } finally {
            this.balancesLoading = false;

            this._changeDetectorRef.detectChanges();
        }
    }

    /**
     * First call to initialize wallet, balances and refresh wallet if needed
     */
    private _initializeWallet = async (wallet: Wallet): Promise<void> => {
        if (this.wallet && this.wallet?.publicData?.zelfName === wallet?.publicData?.zelfName) return;

        if (this.balancesLoading) {
            this.unsubscriberForBalances$.next();
            this.unsubscriberForBalances$.complete();

            this.unsubscriberForBalances$ = new Subject<void>();
        }

        this.balancesLoading = true;

        await this._setWallet();
        await this._getBalances();
        await this._refreshWallets();

        this._chromeService.onWalletChanged$.pipe(takeUntil(this.unsubscriber$)).subscribe(this._listenForWalletUpdates);
    };

    /**
     * Set this listener once initialization is complete.
     * This helps prevent endless component update cycles should the wallet update in storage during initialization.
     */
    private _listenForWalletUpdates = async (): Promise<void> => {
        const currentWallet = this.wallet;

        await this._setWallet();

        const nextWallet = this.wallet;

        if (currentWallet.publicData.zelfName === nextWallet.publicData.zelfName) return;

        await this.refreshTokens();
    };

    /**
     * Use with caution.
     * This updates the wallet in local storage and could trigger an endless update cycle with out subscription to onWalletChanged$.
     */
    private _refreshWallets = async (forceRefresh = false): Promise<void> => {
        await this._zelfNameService.refreshAllWalletsPublicData([this.wallet] as WalletModel[], forceRefresh);
    };

    private async _setWallet(): Promise<any> {
        const wallet = await this._walletService.getFirstWalletFromStorage();

        if (!wallet?.name) {
            this._router.navigate(["/welcome"]);

            return;
        }

        this.shareables.wallet = wallet;
        this.wallet = this.shareables.wallet;

        this._changeDetectorRef.detectChanges();
    }

    async refreshTokens(): Promise<any> {
        if (this.balancesLoading) return;

        this.balancesLoading = true;
        this.tokens = [];
        this.NFTs = [];

        try {
            const response = await firstValueFrom(
                this._blockchainTransactionsService.getAddressData(this.wallet).pipe(takeUntil(this.unsubscriberForBalances$))
            );

            const result = await this._assetService.processTokensFromResponse(response);

            this.tokens = result.tokens;
            this.totalFiatBalance = result.totalFiatBalance;
        } catch (error) {
            console.error("Error getting tokens:", error);
        } finally {
            this.balancesLoading = false;

            await this._refreshWallets(true);

            this._changeDetectorRef.detectChanges();
        }
    }

    selectTab(tab: string): void {
        this.shareables.selectedTab = tab;
    }

    sendTransaction(): void {
        this._router.navigate(["/send-transaction"]);
    }

    async setSelectedAsset(asset: any): Promise<any> {
        await this._assetService.setSourceAsset(asset);

        this._router.navigate(["/asset"]);
    }
}
