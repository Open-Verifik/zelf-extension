/// <reference types="chrome"/>
import { Component } from "@angular/core";
@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styles: [],
})
export class HomeComponent {
	title: string = "something";
	openFullPage(): void {
		// Use chrome.runtime.getURL to get the full URL of the extension page
		const url = chrome.runtime.getURL("index.html");
		chrome.tabs.create({ url });
	}
}
