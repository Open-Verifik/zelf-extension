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
	@ViewChild("searchNgForm") searchNgForm!: NgForm;

	constructor(private _router: Router, private _walletService: WalletService) {
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
	}

	ngOnInit(): void {}

	goBack(): void {
		this._router.navigate(["/onboarding"]);
	}
}
