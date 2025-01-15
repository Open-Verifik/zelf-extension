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
				<wallet-card [shareables]="shareables" class="w-full" [variables]="{ index: 0 }" [wallet]="currentWallet" [wallets]="wallets">
				</wallet-card>
				<wallet-card
					class="w-full"
					*ngFor="let wallet of wallets; let _index = index"
					[variables]="{ index: _index }"
					[shareables]="shareables"
					[wallet]="wallet"
					[wallets]="wallets"
				>
				</wallet-card>
			</div>
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
	</div>`,
	styleUrls: ["./home-wallets-connected.component.scss"],
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
