import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslocoService } from "@ngneat/transloco";

@Component({
	selector: "app-onboarding",
	templateUrl: "./onboarding.component.html",
	styleUrls: ["./onboarding.scss", "../main.scss"],
})
export class OnboardingComponent implements OnInit {
	step: number = 1;
	walletCreationForm: any;
	items = [
		{ image: "../../assets/images/framespaceholder.svg" },
		{ image: "../../assets/images/logo.svg" },
		// Add more items as needed
	];
	activeIndex = 0;

	constructor(private _router: Router, private _translocoService: TranslocoService) {
		const currentLang = this._translocoService.getActiveLang();

		console.log({ currentLang });
	}

	ngOnInit(): void {
		this.walletCreationForm = {
			wordsCount: 12,
			password: null,
		};

		console.log({ step: this.step });
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
}
