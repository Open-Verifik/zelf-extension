import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";

import { ChromeService } from "app/chrome.service";
import { ZelfNamePipe } from "app/pipes/zelf-name.pipe";
import { WalletModel } from "app/wallet";
import { ZelfFlow, ZelfNameService } from "app/zelf-name-service.service";
import { MnemonicComponent } from "../mnemonic/mnemonic.component";
import { WalletService } from "app/wallet.service";
import { VaultService } from "app/vault.service";

@Component({
    imports: [TranslocoModule, CommonModule, RouterModule, ZelfNamePipe, MatButtonModule, MnemonicComponent],
    selector: "welcome-complete",
    standalone: true,
    styleUrls: ["./welcome-complete.component.scss"],
    templateUrl: "./welcome-complete.component.html",
})
export class WelcomeCompleteComponent implements OnInit, OnDestroy {
    flow: ZelfFlow = "";
    loading: boolean = true;
    isExtension: boolean = false;
    wallet: Partial<WalletModel> | null = {};

    constructor(
        private _chromeService: ChromeService,
        private _vaultService: VaultService,
        private _walletService: WalletService,
        private _zelfNameService: ZelfNameService
    ) {
        this.isExtension = this._chromeService.isExtension;

        this._chromeService.removeItem("referralZelfName");
        this._chromeService.removeItem("zelfNameObject");
    }

    async ngOnInit(): Promise<void> {
        await this._walletService.removeDuplicateWalletsInStorage();

        this.wallet = new WalletModel(await this._chromeService.getItem("wallet"));
        this.flow = await this._zelfNameService.getFlow();

        this.loading = false;
    }

    ngOnDestroy(): void {
        this._vaultService.password = "";
        this._vaultService.mnemonic = "";
    }

    downloadQRCode(): void {
        const link = document.createElement("a");

        link.href = this.wallet?.image as string;
        link.download = `zelfproof_${this.wallet?.publicData?.zelfName}.png`;
        link.click();
    }
}
