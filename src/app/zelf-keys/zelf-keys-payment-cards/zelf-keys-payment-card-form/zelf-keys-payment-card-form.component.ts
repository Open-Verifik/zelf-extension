import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";

import { Wallet } from "@shared/types/wallet.types";
import { WalletService } from "app/wallet.service";
import { HttpWrapperService } from "app/http-wrapper.service";
import { ChromeService } from "../../../chrome.service";
import { DataPassingService } from "../../../services/data-passing.service";
import {
    BiometricResult,
    BiometricsBottomSheetComponent,
    BiometricsBottomSheetData,
} from "../../shared/biometrics-bottom-sheet/biometrics-bottom-sheet.component";

@Component({
    imports: [CommonModule, TranslocoModule, RouterModule, FormsModule],
    selector: "zelf-keys-payment-card-form",
    styleUrls: ["./zelf-keys-payment-card-form.component.scss"],
    templateUrl: "./zelf-keys-payment-card-form.component.html",
})
export class ZelfKeysPaymentCardFormComponent implements OnInit {
    cardData = {
        bankName: "Chase Bank",
        cardName: "John Doe",
        cardNumber: "4111111111111111",
        cvv: "123",
        expiryMonth: "12",
        expiryYear: "2026",
        folder: "Personal",
        insideFolder: true,
        masterPassword: "",
        useMasterPassword: false,
    };

    formValid = false;
    hasMasterPassword = false;
    isNewCard = true;
    shareables: any = {};
    showMasterPassword = false;
    transformedCardData: any = null;
    wallet!: Wallet;

    constructor(
        private router: Router,
        private chromeService: ChromeService,
        private dataPassingService: DataPassingService,
        private _httpWrapperService: HttpWrapperService,
        private _walletService: WalletService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _bottomSheet: MatBottomSheet
    ) {}

    async ngOnInit(): Promise<void> {
        this.isNewCard = true;

        await this._setWallet();

        setTimeout(() => {
            this.checkFormValidity();
        }, 100);
    }

    private async _setWallet(): Promise<any> {
        const wallet = await this._walletService.getFirstWalletFromStorage();

        if (!wallet?.name) {
            this.router.navigate(["/welcome"]);

            return;
        }

        this.shareables.wallet = wallet;

        this.wallet = this.shareables.wallet;

        this.hasMasterPassword = wallet.hasPassword || false;

        this._changeDetectorRef.detectChanges();
        this.checkFormValidity();
    }

    toggleFolder(): void {
        this.cardData.insideFolder = !this.cardData.insideFolder;
    }

    toggleMasterPassword(): void {
        this.cardData.useMasterPassword = !this.cardData.useMasterPassword;

        if (!this.cardData.useMasterPassword) this.cardData.masterPassword = ""; // Clear password when toggling off

        this.checkFormValidity();
    }

    checkFormValidity(): void {
        const hasCardName = !!this.cardData.cardName?.trim();
        const hasCardNumber = !!this.cardData.cardNumber?.trim() && this.cardData.cardNumber.length >= 13;
        const hasExpiryMonth = !!this.cardData.expiryMonth;
        const hasExpiryYear = !!this.cardData.expiryYear && String(this.cardData.expiryYear).length === 4;
        const hasCvv = !!this.cardData.cvv?.trim() && this.cardData.cvv.length >= 3;
        const hasBankName = !!this.cardData.bankName?.trim();

        // Master password is optional - only validate if user chose to use it
        const hasMasterPassword = !!this.cardData.masterPassword;
        const masterPasswordValid = this.hasMasterPassword ? hasMasterPassword : true;

        // Backend validation requirements:
        // - cardName: required, minLength: 1
        // - cardNumber: required, minLength: 13, maxLength: 19
        // - expiryMonth: required, enum: ["01", "02", ..., "12"]
        // - expiryYear: required, minLength: 4, maxLength: 4
        // - cvv: required, minLength: 3, maxLength: 4
        // - bankName: required, minLength: 1
        // - masterPassword: optional (only if user enables it)

        this.formValid = hasCardName && hasCardNumber && hasExpiryMonth && hasExpiryYear && hasCvv && hasBankName && masterPasswordValid;
    }

    onCancel(): void {
        this.router.navigate(["/zelf-keys/payment-cards"]);
    }

    onBiometricsSuccess(biometricData: BiometricResult): void {
        // Navigate to result page after successful biometrics
        this.router.navigate(["/zelf-keys/payment-cards/result"]);
    }

    onBiometricsCancel(): void {
        // Bottom sheet handles its own dismissal
    }

    async onSave(): Promise<void> {
        if (!this.formValid) return;

        // Transform card data to match backend API expectations
        // Backend expects: cardName, cardNumber, expiryMonth, expiryYear, cvv, bankName
        // Encrypt sensitive data before storing
        this.transformedCardData = {
            cardName: this.cardData.cardName,
            cardNumber: await this._httpWrapperService.encryptMessage(this.cardData.cardNumber),
            expiryMonth: this.cardData.expiryMonth.padStart(2, "0"), // Ensure 2 digits
            expiryYear: this.cardData.expiryYear,
            cvv: await this._httpWrapperService.encryptMessage(this.cardData.cvv),
            bankName: this.cardData.bankName,
            folder: this.cardData.folder,
            insideFolder: this.cardData.insideFolder,
            useMasterPassword: this.cardData.useMasterPassword,
            masterPassword: await this._httpWrapperService.encryptMessage(this.cardData.masterPassword),
            type: "payment-cards",
        };

        await this.dataPassingService.storeData("payment-cards", this.transformedCardData);

        // Show biometrics bottom sheet instead of navigating
        this._openBiometricsBottomSheet();
    }

    // Helper method to format card number as user types
    onCardNumberChange(): void {
        // Remove all non-digits
        let value = this.cardData.cardNumber.replace(/\D/g, "");

        // Limit to 19 digits (max card length)
        if (value.length > 19) {
            value = value.substring(0, 19);
        }

        this.cardData.cardNumber = value;
        this.checkFormValidity();
    }

    // Helper method to format CVV as user types
    onCvvChange(): void {
        // Remove all non-digits
        let value = this.cardData.cvv.replace(/\D/g, "");

        // Limit to 4 digits (max CVV length)
        if (value.length > 4) {
            value = value.substring(0, 4);
        }

        this.cardData.cvv = value;
        this.checkFormValidity();
    }

    // Helper method to get card type from number
    getCardType(): string {
        const number = this.cardData.cardNumber;
        if (number.startsWith("4")) return "VISA";
        if (number.startsWith("5") || number.startsWith("2")) return "MASTERCARD";
        if (number.startsWith("3")) return "AMEX";
        if (number.startsWith("6")) return "DISCOVER";
        return "CARD";
    }

    // Helper method to mask card number for display
    getMaskedCardNumber(): string {
        const number = this.cardData.cardNumber;
        if (number.length < 4) return number;

        const lastFour = number.slice(-4);
        const masked = "•".repeat(Math.max(0, number.length - 4));
        return masked + lastFour;
    }

    toggleMasterPasswordVisibility(): void {
        this.showMasterPassword = !this.showMasterPassword;
    }

    private _openBiometricsBottomSheet(): void {
        const data: BiometricsBottomSheetData = {
            itemData: this.transformedCardData,
            itemType: "payment-card",
            mode: "encrypt",
        };

        const bottomSheetRef = this._bottomSheet.open(BiometricsBottomSheetComponent, {
            data: data,
            backdropClass: "zelf-backdrop",
            panelClass: "zelf-bottom-sheet-biometrics",
        });

        bottomSheetRef.afterDismissed().subscribe((result: BiometricResult | undefined) => {
            if (result) {
                this.onBiometricsSuccess(result);
            } else {
                this.onBiometricsCancel();
            }
        });
    }
}
