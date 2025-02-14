import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm, UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CaptchaService } from "app/captcha.service";
import { WalletService } from "app/wallet.service";
import { ZelfNameService } from "app/zelf-name-service.service";
import { debounceTime, distinctUntilChanged } from "rxjs";

@Component({
	selector: "new-name-card",
	template: `
		<mat-progress-bar mode="query" *ngIf="loading"></mat-progress-bar>
		<div class="zelf-card">
			<form [formGroup]="zelfForm" #signUpNgForm="ngForm" fxLayout="column" fxLayoutAlign="start start" class="my-1 w-full">
				<div fxLayout="column" fxLayoutAlign="start start" class="new-zelf-inner-card-1">
					<p class="m-0">{{ "onboarding.register" | transloco }}</p>

					<h3 class="m-0">{{ zelfName }}</h3>

					<small class="mt-4">
						{{ "onboarding.register_description" | transloco : { duration: duration } }}

						{{ (duration === 1 ? "onboarding.year" : "onboarding.years") | transloco }}.</small
					>

					<small *ngIf="reward"> {{ "onboarding.zns_reward" | transloco : { reward: reward } }}. </small>
				</div>

				<div fxLayout="column" fxLayoutAlign="space-between center" class="w-full">
					<div class="new-zelf-ipfs-length-card" fxLayout="row" fxLayoutAlign="space-between center">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" *ngIf="duration === 1">
							<path
								d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17 13H7V11H17V13Z"
								fill="#E2E2E6"
							/>
						</svg>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							*ngIf="duration !== 1"
							class="cursor-pointer"
							(click)="decreaseDuration()"
						>
							<path
								d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17 13H7V11H17V13Z"
								fill="#181818"
							/>
						</svg>
						<h2 *ngIf="duration <= 5" class="p-1">
							{{ duration }} {{ (duration === 1 ? "onboarding.year" : "onboarding.years") | transloco }}
						</h2>

						<h2 *ngIf="duration === 'lifetime'">{{ "onboarding.lifetime" | transloco }}</h2>

						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							*ngIf="duration !== 'lifetime'"
							(click)="increaseDuration()"
							class="cursor-pointer"
						>
							<path
								d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17 13H13V17H11V13H7V11H11V7H13V11H17V13Z"
								fill="#181818"
							/>
						</svg>

						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							*ngIf="duration === 'lifetime'"
						>
							<path
								d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17 13H13V17H11V13H7V11H11V7H13V11H17V13Z"
								fill="#E2E2E6"
							/>
						</svg>
					</div>

					<!-- price -->
					<div class="new-zelf-ipfs-length-card" fxLayout="row" fxLayoutAlign="space-between center">
						<span *ngIf="duration !== 'lifetime'" class="price-label">{{ "onboarding.price_per_year" | transloco }}</span>
						<span *ngIf="duration === 'lifetime'" class="price-label">{{ "onboarding.price_for_lifetime" | transloco }}</span>

						<h4>
							<span class="text-bold mr-1">{{ price | currency }}</span> <span class="currency">USD</span>
						</h4>
					</div>
					<!-- end of price -->

					<!-- referred by -->
					<div class="new-zelf-ipfs-length-card p-3 bg-white" fxLayout="row" fxLayoutAlign="space-between center">
						<span class="font-bold"> {{ "onboarding.referral_code" | transloco }} </span>

						<div class="unlock-input-box">
							<div class="unlock-input-text-container">
								<mat-form-field class="w-full">
									<input
										type="text"
										matInput
										[formControlName]="'zelfName'"
										autocomplete="off"
										(keydown.enter)="searchZelfName($event)"
										(input)="sanitizeZelfNameInput()"
										[readonly]="zelfNameObject || loading"
									/>
								</mat-form-field>
							</div>
							<div class="unlock-icon-container" fxLayout="row" fxLayoutAlign="start center">
								<span class="zpan"> .zelf </span>
							</div>
						</div>
					</div>
					<!-- end of referral -->
				</div>

				<span class="zline-2"></span>

				<div class="my-1 w-full">
					<mat-checkbox class="on-checkbox" formControlName="termsAcceptance">
						{{ "onboarding.accept_terms_1" | transloco }}
						<a href="https://docs.zelf.world/zelf-legal/terms-of-use" target="_blank">{{ "onboarding.accept_terms_2" | transloco }}</a>
					</mat-checkbox>
				</div>

				<div class="p-3 w-full" fxLayout="column" fxLayoutAlign="center center">
					<button mat-raised-button class="w-full my-3 main-button" (click)="goToCreateWallet()" [disabled]="!acceptedTerms()">
						{{ "onboarding.create_new_wallet" | transloco }}
					</button>

					<button mat-raised-button class="w-full my-1 secondary-button" (click)="goToImportWallet()" [disabled]="!acceptedTerms()">
						{{ "onboarding.import_wallet" | transloco }}
					</button>
				</div>
			</form>
		</div>
	`,
	styleUrls: ["./new-name-card.component.scss", "../main.scss"],
})
export class NewNameCardComponent implements OnInit {
	@ViewChild("zelfForm") signUpNgForm!: NgForm;
	zelfForm!: UntypedFormGroup;
	zelfName: string;
	steps: Array<any>;
	session: any;
	duration: any;
	isZelfNameEmpty: boolean;
	zelfNamePricing: any = {
		1: { 1: 240, 2: 432, 3: 612, 4: 768, 5: 900, lifetime: 3600 },
		2: { 1: 120, 2: 216, 3: 306, 4: 384, 5: 450, lifetime: 1800 },
		3: { 1: 72, 2: 130, 3: 184, 4: 230, 5: 270, lifetime: 1080 },
		4: { 1: 36, 2: 65, 3: 92, 4: 115, 5: 135, lifetime: 540 },
		5: { 1: 30, 2: 54, 3: 76, 4: 96, 5: 112, lifetime: 450 },
		"6-15": { 1: 24, 2: 43, 3: 61, 4: 77, 5: 90, lifetime: 360 },
		16: { 1: 23, 2: 41, 3: 59, 4: 74, 5: 86, lifetime: 345 },
		17: { 1: 22, 2: 40, 3: 56, 4: 70, 5: 82, lifetime: 330 },
		18: { 1: 21, 2: 38, 3: 54, 4: 67, 5: 79, lifetime: 315 },
		19: { 1: 20, 2: 36, 3: 51, 4: 64, 5: 75, lifetime: 300 },
		20: { 1: 19, 2: 34, 3: 48, 4: 61, 5: 72, lifetime: 285 },
		21: { 1: 18, 2: 32, 3: 46, 4: 58, 5: 68, lifetime: 270 },
		22: { 1: 17, 2: 31, 3: 43, 4: 54, 5: 64, lifetime: 255 },
		23: { 1: 16, 2: 29, 3: 41, 4: 51, 5: 60, lifetime: 240 },
		24: { 1: 15, 2: 27, 3: 38, 4: 48, 5: 56, lifetime: 225 },
		25: { 1: 14, 2: 25, 3: 36, 4: 45, 5: 53, lifetime: 210 },
		26: { 1: 13, 2: 23, 3: 33, 4: 42, 5: 49, lifetime: 195 },
		27: { 1: 12, 2: 22, 3: 31, 4: 38, 5: 45, lifetime: 180 },
	};
	price: number;
	loading: boolean;
	zelfNameObject: any;
	reward: any;

	constructor(
		private _router: Router,
		private _formBuilder: UntypedFormBuilder,
		private _walletService: WalletService,
		private _zelfNameService: ZelfNameService,
		private captchaService: CaptchaService
	) {
		this.zelfName = "";
		this.duration = 1;
		this.price = 24;
		this.loading = false;
		this.isZelfNameEmpty = true;

		this.steps = [
			{
				isActive: true,
				isCompleted: false,
				label: "available",
				isStatus: true,
			},
		];

		this.session = this._walletService.getSessionData();

		this.session.steps = [];

		this.zelfForm = this._formBuilder.group({
			termsAcceptance: [false, [Validators.required]],
			zelfName: ["", []],
		});
	}

	async ngOnInit(): Promise<any> {
		this.zelfName = this._zelfNameService.getZelfName();

		this.price = this._zelfNameService.getZelfPrice();

		this.reward = this._zelfNameService.getZelfReward();

		if (!this.zelfName) return this._router.navigate(["/onboarding"]);

		// Track input value changes
		// Track input changes and trigger searchZelfName after 5 seconds
		this.zelfForm
			.get("zelfName")
			?.valueChanges.pipe(
				debounceTime(5000), // Wait 5 seconds after typing stops
				distinctUntilChanged() // Only trigger if the value actually changes
			)
			.subscribe((value) => {
				this.isZelfNameEmpty = !value || value.trim() === "";

				if (!this.isZelfNameEmpty) {
					this.searchZelfName(new Event("input")); // Trigger search
				}
			});
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

	acceptedTerms(): boolean {
		return Boolean(
			this.zelfForm.value.termsAcceptance && !this.loading // Disable if zelfName is empty OR zelfNameObject is not set
		);
	}

	goBack(): void {
		this._router.navigate(["/onboarding"]);
	}

	increaseDuration(): void {
		if (this.duration === "lifetime") return;

		this.duration = this.duration === 5 ? "lifetime" : this.duration + 1;

		this._calculateZelfNamePrice();
	}

	decreaseDuration(): void {
		if (this.duration === 1) return;

		this.duration = this.duration === "lifetime" ? 5 : this.duration - 1;

		this._calculateZelfNamePrice();
	}

	/**
	 * Get Zelf Name price based on name length and duration
	 * @param {number} length - The length of the Zelf name
	 * @param {string} duration - Duration ("1", "2", "3", "4", "5", "lifetime")
	 * @returns {number} - Price of the Zelf name
	 */
	_calculateZelfNamePrice(): void {
		if (!["1", "2", "3", "4", "5", "lifetime"].includes(`${this.duration}`))
			throw new Error("Invalid duration. Use '1', '2', '3', '4', '5' or 'lifetime'.");

		let price = 24;

		const length = this.zelfName.split(".zelf")[0].length;

		if (length >= 6 && length <= 15) {
			price = this.zelfNamePricing["6-15"][this.duration];
		} else if (this.zelfNamePricing[length]) {
			price = this.zelfNamePricing[length][this.duration];
		} else {
			throw new Error("Invalid name length. Length must be between 1 and 27.");
		}

		// Round up to 2 decimal places
		this.price = Math.ceil(price * 100) / 100 - (this.zelfNameObject ? price * 0.1 : 0);
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

		try {
			const captchaKey = this.zelfForm.value.zelfName.replace(".", "_");

			captchaToken = await this.captchaService.executeRecaptcha(captchaKey);
		} catch (error) {
			console.error("reCAPTCHA failed:", error);
		}

		// Validation: Ensure zelfName is at least 4 characters
		if (!this.zelfForm.value.zelfName.length) {
			this.loading = false;

			return; // Prevent further execution if validation fails
		}

		this._zelfNameService
			.searchZelfName("zelfName", zelfName, captchaToken)
			.then((response) => {
				if (response?.data.price) {
					this.zelfForm.patchValue({ zelfName: "" });
					this.loading = false;
					return;
				}

				this.zelfNameObject = response.data.ipfs?.length ? response.data.ipfs[0] : response.data.arweave[0];

				this._zelfNameService.setReferral(this.zelfNameObject.zelfName);

				this._calculateZelfNamePrice();

				this.loading = false;
			})
			.catch((exception) => {
				console.error({ exception });

				this.loading = false;
			});
	}

	// Method to sanitize input
	sanitizeZelfNameInput() {
		const control = this.zelfForm.get("zelfName");

		if (!control) return;

		// Remove invalid characters,
		let sanitizedValue = control.value.replace(/[^a-zA-Z0-9.-]/g, "");

		// Ensure it doesn't start with a number or special character and doesn't end with '.' or '-'
		sanitizedValue = sanitizedValue.replace(/^[^a-zA-Z]+|[.-]$/g, "");

		// Convert to lower case at the end
		sanitizedValue = sanitizedValue.toLowerCase();

		// Limit to 20 characters
		if (sanitizedValue.length > 20) {
			sanitizedValue = sanitizedValue.substring(0, 20);
		}

		// Update form control value without triggering events
		control.setValue(sanitizedValue, { emitEvent: false });
	}
}
