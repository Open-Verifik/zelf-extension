import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { ChromeService } from "app/chrome.service";
import { Wallet, WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";

@Component({
	selector: "app-unlock-wallet",
	templateUrl: "./unlock-wallet.component.html",

	styleUrls: ["./unlock-wallet.component.scss", "../main.scss"],
})
export class UnlockWalletComponent implements OnInit {
	session: any;
	wallet!: Wallet;

	@ViewChild("searchNgForm") searchNgForm!: NgForm;

	constructor(private _router: Router, private _walletService: WalletService, private _chromeService: ChromeService) {
		this.session = this._walletService.getSessionData();

		this._walletService.setSteps([
			{
				label: "search_wallet",
				isActive: Boolean(this.session.step === 0),
				isCompleted: Boolean(this.session.step > 0),
			},
			{
				label: "password_unlock",
				isActive: Boolean(this.session.step === 1),
				isCompleted: Boolean(this.session.step > 1),
			},
			{
				label: "biometric_unlock",
				isActive: Boolean(this.session.step === 2),
				isCompleted: Boolean(this.session.step > 2),
			},
		]);

		const interval = setInterval(() => {
			if (this.wallet) {
				clearInterval(interval); // Stop the interval when this.wallet is set

				return;
			}

			this._chromeService.getItem("unlockWallet").then((_wallet) => {
				const unlockWallet = new WalletModel(_wallet);

				if (unlockWallet.ethAddress) {
					this.wallet = unlockWallet;
					clearInterval(interval); // Stop the interval once the wallet is set
				}

				// console.log({ unlockWallet, wallet: this.wallet });
			});
		}, 1000);
	}

	async ngOnInit(): Promise<any> {
		const activeWallet = await this._chromeService.getItem("tempWalletAddress");

		const _unlockWallet = localStorage.getItem("unlockWallet") || {};

		const unlockWallet = activeWallet ? null : new WalletModel(_unlockWallet);

		this.session.navigationStep = 1;

		if (unlockWallet?.ethAddress && unlockWallet?.metadata) {
			this.wallet = unlockWallet;

			this.session.navigationStep = 2;
		}
	}

	goBack(): void {
		this._router.navigate(["/onboarding"]);
	}

	canSeeSearchStep(index: number): boolean {
		return Boolean(index === 0 && this.session.step === 0);
	}

	canSeePasswordStep(index: number): boolean {
		return Boolean(index == 1 && this.session.step === 1);
	}

	canSeeBiometricInstructionsStep(index: number): boolean {
		return Boolean(index === 2 && this.session.step === 2 && this.session.showBiometricsInstructions);
	}

	canSeeBiometricStep(index: number): boolean {
		return Boolean(index === 2 && this.session.step === 2 && this.session.showBiometrics);
	}

	canSeeQRCode(index: number): boolean {
		const filter = Boolean(index === 2 && this.session.step === 2 && !this.session.showBiometrics);

		if (!filter) return false;

		return Boolean(filter && this.wallet && this.wallet.metadata);
	}
}
