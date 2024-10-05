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

	searchZelfName(): void {
		const zelfName = this.zelfForm.value.zelfName;

		// Validation: Ensure zelfName is at least 4 characters
		if (!zelfName || zelfName.length < 4) {
			// You can add an error message here if needed
			alert("Zelf name must be at least 4 characters long.");
			return; // Prevent further execution if validation fails
		}

		this._ipfsService
			.queryByZelfName(zelfName)
			.then((response) => {
				console.log({ ipfsFile: response });
			})
			.catch((exception) => {
				console.error({ exception: exception.error });

				if (exception.error.error === "ipfs_file_not_found") {
					this._ipfsService.setZelfName(`${zelfName}.zelf`);

					this._router.navigate(["/new-zelf-name"]);
				}
			});
	}
}
