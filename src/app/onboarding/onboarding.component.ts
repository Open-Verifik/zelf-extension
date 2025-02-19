import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Event, Router } from "@angular/router";
import { CaptchaService } from "app/captcha.service";
import { ChromeService } from "app/chrome.service";
import { WalletService } from "app/wallet.service";
import { ZelfNameService } from "app/zelf-name-service.service";

@Component({
	selector: "app-onboarding",
	templateUrl: "./onboarding.component.html",
	styleUrls: ["./onboarding.scss", "../main.scss"],
})
export class OnboardingComponent implements OnInit, OnDestroy {
	@ViewChild("zelfForm") signUpNgForm!: NgForm;

	private intervalId: any;

	step: number = 1;
	walletCreationForm: any;
	termsAcceptance!: boolean;
	zelfForm!: UntypedFormGroup;
	loading: boolean;

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

	activeIndex = 0;
	isTab: boolean = false;
	isTabOpen: boolean = false;

	constructor(
		private _router: Router,
		private _chromeService: ChromeService,
		private _formBuilder: UntypedFormBuilder,
		private _walletService: WalletService,
		private _zelfNameService: ZelfNameService,
		private captchaService: CaptchaService
	) {
		this._walletService.restoreSession();

		this.loading = false;
	}

	ngOnInit(): void {
		this.zelfForm = this._formBuilder.group({
			zelfName: ["", [Validators.required]],
		});

		this.checkIfTabOrPopup();
		this.startRotation();
		this.checkIfTabOpen();
	}

	async onSubmit(event: Event) {}

	// Check if running as a tab or popup
	checkIfTabOrPopup(): void {
		this.isTab = !!window.location.search.includes("tab=true");
	}

	// Check if a tab with the extension is already open
	async checkIfTabOpen(): Promise<void> {
		this.isTabOpen = await this._chromeService.isExtensionTabOpen();
	}

	openFullPage(): void {
		this._chromeService.openFullPage("onboarding").catch(console.error);
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

		// Remove invalid characters (allow only letters, numbers, and dashes)
		let sanitizedValue = control.value.replace(/[^a-zA-Z0-9-]/g, "");

		// Ensure it doesn't start with a special character (only allow letters or numbers)
		sanitizedValue = sanitizedValue.replace(/^-+|-$/g, "");

		// Convert to lowercase
		sanitizedValue = sanitizedValue.toLowerCase();

		// Limit to 20 characters
		if (sanitizedValue.length > 27) {
			sanitizedValue = sanitizedValue.substring(0, 27);
		}

		// Update form control value without triggering events
		control.setValue(sanitizedValue, { emitEvent: false });
	}

	async _initSession(): Promise<any> {
		let { hash } = this._walletService.generateUniqueId();

		const session = await this._walletService.createLivenessSession({
			identifier: hash,
			type: "general",
		});

		if (session?.data) {
			this._chromeService.setItem("accessToken", session.data.token);
		}
	}

	async searchZelfName(event: any): Promise<any> {
		if (!this.zelfForm.valid) {
			this.zelfForm.patchValue({ zelfName: "" });
		}

		if (this.loading) return;

		event.preventDefault();

		this.loading = true;

		const zelfName = `${this.zelfForm.value.zelfName}.zelf`;

		let captchaToken = "";

		if (!this._chromeService.isExtension) {
			try {
				const captchaKey = this.zelfForm.value.zelfName.replace(".", "_");

				captchaToken = await this.captchaService.executeRecaptcha(captchaKey);
			} catch (error) {
				console.error("reCAPTCHA failed:", error);
			}
		}

		// Validation: Ensure zelfName is at least 4 characters
		if (!this.zelfForm.value.zelfName || this.zelfForm.value.zelfName.length < 1) {
			this.loading = false;

			return; // Prevent further execution if validation fails
		}

		await this._initSession();

		this._zelfNameService
			.searchZelfName("zelfName", zelfName, captchaToken)
			.then((response) => {
				if (response?.data.price) return this._noZelfNameFound(response?.data);

				this._zelfNameService.setZelfName(zelfName, { price: 0, reward: 0 });

				const zelfNameObject = response.data.ipfs?.length ? response.data.ipfs[0] : response.data.arweave[0];

				this._zelfNameService.setZelfFile(zelfNameObject);

				this.loading = false;

				this._router.navigate(["/find-wallet"]);
			})
			.catch((exception) => {
				console.error({ exception });

				this.loading = false;
			});
	}

	_noZelfNameFound(zelfNameOffer: any): void {
		this._zelfNameService.setZelfName(zelfNameOffer.zelfName, zelfNameOffer);

		this._zelfNameService.setZelfFile(null);

		this._router.navigate(["/new-zelf-name"]);
	}
}
