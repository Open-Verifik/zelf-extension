import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslocoService } from "@ngneat/transloco";
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
	@ViewChild("termsForm") signUpNgForm!: NgForm;
	termsForm!: UntypedFormGroup;
	items = [
		{
			title: "onboarding.step_1",
			description: "onboarding.step_1_description",
			image: "../../assets/images/onboarding_lock.svg",
		},
		{
			title: "onboarding.step_2",
			description: "onboarding.step_2_description",
			image: "../../assets/images/onboarding_face.svg",
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
		private _walletService: WalletService
	) {
		this._walletService.restoreSession();
	}

	ngOnInit(): void {
		this.termsForm = this._formBuilder.group({
			termsAcceptance: [false, [Validators.required]],
		});

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
		return Boolean(this.termsForm.value.termsAcceptance);
	}

	ngOnDestroy(): void {
		if (this.intervalId) {
			clearInterval(this.intervalId);
		}
	}
}
