import { NgIf } from "@angular/common";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatMenuModule } from "@angular/material/menu";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";
import { filter, Subject, takeUntil } from "rxjs";

import { AddZotpComponent } from "../zelf-authenticator/add-zotp/add-zotp.component";
import { FooterMenuComponent } from "./footer-menu/footer-menu.component";

@Component({
    imports: [RouterLink, NgIf, MatButtonModule, MatMenuModule, TranslocoModule],
    selector: "zelf-footer",
    styleUrls: ["../main.scss", "./zelf-footer.component.scss"],
    templateUrl: "./zelf-footer.component.html",
})
export class ZelfFooterComponent implements OnInit, OnDestroy {
    private _destroy$ = new Subject<void>();

    @Input() shareables: any;

    currentRoute: string = "";

    constructor(
        private _dialog: MatDialog,
        private _router: Router
    ) {}

    ngOnInit(): void {
        this._initRouteTracking();
        this._updateCurrentRoute();
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    private _initRouteTracking(): void {
        this._router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntil(this._destroy$)
            )
            .subscribe(() => {
                this._updateCurrentRoute();
            });
    }

    private _updateCurrentRoute(): void {
        this.currentRoute = this._router.url.split("?")[0];
    }

    isZelfKeysRoute(): boolean {
        return this.currentRoute.startsWith("/zelf-keys");
    }

    isZelfAuthenticatorRoute(): boolean {
        return this.currentRoute.includes("zelf-authenticator");
    }

    openMenu(): void {
        this._dialog.open(FooterMenuComponent, {
            backdropClass: "zelf-backdrop",
            maxWidth: "90vw",
            panelClass: "zelf-dialog-footer",
            position: { bottom: "94px" },
            width: "100%",
        });
    }

    async addZOTP(): Promise<void> {
        const dialogRef = this._dialog.open(AddZotpComponent, {
            backdropClass: "zelf-backdrop",
            maxWidth: "500px",
            panelClass: "zelf-dialog",
            width: "90vw",
        });

        dialogRef.afterClosed().subscribe(async () => {
            // Dialog closed, could refresh if needed
        });
    }

    navigateToZelfKeysTab(tab: string): void {
        this._router.navigate(["/zelf-keys", ...tab.split("/")]);
    }
}
