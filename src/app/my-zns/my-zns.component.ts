import { Component, Inject } from "@angular/core";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { TranslocoModule } from "@ngneat/transloco";

@Component({
	selector: "my-zns",
	standalone: true,
	imports: [TranslocoModule],
	templateUrl: "./my-zns.component.html",
	styleUrls: ["./my-zns.component.scss"],
})
export class MyZnsComponent {
	constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private _bottomSheetRef: MatBottomSheetRef<MyZnsComponent>) {}

	close(): void {
		this._bottomSheetRef.dismiss();
	}
}
