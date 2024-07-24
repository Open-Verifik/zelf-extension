import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CryptoService } from "app/crypto.service";
import { EthereumService } from "app/eth.service";
import { Wallet, WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";

@Component({
	selector: "home-header",
	template: `
		<!-- HEADER -->
		<div class="home-main-header">
			<div class="home-header-left">
				<div class="home-icon-container">
					<div class="home-icon home-header-left">
						<div class="home-icon-svg">
							<svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
								<path
									d="M16.625 6.75L14.9375 3.75H12.455L11.1875 1.5H7.8125L6.545 3.75H4.0625L2.375 6.75L3.6425 9L2.375 11.25L4.0625 14.25H6.545L7.8125 16.5H11.1875L12.455 14.25H14.9375L16.625 11.25L15.3575 9L16.625 6.75ZM14.9075 6.75L14.0675 8.25H12.4625L11.6225 6.75L12.4625 5.25H14.0675L14.9075 6.75ZM8.705 10.5L7.865 9L8.705 7.5H10.295L11.135 9L10.295 10.5H8.705ZM10.31 3L11.15 4.485L10.295 6H8.705L7.85 4.485L8.69 3H10.31ZM4.94 5.25H6.545L7.385 6.75L6.545 8.25H4.94L4.0925 6.75L4.94 5.25ZM4.0925 11.25L4.9325 9.75H6.5375L7.3775 11.25L6.5375 12.75H4.94L4.0925 11.25ZM8.69 15L7.85 13.515L8.705 12H10.295L11.1425 13.515L10.31 15H8.69ZM14.06 12.75H12.455L11.615 11.25L12.455 9.75H14.06L14.9 11.25L14.06 12.75Z"
									fill="#46464F"
								/>
							</svg>
						</div>
						<div class="home-icon-svg">
							<svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
								<path
									d="M12.9425 6.22168L9.5 9.65668L6.0575 6.22168L5 7.27918L9.5 11.7792L14 7.27918L12.9425 6.22168Z"
									fill="#46464F"
								/>
							</svg>
						</div>
					</div>
				</div>
			</div>
			<div class="home-header-center">
				<div class="home-account-info cursor-pointer" (click)="openAccountsPage()">
					<div class="home-account-name">Account</div>

					<div class="home-account-dropdown">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
							<path d="M16.59 8.29492L12 12.8749L7.41 8.29492L6 9.70492L12 15.7049L18 9.70492L16.59 8.29492Z" fill="#1F1F1F" />
						</svg>
					</div>
				</div>
			</div>
			<div class="home-header-right" *ngIf="wallet">
				<div (click)="openFullPage()" class="home-wallet">
					<div class="home-wallet-image">
						<img [src]="wallet.image" *ngIf="wallet && wallet.image" />
					</div>
				</div>
				<div class="home-wallet-icon" [matMenuTriggerFor]="settingsMenu">
					<svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
						<path
							d="M12.5 8C13.6 8 14.5 7.1 14.5 6C14.5 4.9 13.6 4 12.5 4C11.4 4 10.5 4.9 10.5 6C10.5 7.1 11.4 8 12.5 8ZM12.5 10C11.4 10 10.5 10.9 10.5 12C10.5 13.1 11.4 14 12.5 14C13.6 14 14.5 13.1 14.5 12C14.5 10.9 13.6 10 12.5 10ZM12.5 16C11.4 16 10.5 16.9 10.5 18C10.5 19.1 11.4 20 12.5 20C13.6 20 14.5 19.1 14.5 18C14.5 16.9 13.6 16 12.5 16Z"
							fill="#46464F"
						/>
					</svg>
				</div>
			</div>
		</div>

		<mat-menu #settingsMenu="matMenu" xPosition="before" yPosition="above">
			<button mat-menu-item>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
					<path
						d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM19.46 9.12L16.68 10.27C16.17 8.91 15.1 7.83 13.73 7.33L14.88 4.55C16.98 5.35 18.65 7.02 19.46 9.12ZM12 15C10.34 15 9 13.66 9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12C15 13.66 13.66 15 12 15ZM9.13 4.54L10.3 7.32C8.92 7.82 7.83 8.91 7.32 10.29L4.54 9.13C5.35 7.02 7.02 5.35 9.13 4.54ZM4.54 14.87L7.32 13.72C7.83 15.1 8.91 16.18 10.29 16.68L9.12 19.46C7.02 18.65 5.35 16.98 4.54 14.87ZM14.88 19.46L13.73 16.68C15.1 16.17 16.18 15.09 16.68 13.71L19.46 14.88C18.65 16.98 16.98 18.65 14.88 19.46Z"
						fill="#46464F"
					/>
				</svg>
				<span class="mat-menu-item-text">{{ "home.support_button" | transloco }}</span>
			</button>
			<mat-divider> </mat-divider>
			<button mat-menu-item>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
					<path
						d="M19.4328 12.98C19.4728 12.66 19.5028 12.34 19.5028 12C19.5028 11.66 19.4728 11.34 19.4328 11.02L21.5428 9.37C21.7328 9.22 21.7828 8.95 21.6628 8.73L19.6628 5.27C19.5728 5.11 19.4028 5.02 19.2228 5.02C19.1628 5.02 19.1028 5.03 19.0528 5.05L16.5628 6.05C16.0428 5.65 15.4828 5.32 14.8728 5.07L14.4928 2.42C14.4628 2.18 14.2528 2 14.0028 2H10.0028C9.75277 2 9.54277 2.18 9.51277 2.42L9.13277 5.07C8.52277 5.32 7.96277 5.66 7.44277 6.05L4.95277 5.05C4.89277 5.03 4.83277 5.02 4.77277 5.02C4.60277 5.02 4.43277 5.11 4.34277 5.27L2.34277 8.73C2.21277 8.95 2.27277 9.22 2.46277 9.37L4.57277 11.02C4.53277 11.34 4.50277 11.67 4.50277 12C4.50277 12.33 4.53277 12.66 4.57277 12.98L2.46277 14.63C2.27277 14.78 2.22277 15.05 2.34277 15.27L4.34277 18.73C4.43277 18.89 4.60277 18.98 4.78277 18.98C4.84277 18.98 4.90277 18.97 4.95277 18.95L7.44277 17.95C7.96277 18.35 8.52277 18.68 9.13277 18.93L9.51277 21.58C9.54277 21.82 9.75277 22 10.0028 22H14.0028C14.2528 22 14.4628 21.82 14.4928 21.58L14.8728 18.93C15.4828 18.68 16.0428 18.34 16.5628 17.95L19.0528 18.95C19.1128 18.97 19.1728 18.98 19.2328 18.98C19.4028 18.98 19.5728 18.89 19.6628 18.73L21.6628 15.27C21.7828 15.05 21.7328 14.78 21.5428 14.63L19.4328 12.98ZM17.4528 11.27C17.4928 11.58 17.5028 11.79 17.5028 12C17.5028 12.21 17.4828 12.43 17.4528 12.73L17.3128 13.86L18.2028 14.56L19.2828 15.4L18.5828 16.61L17.3128 16.1L16.2728 15.68L15.3728 16.36C14.9428 16.68 14.5328 16.92 14.1228 17.09L13.0628 17.52L12.9028 18.65L12.7028 20H11.3028L10.9528 17.52L9.89277 17.09C9.46277 16.91 9.06277 16.68 8.66277 16.38L7.75277 15.68L6.69277 16.11L5.42277 16.62L4.72277 15.41L5.80277 14.57L6.69277 13.87L6.55277 12.74C6.52277 12.43 6.50277 12.2 6.50277 12C6.50277 11.8 6.52277 11.57 6.55277 11.27L6.69277 10.14L5.80277 9.44L4.72277 8.6L5.42277 7.39L6.69277 7.9L7.73277 8.32L8.63277 7.64C9.06277 7.32 9.47277 7.08 9.88277 6.91L10.9428 6.48L11.1028 5.35L11.3028 4H12.6928L13.0428 6.48L14.1028 6.91C14.5328 7.09 14.9328 7.32 15.3328 7.62L16.2428 8.32L17.3028 7.89L18.5728 7.38L19.2728 8.59L18.2028 9.44L17.3128 10.14L17.4528 11.27ZM12.0028 8C9.79277 8 8.00277 9.79 8.00277 12C8.00277 14.21 9.79277 16 12.0028 16C14.2128 16 16.0028 14.21 16.0028 12C16.0028 9.79 14.2128 8 12.0028 8ZM12.0028 14C10.9028 14 10.0028 13.1 10.0028 12C10.0028 10.9 10.9028 10 12.0028 10C13.1028 10 14.0028 10.9 14.0028 12C14.0028 13.1 13.1028 14 12.0028 14Z"
						fill="#46464F"
					/>
				</svg>
				<span class="mat-menu-item-text">{{ "home.settings_button" | transloco }}</span>
			</button>
		</mat-menu>
	`,
	styleUrls: ["../home.component.scss", "../../main.scss"],
})
export class HomeHeaderComponent implements OnInit {
	@Input() shareables: any;
	view: string;
	title: string = "something";
	wallet!: Wallet;
	balances: any;
	selectedTab: string;

	constructor(
		private _router: Router,
		private _walletService: WalletService,
		private _ethService: EthereumService,
		private _cryptoService: CryptoService
	) {
		this.view = "home";
		this.selectedTab = "assets";
	}

	ngOnInit(): void {
		let wallet = localStorage.getItem("wallet");

		const wallets = localStorage.getItem("wallets");

		if (!wallet && !wallets) {
			this._router.navigate(["/onboarding"]);

			return;
		}

		this.wallet = new WalletModel(JSON.parse(wallet || "{}"));

		if ((!wallet && wallets) || !this.wallet.ethAddress) {
			wallet = JSON.parse(wallets || "[]")[0];

			if (!wallet) return;

			this.wallet = new WalletModel(wallet);

			localStorage.setItem("wallet", JSON.stringify(wallet));
		}
	}

	openAccountsPage(): void {
		this.shareables.view = this.shareables.view === "home" ? "accountsPage" : "home";

		this._router.navigate(["/home"], { queryParams: { view: this.shareables.view } });
	}

	openFullPage(): void {
		// Use chrome.runtime.getURL to get the full URL of the extension page
		try {
			const url = chrome.runtime.getURL("index.html");

			chrome.tabs.create({ url });
		} catch (exception) {}

		this.shareables.view = this.shareables.view === "home" ? "activeAccountPage" : "home";
	}
}
