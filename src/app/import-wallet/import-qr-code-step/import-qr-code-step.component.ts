import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { TranslocoService } from "@ngneat/transloco";
import { CopyToClipboardBase } from "app/base/copy-to-clipboard/copy-to-clipboard.base";
import { ChromeService } from "app/chrome.service";
import { Wallet, WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";

@Component({
    selector: "import-qr-code-step",
    templateUrl: "./import-qr-code-step.component.html",
    styleUrls: ["../../main.scss", "./import-qr-code-step.component.scss"],
})
export class ImportQrCodeStepComponent extends CopyToClipboardBase implements OnInit {
    session: any;
    wallet!: Wallet;

    constructor(
        private _router: Router,
        private _walletService: WalletService,
        protected snackBar: MatSnackBar,
        protected _translocoService: TranslocoService,
        protected _chromeService: ChromeService
    ) {
        super(_chromeService, snackBar, _translocoService);

        this.session = this._walletService.getSessionData();

        this._chromeService.getItem("wallet").then((wallet) => {
            this.wallet = new WalletModel(wallet);
        });
    }

    ngOnInit(): void {}

    // Function to download the image
    downloadImage(): void {
        // Split the base64 string to get the mime type and the data
        const parts = this.wallet.image.split(";base64,");
        const mimeType = parts[0].split(":")[1];
        const imageData = parts[1];
        const byteCharacters = atob(imageData);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        // Create a new Blob object using the byteArray and the mime type
        const blob = new Blob([byteArray], { type: mimeType });

        // Create a URL for the blob object
        const blobUrl = URL.createObjectURL(blob);

        // Create a temporary anchor element and trigger a download
        const a = document.createElement("a");

        a.href = blobUrl;
        a.download = `${this.wallet._id}.png`; // Set the file name
        a.style.display = "none";
        document.body.appendChild(a);

        a.click(); // Simulate the click event

        // Clean up by revoking the object URL and removing the anchor element
        URL.revokeObjectURL(blobUrl);

        document.body.removeChild(a);
    }

    copyPublicAddress(): void {
        this._copyToClipboard(this.wallet.ethAddress);
    }

    async goToInstructions(): Promise<void> {
        this._router.navigate(["extension-instructions"]);

        await this._chromeService.setItem("wallet", this.wallet);
    }
}
