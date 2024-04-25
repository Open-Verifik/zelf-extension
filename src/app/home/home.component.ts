/// <reference types="chrome"/>
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styles: [],
})
export class HomeComponent implements OnInit {
	title: string = "something";
	account: string = "";

	constructor(private _router: Router) {}

	openFullPage(): void {
		// Use chrome.runtime.getURL to get the full URL of the extension page
		const url = chrome.runtime.getURL("index.html");
		chrome.tabs.create({ url });
	}

	ngOnInit(): void {
		this.account = localStorage.getItem("account") || "";

		if (!this.account) this._redirectToOnboarding();
	}

	_redirectToOnboarding(): void {
		this._router.navigate(["/onboarding"]);
	}
}
