import { Subject, takeUntil } from "rxjs";

import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";

import { LanguageComponent } from "app/language/language.component";
import { ChromeService } from "app/chrome.service";
import { MatMenuModule } from "@angular/material/menu";

@Component({
    selector: "zelf-app",
    standalone: true,
    imports: [CommonModule, RouterModule, LanguageComponent, TranslocoModule, RouterModule, MatMenuModule],
    templateUrl: "./zelf-app.component.html",
    styleUrls: ["./zelf-app.component.scss"],
})
export class ZelfAppComponent implements AfterViewInit, OnDestroy {
    @ViewChild("contentContainer", { static: false }) contentContainer!: ElementRef<HTMLDivElement>;

    private unsubscriber$: Subject<void> = new Subject<void>();

    canGoHome: boolean = false;

    footerLinks = [
        {
            url: "https://docs.zelf.world/",
            text: "common.documentation",
        },
        {
            url: "https://www.pinksale.finance/solana/launchpad/HUCo6xdcGSpiDQxhrN8emvLwnkJAAdJbcACncMnU9MmF",
            text: "common.invest",
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

    constructor(private _router: Router, private _chromeService: ChromeService) {}

    ngAfterViewInit(): void {
        this._chromeService.onWalletChanged$.pipe(takeUntil(this.unsubscriber$)).subscribe((wallet) => {
            this.canGoHome = !!wallet?.ethAddress;
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

    onLogoClick(): void {
        if (this.canGoHome) this._router.navigate(["/home"]);
        else this._router.navigate(["/welcome"]);
    }
}
