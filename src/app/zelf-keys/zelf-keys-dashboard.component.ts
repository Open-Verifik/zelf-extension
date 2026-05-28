import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";
import { Subject, distinctUntilChanged, filter, map, skip, takeUntil } from "rxjs";

import { ChromeService } from "app/chrome.service";
import { HomeHubHeaderComponent } from "app/home/home-hub-header/home-hub-header.component";
import { HomeProfilePanelComponent } from "app/home/home-profile-panel/home-profile-panel.component";
import { TagModel } from "app/tags.service";
import { ScrollToSectionService } from "../services/scroll-to-section.service";
import { WalletService } from "../wallet.service";
import { ZelfFooterComponent } from "app/zelf-footer/zelf-footer.component";
import { ZelfKeysData, ZelfKeysDataService } from "../services/zelf-keys-data.service";

@Component({
    imports: [
        CommonModule,
        TranslocoModule,
        RouterModule,
        HomeHubHeaderComponent,
        HomeProfilePanelComponent,
        ZelfFooterComponent,
        MatProgressSpinnerModule,
    ],
    selector: "zelf-keys-dashboard",
    styleUrls: ["./zelf-keys-dashboard.component.scss"],
    templateUrl: "./zelf-keys-dashboard.component.html",
})
export class ZelfKeysDashboardComponent implements OnInit, OnDestroy {
    private unsubscriber$: Subject<void> = new Subject<void>();

    loaded: boolean = false;
    wallet: Partial<TagModel> = {};
    showProfilePanel: boolean = false;
    showName: boolean = false;
    allWallets: TagModel[] = [];

    constructor(
        private _chromeService: ChromeService,
        private _changeDetectionRef: ChangeDetectorRef,
        private _router: Router,
        private _scrollToSectionService: ScrollToSectionService,
        private _walletService: WalletService,
        private _zelfKeysDataService: ZelfKeysDataService
    ) {
        this.unsubscriber$ = new Subject();

        this._initSubscriptions();
    }

    async ngOnInit(): Promise<void> {
        await this._initWallet();
        await this._loadOnDashboardEnter();
    }

    async ngOnDestroy(): Promise<void> {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    get zelfName(): string {
        return this.wallet?.publicData?.tagName ? this.wallet.publicData.tagName.toUpperCase() : "USER.ZELF";
    }

    get walletName(): string {
        return (this.wallet?.fullTagName || this.wallet?.publicData?.tagName || "") as string;
    }

    toggleName(): void {
        this.showName = !this.showName;
    }

    private _initSubscriptions(): void {
        this._router.events.pipe(takeUntil(this.unsubscriber$)).subscribe((event) => {
            if (!(event instanceof NavigationEnd)) return;

            const contentElement = document.querySelector(".dashboard__content");

            if (!contentElement) return;

            contentElement.scrollTop = 0;
        });

        this._scrollToSectionService.scrollEvent$.pipe(takeUntil(this.unsubscriber$)).subscribe((event) => {
            if (!event) return;

            this._scrollToDecryptedSection(event.sectionId);
        });

        this._chromeService.onWalletChanged$
            .pipe(
                map((w) => w?.fullTagName ?? ""),
                distinctUntilChanged(),
                filter((tag) => !!tag),
                skip(1),
                takeUntil(this.unsubscriber$)
            )
            .subscribe((fullTagName) => {
                void this._reloadZelfKeysForWalletSwitch(fullTagName);
            });
    }

    private async _initWallet(): Promise<void> {
        const { wallet } = await this._walletService.getAllWalletsFromStorage();

        this.wallet = wallet || ({} as Partial<TagModel>);
        this.loaded = true;
    }

    private async _loadOnDashboardEnter(): Promise<void> {
        const wallet = await this._walletService.getCurrentWallet();

        console.log("[Zelf Keys] dashboard enter", {
            storageWallet: wallet?.fullTagName ?? null,
            headerWallet: this.wallet?.fullTagName ?? null,
        });

        const data = await this._zelfKeysDataService.ensureLoadedForCurrentWallet({
            forceRefresh: false,
            reason: "dashboard-enter",
        });

        console.log("[Zelf Keys] dashboard list ready", {
            storageWallet: wallet?.fullTagName ?? null,
            passwordCount: data.passwords.length,
            notesCount: data.notes.length,
            paymentCardCount: data.paymentCards.length,
        });

        this._syncRouteForWalletData(data);
    }

    private async _reloadZelfKeysForWalletSwitch(fullTagName: string): Promise<void> {
        console.log("[Zelf Keys] wallet switch detected", { fullTagName });

        const wallet = await this._walletService.getCurrentWallet();
        if (wallet) this.wallet = wallet;

        let data: ZelfKeysData;

        try {
            data = await this._zelfKeysDataService.reloadForWalletSwitch("wallet-switch");
        } catch (error) {
            console.error("[Zelf Keys] wallet switch reload failed:", error);
            data = await this._zelfKeysDataService.ensureLoadedForCurrentWallet({
                forceRefresh: true,
                reason: "wallet-switch-fallback",
            });
        }

        console.log("[Zelf Keys] wallet switch list ready", {
            storageWallet: wallet?.fullTagName ?? null,
            passwordCount: data.passwords.length,
            notesCount: data.notes.length,
            paymentCardCount: data.paymentCards.length,
        });

        this._syncRouteForWalletData(data);
        this._changeDetectionRef.detectChanges();
    }

    /** Start vs vault is chosen by a route guard only on navigation — re-sync after wallet/data changes. */
    private _syncRouteForWalletData(data: ZelfKeysData): void {
        const hasAnyItems = data.passwords.length > 0 || data.paymentCards.length > 0;
        const path = this._router.url.split("?")[0];
        const onStart = path === "/zelf-keys" || path.endsWith("/zelf-keys/start");
        const onVault = path.includes("/zelf-keys/vault");

        if (hasAnyItems && onStart) {
            console.log("[Zelf Keys] route sync → vault (wallet has items)", {
                passwordCount: data.passwords.length,
                paymentCardCount: data.paymentCards.length,
            });
            void this._router.navigate(["/zelf-keys/vault"], { replaceUrl: true });
            return;
        }

        if (!hasAnyItems && onVault) {
            console.log("[Zelf Keys] route sync → start (wallet has no items)");
            void this._router.navigate(["/zelf-keys/start"], { replaceUrl: true });
        }
    }

    async openProfilePanel(): Promise<void> {
        const { wallets } = await this._walletService.getAllWalletsFromStorage();
        this.allWallets = wallets;
        this.showProfilePanel = true;
        this._changeDetectionRef.detectChanges();
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

    navigateToWallet(): void {
        this._router.navigate(["/wallet"]);
    }

    private _scrollToDecryptedSection(sectionId: string): void {
        setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                    inline: "nearest",
                });
            }
        }, 100);
    }
}
