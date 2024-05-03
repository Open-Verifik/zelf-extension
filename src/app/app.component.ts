import { Component, ViewEncapsulation } from "@angular/core";

@Component({
	selector: "app-root",
	template: `<!-- Wrapper -->
		<div class="flex flex-col flex-auto w-full main-div">
			<!-- Content -->
			<div class="flex flex-col flex-auto">
				<router-outlet *ngIf="true"></router-outlet>
			</div>
		</div>`,
	styleUrls: ["./app.component.scss", "./main.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class AppComponent {}
