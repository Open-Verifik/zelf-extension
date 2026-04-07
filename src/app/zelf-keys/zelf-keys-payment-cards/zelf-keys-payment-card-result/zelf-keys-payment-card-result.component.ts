import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";

import { CopyToClipboardBase } from "app/base/copy-to-clipboard/copy-to-clipboard.base";
import { ChromeService } from "app/chrome.service";
import { DataPassingService } from "app/services/data-passing.service";
import { ZelfKeysDataService } from "app/services/zelf-keys-data.service";

@Component({
    imports: [CommonModule, TranslocoModule, RouterModule],
    selector: "zelf-keys-payment-card-result",
    styleUrls: ["./zelf-keys-payment-card-result.component.scss"],
    templateUrl: "./zelf-keys-payment-card-result.component.html",
})
export class ZelfKeysPaymentCardResultComponent extends CopyToClipboardBase implements OnInit {
    error: string | null = null;
    isSuccess = false;
    result: any = null;

    constructor(
        private dataPassingService: DataPassingService,
        private router: Router,
        private zelfKeysDataService: ZelfKeysDataService,
        protected chromeService: ChromeService,
        protected snackBar: MatSnackBar,
        protected translocoService: TranslocoService
    ) {
        super(chromeService, snackBar, translocoService);
    }

    async ngOnInit(): Promise<void> {
        this.result = this.dataPassingService.getResult("payment-cards");

        if (!this.result) {
            this.error = this._translocoService.translate("zelf_keys.payment_cards.result.error.no_data");

            return;
        }

        let parsedCardData: any = {};

        if (this.result?.ipfs?.publicData?.card || this.result?.publicData?.card) {
            const cardData = this.result?.ipfs?.publicData?.card || this.result?.publicData?.card;

            try {
                parsedCardData = JSON.parse(cardData);
            } catch (error) {
                console.error("Error parsing card data:", error);
            }
        }

        let expiryMonth = "";
        let expiryYear = "";

        if (parsedCardData.expires) {
            const [month, year] = parsedCardData.expires.split("/");

            expiryMonth = month;
            expiryYear = year ? `20${year}` : "";
        }

        if (!this.result.publicData) {
            this.result.publicData = {};
        }

        this.result.publicData.cardName = parsedCardData.name || "";
        this.result.publicData.cardNumber = parsedCardData.number || "";
        this.result.publicData.expiryMonth = expiryMonth;
        this.result.publicData.expiryYear = expiryYear;
        this.result.publicData.bankName = parsedCardData.bankName || "";

        this.isSuccess = this.result?.success === true || this.result?.ipfs?.saved === true || this.result?.walrus?.success === true;

        if (this.isSuccess) {
            await this.zelfKeysDataService.clearCache();

            return;
        }

        this.error = this.result?.message || this._translocoService.translate("errors.unknown");
    }

    async onBackToCards(): Promise<void> {
        await this.dataPassingService.clearAll("payment-cards");

        this.router.navigate(["/zelf-keys/vault"]);
    }

    async onAddAnother(): Promise<void> {
        await this.dataPassingService.clearAll("payment-cards");

        this.router.navigate(["/zelf-keys/payment-cards/new"]);
    }

    async copyZelfProof(): Promise<void> {
        if (!this.result?.zelfProof) return;

        await this._copyToClipboard(this.result.zelfProof);
    }

    async copyContractAddress(): Promise<void> {
        if (!this.result?.NFT?.contractAddress) return;

        await this._copyToClipboard(this.result.NFT.contractAddress);
    }

    onImageError(event: Event): void {
        const img = event.target as HTMLImageElement;

        img.style.display = "none";

        const container = img.parentElement;

        if (!container) return;

        container.innerHTML = `<div class="image-error">${this._translocoService.translate("zelf_keys.common.image_not_available")}</div>`;
    }

    onDownloadZelfProof(): void {
        const url = this.getZelfProofQRCodeUrl();

        if (!url) return;

        const link = document.createElement("a");

        link.href = url;
        link.download = `zelfproof-${this.getCardName() || "payment-card"}.png`;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    }

    getCardName(): string {
        return this.result?.publicData?.cardName || this.result?.ipfs?.publicData?.cardName || "N/A";
    }

    getBankName(): string {
        return this.result?.publicData?.bankName || this.result?.ipfs?.publicData?.bankName || "N/A";
    }

    getCardNumber(): string {
        return this.result?.publicData?.cardNumber || this.result?.ipfs?.publicData?.cardNumber || "N/A";
    }

    getExpiryMonth(): string {
        return this.result?.publicData?.expiryMonth || "";
    }

    getExpiryYear(): string {
        return this.result?.publicData?.expiryYear || "";
    }

    getExpiry(): string {
        const month = this.getExpiryMonth();
        const year = this.getExpiryYear();

        if (!month && !year) return "N/A";

        return `${month}/${year}`;
    }

    getZelfProofQRCodeUrl(): string | null {
        return this.result?.url || this.result?.zelfProofQRCode || this.result?.zelfQR || null;
    }

    getIpfsHash(): string {
        return (
            this.result?.ipfs?.ipfsHash ||
            this.result?.ipfs?.ipfs_pin_hash ||
            this.result?.ipfs?.cid ||
            this.result?.ipfs?.hash ||
            "N/A"
        );
    }

    getIpfsGatewayUrl(): string {
        return this.result?.ipfs?.url || this.result?.ipfs?.gatewayUrl || "N/A";
    }

    getIpfsFileSize(): number | null {
        return this.result?.ipfs?.size || this.result?.ipfs?.pinSize || null;
    }

    getIpfsUploadTimestamp(): string | null {
        return this.result?.ipfs?.date_pinned || this.result?.ipfs?.created_at || this.result?.ipfs?.timestamp || null;
    }

    getWalrusBlobId(): string | null {
        return this.result?.walrus?.blobId || null;
    }

    getWalrusPublicUrl(): string | null {
        return this.result?.walrus?.publicUrl || null;
    }

    getWalrusExplorerUrl(): string | null {
        return this.result?.walrus?.explorerUrl || null;
    }

    getWalrusSuccess(): boolean {
        return this.result?.walrus?.success === true;
    }
}
