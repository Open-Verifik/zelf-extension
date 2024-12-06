import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ChromeService } from "app/chrome.service";
import { TransactionService } from "app/transaction.service";
import { Transaction, TransactionModel } from "app/wallet";
import * as QRCode from "qrcode";

@Component({
	selector: "app-send-transaction-bridge",
	templateUrl: "./send-transaction-bridge.component.html",
	styleUrls: ["../../main.scss", "./send-transaction-bridge.component.scss"],
})
export class SendTransactionBridgeComponent implements OnInit {
	// generate QR Code for the bridge
	transactionData!: Transaction;
	qrCode: any;

	constructor(private _transactionService: TransactionService, private _router: Router, private _chromeService: ChromeService) {}

	async ngOnInit(): Promise<any> {
		this.transactionData = new TransactionModel(this._transactionService.getTransactionData());
		// get my current wallet sending it
		// get the transaction data passed around
		// get the destination
		// get the asset
		// Generate QR code as a base64 string
		QRCode.toDataURL(JSON.stringify(this.transactionData.gasFee), (err, url) => {
			if (err) {
				console.error(err);
				return;
			}

			this.qrCode = url;

			console.log({ qrCode: this.qrCode });
		});
	}

	cancel(): void {
		this._router.navigate(["/send-transaction-confirm"]);
	}

	downloadApp(type: string): void {
		switch (type) {
			case "android":
				window.open("https://play.google.com/store/apps/details?id=co.verifik.wallet", "_blank");
				break;

			default:
				console.warn("Invalid app type");
				break;
		}
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
