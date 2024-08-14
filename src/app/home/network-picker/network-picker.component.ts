import { Component, OnInit } from "@angular/core";

@Component({
	selector: "app-network-picker",
	templateUrl: "./network-picker.component.html",
	styleUrls: ["./network-picker.component.scss"],
})
export class NetworkPickerComponent implements OnInit {
	loaded: boolean;
	constructor() {
		this.loaded = false;
	}

	ngOnInit(): void {
		throw new Error("Method not implemented.");
	}
}
