import { NgIf } from "@angular/common";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ZelfNameService } from "app/zelf-name-service.service";
import { RouterLink } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";
import { WalletService } from "app/wallet.service";
import { ChromeService } from "app/chrome.service";
import { CaptchaService } from "app/captcha.service";

@Component({
    imports: [TranslocoModule, MatButtonModule, RouterLink, ReactiveFormsModule, MatProgressSpinnerModule, NgIf],
    selector: "welcome-offline-import",
    standalone: true,
    styleUrls: ["./welcome-offline-import.component.scss"],
    templateUrl: "./welcome-offline-import.component.html",
})
export class WelcomeOfflineImportComponent {
    private _showAvailable: boolean = false;
    private _showRegistered: boolean = false;

    form!: UntypedFormGroup;
    loading: boolean = false;

    constructor(
        private _formBuilder: FormBuilder,
        private _walletService: WalletService,
        private _zelfNameService: ZelfNameService,
        private _chromeService: ChromeService,
        private _captchaService: CaptchaService,
        private _router: Router
    ) {}

    ngOnInit(): void {
        this._initForm();
    }

    get showRegistered(): boolean {
        return this._showRegistered;
    }

    set showRegistered(value: boolean) {
        this._showRegistered = value;

        if (value) this._showAvailable = false;
    }

    get showAvailable(): boolean {
        return this._showAvailable;
    }

    set showAvailable(value: boolean) {
        this._showAvailable = value;

        if (value) this._showAvailable = false;
    }

    private _initForm(): void {
        this.form = this._formBuilder.group({
            zelfName: [
                "",
                [Validators.required, Validators.minLength(1), Validators.maxLength(26), Validators.pattern(this._walletService.ZelfRegex)],
            ],
        });
    }

    private async _noZelfNameFound(zelfNameObject: any): Promise<void> {
        await this._zelfNameService.setZelfName(zelfNameObject.zelfName, zelfNameObject);
        await this._zelfNameService.setZelfNameObject(zelfNameObject);

        this.form.clearValidators();
        this.form.reset({ zelfName: "" });

        this.loading = false;
        this.showAvailable = true;
    }

    async searchZelfName(event: any): Promise<any> {
        if (!this.form.valid) {
            this.form.patchValue({ zelfName: "" });

            return;
        }

        if (this.loading) return;

        event.preventDefault();

        this.loading = true;

        const zelfName = `${this.form.value.zelfName}.zelf`;

        let captchaToken = "";

        if (!this._chromeService.isExtension) {
            try {
                const captchaKey = this.form.value.zelfName.replace(".", "_");

                captchaToken = await this._captchaService.executeRecaptcha(captchaKey);
            } catch (error) {
                console.error("reCAPTCHA failed:", error);
            }
        }

        this._zelfNameService
            .searchZelfName("zelfName", zelfName, captchaToken)
            .then(async (response) => {
                if (response?.data.price) return await this._noZelfNameFound(response?.data);

                const zelfNameObject = response.data.ipfs?.length ? response.data.ipfs[0] : response.data.arweave[0];

                await this._zelfNameService.setZelfName(zelfName, { price: 0, reward: 0 });
                await this._zelfNameService.setZelfNameObject(zelfNameObject);

                this.loading = false;

                this.showRegistered = true;
            })
            .catch((exception) => {
                console.error({ exception });

                this.loading = false;
            });
    }

    sanitizeZelfName(): void {
        const control = this.form.get("zelfName");

        if (!control) return;

        let sanitizedValue = control.value.replace(/[^a-zA-Z0-9.-]|^[^a-zA-Z]+|[.-]$/g, "");

        sanitizedValue = sanitizedValue.toLowerCase().trim();

        control.patchValue(sanitizedValue, { emitEvent: false });

        if (!sanitizedValue) control.markAsPristine();
    }
}
