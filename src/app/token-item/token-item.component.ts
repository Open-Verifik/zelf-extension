import { CurrencyPipe, DecimalPipe, NgIf, NgTemplateOutlet } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslocoService } from "@jsverse/transloco";

import { CopyToClipboardBase } from "app/base/copy-to-clipboard/copy-to-clipboard.base";
import { ChromeService } from "app/chrome.service";
import { WalletService } from "app/wallet.service";

@Component({
    imports: [NgIf, NgTemplateOutlet, CurrencyPipe, DecimalPipe, MatButtonModule],
    selector: "token-item",
    styleUrls: ["./token-item.component.scss"],
    templateUrl: "./token-item.component.html",
})
export class TokenItemComponent extends CopyToClipboardBase implements OnInit {
    @Output("onQRCodeClick") onQRCodeClick: EventEmitter<any> = new EventEmitter<any>();

    @Input("token") token: any;
    @Input("showFiatBalance") showFiatBalance: boolean = false;
    @Input("showPrice") showPrice: boolean = false;
    @Input("showCopyAddress") showCopyAddress: boolean = false;
    @Input("showQRCode") showQRCode: boolean = false;

    constructor(
        public _chromeService: ChromeService,
        public _snackBar: MatSnackBar,
        public _translocoService: TranslocoService,
        private _walletService: WalletService
    ) {
        super(_chromeService, _snackBar, _translocoService);

        this.token = {};
    }

    ngOnInit(): void {
        this.token.image = this._walletService.getAssetImage(this.token.symbol, this.token?.image);
    }

    public copyToClipboard(): void {
        if (!this.token?.address) return;

        this._copyToClipboard(this.token.address);
    }
}
