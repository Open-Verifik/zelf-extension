import { MatSnackBar } from "@angular/material/snack-bar";

import { TranslocoService } from "@jsverse/transloco";

import { ChromeService } from "app/chrome.service";

export class CopyToClipboardBase {
    private _copyToClipboardActionText: string;
    private _copyToClipboardErrorActionText: string;
    private _copyToClipboardErrorText: string;
    private _copyToClipboardText: string;

    constructor(protected _chromeService: ChromeService, protected _snackBar: MatSnackBar, protected _translocoService: TranslocoService) {
        this._copyToClipboardActionText = this._translocoService.translate("common.close");
        this._copyToClipboardErrorActionText = this._translocoService.translate("common.close");
        this._copyToClipboardErrorText = this._translocoService.translate("common.failed_to_copy_to_clipboard");
        this._copyToClipboardText = this._translocoService.translate("common.copied_to_clipboard");
    }

    protected async _copyToClipboard(value: string, showSnackBar: boolean = true): Promise<void> {
        try {
            await this._chromeService.copyToClipboard(value);

            if (showSnackBar) this._showCopyToClipboardSnackBar();
        } catch (error) {
            if (!showSnackBar) return;

            this._showCopyToClipboardSnackBarError();
        }
    }

    protected _showCopyToClipboardSnackBar(): void {
        this._snackBar.open(this._copyToClipboardText, this._copyToClipboardActionText, {
            duration: 2000,
            panelClass: "zelf-snackbar",
            verticalPosition: "top",
        });
    }

    protected _showCopyToClipboardSnackBarError(): void {
        this._snackBar.open(this._copyToClipboardErrorText, this._copyToClipboardErrorActionText, {
            duration: 2000,
            panelClass: "zelf-snackbar",
            verticalPosition: "top",
        });
    }
}
