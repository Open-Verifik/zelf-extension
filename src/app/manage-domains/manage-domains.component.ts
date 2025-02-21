import { NgFor, NgIf, NgTemplateOutlet } from "@angular/common";
import { Component } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { RouterLink, RouterModule } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";
import { ChromeService } from "app/chrome.service";
import { FirstLetterPipe } from "app/pipes/first-letter.pipe";
import { ZelfNamePipe } from "app/pipes/zelf-name.pipe";
import { WalletModel } from "app/wallet";

@Component({
	selector: "manage-domains",
	standalone: true,
	imports: [FirstLetterPipe, MatIconModule, MatMenuModule, NgFor, NgIf, NgTemplateOutlet, RouterLink, RouterModule, TranslocoModule, ZelfNamePipe],
	templateUrl: "./manage-domains.component.html",
	styleUrls: ["./manage-domains.component.scss"],
})
export class ManageDomainsComponent {
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
		this.wallets = [wallet, ...wallets];
	}

	getFirstLetter(name: string): string {
		return name.charAt(0).toUpperCase();
	}
}
