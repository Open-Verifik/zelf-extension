import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ChromeService } from "app/chrome.service";
import { Wallet, WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";

@Component({
	selector: "home-wallets-connected",
	template: `<div class="hwc-wrapper">
		<div class="hwc-content" *ngIf="loaded">
			<div class="hwc-header">
				<div class="hwc-header-title">{{ "wallets_connected.title" | transloco }}</div>
			</div>
			<div class="hwc-account-list">
				<wallet-card
					class="w-full"
					*ngFor="let wallet of wallets; let _index = index"
					[variables]="{ index: _index }"
					[wallet]="wallet"
					[wallets]="wallets"
				>
				</wallet-card>

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
	loaded!: boolean;

	constructor(private _walletService: WalletService, private _router: Router, private _chromeService: ChromeService) {
		this.selectedIndex = 0;
	}

	async ngOnInit(): Promise<any> {
		const _wallet = (await this._chromeService.getItem("wallet")) || {};

		const currentWallet = new WalletModel({ ..._wallet, index: 0 });

		const remainingWallets = (await this._chromeService.getItem("wallets")) || [];

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

				const _wallet = new WalletModel({ ...wallet, index });

				if (!_wallet.ethAddress) continue;

				this.wallets.push(_wallet);
			}
		}

		if (!currentWallet.ethAddress) {
			this._chromeService.setItem("wallet", this.wallets[0]);
			// localStorage.setItem("wallet", JSON.stringify(this.wallets[0]));
		}
		this._chromeService.setItem("wallets", this.wallets);
		// localStorage.setItem("wallets", JSON.stringify(this.wallets));

		this.loaded = true;
	}

	goToOnboarding(): void {
		this._router.navigate(["/onboarding"]);
	}
}
