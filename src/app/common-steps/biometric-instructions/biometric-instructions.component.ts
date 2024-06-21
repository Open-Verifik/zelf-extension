import { Component, OnInit } from "@angular/core";
import { WalletService } from "app/wallet.service";

@Component({
	selector: "biometric-instructions",
	template: `
		<div class="bi-container">
			<div class="cw-pst-content w-full" fxLayout="column" fxLayoutAlign="space-between center">
				<div fxLayout="column" fxLayoutAlign="start center" class="w-full">
					<img src="https://cdn.verifik.co/wallet/info_cr.svg" alt="" />

					<div class="cw-pst-title">{{ "create_wallet.biometric_instructions.title" | transloco }}</div>
				</div>

				<div class="cw-phrase-content-d m-8" fxLayout="column" fxLayoutAlign="start start">
					<div fxLayout="row" fxLayoutAlign="start center">
						<img src="https://cdn.verifik.co/wallet/smile.svg" alt="" class="mr-4" />

						<span> {{ "create_wallet.biometric_instructions.instruction_1" | transloco }} </span>
					</div>

					<div fxLayout="row" fxLayoutAlign="start center">
						<img src="https://cdn.verifik.co/wallet/camera.svg" alt="" class="mr-4" />

						<span> {{ "create_wallet.biometric_instructions.instruction_2" | transloco }} </span>
					</div>

					<div fxLayout="row" fxLayoutAlign="start center">
						<img src="https://cdn.verifik.co/wallet/instruction_1.svg" alt="" class="mr-4" />

						<span> {{ "create_wallet.biometric_instructions.instruction_3" | transloco }} </span>
					</div>
				</div>

				<button mat-raised-button class="w-full rounded-button main-button" (click)="startCamera()">
					{{ "create_wallet.phrase_step.start_encryption_button" | transloco }}
				</button>
			</div>
		</div>
	`,
	styleUrls: ["./biometric-instructions.component.scss", "../../main.scss"],
})
export class BiometricInstructionsComponent implements OnInit {
	session: any;

	constructor(private _walletService: WalletService) {
		this.session = this._walletService.getSessionData();
	}

	ngOnInit(): void {}

	startCamera(): void {
		this.session.showBiometricsInstructions = false;

		this.session.showBiometrics = true;
	}
}
