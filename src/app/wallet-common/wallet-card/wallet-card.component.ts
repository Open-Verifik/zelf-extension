import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ChromeService } from "app/chrome.service";
import { TransactionService } from "app/transaction.service";
import { Wallet } from "app/wallet";
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
				<div class="hwc-account-item-name" *ngIf="wallet.name">{{ wallet.name }}</div>
				<div class="hwc-account-item-name" *ngIf="!wallet.name">{{ "wallets_connected.account" | transloco }}</div>
				<div class="hwc-account-item-address">
					{{ displayAddress(wallet.ethAddress) }}
				</div>
			</div>
			<div class="hwc-account-item-balance" *ngIf="!variables.hideBalances">
				<div>
					<div>123 ETH</div>
					<div>1464,11 USD</div>
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
	`,
	styleUrls: ["./wallet-card.component.scss"],
})
export class WalletCardComponent implements OnInit {
	@Input() variables?: any;
	@Input() wallet!: Wallet;
	@Input() wallets!: Array<Wallet>;

	constructor(
		private _walletService: WalletService,
		private _router: Router,
		private _chromeService: ChromeService,
		private _transactionService: TransactionService
	) {}

	ngOnInit(): void {}

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
}
