import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { HttpWrapperService } from "app/http-wrapper.service";
import { WalletService } from "app/wallet.service";
import { environment } from "environments/environment";

@Component({
	selector: "uw-password-step",
	templateUrl: "./uw-password-step.component.html",
	styleUrls: ["../unlock-wallet.component.scss", "../../main.scss"],
})
export class UwPasswordStepComponent implements OnInit {
	session: any;
	passwordForm!: UntypedFormGroup;
	loading!: boolean;
	showPassword!: boolean;

	constructor(private _walletService: WalletService, private _formBuilder: UntypedFormBuilder, private _httpWrapperService: HttpWrapperService) {
		this.session = this._walletService.getSessionData();

		this.loading = false;

		this.showPassword = false;

		console.log({ session: this.session });
	}

	ngOnInit(): void {
		const defaultPassword = environment.production ? "" : "SamePassword123";

		this.passwordForm = this._formBuilder.group({
			password: ["", []],
		});

		if (!this.session.usePassword) {
			this.setPassword();

			return;
		}
	}

	isPasswordSet(): boolean {
		const { password } = this.passwordForm.value;

		return Boolean(password && password.length >= 8);
	}

	async setPassword(): Promise<any> {
		this.session.password = await this._httpWrapperService.encryptMessage(this.passwordForm.value.password);

		this.session.showBiometricsInstructions = true;

		this._walletService.goToNextStep(this.session.step + 1);
	}

	toggleShowPassword(): void {
		this.showPassword = !this.showPassword;
	}
}
