import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ChromeService } from "app/chrome.service";
import { TransactionService } from "app/transaction.service";

@Component({
	selector: "app-send-transaction-bridge",
	templateUrl: "./send-transaction-bridge.component.html",
	styleUrls: ["../../main.scss", "./send-transaction-bridge.component.scss"],
})
export class SendTransactionBridgeComponent implements OnInit {
	// generate QR Code for the bridge

	constructor(private _transactionService: TransactionService, private _router: Router, private _chromeService: ChromeService) {}

	async ngOnInit(): Promise<any> {
		// get my current wallet sending it
		// get the transaction data passed around
		// get the destination
		// get the asset
	}

	goBack(): void {
		this._router.navigate(["send-transaction-confirm"]);
	}
}

// {
//     hash,
//     source,
//     destination,
//     network,
//     asset,
//     amount,
// }
