import { NgClass, NgFor } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { TranslocoModule } from "@jsverse/transloco";
import { NetworkConfig, Settings } from "app/models/settings.model";
import { SettingsService } from "app/services/settings.service";
import { WalletService } from "app/wallet.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

// Default networks based on blockchain-transactions.service.ts
const DEFAULT_NETWORKS: NetworkConfig[] = [
    { id: "ethereum", name: "Ethereum", symbol: "ETH", enabled: true },
    { id: "avalanche", name: "Avalanche", symbol: "AVAX", enabled: true },
    { id: "binance", name: "BNB Chain", symbol: "BNB", enabled: true },
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", enabled: true },
    { id: "blockdag", name: "BlockDAG", symbol: "BDAG", enabled: true },
    { id: "polygon", name: "Polygon", symbol: "POL", enabled: true },
    { id: "solana", name: "Solana", symbol: "SOL", enabled: true },
    { id: "sui", name: "Sui", symbol: "SUI", enabled: true },
];

@Component({
    imports: [NgFor, NgClass, FormsModule, MatSlideToggleModule, TranslocoModule],
    selector: "zelf-settings-networks",
    styleUrls: ["./zelf-settings-networks.component.scss"],
    templateUrl: "./zelf-settings-networks.component.html",
})
export class ZelfSettingsNetworksComponent implements OnInit, OnDestroy {
    private unsubscriber$: Subject<void> = new Subject<void>();

    networks: NetworkConfig[] = [];
    settings!: Settings;

    constructor(
        private _settingsService: SettingsService,
        private _walletService: WalletService
    ) {}

    ngOnInit(): void {
        this.settings = this._settingsService.settings;
        this._initNetworks();

        this._settingsService.settings$.pipe(takeUntil(this.unsubscriber$)).subscribe((settings) => {
            if (!settings) return;

            this.settings = settings;
            this._initNetworks();
        });
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();

        // Save settings on destroy
        this._saveNetworks();
    }

    private _initNetworks(): void {
        // If networks are already saved in settings, use them
        if (this.settings.networks && this.settings.networks.length > 0) {
            // Merge with default networks in case new networks were added
            this.networks = DEFAULT_NETWORKS.map((defaultNetwork) => {
                const savedNetwork = this.settings.networks?.find((n) => n.id === defaultNetwork.id);
                return savedNetwork || defaultNetwork;
            });
        } else {
            // Use default networks
            this.networks = [...DEFAULT_NETWORKS];
        }
    }

    onNetworkToggle(network: NetworkConfig): void {
        network.enabled = !network.enabled;
        this._saveNetworks();
    }

    private _saveNetworks(): void {
        this.settings.networks = this.networks;
        this._settingsService.settings = this.settings;
    }

    getNetworkIcon(networkSymbol: string): string {
        return this._walletService.getAssetImage(networkSymbol);
    }
}
