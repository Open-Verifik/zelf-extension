import { NgFor, NgIf } from "@angular/common";
import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";
import { ChromeService } from "app/chrome.service";
import { FirstLetterPipe } from "app/pipes/first-letter.pipe";
import { ZelfNamePipe } from "app/pipes/zelf-name.pipe";
import { WalletModel } from "app/wallet";

@Component({
    selector: "home-header-accounts",
    standalone: true,
    imports: [NgIf, MatButtonModule, TranslocoModule, NgFor, RouterLink, ZelfNamePipe, FirstLetterPipe],
    templateUrl: "./home-header-accounts.component.html",
    styleUrls: ["./home-header-accounts.component.scss"],
})
export class HomeHeaderAccountsComponent implements OnInit, OnDestroy {
    currentWallet: WalletModel = new WalletModel();
    wallets: WalletModel[] = [];
    loaded: boolean = false;
    shareables: any;

    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
        private _bottomSheetRef: MatBottomSheetRef<HomeHeaderAccountsComponent>,
        private _chromeService: ChromeService
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
        const _wallet = (await this._chromeService.getItem("wallet")) || {};

        this.currentWallet = new WalletModel({ ..._wallet, index: 0 });

        const remainingWallets = (await this._chromeService.getItem("wallets")) || [];

        const walletsMapping = {
            [this.currentWallet.ethAddress]: true,
        };

        const wallets = [];

        if (Array.isArray(remainingWallets) && remainingWallets.length) {
            for (let index = 0; index < remainingWallets.length; index++) {
                const wallet = remainingWallets[index];

                const _wallet = new WalletModel({
                    ...wallet,
                    index: index + 1,
                });

                if (walletsMapping[_wallet.ethAddress]) continue;

                walletsMapping[wallet.ethAddress] = true;

                if (!_wallet.ethAddress || !_wallet.image.includes("data:image/png;base64")) continue;

                wallets.push(_wallet);
            }
        }

        this.wallets = wallets;

        this._chromeService.setItem("wallets", this.wallets);

        this.loaded = true;
    }

    close(): void {
        this._bottomSheetRef.dismiss();
    }

    async switchWallet(wallet: WalletModel): Promise<void> {
        const wallets = (await this._chromeService.getItem("wallets")) as WalletModel[];
        const newWallets = wallets.filter((_wallet) => _wallet.publicData.zelfName !== wallet.publicData.zelfName);

        await this._chromeService.setItem("wallet", wallet);
        await this._chromeService.setItem("wallets", newWallets);

        this.close();
    }
}
