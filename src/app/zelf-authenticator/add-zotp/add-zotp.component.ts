import { CommonModule, NgClass, NgIf } from "@angular/common";
import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TranslocoModule } from "@jsverse/transloco";
import { Subject } from "rxjs";
import jsQR from "jsqr";
import { ZOTP } from "app/models/zotp.model";
import { ZOTPService } from "app/services/zotp.service";
import { DragAndDropDirective } from "app/directives/drag-and-drop.directive";
import { BiometricsGeneralComponent } from "app/biometrics-general/biometrics.component";
import { TagsService, TagModel } from "app/tags.service";
import { VaultService } from "app/vault.service";
import { HttpWrapperService } from "app/http-wrapper.service";
import { WalletService } from "app/wallet.service";
import { FirstLetterPipe } from "app/pipes/first-letter.pipe";

@Component({
    imports: [
        CommonModule,
        DragAndDropDirective,
        MatButtonModule,
        NgClass,
        NgIf,
        ReactiveFormsModule,
        TranslocoModule,
        BiometricsGeneralComponent,
        FirstLetterPipe,
    ],
    selector: "add-zotp",
    styleUrls: ["./add-zotp.component.scss"],
    templateUrl: "./add-zotp.component.html",
})
export class AddZotpComponent implements OnInit, OnDestroy {
    private unsubscriber$ = new Subject<void>();

    form!: FormGroup;
    loading: boolean = false;
    mode: "setup-key" | "qr-upload" = "setup-key";
    qrError: string = "";
    showBiometrics: boolean = false;
    pendingZOTP: ZOTP | null = null; // ZOTP waiting to be created/stored after biometrics verification
    currentWallet: TagModel | null = null; // Current wallet for displaying
    showMasterPassword: boolean = false; // Toggle to show/hide master password

    constructor(
        private _dialogRef: MatDialogRef<AddZotpComponent>,
        private _formBuilder: FormBuilder,
        private _zotpService: ZOTPService,
        private _tagsService: TagsService,
        private _vaultService: VaultService,
        private _httpWrapperService: HttpWrapperService,
        private _walletService: WalletService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this._initForm();
    }

    async ngOnInit(): Promise<void> {
        // Load current wallet
        await this._loadCurrentWallet();
    }

    private async _loadCurrentWallet(): Promise<void> {
        try {
            const wallet = await this._walletService.getCurrentWallet();
            this.currentWallet = wallet ? new TagModel(wallet) : null;
        } catch (error) {
            console.error("Error loading current wallet:", error);
        }
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    private _initForm(): void {
        this.form = this._formBuilder.group({
            name: ["", [Validators.required]],
            issuer: [""],
            setupKey: ["", [Validators.required]],
            masterPassword: ["", [Validators.required]], // Master password required for ZOTP creation
        });
    }

    switchMode(mode: "setup-key" | "qr-upload"): void {
        this.mode = mode;
        this.qrError = "";
        this.form.get("setupKey")?.setValue("");
    }

    async onDrop(files: FileList): Promise<void> {
        if (files.length === 0) return;

        await this._processQRCode(files[0]);
    }

    async fileBrowseHandler(event: Event): Promise<void> {
        const target = event.target as HTMLInputElement;

        if (target.files && target.files.length > 0) {
            await this._processQRCode(target.files[0]);
        }
    }

    private async _processQRCode(file: File): Promise<void> {
        this.loading = true;
        this.qrError = "";

        try {
            const base64 = await this._fileToBase64(file);
            const qrData = await this._decodeQRCode(base64);

            if (!qrData) {
                this.qrError = "Invalid QR code";
                this.loading = false;

                return;
            }

            // Check if it's a Google Authenticator migration format
            if (qrData.startsWith("otpauth-migration://")) {
                const migrationData = this._parseMigrationURI(qrData);

                if (migrationData && migrationData.length > 0) {
                    // If multiple accounts, use the first one (we can enhance this later to show a selection)
                    const firstAccount = migrationData[0];

                    this.form.patchValue({
                        name: firstAccount.name || "",
                        issuer: firstAccount.issuer || "",
                        setupKey: firstAccount.secret || "",
                    });

                    this.mode = "setup-key";
                    this.loading = false;

                    return;
                } else {
                    this.qrError = "Could not extract TOTP data from migration QR code";
                    this.loading = false;

                    return;
                }
            }

            // Try standard otpauth:// format
            const parsed = this._parseOTPAuthURI(qrData);

            if (!parsed) {
                this.qrError = "QR code is not a valid TOTP setup";
                this.loading = false;

                return;
            }

            this.form.patchValue({
                name: parsed.name || "",
                issuer: parsed.issuer || "",
                setupKey: parsed.secret || "",
            });

            this.mode = "setup-key";
        } catch (error) {
            console.error("Error processing QR code:", error);
            this.qrError = "Failed to process QR code";
        } finally {
            this.loading = false;
        }
    }

    private _fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                const result = reader.result as string;

                resolve(result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    private _decodeQRCode(base64: string): Promise<string | null> {
        return new Promise((resolve) => {
            const img = new Image();

            img.src = base64;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");

                if (!context) {
                    resolve(null);

                    return;
                }

                canvas.width = img.width;
                canvas.height = img.height;

                context.drawImage(img, 0, 0, img.width, img.height);

                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const extractedQRData = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "attemptBoth" });

                resolve(extractedQRData?.data || null);
            };

            img.onerror = () => resolve(null);
        });
    }

    private _parseOTPAuthURI(uri: string): { name: string; issuer: string; secret: string } | null {
        // Parse otpauth://totp/Issuer:Name?secret=SECRET&issuer=Issuer
        if (!uri.startsWith("otpauth://")) return null;

        try {
            const url = new URL(uri);

            if (url.protocol !== "otpauth:" || url.hostname !== "totp") return null;

            const pathParts = url.pathname.split(":");
            const issuer = pathParts[0] || "";
            const name = pathParts[1] || url.searchParams.get("issuer") || "";
            const secret = url.searchParams.get("secret") || "";

            if (!secret) return null;

            return {
                name: decodeURIComponent(name),
                issuer: decodeURIComponent(url.searchParams.get("issuer") || issuer),
                secret,
            };
        } catch (error) {
            console.error("Error parsing OTP Auth URI:", error);

            return null;
        }
    }

    private _parseMigrationURI(uri: string): Array<{ name: string; issuer: string; secret: string }> | null {
        // Parse otpauth-migration://offline?data=BASE64_ENCODED_PROTOBUF
        if (!uri.startsWith("otpauth-migration://")) return null;

        try {
            const url = new URL(uri);
            const dataParam = url.searchParams.get("data");

            if (!dataParam) return null;

            // URL decode the data parameter
            const urlDecoded = decodeURIComponent(dataParam);

            // Base64 decode
            const binaryString = atob(urlDecoded);

            // Parse the protobuf data
            // Google Authenticator migration format structure:
            // Outer message (MigrationPayload) contains:
            //   Field 1 (repeated, wire type 2): OTPParameters messages
            const accounts: Array<{ name: string; issuer: string; secret: string }> = [];
            let offset = 0;

            // Parse the outer message to find field 1 (repeated OTPParameters)
            while (offset < binaryString.length) {
                const tag = binaryString.charCodeAt(offset++);
                const fieldNumber = tag >> 3;
                const wireType = tag & 0x7;

                if (wireType === 2 && fieldNumber === 1) {
                    // Field 1: repeated OTPParameters (length-delimited)
                    let length = 0;
                    let shift = 0;
                    let byte;

                    do {
                        byte = binaryString.charCodeAt(offset++);
                        length |= (byte & 0x7f) << shift;
                        shift += 7;
                    } while (byte & 0x80 && offset < binaryString.length);

                    if (offset + length > binaryString.length) break;

                    // Extract the OTPParameters message
                    const payload = binaryString.substring(offset, offset + length);
                    offset += length;

                    // Parse the OTPParameters message
                    const account = this._parseMigrationPayload(payload);

                    if (account) {
                        accounts.push(account);
                    }
                } else {
                    // Skip unknown fields
                    if (wireType === 0) {
                        // Varint - skip it
                        let byte;

                        do {
                            byte = binaryString.charCodeAt(offset++);
                        } while (byte & 0x80 && offset < binaryString.length);
                    } else if (wireType === 2) {
                        // Length-delimited - skip it
                        let length = 0;
                        let shift = 0;
                        let byte;

                        do {
                            byte = binaryString.charCodeAt(offset++);
                            length |= (byte & 0x7f) << shift;
                            shift += 7;
                        } while (byte & 0x80 && offset < binaryString.length);

                        offset += length;
                    } else {
                        // Unknown wire type, break
                        break;
                    }
                }
            }

            return accounts.length > 0 ? accounts : null;
        } catch (error) {
            console.error("Error parsing migration URI:", error);

            return null;
        }
    }

    private _parseMigrationPayload(payload: string): { name: string; issuer: string; secret: string } | null {
        // Parse the nested protobuf structure
        // Field 1: secret (bytes)
        // Field 2: name (string)
        // Field 3: issuer (string)
        // Field 4: algorithm (enum)
        // Field 5: digits (enum)
        // Field 6: type (enum)
        // Field 7: counter (uint64) - for HOTP

        let secret = "";
        let name = "";
        let issuer = "";

        let offset = 0;

        while (offset < payload.length) {
            const tag = payload.charCodeAt(offset++);
            const fieldNumber = tag >> 3;
            const wireType = tag & 0x7;

            if (wireType === 0) {
                // Varint
                let value = 0;
                let shift = 0;
                let byte;

                do {
                    byte = payload.charCodeAt(offset++);
                    value |= (byte & 0x7f) << shift;
                    shift += 7;
                } while (byte & 0x80 && offset < payload.length);

                // Field 4: algorithm, Field 5: digits, Field 6: type, Field 7: counter
                // We don't need these for basic TOTP
            } else if (wireType === 2) {
                // Length-delimited (string or bytes)
                let length = 0;
                let shift = 0;
                let byte;

                do {
                    byte = payload.charCodeAt(offset++);
                    length |= (byte & 0x7f) << shift;
                    shift += 7;
                } while (byte & 0x80 && offset < payload.length);

                if (offset + length > payload.length) break;

                const data = payload.substring(offset, offset + length);
                offset += length;

                if (fieldNumber === 1) {
                    // Secret (bytes) - convert to base32
                    secret = this._bytesToBase32(data);
                } else if (fieldNumber === 2) {
                    // Name (string)
                    name = this._decodeUTF8(data);
                } else if (fieldNumber === 3) {
                    // Issuer (string)
                    issuer = this._decodeUTF8(data);
                }
            } else {
                // Skip unknown wire types
                break;
            }
        }

        if (!secret) return null;

        return {
            name: name || "Unknown",
            issuer: issuer || "",
            secret,
        };
    }

    private _bytesToBase32(bytes: string): string {
        // Convert bytes to base32
        // Google Authenticator uses base32 encoding for secrets
        const base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        let result = "";
        let bits = 0;
        let value = 0;

        for (let i = 0; i < bytes.length; i++) {
            value = (value << 8) | bytes.charCodeAt(i);
            bits += 8;

            while (bits >= 5) {
                result += base32Chars.charAt((value >>> (bits - 5)) & 31);
                bits -= 5;
            }
        }

        if (bits > 0) {
            result += base32Chars.charAt((value << (5 - bits)) & 31);
        }

        return result;
    }

    private _decodeUTF8(str: string): string {
        // Simple UTF-8 decoder
        let result = "";
        let i = 0;

        while (i < str.length) {
            const c = str.charCodeAt(i++);

            if (c < 0x80) {
                result += String.fromCharCode(c);
            } else if (c < 0xe0) {
                result += String.fromCharCode(((c & 0x1f) << 6) | (str.charCodeAt(i++) & 0x3f));
            } else if (c < 0xf0) {
                const c2 = str.charCodeAt(i++);
                result += String.fromCharCode(((c & 0x0f) << 12) | ((c2 & 0x3f) << 6) | (str.charCodeAt(i++) & 0x3f));
            } else {
                const c2 = str.charCodeAt(i++);
                const c3 = str.charCodeAt(i++);
                result += String.fromCharCode(((c & 0x07) << 18) | ((c2 & 0x3f) << 12) | ((c3 & 0x3f) << 6) | (str.charCodeAt(i++) & 0x3f));
            }
        }

        return result;
    }

    /**
     * Start the ZOTP creation flow with biometrics
     * This is the main entry point for creating a new ZOTP
     */
    async save(): Promise<void> {
        if (this.form.invalid) return;

        // Validate form and prepare ZOTP data
        const formValue = this.form.value;
        const secret = formValue.setupKey.trim().replace(/\s/g, "").toUpperCase();

        if (!secret) return;

        try {
            // Get zelfProof from current wallet
            const zelfProof = await this._tagsService.getZelfProof();

            if (!zelfProof) throw new Error("No wallet found. Please create or unlock a wallet first.");

            // Create ZOTP object (secret will be encrypted by ZelfKeys API during storage)
            const zotp: ZOTP = {
                id: this._zotpService.generateId(),
                name: formValue.name.trim(),
                secret: secret, // Plain secret - will be encrypted by ZelfKeys API
                issuer: formValue.issuer?.trim() || undefined,
                algorithm: "SHA1",
                digits: 6,
                period: 30,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                isDecrypted: false,
                zelfProof: zelfProof,
            };

            // Store pending ZOTP and show biometrics for creation
            // Biometrics are required as part of the creation flow
            this.pendingZOTP = zotp;
            this.showBiometrics = true;
        } catch (error) {
            console.error("Error preparing ZOTP:", error);
            // TODO: Show error message to user
        }
    }

    /**
     * Handle biometrics capture during ZOTP creation
     * This completes the creation flow by storing the ZOTP to ZelfKeys
     */
    async onBiometricsScanned(encryptedImage: string): Promise<void> {
        if (!this.pendingZOTP) {
            console.error("No pending ZOTP to store");
            return;
        }

        this.loading = true;

        try {
            // Get master password from form and encrypt it
            const masterPasswordPlain = this.form.get("masterPassword")?.value;

            if (!masterPasswordPlain) {
                throw new Error("Master password is required");
            }

            // Encrypt the master password before sending to API
            const masterPassword = await this._httpWrapperService.encryptMessage(masterPasswordPlain);

            // Store ZOTP to ZelfKeys API (this is the creation step)
            // The biometrics are part of the creation flow, not decryption
            await this._zotpService.storeZOTPToZelfKeys(this.pendingZOTP, encryptedImage, masterPassword);

            // Successfully created - close dialog
            this._dialogRef.close(true);
        } catch (error) {
            console.error("Error creating ZOTP:", error);
            // TODO: Show error message to user
            this.showBiometrics = false;
            this.pendingZOTP = null;
        } finally {
            this.loading = false;
        }
    }

    toggleShowMasterPassword(): void {
        this.showMasterPassword = !this.showMasterPassword;
    }

    onBiometricsFailed(error: any): void {
        console.error("Biometrics failed:", error);
        this.showBiometrics = false;
        this.pendingZOTP = null;
        this.loading = false;
        // TODO: Show error message to user
    }

    canNavigateAwayHandler(canNavigate: boolean): void {
        // Handle navigation away from biometrics if needed
    }

    close(): void {
        this._dialogRef.close(false);
    }
}
