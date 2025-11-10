import { CommonModule, NgIf } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TranslocoModule } from "@jsverse/transloco";
import { BiometricsGeneralComponent } from "app/biometrics-general/biometrics.component";
import { ZOTP } from "app/models/zotp.model";

export interface UnlockZOTPData {
    zotp: ZOTP;
}

@Component({
    imports: [CommonModule, MatButtonModule, NgIf, TranslocoModule, BiometricsGeneralComponent],
    selector: "unlock-zotp",
    styleUrls: ["./unlock-zotp.component.scss"],
    templateUrl: "./unlock-zotp.component.html",
})
export class UnlockZotpComponent {
    zotp: ZOTP;
    loading: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: UnlockZOTPData,
        public dialogRef: MatDialogRef<UnlockZotpComponent>
    ) {
        this.zotp = data.zotp;
    }

    close(): void {
        this.dialogRef.close(false);
    }

    onBiometricsScanned(encryptedImage: string): void {
        // Emit the encrypted image to parent component
        this.dialogRef.close(encryptedImage);
    }

    onBiometricsFailed(error: any): void {
        console.error("Biometrics failed:", error);
        this.dialogRef.close(false);
    }

    canNavigateAwayHandler(canNavigate: boolean): void {
        // Handle navigation away from biometrics if needed
    }
}

