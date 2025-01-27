import { Component, OnDestroy, OnInit } from "@angular/core";
import { CaptchaService } from "app/captcha.service";
import { WalletService } from "app/wallet.service";
import { ZelfNameService } from "app/zelf-name-service.service";

@Component({
	selector: "biometric-instructions",
	template: `
		<div class="zelf-card">
			<div class="cw-pst-content w-full p-4" fxLayout="column" fxLayoutAlign="space-between center">
				<div fxLayout="column" fxLayoutAlign="start center" class="w-full">
					<h2>{{ "create_wallet.zelfproof_step.title" | transloco }}</h2>

					<span class="text-center">
						{{ "create_wallet.zelfproof_step.description" | transloco }}
					</span>
				</div>

				<div class="cw-phrase-content-d" fxLayout="column" fxLayoutAlign="start start">
					<div fxLayout="row" fxLayoutAlign="start center">
						<img src="https://cdn.verifik.co/wallet/smile.svg" alt="" class="mr-4" />

						<span class="instructions-text zelf-p"> {{ "create_wallet.zelfproof_step.instruction_1" | transloco }} </span>
					</div>

					<div fxLayout="row" fxLayoutAlign="start center">
						<img src="https://cdn.verifik.co/wallet/camera.svg" alt="" class="mr-4" />

						<span class="instructions-text zelf-p"> {{ "create_wallet.zelfproof_step.instruction_2" | transloco }} </span>
					</div>

					<div fxLayout="row" fxLayoutAlign="start center">
						<img src="https://cdn.verifik.co/wallet/instruction_1.svg" alt="" class="mr-4" />

						<span class="instructions-text zelf-p"> {{ "create_wallet.zelfproof_step.instruction_3" | transloco }} </span>
					</div>
				</div>

				<button mat-raised-button class="w-full main-button" (click)="startCamera($event)">
					{{ "create_wallet.phrase_step.start_encryption_button" | transloco }}
				</button>
			</div>
		</div>
	`,
	styleUrls: ["./biometric-instructions.component.scss", "../../main.scss"],
})
export class BiometricInstructionsComponent implements OnInit, OnDestroy {
	session: any;

	constructor(private _walletService: WalletService, private captchaService: CaptchaService, private _zelfNameService: ZelfNameService) {
		this.session = this._walletService.getSessionData();
	}

	ngOnInit(): void {}

	async startCamera(event: Event): Promise<any> {
		let captchaToken = "";

		const zelfName = this._zelfNameService.getZelfName();

		try {
			const captchaKey = zelfName.split(".zelf")[0].replace(".", "_");

			captchaToken = await this.captchaService.executeRecaptcha(`lease${captchaKey}`);

			this.captchaService.retainCaptchaToken(captchaToken);

			this.session.showBiometricsInstructions = false;

			this.session.showBiometrics = true;
		} catch (error) {
			console.error("reCAPTCHA failed:", { error });
		}
	}

	ngOnDestroy(): void {
		this.session.showBiometricsInstructions = false;
	}
}
