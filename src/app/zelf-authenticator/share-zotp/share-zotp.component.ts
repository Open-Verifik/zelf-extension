import { CommonModule, NgFor, NgIf } from "@angular/common";
import { ChangeDetectorRef, Component, Inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { ZOTP } from "app/models/zotp.model";
import { SealService, SecretShare } from "app/services/seal.service";
import { ZOTPService } from "app/services/zotp.service";

export interface ShareZOTPData {
    zotp: ZOTP;
    setupKey: string; // Decrypted setup key
}

@Component({
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        NgFor,
        NgIf,
        TranslocoModule,
    ],
    selector: "share-zotp",
    styleUrls: ["./share-zotp.component.scss"],
    templateUrl: "./share-zotp.component.html",
})
export class ShareZotpComponent {
    zotp: ZOTP;
    setupKey: string;
    threshold: number = 3;
    totalShares: number = 5;
    participants: string[] = [];
    shares: SecretShare[] = [];
    loading: boolean = false;
    error: string = "";

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ShareZOTPData,
        public dialogRef: MatDialogRef<ShareZotpComponent>,
        private _sealService: SealService,
        private _zotpService: ZOTPService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _translocoService: TranslocoService
    ) {
        this.zotp = data.zotp;
        this.setupKey = data.setupKey;
        // Initialize participants array
        this.participants = new Array(this.totalShares).fill("");
    }

    close(): void {
        this.dialogRef.close(false);
    }

    onThresholdChange(): void {
        if (this.threshold > this.totalShares) {
            this.threshold = this.totalShares;
        }
        if (this.threshold < 2) {
            this.threshold = 2;
        }
        // Update participants array
        this.participants = new Array(this.totalShares).fill("");
    }

    onTotalSharesChange(): void {
        if (this.totalShares < this.threshold) {
            this.totalShares = this.threshold;
        }
        if (this.totalShares < 2) {
            this.totalShares = 2;
        }
        // Update participants array
        const oldLength = this.participants.length;
        this.participants = new Array(this.totalShares).fill("");
        // Preserve existing participants if possible
        if (oldLength > 0 && oldLength <= this.totalShares) {
            // Keep existing values
        }
    }

    async generateShares(): Promise<void> {
        if (!this.setupKey) {
            this.error = "Setup key is required";
            return;
        }

        if (this.threshold > this.totalShares) {
            this.error = "Threshold cannot be greater than total shares";
            return;
        }

        // Filter out empty participants
        const validParticipants = this.participants.filter((p) => p.trim() !== "");

        try {
            this.loading = true;
            this.error = "";

            // Generate shares using Seal service
            this.shares = this._sealService.shareSecret(this.setupKey, {
                threshold: this.threshold,
                totalShares: this.totalShares,
                participants: validParticipants.length > 0 ? validParticipants : undefined,
            });

            this._changeDetectorRef.detectChanges();
        } catch (error: any) {
            console.error("Error generating shares:", error);
            this.error = error.message || "Failed to generate shares";
        } finally {
            this.loading = false;
            this._changeDetectorRef.detectChanges();
        }
    }

    async copyShare(share: SecretShare): Promise<void> {
        try {
            await navigator.clipboard.writeText(share.shareData);
            // Show success message
        } catch (error) {
            console.error("Failed to copy share:", error);
        }
    }

    async downloadShares(): Promise<void> {
        if (this.shares.length === 0) {
            return;
        }

        const sharesData = {
            zotpId: this.zotp.id,
            zotpName: this.zotp.name,
            issuer: this.zotp.issuer,
            threshold: this.threshold,
            totalShares: this.totalShares,
            shares: this.shares,
            createdAt: Date.now(),
            // Include metadata for recovery
            metadata: {
                zotpId: this.zotp.id,
                name: this.zotp.name,
                issuer: this.zotp.issuer,
                algorithm: this.zotp.algorithm || "SHA1",
                digits: this.zotp.digits || 6,
                period: this.zotp.period || 30,
            },
        };

        const blob = new Blob([JSON.stringify(sharesData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `zotp_shares_${this.zotp.name || this.zotp.id}_${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }
}

