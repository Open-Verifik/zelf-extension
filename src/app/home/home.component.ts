import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { firstValueFrom, Subject, takeUntil } from "rxjs";

import { BlockchainNetworksService } from "app/blockchain-networks.service";
import { BlockchainTransactionsService } from "app/services/blockchain-transactions.service";
import { ChromeService } from "app/chrome.service";
import { Wallet } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { AssetService } from "app/asset.service";

@Component({
    selector: "home",
    styleUrls: ["./home.component.scss", "../main.scss"],
    templateUrl: "./home.component.html",
    standalone: false
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
        private _changeDetectionRef: ChangeDetectorRef,
        private _chromeService: ChromeService,
        private _router: Router,
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
            if (this.balancesLoading) {
                this.unsubscriberForBalances$.next();
                this.unsubscriberForBalances$.complete();

                this.unsubscriberForBalances$ = new Subject<void>();
            }

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
            this._changeDetectionRef.detectChanges();

            return;
        }

        try {
            const response = await firstValueFrom(
                this._blockchainTransactionsService.getAddressData(this.wallet).pipe(takeUntil(this.unsubscriberForBalances$))
            );

            const result = await this._assetService.processTokensFromResponse(response, this.wallet);

            this.tokens = result.tokens;
            this.totalFiatBalance = result.totalFiatBalance;
        } catch (error) {
            console.error("Error getting tokens:", error);
        } finally {
            this.balancesLoading = false;
            this._changeDetectionRef.detectChanges();
        }
    }

    private async _setWallet(): Promise<any> {
        const wallet = await this._walletService.getFirstWalletFromStorage();

        this.shareables.wallet = wallet;
        this.wallet = this.shareables.wallet;
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

            const result = await this._assetService.processTokensFromResponse(response, this.wallet);

            this.tokens = result.tokens;
            this.totalFiatBalance = result.totalFiatBalance;
        } catch (error) {
            console.error("Error getting tokens:", error);
        } finally {
            this.balancesLoading = false;
            this._changeDetectionRef.detectChanges();
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
