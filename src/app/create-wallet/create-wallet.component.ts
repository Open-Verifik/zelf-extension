import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm, UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { WalletService } from "app/wallet.service";
import { environment } from "environments/environment";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslocoService } from "@ngneat/transloco";

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
	wallet: any;
	words!: Array<any>;
	session: any;
	showWordsStep: boolean = false;

	constructor(private _formBuilder: UntypedFormBuilder, private _router: Router, private _walletService: WalletService) {
		this.session = this._walletService.getSessionData();

		this.session.type = "create";

		this._walletService.setSteps([
			{ label: "add_password", isActive: false, isCompleted: false },
			{ label: "biometrics", isActive: false, isCompleted: false },
			{ label: "qr_code_generator", isActive: false, isCompleted: false },
		]);

		this.afterBiometricsCallback = this.afterBiometricsCallback.bind(this);
	}

	ngOnInit() {
		this.signUpForm = this._formBuilder.group({
			password: ["", []],
			repeatPassword: ["", []],
			termsAcceptance: [false],
			wordsCount: [24, []],
		});

		this.updateSteps();

		this.formLoaded = true;

		this.wallet = this._walletService.getWallet();

		if (this.wallet) this.session.navigationStep = 2;
	}

	goBack(): void {
		this._router.navigate(["/onboarding"]);
	}

	continueWithoutPassword(): void {
		this.currentStep++;

		this.updateSteps();
	}

	private updateSteps() {
		if (!this.session.steps) return;

		this.session.steps.forEach((step: any, index: number) => {
			step.isActive = index === this.currentStep;
			step.isCompleted = index < this.currentStep;
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
		localStorage.setItem("walletId", response._id);

		localStorage.setItem("wallet", JSON.stringify(response));

		this.wallet = response;

		this.showBiometrics = false;

		this.showBiometricsInstructions = false;

		this.currentStep++;

		this.updateSteps();
	}

	isPasswordCorrect(): boolean {
		const { password, repeatPassword, termsAcceptance } = this.signUpForm.value;

		return Boolean(password && repeatPassword && password === repeatPassword && termsAcceptance && password.length >= 8);
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
