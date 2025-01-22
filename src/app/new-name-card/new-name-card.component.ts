import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm, UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { IpfsService } from "app/ipfs.service";
import { WalletService } from "app/wallet.service";
import { ZelfNameService } from "app/zelf-name-service.service";

@Component({
	selector: "new-name-card",
	template: `
		<div class="zelf-card">
			<div fxLayout="column" fxLayoutAlign="start start" class="p-4 w-full">
				<div fxLayout="column" fxLayoutAlign="start start" class="new-zelf-inner-card-1">
					<p class="m-0">{{ "onboarding.register" | transloco }}</p>

					<h3 class="m-0">{{ zelfName }}</h3>

					<small class="mt-4">
						{{ "onboarding.register_description" | transloco : { duration: duration } }}

						{{ (duration === 1 ? "onboarding.year" : "onboarding.years") | transloco }}.</small
					>
				</div>

				<div fxLayout="column" fxLayoutAlign="center center" class="w-full">
					<div class="new-zelf-ipfs-length-card" fxLayout="row" fxLayoutAlign="center center">
						<h2>{{ duration }} {{ (duration === 1 ? "onboarding.year" : "onboarding.years") | transloco }}</h2>
					</div>
				</div>

				<span class="zline-2"></span>

				<form [formGroup]="zelfForm" #signUpNgForm="ngForm" class="my-1 w-full">
					<mat-checkbox class="on-checkbox" [formControlName]="'termsAcceptance'">
						{{ "onboarding.accept_terms_1" | transloco }}
						<a href="https://example.com/terms" target="_blank">{{ "onboarding.accept_terms_2" | transloco }}</a>
					</mat-checkbox>
				</form>

				<button mat-raised-button class="w-full my-3 main-button" (click)="goToCreateWallet()" [disabled]="!acceptedTerms()">
					{{ "onboarding.create_new_wallet" | transloco }}
				</button>

				<button mat-raised-button class="w-full my-1 secondary-button" (click)="goToImportWallet()" [disabled]="!acceptedTerms()">
					{{ "onboarding.import_wallet" | transloco }}
				</button>
			</div>
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
	duration: number;

	constructor(
		private _router: Router,
		private _formBuilder: UntypedFormBuilder,
		private _ipfsService: IpfsService,
		private _walletService: WalletService,
		private _zelfNameService: ZelfNameService
	) {
		this.zelfName = "";
		this.duration = 1;

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
	}

	async ngOnInit(): Promise<any> {
		this.zelfName = await this._ipfsService.getZelfName();

		if (!this.zelfName) return this._router.navigate(["/onboarding"]);

		this.zelfForm = this._formBuilder.group({
			termsAcceptance: [false, [Validators.required]],
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

	acceptedTerms(): Boolean {
		return Boolean(this.zelfForm.value.termsAcceptance);
	}

	goBack(): void {
		this._router.navigate(["/onboarding"]);
	}
}
