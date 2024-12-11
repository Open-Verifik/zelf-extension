import { Component, Input } from "@angular/core";

@Component({
	selector: "app-step",
	template: `<div class="step-content" [class.active]="step.isActive" [class.completed]="step.isCompleted">
		<ng-content> </ng-content>
	</div>`,
	styles: [
		`
			.step-content {
				display: none;
				&.active {
					display: block;
				}
				&.completed {
					color: green;
				}
			}
		`,
	],
})
export class StepComponent {
	@Input() step: any;
	@Input() isActive: boolean = false;
	@Input() isCompleted: boolean = false;
	isHidden: boolean = false;
	label: string = "";
	isStatus: boolean = false;

	constructor() {
		this.isActive = this.step.isActive;
		this.isCompleted = this.step.isCompleted;
		this.isHidden = this.step.isHidden;
		this.label = this.step.label;
		this.isStatus = this.step.isStatus;
	}
}
