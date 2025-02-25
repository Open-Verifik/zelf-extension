import { CommonModule, NgIf } from "@angular/common";
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, NgForm, ReactiveFormsModule, UntypedFormGroup, Validators } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslocoModule, TranslocoService } from "@ngneat/transloco";
import { CopyToClipboardBase } from "app/base/copy-to-clipboard/copy-to-clipboard.base";
import { ChromeService } from "app/chrome.service";
import { VaultService } from "app/vault.service";
import { Wallet } from "app/wallet";

@Component({
    selector: "mnemonic",
    standalone: true,
    imports: [CommonModule, NgIf, TranslocoModule, ReactiveFormsModule, MatInputModule],
    templateUrl: "./mnemonic.component.html",
    styleUrls: ["./mnemonic.component.scss"],
})
export class MnemonicComponent extends CopyToClipboardBase implements OnInit, OnDestroy {
    @ViewChild("passwordForm") passwordFormRef!: NgForm;
    @Input() wallet!: Wallet;

    private _password: string = "";
    private _passwordIncorrectText: string = this._translocoService.translate("password_incorrect");
    private _passwordIncorrectActionText: string = this._translocoService.translate("common.close");

    blurMnemonic: boolean = false;
    copied: boolean = false;
    words: string[] = ["apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew", "kiwi", "lemon", "mango", "nectarine"];
    passwordForm!: UntypedFormGroup;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _vaultService: VaultService,
        protected _chromeService: ChromeService,
        protected _translocoService: TranslocoService,
        protected snackbar: MatSnackBar
    ) {
        super(_chromeService, snackbar, _translocoService);

        this._password = this._vaultService.password;

        this._initPasswordForm();
    }

    async ngOnInit(): Promise<void> {
        await this._prepareWords();
    }

    ngOnDestroy(): void {
        this._vaultService.password = "";
    }

    get showPassword(): boolean {
        return !this._password && this.blurMnemonic;
    }

    private async _decryptMessage(): Promise<any> {
        const encryptedMessage = this.wallet.pgp?.encryptedMessage as string;
        const privateKeyArmoured = this.wallet.pgp?.privateKey as string;
        const passphrase = this._password;

        return await this._vaultService.decryptMessage(encryptedMessage, privateKeyArmoured, passphrase);
    }

    private _initPasswordForm(): void {
        this.passwordForm = this._formBuilder.group({
            password: [this._password || "", Validators.required],
        });
    }

    async _prepareWords(): Promise<void> {
        if (!this._password) {
            this.blurMnemonic = true;
            this._initPasswordForm();

            return;
        }

        try {
            const decrypted = await this._decryptMessage();
            const fromJson = JSON.parse(decrypted);

            this.words = fromJson.mnemonic.split(" ");
            this.blurMnemonic = false;

            this._password = "";
            this._changeDetectorRef.detectChanges();
        } catch (error) {
            this._snackBar.open(this._passwordIncorrectText, this._passwordIncorrectActionText, {
                duration: 5000,
                panelClass: "zelf-snackbar",
                verticalPosition: "top",
            });

            this.blurMnemonic = true;
            this._password = "";
            this.passwordForm.reset();
        }
    }

    copyToClipboard(): void {
        this._copyToClipboard(this.words.join(" "), false).then(() => {
            this.copied = true;

            setTimeout(() => {
                this.copied = false;
            }, 3000);
        });
    }

    onSubmit(): void {
        if (!this.passwordForm.valid) return;

        this._password = this.passwordForm.value.password;
        this._prepareWords();
    }
}
