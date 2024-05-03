import { AfterContentInit, Component, ContentChildren, QueryList } from "@angular/core";
import { StepComponent } from "app/step/step.component";

@Component({
	selector: "app-stepper",
	templateUrl: "./stepper.component.html",
	styleUrls: ["./stepper.component.scss"],
})
export class StepperComponent implements AfterContentInit {
	currentStep = 0;
	numberOfSteps = 0;

	@ContentChildren(StepComponent) steps!: QueryList<StepComponent>;

	ngAfterContentInit() {
		this.numberOfSteps = this.steps?.length || 0; // Initialize the number of steps based on the content children
		this.updateSteps();
	}

	next() {
		if (this.currentStep < this.numberOfSteps - 1) {
			this.currentStep++;
			this.updateSteps();
		}
	}

	back() {
		if (this.currentStep > 0) {
			this.currentStep--;
			this.updateSteps();
		}
	}

	private updateSteps() {
		if (!this.steps) return;

		this.steps.forEach((step: any, index: number) => {
			step.isActive = index === this.currentStep;
			step.isCompleted = index < this.currentStep;
		});
	}
}
