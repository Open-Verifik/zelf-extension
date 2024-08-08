import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TransactionService } from "app/transaction.service";

@Component({
	selector: "app-send-transaction-preview",
	templateUrl: "./send-transaction-preview.component.html",
	styleUrls: ["../../main.scss", "./send-transaction-preview.component.scss"],
})
export class SendTransactionPreviewComponent implements OnInit {
	shareables: any;
	@ViewChild("searchNgForm") searchNgForm!: NgForm;
	searchForm!: UntypedFormGroup;
	transactionData!: any;
	loaded: Boolean;

	constructor(private _formBuilder: UntypedFormBuilder, private _transactionService: TransactionService, private _router: Router) {
		this.shareables = {
			view: "home",
		};

		this.transactionData = this._transactionService.getTransactionData();

		this.loaded = false;
	}

	ngOnInit(): void {
		if (!this.transactionData) {
			this._router.navigate(["send-transaction"]);

			return;
		}

		this.searchForm = this._formBuilder.group({
			address: [this.transactionData.destination.ethAddress, []],
			amount: [0, [Validators.required]],
		});

		this.loaded = true;
	}

	cancel(): void {}

	goBack(): void {
		this._router.navigate(["/send-transaction"]);
	}

	goNext(): void {
		this._setTransactionData();

		this._router.navigate(["/send-transaction-confirm"]);
	}

	_setTransactionData(): void {}
}
