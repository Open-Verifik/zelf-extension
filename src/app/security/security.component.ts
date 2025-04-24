import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { ConfirmationDialogComponent } from "app/confirmation-dialog/confirmation-dialog.component";
import { ZelfNameService } from "app/zelf-name-service.service";

@Component({
    imports: [RouterModule, TranslocoModule, MatButtonModule],
    selector: "security",
    styleUrls: ["./security.component.scss"],
    templateUrl: "./security.component.html",
})
export class SecurityComponent implements OnInit {
    loading: boolean = true;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _dialog: MatDialog,
        private _router: Router,
        private _translocoService: TranslocoService,
        private _zelfNameService: ZelfNameService
    ) {}

    async ngOnInit(): Promise<void> {
        await this._zelfNameService.setMnemonicCount(0);

        this.loading = false;
    }

    confirmBack(): void {
        const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
            panelClass: "zelf-dialog",
            backdropClass: "zelf-backdrop",
            data: {
                cancel: this._translocoService.translate("common.cancel"),
                confirm: this._translocoService.translate("common.confirm"),
                message: this._translocoService.translate("common.navigating_away_will_cancel"),
                title: this._translocoService.translate("common.are_you_sure"),
            },
        });

        dialogRef.afterClosed().subscribe(async (confirmed) => {
            if (!confirmed) return;

            this._router.navigate(["/welcome"]);
        });
    }

    async setMnemonicCount(value: 12 | 24): Promise<any> {
        await this._zelfNameService.setMnemonicCount(value);

        this._router.navigate(["./password"], { relativeTo: this._activatedRoute });
    }
}
