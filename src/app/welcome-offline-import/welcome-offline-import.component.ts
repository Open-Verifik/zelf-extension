import { NgClass, NgIf, DatePipe, NgTemplateOutlet } from "@angular/common";
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ZelfNameService } from "app/zelf-name-service.service";
import { RouterLink } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";
import { WalletService } from "app/wallet.service";
import { ChromeService } from "app/chrome.service";
import { CaptchaService } from "app/captcha.service";
import { WelcomeAvailableContentComponent } from "app/welcome-available/welcome-available-content.component";
import { ZelfNamePipe } from "app/pipes/zelf-name.pipe";
import { WalletModel } from "app/wallet";

@Component({
    imports: [
        DatePipe,
        MatButtonModule,
        MatProgressSpinnerModule,
        NgClass,
        NgIf,
        NgTemplateOutlet,
        ReactiveFormsModule,
        RouterLink,
        TranslocoModule,
        WelcomeAvailableContentComponent,
        ZelfNamePipe,
    ],
    selector: "welcome-offline-import",
    styleUrls: ["./welcome-offline-import.component.scss"],
    templateUrl: "./welcome-offline-import.component.html",
})
export class WelcomeOfflineImportComponent {
    private _invalidTimeout!: ReturnType<typeof setTimeout>;
    private _showAvailable: boolean = false;
    private _showRegistered: boolean = false;

    form!: UntypedFormGroup;
    invalidReferral: boolean = false;
    loading: boolean = false;
    loadingReferral: boolean = false;
    qrCodeImage = "./assets/images/qr-preload.png";
    referralForm!: UntypedFormGroup;
    zelfNameObject: any;
    zelfName: string = "";

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _captchaService: CaptchaService,
        private _chromeService: ChromeService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _walletService: WalletService,
        private _zelfNameService: ZelfNameService
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

        if (value) {
            this._initReferralForm();
            this._showRegistered = false;
        } else {
            this.loading = false;
            this.loadingReferral = false;
            this.invalidReferral = false;
            this.zelfNameObject = null;
            this.qrCodeImage = "./assets/images/qr-preload.png";
        }
    }

    private _initForm(): void {
        this.form = this._formBuilder.group({
            zelfName: [
                "",
                [Validators.required, Validators.minLength(1), Validators.maxLength(26), Validators.pattern(this._walletService.ZelfRegexNoPostfix)],
            ],
        });
    }

    private _initReferralForm(): void {
        this.referralForm = this._formBuilder.group({
            referralName: ["", Validators.maxLength(26)],
            termsAndConditions: [false, Validators.requiredTrue],
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

    private _setInvalidReferral(): void {
        this.invalidReferral = true;

        this._invalidTimeout = setTimeout(() => {
            this.invalidReferral = false;
        }, 5000);
    }

    sanitizeZelfName(): void {
        const control = this.form.get("zelfName");

        if (!control) return;

        let sanitizedValue = control.value.replace(/[^a-zA-Z0-9.-]|^[^a-zA-Z]+|[.-]$/g, "");

        sanitizedValue = sanitizedValue.toUpperCase().trim();

        control.patchValue(sanitizedValue, { emitEvent: false });

        if (!sanitizedValue) control.markAsPristine();
    }

    clearInvalidReferral(): void {
        clearTimeout(this._invalidTimeout);

        this.invalidReferral = false;
    }

    async goToImport(): Promise<void> {
        await this._zelfNameService.setFlow("import");

        this._router.navigate(["../import"], { relativeTo: this._activatedRoute });
    }

    async searchZelfName(event: any): Promise<any> {
        if (!this.form.valid) {
            this.form.patchValue({ zelfName: "" });
            this.zelfName = "";

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
            .searchZelfNameV2("zelfName", zelfName, captchaToken)
            .then(async (response) => {
                this.zelfName = zelfName;

                if (response?.data.price) return await this._noZelfNameFound(response?.data);

                const zelfNameObject = new WalletModel(response.data.ipfs?.length ? response.data.ipfs[0] : response.data.arweave[0]);

                this.loading = false;

                this.zelfNameObject = zelfNameObject;
                this.qrCodeImage = zelfNameObject?.image || this.qrCodeImage;

                this.showRegistered = true;
            })
            .catch((exception) => {
                console.error({ exception });

                this.loading = false;
            });
    }

    async searchReferralZelfName(event: any): Promise<any> {
        const referralNameCtrl = this.referralForm.get("referralName");

        if (!referralNameCtrl) return;

        if (!referralNameCtrl.value || referralNameCtrl.invalid) {
            this.referralForm.patchValue({ zelfName: "" });
            this.referralForm.markAsPristine();
        }

        if (this.loading || this.loadingReferral || !referralNameCtrl?.dirty || !referralNameCtrl?.value) return;

        event.preventDefault();

        this.loadingReferral = true;

        const zelfName = referralNameCtrl.value
            ? referralNameCtrl.value.endsWith(".zelf")
                ? referralNameCtrl.value
                : `${referralNameCtrl.value}.zelf`
            : "";

        let captchaToken = "";

        if (!this._chromeService.isExtension) {
            try {
                const captchaKey = referralNameCtrl.value.replace(".", "_");

                captchaToken = await this._captchaService.executeRecaptcha(captchaKey);
            } catch (error) {
                console.error("reCAPTCHA failed:", error);
            }
        }

        this._zelfNameService
            .searchZelfNameV2("zelfName", zelfName, captchaToken)
            .then((response) => {
                if (response?.data.price) {
                    this.referralForm.patchValue({ referralName: "" });

                    this.referralForm.markAsPristine();

                    this.loadingReferral = false;

                    this._setInvalidReferral();

                    return;
                }

                this.referralForm.markAsPristine();

                this.zelfNameObject = new WalletModel(response.data.ipfs?.length ? response.data.ipfs[0] : response.data.arweave[0]);

                this._zelfNameService.setReferral(this.zelfNameObject.publicData.zelfName);

                this.loadingReferral = false;
            })
            .catch((exception) => {
                console.error({ exception });

                this.referralForm.patchValue({ referralName: "" });
                this.referralForm.markAsPristine();

                this.loadingReferral = false;
                this._setInvalidReferral();
            });
    }
}
