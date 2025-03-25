import { Subject, takeUntil } from "rxjs";

import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";

import { LanguageComponent } from "app/language/language.component";

@Component({
    selector: "welcome",
    standalone: true,
    imports: [CommonModule, RouterModule, LanguageComponent, TranslocoModule, RouterModule],
    templateUrl: "./welcome.component.html",
    styleUrls: ["./welcome.component.scss"],
})
export class WelcomeComponent implements AfterViewInit, OnDestroy {
    @ViewChild("contentContainer", { static: false }) contentContainer!: ElementRef<HTMLDivElement>;

    private unsubscriber$: Subject<void> = new Subject<void>();

    links = {
        documentation: "https://docs.zelf.world/",
        invest: "https://www.pinksale.finance/solana/launchpad/HUCo6xdcGSpiDQxhrN8emvLwnkJAAdJbcACncMnU9MmF",
        termsAndConditions: "https://docs.zelf.world/zelf-legal/terms-of-use",
        privacy: "https://docs.zelf.world/zelf-legal/privacy-policy",
        pricing: "https://docs.zelf.world/airdrop/pricing-per-domain",
    };

    constructor(private _router: Router) {}

    ngAfterViewInit(): void {
        this._router.events.pipe(takeUntil(this.unsubscriber$)).subscribe((event) => {
            if (!(event instanceof NavigationEnd)) return;

            this.contentContainer.nativeElement.scrollTo(0, 0);
        });
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }
}
