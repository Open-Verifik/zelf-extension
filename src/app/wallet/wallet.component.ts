import { CommonModule, NgFor, NgIf, NgTemplateOutlet } from "@angular/common";
import { Component, DestroyRef, OnDestroy, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { Router, RouterLink, RouterModule } from "@angular/router";

import { TranslocoModule, TranslocoService } from "@jsverse/transloco";

import { CopyToClipboardBase } from "app/base/copy-to-clipboard/copy-to-clipboard.base";
import { ChromeService } from "app/chrome.service";
import { InfoSheetComponent } from "app/info-sheet/info-sheet.component";
import { MnemonicComponent } from "app/mnemonic/mnemonic.component";
import { MyArNSComponent } from "app/my-arns/my-arns.component";
import { AddressMaskPipe } from "app/pipes/address-mask.pipe";
import { TagModel, TagsService } from "app/tags.service";
import { VaultService } from "app/vault.service";
import { Network, WalletService } from "app/wallet.service";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";

@Component({
    imports: [
        CommonModule,
        NgFor,
        NgIf,
        FlexLayoutModule,
        MatButtonModule,
        TranslocoModule,
        RouterLink,
        RouterModule,
        NgTemplateOutlet,
        MatSnackBarModule,
        AddressMaskPipe,
        ZelfLoaderComponent,
        MnemonicComponent,
    ],
    selector: "wallet",
    styleUrls: ["./wallet.component.scss", "../main.scss"],
    templateUrl: "./wallet.component.html",
})
export class WalletComponent extends CopyToClipboardBase implements OnInit, OnDestroy {
    private _showArnsInstructions: boolean = true;

    loading: boolean = true;
    networks: Network[] = [];
    parameters: any = {};
    selectedTab: string = "addresses";
    wallet: Partial<TagModel> = {};

    constructor(
        private _bottomSheet: MatBottomSheet,
        private _destroyRef: DestroyRef,
        private _router: Router,
        private _vaultService: VaultService,
        private _walletService: WalletService,
        private _tagsService: TagsService,
        protected _chromeService: ChromeService,
        protected _snackBar: MatSnackBar,
        protected _translocoService: TranslocoService
    ) {
        super(_chromeService, _snackBar, _translocoService);

        this._chromeService.onMyArnsDontShowAgainChanged$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((value) => {
            this._showArnsInstructions = !value;
        });
    }

    async ngOnInit(): Promise<void> {
        this._showArnsInstructions = (await this._chromeService.getItem("myArnsDontShowAgain")) !== true;

        this.wallet = (await this._walletService.getCurrentWallet()) || {};

        this.parameters = (await this._chromeService.getItem("parameters")) || {};

        await this._chromeService.removeItem("parameters");

        if (this.parameters.openMyArnsBottomSheet) this.openMyArnsBottomSheet();

        await this._updateWallet();

        await this._initNetworks();

        this.loading = false;
    }

    ngOnDestroy(): void {
        this._vaultService.mnemonic = "";
    }

    get showArnsButton(): boolean {
        return !!this.wallet?.fullTagName && this.wallet?.publicData?.type === "mainnet";
    }

    private async _updateWallet(): Promise<void> {
        const updatedWallet = await this._tagsService.refreshTagPublicData(this.wallet as TagModel);

        if (!updatedWallet) return;

        this.wallet = updatedWallet;
        this._walletService.updateWallet(this.wallet);
    }

    private async _initNetworks(): Promise<void> {
        this.networks = await this._walletService.getAvailableWalletNetworks(null);
    }

    async onMnemonicUnlock(): Promise<void> {
        await this._tagsService.setFlow("unlock");

        await this._tagsService.setTagName(this.wallet?.name as string);

        this._router.navigate(["/security/biometrics"], { queryParams: { return: "/wallet" } });
    }

    async copyToClipboard(value: string): Promise<void> {
        await this._copyToClipboard(value);
    }

    copyToClipboardForNetwork(event: Event, network: Network): void {
        event.preventDefault();
        event.stopPropagation();
        this._copyToClipboard(network.address);
    }

    downloadQRCode(): void {
        const link = document.createElement("a");

        link.href = this.wallet?.image as string;

        link.download = `zelfproof_${this.wallet?.fullTagName}.png`;

        link.click();
    }

    getWalletStatus(): string {
        if (this.wallet?.publicData?.isExpired) return "expired";

        return this.wallet?.isMainnet ? "active" : "hold";
    }

    isExpired(): boolean {
        return !!this.wallet?.publicData?.isExpired;
    }

    openInfoSheet(): void {
        this._bottomSheet.open(InfoSheetComponent, {
            backdropClass: "zelf-backdrop-full",
            panelClass: "zelf-botton-sheet-full",
            height: "100vh",
            maxHeight: "100vh",
        });
    }

    openMyArnsBottomSheet(): void {
        this._bottomSheet.open(MyArNSComponent, {
            backdropClass: "zelf-backdrop",
            panelClass: "zelf-bottom-sheet",
            data: { wallet: this.wallet },
        });
    }

    selectTab(tab: string): void {
        this.selectedTab = tab;
    }
}
