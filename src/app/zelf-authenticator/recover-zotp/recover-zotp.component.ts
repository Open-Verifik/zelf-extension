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
import { TOTPService } from "app/services/totp.service";

export interface RecoverZOTPData {
    // Optional - if recovering existing ZOTP
    zotp?: ZOTP;
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
    selector: "recover-zotp",
    styleUrls: ["./recover-zotp.component.scss"],
    templateUrl: "./recover-zotp.component.html",
})
export class RecoverZotpComponent {
    zotp: ZOTP | null = null;
    shares: SecretShare[] = [];
    shareInput: string = "";
    importedShares: SecretShare[] = [];
    reconstructedSecret: string = "";
    recoveredZOTP: Partial<ZOTP> | null = null;
    loading: boolean = false;
    error: string = "";
    success: boolean = false;
    step: "import" | "verify" | "success" = "import";

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: RecoverZOTPData,
        public dialogRef: MatDialogRef<RecoverZotpComponent>,
        private _sealService: SealService,
        private _zotpService: ZOTPService,
        private _totpService: TOTPService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _translocoService: TranslocoService
    ) {
        this.zotp = data.zotp || null;
    }

    close(): void {
        this.dialogRef.close(this.recoveredZOTP);
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];

        if (!file) {
            return;
        }

        if (!file.name.endsWith(".json")) {
            this.error = "Please select a JSON file";
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const data = JSON.parse(content);

                // Validate share file structure
                if (data.shares && Array.isArray(data.shares)) {
                    this.importedShares = data.shares;
                    
                    // Extract ZOTP metadata if available
                    if (data.metadata) {
                        this.zotp = {
                            id: data.metadata.zotpId || data.zotpId,
                            name: data.metadata.name || data.zotpName,
                            issuer: data.metadata.issuer,
                            algorithm: data.metadata.algorithm || "SHA1",
                            digits: data.metadata.digits || 6,
                            period: data.metadata.period || 30,
                        } as ZOTP;
                    } else if (data.zotpName) {
                        // Fallback to old format
                        this.zotp = {
                            id: data.zotpId,
                            name: data.zotpName,
                            issuer: data.issuer,
                        } as ZOTP;
                    }
                    
                    this.error = "";
                    this._changeDetectorRef.detectChanges();
                } else if (data.shareData) {
                    // Single share
                    this.importedShares = [
                        {
                            shareId: data.shareId || `share_${Date.now()}`,
                            shareData: data.shareData,
                            partyIndex: data.partyIndex || 1,
                            threshold: data.threshold || 0,
                            totalShares: data.totalShares || 0,
                            participant: data.participant,
                            createdAt: data.createdAt || Date.now(),
                        },
                    ];
                    this.error = "";
                    this._changeDetectorRef.detectChanges();
                } else {
                    this.error = "Invalid share file format";
                }
            } catch (error: any) {
                console.error("Error reading file:", error);
                this.error = error.message || "Failed to read file";
            }
        };

        reader.readAsText(file);
    }

    addShareManually(): void {
        if (!this.shareInput.trim()) {
            this.error = "Please enter a share";
            return;
        }

        try {
            // Try to parse as JSON first
            let shareData: any;
            try {
                shareData = JSON.parse(this.shareInput);
            } catch {
                // If not JSON, treat as base64 encoded share
                shareData = {
                    shareData: this.shareInput.trim(),
                };
            }

            // Validate share structure
            if (!shareData.shareData) {
                this.error = "Invalid share format";
                return;
            }

            // Try to decode and validate
            const decoded = JSON.parse(atob(shareData.shareData));
            if (!decoded.x || !decoded.y) {
                this.error = "Invalid share data";
                return;
            }

            const share: SecretShare = {
                shareId: shareData.shareId || `share_${Date.now()}_${this.importedShares.length + 1}`,
                shareData: shareData.shareData,
                partyIndex: shareData.partyIndex || this.importedShares.length + 1,
                threshold: shareData.threshold || 0,
                totalShares: shareData.totalShares || 0,
                participant: shareData.participant,
                createdAt: shareData.createdAt || Date.now(),
            };

            // Check if share already exists
            const exists = this.importedShares.some((s) => s.shareData === share.shareData);
            if (exists) {
                this.error = "This share is already imported";
                return;
            }

            this.importedShares.push(share);
            this.shareInput = "";
            this.error = "";
            this._changeDetectorRef.detectChanges();
        } catch (error: any) {
            console.error("Error adding share:", error);
            this.error = error.message || "Invalid share format";
        }
    }

    removeShare(index: number): void {
        this.importedShares.splice(index, 1);
        this.reconstructedSecret = "";
        this.success = false;
        this._changeDetectorRef.detectChanges();
    }

    async reconstructSecret(): Promise<void> {
        if (this.importedShares.length === 0) {
            this.error = "Please import at least one share";
            return;
        }

        // Check if we have threshold information
        const threshold = this.importedShares[0]?.threshold || 0;
        if (threshold > 0 && this.importedShares.length < threshold) {
            this.error = `Need at least ${threshold} shares, you have ${this.importedShares.length}`;
            return;
        }

        try {
            this.loading = true;
            this.error = "";

            // Reconstruct secret using Seal service
            try {
                this.reconstructedSecret = this._sealService.reconstructSecret(this.importedShares);
            } catch (reconstructError: any) {
                console.error("Reconstruction error details:", reconstructError);
                throw new Error(`Failed to reconstruct secret: ${reconstructError.message || reconstructError}`);
            }

            if (!this.reconstructedSecret || this.reconstructedSecret.length === 0) {
                throw new Error("Failed to reconstruct secret - result is empty");
            }

            // Verify the secret by generating a TOTP code
            // Extract ZOTP info from shares if available
            const shareFile = this.importedShares[0];
            let zotpInfo: Partial<ZOTP> | null = null;

            // Try to get ZOTP info from share metadata (if shares were exported with metadata)
            // For now, we'll need to extract from the first share or ask user

            // Generate a test code to verify secret works
            try {
                const testCode = await this._totpService.generate(this.reconstructedSecret, 30, 6, "SHA1");
                if (testCode && testCode.length === 6) {
                    this.success = true;
                    this.step = "verify";
                } else {
                    throw new Error("Invalid secret - could not generate TOTP code");
                }
            } catch (error: any) {
                throw new Error("Invalid secret - could not generate TOTP code: " + error.message);
            }

            this._changeDetectorRef.detectChanges();
        } catch (error: any) {
            console.error("Error reconstructing secret:", error);
            this.error = error.message || "Failed to reconstruct secret. Make sure you have enough valid shares.";
            this.reconstructedSecret = "";
            this.success = false;
        } finally {
            this.loading = false;
            this._changeDetectorRef.detectChanges();
        }
    }

    async createZOTPFromRecoveredSecret(): Promise<void> {
        if (!this.reconstructedSecret) {
            return;
        }

        try {
            this.loading = true;
            this.error = "";

            // Try to extract ZOTP info from share metadata if available
            // Otherwise, create a basic ZOTP object
            const shareMetadata = this.importedShares[0];
            
            // Create ZOTP object from recovered secret
            // Use metadata from imported shares if available
            const zotp: Partial<ZOTP> = {
                id: this.zotp?.id || this._zotpService.generateId(),
                name: this.zotp?.name || "Recovered Account",
                issuer: this.zotp?.issuer || shareMetadata.participant || undefined,
                secret: this.reconstructedSecret,
                algorithm: this.zotp?.algorithm || "SHA1",
                digits: this.zotp?.digits || 6,
                period: this.zotp?.period || 30,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                isDecrypted: true,
                decryptedSecret: this.reconstructedSecret,
            };

            // Store locally in cache (user will need to encrypt with biometrics to store in Walrus/ZelfKeys)
            // For now, we'll save it to local cache so it appears in the list
            await this._zotpService.saveZOTP(zotp as ZOTP);
            
            // Refresh the ZOTP list to show the recovered ZOTP
            await this._zotpService.loadZOTPsFromBackend(true);

            this.recoveredZOTP = zotp;
            this.step = "success";
            this._changeDetectorRef.detectChanges();
        } catch (error: any) {
            console.error("Error creating ZOTP:", error);
            this.error = error.message || "Failed to create ZOTP";
        } finally {
            this.loading = false;
            this._changeDetectorRef.detectChanges();
        }
    }

    getThreshold(): number {
        return this.importedShares[0]?.threshold || 0;
    }

    getTotalShares(): number {
        return this.importedShares[0]?.totalShares || 0;
    }

    hasEnoughShares(): boolean {
        const threshold = this.getThreshold();
        if (threshold === 0) {
            // If no threshold info, try with what we have
            return this.importedShares.length >= 2;
        }
        return this.importedShares.length >= threshold;
    }
}

