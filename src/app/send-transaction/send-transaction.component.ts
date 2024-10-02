import { Component, OnInit } from "@angular/core";

import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { WalletService } from "app/wallet.service";

@Component({
	selector: "send-transaction",
	templateUrl: "./send-transaction.component.html",
	styleUrls: ["./send-transaction.component.scss", "../main.scss"],
})
export class SendTransactionComponent implements OnInit {
	shareables: any;
	session: any;

	constructor(private _walletService: WalletService, private snackBar: MatSnackBar, private _router: Router) {
		this.shareables = {
			view: "home",
		};
	}

	ngOnInit(): void {
		this.session = this._walletService.getSessionData();
	}

	cancel(): void {
		this._router.navigate(["/home"]);
	}
}
