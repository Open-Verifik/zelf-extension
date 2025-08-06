import { SelectionModel } from "@angular/cdk/collections";
import { NgClass, NgFor, NgIf, NgTemplateOutlet } from "@angular/common";
import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { Router, RouterLink } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";
import { ChromeService } from "app/chrome.service";

import { FirstLetterPipe } from "app/pipes/first-letter.pipe";
import { ZelfNamePipe } from "app/pipes/zelf-name.pipe";
import { WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";

@Component({
    selector: "home-header-accounts",
    imports: [NgClass, NgTemplateOutlet, NgIf, MatButtonModule, TranslocoModule, NgFor, RouterLink, ZelfNamePipe, FirstLetterPipe],
    templateUrl: "./home-header-accounts.component.html",
    styleUrls: ["./home-header-accounts.component.scss"],
})
export class HomeHeaderAccountsComponent implements OnInit, OnDestroy {
    loaded: boolean = false;
    shareables: any;
    wallet: Partial<WalletModel> = {};
    wallets: WalletModel[] = [];
    selectionModel = new SelectionModel<string>(false);

    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
        private _bottomSheetRef: MatBottomSheetRef<HomeHeaderAccountsComponent>,
        private _chromeService: ChromeService,
        private _router: Router,
        private _walletService: WalletService
    ) {
        this.shareables = data;
        this.loaded = false;
    }

    async ngOnInit(): Promise<void> {
        await this._initWallets();
    }

    ngOnDestroy(): void {
        this.wallets = [];
        this.loaded = false;
    }

    private async _initWallets(): Promise<void> {
        const { wallet, wallets } = await this._walletService.getAllWalletsFromStorage();

        this.wallet = wallet || {};
        this.wallets = wallets;

        this.loaded = true;
    }

    close(): void {
        this._bottomSheetRef.dismiss();
    }

    closeAllMenus(): void {
        this.selectionModel.clear();
    }

    isWalletMenuOpen(walletId: string): boolean {
        return this.selectionModel.isSelected(walletId);
    }

    async navigateToSeedPhrase(selectedWallet: WalletModel): Promise<void> {
        await this._walletService.switchWallet(selectedWallet);
        await this._chromeService.setItem("parameters", { openPrivateKeyBottomSheet: true });

        const navigated = await this._router.navigate(["/wallet"]);

        if (!navigated) return;

        this.close();
    }

    async navigateToZelfLink(selectedWallet: WalletModel): Promise<void> {
        await this._walletService.switchWallet(selectedWallet);
        await this._chromeService.setItem("parameters", { openMyArnsBottomSheet: true });

        const navigated = await this._router.navigate(["/wallet"]);

        if (!navigated) return;

        this.close();
    }

    async navigateToDownloadQR(selectedWallet: WalletModel): Promise<void> {
        await this._walletService.switchWallet(selectedWallet);

        const navigated = await this._router.navigate(["/wallet"]);

        if (!navigated) return;

        this.close();
    }

    async switchWallet(selectedWallet: WalletModel): Promise<void> {
        await this._walletService.switchWallet(selectedWallet);

        this.close();
    }

    toggleWalletMenu(walletId: string): void {
        if (this.selectionModel.isSelected(walletId)) {
            this.selectionModel.deselect(walletId);
        } else {
            this.selectionModel.clear();
            this.selectionModel.select(walletId);
        }
    }
}
