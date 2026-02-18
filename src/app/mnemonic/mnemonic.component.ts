import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RouterModule } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { CopyToClipboardBase } from "app/base/copy-to-clipboard/copy-to-clipboard.base";
import { ChromeService } from "app/chrome.service";
import { VaultService } from "app/vault.service";
import { WalletService } from "app/wallet.service";
import { TagModel } from "app/tags.service";

@Component({
    imports: [CommonModule, TranslocoModule, MatInputModule, MatButtonModule, RouterModule, ReactiveFormsModule],
    selector: "mnemonic",
    styleUrls: ["./mnemonic.component.scss"],
    templateUrl: "./mnemonic.component.html",
})
export class MnemonicComponent extends CopyToClipboardBase implements OnInit, OnDestroy {
    @Output() redirect: EventEmitter<void> = new EventEmitter<void>();

    private _password: string = "";
    private _requiresBiometricsInterval: ReturnType<typeof setInterval> | null = null;

    blurMnemonic: boolean = true;
    copied: boolean = false;
    form!: UntypedFormGroup;
    passwordError: boolean = false;
    remainingAttempts: number = 0;
    showPassword: boolean = false;
    showPasswordForm: boolean = false;
    words: string[] = ["apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew", "kiwi", "lemon", "mango", "nectarine"];
    wallet: Partial<TagModel> = {};
    requiresBiometrics: boolean = false;
    pinDigits: string[] = ["", "", "", "", "", ""];
    showPin: boolean = false;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _vaultService: VaultService,
        private _walletService: WalletService,
        protected _chromeService: ChromeService,
        protected _translocoService: TranslocoService,
        protected _snackbar: MatSnackBar
    ) {
        super(_chromeService, _snackbar, _translocoService);

        this.remainingAttempts = this._vaultService.remainingAttempts + 1;

        this._initForm();
    }

    async ngOnInit(): Promise<void> {
        await this._chromeService.removeItem("parameters");
        await this._chromeService.removeItem("flow");

        this.wallet = (await this._walletService.getCurrentWallet()) || ({} as TagModel);
        this._vaultService.password = "";

        this._setRequiresBiometricsInterval();
    }

    ngOnDestroy(): void {
        this._clearRequiresBiometricsInterval();
    }

    get canUnlockWithPasswordOnly(): boolean {
        return !!this.wallet?.pgp?.encryptedMessage && !!this.wallet?.pgp?.privateKey && !this.requiresBiometrics;
    }

    get isPinMode(): boolean {
        const publicData = this.wallet?.publicData as { st?: string } | undefined;
        return publicData?.st === "pin";
    }

    private _clearRequiresBiometricsInterval(): void {
        if (!this._requiresBiometricsInterval) return;

        clearInterval(this._requiresBiometricsInterval as ReturnType<typeof setInterval>);
    }

    private async _decryptMessage(): Promise<any> {
        const encryptedMessage = this.wallet?.pgp?.encryptedMessage as string;
        const privateKeyArmoured = this.wallet?.pgp?.privateKey as string;
        const passphrase = this._password;

        if (!encryptedMessage || !privateKeyArmoured || passphrase === null || passphrase === undefined) return;

        return await this._vaultService.decryptMessage(encryptedMessage, privateKeyArmoured, passphrase);
    }

    private _initForm(): void {
        this.form = this._formBuilder.group({
            password: ["", { validators: [Validators.required] }],
        });
    }

    async _prepareWords(): Promise<void> {
        if (this._password === undefined || this._password === null || !this.wallet) return this.hideMnemonics();

        try {
            let decrypted;

            try {
                decrypted = await this._decryptMessage();
            } catch (error) {
                // For password-less wallets, NO_PASSWORD_PLACEHOLDER is the actual password
                // that was sent to the backend during wallet creation, so we don't retry
                // with a different password - we just propagate the error
                throw error;
            }

            if (!decrypted) return this.hideMnemonics();

            const fromJson = JSON.parse(decrypted);

            this._password = "";
            this.blurMnemonic = false;
            this.showPasswordForm = false;
            this.words = fromJson.mnemonic.split(" ");

            this._changeDetectorRef.detectChanges();
        } catch (error) {
            this.wallet = (await this._walletService.getCurrentWallet()) as TagModel;
            this.remainingAttempts = this._vaultService.remainingAttempts;
            this.passwordError = !!this.wallet?.pgp?.encryptedMessage && !!this.wallet?.pgp?.privateKey;

            this.hideMnemonics();
        }
    }

    private _setRequiresBiometricsInterval(): void {
        if (this._requiresBiometricsInterval) this._clearRequiresBiometricsInterval();

        this._requiresBiometricsInterval = setInterval(() => {
            this._vaultService.biometricsRequired().then((result) => (this.requiresBiometrics = result));
        }, 2000);
    }

    copyToClipboard(): void {
        this._copyToClipboard(this.words.join(" "), false).then(() => {
            this.copied = true;

            setTimeout(() => {
                this.copied = false;
            }, 3000);
        });
    }

    handleUnhide(): void {
        const publicData = this.wallet?.publicData as { hasPassword?: string; st?: string } | undefined;

        if (String(publicData?.hasPassword) === "false") {
            if (this.canUnlockWithPasswordOnly) {
                this._password = "NO_PASSWORD_PLACEHOLDER";
                this._prepareWords();
            } else {
                this._vaultService.password = "NO_PASSWORD_PLACEHOLDER";
                this._vaultService.securityType = "withoutPassword";
                this.redirect.emit();
            }

            return;
        }

        this.showPasswordForm = true;
        if (this.isPinMode) {
            this.pinDigits = ["", "", "", "", "", ""];
        } else {
            this._initForm();
        }
    }

    hideMnemonics(): void {
        this._password = "";
        this.blurMnemonic = true;
        this.words = ["apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew", "kiwi", "lemon", "mango", "nectarine"];
    }

    hidePasswordForm(): void {
        this.form.get("password")?.patchValue("");
        this.form.reset();
        this.showPasswordForm = false;
        this.passwordError = false;
        this.pinDigits = ["", "", "", "", "", ""];
    }

    canSubmitPin(): boolean {
        return this.pinDigits.every((d) => d !== "") && this.pinDigits.length === 6;
    }

    onPinInput(event: Event, index: number): void {
        const input = event.target as HTMLInputElement;
        const value = input.value;

        if (value.length > 1) {
            const digits = value.slice(0, 6).split("");
            this.pinDigits = [...digits, ...Array(6 - digits.length).fill("")].slice(0, 6);
            const lastIndex = Math.min(digits.length - 1, 5);
            setTimeout(() => {
                const inputs = document.querySelectorAll<HTMLInputElement>(".mnemonic__pin-input");
                if (inputs[lastIndex]) inputs[lastIndex].focus();
            }, 0);
            return;
        }

        this.pinDigits[index] = value;

        if (value && index < 5) {
            setTimeout(() => {
                const inputs = document.querySelectorAll<HTMLInputElement>(".mnemonic__pin-input");
                if (inputs[index + 1]) inputs[index + 1].focus();
            }, 0);
        }
    }

    onPinKeyDown(event: KeyboardEvent, index: number): void {
        const input = event.target as HTMLInputElement;

        if (event.key === "Enter") {
            if (!this.canSubmitPin()) return;

            event.preventDefault();

            this.submitPin();

            return;
        }

        if (event.key === "Backspace" && !input.value && index > 0) {
            setTimeout(() => {
                const inputs = document.querySelectorAll<HTMLInputElement>(".mnemonic__pin-input");
                if (inputs[index - 1]) {
                    inputs[index - 1].focus();
                    this.pinDigits[index - 1] = "";
                }
            }, 0);
        }
    }

    submitPin(): void {
        if (!this.canSubmitPin()) return;

        const pin = this.pinDigits.join("");

        if (this.canUnlockWithPasswordOnly) {
            this._password = pin;
            this._prepareWords();
            return;
        }

        this._vaultService.password = pin;
        this._vaultService.securityType = "pin";
        this.redirect.emit();
    }

    trackByIndex(index: number): number {
        return index;
    }

    submitPassword(): void {
        if (this.form.invalid) return;

        if (this.canUnlockWithPasswordOnly) {
            this._password = this.form.get("password")?.value;
            this._prepareWords();

            return;
        }

        this._vaultService.password = this.form.get("password")?.value;

        this.redirect.emit();
    }

    toggleShowPassword(): void {
        this.showPassword = !this.showPassword;
    }
}
