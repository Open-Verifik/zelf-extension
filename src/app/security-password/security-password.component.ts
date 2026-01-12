import { debounceTime, Subject, takeUntil } from "rxjs";

import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, ReactiveFormsModule, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";

import { CaptchaService } from "app/captcha.service";
import { ChromeService } from "app/chrome.service";
import { PasswordStrengthComponent } from "app/password-strength/password-strength.component";
import { TagModel, TagsService } from "app/tags.service";
import { VaultService } from "app/vault.service";
import { ZelfFlow } from "app/zelf-name-service.service";

export type SecurityOption = "securePassword" | "pin" | "withoutPassword" | null;

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
    selectedSecurityOption: SecurityOption = null;
    pinStep: "create" | "confirm" | null = null;
    pinDigits: string[] = ["", "", "", "", "", ""];
    confirmPinDigits: string[] = ["", "", "", "", "", ""];
    pinInputs: HTMLInputElement[] = [];
    showPin: boolean = false;
    showConfirmPin: boolean = false;
    isPinUnlock: boolean = false;

    onInputFocus(event: Event): void {
        (event.target as HTMLInputElement).select();
    }

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _captchaService: CaptchaService,
        private _chromeService: ChromeService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _tagsService: TagsService,
        private _vaultService: VaultService
    ) {
        this._vaultService.password = "";

        this._initForm();

        this._activatedRoute.snapshot.queryParams?.return && (this.returnState = this._activatedRoute.snapshot.queryParams.return);

        this._activatedRoute.queryParams.pipe(takeUntil(this.unsubscriber$)).subscribe(async (params) => {
            params?.return && (this.returnState = params.return);
        });
    }

    async ngOnInit(): Promise<void> {
        this.flow = await this._tagsService.getFlow();

        this.tagName = (await this._tagsService.getTagName()) || (await this._tagsService.getNewTagName());
        this.domain = await this._tagsService.getDomain();
        this.tagModel = await this._tagsService.getTagNameObject();
        this.tagResponse = await this._tagsService.getTagResponse();

        this.isNew = this.flow === "create" || this.flow === "import" || (this.flow === "recover" && !this.tagModel?.available);

        // Security Type Detection for Unlock Flow
        if (!this.isNew && this.tagModel?.publicData) {
            const publicData = this.tagModel.publicData as any;

            // Handle No Password
            if (String(publicData.hasPassword) === "false") {
                this._vaultService.password = "NO_PASSWORD_PLACEHOLDER";
                this._vaultService.securityType = "withoutPassword";
                this._chromeService.setItem("noPasswordRequired", "true");
                this._navigateToBiometrics();
                return;
            }

            // Handle PIN
            if (publicData.st === "pin") {
                this.isPinUnlock = true;
                this.pinDigits = ["", "", "", "", "", ""];
            }
        }

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
            if (this.isPinUnlock) {
                // For PIN unlock, we don't need the password form validator
                this.form = this._formBuilder.group({});
            } else {
                this.form = this._formBuilder.group({
                    password: ["", [Validators.required]],
                });
            }

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
        if (this.isPinUnlock) {
            const pin = this.pinDigits.join("");
            if (pin.length !== 6) return;
            this._vaultService.password = pin;
            this._vaultService.securityType = "pin";
        } else {
            if (this.form.invalid) return;

            this._vaultService.password = this.form.get("password")?.value.trim();
            this._vaultService.securityType = "securePassword";
        }

        await this._generateCaptcha();

        this._router.navigate(["/security/biometrics"], { queryParams: { return: this.returnState } });
    }

    toggleShowPassword(): void {
        this.showPassword = !this.showPassword;
    }

    toggleShowPin(): void {
        this.showPin = !this.showPin;
    }

    toggleShowConfirmPin(): void {
        this.showConfirmPin = !this.showConfirmPin;
    }

    selectSecurityOption(option: SecurityOption): void {
        // Toggle: if clicking the same option, unselect it
        if (this.selectedSecurityOption === option) {
            this.selectedSecurityOption = null;
            this.pinStep = null;
        } else {
            this.selectedSecurityOption = option;
            if (option === "pin") {
                this.pinStep = "create";
                this.pinDigits = ["", "", "", "", "", ""];
                this.confirmPinDigits = ["", "", "", "", "", ""];
            } else {
                this.pinStep = null;
            }
        }
    }

    continueWithSelection(): void {
        if (!this.selectedSecurityOption) return;

        if (this.selectedSecurityOption === "securePassword") {
            // Validate form before continuing
            if (this.form.invalid) return;

            // Store password and security type, then navigate to biometrics
            this._vaultService.password = this.form.get("password")?.value.trim();
            this._vaultService.securityType = "securePassword";
            this._navigateToBiometrics();
        } else if (this.selectedSecurityOption === "pin") {
            // Handle PIN multi-step flow
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
                    const pin = this.pinDigits.join("").trim();
                    this._vaultService.password = pin;
                    this._vaultService.securityType = "pin";
                    this._navigateToBiometrics();
                }
            }
        } else if (this.selectedSecurityOption === "withoutPassword") {
            // Skip password, mark as no password required and go to biometrics
            // Set a placeholder password to satisfy any validation that expects a password field
            // The backend will ignore this based on securityType = "withoutPassword"
            this._vaultService.password = "NO_PASSWORD_PLACEHOLDER";
            this._vaultService.securityType = "withoutPassword";
            this._chromeService.setItem("noPasswordRequired", "true");
            this._navigateToBiometrics();
        }
    }

    private async _navigateToBiometrics(): Promise<void> {
        await this._generateCaptcha();
        this._router.navigate(["/security/biometrics"], { queryParams: { return: this.returnState } });
    }

    onPinInput(event: Event, index: number, isConfirm: boolean = false): void {
        const input = event.target as HTMLInputElement;
        const value = input.value; // Allow any character as requested (letters or numbers)

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
