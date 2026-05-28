import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";
import { Subject, distinctUntilChanged, filter, map, skip, takeUntil } from "rxjs";

import { ChromeService } from "app/chrome.service";
import { HomeHubHeaderComponent } from "app/home/home-hub-header/home-hub-header.component";
import { HomeProfilePanelComponent } from "app/home/home-profile-panel/home-profile-panel.component";
import { TagModel } from "app/tags.service";
import { WalletService } from "app/wallet.service";
import { ZelfFooterComponent } from "app/zelf-footer/zelf-footer.component";

@Component({
    selector: "zelf-ai",
    standalone: true,
    imports: [
        CommonModule,
        TranslocoModule,
        HomeHubHeaderComponent,
        HomeProfilePanelComponent,
        ZelfFooterComponent,
    ],
    template: `
        <div class="zelf-card home-hub" *transloco="let t">
            <home-hub-header
                [walletName]="walletName"
                [showName]="showName"
                (profileClick)="openProfilePanel()"
                (toggleNameClick)="toggleName()"
            />

            <div class="home-hub__body">
                <div class="ai-coming-soon">
                    <div class="ai-coming-soon__icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" fill="currentColor"/>
                        </svg>
                    </div>
                    <h2 class="ai-coming-soon__heading">{{ t("common.coming_soon") }}</h2>
                    <p class="ai-coming-soon__description">{{ t("common.coming_soon_desc") }}</p>
                </div>
            </div>

            <zelf-footer [shareables]="{ wallet: wallet }"></zelf-footer>

            <home-profile-panel
                *ngIf="showProfilePanel"
                [wallets]="allWallets"
                [currentWallet]="wallet"
                [visible]="showProfilePanel"
                (closed)="closeProfilePanel()"
                (walletSelected)="onPanelWalletSelected($event)"
                (openSettings)="onPanelSettings()"
                (addAccount)="onPanelAddAccount()"
            />
        </div>
    `,
    styles: [`
        @use "../../../styles/variables";

        :host {
            align-items: center;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            justify-content: center;
        }

        ::ng-deep .home-hub {
            overflow: hidden;
            padding-bottom: calc(94px * var(--zns-space-scale, 1)) !important;
        }

        .home-hub__body {
            position: absolute;
            left: 0;
            right: 0;
            top: calc(88px * var(--zns-space-scale, 1));
            bottom: calc(82px * var(--zns-space-scale, 1));
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 calc(24px * var(--zns-space-scale, 1));
            overflow: auto;
        }

        @media screen and (max-width: variables.$medium) {
            .home-hub__body {
                top: calc(76px * var(--zns-space-scale, 1));
                bottom: calc(70px * var(--zns-space-scale, 1));
                padding: 0 calc(16px * var(--zns-space-scale, 1));
            }
        }

        .ai-coming-soon {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }

        .ai-coming-soon__icon {
            margin-bottom: calc(24px * var(--zns-space-scale, 1));
            color: variables.$primaryColor;
        }

        .ai-coming-soon__heading {
            font-size: calc(24px * var(--zns-font-scale, 1));
            font-weight: 700;
            margin-bottom: calc(8px * var(--zns-space-scale, 1));
            color: variables.$themeText;
        }

        .ai-coming-soon__description {
            font-size: calc(16px * var(--zns-font-scale, 1));
            color: variables.$themeTextMuted;
            max-width: 300px;
            line-height: 1.5;
        }
    `]
})
export class ZelfAiComponent implements OnInit, OnDestroy {
    private readonly _destroy$ = new Subject<void>();

    wallet: Partial<TagModel> = {};
    showProfilePanel = false;
    allWallets: TagModel[] = [];
    showName = false;

    constructor(
        private readonly _changeDetectorRef: ChangeDetectorRef,
        private readonly _chromeService: ChromeService,
        private readonly _router: Router,
        private readonly _walletService: WalletService,
    ) {}

    async ngOnInit(): Promise<void> {
        await this._initWallet();
        this._initSubscriptions();
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    get walletName(): string {
        return (this.wallet?.fullTagName || this.wallet?.publicData?.tagName || "") as string;
    }

    private async _initWallet(): Promise<void> {
        const { wallet } = await this._walletService.getAllWalletsFromStorage();
        this.wallet = wallet || ({} as Partial<TagModel>);
    }

    private _initSubscriptions(): void {
        this._chromeService.onWalletChanged$
            .pipe(
                map((w) => w?.fullTagName ?? ""),
                distinctUntilChanged(),
                filter((tag) => !!tag),
                skip(1),
                takeUntil(this._destroy$)
            )
            .subscribe(() => {
                void this._refreshWallet();
            });
    }

    private async _refreshWallet(): Promise<void> {
        const { wallet } = await this._walletService.getAllWalletsFromStorage();
        if (wallet) {
            this.wallet = wallet;
            this._changeDetectorRef.detectChanges();
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
}
