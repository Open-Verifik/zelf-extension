import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { TranslocoService } from "@ngneat/transloco";
import { ChromeService } from "app/chrome.service";
import { Wallet, WalletModel } from "app/wallet";

@Component({
	selector: "home-active-wallet",
	template: `
		<div class="home-main bg-white" *ngIf="wallet">
			<div class="home-active-wallet-body" fxLayout="column" fxLayoutAlign="start center">
				<div class="home-active-wallet-qr-wrapper">
					<img class="home-active-wallet-qr" [src]="wallet.image" />
				</div>

				<div class="home-active-wallet-button">
					<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 16 16" fill="none">
						<circle cx="8" cy="8" r="8" fill="#E3E1EC" />
						<path
							d="M7.76699 9.78485V6.61206L4.66797 7.96957L7.76699 9.78485ZM7.76699 6.39393V2.66853L4.76783 7.70763L7.76699 6.39393ZM7.96677 2.66699V6.39393L11.0081 7.7262L7.96677 2.66699ZM7.96677 6.61206V9.78494L11.068 7.97047L7.96677 6.61206ZM7.76699 12.975V10.4231L4.68881 8.62082L7.76699 12.975ZM7.96677 12.975L11.045 8.62082L7.96677 10.4231V12.975Z"
							fill="#1B1B1F"
						/>
					</svg>
					<div class="home-active-wallet-button-text" (click)="copyAddress(wallet.ethAddress)">
						<div class="home-active-wallet-button-text-title">{{ "common.eth_address" | transloco }}<br /></div>
						<div class="home-active-wallet-button-text-address">{{ wallet.ethAddress }}</div>
					</div>
				</div>

				<div class="home-active-wallet-button">
					<svg
						width="28"
						height="28"
						version="1.1"
						id="Layer_1"
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						x="0px"
						y="0px"
						viewBox="0 0 397.7 311.7"
						style="enable-background:new 0 0 397.7 311.7;"
						xml:space="preserve"
					>
						<style type="text/css">
							.st0 {
								fill: url(#SVGID_1_);
							}
							.st1 {
								fill: url(#SVGID_2_);
							}
							.st2 {
								fill: url(#SVGID_3_);
							}
						</style>
						<linearGradient
							id="SVGID_1_"
							gradientUnits="userSpaceOnUse"
							x1="360.8791"
							y1="351.4553"
							x2="141.213"
							y2="-69.2936"
							gradientTransform="matrix(1 0 0 -1 0 314)"
						>
							<stop offset="0" style="stop-color:#00FFA3" />
							<stop offset="1" style="stop-color:#DC1FFF" />
						</linearGradient>
						<path
							class="st0"
							d="M64.6,237.9c2.4-2.4,5.7-3.8,9.2-3.8h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5
		c-5.8,0-8.7-7-4.6-11.1L64.6,237.9z"
						/>
						<linearGradient
							id="SVGID_2_"
							gradientUnits="userSpaceOnUse"
							x1="264.8291"
							y1="401.6014"
							x2="45.163"
							y2="-19.1475"
							gradientTransform="matrix(1 0 0 -1 0 314)"
						>
							<stop offset="0" style="stop-color:#00FFA3" />
							<stop offset="1" style="stop-color:#DC1FFF" />
						</linearGradient>
						<path
							class="st1"
							d="M64.6,3.8C67.1,1.4,70.4,0,73.8,0h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5
		c-5.8,0-8.7-7-4.6-11.1L64.6,3.8z"
						/>
						<linearGradient
							id="SVGID_3_"
							gradientUnits="userSpaceOnUse"
							x1="312.5484"
							y1="376.688"
							x2="92.8822"
							y2="-44.061"
							gradientTransform="matrix(1 0 0 -1 0 314)"
						>
							<stop offset="0" style="stop-color:#00FFA3" />
							<stop offset="1" style="stop-color:#DC1FFF" />
						</linearGradient>
						<path
							class="st2"
							d="M333.1,120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8,0-8.7,7-4.6,11.1l62.7,62.7c2.4,2.4,5.7,3.8,9.2,3.8h317.4
		c5.8,0,8.7-7,4.6-11.1L333.1,120.1z"
						/>
					</svg>

					<div class="home-active-wallet-button-text" (click)="copyAddress(wallet.solanaAddress)">
						<div class="home-active-wallet-button-text-title">{{ "common.solana_address" | transloco }}<br /></div>
						<div class="home-active-wallet-button-text-address">{{ wallet.solanaAddress }}</div>
					</div>
				</div>

				<div class="home-active-wallet-button" (click)="downloadQRCode()">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
						<path
							d="M16.59 9.5H15V4.5C15 3.95 14.55 3.5 14 3.5H10C9.45 3.5 9 3.95 9 4.5V9.5H7.41C6.52 9.5 6.07 10.58 6.7 11.21L11.29 15.8C11.68 16.19 12.31 16.19 12.7 15.8L17.29 11.21C17.92 10.58 17.48 9.5 16.59 9.5ZM5 19.5C5 20.05 5.45 20.5 6 20.5H18C18.55 20.5 19 20.05 19 19.5C19 18.95 18.55 18.5 18 18.5H6C5.45 18.5 5 18.95 5 19.5Z"
							fill="#010333"
						/>
					</svg>
					<div class="home-active-wallet-qr-download-button-text">
						<div class="home-active-wallet-qr-download-button-text-title">{{ "import_wallet.qr_code_step.download_qr" | transloco }}</div>
					</div>
				</div>

				<div class="home-active-wallet-button" (click)="showPrivateKey()">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
						<mask id="mask0_4734_36001" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
							<rect width="24" height="24" fill="#D9D9D9" />
						</mask>
						<g mask="url(#mask0_4734_36001)">
							<path
								d="M6 22C5.45 22 4.97917 21.8042 4.5875 21.4125C4.19583 21.0208 4 20.55 4 20V10C4 9.45 4.19583 8.97917 4.5875 8.5875C4.97917 8.19583 5.45 8 6 8H7V6C7 4.61667 7.4875 3.4375 8.4625 2.4625C9.4375 1.4875 10.6167 1 12 1C13.3833 1 14.5625 1.4875 15.5375 2.4625C16.5125 3.4375 17 4.61667 17 6V8H18C18.55 8 19.0208 8.19583 19.4125 8.5875C19.8042 8.97917 20 9.45 20 10V20C20 20.55 19.8042 21.0208 19.4125 21.4125C19.0208 21.8042 18.55 22 18 22H6ZM6 20H18V10H6V20ZM12 17C12.55 17 13.0208 16.8042 13.4125 16.4125C13.8042 16.0208 14 15.55 14 15C14 14.45 13.8042 13.9792 13.4125 13.5875C13.0208 13.1958 12.55 13 12 13C11.45 13 10.9792 13.1958 10.5875 13.5875C10.1958 13.9792 10 14.45 10 15C10 15.55 10.1958 16.0208 10.5875 16.4125C10.9792 16.8042 11.45 17 12 17ZM9 8H15V6C15 5.16667 14.7083 4.45833 14.125 3.875C13.5417 3.29167 12.8333 3 12 3C11.1667 3 10.4583 3.29167 9.875 3.875C9.29167 4.45833 9 5.16667 9 6V8Z"
								fill="#1C1B1F"
							/>
						</g>
					</svg>
					<div class="home-active-wallet-button-text">
						<div class="home-active-wallet-private-key-button-text">{{ "active_wallet.show_private_key" | transloco }}</div>
					</div>
				</div>
			</div>
		</div>
	`,
	styleUrls: ["./home-active-wallet.component.scss", "../../main.scss"],
})
export class HomeActiveWalletComponent implements OnInit {
	wallet!: Wallet;

	constructor(
		private _translocoService: TranslocoService,
		private snackBar: MatSnackBar,
		private _router: Router,
		private _chromeService: ChromeService
	) {}

	async ngOnInit(): Promise<any> {
		const wallet = (await this._chromeService.getItem("wallet")) || {};

		this.wallet = new WalletModel(wallet);
	}

	downloadQRCode(): void {
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
		a.download = `${this.wallet._id || this.wallet.name}.png`; // Set the file name
		a.style.display = "none";
		document.body.appendChild(a);
		a.click(); // Simulate the click event

		// Clean up by revoking the object URL and removing the anchor element
		URL.revokeObjectURL(blobUrl);

		document.body.removeChild(a);
	}

	copyAddress(address: string): void {
		navigator.clipboard.writeText(address).then(
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

	showPrivateKey(): void {
		this._chromeService.setItem("currentZelfName", this.wallet.name);

		this._chromeService.setItem("tempWalletQrCode", this.wallet.image);

		this._router.navigate(["/find-wallet"]);
	}
}
