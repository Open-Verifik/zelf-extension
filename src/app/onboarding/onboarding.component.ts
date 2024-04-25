import { Component, OnInit } from "@angular/core";

@Component({
	selector: "app-onboarding",
	templateUrl: "./onboarding.component.html",
	styleUrls: ["../main.scss", "./onboarding.scss"],
})
export class OnboardingComponent implements OnInit {
	step: number = 1;
	walletCreationForm: any;
	constructor() {}

	ngOnInit(): void {
		this.walletCreationForm = {
			wordsCount: 12,
			password: null,
		};

		console.log({ step: this.step });
	}
}
