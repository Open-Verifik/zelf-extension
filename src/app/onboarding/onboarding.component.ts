import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslocoService } from "@ngneat/transloco";
import { IpfsService } from "app/ipfs.service";
import { WalletService } from "app/wallet.service";

let isTabOpen = false;

@Component({
	selector: "app-onboarding",
	templateUrl: "./onboarding.component.html",
	styleUrls: ["./onboarding.scss", "../main.scss"],
})
export class OnboardingComponent implements OnInit, OnDestroy {
	step: number = 1;
	walletCreationForm: any;
	termsAcceptance!: boolean;
	@ViewChild("zelfForm") signUpNgForm!: NgForm;
	zelfForm!: UntypedFormGroup;
	items = [
		{
			title: "onboarding.step_1",
			description: "onboarding.step_1_description",
			// image: "../../assets/images/onboardingface.png",
			image: "../../assets/images/onboarding1.png",
		},
		{
			title: "onboarding.step_2",
			description: "onboarding.step_2_description",
			image: "../../assets/images/onboardingface.png",
		},
		{
			title: "onboarding.step_3",
			description: "onboarding.step_3_description",
			image: "../../assets/images/onboarding_qr.svg",
		},
		// Add more items as needed
	];
	private intervalId: any;
	activeIndex = 0;

	constructor(
		private _router: Router,
		private _translocoService: TranslocoService,
		private _formBuilder: UntypedFormBuilder,
		private _walletService: WalletService,
		private _ipfsService: IpfsService
	) {
		this._walletService.restoreSession();
		this._ipfsService.setZelfFile(null);
		this._ipfsService.setZelfName("");
	}

	ngOnInit(): void {
		this.zelfForm = this._formBuilder.group({
			zelfName: ["", [Validators.required]],
		});

		this._ipfsService.setZelfName("");

		this.startRotation();
	}

	openFullPage(): void {
		if (isTabOpen) return;

		try {
			const url = chrome.runtime.getURL("index.html");

			chrome.tabs.create({ url });

			isTabOpen = true; // Set the flag to prevent future invocations
		} catch (exception) {
			console.error("Failed to open tab:", exception);
		}
	}

	startRotation(): void {
		this.intervalId = setInterval(() => {
			this.activeIndex = (this.activeIndex + 1) % this.items.length;
		}, 5000);
	}

	previous() {
		if (this.activeIndex > 0) {
			this.activeIndex--;
		} else {
			this.activeIndex = this.items.length - 1;
		}
	}

	next() {
		if (this.activeIndex < this.items.length - 1) {
			this.activeIndex++;
		} else {
			this.activeIndex = 0;
		}
	}

	goToCreateWallet(): void {
		this._router.navigate(["/create-wallet"]);
	}

	goToImportWallet(): void {
		this._router.navigate(["/import-wallet"]);
	}

	goToFindWallet(): void {
		this._router.navigate(["/find-wallet"]);
	}

	acceptedTerms(): Boolean {
		return Boolean(this.zelfForm.value.termsAcceptance);
	}

	ngOnDestroy(): void {
		if (this.intervalId) {
			clearInterval(this.intervalId);
		}
	}

	// Method to sanitize input
	sanitizeZelfNameInput() {
		const control = this.zelfForm.get("zelfName");

		if (!control) return;

		// Remove invalid characters, ensure lowercase
		let sanitizedValue = control.value.replace(/[^a-z0-9.-]/g, "").toLowerCase();

		// Ensure it doesn't start with a number or special character and doesn't end with '.' or '-'
		sanitizedValue = sanitizedValue.replace(/^[^a-z]+|[.-]$/g, "");

		// Limit to 20 characters
		if (sanitizedValue.length > 20) {
			sanitizedValue = sanitizedValue.substring(0, 20);
		}

		// Update form control value without triggering events
		control.setValue(sanitizedValue, { emitEvent: false });
	}

	searchZelfName(): void {
		if (!this.zelfForm.valid) {
			this.zelfForm.patchValue({ zelfName: "" });
		}

		const zelfName = `${this.zelfForm.value.zelfName}.zelf`;

		// Validation: Ensure zelfName is at least 4 characters
		if (!this.zelfForm.value.zelfName || this.zelfForm.value.zelfName.length < 4) {
			// You can add an error message here if needed
			alert("Zelf name must be at least 4 characters long.");

			return; // Prevent further execution if validation fails
		}

		this._ipfsService
			.queryByZelfName(zelfName)
			.then((response) => {
				if (!response || !response.data || !response.data.length) return this._noZelfNameFound(zelfName);

				this._ipfsService.setZelfName(zelfName);

				this._ipfsService.setZelfFile(response.data[0]);

				this._router.navigate(["/find-wallet"]);
			})
			.catch((exception) => {
				console.error({ exception: exception.error });

				if (exception.error.error === "ipfs_file_not_found") {
					this._noZelfNameFound(zelfName);
				}
			});
	}

	_noZelfNameFound(zelfName: string): void {
		this._ipfsService.setZelfName(zelfName);

		this._ipfsService.setZelfFile(null);

		this._router.navigate(["/new-zelf-name"]);
	}
}
