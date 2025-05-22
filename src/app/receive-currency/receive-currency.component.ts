import { NgFor, NgIf, NgTemplateOutlet } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RouterLink } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { CopyToClipboardBase } from "app/base/copy-to-clipboard/copy-to-clipboard.base";
import { ChromeService } from "app/chrome.service";
import { AddressMaskPipe } from "app/pipes/address-mask.pipe";
import { Network, WalletService } from "app/wallet.service";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";

@Component({
    imports: [NgIf, NgFor, NgTemplateOutlet, RouterLink, TranslocoModule, MatButtonModule, AddressMaskPipe, ZelfLoaderComponent],
    selector: "receive-currency",
    styleUrls: ["./receive-currency.component.scss"],
    templateUrl: "./receive-currency.component.html",
})
export class ReceiveCurrencyComponent extends CopyToClipboardBase implements OnInit {
    loading: boolean = true;
    networks: Network[] = [];

    constructor(
        private _walletService: WalletService,
        public _chromeService: ChromeService,
        public _snackBar: MatSnackBar,
        public _translocoService: TranslocoService
    ) {
        super(_chromeService, _snackBar, _translocoService);
    }

    async ngOnInit(): Promise<void> {
        this._initNetworks();

        this.loading = false;
    }

    private async _initNetworks(): Promise<void> {
        this.networks = await this._walletService.getAvailableWalletNetworks();
    }

    public copyToClipboard(event: Event, network: Network): void {
        event.preventDefault();
        event.stopPropagation();

        this._copyToClipboard(network.address);
    }
}
