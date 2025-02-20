import { CommonModule, NgIf } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";
import { ChromeService } from "app/chrome.service";
import { WalletModel } from "app/wallet";

@Component({
	selector: "app-manage-domain",
	standalone: true,
	imports: [CommonModule, NgIf, MatButtonModule, TranslocoModule, RouterLink],
	templateUrl: "./manage-domain.component.html",
	styleUrls: ["./manage-domain.component.scss"],
})
export class ManageDomainComponent implements OnInit {
	wallet: Partial<WalletModel> = {};
	wallets: WalletModel[] = [];
	loading: boolean = false;

	constructor(private _chromeService: ChromeService) {}

	ngOnInit(): void {
		this._setWallets().then(() => {
			this.loading = false;
		});
	}

	private async _setWallets(): Promise<void> {
		this.loading = true;

		let wallet = await this._chromeService.getItem("wallet");
		let wallets: WalletModel[] = [];

		if (!wallet) {
			wallets = await this._chromeService.getItem("wallets");
			wallet = wallets[0];

			this._chromeService.setItem("wallet", wallet);
		}

		this.wallet = wallet;
	}

	getWalletStatus(): string {
		if (!this.wallet.publicData?.isExpired) {
			return this.wallet.publicData?.type !== "hold" ? "active" : "hold";
		}

		return "expired";
	}
}
