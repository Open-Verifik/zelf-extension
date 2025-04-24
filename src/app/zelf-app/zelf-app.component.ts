import { Subject, takeUntil } from "rxjs";

import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";

import { LanguageComponent } from "app/language/language.component";
import { MatMenuModule } from "@angular/material/menu";
import { VaultService } from "app/vault.service";
import { WalletService } from "app/wallet.service";
import { WalletModel } from "app/wallet";
import { ChromeService } from "app/chrome.service";

@Component({
    imports: [CommonModule, RouterModule, LanguageComponent, TranslocoModule, RouterModule, MatMenuModule],
    selector: "zelf-app",
    styleUrls: ["./zelf-app.component.scss"],
    templateUrl: "./zelf-app.component.html",
})
export class ZelfAppComponent implements AfterViewInit, OnDestroy {
    @ViewChild("contentContainer", { static: false }) contentContainer!: ElementRef<HTMLDivElement>;

    private unsubscriber$: Subject<void> = new Subject<void>();

    canGoHome: boolean = false;
    wallet: Partial<WalletModel> = {};
    wallets: any[] = [];

    footerLinks = [
        {
            url: "https://docs.zelf.world/",
            text: "common.documentation",
        },
        {
            url: "https://docs.zelf.world/zelf-legal/terms-of-use",
            text: "common.terms_and_conditions",
        },
        {
            url: "https://docs.zelf.world/zelf-legal/privacy-policy",
            text: "common.privacy",
        },
        {
            url: "https://docs.zelf.world/airdrop/pricing-per-domain",
            text: "common.pricing",
        },
    ];

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _chromeService: ChromeService,
        private _router: Router,
        private _vaultService: VaultService,
        private _walletService: WalletService
    ) {}

    async ngAfterViewInit(): Promise<void> {
        await this._setCanGoHome();

        this._chromeService.onWalletsChanged$.pipe(takeUntil(this.unsubscriber$)).subscribe(async () => {
            await this._setCanGoHome();
        });

        this._router.events.pipe(takeUntil(this.unsubscriber$)).subscribe((event) => {
            if (!(event instanceof NavigationEnd)) return;

            this.contentContainer.nativeElement.scrollTo(0, 0);
        });
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    private async _setCanGoHome(): Promise<void> {
        this.wallet = (await this._walletService.getCurrentWallet()) as Partial<WalletModel>;
        this.wallets = await this._walletService.getWalletsFromStorage();

        const path = this._activatedRoute.snapshot.url[0]?.path;

        this.canGoHome = !!path && path !== "home" && (!!this.wallet?.ethAddress || this.wallets.length > 0);
    }

    onLogoClick(): void {
        this._vaultService.mnemonic = "";
        this._vaultService.password = "";

        if (this.canGoHome) this._router.navigate(["/home"]);
        else this._router.navigate(["/welcome"]);
    }
}
