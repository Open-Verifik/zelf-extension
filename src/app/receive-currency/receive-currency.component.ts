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
import { SettingsService } from "app/services/settings.service";
import { ZelfNameService } from "app/zelf-name-service.service";
import { TagModel } from "app/tags.service";

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
        private _settingsService: SettingsService,
        private _zelfNameService: ZelfNameService,
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
        const wallet = (await this._walletService.getCurrentWallet()) as TagModel | null;

        if (wallet?.tagName) {
            await this._zelfNameService.refreshWalletPublicData(wallet);
        }

        const allNetworks = await this._walletService.getAvailableWalletNetworks();

        const enabledNetworkIds = this._getEnabledNetworkIds();

        if (!enabledNetworkIds) {
            this.networks = allNetworks;
            return;
        }

        this.networks = allNetworks.filter((network) => {
            const networkId = this._mapSymbolToNetworkId(network.symbol);
            return enabledNetworkIds.includes(networkId);
        });
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

    public copyToClipboard(event: Event, network: Network): void {
        event.preventDefault();
        event.stopPropagation();

        this._copyToClipboard(network.address);
    }
}
