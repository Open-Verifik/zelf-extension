import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, DestroyRef, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";

import { TagModel } from "app/tags.service";
import { WalletService } from "app/wallet.service";
import { AutofillDataService, AutofillUrlInfo } from "../../../services/autofill-data.service";
import { DataPassingService } from "../../../services/data-passing.service";
import {
    BiometricResult,
    BiometricsBottomSheetComponent,
    BiometricsBottomSheetData,
} from "../../shared/biometrics-bottom-sheet/biometrics-bottom-sheet.component";
import { HttpWrapperService } from "app/http-wrapper.service";

@Component({
    imports: [CommonModule, TranslocoModule, RouterModule, ReactiveFormsModule],
    selector: "zelf-keys-password-form",
    styleUrls: ["./zelf-keys-password-form.component.scss"],
    templateUrl: "./zelf-keys-password-form.component.html",
})
export class PasswordFormComponent implements OnInit {
    formValid = false;
    hasMasterPassword = false;
    isNewPassword = true;
    passwordForm!: FormGroup;
    shareables: any;
    showMasterPassword = false;
    showPassword = false;
    transformedPasswordData: any = null;
    view?: string;
    wallet!: TagModel;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _autofillDataService: AutofillDataService,
        private _bottomSheet: MatBottomSheet,
        private _changeDetectorRef: ChangeDetectorRef,
        private _dataPassingService: DataPassingService,
        private _destroyRef: DestroyRef,
        private _formBuilder: FormBuilder,
        private _httpWrapperService: HttpWrapperService,
        private _router: Router,
        private _walletService: WalletService
    ) {
        this.view = this._activatedRoute.snapshot.queryParamMap.get("view") || "home";

        this.shareables = {
            selectedTab: "assets",
            view: this.view,
            wallet: {},
        };

        this._initializeForm();
        this._setupAutofillSubscription();
    }

    async ngOnInit(): Promise<void> {
        const id = this._activatedRoute.snapshot.paramMap.get("id");

        this.isNewPassword = id === "new";

        await this._setWallet();

        this.checkFormValidity();
    }

    private _initializeForm(): void {
        this.passwordForm = this._formBuilder.group({
            email: ["a@a.com", [Validators.required]],
            folder: [""],
            masterPassword: [""],
            notes: [""],
            insideFolder: [false],
            password: ["password_field", [Validators.required]],
            url: ["https://www.google.com", [Validators.required]],
        });

        this.passwordForm.valueChanges.subscribe(() => {
            this.checkFormValidity();
        });
    }

    private async _setWallet(): Promise<any> {
        const wallet = await this._walletService.getFirstWalletFromStorage();

        if (!wallet?.name) {
            this._router.navigate(["/welcome"]);

            return;
        }

        this.shareables.wallet = wallet;
        this.wallet = wallet as TagModel;
        this.hasMasterPassword = wallet.hasPassword || false;

        this._changeDetectorRef.detectChanges();

        this.checkFormValidity();
    }

    private _setupAutofillSubscription(): void {
        this._autofillDataService.urlInfo$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((urlInfo: AutofillUrlInfo | null) => {
            if (!urlInfo) return;

            this._populateFormFromAutofill(urlInfo);

            this._autofillDataService.clearUrlInfo();
        });
    }

    private _populateFormFromAutofill(urlInfo: AutofillUrlInfo): void {
        this.passwordForm.patchValue({
            url: urlInfo.href,
        });

        if (this.wallet) this._changeDetectorRef.detectChanges();

        this.checkFormValidity();
    }

    private _onBiometricsSuccess(): void {
        this._router.navigate(["/zelf-keys/passwords/result"]);
    }

    private _openBiometricsBottomSheet(): void {
        const data: BiometricsBottomSheetData = {
            itemData: this.transformedPasswordData,
            itemType: "password",
            mode: "encrypt",
        };

        const bottomSheetRef = this._bottomSheet.open(BiometricsBottomSheetComponent, {
            data,
            backdropClass: "zelf-backdrop",
            panelClass: "zelf-bottom-sheet-biometrics",
        });

        bottomSheetRef.afterDismissed().subscribe((result: BiometricResult | undefined) => {
            if (!result) return;

            this._onBiometricsSuccess();
        });
    }

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }

    toggleMasterPasswordVisibility(): void {
        this.showMasterPassword = !this.showMasterPassword;
    }

    toggleFolder(): void {
        const currentValue = this.passwordForm.get("insideFolder")?.value;

        this.passwordForm.patchValue({ insideFolder: !currentValue });
    }

    checkFormValidity(): void {
        const formValue = this.passwordForm.value;
        const hasUrl = !!formValue.url;
        const hasEmail = !!formValue.email;
        const hasPassword = !!formValue.password;
        const hasMasterPassword = !!formValue.masterPassword;

        // Master password is only required if the wallet has a password
        const masterPasswordValid = this.hasMasterPassword ? hasMasterPassword : true;

        this.formValid = !!(hasUrl && hasEmail && hasPassword && masterPasswordValid);
    }

    onCancel(): void {
        this._router.navigate(["/zelf-keys/passwords"]);
    }

    async onSave(): Promise<void> {
        if (!this.formValid) return;

        const formValue = this.passwordForm.value;

        this.transformedPasswordData = {
            email: formValue.email,
            folder: formValue.folder,
            insideFolder: formValue.insideFolder,
            masterPassword: await this._httpWrapperService.encryptMessage(formValue.masterPassword),
            notes: formValue.notes,
            password: await this._httpWrapperService.encryptMessage(formValue.password),
            type: "passwords",
            url: formValue.url,
        };

        await this._dataPassingService.storeData("passwords", this.transformedPasswordData);

        this._openBiometricsBottomSheet();
    }
}
