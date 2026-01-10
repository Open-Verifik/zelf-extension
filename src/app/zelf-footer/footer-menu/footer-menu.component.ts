import { NgClass, NgIf, NgTemplateOutlet } from "@angular/common";
import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";
import { filter, Subject, takeUntil } from "rxjs";

import { fadeScale } from "app/animations/fade-scale.animation";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";

@Component({
    animations: [fadeScale],
    imports: [NgClass, NgIf, NgTemplateOutlet, TranslocoModule, RouterLink, ZelfLoaderComponent],
    selector: "footer-menu",
    styleUrls: ["./footer-menu.component.scss"],
    templateUrl: "./footer-menu.component.html",
})
export class FooterMenuComponent implements OnInit, OnDestroy {
    private _destroy$ = new Subject<void>();

    currentRoute: string = "";
    loading = false;
    showCloseButton: boolean = false;

    constructor(
        private _dialogRef: MatDialogRef<FooterMenuComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _router: Router
    ) {
        this._dialogRef.afterOpened().subscribe(() => {
            this.showCloseButton = true;
        });
    }

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

    isRouteActive(route: string): boolean {
        if (route === "/home") {
            return this.currentRoute === "/home" || this.currentRoute === "/wallet";
        }

        return this.currentRoute === route || this.currentRoute.startsWith(route + "/");
    }

    private _animateThenClose(): void {
        this.showCloseButton = !this.showCloseButton;

        setTimeout(() => {
            this._dialogRef.close();
        }, 100);
    }

    close(): void {
        if (this.loading) return;

        this._dialogRef.close();
    }

    onCloseButton(): void {
        if (this.loading) return;

        this._animateThenClose();
    }

    async navigateToZelfKeys(): Promise<void> {
        this.loading = true;

        await this._router.navigate(["/zelf-keys"]);

        this.loading = false;

        this._dialogRef.close();
    }
}
