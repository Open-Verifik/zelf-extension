import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";

import { ZelfKeysService } from "app/services/zelf-keys.service";
import { CopyToClipboardBase } from "../../../base/copy-to-clipboard/copy-to-clipboard.base";
import { ChromeService } from "../../../chrome.service";
import { DecryptedPaymentCardData, PaymentCardItem } from "../../../models/zelf-key-item.model";
import { PaymentCardDataService } from "../../../services/payment-card-data.service";
import { ScrollToSectionService } from "../../../services/scroll-to-section.service";
import {
    BiometricResult,
    BiometricsBottomSheetComponent,
    BiometricsBottomSheetData,
} from "../../shared/biometrics-bottom-sheet/biometrics-bottom-sheet.component";

@Component({
    imports: [CommonModule, TranslocoModule],
    selector: "zelf-keys-payment-card-detail",
    styleUrls: ["./zelf-keys-payment-card-detail.component.scss"],
    templateUrl: "./zelf-keys-payment-card-detail.component.html",
})
export class ZelfKeysPaymentCardDetailComponent extends CopyToClipboardBase implements OnInit {
    decryptedData: DecryptedPaymentCardData | null = null;
    error: string | null = null;
    isDecrypted = false;
    isLoading = false;
    paymentCard: PaymentCardItem | null = null;
    showBiometrics = false;
    showCardNumber = false;
    showCvv = false;

    constructor(
        private _bottomSheet: MatBottomSheet,
        private _paymentCardDataService: PaymentCardDataService,
        private _router: Router,
        private _scrollToSectionService: ScrollToSectionService,
        private _zelfKeysService: ZelfKeysService,
        protected _chromeService: ChromeService,
        protected _snackBar: MatSnackBar,
        protected _translocoService: TranslocoService
    ) {
        super(_chromeService, _snackBar, _translocoService);
    }

    ngOnInit(): void {
        this.loadPaymentCardData();
    }

    getCardBankName(): string {
        if (this.paymentCard?.publicData?.card) {
            try {
                const cardData = this._parseJsonSafely(this.paymentCard.publicData.card);
                return cardData.bankName || this._translocoService.translate("zelf_keys.data_types.payment_card");
            } catch {
                return this._translocoService.translate("zelf_keys.data_types.payment_card");
            }
        }
        return this._translocoService.translate("zelf_keys.data_types.payment_card");
    }

    loadPaymentCardData(): void {
        this.paymentCard = this._paymentCardDataService.getCurrentPaymentCard();

        if (!this.paymentCard) {
            setTimeout(() => {
                this._router.navigate(["/zelf-keys/payment-cards"]);
            }, 100);
            return;
        }

        // Ensure publicData has required fields
        if (this.paymentCard.publicData && !this.paymentCard.publicData.type) {
            this.paymentCard.publicData.type = "credit_card";
        }
    }

    onDecryptClick(): void {
        const itemData = {
            ...this.paymentCard,
            zelfProof: (this.paymentCard as any).zelfProof || this.paymentCard?.publicData?.zelfProof,
        };

        const bottomSheetRef = this._bottomSheet.open(BiometricsBottomSheetComponent, {
            backdropClass: "zelf-backdrop",
            panelClass: "zelf-bottom-sheet-biometrics",
            data: {
                itemData: itemData,
                itemType: "payment-card",
                mode: "decrypt",
            } as BiometricsBottomSheetData,
        });

        bottomSheetRef.afterDismissed().subscribe((result: BiometricResult | undefined) => {
            if (result) {
                this.onBiometricsSuccess(result);
            }
        });
    }

    onBiometricsSuccess(biometricData: BiometricResult): void {
        if (biometricData.retrievedData) {
            // The retrievedData is now a DecryptedItemData structure
            const decryptedItem = biometricData.retrievedData;

            // Parse the card data from publicData.card JSON string
            let cardData: any = {};
            try {
                if ((decryptedItem.publicData as any)?.card) {
                    cardData = this._parseJsonSafely((decryptedItem.publicData as any).card);
                }
            } catch (error) {
                console.warn("Failed to parse card data from publicData.card");
            }

            this.decryptedData = {
                name: cardData.name || "",
                number: decryptedItem.metadata.cardNumber || "",
                expires: `${decryptedItem.metadata.expiryMonth}/${decryptedItem.metadata.expiryYear}` || "",
                bankName: cardData.bankName || "",
                cvv: decryptedItem.metadata.cvv || "",
            };
            this.isDecrypted = true;

            // Trigger scroll to decrypted content section
            this._scrollToSectionService.scrollToSection("payment-card-decrypted-content", "payment-card");
        } else {
            console.error("No retrieved data found in biometrics response");
            this.error = this._translocoService.translate("zelf_keys.payment_cards.detail.error.retrieve_failed");
        }
    }

    async decryptPaymentCard(biometricData: any): Promise<void> {
        this.isLoading = true;
        this.error = null;

        try {
            const payload = {
                zelfProof: this.paymentCard!.publicData.zelfProof || "",
                faceBase64: biometricData.faceBase64,
                password: biometricData.password || undefined,
            };

            const response = await this._zelfKeysService.retrievePassword(payload.zelfProof, payload.faceBase64, payload.password);

            if (response?.data?.metadata) {
                this.decryptedData = {
                    name: response.data.metadata.name || "",
                    number: response.data.metadata.number || "",
                    expires: response.data.metadata.expires || "",
                    bankName: response.data.metadata.bankName || "",
                    cvv: response.data.metadata.cvv || "",
                };

                this.showBiometrics = false;
            } else {
                throw new Error("Failed to decrypt payment card data");
            }
        } catch (error) {
            console.error("Error decrypting payment card:", error);
            this.error = this._translocoService.translate("zelf_keys.payment_cards.detail.error.decrypt_failed");
        } finally {
            this.isLoading = false;
        }
    }

    onBackToList(): void {
        this._router.navigate(["/zelf-keys/payment-cards"]);
    }

    onCopyCardName(): void {
        if (this.decryptedData?.name) {
            this._copyToClipboard(this.decryptedData.name);
        }
    }

    onCopyCardNumber(): void {
        if (this.decryptedData?.number) {
            this._copyToClipboard(this.decryptedData.number);
        }
    }

    onCopyExpiryDate(): void {
        if (this.decryptedData?.expires) {
            this._copyToClipboard(this.decryptedData.expires);
        }
    }

    onCopyBankName(): void {
        if (this.decryptedData?.bankName) {
            this._copyToClipboard(this.decryptedData.bankName);
        }
    }

    onToggleCvvVisibility(): void {
        this.showCvv = !this.showCvv;
    }

    onCopyCvv(): void {
        if (this.decryptedData?.cvv) {
            this._copyToClipboard(this.decryptedData.cvv);
        }
    }

    onToggleCardNumberVisibility(): void {
        this.showCardNumber = !this.showCardNumber;
    }

    onCopyPaymentCardId(): void {
        if (this.paymentCard?.id) {
            this._copyToClipboard(this.paymentCard.id);
        }
    }

    onCopyZelfProof(): void {
        if (this.paymentCard?.publicData?.zelfProof) {
            this._copyToClipboard(this.paymentCard.publicData.zelfProof);
        }
    }

    onImageError(event: Event): void {
        const img = event.target as HTMLImageElement;
        img.style.display = "none";
    }

    onDownloadZelfProof(): void {
        if (this.paymentCard?.url) {
            const link = document.createElement("a");
            link.href = this.paymentCard.url;
            link.download = `zelfproof-${this.paymentCard.id}.png`;
            link.click();
        }
    }

    getCardType(): string {
        // If decrypted, determine card type from number
        if (this.isDecrypted && this.decryptedData?.number) {
            const number = this.decryptedData.number.replace(/\s/g, "");
            if (number.startsWith("4")) return "VISA";
            if (number.startsWith("5") || number.startsWith("2")) return "MASTERCARD";
            if (number.startsWith("3")) return "AMEX";
            if (number.startsWith("6")) return "DISCOVER";
        }

        // If not decrypted, show generic card type
        return "CARD";
    }

    getMaskedCardNumber(): string {
        // If decrypted, show masked or full number based on visibility
        if (this.isDecrypted && this.decryptedData?.number) {
            if (this.showCardNumber) {
                return this.decryptedData.number;
            }

            const number = this.decryptedData.number.replace(/\s/g, "");
            const lastFour = number.slice(-4);
            const maskedLength = number.length - 4;
            const masked = "•".repeat(maskedLength);

            // Format with spaces like a typical card number
            return masked + " " + lastFour;
        }

        // If not decrypted, try to get last 4 digits from public data
        if (this.paymentCard?.publicData?.card) {
            try {
                const cardData = this._parseJsonSafely(this.paymentCard.publicData.card);
                if (cardData.number) {
                    const number = cardData.number.replace(/\s/g, "");
                    const lastFour = number.slice(-4);
                    return `•••• •••• •••• ${lastFour}`;
                }
            } catch {
                // Fall through to generic pattern
            }
        }

        // Fallback to generic masked pattern
        return "•••• •••• •••• ••••";
    }

    getExpiryDate(): string {
        // If decrypted, show actual expiry
        if (this.isDecrypted && this.decryptedData?.expires) {
            return this.decryptedData.expires;
        }

        // If not decrypted, try to get expiry from public data
        if (this.paymentCard?.publicData?.card) {
            try {
                const cardData = this._parseJsonSafely(this.paymentCard.publicData.card);
                if (cardData.expires) {
                    return cardData.expires;
                }
            } catch {
                // Fall through to generic pattern
            }
        }

        // Fallback to generic pattern
        return this._translocoService.translate("zelf_keys.payment_cards.detail.expiry_placeholder");
    }

    getPaymentCardType(): string {
        const type = this.paymentCard?.publicData?.type;

        if (!type) {
            return "N/A";
        }

        // Map type values to translation keys
        switch (type) {
            case "credit_card":
                return this._translocoService.translate("zelf_keys.data_types.payment_card");
            default:
                return type;
        }
    }

    getCardGradient(): string {
        // If decrypted, use card type-specific colors
        if (this.isDecrypted && this.decryptedData) {
            const cardType = this.getCardType().toLowerCase();

            switch (cardType) {
                case "visa":
                    return "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)";
                case "mastercard":
                    return "linear-gradient(135deg, #eb3349 0%, #f45c43 100%)";
                case "amex":
                    return "linear-gradient(135deg, #0066cc 0%, #004499 100%)";
                case "discover":
                    return "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)";
                default:
                    return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
            }
        }

        // If not decrypted, use the same dynamic color system as the main list
        if (this.paymentCard?.publicData?.zelfProof) {
            return this.getDynamicCardGradient(this.paymentCard.publicData.zelfProof);
        }

        // Fallback
        return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    }

    private _parseJsonSafely(jsonString: string): any {
        try {
            return JSON.parse(jsonString);
        } catch {
            return {};
        }
    }

    private getCardColor(zelfProof: string): string {
        // Use zelfProof as seed for consistent colors
        let hash = 0;
        for (let i = 0; i < zelfProof.length; i++) {
            const char = zelfProof.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash; // Convert to 32-bit integer
        }

        // Generate color based on hash
        const hue = Math.abs(hash) % 360;
        const saturation = 60 + (Math.abs(hash) % 30); // 60-90%
        const lightness = 45 + (Math.abs(hash) % 20); // 45-65%

        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    private getDynamicCardGradient(zelfProof: string): string {
        const baseColor = this.getCardColor(zelfProof);
        // Convert HSL to RGB for gradient calculation
        const hsl = baseColor.match(/\d+/g);
        if (!hsl) return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

        const h = parseInt(hsl[0]);
        const s = parseInt(hsl[1]);
        const l = parseInt(hsl[2]);

        // Create a complementary color for gradient
        const complementaryH = (h + 180) % 360;
        const lighterL = Math.min(95, l + 20);
        const darkerL = Math.max(25, l - 20);

        return `linear-gradient(135deg, hsl(${h}, ${s}%, ${lighterL}%) 0%, hsl(${complementaryH}, ${s}%, ${darkerL}%) 100%)`;
    }
}
