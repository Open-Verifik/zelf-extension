import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { IpfsService } from "app/ipfs.service";

@Component({
	selector: "app-new-zelf-name",
	templateUrl: "./new-zelf-name.component.html",
	styleUrls: ["./new-zelf-name.component.scss"],
})
export class NewZelfNameComponent implements OnInit {
	@ViewChild("zelfForm") signUpNgForm!: NgForm;
	zelfForm!: UntypedFormGroup;
	zelfName: string;

	constructor(private _router: Router, private _formBuilder: UntypedFormBuilder, private _ipfsService: IpfsService) {
		this.zelfName = "";
	}

	async ngOnInit(): Promise<any> {
		this.zelfName = await this._ipfsService.getZelfName();

		console.log({ zelfName: this.zelfName });

		this.zelfForm = this._formBuilder.group({
			termsAcceptance: [false, [Validators.required]],
		});
	}

	goToCreateWallet(): void {
		this._router.navigate(["/create-wallet"]);
	}

	goToImportWallet(): void {
		this._router.navigate(["/import-wallet"]);
	}

	goToFindWallet(): void {
		this._router.navigate(["/find-wallet"]);
	}

	acceptedTerms(): Boolean {
		return Boolean(this.zelfForm.value.termsAcceptance);
	}
}
