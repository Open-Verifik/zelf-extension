import { NgClass, NgFor, NgIf } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { TranslocoModule } from "@jsverse/transloco";
import { DomainLicense, DomainWallet } from "app/core/models/domain.type";
import { DEFAULT_NETWORK_CONFIGS, NETWORK_IDS_ENSURED_FROM_LICENSE_GAP } from "app/core/network-settings.util";
import { DomainService } from "app/domain.service";
import { NetworkConfig, Settings } from "app/models/settings.model";
import { SettingsService } from "app/services/settings.service";
import { WalletService } from "app/wallet.service";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    imports: [NgFor, NgIf, NgClass, FormsModule, MatSlideToggleModule, TranslocoModule, ZelfLoaderComponent],
    selector: "zelf-settings-networks",
    styleUrls: ["./zelf-settings-networks.component.scss"],
    templateUrl: "./zelf-settings-networks.component.html",
})
export class ZelfSettingsNetworksComponent implements OnInit, OnDestroy {
    private unsubscriber$: Subject<void> = new Subject<void>();
    private _licenseWalletNetworks: DomainWallet["networks"] | null = null;

    loading = true;
    networks: NetworkConfig[] = [];
    settings!: Settings;

    constructor(
        private _domainService: DomainService,
        private _settingsService: SettingsService,
        private _walletService: WalletService
    ) {}

    async ngOnInit(): Promise<void> {
        this.settings = this._settingsService.settings;

        await this._fetchLicenseNetworks();
        this._initNetworks();

        this._settingsService.settings$.pipe(takeUntil(this.unsubscriber$)).subscribe((settings) => {
            if (!settings) return;

            this.settings = settings;
            this._initNetworks();
        });

        this.loading = false;
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();

        // Save settings on destroy
        this._saveNetworks();
    }

    /**
     * Fetch the license for the current wallet's domain to get allowed networks
     */
    private async _fetchLicenseNetworks(): Promise<void> {
        try {
            const wallet = await this._walletService.getCurrentWallet();
            const domain = wallet?.domain || wallet?.publicData?.domain || "zelf";

            // Fetch fresh license data from API
            const response = await this._domainService.getDomains();

            if (response?.data && response.data[domain]) {
                const license: DomainLicense = response.data[domain];
                this._licenseWalletNetworks = license.tags?.wallet?.networks || null;
            }
        } catch (error) {
            console.error("Error fetching license networks:", error);
            this._licenseWalletNetworks = null;
        }
    }

    /**
     * Get the list of networks allowed by the license
     */
    private _getAllowedNetworkIds(): string[] | null {
        if (!this._licenseWalletNetworks) return null;

        const allowedIds: string[] = [];

        for (const [networkId, config] of Object.entries(this._licenseWalletNetworks)) {
            if (config && config.enabled) {
                allowedIds.push(networkId);
            }
        }

        return allowedIds.length > 0 ? allowedIds : null;
    }

    private _initNetworks(): void {
        let allowedNetworkIds = this._getAllowedNetworkIds();

        if (allowedNetworkIds) {
            const missing = NETWORK_IDS_ENSURED_FROM_LICENSE_GAP.filter((id) => !allowedNetworkIds!.includes(id));
            if (missing.length) {
                allowedNetworkIds = [...allowedNetworkIds, ...missing];
            }
        }

        // Filter default networks based on license if available
        let availableNetworks = DEFAULT_NETWORK_CONFIGS;

        if (allowedNetworkIds) {
            availableNetworks = DEFAULT_NETWORK_CONFIGS.filter((network) => allowedNetworkIds.includes(network.id));
        }

        // If networks are already saved in settings, use them (but only those allowed by license)
        if (this.settings.networks && this.settings.networks.length > 0) {
            this.networks = availableNetworks.map((defaultNetwork) => {
                const savedNetwork = this.settings.networks?.find((n) => n.id === defaultNetwork.id);
                return savedNetwork || defaultNetwork;
            });
        } else {
            // Use available networks
            this.networks = [...availableNetworks];
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
