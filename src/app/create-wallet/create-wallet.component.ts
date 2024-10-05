import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm, UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { ChromeService } from "app/chrome.service";
import { Wallet, WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";

@Component({
	selector: "app-create-wallet",
	templateUrl: "./create-wallet.component.html",
	styleUrls: ["./create-wallet.component.scss", "../main.scss"],
})
export class CreateWalletComponent implements OnInit {
	@ViewChild("signUpNgForm") signUpNgForm!: NgForm;
	signUpForm!: UntypedFormGroup;
	showBiometrics: boolean = false;
	showBiometricsInstructions: boolean = false;
	currentStep = 0;
	formLoaded: boolean = false;
	wallet!: Wallet;
	words!: Array<any>;
	session: any;
	showWordsStep: boolean = false;

	constructor(
		private _formBuilder: UntypedFormBuilder,
		private _router: Router,
		private _walletService: WalletService,
		private _chromeService: ChromeService
	) {
		this.session = this._walletService.getSessionData();

		this.session.type = "create";

		this._walletService.setSteps([
			{ label: "add_password", isActive: false, isCompleted: false },
			{ label: "biometrics", isActive: false, isCompleted: false },
			{ label: "qr_code_generator", isActive: false, isCompleted: false },
		]);

		this.afterBiometricsCallback = this.afterBiometricsCallback.bind(this);
	}

	async ngOnInit(): Promise<any> {
		this.signUpForm = this._formBuilder.group({
			termsAcceptance: [false],
			wordsCount: [24, []],
		});

		this.updateSteps();

		this.formLoaded = true;

		const wallet = await this._chromeService.getItem("wallet");

		if (wallet) {
			this.wallet = new WalletModel(wallet);

			this.session.navigationStep = 2;
		}
	}

	goBack(): void {
		this._router.navigate(["/onboarding"]);
	}

	private updateSteps() {
		if (!this.session.steps) return;

		this.session.steps.forEach((step: any, index: number) => {
			step.isActive = Boolean(index === this.currentStep);
			step.isCompleted = Boolean(index < this.currentStep);
		});
	}

	startEncryption(): void {
		this.showBiometricsInstructions = true;
	}

	startCamera(): void {
		this.showBiometrics = true;
		this.showBiometricsInstructions = false;
	}

	afterBiometricsCallback(response: any): void {
		this._chromeService.setItem("wallet", response);
		// localStorage.setItem("wallet", JSON.stringify(response));

		this.wallet = new WalletModel(response);

		this.showBiometrics = false;

		this.showBiometricsInstructions = false;

		this.currentStep++;

		this.updateSteps();
	}

	canSeePasswordStep(index: number): boolean {
		return Boolean(index === 0 && this.session.step === 0 && !this.showBiometrics);
	}

	canSeeWordsCountStep(index: number): boolean {
		return Boolean(
			index === 1 && this.session.step === 1 && !this.showBiometrics && !this.showBiometricsInstructions && this.session.wordsPicker
		);
	}

	canSeeBiometricInstructions(index: number): boolean {
		return Boolean(
			index === 1 && this.session.step === 1 && this.session.showBiometricsInstructions && !this.showBiometrics && !this.session.wordsPicker
		);
	}

	canSeeBiometricsStep(index: number): boolean {
		return Boolean(
			index == 1 &&
				this.session.step === 1 &&
				!this.session.showBiometricsInstructions &&
				this.session.showBiometrics &&
				!this.session.wordsPicker
		);
	}

	canSeeQRCode(index: number): boolean {
		return Boolean(index === 2 && this.session.step === 2);
	}
}
