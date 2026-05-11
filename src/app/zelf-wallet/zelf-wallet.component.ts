import { NgClass, NgFor, NgIf } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatButtonModule } from "@angular/material/button";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";
import { firstValueFrom, Subject, takeUntil } from "rxjs";

import { AssetService } from "app/asset.service";
import { BlockchainNetworksService } from "app/blockchain-networks.service";
import { ChromeService } from "app/chrome.service";
import { BlockchainTransactionsService } from "app/services/blockchain-transactions.service";
import { AuthService } from "app/services/auth.service";
import { SettingsService } from "app/services/settings.service";
import { TagModel, TagsService } from "app/tags.service";
import { WalletService } from "app/wallet.service";
import {
    zelfWalletLoadPerfLog,
    zelfWalletLoadPerfMark,
    zelfWalletLoadPerfMeasure,
    zelfWalletLoadPerfStart,
} from "@shared/utils/zelf-wallet-load-perf";
import { ZelfFooterComponent } from "app/zelf-footer/zelf-footer.component";
import { ZelfNameService } from "app/zelf-name-service.service";
import { HomeCollectiblesComponent } from "./home-collectibles/home-collectibles.component";
import { HomeHeaderComponent } from "./home-header/home-header.component";
import { TokenCardComponent } from "./token-card/token-card.component";
import { WalletBalanceTopCardComponent } from "./wallet-balance-top-card/wallet-balance-top-card.component";

@Component({
    imports: [
        FlexLayoutModule,
        HomeCollectiblesComponent,
        HomeHeaderComponent,
        MatButtonModule,
        NgClass,
        NgFor,
        NgIf,
        RouterLink,
        TokenCardComponent,
        TranslocoModule,
        WalletBalanceTopCardComponent,
        ZelfFooterComponent,
    ],
    selector: "zelf-wallet",
    styleUrls: ["./zelf-wallet.component.scss", "../main.scss"],
    templateUrl: "./zelf-wallet.component.html",
})
export class ZelfWalletComponent implements OnInit, OnDestroy {
    private unsubscriber$: Subject<void> = new Subject<void>();
    private unsubscriberForBalances$: Subject<void> = new Subject<void>();

    balances: any;
    balancesLoading: boolean = false;
    collectiblesReloadKey = 0;
    hideBalances: boolean = false;
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
        private _route: ActivatedRoute,
        private _router: Router,
        private _settingsService: SettingsService,
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

        this.tokens = [];
    }

    async ngOnInit(): Promise<any> {
        zelfWalletLoadPerfStart();

        const storedHide = await this._chromeService.getItem("hideWalletBalances");

        this.hideBalances = storedHide === true || storedHide === "true";

        this._chromeService.onHideWalletBalancesChanged$.pipe(takeUntil(this.unsubscriber$)).subscribe((hidden) => {
            this.hideBalances = hidden;
            this._changeDetectorRef.detectChanges();
        });

        zelfWalletLoadPerfMark("initNetwork:start");
        this.selectedNetwork = await this._blockchainNetworkService._initNetwork();
        zelfWalletLoadPerfMark("initNetwork:end");

        this._chromeService.onWalletChanged$.pipe(takeUntil(this.unsubscriber$)).subscribe(this._initializeWallet);

        this._route.queryParams.pipe(takeUntil(this.unsubscriber$)).subscribe((q) => {
            if (q["tab"] === "nfts") {
                this.shareables.selectedTab = "nfts";
                this.collectiblesReloadKey += 1;
                this._changeDetectorRef.detectChanges();
            }
        });

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

    /** Prefer `this.wallet`: `shareables.wallet` can be overwritten by child header sync before `this.wallet` is reassigned. */
    private _tagNameForPerfLog(): string {
        const w = this.wallet ?? this.shareables?.wallet;
        if (!w) return "";

        return (w.fullTagName || w.publicData?.tagName || w.name || "") as string;
    }

    private _getEnabledNetworkIds(): string[] | undefined {
        return this._settingsService.getEnabledNetworkIds();
    }

    private _filterEnabledTokens(tokens: any[]): any[] {
        const enabledNetworks = this._getEnabledNetworkIds();
        if (!enabledNetworks) return tokens;

        return tokens.filter((token) => {
            const network = (token.network || "").toLowerCase();
            return enabledNetworks.includes(network);
        });
    }

    private async _getBalances(): Promise<void> {
        zelfWalletLoadPerfMark("getBalances:start");
        this.balancesLoading = true;
        this.tokens = [];

        const enabledNetworks = this._getEnabledNetworkIds();
        const loadedFromSession = await this._loadBalancesFromSession(enabledNetworks);

        if (loadedFromSession) {
            this.balancesLoading = false;

            this._changeDetectorRef.detectChanges();

            zelfWalletLoadPerfMark("balancesIdle:end");
            zelfWalletLoadPerfLog("balances_loading_false", {
                source: "session",
                fullTagName: this._tagNameForPerfLog(),
                balancesLoading: false,
            });
            zelfWalletLoadPerfMeasure("walletSet_to_balancesIdle", "walletSet:end", "balancesIdle:end");
            zelfWalletLoadPerfMark("getBalances:end");

            return;
        }

        await this._fetchBalancesFromNetwork(enabledNetworks);
        zelfWalletLoadPerfMark("getBalances:end");
    }

    /**
     * Load balances from session storage if available
     */
    private async _loadBalancesFromSession(enabledNetworks?: string[]): Promise<boolean> {
        const sessionTokens = await this._assetService.loadTokensFromSession();

        if (!sessionTokens || sessionTokens.length === 0) return false;

        const deduped = this._dedupeTokens(sessionTokens);
        const filtered = this._filterEnabledTokens(deduped);

        this._updateTokenState(filtered);

        return true;
    }

    /**
     * Fetch balances from network
     */
    private async _fetchBalancesFromNetwork(enabledNetworks?: string[]): Promise<void> {
        try {
            const response = await firstValueFrom(
                this._blockchainTransactionsService.getAddressData(this.wallet, enabledNetworks).pipe(takeUntil(this.unsubscriberForBalances$))
            );

            const result = await this._assetService.processTokensFromResponse(response);
            const deduped = this._dedupeTokens(result.tokens);
            const filtered = this._filterEnabledTokens(deduped);

            this._updateTokenState(filtered);
        } catch (error) {
            console.error("Error getting tokens:", error);
        } finally {
            this.balancesLoading = false;
            this._changeDetectorRef.detectChanges();

            zelfWalletLoadPerfMark("balancesIdle:end");
            zelfWalletLoadPerfLog("balances_loading_false", {
                source: "network",
                fullTagName: this._tagNameForPerfLog(),
                balancesLoading: false,
            });
            zelfWalletLoadPerfMeasure("walletSet_to_balancesIdle", "walletSet:end", "balancesIdle:end");
        }
    }

    private _updateTokenState(tokens: any[]): void {
        this.tokens = tokens;
        this.totalFiatBalance = this.tokens.reduce((total, token) => {
            return total + (parseFloat(token.fiatBalance) || 0);
        }, 0);
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

        zelfWalletLoadPerfLog("initialize_wallet_pipeline_done", {
            fullTagName: this._tagNameForPerfLog(),
            balancesLoading: this.balancesLoading,
        });
        zelfWalletLoadPerfMeasure("initNetwork_to_refreshWallets", "initNetwork:end", "refreshWallets:end");

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
        zelfWalletLoadPerfMark("refreshWallets:start");
        await this._tagsService.refreshAllTagsPublicData([this.wallet] as TagModel[], forceRefresh);
        zelfWalletLoadPerfMark("refreshWallets:end");
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

        zelfWalletLoadPerfMark("walletSet:end");
        zelfWalletLoadPerfLog("wallet_ready", {
            fullTagName: wallet.fullTagName ?? "",
            balancesLoading: this.balancesLoading,
        });
    }

    async toggleHideBalances(): Promise<void> {
        await this._chromeService.setHideWalletBalances(!this.hideBalances);
    }

    async refreshTokens(): Promise<any> {
        if (this.balancesLoading) return;

        this.balancesLoading = true;
        this.tokens = [];

        await this._authService.reauthenticateSession();

        const enabledNetworks = this._getEnabledNetworkIds();
        await this._fetchBalancesFromNetwork(enabledNetworks);

        await this._refreshWallets(true);
        this.collectiblesReloadKey += 1;
        this._changeDetectorRef.detectChanges();
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
