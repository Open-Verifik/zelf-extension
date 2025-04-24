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
    standalone: false
})
export class SendTransactionBridgeComponent implements OnInit {
	// generate QR Code for the bridge
	transactionData!: Transaction;
	qrCode: any;

	constructor(private _transactionService: TransactionService, private _router: Router, private _chromeService: ChromeService) {}

	async ngOnInit(): Promise<any> {
		this.transactionData = new TransactionModel(this._transactionService.getTransactionData());

		let wallet = await this._chromeService.getItem("wallet");

		QRCode.toDataURL(
			JSON.stringify({
				amount: this.transactionData.amount,
				asset: this.transactionData.asset,
				network: this.transactionData.network,
				receiverZelfName: this.transactionData.receiver.name,
				senderZelfName: wallet.name,
				receiverAddress: this._getReceiverAddress(this.transactionData.network, this.transactionData.receiver),
			}),
			(err, url) => {
				if (err) {
					console.error(err);
					return;
				}

				this.qrCode = url;
			}
		);
	}

	_getReceiverAddress(network: string, receiver: any): string {
		switch (network) {
			case "Ethereum":
				return receiver.ethAddress;

			case "Solana":
				return receiver.solanaAddress;

			default:
				return "";
		}
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
