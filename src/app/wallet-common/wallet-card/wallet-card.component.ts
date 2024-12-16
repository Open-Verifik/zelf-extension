import { Component, Input, OnInit } from "@angular/core";
import { ChromeService } from "app/chrome.service";
import { Asset, Wallet } from "app/wallet";
import { WalletService } from "app/wallet.service";

@Component({
	selector: "wallet-card",
	template: `
		<div
			class="hwc-account-item"
			[ngClass]="{
				'hwc-account-item-alt': variables.index || variables.hideBalances,
			}"
		>
			<div class="hwc-account-item-icon">
				<div>
					<div class="hwc-account-item-icon-inner">
						<img [src]="wallet.image" alt="" class="w-full" *ngIf="wallet.image" />
						<img src="../../../assets/images/unknown_wallet.svg" alt="" class="w-full" *ngIf="!wallet.image" />
					</div>
				</div>
			</div>
			<div class="hwc-account-item-info">
				<div class="hwc-account-item-name" *ngIf="wallet.publicData.zelfName">{{ wallet.publicData.zelfName }}</div>
				<div class="hwc-account-item-name" *ngIf="!wallet.name">{{ "wallets_connected.no_zelf_name" | transloco }}</div>
				<div class="hwc-account-item-address">
					{{ displayAddress(wallet.ethAddress) }}
				</div>
			</div>

			<div class="hwc-account-item-balance-icon" [matMenuTriggerFor]="menu" (menuOpened)="setIndex()" *ngIf="!variables.hideActions">
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
			<button mat-menu-item (click)="openScanner()">
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

			<mat-divider> </mat-divider>
			<button mat-menu-item (click)="unlinkWallet()">
				<span>{{ "wallets_connected.delete_wallet" | transloco }}</span>
			</button>
		</mat-menu>
	`,
	styleUrls: ["./wallet-card.component.scss"],
})
export class WalletCardComponent implements OnInit {
	@Input() variables?: any;
	@Input() wallet!: Wallet;
	@Input() wallets!: Array<Wallet>;
	asset!: Asset;
	selectedNetwork: string;

	constructor(private _walletService: WalletService, private _chromeService: ChromeService) {
		this.selectedNetwork = "";
	}

	ngOnInit(): void {
		this._syncDetails();
	}

	async _syncDetails(): Promise<any> {
		if (this.variables.hideActions) return;
	}

	unlinkWallet() {
		this.wallets.splice(this.variables.index, 1);

		this._chromeService.setItem("wallets", this.wallets);

		if (this.variables.index === 0) {
			this.wallets.length ? this._chromeService.setItem("wallet", this.wallets[0]) : this._chromeService.removeItem("wallet");

			return;
		}
	}

	displayAddress(address: any): string {
		return this._walletService.getDisplayableAddress(address);
	}

	setIndex() {
		for (let index = 0; index < this.wallets.length; index++) {
			const wallet = this.wallets[index];

			if (wallet.ethAddress === this.wallet.ethAddress) {
				this.variables.index = index;

				break;
			}
		}
	}

	selectAccount() {}

	openScanner(): void {
		switch (this.selectedNetwork) {
			case "eth":
				// Open Etherscan for Ethereum
				const etherscanUrl = `https://etherscan.io/address/${this.wallet.ethAddress}`;

				window.open(etherscanUrl, "_blank");

				break;
			case "sol":
				// Open Solscan for Solana
				const solscanUrl = `https://solscan.io/account/${this.wallet.solanaAddress}`;

				window.open(solscanUrl, "_blank");

				break;
			default:
				// Handle other networks or show an error
				console.warn("Unsupported network for scanner");

				break;
		}
	}
}
