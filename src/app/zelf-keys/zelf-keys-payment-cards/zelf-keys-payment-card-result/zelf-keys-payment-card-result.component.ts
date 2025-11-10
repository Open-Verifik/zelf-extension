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

        let parsedCardData: any = {};

        if (this.result?.publicData?.card) {
            try {
                parsedCardData = JSON.parse(this.result?.publicData?.card);
            } catch (error) {
                console.error("Error parsing card data:", error);
            }
        }

        let expiryMonth = "";
        let expiryYear = "";

        if (parsedCardData.expires) {
            const [month, year] = parsedCardData.expires.split("/");

            expiryMonth = month;
            expiryYear = year ? `20${year}` : ""; // Convert "26" to "2026"
        }

        this.result.publicData.cardName = parsedCardData.name;
        this.result.publicData.cardNumber = parsedCardData.number;
        this.result.publicData.expiryMonth = expiryMonth;
        this.result.publicData.expiryYear = expiryYear;
        this.result.publicData.bankName = parsedCardData.bankName;

        if (this.result) {
            this.isSuccess = this.result?.success === true;

            if (this.isSuccess) {
                await this.zelfKeysDataService.clearCache();

                return;
            }

            this.error = this.result?.message || this._translocoService.translate("errors.unknown");

            return;
        }

        this.error = this._translocoService.translate("zelf_keys.payment_cards.result.error.no_data");
    }

    async onBackToCards(): Promise<void> {
        await this.dataPassingService.clearAll("payment-cards");

        this.router.navigate(["/zelf-keys/payment-cards"]);
    }

    async onAddAnother(): Promise<void> {
        await this.dataPassingService.clearAll("payment-cards");

        this.router.navigate(["/zelf-keys/payment-cards/new"]);
    }

    async copyZelfProof(): Promise<void> {
        if (!this.result?.zelfProof) return;

        await this._copyToClipboard(this.result.zelfProof);
    }

    onImageError(event: Event): void {
        const img = event.target as HTMLImageElement;

        img.style.display = "none";

        const container = img.parentElement;

        if (!container) return;

        container.innerHTML = `<div class="image-error">${this._translocoService.translate("zelf_keys.common.image_not_available")}</div>`;
    }

    onDownloadZelfProof(): void {
        if (!this.result?.url) return;

        const link = document.createElement("a");

        link.href = this.result.url;
        link.download = `zelfproof-${this.result.publicData?.cardName || "payment-card"}.png`;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    }
}
