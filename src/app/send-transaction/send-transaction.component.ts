import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { WalletService } from "app/wallet.service";
import { environment } from "environments/environment";
import { Observable, debounceTime, distinctUntilChanged, map } from "rxjs";

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
