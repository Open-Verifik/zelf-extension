import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";
import { Subject, takeUntil } from "rxjs";

import { ChromeService } from "app/chrome.service";
import { HomeHeaderComponent } from "app/home/home-header/home-header.component";
import { TagModel } from "app/tags.service";
import { HomeHeaderAccountsComponent } from "../home/home-header-accounts/home-header-accounts.component";
import { BillingService } from "../services/billing.service";
import { ScrollToSectionService } from "../services/scroll-to-section.service";
import { WalletService } from "../wallet.service";
import { ZelfFooterComponent } from "app/zelf-footer/zelf-footer.component";

@Component({
    imports: [CommonModule, TranslocoModule, RouterModule, HomeHeaderComponent, ZelfFooterComponent, MatProgressSpinnerModule],
    selector: "zelf-keys-dashboard",
    styleUrls: ["./zelf-keys-dashboard.component.scss"],
    templateUrl: "./zelf-keys-dashboard.component.html",
})
export class ZelfKeysDashboardComponent implements OnInit, OnDestroy {
    private unsubscriber$: Subject<void> = new Subject<void>();

    activeTab: string = "start";
    loaded: boolean = false;
    wallet: Partial<TagModel> = {};

    constructor(
        private _billingService: BillingService,
        private _chromeService: ChromeService,
        private _bottomSheet: MatBottomSheet,
        private _changeDetectionRef: ChangeDetectorRef,
        private _router: Router,
        private _scrollToSectionService: ScrollToSectionService,
        private _walletService: WalletService
    ) {
        this.unsubscriber$ = new Subject();

        this._initSubscriptions();
    }

    async ngOnInit(): Promise<void> {
        await this._initWallet();
        await this._loadCurrentPlan();

        this._initNavigation();
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
            await this._loadCurrentPlan();
        });
    }

    private async _loadCurrentPlan(): Promise<void> {
        try {
            const response = await this._billingService.getActiveSubscription();

            if (!response.success || !response.data) {
                this._billingService.currentPlan = "free";

                return;
            }

            const subscription = response.data;

            if (subscription.paymentMethod === "crypto" && subscription.cryptoData) {
                this._billingService.currentPlan = subscription.cryptoData.plan || "basic";
            } else if (subscription.paymentMethod === "stripe" && subscription.stripeData) {
                this._billingService.currentPlan = subscription.stripeData.plan || "free";
            } else {
                this._billingService.currentPlan = "free";
            }
        } catch (error) {
            this._billingService.currentPlan = "free";
        }
    }

    private async _initWallet(): Promise<void> {
        const { wallet } = await this._walletService.getAllWalletsFromStorage();

        this.wallet = wallet || ({} as Partial<TagModel>);
        this.loaded = true;
    }

    private _initNavigation(): void {
        this._updateActiveTabFromRoute();

        this._router.events.pipe(takeUntil(this.unsubscriber$)).subscribe((event) => {
            if (!(event instanceof NavigationEnd)) return;

            this._updateActiveTabFromRoute();
        });
    }

    private _updateActiveTabFromRoute(): void {
        const currentUrl = this._router.url;
        const urlParts = currentUrl.split("/");
        const dashboardIndex = urlParts.indexOf("zelf-keys");

        if (dashboardIndex !== -1 && urlParts.length > dashboardIndex + 1) {
            const childPath = urlParts[dashboardIndex + 1];

            this.activeTab = this._getActiveTabFromPath(childPath);
        } else {
            this.activeTab = "start";
        }

        this._changeDetectionRef.detectChanges();
    }

    private _getActiveTabFromPath(path: string): string {
        if (path.startsWith("passwords")) {
            return "passwords";
        }

        if (path.startsWith("notes")) {
            return "notes";
        }

        if (path.startsWith("payment-cards")) {
            return "payment-cards";
        }

        return path;
    }

    async navigateToTab(tab: string): Promise<void> {
        if (tab === "popout-decryptor") {
            this._router.navigate(["/zelf-keys", tab]);

            return;
        }

        if (tab === "start") {
            this._router.navigate(["/zelf-keys"]);
        } else {
            this._router.navigate(["/zelf-keys", tab]);
        }
    }

    navigateToWallet(): void {
        this._router.navigate(["/home"]);
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
