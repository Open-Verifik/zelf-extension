import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router, RouterLink } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { ChromeService } from "app/chrome.service";
import { ConfirmationDialogComponent } from "app/confirmation-dialog/confirmation-dialog.component";

@Component({
    imports: [TranslocoModule, MatButtonModule, RouterLink],
    selector: "zelf-settings",
    styleUrls: ["./zelf-settings.component.scss"],
    templateUrl: "./zelf-settings.component.html",
})
export class ZelfSettingsComponent {
    constructor(
        private _chromeService: ChromeService,
        private _dialog: MatDialog,
        private _router: Router,
        private _translocoService: TranslocoService
    ) {}

    private _createDialogRef(): MatDialogRef<ConfirmationDialogComponent> {
        return this._dialog.open(ConfirmationDialogComponent, {
            panelClass: "zelf-dialog",
            backdropClass: "zelf-backdrop",
            data: {
                message: this._translocoService.translate("logout_message"),
                confirm: this._translocoService.translate("common.confirm"),
                cancel: this._translocoService.translate("common.cancel"),
                title: this._translocoService.translate("logout_title"),
            },
        });
    }

    logout() {
        const dialogRef = this._createDialogRef();

        dialogRef.afterClosed().subscribe((result) => {
            if (!result) return;

            this._chromeService.clearLocalStorage();
            this._router.navigate(["/welcome"], { replaceUrl: true });
        });
    }
}
