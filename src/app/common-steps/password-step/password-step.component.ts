import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm, UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";

@Component({
	selector: "password-step",
	templateUrl: "./password-step.component.html",
	styleUrls: ["./password-step.component.scss", "../../main.scss", "../../onboarding/onboarding.scss"],
})
export class PasswordStepComponent implements OnInit {
	@ViewChild("passwordNgForm") passwordNgForm!: NgForm;
	passwordForm!: UntypedFormGroup;

	constructor(private _formBuilder: UntypedFormBuilder) {}

	ngOnInit(): void {
		this.passwordForm = this._formBuilder.group({
			password: ["", []],
			repeatPassword: ["", []],
			termsAcceptance: [false],
		});
	}

	isPasswordCorrect(): boolean {
		const { password, repeatPassword, termsAcceptance } = this.passwordForm.value;

		return Boolean(password && repeatPassword && password === repeatPassword && termsAcceptance && password.length >= 8);
	}

	continueWithoutPassword(): void {
		// this.currentStep++;
		// this.updateSteps();
	}
}
