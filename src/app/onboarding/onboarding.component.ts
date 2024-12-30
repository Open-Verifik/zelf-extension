import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ChromeService } from "app/chrome.service";
import { IpfsService } from "app/ipfs.service";
import { WalletService } from "app/wallet.service";
import { ZelfNameService } from "app/zelf-name-service.service";

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
	private intervalId: any;
	activeIndex = 0;
	isTab: boolean = false;
	isTabOpen: boolean = false;

	constructor(
		private _router: Router,
		private _chromeService: ChromeService,
		private _formBuilder: UntypedFormBuilder,
		private _walletService: WalletService,
		private _ipfsService: IpfsService,
		private _zelfNameService: ZelfNameService
	) {
		this._walletService.restoreSession();

		this._zelfNameService.setZelfFile(null);

		this._zelfNameService.setZelfName("", 0);

		this.loading = false;
	}

	ngOnInit(): void {
		this.zelfForm = this._formBuilder.group({
			zelfName: ["", [Validators.required]],
		});

		this._ipfsService.setZelfName("");

		this.startRotation();

		this.checkIfTabOrPopup();

		this.checkIfTabOpen();
	}

	// Check if running as a tab or popup
	checkIfTabOrPopup(): void {
		this.isTab = !!window.location.search.includes("tab=true");
	}

	// Check if a tab with the extension is already open
	async checkIfTabOpen(): Promise<void> {
		this.isTabOpen = await this._chromeService.isExtensionTabOpen();
	}

	openFullPage(force: boolean): void {
		this._chromeService.openFullPage(force).catch(console.error);
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

	async searchZelfName(): Promise<any> {
		if (!this.zelfForm.valid) {
			this.zelfForm.patchValue({ zelfName: "" });
		}

		if (this.loading) return;

		this.loading = true;

		const zelfName = `${this.zelfForm.value.zelfName}.zelf`;

		// Validation: Ensure zelfName is at least 4 characters
		if (!this.zelfForm.value.zelfName || this.zelfForm.value.zelfName.length < 8) {
			// You can add an error message here if needed
			alert("[BETA] FREE Zelf names must be at least 8 characters long.");

			this.loading = false;

			return; // Prevent further execution if validation fails
		}

		await this._initSession();

		this._zelfNameService
			.searchZelfName("zelfName", zelfName)
			.then((response) => {
				if (response?.data.price) return this._noZelfNameFound(response?.data);

				this._ipfsService.setZelfName(zelfName);

				this._zelfNameService.setZelfName(zelfName, 0);
				this._ipfsService.setZelfFile(response.data.arweave ? response.data.arweave[0] : response.data.ipfs[0]);
				this._zelfNameService.setZelfFile(response.data.arweave ? response.data.arweave[0] : response.data.ipfs[0]);

				this.loading = false;

				this._router.navigate(["/find-wallet"]);
			})
			.catch((exception) => {
				console.error({ exception });

				this.loading = false;
			});
	}

	_noZelfNameFound(zelfNameOffer: any): void {
		this._ipfsService.setZelfName(zelfNameOffer.zelfName);

		this._ipfsService.setZelfFile(null);

		this._zelfNameService.setZelfName(zelfNameOffer.zelfName, zelfNameOffer.price);

		this._zelfNameService.setZelfFile(null);

		this._router.navigate(["/new-zelf-name"]);
	}
}
