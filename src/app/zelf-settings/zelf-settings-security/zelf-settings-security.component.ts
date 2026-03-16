import { NgClass, NgIf } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from "@angular/forms";
import { TranslocoModule } from "@jsverse/transloco";
import { MatButtonModule } from "@angular/material/button";
import { ChromeService } from "app/chrome.service";
import { Settings } from "app/models/settings.model";
import { SettingsService } from "app/services/settings.service";
import { VaultService } from "app/vault.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

export type VaultStatus = "active" | "locked" | "empty" | null;

@Component({
    imports: [ReactiveFormsModule, TranslocoModule, NgClass, NgIf, MatButtonModule],
    selector: "zelf-settings-security",
    styleUrls: ["./zelf-settings-security.component.scss"],
    templateUrl: "./zelf-settings-security.component.html",
})
export class ZelfSettingsSecurityComponent implements OnInit, OnDestroy {
    private unsubscriber$: Subject<void> = new Subject<void>();
    private _sessionIntervalId: ReturnType<typeof setInterval> | null = null;

    form!: UntypedFormGroup;
    settings!: Settings;
    vaultStatus: VaultStatus = null;
    sessionRemainingSeconds = 0;
    sessionTotalSeconds = 0;

    constructor(
        private _chromeService: ChromeService,
        private _formBuilder: FormBuilder,
        private _settingsService: SettingsService,
        private _vaultService: VaultService
    ) {
        this.settings = this._settingsService.settings;

        this._settingsService.settings$.pipe(takeUntil(this.unsubscriber$)).subscribe((settings) => {
            if (!settings) return;

            this.settings = settings;
        });

        this._initForm();
    }

    async ngOnInit(): Promise<void> {
        await this._updateVaultStatus();
    }

    ngOnDestroy(): void {
        this._clearSessionInterval();
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
        this._settingsService.settings = this.settings;
    }

    get sessionRemainingMinutes(): number {
        return Math.max(1, Math.ceil(this.sessionRemainingSeconds / 60));
    }

    get sessionProgressPercent(): number {
        if (this.sessionTotalSeconds <= 0) return 100;
        return Math.max(0, (this.sessionRemainingSeconds / this.sessionTotalSeconds) * 100);
    }

    private _clearSessionInterval(): void {
        if (this._sessionIntervalId !== null) {
            clearInterval(this._sessionIntervalId);
            this._sessionIntervalId = null;
        }
    }

    private _updateSessionRemaining(): void {
        const intervalMinutes = this.settings.security.biometricVerificationInterval;
        this.sessionTotalSeconds = intervalMinutes * 60;
        const lastVerified = this._vaultService.lastVerified;
        const elapsedSeconds = (Date.now() - lastVerified) / 1000;
        this.sessionRemainingSeconds = Math.max(0, this.sessionTotalSeconds - elapsedSeconds);

        if (this.sessionRemainingSeconds <= 0) {
            this._clearSessionInterval();
            this._updateVaultStatus();
        }
    }

    async _updateVaultStatus(): Promise<void> {
        const wallet = await this._chromeService.getItem("wallet");
        const wallets = await this._chromeService.getItem("wallets");
        const hasWalletData = Boolean(
            (wallet && (wallet as any).fullTagName) || (Array.isArray(wallets) && wallets.length > 0)
        );

        if (!hasWalletData) {
            this.vaultStatus = "empty";
            return;
        }

        const biometricsRequired = await this._vaultService.biometricsRequired();

        this._clearSessionInterval();

        if (biometricsRequired) {
            this.vaultStatus = "locked";
        } else {
            this.vaultStatus = "active";
            this._updateSessionRemaining();
            this._sessionIntervalId = setInterval(() => this._updateSessionRemaining(), 1000);
        }
    }

    async lockVault(): Promise<void> {
        await this._vaultService.lockVault();
        await this._updateVaultStatus();
    }

    private _initForm(): void {
        this.form = this._formBuilder.group({
            biometricVerificationInterval: [
                this.settings.security.biometricVerificationInterval,
                [Validators.required, Validators.min(5), Validators.max(60)],
            ],
            passwordAttempts: [this.settings.security.passwordAttempts, [Validators.required, Validators.min(1), Validators.max(8)]],
        });

        this.form.valueChanges.pipe(takeUntil(this.unsubscriber$)).subscribe((value) => {
            if (!this.form.valid) return;

            this.settings.security.biometricVerificationInterval = value.biometricVerificationInterval;
            this.settings.security.passwordAttempts = value.passwordAttempts;

            this._settingsService.settings = this.settings;
        });
    }
}
