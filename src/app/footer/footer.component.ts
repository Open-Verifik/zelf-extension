import { Component, Input, OnInit } from "@angular/core";

@Component({
	selector: "footer",
	templateUrl: "./footer.component.html",
	styleUrls: ["../main.scss", "./footer.component.scss"],
})
export class FooterComponent implements OnInit {
	@Input() shareables: any;

	constructor() {}

	ngOnInit(): void {
		console.log({ shareables: this.shareables });
	}

	changeView(view: string): void {
		this.shareables.view = view;
	}
}
