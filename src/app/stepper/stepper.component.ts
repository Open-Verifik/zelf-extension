import { AfterContentInit, Component, ContentChildren, OnInit, QueryList, Input } from "@angular/core";
import { Router } from "@angular/router";

import { StepComponent } from "app/step/step.component";

@Component({
	selector: "app-stepper",
	templateUrl: "./stepper.component.html",
	styleUrls: ["./stepper.component.scss"],
})
export class StepperComponent implements AfterContentInit, OnInit {
	@Input() hideHeader: boolean = false;
	@Input() hideBackButton: boolean = false;
	currentStep = 0;
	numberOfSteps = 0;
	zelfName: string;
	isExtension = Boolean(typeof chrome !== "undefined" && chrome.storage && chrome.runtime);
	routeMapping: any;

	constructor(private _router: Router) {
		this.zelfName = "";
		this.routeMapping = {
			"/new-zelf-name": "/onboarding",
			"/create-wallet": "/new-zelf-name",
			"/find-wallet": "/onboarding",
		};
	}

	ngOnInit(): void {
		this.zelfName = localStorage.getItem("zelfName") || "";
	}

	@ContentChildren(StepComponent) steps!: QueryList<StepComponent>;

	ngAfterContentInit(): void {
		this.numberOfSteps = this.steps?.length || 0; // Initialize the number of steps based on the content children
	}

	back() {
		let previous: StepComponent | null = null;

		// Convert QueryList to array and iterate over it
		const stepsArray = this.steps.toArray();

		for (let i = 0; i < stepsArray.length; i++) {
			const step = stepsArray[i];

			// If the active step is found, break the loop
			if (step.isActive) {
				break;
			}

			// Save the previous step
			previous = step;
		}

		if (!previous) this._redirectOnMapping();
	}

	_redirectOnMapping(): void {
		const activeRoute = this._router.url;

		this._router.navigate([this.routeMapping[activeRoute]]);
	}

	// isStatus(step: any): Boolean {
	// 	if (!this.zelfName && localStorage.getItem("zelfName")) this.zelfName = localStorage.getItem("zelfName") || "";

	// 	return Boolean(["available"].includes(step.label));
	// }
}
