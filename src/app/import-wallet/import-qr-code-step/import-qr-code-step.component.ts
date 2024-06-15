import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { TranslocoService } from "@ngneat/transloco";
import { WalletService } from "app/wallet.service";

@Component({
	selector: "import-qr-code-step",
	templateUrl: "./import-qr-code-step.component.html",
	styleUrls: ["../../main.scss", "./import-qr-code-step.component.scss"],
})
export class ImportQrCodeStepComponent implements OnInit {
	session: any;
	wallet: any;

	constructor(
		private _router: Router,
		private _walletService: WalletService,
		private snackBar: MatSnackBar,
		private _translocoService: TranslocoService
	) {
		this.session = this._walletService.getSessionData();

		this.wallet = this._walletService.getWallet();
	}

	ngOnInit(): void {
		console.log({ sessionInOnInit: this.session, wallet: this.wallet });
	}

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
		navigator.clipboard.writeText(this.wallet.publicData.ethAddress).then(
			() => {
				this.snackBar.open(this._translocoService.translate("common.copy_to_clipboard"), this._translocoService.translate("common.close"), {
					duration: 5000,
					verticalPosition: "bottom",
				});
			},
			(err) => {
				this.snackBar.open(
					this._translocoService.translate("common.failed_to_copy_to_clipboard"),
					this._translocoService.translate("common.close"),
					{
						duration: 3000,
						horizontalPosition: "center",
						verticalPosition: "bottom",
					}
				);
			}
		);
	}

	goToInstructions(): void {
		this._router.navigate(["extension-instructions"]);
	}
}
