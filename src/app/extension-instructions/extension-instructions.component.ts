import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
	selector: "app-extension-instructions",
	templateUrl: "./extension-instructions.component.html",
	styleUrls: ["./extension-instructions.component.scss", "../main.scss"],
})
export class ExtensionInstructionsComponent implements OnInit {
	currentSlide: number = 1;

	constructor(private _router: Router) {}

	ngOnInit(): void {}

	changeToSlide(slide: number): void {
		this.currentSlide = slide;

		if (this.currentSlide > 2) {
			//navigate somewhere
			this._router.navigate(["home"]);
		}
	}

	goBack(): void {
		this._router.navigate(["/onboarding"]);
	}
}
