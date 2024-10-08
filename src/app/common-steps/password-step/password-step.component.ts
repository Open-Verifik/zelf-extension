import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm, UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { HttpWrapperService } from "app/http-wrapper.service";
import { WalletService } from "app/wallet.service";
import { environment } from "environments/environment";

@Component({
	selector: "password-step",
	templateUrl: "./password-step.component.html",
	styleUrls: ["./password-step.component.scss", "../../main.scss", "../../onboarding/onboarding.scss"],
})
export class PasswordStepComponent implements OnInit {
	@ViewChild("passwordNgForm") passwordNgForm!: NgForm;
	passwordForm!: UntypedFormGroup;
	loading: boolean = false;
	session: any;

	constructor(private _formBuilder: UntypedFormBuilder, private _httpWrapperService: HttpWrapperService, private _walletService: WalletService) {
		this.session = this._walletService.getSessionData();
	}

	ngOnInit(): void {
		const defaultPassword = environment.production ? "" : "SamePassword123";
		this.passwordForm = this._formBuilder.group({
			password: [defaultPassword, []],
			repeatPassword: [defaultPassword, []],
			termsAcceptance: [false],
		});
	}

	isPasswordCorrect(): boolean {
		const { password, repeatPassword, termsAcceptance } = this.passwordForm.value;

		return Boolean(!this.loading && password && repeatPassword && password === repeatPassword && termsAcceptance && password.length >= 8);
	}

	continueWithoutPassword(): void {
		this.session.password = "";
		this.session.usePassword = false;

		this._moveForward();
	}

	async addPassword(): Promise<any> {
		this.loading = true;
		// get it from the form
		const password = this.passwordForm.value.password;

		this.session.password = await this._httpWrapperService.encryptMessage(password);

		this.loading = false;

		this._moveForward();
	}

	_moveForward(): void {
		this.session.showBiometrics = false;

		this.session.showBiometricsInstructions = true;

		// if (this.session.type === "create") {
		this._walletService.goToNextStep(this.session.step + 1);
	}
}
