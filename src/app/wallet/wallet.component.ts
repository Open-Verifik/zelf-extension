import { CommonModule, NgIf } from "@angular/common";
import { Component } from "@angular/core";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";
import { ChromeService } from "app/chrome.service";
import { MyZnsBottomSheetComponent } from "app/my-zns-bottom-sheet/my-zns-bottom-sheet.component";
import { WalletModel } from "app/wallet";

@Component({
	selector: "app-wallet",
	standalone: true,
	imports: [CommonModule, NgIf, MatButtonModule, TranslocoModule, RouterLink],
	templateUrl: "./wallet.component.html",
	styleUrls: ["./wallet.component.scss"],
})
export class WalletComponent {
	wallet: Partial<WalletModel> = {};
	wallets: WalletModel[] = [];
	loading: boolean = false;

	constructor(private _chromeService: ChromeService, private _bottomSheet: MatBottomSheet) {}

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

	openMyZnsBottomSheet(): void {
		this._bottomSheet.open(MyZnsBottomSheetComponent, {
			backdropClass: "zelf-backdrop",
			panelClass: "zelf-bottom-sheet",
		});
	}

	getWalletStatus(): string {
		if (!this.wallet.publicData?.isExpired) {
			return this.wallet.publicData?.type !== "hold" ? "active" : "hold";
		}

		return "expired";
	}
}
