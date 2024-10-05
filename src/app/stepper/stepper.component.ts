import { AfterContentInit, Component, ContentChildren, QueryList } from "@angular/core";
import { IpfsService } from "app/ipfs.service";
import { StepComponent } from "app/step/step.component";

@Component({
	selector: "app-stepper",
	templateUrl: "./stepper.component.html",
	styleUrls: ["./stepper.component.scss"],
})
export class StepperComponent implements AfterContentInit {
	currentStep = 0;
	numberOfSteps = 0;
	zelfName: string;

	constructor(private _ipfsService: IpfsService) {
		this.zelfName = "";
	}

	@ContentChildren(StepComponent) steps!: QueryList<StepComponent>;

	async ngAfterContentInit(): Promise<any> {
		this.zelfName = await this._ipfsService.getZelfName();

		console.log({ zelfName: this.zelfName });

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
