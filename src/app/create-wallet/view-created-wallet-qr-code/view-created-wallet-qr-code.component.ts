import { Component, Input, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { TranslocoService } from "@ngneat/transloco";
import { ChromeService } from "app/chrome.service";
import { Wallet, WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";

@Component({
	selector: "view-created-wallet-qr-code",
	template: `
		<div fxLayout="row" fxLayoutAlign="center center" class="zelf-card">
			<!-- class="view-wallet"
				fxLayout="row"
				fxLayoutAlign="start center"
				fxLayout.sm="column"
				fxLayoutAlign.sm="start center"
				fxLayout.xs="column"
				fxLayoutAlign.xs="start center"
				*ngIf="wallet" -->
			<div class="view-wallet" fxLayout="column" fxLayoutAlign="start center" *ngIf="wallet">
				<div class="view-wallet-left">
					<div class="view-wallet-left-header">
						<div class="view-wallet-title-div">
							<h2 class="m-0 text-center">{{ "create_wallet.view_wallet.title" | transloco }}</h2>
						</div>
						<div class="view-wallet-description">
							{{ "create_wallet.view_wallet.description" | transloco }}
							<br /><br />
							{{ "create_wallet.view_wallet.description_2" | transloco }}
						</div>
					</div>
					<div class="view-wallet-words-container">
						<ng-container *ngFor="let i of [0, 4, 8, 12, 16, 20]; let isLast = last">
							<div *ngIf="i < words.length" class="view-wallet-words-c-div">
								<div *ngFor="let word of words | slice : i : i + 4" class="view-wallet-word-container">
									<small>{{ word.id }}:</small>
									<div class="view-wallet-word">{{ word.word }}</div>
								</div>
							</div>
						</ng-container>
					</div>
				</div>

				<div class="view-wallet-right">
					<div class="view-wallet-image-container">
						<img class="view-wallet-image" [src]="wallet.image" />
					</div>
					<div class="view-wallet-qr-code-description">
						{{ "create_wallet.view_wallet.qr_code_description" | transloco }}
					</div>
					<div class="view-wallet-download-container" fxLayout="row" fxLayoutAlign="center center" (click)="downloadImage()">
						<div class="view-wallet-icon">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-6 h-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
								/>
							</svg>
						</div>
						<div class="view-wallet-qr-code-label" fxLayout="row" fxLayoutAlign="center center">
							{{ "create_wallet.view_wallet.download_qr_code" | transloco }}
						</div>
					</div>

					<div class="view-wallet-continue-container" *ngIf="holdData">
						<button mat-raised-button class="main-button view-wallet-continue-button" (click)="goToPaymentsPage()">
							{{ "payments.pay_now" | transloco }}
						</button>
					</div>

					<div class="view-wallet-continue-container" *ngIf="!holdData">
						<button mat-raised-button class="main-button view-wallet-continue-button" (click)="goToInstructions()">
							{{ "common.continue" | transloco }}
						</button>
					</div>
				</div>
				<span class="link" (click)="goToInstructions()" *ngIf="holdData"> {{ "payments.continue_withoutpaying" | transloco }} </span>
			</div>
		</div>
	`,
	styleUrls: ["./view-created-wallet-qr-code.component.scss", "../../main.scss"],
})
export class ViewCreatedWalletQrCodeComponent implements OnInit {
	@Input() walletType!: string; // Input property to accept view type
	wallet!: Wallet;
	words!: Array<any>;
	holdData: any;

	constructor(
		private snackBar: MatSnackBar,
		private _translocoService: TranslocoService,
		private _chromeService: ChromeService,
		private _router: Router
	) {}

	async ngOnInit(): Promise<any> {
		const walletType = this.walletType || "wallet";

		const wallet = await this._chromeService.getItem(walletType);

		this.holdData = wallet.ipfs?.metadata?.type === "hold" ? wallet.ipfs?.metadata : null;

		this.wallet = new WalletModel(wallet);

		console.log({ thisWallet: this.wallet, wallet });

		if (!this.wallet.ethAddress) {
			this._chromeService.removeItem(walletType);

			this._router.navigate(["/onboarding"]);

			return;
		}

		this._prepareWords();
	}

	_prepareWords(): void {
		this.words = [];

		const _words = this.wallet.metadata?.mnemonic.split(" ");

		for (let index = 0; index < _words.length; index++) {
			const word = _words[index];

			this.words.push({ id: index + 1, word });
		}
	}

	goToInstructions(): void {
		this.wallet.metadata = null;

		this._chromeService.setItem("wallet", this.wallet);

		this._router.navigate(["extension-instructions"]);
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
		a.click();

		URL.revokeObjectURL(blobUrl);

		document.body.removeChild(a);
	}

	goToPaymentsPage(): void {
		window.open(
			`https://payment.zelf.world/purchase?zelfName=${this.wallet.name}&durationToken=${localStorage.getItem("durationToken")}`,
			"_blank"
		);
	}

	copyPublicAddress(): void {
		navigator.clipboard.writeText(this.wallet.ethAddress).then(
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
}
