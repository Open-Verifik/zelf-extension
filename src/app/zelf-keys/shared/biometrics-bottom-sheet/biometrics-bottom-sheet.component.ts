import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";

import { WalletService } from "app/wallet.service";
import { ZelfKeysService } from "app/services/zelf-keys.service";
import { DataPassingService } from "app/services/data-passing.service";
import { HttpWrapperService } from "app/http-wrapper.service";
import { AuthService } from "app/services/auth.service";
import { DecryptedItemData } from "../../../models/zelf-key-item.model";
import { DataBiometricsComponent } from "../data-biometrics/data-biometrics.component";

export interface BiometricResult {
    faceBase64: string;
    password?: string;
    retrievedData?: DecryptedItemData;
}

export interface BiometricsBottomSheetData {
    itemData: any;
    itemType: string;
    mode: "encrypt" | "decrypt";
}

@Component({
    imports: [CommonModule, DataBiometricsComponent, TranslocoModule],
    selector: "biometrics-bottom-sheet",
    styleUrls: ["./biometrics-bottom-sheet.component.scss"],
    templateUrl: "./biometrics-bottom-sheet.component.html",
})
export class BiometricsBottomSheetComponent implements OnInit {
    errorMessage: string = "";
    isLoading: boolean = false;
    itemData: any;
    itemType: string;
    mode: "encrypt" | "decrypt";
    wallet: any;

    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: BiometricsBottomSheetData,
        private _bottomSheetRef: MatBottomSheetRef<BiometricsBottomSheetComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _translocoService: TranslocoService,
        private _walletService: WalletService,
        private _zelfKeysService: ZelfKeysService,
        private _dataPassingService: DataPassingService,
        private _httpWrapperService: HttpWrapperService,
        private _authService: AuthService
    ) {
        this.itemData = data.itemData;
        this.itemType = data.itemType;
        this.mode = data.mode;
    }

    async ngOnInit(): Promise<void> {
        await this._setWallet();
        // Token is automatically refreshed by AuthService when needed
    }

    private async _setWallet(): Promise<void> {
        const wallet = await this._walletService.getFirstWalletFromStorage();

        if (!wallet?.name) {
            return;
        }

        this.wallet = wallet;
        this._changeDetectorRef.detectChanges();
    }

    getTitle(): string {
        const actionKey = this.mode === "encrypt" ? "encrypt" : "decrypt";

        switch (this.itemType) {
            case "payment-card":
                return this._translocoService.translate(`zelf_keys.biometrics_bottom_sheet.${actionKey}_payment_card`);
            case "note":
                return this._translocoService.translate(`zelf_keys.biometrics_bottom_sheet.${actionKey}_note`);
            case "password":
            default:
                return this._translocoService.translate(`zelf_keys.biometrics_bottom_sheet.${actionKey}_password`);
        }
    }

    getInstructions(): string {
        switch (this.itemType) {
            case "payment-card":
                return this._translocoService.translate("zelf_keys.biometrics_bottom_sheet.instructions.payment_card");
            case "note":
                return this._translocoService.translate("zelf_keys.biometrics_bottom_sheet.instructions.note");
            case "password":
            default:
                return this._translocoService.translate("zelf_keys.biometrics_bottom_sheet.instructions.password");
        }
    }

    getItemType(): string {
        switch (this.itemType) {
            case "password":
                return this._translocoService.translate("zelf_keys.data_types.password");
            case "note":
                return this._translocoService.translate("zelf_keys.data_types.note");
            case "payment-card":
                return this._translocoService.translate("zelf_keys.data_types.payment_card");
            default:
                return this._translocoService.translate("zelf_keys.biometrics_bottom_sheet.item");
        }
    }

    getItemInfo(): string {
        if (!this.itemData) return "";

        switch (this.itemType) {
            case "password":
                if (this.itemData?.publicData?.website) {
                    try {
                        const url = new URL(this.itemData?.publicData?.website);

                        return url.hostname;
                    } catch {
                        return this.itemData?.publicData?.website;
                    }
                }

                return this.itemData.username || this._translocoService.translate("zelf_keys.data_types.password");
            case "payment-card":
                if (this.itemData.cardNumber) {
                    const cardNumber = this.itemData.cardNumber.replace(/\s/g, "");

                    return `**** **** **** ${cardNumber.slice(-4)}`;
                }

                return this.itemData.cardName || this._translocoService.translate("zelf_keys.data_types.payment_card");
            case "note":
                return this.itemData.title || this._translocoService.translate("zelf_keys.data_types.note");
            default:
                return this._translocoService.translate("zelf_keys.biometrics_bottom_sheet.item");
        }
    }

    async onBiometricsSuccess(biometricData: BiometricResult): Promise<void> {
        if (this.mode === "decrypt") {
            try {
                this.isLoading = true;
                this.errorMessage = "";
                this._changeDetectorRef.detectChanges();

                const encryptedPassword = biometricData.password ? await this._httpWrapperService.encryptMessage(biometricData.password) : undefined;
                const retrievedData = await this._retrieveDataByCategory(biometricData.faceBase64, encryptedPassword);

                this._bottomSheetRef.dismiss({
                    ...biometricData,
                    retrievedData: retrievedData?.data || retrievedData,
                });
            } catch (error: any) {
                console.error(`Error retrieving ${this.itemType} data:`, error);

                this.isLoading = false;

                let errorMessage = this._translocoService.translate("zelf_keys.errors.retrieving", { type: this.itemType });

                if (error?.error?.error) {
                    errorMessage = error.error.error;
                } else if (error?.error?.message) {
                    errorMessage = error.error.message;
                } else if (error?.message) {
                    errorMessage = error.message;
                }

                this.errorMessage = errorMessage;
                this._changeDetectorRef.detectChanges();
            }

            return;
        }

        // For encrypt mode, store the data first
        try {
            this.isLoading = true;
            this.errorMessage = "";
            this._changeDetectorRef.detectChanges();

            const response = await this._storeDataByCategory(biometricData.faceBase64);

            // Store the result in the data passing service for the result page
            const resultData = response?.data || response;
            if (resultData) {
                // Map itemType to the form type expected by the guard
                let formType: string;
                switch (this.itemType) {
                    case "password":
                        formType = "passwords";
                        break;
                    case "note":
                        formType = "notes";
                        break;
                    case "payment-card":
                        formType = "payment-cards";
                        break;
                    default:
                        formType = this.itemType;
                }
                await this._dataPassingService.storeResult(formType, resultData);
            }

            // Only dismiss after successful storage
            this._bottomSheetRef.dismiss(biometricData);
        } catch (error: any) {
            console.error(`Error storing ${this.itemType} data:`, error);

            this.isLoading = false;

            let errorMessage = this._translocoService.translate("zelf_keys.errors.storing", { type: this.itemType });

            if (error?.error?.error) {
                errorMessage = error.error.error;
            } else if (error?.error?.message) {
                errorMessage = error.error.message;
            } else if (error?.message) {
                errorMessage = error.message;
            }

            this.errorMessage = errorMessage;
            this._changeDetectorRef.detectChanges();
        }
    }

    private async _storeDataByCategory(faceBase64: string): Promise<any> {
        if (!this.itemData || Object.keys(this.itemData).length === 0) {
            throw new Error(`No data available for ${this.itemType}. Cannot proceed with storage.`);
        }

        if (!this.wallet?.zelfProof) {
            throw new Error("Wallet zelfProof is required for storage.");
        }

        const walletKeys = {
            zelfProof: this.wallet.zelfProof,
            masterPassword: this.wallet.hasPassword ? this.itemData.masterPassword : undefined,
        };

        let response: any;

        switch (this.itemType) {
            case "note":
                const notePayload = {
                    title: this.itemData.title,
                    keyValuePairs: this.itemData.keyValuePairs,
                    folder: this.itemData.folder,
                    insideFolder: this.itemData.insideFolder,
                    faceBase64: faceBase64,
                    ...walletKeys,
                };

                response = await this._zelfKeysService.storeNotes(notePayload);
                break;

            case "password":
                const passwordPayload = {
                    website: this.itemData.url,
                    username: this.itemData.email,
                    password: this.itemData.password,
                    notes: this.itemData.notes,
                    folder: this.itemData.folder,
                    insideFolder: this.itemData.insideFolder,
                    name: this.itemData.title,
                    faceBase64: faceBase64,
                    ...walletKeys,
                };

                response = await this._zelfKeysService.storePasswordWithAuth(passwordPayload);
                break;

            case "payment-card":
                const cardPayload = {
                    cardName: this.itemData.cardName,
                    cardNumber: this.itemData.cardNumber,
                    expiryMonth: this.itemData.expiryMonth,
                    expiryYear: this.itemData.expiryYear,
                    folder: this.itemData.folder,
                    insideFolder: this.itemData.insideFolder,
                    cvv: this.itemData.cvv,
                    bankName: this.itemData.bankName,
                    faceBase64: faceBase64,
                    ...walletKeys,
                };

                response = await this._zelfKeysService.storeCreditCard(cardPayload);
                break;

            default:
                throw new Error(`Unsupported item type: ${this.itemType}`);
        }

        return response;
    }

    private async _retrieveDataByCategory(faceBase64: string, encryptedPassword?: string): Promise<any> {
        if (!this.itemData?.zelfProof) throw new Error(`No zelfProof available for ${this.itemType}. Cannot proceed with retrieval.`);

        const payload = {
            zelfProof: this.itemData.zelfProof,
            faceBase64: faceBase64, // Already encrypted from data-biometrics
            ...(encryptedPassword && { password: encryptedPassword }),
        };

        // Use the generic retrieve method which works for all types
        return await this._zelfKeysService.retrieve(payload);
    }

    onBiometricsCancel(): void {
        this._bottomSheetRef.dismiss();
    }

    onClose(): void {
        this._bottomSheetRef.dismiss();
    }
}
