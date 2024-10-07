import { Component, Input } from "@angular/core";

@Component({
	selector: "app-step",
	template: `<div class="step-content" [class.active]="isActiveStep()" [class.completed]="isCompleted">
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
	@Input() isActive: boolean = false;
	@Input() isCompleted: boolean = false;
	@Input() isHidden: boolean = false;
	@Input() label: string = "";
	@Input() isStatus: boolean = false;

	async isActiveStep(): Promise<any> {
		const value = await new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(this.isActive);
			}, 300);
		});

		return value;
	}
}
