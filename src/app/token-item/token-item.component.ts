import { CurrencyPipe, DecimalPipe, NgIf, NgTemplateOutlet } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslocoService } from "@ngneat/transloco";
import { CopyToClipboardBase } from "app/base/copy-to-clipboard/copy-to-clipboard.base";
import { ChromeService } from "app/chrome.service";

@Component({
    imports: [NgIf, NgTemplateOutlet, CurrencyPipe, DecimalPipe, MatButtonModule],
    selector: "token-item",
    standalone: true,
    styleUrls: ["./token-item.component.scss"],
    templateUrl: "./token-item.component.html",
})
export class TokenItemComponent extends CopyToClipboardBase {
    @Output("onQRCodeClick") onQRCodeClick: EventEmitter<any> = new EventEmitter<any>();

    @Input("token") token: any;
    @Input("showPrice") showPrice: boolean = false;
    @Input("showCopyAddress") showCopyAddress: boolean = false;
    @Input("showQRCode") showQRCode: boolean = false;

    constructor(public _chromeService: ChromeService, public _snackBar: MatSnackBar, public _translocoService: TranslocoService) {
        super(_chromeService, _snackBar, _translocoService);

        this.token = {};
    }

    public copyToClipboard(): void {
        if (!this.token?.address) return;

        this._copyToClipboard(this.token.address);
    }
}
