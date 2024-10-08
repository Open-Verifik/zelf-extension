import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { WalletService } from "app/wallet.service";

@Component({
	selector: "words-picker-step",
	templateUrl: "./words-picker-step.component.html",
	styleUrls: ["../../main.scss", "./word-picker-step.component.scss"],
})
export class WordsPickerStepComponent implements OnInit {
	@ViewChild("signUpNgForm") signUpNgForm!: NgForm;
	signUpForm!: UntypedFormGroup;
	session: any;

	constructor(private _formBuilder: UntypedFormBuilder, private _walletService: WalletService) {
		this.session = this._walletService.getSessionData();
	}

	ngOnInit(): void {
		this.signUpForm = this._formBuilder.group({
			termsAcceptance: [false, [Validators.required]],
		});
	}

	startEncryption(wordsCount: number) {
		// this.session.showBiometricsInstructions = true;

		this._walletService.goToNextStep(this.session.step + 1);

		this.session.wordsPicker = false;

		this.session.wordsCount = wordsCount;
	}

	termsAccepted(): boolean {
		return Boolean(this.signUpForm.value.termsAcceptance);
	}
}
