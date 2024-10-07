import { AfterContentInit, Component, ContentChildren, OnInit, QueryList, Input } from "@angular/core";
import { IpfsService } from "app/ipfs.service";
import { StepComponent } from "app/step/step.component";
import { Location } from "@angular/common";

@Component({
	selector: "app-stepper",
	templateUrl: "./stepper.component.html",
	styleUrls: ["./stepper.component.scss"],
})
export class StepperComponent implements AfterContentInit, OnInit {
	@Input() hideHeader: boolean = false;
	currentStep = 0;
	numberOfSteps = 0;
	zelfName: string;
	isExtension = Boolean(typeof chrome !== "undefined" && chrome.storage && chrome.runtime);

	constructor(private _ipfsService: IpfsService, private location: Location) {
		this.zelfName = "";
	}

	async ngOnInit(): Promise<any> {
		this.zelfName = this.isExtension ? await this._ipfsService.getZelfName() : localStorage.getItem("zelfName") || "";

		console.log({ zelfName: this.zelfName });
	}

	@ContentChildren(StepComponent) steps!: QueryList<StepComponent>;

	async ngAfterContentInit(): Promise<any> {
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
		this.location.back();
	}

	private updateSteps() {
		if (!this.steps) return;

		this.steps.forEach((step: any, index: number) => {
			step.isActive = index === this.currentStep;
			step.isCompleted = index < this.currentStep;
		});
	}
}
