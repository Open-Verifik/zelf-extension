import { NgClass } from "@angular/common";
import { Component, OnDestroy } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from "@angular/forms";
import { TranslocoModule } from "@jsverse/transloco";
import { Settings } from "app/models/settings.model";
import { SettingsService } from "app/services/settings.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    imports: [ReactiveFormsModule, TranslocoModule, NgClass],
    selector: "zelf-settings-security",
    styleUrls: ["./zelf-settings-security.component.scss"],
    templateUrl: "./zelf-settings-security.component.html",
})
export class ZelfSettingsSecurityComponent implements OnDestroy {
    private unsubscriber$: Subject<void> = new Subject<void>();

    form!: UntypedFormGroup;
    settings!: Settings;

    constructor(
        private _settingsService: SettingsService,
        private _formBuilder: FormBuilder
    ) {
        this.settings = this._settingsService.settings;

        this._settingsService.settings$.pipe(takeUntil(this.unsubscriber$)).subscribe((settings) => {
            if (!settings) return;

            this.settings = settings;
        });

        this._initForm();
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();

        this._settingsService.settings = this.settings;
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
