import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { RouterModule } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";
import { CaptchaService } from "app/captcha.service";
import { ChromeService } from "app/chrome.service";
import { DiscountType } from "app/pipes/discount.pipe";
import { ZelfNameService } from "app/zelf-name-service.service";

@Component({
    selector: "welcome-available",
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatProgressSpinnerModule, TranslocoModule, MatButtonModule, RouterModule],
    templateUrl: "./welcome-available.component.html",
    styleUrls: ["./welcome-available.component.scss"],
})
export class WelcomeAvailableComponent implements OnInit, OnDestroy {
    private _invalidTimeout!: ReturnType<typeof setTimeout>;

    discount: number = 0;
    discountType: DiscountType = "";
    form!: UntypedFormGroup;
    loading: boolean = false;
    loadingReferral: boolean = false;
    invalidReferral: boolean = false;
    zelfName: string = "";
    zelfNameObject: any;

    constructor(
        private _captchaService: CaptchaService,
        private _chromeService: ChromeService,
        private _formBuilder: FormBuilder,
        private _zelfNameService: ZelfNameService
    ) {
        this._initForm();
    }

    async ngOnInit(): Promise<void> {
        this.zelfName = await this._zelfNameService.getZelfName();
    }

    ngOnDestroy(): void {
        clearTimeout(this._invalidTimeout);
    }

    private _initForm(): void {
        this.form = this._formBuilder.group({
            referralName: ["", Validators.maxLength(27)],
            termsAndConditions: [false, Validators.requiredTrue],
        });
    }

    private _setInvalidReferral(): void {
        this.invalidReferral = true;

        this._invalidTimeout = setTimeout(() => {
            this.invalidReferral = false;
        }, 5000);
    }

    clearInvalidReferral(): void {
        clearTimeout(this._invalidTimeout);

        this.invalidReferral = false;
    }

    sanitizeZelfName(): void {
        this.clearInvalidReferral();

        const referralNameCtrl = this.form.get("referralName");

        if (!referralNameCtrl) return;

        const sanitizedValue = referralNameCtrl.value
            .replace(/[^a-zA-Z0-9.-]|^[^a-zA-Z]+|[.-]$/g, "")
            .toLowerCase()
            .trim();

        referralNameCtrl.patchValue(sanitizedValue, { emitEvent: false });

        if (!sanitizedValue) referralNameCtrl.markAsPristine();
    }

    async searchZelfName(event: any): Promise<any> {
        const referralNameCtrl = this.form.get("referralName");

        if (!referralNameCtrl) return;

        if (!referralNameCtrl.value || referralNameCtrl.invalid) {
            this.form.patchValue({ zelfName: "" });
            this.form.markAsPristine();
        }

        if (this.loading || this.loadingReferral || !referralNameCtrl?.dirty || !referralNameCtrl?.value) return;

        event.preventDefault();

        this.loadingReferral = true;

        const zelfName = `${referralNameCtrl.value}.zelf`;

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
            .searchZelfName("zelfName", zelfName, captchaToken)
            .then((response) => {
                if (response?.data.price) {
                    this.form.patchValue({ referralName: "" });
                    this.form.markAsPristine();

                    this.loadingReferral = false;
                    this._setInvalidReferral();

                    return;
                }

                this.form.markAsPristine();

                this.zelfNameObject = response.data.ipfs?.length ? response.data.ipfs[0] : response.data.arweave[0];

                this._zelfNameService.setReferral(this.zelfNameObject.zelfName);

                this.loadingReferral = false;
            })
            .catch((exception) => {
                console.error({ exception });

                this.form.patchValue({ referralName: "" });
                this.form.markAsPristine();

                this.loadingReferral = false;
                this._setInvalidReferral();
            });
    }
}
