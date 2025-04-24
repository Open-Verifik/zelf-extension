import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: "header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.scss"],
    standalone: false
})
export class HeaderComponent implements OnInit {
	constructor() {}

	async ngOnInit(): Promise<any> {}
}
