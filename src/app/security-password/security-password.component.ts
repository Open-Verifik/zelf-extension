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
import { ZelfFlow } from "app/zelf-name-service.service";
import { PasswordStrengthComponent } from "password-strength/password-strength.component";
import { TagModel, TagsService } from "app/tags.service";

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
    tagName: string = "";
    domain: string = "";
    tagModel: TagModel = new TagModel();
    tagResponse: any;
    selectedSecurityOption: "securePassword" | "pin" | "withoutPassword" | null = null;
    pinStep: "create" | "confirm" | null = null;
    pinDigits: string[] = ["", "", "", "", "", ""];
    confirmPinDigits: string[] = ["", "", "", "", "", ""];
    pinInputs: HTMLInputElement[] = [];

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _captchaService: CaptchaService,
        private _chromeService: ChromeService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _vaultService: VaultService,
        private _tagsService: TagsService
    ) {
        this._vaultService.password = "";

        this._initForm();

        this._activatedRoute.snapshot.queryParams?.return && (this.returnState = this._activatedRoute.snapshot.queryParams.return);

        this._activatedRoute.queryParams.pipe(takeUntil(this.unsubscriber$)).subscribe(async (params) => {
            params?.return && (this.returnState = params.return);
        });
    }

    async ngOnInit(): Promise<void> {
        // this.flow = await this._zelfNameService.getFlow();
        this.flow = await this._tagsService.getFlow();

        this.tagName = await this._tagsService.getTagName();
        this.domain = await this._tagsService.getDomain();
        this.tagModel = await this._tagsService.getTagNameObject();
        this.tagResponse = await this._tagsService.getTagResponse();

        this.isNew = this.flow === "create" || this.flow === "import" || (this.flow === "recover" && !this.tagModel?.available);

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

        const tagName = await this._tagsService.getTagName();

        try {
            const captchaKey = tagName.split(".zelf")[0].replace(".", "_");
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

    selectSecurityOption(option: "securePassword" | "pin" | "withoutPassword"): void {
        this.selectedSecurityOption = option;
    }

    continueWithSelection(): void {
        if (!this.selectedSecurityOption) return;

        if (this.selectedSecurityOption === "withoutPassword") {
            // Skip password, mark as no password required and go to biometrics
            this._vaultService.password = "";
            // Store flag that no password is required
            this._chromeService.setItem("noPasswordRequired", "true");
            this._navigateToBiometrics();
        } else if (this.selectedSecurityOption === "pin") {
            // Start PIN creation flow
            this.pinStep = "create";
            this.pinDigits = ["", "", "", "", "", ""];
            this.confirmPinDigits = ["", "", "", "", "", ""];
            // Focus first input after view updates
            setTimeout(() => {
                const inputs = this._getPinInputs();
                if (inputs[0]) inputs[0].focus();
            }, 0);
        } else if (this.selectedSecurityOption === "securePassword") {
            // Show the secure password form (already handled in template)
            // Form is already initialized in _initForm() for isNew
            // Form submission will call storePassword()
        }
    }

    private async _navigateToBiometrics(): Promise<void> {
        await this._generateCaptcha();
        this._router.navigate(["/security/biometrics"], { queryParams: { return: this.returnState } });
    }

    onPinInput(event: Event, index: number, isConfirm: boolean = false): void {
        const input = event.target as HTMLInputElement;
        const value = input.value.replace(/\D/g, ""); // Only allow numbers

        if (value.length > 1) {
            // If multiple digits pasted, handle accordingly
            const digits = value.slice(0, 6).split("");
            if (isConfirm) {
                this.confirmPinDigits = [...digits, ...Array(6 - digits.length).fill("")].slice(0, 6);
            } else {
                this.pinDigits = [...digits, ...Array(6 - digits.length).fill("")].slice(0, 6);
            }
            // Focus the last filled input or the next empty one
            const lastIndex = Math.min(digits.length - 1, 5);
            setTimeout(() => {
                const inputs = isConfirm ? this._getConfirmInputs() : this._getPinInputs();
                if (inputs[lastIndex]) inputs[lastIndex].focus();
            }, 0);
            return;
        }

        if (isConfirm) {
            this.confirmPinDigits[index] = value;
        } else {
            this.pinDigits[index] = value;
        }

        // Move to next input if value entered
        if (value && index < 5) {
            setTimeout(() => {
                const inputs = isConfirm ? this._getConfirmInputs() : this._getPinInputs();
                if (inputs[index + 1]) inputs[index + 1].focus();
            }, 0);
        }
    }

    onPinKeyDown(event: KeyboardEvent, index: number, isConfirm: boolean = false): void {
        const input = event.target as HTMLInputElement;

        if (event.key === "Backspace" && !input.value && index > 0) {
            // Move to previous input on backspace if current is empty
            setTimeout(() => {
                const inputs = isConfirm ? this._getConfirmInputs() : this._getPinInputs();
                if (inputs[index - 1]) {
                    inputs[index - 1].focus();
                    if (isConfirm) {
                        this.confirmPinDigits[index - 1] = "";
                    } else {
                        this.pinDigits[index - 1] = "";
                    }
                }
            }, 0);
        }
    }

    private _getPinInputs(): HTMLInputElement[] {
        return Array.from(document.querySelectorAll<HTMLInputElement>(".security-password__pin-input"));
    }

    private _getConfirmInputs(): HTMLInputElement[] {
        return Array.from(document.querySelectorAll<HTMLInputElement>(".security-password__pin-confirm-input"));
    }

    canContinuePin(): boolean {
        if (this.pinStep === "create") {
            return this.pinDigits.every((digit) => digit !== "") && this.pinDigits.length === 6;
        } else if (this.pinStep === "confirm") {
            return (
                this.confirmPinDigits.every((digit) => digit !== "") &&
                this.confirmPinDigits.length === 6 &&
                this.confirmPinDigits.join("") === this.pinDigits.join("")
            );
        }
        return false;
    }

    continuePin(): void {
        if (this.pinStep === "create") {
            if (this.canContinuePin()) {
                this.pinStep = "confirm";
                this.confirmPinDigits = ["", "", "", "", "", ""];
                // Focus first confirm input
                setTimeout(() => {
                    const inputs = this._getConfirmInputs();
                    if (inputs[0]) inputs[0].focus();
                }, 0);
            }
        } else if (this.pinStep === "confirm") {
            if (this.canContinuePin()) {
                // PIN confirmed, save and continue
                const pin = this.pinDigits.join("");
                this._vaultService.password = pin;
                this._navigateToBiometrics();
            }
        }
    }

    goBackFromPin(): void {
        if (this.pinStep === "confirm") {
            this.pinStep = "create";
            this.confirmPinDigits = ["", "", "", "", "", ""];
        } else {
            this.pinStep = null;
            this.pinDigits = ["", "", "", "", "", ""];
            this.selectedSecurityOption = null;
        }
    }

    trackByIndex(index: number): number {
        return index;
    }
}
