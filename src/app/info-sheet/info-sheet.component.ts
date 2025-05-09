import { Component, Inject } from "@angular/core";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { TranslocoModule } from "@jsverse/transloco";

@Component({
    imports: [MatButtonModule, TranslocoModule],
    selector: "info-sheet",
    styleUrl: "./info-sheet.component.scss",
    templateUrl: "./info-sheet.component.html",
})
export class InfoSheetComponent {
    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
        private _dialogRef: MatBottomSheetRef<InfoSheetComponent>
    ) {}

    close() {
        this._dialogRef.dismiss();
    }
}
