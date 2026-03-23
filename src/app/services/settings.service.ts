import { Injectable } from "@angular/core";
import { mergeNetworkSettings, shouldPersistNetworkMerge } from "app/core/network-settings.util";
import { ChromeService } from "app/chrome.service";
import { Settings } from "app/models/settings.model";
import { VaultService } from "app/vault.service";
import { WalletService } from "app/wallet.service";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class SettingsService {
    private _settings$ = new BehaviorSubject<Settings>({} as Settings);
    private _settings: Settings = {} as Settings;

    constructor(
        private _chromeService: ChromeService,
        private _vaultService: VaultService,
        private _walletService: WalletService
    ) {
        this._settings = {
            security: {
                biometricVerificationInterval: 10,
                passwordAttempts: 4,
            },
        };

        this._chromeService.onSettingsChanged$.subscribe((settings) => {
            this._applySettingsFromStorage(settings);
        });

        this._chromeService.getItem("settings").then((settings) => {
            this._applySettingsFromStorage(settings);
        });
    }

    private _applySettingsFromStorage(raw: Settings | null | undefined): void {
        const hasRaw = raw && Object.keys(raw).length > 0;
        const base: Settings = hasRaw
            ? {
                  ...this._settings,
                  ...raw,
                  security: raw!.security ?? this._settings.security,
              }
            : this._settings;

        const mergedNetworks = mergeNetworkSettings(base.networks);
        const next: Settings = { ...base, networks: mergedNetworks };

        this._settings = next;
        this._settings$.next(this._settings);

        if (hasRaw && shouldPersistNetworkMerge(raw!.networks, mergedNetworks)) {
            void this._chromeService.setItem("settings", next);
        }
    }

    get settings$(): Observable<Settings> {
        return this._settings$.asObservable();
    }

    get settings(): Settings {
        return this._settings;
    }

    /**
     * Enabled chain ids for portfolio / history / send filters.
     * Returns undefined when networks are unset, or when every toggle is off — same as legacy "no filter" behavior.
     * (An empty array would otherwise make `getAddressData` skip every chain.)
     */
    getEnabledNetworkIds(): string[] | undefined {
        if (!this._settings?.networks?.length) return undefined;

        const ids = this._settings.networks.filter((n) => n.enabled).map((n) => n.id);

        return ids.length > 0 ? ids : undefined;
    }

    set settings(value: Settings) {
        const security = value.security ?? this._settings.security;

        if (this._settings.security.passwordAttempts !== security.passwordAttempts) {
            this._vaultService.passwordAttempts = security.passwordAttempts;
        }

        const mergedNetworks = mergeNetworkSettings(value.networks);
        const next: Settings = { ...value, security, networks: mergedNetworks };

        this._settings = next;
        this._chromeService.setItem("settings", next);
        this._settings$.next(this._settings);

        this._biometricsRequired();
    }

    private async _biometricsRequired(): Promise<void> {
        const lastVerified = await this._chromeService.getItem("lastVerified");

        // Force biometrics if someone has tampered with the lastVerified timestamp
        if (!lastVerified || this._vaultService.lastVerified !== lastVerified) {
            await this._walletService.clearPGPKeys();

            return;
        }

        const minutesSinceLastVerified = Math.floor((new Date().getTime() - new Date(lastVerified).getTime()) / (1000 * 60));

        if (minutesSinceLastVerified < (this._settings?.security?.biometricVerificationInterval || 10)) return;

        await this._walletService.clearPGPKeys();
    }
}
