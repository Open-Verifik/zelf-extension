import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { IpfsService } from "app/ipfs.service";
import { WalletService } from "app/wallet.service";
import { ZelfNameService } from "app/zelf-name-service.service";

@Component({
	selector: "app-new-zelf-name",
	templateUrl: "./new-zelf-name.component.html",
	styleUrls: ["./new-zelf-name.component.scss"],
})
export class NewZelfNameComponent implements OnInit {
	@ViewChild("zelfForm") signUpNgForm!: NgForm;
	zelfForm!: UntypedFormGroup;
	zelfName: string;
	steps: Array<any>;
	session: any;
	duration: number;
	variables: any;

	constructor(private _walletService: WalletService, private _router: Router, private _zelfNameService: ZelfNameService) {
		this.zelfName = "";
		this.duration = 1;

		this.steps = [
			{
				isActive: true,
				isCompleted: false,
				label: "available",
				isStatus: true,
			},
		];

		this.session = this._walletService.getSessionData();
		this.session.steps = [];
	}

	async ngOnInit(): Promise<any> {
		this.zelfName = await this._zelfNameService.getZelfName();
	}

	goBack(): void {
		this._router.navigate(["/onboarding"]);
	}
}
