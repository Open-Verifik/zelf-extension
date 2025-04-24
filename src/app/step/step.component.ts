import { Component, Input } from "@angular/core";

@Component({
    selector: "app-step",
    template: `<div class="step-content" [class.active]="_isActive()" [class.completed]="_isCompleted()">
		<ng-content> </ng-content>
	</div>`,
    styles: [
        `
			.step-content {
				display: none;
				text-align: center;
				&.active {
					display: block;
				}
			}
		`,
    ],
    standalone: false
})
export class StepComponent {
	@Input() step: any;
	@Input() isActive: boolean = false;
	@Input() isCompleted: boolean = false;
	@Input() isHidden: boolean = false;
	@Input() label: string = "";
	@Input() isStatus: boolean = false;

	constructor() {}

	_isActive(): boolean {
		return Boolean(this.isActive || this.step?.isActive);
	}

	_isCompleted(): boolean {
		return Boolean(this.isCompleted || this.step?.isCompleted);
	}
}
