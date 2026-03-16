import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import * as bip39 from "bip39";
import { VaultService } from "app/vault.service";
import { WelcomeErrorComponent } from "app/welcome-error/welcome-error.component";

/** Valid BIP-39 mnemonic word counts */
const VALID_MNEMONIC_LENGTHS = [12, 15, 18, 21, 24] as const;

@Component({
    imports: [CommonModule, ReactiveFormsModule, MatButtonModule, TranslocoModule, WelcomeErrorComponent, RouterModule],
    selector: "welcome-import",
    styleUrls: ["./welcome-import.component.scss"],
    templateUrl: "./welcome-import.component.html",
})
export class WelcomeImportComponent implements OnInit {
    errorMessage: string = "";
    errorTitle: string = "";
    loading: boolean = false;
    mnemonicCount: (typeof VALID_MNEMONIC_LENGTHS)[number] = 12;
    readonly validMnemonicLengths = VALID_MNEMONIC_LENGTHS;
    mnemonicCountForm!: UntypedFormGroup;
    mnemonicForm!: UntypedFormGroup;
    showWords: boolean = false;

    constructor(
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _snackbar: MatSnackBar,
        private _translocoService: TranslocoService,
        private _vaultService: VaultService
    ) {}

    async ngOnInit(): Promise<void> {
        this._initForm();

        this.loading = false;
    }

    private _initForm(): void {
        this.mnemonicCountForm = this._formBuilder.group({
            mnemonicCount: [this.mnemonicCount],
        });

        this.mnemonicCountForm.get("mnemonicCount")!.valueChanges.subscribe((value) => {
            this.mnemonicCount = value;

            this._initWordsForm();
        });

        this._initWordsForm();
    }

    private _initWordsForm(): void {
        const inputMap = {} as any;

        for (let i = 0; i < this.mnemonicCount; i++) {
            inputMap[`word${i + 1}`] = ["", [Validators.required, Validators.minLength(1), Validators.pattern(/^[a-zA-Z]+$/)]];
        }

        this.mnemonicForm = this._formBuilder.group(inputMap);
    }

    formControlKeys(form: UntypedFormGroup): string[] {
        return Object.keys(form.controls);
    }

    isWordInvalid(key: string): boolean {
        const value = this.mnemonicForm.get(key)?.value?.trim();
        if (!value) return false;
        return !bip39.wordlists.english.includes(value.toLowerCase());
    }

    get hasInvalidWords(): boolean {
        return this.formControlKeys(this.mnemonicForm).some((key) => this.isWordInvalid(key));
    }

    setMnemonics(): void {
        if (this.mnemonicCountForm.invalid || this.mnemonicForm.invalid) return;

        const words = this.formControlKeys(this.mnemonicForm)
            .map((key) => this.mnemonicForm.get(key)?.value)
            .join(" ")
            .trim();

        if (!bip39.validateMnemonic(words)) {
            this._snackbar.open(this._translocoService.translate("errors.invalid_mnemonic"), this._translocoService.translate("common.close"), {
                duration: 5000,
                panelClass: "zelf-snackbar",
                verticalPosition: "top",
            });
            return;
        }

        this._vaultService.mnemonic = words;

        this._router.navigate(["/security/password"]);
    }

    toggleShowWords(): void {
        this.showWords = !this.showWords;
    }

    async onPaste(event: ClipboardEvent): Promise<void> {
        event.preventDefault();

        const query = event.clipboardData?.getData("text");

        if (!query || typeof query !== "string" || !query?.trim()) return;

        const mnemonicCountControl = this.mnemonicCountForm.get("mnemonicCount");

        if (!mnemonicCountControl) return;

        const trimmed = query.trim().replace(/\s+/g, " ");
        const words = trimmed.split(" ");

        if (!(VALID_MNEMONIC_LENGTHS as readonly number[]).includes(words.length)) {
            this._snackbar.open(this._translocoService.translate("errors.invalid_mnemonic"), this._translocoService.translate("common.close"), {
                duration: 5000,
                panelClass: "zelf-snackbar",
                verticalPosition: "top",
            });
            return;
        }

        if (!bip39.validateMnemonic(trimmed)) {
            this._snackbar.open(this._translocoService.translate("errors.invalid_mnemonic"), this._translocoService.translate("common.close"), {
                duration: 5000,
                panelClass: "zelf-snackbar",
                verticalPosition: "top",
            });
            return;
        }

        const formerValue = mnemonicCountControl.value;
        mnemonicCountControl.patchValue(words.length);

        if (formerValue !== words.length) this._initWordsForm();

        words.forEach((word, index) => {
            this.mnemonicForm.get(`word${index + 1}`)!.setValue(word);
        });
    }
}
