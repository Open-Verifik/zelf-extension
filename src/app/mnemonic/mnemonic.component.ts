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
import { WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";

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
    wallet: Partial<WalletModel> = {};
    requiresBiometrics: boolean = false;

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

        this.wallet = (await this._walletService.getCurrentWallet()) || {};
        this._vaultService.password = "";

        this._setRequiresBiometricsInterval();
    }

    ngOnDestroy(): void {
        this._clearRequiresBiometricsInterval();
    }

    get canUnlockWithPasswordOnly(): boolean {
        return !!this.wallet?.pgp?.encryptedMessage && !!this.wallet?.pgp?.privateKey && !this.requiresBiometrics;
    }

    private _clearRequiresBiometricsInterval(): void {
        if (!this._requiresBiometricsInterval) return;

        clearInterval(this._requiresBiometricsInterval as ReturnType<typeof setInterval>);
    }

    private async _decryptMessage(): Promise<any> {
        const encryptedMessage = this.wallet?.pgp?.encryptedMessage as string;
        const privateKeyArmoured = this.wallet?.pgp?.privateKey as string;
        const passphrase = this._password;

        if (!encryptedMessage || !privateKeyArmoured || !passphrase) return;

        return await this._vaultService.decryptMessage(encryptedMessage, privateKeyArmoured, passphrase);
    }

    private _initForm(): void {
        this.form = this._formBuilder.group({
            password: ["", { validators: [Validators.required] }],
        });
    }

    async _prepareWords(): Promise<void> {
        if (!this._password || !this.wallet) return this.hideMnemonics();

        try {
            const decrypted = await this._decryptMessage();

            if (!decrypted) return this.hideMnemonics();

            const fromJson = JSON.parse(decrypted);

            this._password = "";
            this.blurMnemonic = false;
            this.showPasswordForm = false;
            this.words = fromJson.mnemonic.split(" ");

            this._changeDetectorRef.detectChanges();
        } catch (error) {
            this.wallet = (await this._walletService.getCurrentWallet()) as WalletModel;
            this.remainingAttempts = this._vaultService.remainingAttempts + 1;
            this.passwordError = !!this.wallet?.pgp;

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
        this.showPasswordForm = true;

        this._initForm();
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
