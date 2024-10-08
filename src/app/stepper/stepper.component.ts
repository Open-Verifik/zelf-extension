import { OnInit, Component, ContentChildren, Input, QueryList } from "@angular/core";
import { Router } from "@angular/router";
import { StepComponent } from "app/step/step.component";
import { WalletService } from "app/wallet.service";

@Component({
	selector: "app-stepper",
	templateUrl: "./stepper.component.html",
	styleUrls: ["./stepper.component.scss"],
})
export class StepperComponent implements OnInit {
	@Input() hideHeader: boolean = false;
	@Input() hideBackButton: boolean = false;
	@Input() stepsArray: any;
	currentStep = 0;
	numberOfSteps = 0;
	zelfName: string;
	stepsMapping: any;
	routeMapping: any;
	session: any;

	constructor(private _router: Router, private _walletService: WalletService) {
		this.routeMapping = {
			"/new-zelf-name": "/onboarding",
			"/create-wallet": "/new-zelf-name",
			"/find-wallet": "/onboarding",
			"/import-wallet": "/new-zelf-name",
		};

		this.zelfName = localStorage.getItem("zelfName") || "";

		this.stepsMapping = {};

		this.session = this._walletService.getSessionData();
	}

	@ContentChildren(StepComponent) steps!: QueryList<StepComponent>;

	ngOnInit() {
		this.numberOfSteps = this.steps?.length || 0; // Initialize the number of steps based on the content children
		for (let index = 0; index < this.stepsArray.length; index++) {
			const step = this.stepsArray[index];

			this.stepsMapping[step.label] = index;
		}

		this.updateSteps();
	}

	next() {
		if (this.currentStep < this.numberOfSteps - 1) {
			this.currentStep++;
			this.updateSteps();
		}
	}

	// back() {
	// 	if (this.currentStep > 0) {
	// 		this.currentStep--;
	// 		this.updateSteps();
	// 	}
	// }

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

		if (!previous) {
			this._redirectOnMapping();

			return;
		}

		this.currentStep = this.stepsMapping[previous.label];

		this.session.step = this.currentStep;

		this.updateSteps();
	}

	_redirectOnMapping(): void {
		const activeRoute = this._router.url;

		this.updateSteps();

		this._router.navigate([this.routeMapping[activeRoute]]);
	}

	private updateSteps() {
		if (!this.steps) return;

		this.steps.forEach((step: any, index: number) => {
			step.isActive = index === this.currentStep;
			step.isCompleted = index < this.currentStep;
		});
	}
}
