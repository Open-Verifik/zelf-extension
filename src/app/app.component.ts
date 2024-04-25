import { Component } from "@angular/core";

@Component({
	selector: "app-root",
	template: `<div class="main-div"><router-outlet></router-outlet></div>`,
	styleUrls: ["./app.component.scss", "./main.scss"],
})
export class AppComponent {}
