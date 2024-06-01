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
	words!: Array<any>;

	constructor(
		private _formBuilder: UntypedFormBuilder,
		private _router: Router,
		private _walletService: WalletService,
		private snackBar: MatSnackBar,
		private _translocoService: TranslocoService
	) {
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

		const walletId = localStorage.getItem("walletId");

		if (walletId) {
			this._getWallet(walletId);
		}
	}

	_getWallet(walletId: string): void {
		this._walletService.requestWallet(walletId).subscribe({
			next: (response) => {
				if (!environment.production) {
					this.wallet = JSON.parse(localStorage.getItem("wallet") || "");

					if (this.wallet) {
						this.currentStep = 2;

						this._prepareWords();
					}
				}

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
		this.showBiometricsInstructions = false;
	}

	afterBiometricsCallback(response: any): void {
		localStorage.setItem("walletId", response._id);

		localStorage.setItem("wallet", JSON.stringify(response));

		this.wallet = response;

		console.log({ wallet: this.wallet });

		this._prepareWords();

		this.showBiometrics = false;

		this.showBiometricsInstructions = false;

		this.currentStep++;

		this.updateSteps();
	}

	_prepareWords(): void {
		this.words = [];

		for (const key in this.wallet.metadata) {
			if (!Object.prototype.hasOwnProperty.call(this.wallet.metadata, key)) continue;
			const word = this.wallet.metadata[key];

			this.words.push({ id: key, word });
		}

		console.log({ words: this.words });
	}

	isPasswordCorrect(): boolean {
		const { password, repeatPassword, termsAcceptance } = this.signUpForm.value;

		return Boolean(password && repeatPassword && password === repeatPassword && termsAcceptance && password.length >= 8);
	}

	copyPublicAddress(): void {
		navigator.clipboard.writeText(this.wallet.publicData.ethAddress).then(
			() => {
				this.snackBar.open(this._translocoService.translate("common.copy_to_clipboard"), this._translocoService.translate("common.close"), {
					duration: 5000,
					verticalPosition: "bottom",
				});
			},
			(err) => {
				this.snackBar.open(
					this._translocoService.translate("common.failed_to_copy_to_clipboard"),
					this._translocoService.translate("common.close"),
					{
						duration: 3000,
						horizontalPosition: "center",
						verticalPosition: "bottom",
					}
				);
			}
		);
	}

	// Function to download the image
	downloadImage(): void {
		// Split the base64 string to get the mime type and the data
		const parts = this.wallet.image.split(";base64,");
		const mimeType = parts[0].split(":")[1];
		const imageData = parts[1];
		const byteCharacters = atob(imageData);
		const byteNumbers = new Array(byteCharacters.length);

		for (let i = 0; i < byteCharacters.length; i++) {
			byteNumbers[i] = byteCharacters.charCodeAt(i);
		}

		const byteArray = new Uint8Array(byteNumbers);

		// Create a new Blob object using the byteArray and the mime type
		const blob = new Blob([byteArray], { type: mimeType });

		// Create a URL for the blob object
		const blobUrl = URL.createObjectURL(blob);

		// Create a temporary anchor element and trigger a download
		const a = document.createElement("a");
		a.href = blobUrl;
		a.download = `${this.wallet._id}.png`; // Set the file name
		a.style.display = "none";
		document.body.appendChild(a);
		a.click(); // Simulate the click event

		// Clean up by revoking the object URL and removing the anchor element
		URL.revokeObjectURL(blobUrl);

		document.body.removeChild(a);
	}

	goToInstructions(): void {
		this._router.navigate(["extension-instructions"]);
	}
}
