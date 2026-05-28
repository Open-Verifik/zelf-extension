import { Subject, takeUntil } from "rxjs";

import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";

import { LanguageComponent } from "app/language/language.component";
import { ZelfThemeComponent } from "app/zelf-theme/zelf-theme.component";
import { VaultService } from "app/vault.service";
import { WalletService } from "app/wallet.service";
import { TagModel } from "app/tags.service";
import { ChromeService } from "app/chrome.service";

@Component({
    imports: [CommonModule, RouterModule, LanguageComponent, ZelfThemeComponent, TranslocoModule],
    selector: "zelf-app",
    styleUrls: ["./zelf-app.component.scss"],
    templateUrl: "./zelf-app.component.html",
})
export class ZelfAppComponent implements AfterViewInit, OnDestroy {
    @ViewChild("contentContainer", { static: false }) contentContainer!: ElementRef<HTMLDivElement>;

    private unsubscriber$: Subject<void> = new Subject<void>();

    canGoHome: boolean = false;
    wallet: Partial<TagModel> = {};
    wallets: any[] = [];
    backgroundPattern: "gradient-dots" | "falling-pattern" = "falling-pattern";
    isSidePanel = false;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _chromeService: ChromeService,
        private _router: Router,
        private _vaultService: VaultService,
        private _walletService: WalletService
    ) {
        this.isSidePanel = this._chromeService.isSidePanel;
    }

    async ngAfterViewInit(): Promise<void> {
        await this._setCanGoHome();

        this._chromeService.onWalletsChanged$.pipe(takeUntil(this.unsubscriber$)).subscribe(async () => {
            await this._setCanGoHome();
        });

        this._chromeService.isSidePanel$.pipe(takeUntil(this.unsubscriber$)).subscribe((isSidePanel) => {
            this.isSidePanel = isSidePanel;
        });

        this._router.events.pipe(takeUntil(this.unsubscriber$)).subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.contentContainer?.nativeElement.scrollTo(0, 0);
            }
        });
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    private async _setCanGoHome(): Promise<void> {
        this.wallet = (await this._walletService.getCurrentWallet()) as Partial<TagModel>;
        this.wallets = await this._walletService.getWalletsFromStorage();

        const path = this._activatedRoute.snapshot.url[0]?.path;

        this.canGoHome = !!path && path !== "home" && (!!this.wallet?.publicData?.ethAddress || this.wallets.length > 0);
    }

    onLogoClick(): void {
        this._vaultService.mnemonic = "";
        this._vaultService.password = "";

        if (this.canGoHome) this._router.navigate(["/home"]);
        else this._router.navigate(["/welcome"]);
    }
}
