import { CommonModule, NgIf, NgTemplateOutlet } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { Router, RouterLink, RouterModule } from "@angular/router";

import { TranslocoModule, TranslocoService } from "@jsverse/transloco";

import { CopyToClipboardBase } from "app/base/copy-to-clipboard/copy-to-clipboard.base";
import { ChromeService } from "app/chrome.service";
import { MyArNSComponent } from "app/my-arns/my-arns.component";
import { ZelfNamePipe } from "app/pipes/zelf-name.pipe";
import { PrivateKeyComponent } from "app/private-key/private-key.component";
import { WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { ZelfNameService } from "app/zelf-name-service.service";

@Component({
    imports: [CommonModule, NgIf, MatButtonModule, TranslocoModule, RouterLink, RouterModule, NgTemplateOutlet, MatSnackBarModule, ZelfNamePipe],
    selector: "wallet",
    styleUrls: ["./wallet.component.scss"],
    templateUrl: "./wallet.component.html",
})
export class WalletComponent extends CopyToClipboardBase implements OnInit {
    private _showArnsInstructions: boolean = true;

    loading: boolean = true;
    parameters: any = {};
    wallet: Partial<WalletModel> = {};

    constructor(
        private _bottomSheet: MatBottomSheet,
        private _router: Router,
        private _walletService: WalletService,
        private _zelfNameService: ZelfNameService,
        protected _chromeService: ChromeService,
        protected _snackBar: MatSnackBar,
        protected _translocoService: TranslocoService
    ) {
        super(_chromeService, _snackBar, _translocoService);
    }

    async ngOnInit(): Promise<void> {
        this._showArnsInstructions = (await this._chromeService.getItem("myArnsDontShowAgain")) !== true;

        this.wallet = (await this._walletService.getCurrentWallet()) || {};
        this.parameters = (await this._chromeService.getItem("parameters")) || {};

        await this._chromeService.removeItem("parameters");

        if (this.parameters.openPrivateKeyBottomSheet) this.openPrivateKeyBottomSheet();

        this._updateWallet();

        this.loading = false;
    }

    get showArnsButton(): boolean {
        return !!this.wallet?.publicData?.zelfName && this.wallet?.publicData?.type === "mainnet";
    }

    private async _updateWallet(): Promise<void> {
        const updatedWallet = await this._zelfNameService.refreshWalletPublicData(this.wallet as WalletModel);

        if (!updatedWallet) return;

        this.wallet = updatedWallet;
        this._walletService.updateWallet(this.wallet);
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

    openMyArnsBottomSheet(): void {
        if (this._showArnsInstructions) {
            this._bottomSheet.open(MyArNSComponent, {
                backdropClass: "zelf-backdrop",
                panelClass: "zelf-bottom-sheet",
            });

            return;
        }

        if (!this.wallet?.publicData?.zelfName) return;

        const url = this._zelfNameService.generateArNS(this.wallet.publicData.zelfName);

        this._router.navigate(["/external-link"], { queryParams: { externalUrl: url } });
    }
}
