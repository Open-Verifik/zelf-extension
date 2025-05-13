import { Injectable } from "@angular/core";
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
            this._settings = settings && Object.keys(settings).length ? settings : this._settings;
            this._settings$.next(this._settings);
        });

        this._chromeService.getItem("settings").then((settings) => {
            this._settings = settings && Object.keys(settings).length ? settings : this._settings;
            this._settings$.next(this._settings);
        });
    }

    get settings$(): Observable<Settings> {
        return this._settings$.asObservable();
    }

    get settings(): Settings {
        return this._settings;
    }

    set settings(value: Settings) {
        if (this._settings.security.passwordAttempts !== value.security.passwordAttempts) {
            this._vaultService.passwordAttempts = value.security.passwordAttempts;
        }

        this._settings = value;
        this._chromeService.setItem("settings", value);

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
