import { Component, Inject } from "@angular/core";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { TranslocoModule } from "@ngneat/transloco";

@Component({
    selector: "my-arns",
    standalone: true,
    imports: [TranslocoModule],
    templateUrl: "./my-arns.component.html",
    styleUrls: ["./my-arns.component.scss"],
})
export class MyArNSComponent {
    constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private _bottomSheetRef: MatBottomSheetRef<MyArNSComponent>) {}

    close(): void {
        this._bottomSheetRef.dismiss();
    }
}
