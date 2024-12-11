import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { IpfsService } from "app/ipfs.service";
import { WalletService } from "app/wallet.service";

@Component({
	selector: "app-new-zelf-name",
	templateUrl: "./new-zelf-name.component.html",
	styleUrls: ["./new-zelf-name.component.scss"],
})
export class NewZelfNameComponent implements OnInit {
	@ViewChild("zelfForm") signUpNgForm!: NgForm;
	zelfForm!: UntypedFormGroup;
	zelfName: string;
	steps: Array<any>;
	session: any;

	constructor(
		private _router: Router,
		private _formBuilder: UntypedFormBuilder,
		private _ipfsService: IpfsService,
		private _walletService: WalletService
	) {
		this.zelfName = "";

		this.steps = [
			{
				isActive: true,
				isCompleted: false,
				label: "available",
				isStatus: true,
			},
		];

		this.session = this._walletService.getSessionData();
		this.session.steps = [];
	}

	async ngOnInit(): Promise<any> {
		this.zelfName = await this._ipfsService.getZelfName();

		if (!this.zelfName) return this._router.navigate(["/onboarding"]);

		this.zelfForm = this._formBuilder.group({
			termsAcceptance: [false, [Validators.required]],
		});
	}

	goToCreateWallet(): void {
		this._router.navigate(["/create-wallet"]);
	}

	goToImportWallet(): void {
		this._router.navigate(["/import-wallet"]);
	}

	goToFindWallet(): void {
		this._router.navigate(["/find-wallet"]);
	}

	acceptedTerms(): Boolean {
		return Boolean(this.zelfForm.value.termsAcceptance);
	}

	goBack(): void {
		this._router.navigate(["/onboarding"]);
	}
}
