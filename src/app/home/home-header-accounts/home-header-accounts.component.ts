import { NgFor, NgIf } from "@angular/common";
import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";
import { FirstLetterPipe } from "app/pipes/first-letter.pipe";
import { ZelfNamePipe } from "app/pipes/zelf-name.pipe";
import { WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";

@Component({
    selector: "home-header-accounts",
    standalone: true,
    imports: [NgIf, MatButtonModule, TranslocoModule, NgFor, RouterLink, ZelfNamePipe, FirstLetterPipe],
    templateUrl: "./home-header-accounts.component.html",
    styleUrls: ["./home-header-accounts.component.scss"],
})
export class HomeHeaderAccountsComponent implements OnInit, OnDestroy {
    loaded: boolean = false;
    shareables: any;
    wallet: Partial<WalletModel> = {};
    wallets: WalletModel[] = [];

    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
        private _bottomSheetRef: MatBottomSheetRef<HomeHeaderAccountsComponent>,
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

    async switchWallet(selectedWallet: WalletModel): Promise<void> {
        await this._walletService.switchWallet(selectedWallet);

        this.close();
    }
}
