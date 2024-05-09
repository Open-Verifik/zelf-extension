import { Component, OnInit } from "@angular/core";

@Component({
	selector: "app-extension-instructions",
	templateUrl: "./extension-instructions.component.html",
	styleUrls: ["./extension-instructions.component.scss", "../main.scss"],
})
export class ExtensionInstructionsComponent implements OnInit {
	currentSlide: number = 1;
	constructor() {}

	ngOnInit(): void {}

	changeToSlide(slide: number): void {
		this.currentSlide = slide;

		if (this.currentSlide > 2) {
			//navigate somewhere
			this.currentSlide = 1;
		}
	}
}
