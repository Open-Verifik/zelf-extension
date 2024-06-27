import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { NgForm, UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { WalletService } from "app/wallet.service";
import { environment } from "environments/environment";
import { Observable, debounceTime, distinctUntilChanged, map } from "rxjs";

@Component({
	selector: "app-unlock-wallet",
	templateUrl: "./unlock-wallet.component.html",

	styleUrls: ["./unlock-wallet.component.scss", "../main.scss"],
})
export class UnlockWalletComponent implements OnInit {
	session: any;
	wallet: any;
	@ViewChild("searchNgForm") searchNgForm!: NgForm;

	constructor(private _router: Router, private _walletService: WalletService) {
		this.session = this._walletService.getSessionData();

		const wallet = JSON.parse(localStorage.getItem("wallet") || "{}");

		if (Object.keys(wallet).length) {
			this.wallet = wallet;

			this.session.navigationStep = 2;
		}

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
	}

	ngOnInit(): void {
		console.log({ session: this.session });
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

		setTimeout(() => {
			if (this.wallet) return;

			const wallet = JSON.parse(localStorage.getItem("wallet") || "{}");

			if (Object.keys(wallet).length) this.wallet = wallet;
		}, 1000);

		return Boolean(filter && this.wallet);
	}
}
