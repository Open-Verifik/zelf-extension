import { debounceTime, Subject, takeUntil } from "rxjs";

import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, ReactiveFormsModule, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";

import { CaptchaService } from "app/captcha.service";
import { ChromeService } from "app/chrome.service";
import { VaultService } from "app/vault.service";
import { ZelfFlow, ZelfNameService } from "app/zelf-name-service.service";
import { WalletModel } from "app/wallet";
import { PasswordStrengthComponent } from "password-strength/password-strength.component";

@Component({
    imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslocoModule, MatButtonModule, PasswordStrengthComponent],
    selector: "security-password",
    styleUrls: ["./security-password.component.scss"],
    templateUrl: "./security-password.component.html",
})
export class SecurityPasswordComponent implements OnInit, OnDestroy {
    private unsubscriber$: Subject<void> = new Subject<void>();

    form!: UntypedFormGroup;
    flow: ZelfFlow = "";
    isNew: boolean = false;
    returnState: string = "";
    showPassword: boolean = false;
    zelfNameObject: any;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _captchaService: CaptchaService,
        private _chromeService: ChromeService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _vaultService: VaultService,
        private _zelfNameService: ZelfNameService
    ) {
        this._vaultService.password = "";

        this._initForm();

        this._activatedRoute.snapshot.queryParams?.return && (this.returnState = this._activatedRoute.snapshot.queryParams.return);

        this._activatedRoute.queryParams.pipe(takeUntil(this.unsubscriber$)).subscribe(async (params) => {
            params?.return && (this.returnState = params.return);
        });
    }

    async ngOnInit(): Promise<void> {
        this.flow = await this._zelfNameService.getFlow();
        this.zelfNameObject = new WalletModel(await this._zelfNameService.getZelfNameObject());

        this.isNew = this.flow === "create" || this.flow === "import" || (this.flow === "recover" && !this.zelfNameObject?.available);

        this._initForm();
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    private _compareToValidator(matchTo: string): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            return control.value !== control.parent?.get(matchTo)?.value ? { compareTo: true } : null;
        };
    }

    private async _generateCaptcha(): Promise<void> {
        if (this._chromeService.isExtension) return;

        const generateCaptchaNow = await this._chromeService.getItem("hideBiometricsMessage");

        if (!generateCaptchaNow) return;

        const zelfName = await this._zelfNameService.getZelfName();

        try {
            const captchaKey = zelfName.split(".zelf")[0].replace(".", "_");
            const captchaToken = await this._captchaService.executeRecaptcha(captchaKey);

            this._captchaService.retainCaptchaToken(captchaToken);
        } catch (error) {
            console.error("reCAPTCHA failed:", { error });
        }
    }

    private _initForm(): void {
        if (!this.isNew) {
            this.form = this._formBuilder.group({
                password: ["", [Validators.required]],
            });

            return;
        }

        this.form = this._formBuilder.group({
            password: ["", [Validators.required, Validators.minLength(8)]],
            confirmPassword: ["", [Validators.required, this._compareToValidator("password")]],
            passwordStrength: [0, [Validators.required, Validators.min(1)]],
        });

        this.form.valueChanges.pipe(takeUntil(this.unsubscriber$), debounceTime(500)).subscribe(() => {
            if (!this.form.get("confirmPassword")?.dirty) return;
            this.form.get("confirmPassword")?.updateValueAndValidity();
        });
    }

    goBack(): void {
        if (this.returnState) {
            this._router.navigate([this.returnState], { queryParams: { return: this.returnState } });
        } else {
            if (this.flow === "create") this._router.navigate(["../"], { relativeTo: this._activatedRoute });
            else if (this.flow === "import") this._router.navigate(["/welcome/import"]);
            else if (this.flow === "unlock") this._router.navigate(["/welcome/registered"]);
            else this._router.navigate(["/welcome/registered"]);
        }
    }

    async storePassword(): Promise<void> {
        if (this.form.invalid) return;

        this._vaultService.password = this.form.get("password")?.value.trim();

        await this._generateCaptcha();

        this._router.navigate(["/security/biometrics"], { queryParams: { return: this.returnState } });
    }

    toggleShowPassword(): void {
        this.showPassword = !this.showPassword;
    }
}
