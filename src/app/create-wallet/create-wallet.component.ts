import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { WalletService } from "app/wallet.service";

@Component({
	selector: "app-create-wallet",
	templateUrl: "./create-wallet.component.html",
	styleUrls: ["./create-wallet.component.scss", "../main.scss"],
})
export class CreateWalletComponent implements OnInit {
	steps = [
		{ label: "Crear contraseña", isActive: false, isCompleted: false },
		{ label: "Seguridad biométrica", isActive: false, isCompleted: false },
		{ label: "Finalizar", isActive: false, isCompleted: false },
	];
	@ViewChild("signUpNgForm") signUpNgForm!: NgForm;
	signUpForm!: UntypedFormGroup;
	showBiometrics: boolean = false;
	showBiometricsInstructions: boolean = false;
	currentStep = 0;
	formLoaded: boolean = false;
	wallet: any;

	constructor(private _formBuilder: UntypedFormBuilder, private _router: Router, private _walletService: WalletService) {}

	ngOnInit() {
		this.signUpForm = this._formBuilder.group({
			password: ["", []],
			repeatPassword: ["", []],
			wordsCount: [24, []],
		});

		this.updateSteps();

		this.formLoaded = true;

		const walletId = localStorage.getItem("walletId");
		console.log({ existingWallet: walletId });
		if (walletId) {
			this._getWallet(walletId);
		}
	}

	_getWallet(walletId: string): void {
		this._walletService.requestWallet(walletId).subscribe({
			next: (response) => {
				console.log({
					responseWallet: response.data,
				});

				this.currentStep = 1;

				this.updateSteps();
			},
			error: (error) => {},
			complete: () => {},
		});
	}

	goBack(): void {
		this._router.navigate(["/onboarding"]);
	}

	continueWithoutPassword(): void {
		this.currentStep++;

		this.updateSteps();
	}

	private updateSteps() {
		if (!this.steps) return;

		this.steps.forEach((step: any, index: number) => {
			step.isActive = index === this.currentStep;
			step.isCompleted = index < this.currentStep;
		});
	}

	startEncryption(): void {
		this.showBiometricsInstructions = true;
	}

	startCamera(): void {
		this.showBiometrics = true;
	}

	afterBiometricsCallback(response: any): void {
		localStorage.setItem("walletId", response._id);
		this.wallet = response;
	}
}
