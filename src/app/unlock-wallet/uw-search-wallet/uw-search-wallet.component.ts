import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslocoService } from "@ngneat/transloco";
import { WalletService } from "app/wallet.service";
import { environment } from "environments/environment";
import { Observable, debounceTime, distinctUntilChanged, map } from "rxjs";

@Component({
	selector: "uw-search-wallet",
	templateUrl: "./uw-search-wallet.component.html",
	styleUrls: ["../unlock-wallet.component.scss", "../../main.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class UwSearchWalletComponent implements OnInit {
	searchForm!: UntypedFormGroup;
	searchQuery$!: Observable<string>;
	potentialWallet: any;
	session: any;

	constructor(
		private _walletService: WalletService,
		private _formBuilder: UntypedFormBuilder,
		private snackBar: MatSnackBar,
		private _translocoService: TranslocoService
	) {
		this.session = this._walletService.getSessionData();
	}

	ngOnInit(): void {
		const defaultAddress = environment.production ? "" : "0xDF59C844739f3Baaa1b05eF615F150bBe90162E0";
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

	goToNextStep(): void {
		this._walletService.goToNextStep(this.session.step + 1);

		if (!this.potentialWallet.hasPassword) {
			this._walletService.goToNextStep(this.session.step + 1);
		}
	}

	startAgain(): void {
		this.potentialWallet = null;

		this.searchForm.patchValue({ address: "" });
	}
}
