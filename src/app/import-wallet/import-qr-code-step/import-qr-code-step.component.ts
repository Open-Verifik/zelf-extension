import { Component, OnInit } from "@angular/core";
import { WalletService } from "app/wallet.service";

@Component({
	selector: "import-qr-code-step",
	templateUrl: "./import-qr-code-step.component.html",
	styleUrls: ["../../main.scss"],
})
export class ImportQrCodeStepComponent implements OnInit {
	session: any;

	constructor(private _walletService: WalletService) {
		this.session = this._walletService.getSessionData();
		console.log({ sessionInContructor: this.session });
	}

	ngOnInit(): void {
		console.log({ sessionInOnInit: this.session });
	}
}
