import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslocoService } from "@ngneat/transloco";

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
			image: "https://cdn.verifik.co/wallet/onboarding1.svg",
		},
		{
			title: "onboarding.step_2",
			description: "onboarding.step_2_description",
			image: "https://cdn.verifik.co/wallet/onboarding2.svg",
		},
		{
			title: "onboarding.step_3",
			description: "onboarding.step_3_description",
			image: "https://cdn.verifik.co/wallet/onboarding3.svg",
		},
		// Add more items as needed
	];
	private intervalId: any;
	activeIndex = 0;

	constructor(private _router: Router, private _translocoService: TranslocoService, private _formBuilder: UntypedFormBuilder) {
		const currentLang = this._translocoService.getActiveLang();
	}

	ngOnInit(): void {
		this.termsForm = this._formBuilder.group({
			termsAcceptance: [false, [Validators.required]],
		});
		this.startRotation();
	}

	startRotation(): void {
		this.intervalId = setInterval(() => {
			this.activeIndex = (this.activeIndex + 1) % this.items.length;
		}, 10000); // Rotate every 5000 milliseconds (5 seconds)
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

	acceptedTerms(): Boolean {
		return Boolean(this.termsForm.value.termsAcceptance);
	}

	ngOnDestroy(): void {
		if (this.intervalId) {
			clearInterval(this.intervalId);
		}
	}
}
