import { CommonModule, NgIf } from "@angular/common";
import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { Subject } from "rxjs";
import { ZOTP } from "app/models/zotp.model";
import { ZelfKeysService } from "app/services/zelf-keys.service";
import { BiometricsGeneralComponent } from "app/biometrics-general/biometrics.component";
import { HttpWrapperService } from "app/http-wrapper.service";

export interface DeleteZOTPData {
    zotp: ZOTP;
}

@Component({
    imports: [CommonModule, MatButtonModule, NgIf, ReactiveFormsModule, TranslocoModule, BiometricsGeneralComponent, MatSnackBarModule],
    selector: "delete-zotp",
    styleUrls: ["./delete-zotp.component.scss"],
    templateUrl: "./delete-zotp.component.html",
})
export class DeleteZotpComponent implements OnInit, OnDestroy {
    private unsubscriber$ = new Subject<void>();

    form!: FormGroup;
    loading: boolean = false;
    showBiometrics: boolean = false;
    showMasterPassword: boolean = false;
    errorMessage: string = "";

    constructor(
        private _dialogRef: MatDialogRef<DeleteZotpComponent>,
        private _formBuilder: FormBuilder,
        private _zelfKeysService: ZelfKeysService,
        private _httpWrapperService: HttpWrapperService,
        private _snackBar: MatSnackBar,
        private _translocoService: TranslocoService,
        @Inject(MAT_DIALOG_DATA) public data: DeleteZOTPData
    ) {
        this._initForm();
    }

    ngOnInit(): void {
        // Component initialized
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    private _initForm(): void {
        this.form = this._formBuilder.group({
            masterPassword: ["", [Validators.required]],
        });
    }

    get zotp(): ZOTP {
        return this.data.zotp;
    }

    get ipfsId(): string {
        return this.zotp.ipfs?.id || this.zotp.zelfKeysId || "";
    }

    get walrusId(): string {
        const walrusId = this.zotp.ipfs?.publicData?.walrus;
        if (typeof walrusId === "string") {
            return walrusId;
        }
        return this.zotp.walrus?.blobId || "";
    }

    close(): void {
        this._dialogRef.close(false);
    }

    toggleShowMasterPassword(): void {
        this.showMasterPassword = !this.showMasterPassword;
    }

    async proceedToBiometrics(): Promise<void> {
        if (this.form.invalid) {
            return;
        }

        this.errorMessage = "";
        this.showBiometrics = true;
    }

    canNavigateAwayHandler(canNavigate: boolean): void {
        // Handle navigation away from biometrics if needed
    }

    onBiometricsFailed(error: string): void {
        this.showBiometrics = false;
        this.errorMessage = error || this._translocoService.translate("zotp.biometrics_failed");
        this._showError(this.errorMessage);
    }

    async onBiometricsScanned(encryptedImage: string): Promise<void> {
        this.loading = true;

        this.errorMessage = "";

        try {
            // Get master password from form and encrypt it
            const masterPasswordPlain = this.form.get("masterPassword")?.value;

            if (!masterPasswordPlain) throw new Error("Master password is required");

            if (!this.ipfsId) throw new Error("IPFS ID is required for deletion");

            // Encrypt the master password before sending to API
            const masterPassword = await this._httpWrapperService.encryptMessage(masterPasswordPlain);
            // Call delete endpoint
            await this._zelfKeysService.delete(this.ipfsId, encryptedImage, masterPassword);
            // Success - show toast and close
            this._showSuccess(this._translocoService.translate("zotp.deleted_successfully"));
            this._dialogRef.close(true);
        } catch (error: any) {
            console.error("Error deleting ZOTP:", error);
            const errorMsg = this._extractErrorMessage(error);

            this.errorMessage = errorMsg;

            this.showBiometrics = false;

            this._showError(errorMsg);
        } finally {
            this.loading = false;
        }
    }

    /**
     * Extract and translate error message from API error response
     * @param error - Error object from API call
     * @returns Translated error message
     */
    private _extractErrorMessage(error: any): string {
        let errorMsg = this._translocoService.translate("zotp.delete_failed");
        const serverMessage =
            error?.error?.message || error?.error?.error?.message || error?.error?.message?.message || error?.message || error?.error || null;

        if (typeof serverMessage === "string" && serverMessage.trim().length > 0) {
            const normalizedKey = serverMessage.trim();
            const translated = this._translocoService.translate(normalizedKey);
            errorMsg = translated && translated !== normalizedKey ? translated : normalizedKey;
        }

        const normalizedMessage = errorMsg.toLowerCase();
        if (normalizedMessage.includes("password") && normalizedMessage.includes("invalid")) {
            errorMsg = this._translocoService.translate("zotp.incorrect_password");
        } else if (normalizedMessage.includes("liveness") || normalizedMessage.includes("biometric")) {
            errorMsg = this._translocoService.translate("zotp.biometrics_failed");
        }

        return errorMsg;
    }

    private _showSuccess(message: string): void {
        this._snackBar.open(message, "", {
            duration: 3000,
            horizontalPosition: "center",
            verticalPosition: "bottom",
        });
    }

    private _showError(message: string): void {
        this._snackBar.open(message, "", {
            duration: 5000,
            horizontalPosition: "center",
            verticalPosition: "bottom",
            panelClass: ["error-snackbar"],
        });
    }
}
