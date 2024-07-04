import { Component, OnInit } from "@angular/core";
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
					<div class="hwc-account-item-balance-icon">
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

				<div class="hwc-add-account">
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

	constructor(private _walletService: WalletService) {
		const currentWallet = JSON.parse(localStorage.getItem("wallet") || "{}");

		this.wallets = [new WalletModel(currentWallet)];

		console.log({ wallets: this.wallets });
	}

	ngOnInit(): void {
		// bring the other wallets to display them in an array
	}

	displayAddress(address: any): string {
		return this._walletService.getDisplayableAddress(address);
	}
}
