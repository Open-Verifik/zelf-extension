import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { NgForm, UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { WalletService } from "app/wallet.service";
import { environment } from "environments/environment";
import { Observable, debounceTime, distinctUntilChanged, map } from "rxjs";

@Component({
	selector: "app-unlock-wallet",
	templateUrl: "./unlock-wallet.component.html",
	encapsulation: ViewEncapsulation.None,
	styleUrls: ["./unlock-wallet.component.scss", "../main.scss"],
})
export class UnlockWalletComponent implements OnInit {
	session: any;
	@ViewChild("searchNgForm") searchNgForm!: NgForm;
	searchForm!: UntypedFormGroup;
	searchQuery$!: Observable<string>;

	constructor(private _router: Router, private _walletService: WalletService, private _formBuilder: UntypedFormBuilder) {
		this.session = this._walletService.getSessionData();

		this._walletService.setSteps([
			{
				label: "search_wallet",
				isActive: Boolean(this.session.step === 0),
				isCompleted: Boolean(this.session.step > 0),
			},
			{
				label: "password_unlock",
				isActive: Boolean(this.session.step === 1),
				isCompleted: Boolean(this.session.step > 1),
			},
			{
				label: "biometric_unlock",
				isActive: Boolean(this.session.step === 2),
				isCompleted: Boolean(this.session.step > 2),
			},
		]);
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
		this._walletService.findWallet(query).subscribe((response) => {
			console.log({ response });
		});
	}

	goBack(): void {
		this._router.navigate(["/onboarding"]);
	}
}
