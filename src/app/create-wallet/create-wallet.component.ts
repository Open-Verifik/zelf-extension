import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

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
	currentStep = 0;
	formLoaded: boolean = false;

	constructor(private _formBuilder: UntypedFormBuilder, private _router: Router) {}

	ngOnInit() {
		this.signUpForm = this._formBuilder.group({
			password: ["", []],
			repeatPassword: ["", []],
			wordsCount: [24, []],
		});

		this.updateSteps();

		this.formLoaded = true;
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
		this.showBiometrics = true;
	}

	afterBiometricsCallback(response: any): void {
		console.log({ response });
	}
}
