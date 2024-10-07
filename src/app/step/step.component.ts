import { Component, Input } from "@angular/core";

@Component({
	selector: "app-step",
	template: `<div class="step-content" [class.active]="isActive" [class.completed]="isCompleted">
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
}
