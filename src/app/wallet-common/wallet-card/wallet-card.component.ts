import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CaptchaService } from "app/captcha.service";
import { ChromeService } from "app/chrome.service";
import { Asset, Wallet } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { ZelfNameService } from "app/zelf-name-service.service";
import moment from "moment";
import { share } from "rxjs";

@Component({
	selector: "wallet-card",
	template: `
		<div class="hwc-account-item">
			<div class="hwc-account-item-icon">
				<div>
					<div class="hwc-account-item-icon-inner" (click)="selectAccount()">
						<!-- get the first letter of the zelfName > wallet.publicData.zelfName -->
						<div class="hwc-account-item-icon-letter" *ngIf="wallet.publicData.zelfName">
							{{ wallet.name.charAt(0).toUpperCase() }}
						</div>
					</div>
				</div>
			</div>
			<div class="hwc-account-item-info">
				<div
					(click)="selectAccount()"
					[ngClass]="{ 'cursor-pointer': !variables.hideActions }"
					class="hwc-account-item-name"
					*ngIf="wallet.publicData.zelfName"
				>
					{{ wallet.name.toUpperCase() }}
				</div>
			</div>

			<div class="hwc-account-item-balance-icon" [matMenuTriggerFor]="menu" (menuOpened)="setIndex()" *ngIf="!variables.hideActions">
				<div>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
						<path
							d="M6 10C4.9 10 4 10.9 4 12C4 13.1 4.9 14 6 14C7.1 14 8 13.1 8 12C8 10.9 7.1 10 6 10ZM18 10C16.9 10 16 10.9 16 12C16 13.1 16.9 14 18 14C19.1 14 20 13.1 20 12C20 10.9 19.1 10 18 10ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"
							fill="#181818"
						/>
					</svg>
				</div>
			</div>
		</div>

		<div
			class="hwc-hold-actions"
			fxLayout="column"
			fxLayoutAlign="start center"
			*ngIf="wallet.publicData.type === 'hold' && !variables.hideActions"
		>
			<!-- show message that it's going to expire soon -->
			<div>
				<div class="hwc-hold-actions-text" *ngIf="wallet.publicData.leaseExpiresAt">
					<small>
						{{ "unlock_wallet.hold.expiration_time" | transloco }}
					</small>
					<small class="font-bold">
						{{ wallet.publicData.leaseExpiresAt | date : "medium" }}
					</small>
				</div>
			</div>

			<button mat-raised-button class="main-button w-full" (click)="goToPayments()">
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
					<path
						d="M9.00809 0C10.0223 1.37638 11.3245 2.94543 12.9662 4.56695H5.5957C7.19048 2.87796 8.28196 1.25719 9.00961 0H9.00885H9.00809Z"
						fill="#F9F9FC"
					/>
					<path
						d="M0 9.02141C1.29765 8.39169 3.00233 7.40364 4.71307 5.89231C4.86391 5.75887 5.01171 5.62394 5.15345 5.48975H11.7448C11.7448 5.48975 6.97107 12.236 4.3591 12.2562C2.20418 12.2734 1.30144 9.8243 0 9.02066L0 9.02141Z"
						fill="#F9F9FC"
					/>
					<path
						d="M9.42852 18.0002C8.63341 16.9207 7.60939 15.6883 6.3125 14.4131H12.3732C11.0892 15.707 10.1304 16.9559 9.42928 18.0002H9.42852Z"
						fill="#F9F9FC"
					/>
					<path
						d="M13.3337 13.2987C13.2625 13.3617 13.1928 13.4254 13.1238 13.4883H6.04736C6.04736 13.4883 10.8999 6.65442 13.5467 6.64017C15.7555 6.62893 16.6703 9.13655 17.9998 9.95743C16.6476 10.7168 15.0013 11.7971 13.333 13.2987H13.3337Z"
						fill="#F9F9FC"
					/>
				</svg>
				<span>
					{{ "unlock_wallet.hold.buy_now" | transloco }}
				</span>
			</button>
		</div>

		<mat-menu #menu="matMenu" xPosition="before" yPosition="above">
			<button mat-menu-item (click)="unlinkWallet()">
				<span>{{ "wallets_connected.delete_wallet" | transloco }}</span>
			</button>
		</mat-menu>
	`,
	styleUrls: ["./wallet-card.component.scss"],
})
export class WalletCardComponent implements OnInit {
	@Input() variables: any;
	@Input() wallet!: Wallet;
	@Input() wallets!: Array<Wallet>;
	@Input() shareables: any;
	asset!: Asset;
	selectedNetwork: string;
	captchaToken?: string;

	constructor(
		private _walletService: WalletService,
		private _zelfNameService: ZelfNameService,
		private _chromeService: ChromeService,
		private _router: Router,
		private route: ActivatedRoute,
		private cdr: ChangeDetectorRef,
		private captchaService: CaptchaService
	) {
		this.selectedNetwork = "";
	}

	ngOnInit(): void {
		if (!this.wallet.publicData.zelfName) {
			// unlink
			this.unlinkWallet();

			return;
		}

		this._syncDetails();
	}

	async _syncDetails(): Promise<any> {
		if (this.variables.hideActions) return;

		const leaseExpiresAt = this.wallet.publicData.leaseExpiresAt;

		// check if it's expired
		this.wallet.publicData.isExpired = !leaseExpiresAt || new Date(leaseExpiresAt) < new Date();

		if (leaseExpiresAt) return;

		try {
			const captchaKey = this.wallet.publicData.zelfName.replace(".", "_");

			this.captchaToken = await this.captchaService.executeRecaptcha(captchaKey);
		} catch (error) {
			return;
		}

		const response = await this._zelfNameService.searchZelfName("zelfName", this.wallet.publicData.zelfName, this.captchaToken);

		if (response.data.available) {
			this.unlinkWallet();

			return;
		}

		const zelfNameObject = response.data.ipfs?.length ? response.data.ipfs[0] : response.data.arweave[0];

		this.wallet.publicData = zelfNameObject.publicData;

		this.wallet.publicData.leaseExpiresAt =
			zelfNameObject.publicData.type === "hold" ? zelfNameObject.publicData.expiresAt : zelfNameObject.publicData.leaseExpiresAt;

		this.wallet.publicData.isExpired = !this.wallet.publicData.leaseExpiresAt || moment(this.wallet.publicData.leaseExpiresAt).isBefore(moment());
	}

	unlinkWallet() {
		if (this.variables.index === -1) {
			this.wallets.length ? this._chromeService.setItem("wallet", this.wallets[0]) : this._chromeService.removeItem("wallet");

			location.reload();

			return;
		}

		this.wallets.splice(this.variables.index, 1);

		this._chromeService.setItem("wallets", this.wallets);
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

	async selectAccount(): Promise<any> {
		if (this.variables?.origin === "sendTransaction") return;

		const currentWallet = (await this._chromeService.getItem("wallet")) || {};

		if (currentWallet.ethAddress === this.wallet.ethAddress) {
			this.shareables.view = "home";

			this._router.navigate([], {
				relativeTo: this.route, // Keep the current route
				queryParams: { view: "home" }, // Set new query params
				queryParamsHandling: "merge", // Merge with existing query params
			});

			this.cdr.markForCheck();

			return;
		}

		await this._chromeService.setItem("wallet", this.wallet);

		this.wallets.push(currentWallet);

		for (let index = this.wallets.length - 1; index >= 0; index--) {
			const _wallet = this.wallets[index];

			if (_wallet.ethAddress === this.wallet.ethAddress) {
				this.wallets.splice(index, 1);
			}
		}

		await this._chromeService.setItem("wallets", this.wallets);

		this.shareables.view = "home";

		this.shareables.wallet = this.wallet;

		this._router.navigate([], {
			relativeTo: this.route, // Keep the current route
			queryParams: { view: "home" }, // Set new query params
			queryParamsHandling: "merge", // Merge with existing query params
		});

		this.cdr.markForCheck();
	}

	goToPayments(): void {
		window.open("https://payment.zelf.world", "_blank");
	}
}
