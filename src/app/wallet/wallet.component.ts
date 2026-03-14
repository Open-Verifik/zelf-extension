import { CommonModule, NgFor, NgIf, NgTemplateOutlet } from "@angular/common";
import { Component, DestroyRef, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { RouterLink, RouterModule } from "@angular/router";

import { TranslocoModule, TranslocoService } from "@jsverse/transloco";

import { CopyToClipboardBase } from "app/base/copy-to-clipboard/copy-to-clipboard.base";
import { ChromeService } from "app/chrome.service";
import { InfoSheetComponent } from "app/info-sheet/info-sheet.component";
import { MyArNSComponent } from "app/my-arns/my-arns.component";
import { PrivateKeyComponent } from "app/private-key/private-key.component";
import { AddressMaskPipe } from "app/pipes/address-mask.pipe";
import { SettingsService } from "app/services/settings.service";
import { TagModel, TagsService } from "app/tags.service";
import { Network, WalletService } from "app/wallet.service";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";
import { ZelfNameService } from "app/zelf-name-service.service";

@Component({
    imports: [
        CommonModule,
        NgFor,
        NgIf,
        MatButtonModule,
        TranslocoModule,
        RouterLink,
        RouterModule,
        NgTemplateOutlet,
        MatSnackBarModule,
        AddressMaskPipe,
        ZelfLoaderComponent,
    ],
    selector: "wallet",
    styleUrls: ["./wallet.component.scss"],
    templateUrl: "./wallet.component.html",
})
export class WalletComponent extends CopyToClipboardBase implements OnInit {
    private _showArnsInstructions: boolean = true;

    loading: boolean = true;
    networks: Network[] = [];
    parameters: any = {};
    selectedTab: string = "addresses";
    wallet: Partial<TagModel> = {};

    constructor(
        private _bottomSheet: MatBottomSheet,
        private _destroyRef: DestroyRef,
        private _walletService: WalletService,
        private _settingsService: SettingsService,
        private _tagsService: TagsService,
        private _zelfNameService: ZelfNameService,
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

        if (this.parameters.openPrivateKeyBottomSheet) this.openPrivateKeyBottomSheet();
        else if (this.parameters.openMyArnsBottomSheet) this.openMyArnsBottomSheet();

        await this._updateWallet();

        if (this.wallet?.tagName) {
            await this._zelfNameService.refreshWalletPublicData(this.wallet as TagModel);
            this.wallet = (await this._walletService.getCurrentWallet()) || {};
        }

        await this._initNetworks();

        this.loading = false;
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
        this.networks = await this._walletService.getAvailableWalletNetworks();
    }

    private _getEnabledNetworkIds(): string[] | undefined {
        const settings = this._settingsService.settings;
        if (!settings || !settings.networks) return undefined;
        return settings.networks.filter((n) => n.enabled).map((n) => n.id);
    }

    private _mapSymbolToNetworkId(symbol: string): string {
        switch (symbol.toUpperCase()) {
            case "ETH":
                return "ethereum";
            case "AVAX":
                return "avalanche";
            case "BNB":
            case "BSC":
                return "binance";
            case "BTC":
                return "bitcoin";
            case "BDAG":
                return "blockdag";
            case "MATIC":
            case "POL":
                return "polygon";
            case "SOL":
                return "solana";
            case "SUI":
                return "sui";
            case "XLM":
                return "stellar";
            default:
                return symbol.toLowerCase();
        }
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

    openPrivateKeyBottomSheet(): void {
        this._bottomSheet.open(PrivateKeyComponent, {
            data: { wallet: this.wallet },
            backdropClass: "zelf-backdrop",
            panelClass: "zelf-bottom-sheet",
        });
    }

    selectTab(tab: string): void {
        this.selectedTab = tab;
    }
}
