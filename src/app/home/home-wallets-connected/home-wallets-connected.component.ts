import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ChromeService } from "app/chrome.service";
import { Wallet, WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";

@Component({
    selector: "home-wallets-connected",
    template: `<div class="hwc-wrapper">
		<div class="hwc-content" *ngIf="loaded">
			<div class="hwc-account-list">
				<wallet-card [shareables]="shareables" class="w-full" [variables]="{ index: -1 }" [wallet]="currentWallet" [wallets]="wallets">
				</wallet-card>
				<!-- put a material divider here -->
				<div class="hwc-account-divider"></div>

				<div class="w-full" *ngFor="let wallet of wallets; let _index = index">
					<wallet-card class="w-full" [variables]="{ index: _index }" [shareables]="shareables" [wallet]="wallet" [wallets]="wallets">
					</wallet-card>

					<!-- put a divider, but not for the last one -->
					<div class="hwc-account-divider" *ngIf="wallets.length - 1 !== _index"></div>
				</div>

				<div class="hwc-add-account" (click)="goToOnboarding()" *ngIf="wallets.length < 3">
					<div class="hwc-add-account-inner" fxLayout="row" fxLayoutAlign="center center">
						<svg class="mr-4" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
							<path
								d="M9.00809 0C10.0223 1.37638 11.3245 2.94543 12.9662 4.56695H5.5957C7.19048 2.87796 8.28196 1.25719 9.00961 0H9.00885H9.00809Z"
								fill="black"
							/>
							<path
								d="M0 9.02141C1.29765 8.39169 3.00233 7.40364 4.71307 5.89231C4.86391 5.75887 5.01171 5.62394 5.15345 5.48975H11.7448C11.7448 5.48975 6.97107 12.236 4.3591 12.2562C2.20418 12.2734 1.30144 9.8243 0 9.02066L0 9.02141Z"
								fill="#181818"
							/>
							<path
								d="M9.42852 18.0002C8.63341 16.9207 7.60939 15.6883 6.3125 14.4131H12.3732C11.0892 15.707 10.1304 16.9559 9.42928 18.0002H9.42852Z"
								fill="#181818"
							/>
							<path
								d="M13.3337 13.2987C13.2625 13.3617 13.1928 13.4254 13.1238 13.4883H6.04736C6.04736 13.4883 10.8999 6.65442 13.5467 6.64017C15.7555 6.62893 16.6703 9.13655 17.9998 9.95743C16.6476 10.7168 15.0013 11.7971 13.333 13.2987H13.3337Z"
								fill="#181818"
							/>
						</svg>

						<div class="hwc-add-account-text">
							{{ "wallets_connected.create_or_import_wallet_button" | transloco }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>`,
    styleUrls: ["./home-wallets-connected.component.scss"],
    standalone: false
})
export class HomeWalletsConnectedComponent implements OnInit, OnDestroy {
	wallets!: Array<Wallet>;
	selectedIndex: number;
	loaded!: boolean;
	currentWallet!: Wallet;
	@Input() shareables: any;

	constructor(private _walletService: WalletService, private _router: Router, private _chromeService: ChromeService) {
		this.selectedIndex = 0;

		this.loaded = false;

		this.wallets = [];
	}

	async ngOnInit(): Promise<any> {
		const _wallet = (await this._chromeService.getItem("wallet")) || {};

		this.currentWallet = new WalletModel({ ..._wallet, index: 0 });

		const remainingWallets = (await this._chromeService.getItem("wallets")) || [];

		const walletsMapping = {
			[this.currentWallet.ethAddress]: true,
		};

		if (Array.isArray(remainingWallets) && remainingWallets.length) {
			for (let index = 0; index < remainingWallets.length; index++) {
				const wallet = remainingWallets[index];

				const _wallet = new WalletModel({
					...wallet,
					index: index + 1,
				});

				if (walletsMapping[_wallet.ethAddress]) continue;

				walletsMapping[wallet.ethAddress] = true;

				_wallet.metadata = {};

				if (!_wallet.ethAddress || !_wallet.image.includes("data:image/png;base64")) continue;

				this.wallets.push(_wallet);
			}
		}

		this._chromeService.setItem("wallets", this.wallets);

		this.loaded = true;
	}

	goToOnboarding(): void {
		this._router.navigate(["/onboarding"]);
	}

	ngOnDestroy(): void {
		this.wallets = [];
		this.loaded = false;
	}
}
