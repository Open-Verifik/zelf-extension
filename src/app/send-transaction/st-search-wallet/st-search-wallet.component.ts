import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { WalletService } from "app/wallet.service";
import { environment } from "environments/environment";
import { Observable, debounceTime, distinctUntilChanged, map } from "rxjs";

@Component({
	selector: "st-search-wallet",
	templateUrl: "./st-search-wallet.component.html",
	styleUrls: ["../send-transaction.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class StSearchWalletComponent implements OnInit {
	searchForm!: UntypedFormGroup;
	searchQuery$!: Observable<string>;
	potentialWallet: any;
	session: any;
	myAccounts: Array<any>;

	constructor(private _formBuilder: UntypedFormBuilder, private snackBar: MatSnackBar, private _walletService: WalletService) {
		this.myAccounts = [];

		const wallets = localStorage.getItem("wallets");

		if (wallets) this.myAccounts = JSON.parse(wallets || "[]");

		console.log({ wallets, myAccounts: this.myAccounts });
	}

	ngOnInit(): void {
		const defaultAddress = environment.production ? "" : "0x13901AE0F17E2875E86C86721f9943598601b0C4";

		this.searchForm = this._formBuilder.group({
			address: [defaultAddress, []],
		});

		this.searchQuery$ = this.searchForm.get("address")!.valueChanges.pipe(
			debounceTime(300), // wait for 300ms pause in events
			distinctUntilChanged(), // ignore if next search query is same as previous
			map((value) => value.trim()) // map the value to the trimmed string
		);

		this.searchQuery$.subscribe((query) => {
			this._triggerSearch(query);
		});
	}

	_triggerSearch(query: string): void {
		if (!query) return;

		this._walletService.findWallet(query).subscribe(
			(response) => {
				this.potentialWallet = response.data;
			},
			(error) => {
				this.snackBar.open("account not found", "OK");
				this.startAgain();
			}
		);
	}

	startAgain(): void {
		this.potentialWallet = null;

		this.session.identifier = null;

		this.searchForm.patchValue({ address: "" });
	}
}
