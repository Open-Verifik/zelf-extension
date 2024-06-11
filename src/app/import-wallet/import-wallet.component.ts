import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { EthereumService } from "app/eth.service";
import { HttpWrapperService } from "app/http-wrapper.service";
import { WalletService } from "app/wallet.service";

@Component({
	selector: "app-import-wallet",
	templateUrl: "./import-wallet.component.html",
	styleUrls: ["./import-wallet.component.scss", "../main.scss"],
})
export class ImportWalletComponent implements OnInit {
	stepperSelected: number = 0;
	@ViewChild("importNgForm") importNgForm!: NgForm;
	importForm!: UntypedFormGroup;
	wordsArray: number[][] = [];
	wordsPerRow: number = 3;
	showPassword: boolean[] = [];
	session: any;
	wallet: any;

	constructor(
		private _router: Router,
		private _formBuilder: UntypedFormBuilder,
		private _walletService: WalletService,
		private _ethService: EthereumService,
		private snackBar: MatSnackBar,
		private _httpWrapperService: HttpWrapperService
	) {
		this._initForm();

		this.session = this._walletService.getSessionData();

		this.wallet = this._walletService.getWallet();

		if (this.wallet) {
			this.session.navigationStep = 3;
		}

		this._walletService.setSteps([
			{
				label: "import_wallet",
				isActive: Boolean(this.session.step === 0),
				isCompleted: Boolean(this.session.step > 0),
			},
			{
				label: "add_password",
				isActive: Boolean(this.session.step === 1),
				isCompleted: Boolean(this.session.step > 1),
			},
			{
				label: "qr_code_generator",
				isActive: Boolean(this.session.step === 2),
				isCompleted: Boolean(this.session.step > 2),
			},
		]);
	}

	_initForm(): void {
		this.importForm = this._formBuilder.group({
			wordsCount: [12, [Validators.required]],
			word1: ["", [Validators.required]],
			word2: ["", [Validators.required]],
			word3: ["", [Validators.required]],
			word4: ["", [Validators.required]],
			word5: ["", [Validators.required]],
			word6: ["", [Validators.required]],
			word7: ["", [Validators.required]],
			word8: ["", [Validators.required]],
			word9: ["", [Validators.required]],
			word10: ["", [Validators.required]],
			word11: ["", [Validators.required]],
			word12: ["", [Validators.required]],
			word13: [""],
			word14: [""],
			word15: [""],
			word16: [""],
			word17: [""],
			word18: [""],
			word19: [""],
			word20: [""],
			word21: [""],
			word22: [""],
			word23: [""],
			word24: [""],
		});

		this.wordsPerRow = this.importForm.value.wordsCount === 12 ? 3 : 4;

		for (let i = 1; i <= 24; i++) {
			this.showPassword.push(false);
		}
	}

	ngOnInit(): void {
		this.setTotalRows(12);

		this.onWordsCountChange();
	}

	onWordsCountChange(): void {
		const wordsCountControl = this.importForm.get("wordsCount");

		if (!wordsCountControl) return;

		wordsCountControl.valueChanges.subscribe((value) => {
			this.wordsPerRow = value === 12 ? 3 : 4;

			this.wordsArray = [];

			this.setTotalRows(value);

			this.updateValidators(value);
		});
	}

	updateValidators(wordsCount: number): void {
		for (let i = 1; i <= 24; i++) {
			const control = this.importForm.get(`word${i}`);
			if (control) {
				if (i <= wordsCount) {
					control.setValidators([Validators.required]);
				} else {
					control.clearValidators();
				}
				control.updateValueAndValidity();
			}
		}
	}

	setTotalRows(wordsCount: number): void {
		const totalRows = Math.ceil(wordsCount / this.wordsPerRow);

		for (let i = 0; i < totalRows; i++) {
			this.wordsArray.push(
				Array.from({ length: this.wordsPerRow }, (_, j) => i * this.wordsPerRow + j + 1).filter((word) => word <= wordsCount)
			);
		}
	}

	handlePaste(event: ClipboardEvent, index: number): void {
		const clipboardData = event.clipboardData || (window as any).clipboardData;
		const pastedText = clipboardData.getData("text");
		const words = pastedText.trim().split(/\s+/);

		if (words.length === 12 || words.length === 24) {
			event.preventDefault();
			for (let i = 0; i < words.length; i++) {
				const control = this.importForm.get(`word${index + i}`);
				if (control) {
					control.setValue(words[i]);
				}
			}
		}
	}

	toggleShowPassword(index: number): void {
		this.showPassword[index] = !this.showPassword[index];
	}

	goBack(): void {
		this._router.navigate(["/onboarding"]);
	}

	start(): void {
		this.session.navigationStep++;
	}

	canImportWallet(): boolean {
		let count = 0;

		for (const key in this.importForm.value) {
			if (!Object.prototype.hasOwnProperty.call(this.importForm.value, key)) continue;

			const element = this.importForm.value[key];

			if (key.includes("Count")) continue;

			if (!element) continue;

			count += 1;
		}

		return Boolean(count === 12 || count === 24);
	}

	async validateWallet(): Promise<any> {
		const value = this.importForm.value;

		let phrase = ``;

		for (const key in value) {
			if (!Object.prototype.hasOwnProperty.call(value, key)) continue;

			const element = value[key];

			if (key.includes("Count")) continue;

			phrase += `${element} `;
		}

		phrase = phrase.trim();

		const wallet = this._ethService.generateAddressFromMnemonic(phrase);

		if (!wallet) {
			this.snackBar.open("Invalid mnemonic phrase", "Close", {
				duration: 3000,
			});
		}

		this.session.phrase = await this._httpWrapperService.encryptMessage(phrase);

		this._walletService.goToNextStep(this.session.step + 1);
	}

	startEncryption(): void {
		this.session.step += 1;
	}

	startCamera(): void {
		this.session.step += 1;
	}

	canSee12WordsStep(index: number): boolean {
		return Boolean(index === 0 && this.session.step === 0);
	}

	canSeePasswordStep(index: number): boolean {
		return Boolean(index === 1 && this.session.step === 1 && !this.session.showBiometricsInstructions && !this.session.showBiometrics);
	}

	canSeeBiometricInstructions(index: number): boolean {
		return Boolean(index === 1 && this.session.step === 1 && this.session.showBiometricsInstructions);
	}

	canSeeBiometrics(index: number): boolean {
		return Boolean(index === 1 && this.session.step === 1 && this.session.showBiometrics);
	}

	canSeeQRCode(index: number): boolean {
		return Boolean(index === 2 && this.session.step === 2);
	}
}
