import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";
import { VaultService } from "app/vault.service";
import { WelcomeErrorComponent } from "app/welcome-error/welcome-error.component";
import { ZelfNameService } from "app/zelf-name-service.service";

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
    mnemonicCount: 12 | 24 = 12;
    mnemonicCountForm!: UntypedFormGroup;
    mnemonicForm!: UntypedFormGroup;
    showWords: boolean = false;

    constructor(
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _vaultService: VaultService,
        private _zelfNameService: ZelfNameService
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

    setMnemonics(): void {
        if (this.mnemonicCountForm.invalid || this.mnemonicForm.invalid) return;

        const words = this.formControlKeys(this.mnemonicForm)
            .map((key) => this.mnemonicForm.get(key)?.value)
            .join(" ");

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

        query.split(" ").forEach((word, index) => {
            this.mnemonicForm.get(`word${index + 1}`)!.setValue(word);
        });
    }
}
