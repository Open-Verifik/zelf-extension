import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, SimpleChanges } from "@angular/core";
import { UntypedFormGroup } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@ngneat/transloco";
import { CopyToClipboardBase } from "app/base/copy-to-clipboard/copy-to-clipboard.base";
import { ChromeService } from "app/chrome.service";
import { VaultService } from "app/vault.service";
import { Wallet, WalletModel } from "app/wallet";
import { ZelfNameService } from "app/zelf-name-service.service";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "mnemonic",
    standalone: true,
    imports: [CommonModule, TranslocoModule, MatInputModule, MatButtonModule, RouterModule],
    templateUrl: "./mnemonic.component.html",
    styleUrls: ["./mnemonic.component.scss"],
})
export class MnemonicComponent extends CopyToClipboardBase implements OnDestroy, OnChanges {
    @Input() wallet: Partial<Wallet> | Partial<WalletModel> | null = {};

    private unsubscriber$: Subject<void> = new Subject<void>();
    private _password: string = "";
    private _passwordIncorrectText: string = this._translocoService.translate("errors.password_incorrect");
    private _passwordIncorrectActionText: string = this._translocoService.translate("common.close");

    blurMnemonic: boolean = false;
    copied: boolean = false;
    words: string[] = ["apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew", "kiwi", "lemon", "mango", "nectarine"];
    passwordForm!: UntypedFormGroup;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _vaultService: VaultService,
        private _zelfNameService: ZelfNameService,
        protected _chromeService: ChromeService,
        protected _translocoService: TranslocoService,
        protected snackbar: MatSnackBar
    ) {
        super(_chromeService, snackbar, _translocoService);

        this._password = this._vaultService.password;

        this._vaultService.password$.pipe(takeUntil(this.unsubscriber$)).subscribe(() => {
            this._password = this._vaultService.password;

            if (this.wallet?.ethAddress) this._prepareWords();
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.wallet?.currentValue?.ethAddress) this._prepareWords();
    }

    ngOnDestroy(): void {
        this._vaultService.password = "";

        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    private async _decryptMessage(): Promise<any> {
        const encryptedMessage = this.wallet?.pgp?.encryptedMessage as string;
        const privateKeyArmoured = this.wallet?.pgp?.privateKey as string;
        const passphrase = this._password;

        if (!encryptedMessage || !privateKeyArmoured || !passphrase) return;

        return await this._vaultService.decryptMessage(encryptedMessage, privateKeyArmoured, passphrase);
    }

    async _prepareWords(): Promise<void> {
        if (!this._password || !this.wallet) return this.hideMnemonics();

        try {
            const decrypted = await this._decryptMessage();

            if (!decrypted) return this.hideMnemonics();

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

    hideMnemonics(): void {
        this._password = "";
        this.blurMnemonic = true;
        this.words = ["apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew", "kiwi", "lemon", "mango", "nectarine"];
    }

    async redirectToPassword(): Promise<void> {
        await this._zelfNameService.setFlow("unlock");

        this._router.navigate(["/security/password"], { queryParams: { return: "/welcome/complete" } });
    }
}
