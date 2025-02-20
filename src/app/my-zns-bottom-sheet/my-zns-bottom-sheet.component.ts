import { Component, Inject } from "@angular/core";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { TranslocoModule } from "@ngneat/transloco";
import { HomeHeaderAccountsComponent } from "app/home/home-header-accounts/home-header-accounts.component";

@Component({
	selector: "my-zns-bottom-sheet",
	standalone: true,
	imports: [TranslocoModule],
	templateUrl: "./my-zns-bottom-sheet.component.html",
	styleUrls: ["./my-zns-bottom-sheet.component.scss"],
})
export class MyZnsBottomSheetComponent {
	constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private _bottomSheetRef: MatBottomSheetRef<HomeHeaderAccountsComponent>) {}

	close(): void {
		this._bottomSheetRef.dismiss();
	}
}
