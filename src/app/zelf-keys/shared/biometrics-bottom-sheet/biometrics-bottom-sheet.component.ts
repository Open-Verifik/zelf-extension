import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";

import { DataPassingService } from "app/services/data-passing.service";
import { ZelfKeysService } from "app/services/zelf-keys.service";
import { WalletService } from "app/wallet.service";
import { DecryptedItemData } from "../../../models/zelf-key-item.model";
import { DataBiometricsComponent } from "../data-biometrics/data-biometrics.component";
import { VaultService } from "app/vault.service";

export interface BiometricResult {
    faceBase64: string;
    password: string;
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
    hasStorageError: boolean = false;
    isLoading: boolean = false;
    itemData: any;
    itemType: string;
    mode: "encrypt" | "decrypt";
    wallet: any;

    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: BiometricsBottomSheetData,
        private _bottomSheetRef: MatBottomSheetRef<BiometricsBottomSheetComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _dataPassingService: DataPassingService,
        private _translocoService: TranslocoService,
        private _vaultService: VaultService,
        private _walletService: WalletService,
        private _zelfKeysService: ZelfKeysService
    ) {
        this.itemData = data.itemData;
        this.itemType = data.itemType;
        this.mode = data.mode;
    }

    async ngOnInit(): Promise<void> {
        await this._setWallet();
    }

    private async _setWallet(): Promise<void> {
        const wallet = await this._walletService.getFirstWalletFromStorage();

        if (!wallet?.name) return;

        this.wallet = wallet;
        this._changeDetectorRef.detectChanges();
    }

    private _getCategoryTranslationKey(): string {
        switch (this.itemType) {
            case "password":
                return "zelf_keys.categories.password";
            case "note":
                return "zelf_keys.categories.note";
            case "payment-card":
                return "zelf_keys.categories.payment_card";
            default:
                return "zelf_keys.biometrics_bottom_sheet.item";
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
            masterPassword: this.wallet.hasPassword ? this.itemData.masterPassword : undefined,
            zelfProof: this.wallet.zelfProof,
        };

        let response: any;

        switch (this.itemType) {
            case "note":
                const notePayload = {
                    faceBase64: faceBase64,
                    folder: this.itemData.folder,
                    insideFolder: this.itemData.insideFolder,
                    keyValuePairs: this.itemData.keyValuePairs,
                    title: this.itemData.title,
                    ...walletKeys,
                };

                response = await this._zelfKeysService.storeNotes(notePayload);

                break;
            case "password":
                const passwordPayload = {
                    faceBase64: faceBase64,
                    folder: this.itemData.folder,
                    insideFolder: this.itemData.insideFolder,
                    name: this.itemData.title,
                    notes: this.itemData.notes,
                    password: this.itemData.password,
                    username: this.itemData.email,
                    website: this.itemData.url,
                    ...walletKeys,
                };

                response = await this._zelfKeysService.storePasswordWithAuth(passwordPayload);

                break;
            case "payment-card":
                const cardPayload = {
                    bankName: this.itemData.bankName,
                    cardName: this.itemData.cardName,
                    cardNumber: this.itemData.cardNumber,
                    cvv: this.itemData.cvv,
                    expiryMonth: this.itemData.expiryMonth,
                    expiryYear: this.itemData.expiryYear,
                    faceBase64: faceBase64,
                    folder: this.itemData.folder,
                    insideFolder: this.itemData.insideFolder,
                    ...walletKeys,
                };

                response = await this._zelfKeysService.storeCreditCard(cardPayload);

                break;
            default:
                throw new Error(`Unsupported item type: ${this.itemType}`);
        }

        return response;
    }

    private async _retrieveDataByCategory(faceBase64: string): Promise<any> {
        if (!this.itemData?.zelfProof) throw new Error(`No zelfProof available for ${this.itemType}. Cannot proceed with retrieval.`);

        const { publicKey: clientPublicKey, privateKey: clientPrivateKey } = await this._vaultService.generateEphemeralKeyPair();

        const payload = {
            zelfProof: this.itemData.zelfProof,
            faceBase64: faceBase64,
            type: this.itemType,
            clientPublicKey,
        };

        const response = await this._zelfKeysService.retrieve(payload);

        const encryptedMessage = response?.data?.pgp?.encryptedMessage;

        if (encryptedMessage) {
            const jsonData = await this._vaultService.decryptWithPrivateKey(encryptedMessage, clientPrivateKey);

            response.data.metadata = JSON.parse(jsonData);
            delete response.data.pgp;
        }

        return response;
    }

    getTitle(): string {
        const actionKey = this.mode === "encrypt" ? "encrypt" : "decrypt";

        switch (this.itemType) {
            case "payment-card":
                return this._translocoService.translate(`zelf_keys.biometrics_bottom_sheet.${actionKey}_payment_card`);
            case "note":
                return this._translocoService.translate(`zelf_keys.biometrics_bottom_sheet.${actionKey}_note`);
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

    async onBiometricsSuccess(biometricData: any): Promise<void> {
        if (this.mode === "decrypt") {
            try {
                this.isLoading = true;
                this.errorMessage = "";
                this._changeDetectorRef.detectChanges();

                const retrievedData = await this._retrieveDataByCategory(biometricData.faceBase64);

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

        try {
            this.isLoading = true;
            this.errorMessage = "";
            this.hasStorageError = false;
            this._changeDetectorRef.detectChanges();

            const response = await this._storeDataByCategory(biometricData.faceBase64);
            const resultData = response?.data || response;

            if (resultData) {
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

            this._bottomSheetRef.dismiss(biometricData);
        } catch (error: any) {
            console.error(`Error storing ${this.itemType} data:`, error);

            this.isLoading = false;
            this.hasStorageError = true;

            let translatedError: string | null = null;

            const errorKeys = [error?.error?.error, error?.error?.message, error?.message].filter(Boolean);

            for (const errorKey of errorKeys) {
                if (!errorKey) continue;

                const formattedKey = `errors.${errorKey}`;
                const translation = this._translocoService.translate(formattedKey);

                if (translation !== formattedKey) {
                    translatedError = translation;
                    break;
                }
            }

            // If we have a translatable error, use it; otherwise use generic message
            if (translatedError) {
                this.errorMessage = translatedError;
            } else {
                const categoryKey = this._getCategoryTranslationKey();
                const category = this._translocoService.translate(categoryKey);

                this.errorMessage = this._translocoService.translate("zelf_keys.biometrics_bottom_sheet.error.storage_failed", {
                    category,
                });
            }

            this._changeDetectorRef.detectChanges();
        }
    }

    onBiometricsCancel(): void {
        this._bottomSheetRef.dismiss();
    }

    onClose(): void {
        this._bottomSheetRef.dismiss();
    }
}
