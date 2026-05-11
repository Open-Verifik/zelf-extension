import { NgFor, NgIf } from "@angular/common";
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
import { SettingsService } from "app/services/settings.service";
import { TagModel, TagsService } from "app/tags.service";
import { WalletService } from "app/wallet.service";
import { HomeProfilePanelComponent } from "./home-profile-panel/home-profile-panel.component";
import { WalletBalanceTopCardComponent } from "app/zelf-wallet/wallet-balance-top-card/wallet-balance-top-card.component";
import { FooterNavDestination, FooterNavigationService } from "app/zelf-footer/footer-navigation.service";
import { ZelfFooterComponent } from "app/zelf-footer/zelf-footer.component";

const QUICK_HUB_IDS = ["zelf-keys", "zelf-authenticator", "zelf-signals", "manage-domains"] as const;

@Component({
    imports: [
        FlexLayoutModule,
        HomeProfilePanelComponent,
        MatButtonModule,
        NgFor,
        NgIf,
        RouterLink,
        TranslocoModule,
        WalletBalanceTopCardComponent,
        ZelfFooterComponent,
    ],
    selector: "home",
    styleUrls: ["./home.component.scss", "../main.scss"],
    templateUrl: "./home.component.html",
})
export class HomeComponent implements OnInit, OnDestroy {
    private readonly _destroy$ = new Subject<void>();
    private _unsubscriberForBalances$ = new Subject<void>();

    readonly quickDestinations: FooterNavDestination[];

    /** Same shape as Zelf wallet: footer only renders when `shareables.wallet` is set. */
    shareables: { wallet: Partial<TagModel>; selectedTab?: string } = { wallet: {} };

    balancesLoading: boolean = false;
    hideBalances: boolean = false;
    showName: boolean = false;
    showProfilePanel: boolean = false;
    allWallets: TagModel[] = [];
    totalFiatBalance: number = 0;
    private _wallet!: Partial<TagModel>;

    /** Checklist steps (placeholder until wired to rewards/onboarding API). */
    readonly startHereTotal = 4;
    readonly startHereCurrent = 0;

    constructor(
        public readonly navService: FooterNavigationService,
        private readonly _router: Router,
        private readonly _walletService: WalletService,
        private readonly _chromeService: ChromeService,
        private readonly _changeDetectorRef: ChangeDetectorRef,
        private readonly _assetService: AssetService,
        private readonly _authService: AuthService,
        private readonly _blockchainNetworkService: BlockchainNetworksService,
        private readonly _blockchainTransactionsService: BlockchainTransactionsService,
        private readonly _settingsService: SettingsService,
        private readonly _tagsService: TagsService
    ) {
        const hub = this.navService.getHubDestinations();
        this.quickDestinations = QUICK_HUB_IDS.map((id) => hub.find((d) => d.id === id)).filter(
            (d): d is FooterNavDestination => !!d
        );
    }

    async ngOnInit(): Promise<void> {
        const storedHide = await this._chromeService.getItem("hideWalletBalances");
        this.hideBalances = storedHide === true || storedHide === "true";

        this._chromeService.onHideWalletBalancesChanged$.pipe(takeUntil(this._destroy$)).subscribe((hidden) => {
            this.hideBalances = hidden;
            this._changeDetectorRef.detectChanges();
        });

        await this._blockchainNetworkService._initNetwork();

        this._chromeService.onWalletChanged$.pipe(takeUntil(this._destroy$)).subscribe(this._initializeWallet);
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
        this._unsubscriberForBalances$.next();
        this._unsubscriberForBalances$.complete();
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
        this.balancesLoading = true;

        const enabledNetworks = this._getEnabledNetworkIds();
        const loadedFromSession = await this._loadBalancesFromSession(enabledNetworks);

        if (loadedFromSession) {
            this.balancesLoading = false;
            this._changeDetectorRef.detectChanges();
            return;
        }

        await this._fetchBalancesFromNetwork(enabledNetworks);
    }

    private async _loadBalancesFromSession(enabledNetworks?: string[]): Promise<boolean> {
        const sessionTokens = await this._assetService.loadTokensFromSession();

        if (!sessionTokens || sessionTokens.length === 0) return false;

        const deduped = this._dedupeTokens(sessionTokens);
        const filtered = this._filterEnabledTokens(deduped);

        this._updateTokenState(filtered);

        return true;
    }

    private async _fetchBalancesFromNetwork(enabledNetworks?: string[]): Promise<void> {
        try {
            const response = await firstValueFrom(
                this._blockchainTransactionsService
                    .getAddressData(this._wallet as TagModel, enabledNetworks)
                    .pipe(takeUntil(this._unsubscriberForBalances$))
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
        }
    }

    private _updateTokenState(tokens: any[]): void {
        this.totalFiatBalance = tokens.reduce((total, token) => {
            return total + (parseFloat(token.fiatBalance) || 0);
        }, 0);
    }

    private _initializeWallet = async (wallet: TagModel): Promise<void> => {
        if (this._wallet && this._wallet.tagName === wallet.tagName) return;

        if (this.balancesLoading) {
            this._unsubscriberForBalances$.next();
            this._unsubscriberForBalances$.complete();
            this._unsubscriberForBalances$ = new Subject<void>();
        }

        this.balancesLoading = true;

        await this._setWallet();
        await this._getBalances();
        await this._refreshWallets();

        this._chromeService.onWalletChanged$.pipe(takeUntil(this._destroy$)).subscribe(this._listenForWalletUpdates);
    };

    private _listenForWalletUpdates = async (): Promise<void> => {
        const currentWallet = this._wallet;

        await this._setWallet();

        const nextWallet = this._wallet;

        if (currentWallet.tagName === nextWallet.tagName) return;

        await this.refreshTokens();
    };

    private _refreshWallets = async (forceRefresh = false): Promise<void> => {
        await this._tagsService.refreshAllTagsPublicData([this._wallet] as TagModel[], forceRefresh);
    };

    private async _setWallet(): Promise<void> {
        const wallet = await this._walletService.getFirstWalletFromStorage();

        if (!wallet?.name) {
            this._router.navigate(["/welcome"]);
            return;
        }

        this.shareables = { ...this.shareables, wallet };
        this._wallet = this.shareables.wallet;
        this._changeDetectorRef.detectChanges();
    }

    async toggleHideBalances(): Promise<void> {
        await this._chromeService.setHideWalletBalances(!this.hideBalances);
    }

    async refreshTokens(): Promise<void> {
        if (this.balancesLoading) return;

        this.balancesLoading = true;
        this.totalFiatBalance = 0;

        await this._authService.reauthenticateSession();

        const enabledNetworks = this._getEnabledNetworkIds();
        await this._fetchBalancesFromNetwork(enabledNetworks);

        await this._refreshWallets(true);
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

    get walletName(): string {
        const w = this.shareables.wallet;
        return (w?.fullTagName || (w?.publicData as any)?.tagName || '') as string;
    }

    toggleName(): void {
        this.showName = !this.showName;
    }

    async openProfilePanel(): Promise<void> {
        const { wallets } = await this._walletService.getAllWalletsFromStorage();
        this.allWallets = wallets;
        this.showProfilePanel = true;
        this._changeDetectorRef.detectChanges();
    }

    closeProfilePanel(): void {
        this.showProfilePanel = false;
    }

    async onPanelWalletSelected(wallet: TagModel): Promise<void> {
        this.closeProfilePanel();
        await this._walletService.switchWallet(wallet);
    }

    onPanelSettings(): void {
        this.closeProfilePanel();
        void this._router.navigate(["/settings"]);
    }

    onPanelAddAccount(): void {
        this.closeProfilePanel();
        void this._router.navigate(["/wallet-manage"]);
    }

    openAppsHub(): void {
        void this._router.navigate(["/apps"]);
    }
}
