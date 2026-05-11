import { NgFor, NgIf } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";
import { filter, Subject, takeUntil } from "rxjs";

import { AddZotpComponent } from "../zelf-authenticator/add-zotp/add-zotp.component";
import { RecoverZotpComponent, RecoverZOTPData } from "../zelf-authenticator/recover-zotp/recover-zotp.component";
import { FooterNavigationService, FooterNavDestination } from "../zelf-footer/footer-navigation.service";
import { LanguageComponent } from "../language/language.component";

@Component({
    imports: [NgFor, NgIf, MatButtonModule, RouterLink, RouterLinkActive, TranslocoModule, LanguageComponent],
    selector: "apps-hub",
    styleUrls: ["./apps-hub.component.scss"],
    templateUrl: "./apps-hub.component.html",
})
export class AppsHubComponent implements OnInit, OnDestroy {
    private readonly _destroy$ = new Subject<void>();

    currentUrl: string = "";
    /** Context when opening the hub from zelf-keys / zelf-authenticator (full route has url `/apps`). */
    hubQuickContext: "zelf-keys" | "zelf-authenticator" | null = null;
    readonly hubDestinations: FooterNavDestination[];

    constructor(
        private readonly _router: Router,
        public readonly navService: FooterNavigationService,
        private readonly _dialog: MatDialog
    ) {
        const nav = this._router.getCurrentNavigation();
        const raw = (nav?.extras?.state as { hubQuickContext?: string } | undefined)?.hubQuickContext;
        this.hubQuickContext = raw === "zelf-keys" || raw === "zelf-authenticator" ? raw : null;
        this.hubDestinations = this.navService.getHubDestinations();
    }

    ngOnInit(): void {
        if (this.hubQuickContext === null && typeof history !== "undefined") {
            const fromHistory = (history.state as { hubQuickContext?: string })?.hubQuickContext;
            if (fromHistory === "zelf-keys" || fromHistory === "zelf-authenticator") {
                this.hubQuickContext = fromHistory;
            }
        }
        this._updateUrl(this._router.url);
        this._router.events
            .pipe(
                filter((e) => e instanceof NavigationEnd),
                takeUntil(this._destroy$)
            )
            .subscribe(() => this._updateUrl(this._router.url));
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

    isZelfKeysRoute(): boolean {
        return this.hubQuickContext === "zelf-keys";
    }

    isZelfAuthenticatorRoute(): boolean {
        return this.hubQuickContext === "zelf-authenticator";
    }

    navigateToZelfKeysTab(tab: string): void {
        void this._router.navigate(["/zelf-keys", ...tab.split("/")]);
    }

    addZOTP(): void {
        this._dialog.open(AddZotpComponent, {
            backdropClass: "zelf-backdrop",
            maxWidth: "500px",
            panelClass: "zelf-dialog",
            width: "90vw",
        });
    }

    recoverZOTP(): void {
        this._dialog.open(RecoverZotpComponent, {
            backdropClass: "zelf-backdrop",
            maxWidth: "600px",
            minWidth: "320px",
            panelClass: "zelf-dialog",
            width: "90vw",
            data: {} as RecoverZOTPData,
        });
    }
}
