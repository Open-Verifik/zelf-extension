import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { WalletService } from "app/wallet.service";

@Component({
	selector: "app-unlock-wallet",
	templateUrl: "./unlock-wallet.component.html",
	styleUrls: ["./unlock-wallet.component.scss"],
})
export class UnlockWalletComponent implements OnInit {
	session: any;

	constructor(private _router: Router, private _walletService: WalletService) {
		this.session = this._walletService.getSessionData();
	}

	ngOnInit(): void {}

	goBack(): void {
		this._router.navigate(["/onboarding"]);
	}
}
