import { CommonModule, NgIf } from "@angular/common";
import { ChangeDetectorRef, Component, ElementRef, Inject, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { BiometricsGeneralComponent } from "app/biometrics-general/biometrics.component";
import { CopyToClipboardBase } from "app/base/copy-to-clipboard/copy-to-clipboard.base";
import { ChromeService } from "app/chrome.service";
import { ZOTP } from "app/models/zotp.model";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { ZOTPService } from "app/services/zotp.service";
import QRCodeStyling, { Options as QRCodeStylingOptions } from "qr-code-styling";
import { ShareZotpComponent, ShareZOTPData } from "../share-zotp/share-zotp.component";

export interface ExportZOTPData {
    zotp: ZOTP;
}

@Component({
    imports: [CommonModule, MatButtonModule, MatDialogModule, MatSnackBarModule, NgIf, TranslocoModule, BiometricsGeneralComponent],
    selector: "export-zotp",
    styleUrls: ["./export-zotp.component.scss"],
    templateUrl: "./export-zotp.component.html",
})
export class ExportZotpComponent extends CopyToClipboardBase {
    @ViewChild("qrCodeContainer", { static: false }) qrCodeContainer!: ElementRef<HTMLElement>;

    zotp: ZOTP;
    loading: boolean = false;
    metadata: any = null;
    setupKey: string = "";
    qrCode!: QRCodeStyling;
    qrCodeDataUrl: string = "";

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ExportZOTPData,
        public dialogRef: MatDialogRef<ExportZotpComponent>,
        private _zotpService: ZOTPService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _dialog: MatDialog,
        protected _chromeService: ChromeService,
        protected _snackBar: MatSnackBar,
        protected _translocoService: TranslocoService
    ) {
        super(_chromeService, _snackBar, _translocoService);
        this.zotp = data.zotp;
    }

    close(): void {
        this.dialogRef.close(false);
    }

    onBiometricsScanned(encryptedImage: string): void {
        // Retrieve metadata after biometrics verification
        this.loading = true;
        this._changeDetectorRef.detectChanges();

        this._zotpService
            .retrieveZOTPMetadata(this.zotp, encryptedImage)
            .then((metadata) => {
                this.metadata = metadata;
                // Extract setupKey from metadata
                this.setupKey = metadata?.setupKey || "";

                // Generate QR code
                if (this.setupKey) {
                    this._generateQRCode();
                }

                this.loading = false;
                this._changeDetectorRef.detectChanges();
            })
            .catch((error) => {
                console.error("Error retrieving ZOTP metadata:", error);
                this.loading = false;
                this._changeDetectorRef.detectChanges();
                // TODO: Show error message to user
            });
    }

    private _generateQRCode(): void {
        // Generate otpauth:// URL for Google Authenticator
        const label = this.zotp.issuer
            ? `${encodeURIComponent(this.zotp.issuer)}:${encodeURIComponent(this.zotp.name)}`
            : encodeURIComponent(this.zotp.name);

        const issuer = this.zotp.issuer ? encodeURIComponent(this.zotp.issuer) : "";
        const otpauthUrl = `otpauth://totp/${label}?secret=${this.setupKey}${issuer ? `&issuer=${issuer}` : ""}`;

        const qrCodeOptions: QRCodeStylingOptions = {
            data: otpauthUrl,
            width: 300,
            height: 300,
            type: "svg",
            margin: 0,
            qrOptions: {
                errorCorrectionLevel: "M",
            },
            backgroundOptions: {
                color: "#ffffff",
            },
            dotsOptions: {
                color: "#000000",
                type: "rounded",
            },
            cornersSquareOptions: {
                color: "#000000",
                type: "extra-rounded",
            },
            cornersDotOptions: {
                color: "#000000",
                type: "dot",
            },
        };

        this.qrCode = new QRCodeStyling(qrCodeOptions);

        // Generate data URL for download
        this.qrCode.getRawData("png").then((data) => {
            if (data) {
                // Handle both Blob and Buffer types
                const blob = data instanceof Blob ? data : new Blob([data as any], { type: "image/png" });
                const reader = new FileReader();
                reader.onloadend = () => {
                    this.qrCodeDataUrl = reader.result as string;
                    this._changeDetectorRef.detectChanges();
                };
                reader.readAsDataURL(blob);
            }
        });

        // Render QR code after view init
        setTimeout(() => {
            if (this.qrCodeContainer?.nativeElement) {
                // Clear any existing QR code
                this.qrCodeContainer.nativeElement.innerHTML = "";
                this.qrCode.append(this.qrCodeContainer.nativeElement);
            }
        }, 100);
    }

    onBiometricsFailed(error: any): void {
        console.error("Biometrics failed:", error);
        this.dialogRef.close(false);
    }

    canNavigateAwayHandler(canNavigate: boolean): void {
        // Handle navigation away from biometrics if needed
    }

    async copySetupKey(): Promise<void> {
        if (this.setupKey) {
            await this._copyToClipboard(this.setupKey);
        }
    }

    shareZOTP(): void {
        if (!this.setupKey) {
            return;
        }

        const dialogRef = this._dialog.open(ShareZotpComponent, {
            panelClass: "zelf-dialog",
            backdropClass: "zelf-backdrop",
            width: "90vw",
            maxWidth: "600px",
            minWidth: "320px",
            data: {
                zotp: this.zotp,
                setupKey: this.setupKey,
            } as ShareZOTPData,
        });

        dialogRef.afterClosed().subscribe(() => {
            // Modal closed
        });
    }
}
