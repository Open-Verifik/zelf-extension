import { NgFor, NgIf, NgTemplateOutlet } from "@angular/common";
import { AfterViewInit, Component, OnDestroy, TemplateRef, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ChromeService } from "app/chrome.service";
import { ConfirmationDialogComponent } from "app/confirmation-dialog/confirmation-dialog.component";
import { Subject, takeUntil } from "rxjs";
import { ZelfSettingsSecurityComponent } from "./zelf-settings-security/zelf-settings-security.component";

@Component({
    imports: [NgFor, NgIf, TranslocoModule, MatButtonModule, RouterLink, NgTemplateOutlet, ZelfSettingsSecurityComponent],
    selector: "zelf-settings",
    styleUrls: ["./zelf-settings.component.scss"],
    templateUrl: "./zelf-settings.component.html",
})
export class ZelfSettingsComponent implements AfterViewInit, OnDestroy {
    @ViewChild("securityIcon", { static: true }) securityIcon: TemplateRef<HTMLDivElement> = {} as TemplateRef<HTMLDivElement>;

    private unsubscriber$: Subject<void> = new Subject<void>();

    selectedSettings: "security" | "" = "";
    settingsItems: {
        title: string;
        icon: string;
        queryParams: {
            edit: string;
        };
    }[] = [];

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _chromeService: ChromeService,
        private _dialog: MatDialog,
        private _router: Router,
        private _translocoService: TranslocoService
    ) {
        this._setSelectedSettings();
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    ngAfterViewInit(): void {
        this._setSettingItems();
    }

    private _createDialogRef(): MatDialogRef<ConfirmationDialogComponent> {
        return this._dialog.open(ConfirmationDialogComponent, {
            panelClass: "zelf-dialog",
            backdropClass: "zelf-backdrop",
            data: {
                message: this._translocoService.translate("logout_message"),
                confirm: this._translocoService.translate("common.confirm"),
                cancel: this._translocoService.translate("common.cancel"),
                title: this._translocoService.translate("logout_title"),
                destructiveButton: true,
            },
        });
    }

    private _setSettingItems() {
        this.settingsItems = [
            {
                title: this._translocoService.translate("settings.security_label"),
                icon: "securityIcon",
                queryParams: {
                    edit: "security",
                },
            },
        ];
    }

    private _setSelectedSettings() {
        this.selectedSettings = this._activatedRoute.snapshot.queryParams?.edit ? this._activatedRoute.snapshot.queryParams.edit : "";

        this._activatedRoute.queryParams.pipe(takeUntil(this.unsubscriber$)).subscribe((queryParams) => {
            this.selectedSettings = queryParams.edit ? queryParams.edit : "";
        });
    }

    getTemplateIcon(settingItem: { icon: string }): TemplateRef<any> | null {
        return (this[settingItem.icon as keyof ZelfSettingsComponent] as TemplateRef<any>) || null;
    }

    logout() {
        const dialogRef = this._createDialogRef();

        dialogRef.afterClosed().subscribe((result) => {
            if (!result) return;

            this._chromeService.clearLocalStorage();
            this._chromeService.clearSessionStorage();

            this._router.navigate(["/welcome"], { replaceUrl: true });
        });
    }
}
