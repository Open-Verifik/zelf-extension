import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ChromeService } from "app/chrome.service";
import { TransactionService } from "app/transaction.service";

@Component({
	selector: "app-send-transaction-confirmation",
	templateUrl: "./send-transaction-confirmation.component.html",
	styleUrls: ["./send-transaction-confirmation.component.scss", "../../main.scss"],
})
export class SendTransactionConfirmationComponent implements OnInit {
	constructor(private _transactionService: TransactionService, private _router: Router, private _chromeService: ChromeService) {}

	ngOnInit(): void {}

	goBack(): void {
		this._router.navigate(["/send-transaction"]);
	}

	goNext(): void {
		this._router.navigate(["/send-transaction-confirm"]);
	}
}
