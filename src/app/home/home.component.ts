import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from "@angular/common";
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
import { HomeHubHeaderComponent } from "./home-hub-header/home-hub-header.component";
import { HomeProfilePanelComponent } from "./home-profile-panel/home-profile-panel.component";
import { WalletBalanceTopCardComponent } from "app/zelf-wallet/wallet-balance-top-card/wallet-balance-top-card.component";
import { FooterNavDestination, FooterNavigationService } from "app/zelf-footer/footer-navigation.service";
import { ZelfFooterComponent } from "app/zelf-footer/zelf-footer.component";

const QUICK_HUB_IDS = ["zelf-keys", "zelf-authenticator", "zelf-signals", "manage-domains"] as const;

@Component({
    imports: [
        FlexLayoutModule,
        HomeHubHeaderComponent,
        HomeProfilePanelComponent,
        MatButtonModule,
        NgFor,
        NgIf,
        NgSwitch,
        NgSwitchCase,
        NgSwitchDefault,
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
    private _subscriptionCountdownInterval: ReturnType<typeof setInterval> | null = null;

    /** Live days + hours when `expiresAt` is in the future; updates periodically. */
    subscriptionDhms: { days: number; hours: number } | null = null;

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

    /** Hidden until onboarding/rewards wiring; flip for follow-up ticket. */
    readonly showStartHere = false;

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

    /** Short hub row labels (reference UI); falls back to footer `hubLabelKey`. */
    homeQuickLabelKey(dest: FooterNavDestination): string {
        switch (dest.id) {
            case "zelf-keys":
                return "home_hub.quick_label_keys";
            case "zelf-authenticator":
                return "home_hub.quick_label_auth";
            case "zelf-signals":
                return "home_hub.quick_label_signals";
            case "manage-domains":
                return "home_hub.quick_label_id";
            default:
                return this.navService.hubLabelKey(dest);
        }
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
        this._stopSubscriptionCountdown();
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

        this._syncSubscriptionDhms();
        this._startSubscriptionCountdown();

        this._changeDetectorRef.detectChanges();

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
        this._syncSubscriptionDhms();
        this._startSubscriptionCountdown();
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
        this._syncSubscriptionDhms();
        this._startSubscriptionCountdown();
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

    private get _subscriptionWallet(): TagModel | null {
        const w = this.shareables.wallet;
        if (!w?.publicData) return null;
        return w as TagModel;
    }

    get isPremium(): boolean {
        return this._subscriptionWallet?.isMainnet === true;
    }

    get isFreeHold(): boolean {
        return this._subscriptionWallet?.isHold === true;
    }

    /** Same day math as `home-banners` (ceil, floor at 0). */
    get subscriptionDaysRemaining(): number {
        const exp = this.shareables.wallet?.publicData?.expiresAt;
        if (!exp) return 0;
        const expiresAt = new Date(exp);
        const diffTime = expiresAt.getTime() - Date.now();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    }

    get subscriptionZelfIdDisplay(): string {
        const w = this._subscriptionWallet;
        if (!w) return this.walletName || "";
        const local = w.tagName;
        const domain = w.domain;
        if (w.isHold) return `${local}.${domain}.hold`;
        if (w.isMainnet) return `${local}.${domain}`;
        return w.fullTagName || local || this.walletName;
    }

    get subscriptionHasExpiry(): boolean {
        return !!this.shareables.wallet?.publicData?.expiresAt;
    }

    get subscriptionIsExpired(): boolean {
        const exp = this.shareables.wallet?.publicData?.expiresAt;
        if (!exp) return false;
        return new Date(exp).getTime() <= Date.now();
    }

    private _syncSubscriptionDhms(): void {
        const exp = this.shareables.wallet?.publicData?.expiresAt;
        if (!exp) {
            this.subscriptionDhms = null;
            return;
        }
        const endMs = new Date(exp).getTime();
        const diff = endMs - Date.now();
        if (diff <= 0) {
            this.subscriptionDhms = null;
            return;
        }
        const totalSec = Math.floor(diff / 1000);
        this.subscriptionDhms = {
            days: Math.floor(totalSec / 86400),
            hours: Math.floor((totalSec % 86400) / 3600),
        };
    }

    private _startSubscriptionCountdown(): void {
        this._stopSubscriptionCountdown();
        const exp = this.shareables.wallet?.publicData?.expiresAt;
        if (!exp) return;
        this._syncSubscriptionDhms();
        this._subscriptionCountdownInterval = setInterval(() => {
            this._syncSubscriptionDhms();
            this._changeDetectorRef.markForCheck();
        }, 60_000);
    }

    private _stopSubscriptionCountdown(): void {
        if (this._subscriptionCountdownInterval) {
            clearInterval(this._subscriptionCountdownInterval);
            this._subscriptionCountdownInterval = null;
        }
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
