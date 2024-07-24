import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Wallet, WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";

@Component({
	selector: "home-wallets-connected",
	template: `<div class="hwc-wrapper">
		<div class="hwc-content">
			<div class="hwc-header">
				<div class="hwc-header-title">{{ "wallets_connected.title" | transloco }}</div>
			</div>
			<div class="hwc-account-list">
				<div class="hwc-account-item" [ngClass]="{ 'hwc-account-item-alt': _index > 0 }" *ngFor="let wallet of wallets; let _index = index">
					<div class="hwc-account-item-icon">
						<div>
							<div class="hwc-account-item-icon-inner">
								<img [src]="wallet.image" alt="" class="w-full" />
							</div>
						</div>
					</div>
					<div class="hwc-account-item-info">
						<div class="hwc-account-item-name" *ngIf="wallet.name">{{ wallet.name }}</div>
						<div class="hwc-account-item-name" *ngIf="!wallet.name">{{ "wallets_connected.account" | transloco }} {{ _index + 1 }}</div>
						<div class="hwc-account-item-address">
							{{ displayAddress(wallet.ethAddress) }}
						</div>
					</div>
					<div class="hwc-account-item-balance">
						<div>
							<div>123 ETH</div>
							<div>1464,11 USD</div>
						</div>
					</div>

					<div class="hwc-account-item-balance-icon" [matMenuTriggerFor]="menu" (menuOpened)="setIndex(_index)">
						<div>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
								<path
									d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z"
									fill="#46464F"
								/>
							</svg>
						</div>
					</div>
				</div>

				<mat-menu #menu="matMenu" xPosition="before" yPosition="above">
					<button mat-menu-item>
						<span>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
								<path
									d="M19 19H5V5H12V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V12H19V19ZM14 3V5H17.59L7.76 14.83L9.17 16.24L19 6.41V10H21V3H14Z"
									fill="#46464F"
								/>
							</svg>
						</span>
						<span class="mat-menu-item-text">{{ "wallets_connected.see_on_scanner" | transloco }}</span>
					</button>
					<button mat-menu-item>
						<span>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
								<path d="M3 11H11V3H3V11ZM5 5H9V9H5V5Z" fill="#46464F" />
								<path d="M3 21H11V13H3V21ZM5 15H9V19H5V15Z" fill="#46464F" />
								<path d="M13 3V11H21V3H13ZM19 9H15V5H19V9Z" fill="#46464F" />
								<path d="M21 19H19V21H21V19Z" fill="#46464F" />
								<path d="M15 13H13V15H15V13Z" fill="#46464F" />
								<path d="M17 15H15V17H17V15Z" fill="#46464F" />
								<path d="M15 17H13V19H15V17Z" fill="#46464F" />
								<path d="M17 19H15V21H17V19Z" fill="#46464F" />
								<path d="M19 17H17V19H19V17Z" fill="#46464F" />
								<path d="M19 13H17V15H19V13Z" fill="#46464F" />
								<path d="M21 15H19V17H21V15Z" fill="#46464F" />
							</svg>
						</span>
						<span class="mat-menu-item-text">{{ "wallets_connected.see_qr_code" | transloco }}</span>
					</button>
					<mat-divider> </mat-divider>
					<button mat-menu-item (click)="unlinkWallet()">
						<span>{{ "wallets_connected.delete_wallet" | transloco }}</span>
					</button>
				</mat-menu>

				<div class="hwc-add-account" (click)="goToOnboarding()">
					<div class="hwc-add-account-inner">
						<div>
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
								<path d="M15 9.75H9.75V15H8.25V9.75H3V8.25H8.25V3H9.75V8.25H15V9.75Z" fill="#1C44F9" />
							</svg>

							<div class="hwc-add-account-text">
								{{ "wallets_connected.create_or_import_wallet_button" | transloco }}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>`,
	styleUrls: ["./home-wallets-connected.component.scss"],
})
export class HomeWalletsConnectedComponent implements OnInit {
	wallets!: Array<Wallet>;
	selectedIndex: number;

	constructor(private _walletService: WalletService, private _router: Router) {
		this.selectedIndex = 0;

		const currentWallet = new WalletModel(JSON.parse(localStorage.getItem("wallet") || "{}"));

		const remainingWallets = JSON.parse(localStorage.getItem("wallets") || "[]");

		this.wallets = [];

		if (currentWallet.ethAddress) {
			this.wallets.push(currentWallet);
		}

		const walletsMapping = {
			[currentWallet.ethAddress]: true,
		};

		if (Array.isArray(remainingWallets) && remainingWallets.length) {
			for (let index = 0; index < remainingWallets.length; index++) {
				const wallet = remainingWallets[index];

				if (walletsMapping[wallet.ethAddress]) continue;

				walletsMapping[wallet.ethAddress] = true;

				const _wallet = new WalletModel(wallet);

				if (!_wallet.ethAddress) continue;

				this.wallets.push(_wallet);
			}
		}

		if (!currentWallet.ethAddress) {
			localStorage.setItem("wallet", JSON.stringify(this.wallets[0]));
		}

		localStorage.setItem("wallets", JSON.stringify(this.wallets));
	}

	ngOnInit(): void {
		// bring the other wallets to display them in an array
	}

	displayAddress(address: any): string {
		return this._walletService.getDisplayableAddress(address);
	}

	goToOnboarding(): void {
		this._router.navigate(["/onboarding"]);
	}

	setIndex(index: number) {
		this.selectedIndex = index;
	}

	unlinkWallet() {
		// Implement your unlink logic here
		console.log("Unlinking wallet at index:", this.selectedIndex, this.wallets[this.selectedIndex]);
		this.wallets.splice(this.selectedIndex, 1);

		localStorage.setItem("wallets", JSON.stringify(this.wallets));

		if (this.selectedIndex === 0) {
			this.wallets.length ? localStorage.setItem("wallet", JSON.stringify(this.wallets[0])) : localStorage.removeItem("wallet");

			return;
		}
	}
}
