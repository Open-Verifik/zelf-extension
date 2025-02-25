import { CommonModule, NgIf, NgTemplateOutlet } from "@angular/common";
import { Component } from "@angular/core";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { RouterLink, RouterModule } from "@angular/router";

import { TranslocoModule, TranslocoService } from "@ngneat/transloco";

import { CopyToClipboardBase } from "app/base/copy-to-clipboard/copy-to-clipboard.base";
import { ChromeService } from "app/chrome.service";
import { MyZnsComponent } from "app/my-zns/my-zns.component";
import { ZelfNamePipe } from "app/pipes/zelf-name.pipe";
import { PrivateKeyComponent } from "app/private-key/private-key.component";
import { WalletModel } from "app/wallet";

@Component({
    selector: "app-wallet",
    standalone: true,
    imports: [CommonModule, NgIf, MatButtonModule, TranslocoModule, RouterLink, RouterModule, NgTemplateOutlet, MatSnackBarModule, ZelfNamePipe],
    templateUrl: "./wallet.component.html",
    styleUrls: ["./wallet.component.scss"],
})
export class WalletComponent extends CopyToClipboardBase {
    loading: boolean = false;
    wallet: Partial<WalletModel> = {};
    wallets: WalletModel[] = [];

    constructor(
        private _bottomSheet: MatBottomSheet,
        protected _chromeService: ChromeService,
        protected _snackBar: MatSnackBar,
        protected _translocoService: TranslocoService
    ) {
        super(_chromeService, _snackBar, _translocoService);
    }

    ngOnInit(): void {
        this._setWallets().then(() => {
            this.loading = false;
        });
    }

    private async _setWallets(): Promise<void> {
        this.loading = true;

        let wallet = await this._chromeService.getItem("wallet");
        let wallets: WalletModel[] = [];

        if (!wallet) {
            wallets = await this._chromeService.getItem("wallets");
            wallet = wallets[0];

            this._chromeService.setItem("wallet", wallet);
        }

        this.wallet = wallet;
    }

    async copyToClipboard(value: string): Promise<void> {
        await this._copyToClipboard(value);
    }

    downloadQRCode(): void {
        const link = document.createElement("a");

        link.href = this.wallet.image as string;
        link.download = `zelfproof_${this.wallet.publicData?.zelfName}.png`;
        link.click();
    }

    getWalletStatus(): string {
        if (!this.wallet.publicData?.isExpired) {
            return this.wallet.publicData?.type !== "hold" ? "active" : "hold";
        }

        return "expired";
    }

    openPrivateKeyBottomSheet(): void {
        this._bottomSheet.open(PrivateKeyComponent, {
            backdropClass: "zelf-backdrop",
            panelClass: "zelf-bottom-sheet",
        });
    }

    openMyZnsBottomSheet(): void {
        this._bottomSheet.open(MyZnsComponent, {
            backdropClass: "zelf-backdrop",
            panelClass: "zelf-bottom-sheet",
        });
    }
}
