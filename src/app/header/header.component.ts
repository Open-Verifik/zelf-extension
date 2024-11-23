import { Component, Input, OnInit } from "@angular/core";

@Component({
	selector: "header",
	templateUrl: "./header.component.html",
	styleUrls: ["./header.scss"],
})
export class HeaderComponent implements OnInit {
	constructor() {
		console.log("test");
	}

	async ngOnInit(): Promise<any> {}
}
