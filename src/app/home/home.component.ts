import { CurrencyPipe, NgClass, NgFor, NgIf } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatButtonModule } from "@angular/material/button";
import { Router, RouterLink } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";
import { firstValueFrom, Subject, takeUntil } from "rxjs";

import { AssetService } from "app/asset.service";
import { BlockchainNetworksService } from "app/blockchain-networks.service";
import { ChromeService } from "app/chrome.service";
import { BlockchainTransactionsService } from "app/services/blockchain-transactions.service";
import { AuthService } from "app/services/auth.service";
import { TagModel, TagsService } from "app/tags.service";
import { WalletService } from "app/wallet.service";
import { ZelfFooterComponent } from "app/zelf-footer/zelf-footer.component";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";
import { ZelfNameService } from "app/zelf-name-service.service";
import { HomeHeaderComponent } from "./home-header/home-header.component";
import { TokenCardComponent } from "./token-card/token-card.component";

@Component({
    imports: [
        CurrencyPipe,
        FlexLayoutModule,
        ZelfFooterComponent,
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
    wallet!: TagModel;

    constructor(
        private _assetService: AssetService,
        private _authService: AuthService,
        private _blockchainNetworkService: BlockchainNetworksService,
        private _blockchainTransactionsService: BlockchainTransactionsService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _chromeService: ChromeService,
        private _router: Router,
        private _tagsService: TagsService,
        private _walletService: WalletService,
        private _zelfNameService: ZelfNameService
    ) {
        this.balances = {};
        this.balancesLoading = false;

        this.shareables = {
            selectedTab: "assets",
            wallet: {},
        };

        this.NFTs = [];
        this.tokens = [];
    }

    async ngOnInit(): Promise<any> {
        this.selectedNetwork = await this._blockchainNetworkService._initNetwork();

        this._chromeService.onWalletChanged$.pipe(takeUntil(this.unsubscriber$)).subscribe(this._initializeWallet);

        this._cleanSessionItems();
    }

    private _cleanSessionItems(): void {
        this._chromeService.removeItem("transactionData");
        this._chromeService.removeItem("newTagName");
        this._chromeService.removeItem("flow");
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
            const deduped = this._dedupeTokens(sessionTokens);

            let totalFiatBalance = 0;

            deduped.forEach((token) => {
                if (token.fiatBalance) totalFiatBalance += parseFloat(token.fiatBalance);
            });

            this.tokens = deduped;
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
            this.tokens = this._dedupeTokens(result.tokens);
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
    private _initializeWallet = async (wallet: TagModel): Promise<void> => {
        if (this.wallet && this.wallet.tagName === wallet.tagName) return;

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

        if (currentWallet.tagName === nextWallet.tagName) return;

        await this.refreshTokens();
    };

    /**
     * Use with caution.
     * This updates the wallet in local storage and could trigger an endless update cycle with out subscription to onWalletChanged$.
     */
    private _refreshWallets = async (forceRefresh = false): Promise<void> => {
        await this._tagsService.refreshAllTagsPublicData([this.wallet] as TagModel[], forceRefresh);
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

        await this._authService.reauthenticateSession();

        try {
            const response = await firstValueFrom(
                this._blockchainTransactionsService.getAddressData(this.wallet).pipe(takeUntil(this.unsubscriberForBalances$))
            );

            const result = await this._assetService.processTokensFromResponse(response);
            this.tokens = this._dedupeTokens(result.tokens);
            this.totalFiatBalance = result.totalFiatBalance;
        } catch (error) {
            console.error("Error getting tokens:", error);
        } finally {
            this.balancesLoading = false;

            await this._refreshWallets(true);

            this._changeDetectorRef.detectChanges();
        }
    }

    private _dedupeTokens(tokens: Array<any>): Array<any> {
        const byKey = new Map<string, any>();

        for (const token of tokens || []) {
            const symbol = (token?.symbol || "").toString().trim();
            const name = (token?.name || "").toString().trim();
            const id = (symbol || name).toUpperCase();
            const network = (token?.network || "").toString();
            const tokenType = (token?.tokenType || "").toString();
            const key = `${network}|${tokenType}|${id}`;

            if (!byKey.has(key)) {
                byKey.set(key, token);
                continue;
            }

            const existing = byKey.get(key);
            const existingFiat = parseFloat(existing?.fiatBalance || "0") || 0;
            const candidateFiat = parseFloat(token?.fiatBalance || "0") || 0;

            if (candidateFiat > existingFiat) byKey.set(key, token);
        }

        return Array.from(byKey.values());
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

    async onTokenPinToggled(token: any): Promise<void> {
        const isPinned = await this._assetService.togglePinToken(token);

        // Update the token in the list
        const tokenIndex = this.tokens.findIndex((t) => t.symbol === token.symbol && t.network === token.network && t.tokenType === token.tokenType);

        if (tokenIndex !== -1) {
            this.tokens[tokenIndex].isPinned = isPinned;

            // Re-sort the tokens: pinned first, then by fiat balance
            this.tokens.sort((a, b) => {
                if (a.isPinned && !b.isPinned) return -1;
                if (!a.isPinned && b.isPinned) return 1;
                return b.fiatBalance - a.fiatBalance;
            });

            // Save updated tokens to session
            await this._assetService.saveTokensToSession(this.tokens);

            this._changeDetectorRef.detectChanges();
        }
    }
}
