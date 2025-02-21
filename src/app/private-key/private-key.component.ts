import { NgFor } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslocoModule, TranslocoService } from "@ngneat/transloco";
import { ChromeService } from "app/chrome.service";

@Component({
	selector: "private-key",
	standalone: true,
	imports: [NgFor, TranslocoModule],
	templateUrl: "./private-key.component.html",
	styleUrls: ["./private-key.component.scss"],
})
export class PrivateKeyComponent {
	copyToClipboardText: string;
	copyToClipboardActionText: string;
	words: string[] = ["apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew", "kiwi", "lemon", "mango", "nectarine"];

	constructor(
		@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
		private _bottomSheetRef: MatBottomSheetRef<PrivateKeyComponent>,
		private _chromeService: ChromeService,
		private _snackBar: MatSnackBar,
		private _translocoService: TranslocoService
	) {
		this.copyToClipboardText = this._translocoService.translate("copied_to_clipboard");
		this.copyToClipboardActionText = this._translocoService.translate("close");
	}

	close(): void {
		this._bottomSheetRef.dismiss();
	}

	async copyToClipboard(): Promise<void> {
		await this._chromeService.copyToClipboard(this.words.join(" "));

		this._snackBar.open(this.copyToClipboardText, this.copyToClipboardActionText, {
			duration: 2000,
			panelClass: "zelf-snackbar",
			verticalPosition: "top",
		});

		this.close();
	}
}
