import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";
import { Subject, takeUntil } from "rxjs";

import { ChromeService } from "app/chrome.service";
import { HomeHeaderComponent } from "app/zelf-wallet/home-header/home-header.component";
import { TagModel } from "app/tags.service";
import { HomeHeaderAccountsComponent } from "app/zelf-wallet/home-header-accounts/home-header-accounts.component";
import { ScrollToSectionService } from "../services/scroll-to-section.service";
import { WalletService } from "../wallet.service";
import { ZelfFooterComponent } from "app/zelf-footer/zelf-footer.component";
import { ZelfKeysDataService } from "../services/zelf-keys-data.service";

@Component({
    imports: [CommonModule, TranslocoModule, RouterModule, HomeHeaderComponent, ZelfFooterComponent, MatProgressSpinnerModule],
    selector: "zelf-keys-dashboard",
    styleUrls: ["./zelf-keys-dashboard.component.scss"],
    templateUrl: "./zelf-keys-dashboard.component.html",
})
export class ZelfKeysDashboardComponent implements OnInit, OnDestroy {
    private unsubscriber$: Subject<void> = new Subject<void>();

    loaded: boolean = false;
    wallet: Partial<TagModel> = {};

    constructor(
        private _chromeService: ChromeService,
        private _bottomSheet: MatBottomSheet,
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
    }

    async ngOnDestroy(): Promise<void> {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    get zelfName(): string {
        return this.wallet?.publicData?.tagName ? this.wallet.publicData.tagName.toUpperCase() : "USER.ZELF";
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

        this._chromeService.onWalletChanged$.pipe(takeUntil(this.unsubscriber$)).subscribe(async (wallet) => {
            if (!wallet) return;

            await this._initWallet();
        });

        this._chromeService.onAccessTokenChanged$.pipe(takeUntil(this.unsubscriber$)).subscribe(async (accessToken) => {
            if (!accessToken) return;

            await this._reloadZelfKeysData();
        });
    }

    private async _initWallet(): Promise<void> {
        const { wallet } = await this._walletService.getAllWalletsFromStorage();

        this.wallet = wallet || ({} as Partial<TagModel>);
        this.loaded = true;
    }

    private async _reloadZelfKeysData(): Promise<void> {
        await this._zelfKeysDataService.clearCache();
        await this._zelfKeysDataService.refresh();
    }

    navigateToWallet(): void {
        this._router.navigate(["/wallet"]);
    }

    openBottomSheet(): void {
        this._bottomSheet.open(HomeHeaderAccountsComponent, {
            backdropClass: "zelf-backdrop",
            panelClass: "zelf-bottom-sheet-seasalt",
            data: { wallet: this.wallet },
        });
    }

    private _scrollToDecryptedSection(sectionId: string): void {
        // Wait for the next tick to ensure the DOM is updated
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
