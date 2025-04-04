import { CommonModule, NgIf, NgTemplateOutlet } from "@angular/common";
import { Component } from "@angular/core";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { RouterLink, RouterModule } from "@angular/router";

import { TranslocoModule, TranslocoService } from "@ngneat/transloco";

import { CopyToClipboardBase } from "app/base/copy-to-clipboard/copy-to-clipboard.base";
import { ChromeService } from "app/chrome.service";
import { MyArNSComponent } from "app/my-arns/my-arns.component";
import { ZelfNamePipe } from "app/pipes/zelf-name.pipe";
import { PrivateKeyComponent } from "app/private-key/private-key.component";
import { WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";

@Component({
    selector: "app-wallet",
    standalone: true,
    imports: [CommonModule, NgIf, MatButtonModule, TranslocoModule, RouterLink, RouterModule, NgTemplateOutlet, MatSnackBarModule, ZelfNamePipe],
    templateUrl: "./wallet.component.html",
    styleUrls: ["./wallet.component.scss"],
})
export class WalletComponent extends CopyToClipboardBase {
    loading: boolean = true;
    wallet: Partial<WalletModel> = {};

    constructor(
        private _bottomSheet: MatBottomSheet,
        private _walletService: WalletService,
        protected _chromeService: ChromeService,
        protected _snackBar: MatSnackBar,
        protected _translocoService: TranslocoService
    ) {
        super(_chromeService, _snackBar, _translocoService);
    }

    async ngOnInit(): Promise<void> {
        this.wallet = (await this._walletService.getCurrentWallet()) || {};

        this.loading = false;
    }

    async copyToClipboard(value: string): Promise<void> {
        await this._copyToClipboard(value);
    }

    downloadQRCode(): void {
        const link = document.createElement("a");

        link.href = this.wallet?.image as string;
        link.download = `zelfproof_${this.wallet?.publicData?.zelfName}.png`;
        link.click();
    }

    getWalletStatus(): string {
        if (this.wallet?.publicData?.isExpired) return "expired";

        return this.wallet?.publicData?.type === "mainnet" ? "active" : "hold";
    }

    isExpired(): boolean {
        return !!this.wallet?.publicData?.isExpired;
    }

    openPrivateKeyBottomSheet(): void {
        this._bottomSheet.open(PrivateKeyComponent, {
            data: { wallet: this.wallet },
            backdropClass: "zelf-backdrop",
            panelClass: "zelf-bottom-sheet",
        });
    }

    openMyZnsBottomSheet(): void {
        this._bottomSheet.open(MyArNSComponent, {
            backdropClass: "zelf-backdrop",
            panelClass: "zelf-bottom-sheet",
        });
    }
}
