import { NgFor } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";
import { filter, Subject, takeUntil } from "rxjs";

import { FooterNavigationService, FooterNavDestination } from "../zelf-footer/footer-navigation.service";
import { LanguageComponent } from "../language/language.component";

@Component({
    imports: [NgFor, MatButtonModule, RouterLink, RouterLinkActive, TranslocoModule, LanguageComponent],
    selector: "apps-hub",
    styleUrls: ["./apps-hub.component.scss"],
    templateUrl: "./apps-hub.component.html",
})
export class AppsHubComponent implements OnInit, OnDestroy {
    private readonly _destroy$ = new Subject<void>();

    currentUrl: string = "";
    readonly hubDestinations: FooterNavDestination[];

    constructor(
        private readonly _router: Router,
        public readonly navService: FooterNavigationService
    ) {
        this.hubDestinations = this.navService.getHubDestinations();
    }

    ngOnInit(): void {
        this._updateUrl(this._router.url);

        this._router.events
            .pipe(
                filter((e) => e instanceof NavigationEnd),
                takeUntil(this._destroy$)
            )
            .subscribe((e: NavigationEnd) => {
                const newUrl = e.urlAfterRedirects || e.url;
                this._updateUrl(newUrl);
            });
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    private _updateUrl(url: string): void {
        this.currentUrl = url.split("?")[0];
    }

    goBack(): void {
        if (typeof window !== "undefined" && window.history.length > 1) {
            window.history.back();
        } else {
            void this._router.navigate(["/home"]);
        }
    }

    rowIsActive(dest: FooterNavDestination): boolean {
        return this.navService.isActive(this.currentUrl, dest.id);
    }

    navigateTo(dest: FooterNavDestination): void {
        void this._router.navigate([dest.route]);
    }

}
