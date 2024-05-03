import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
	selector: "app-create-wallet",
	templateUrl: "./create-wallet.component.html",
	styleUrls: ["./create-wallet.component.scss", "../main.scss"],
})
export class CreateWalletComponent implements OnInit {
	steps = [{ label: "Crear contraseña" }, { label: "Seguridad biométrica" }, { label: "Finalizar" }];
	@ViewChild("signUpNgForm") signUpNgForm!: NgForm;
	signUpForm!: UntypedFormGroup;

	currentStep = 0;
	formLoaded: boolean = false;

	constructor(private _formBuilder: UntypedFormBuilder, private _router: Router) {}

	ngOnInit() {
		this.signUpForm = this._formBuilder.group({
			password: ["", []],
			repeatPassword: ["", []],
		});
		this.formLoaded = true;
	}

	goBack(): void {
		this._router.navigate(["/onboarding"]);
	}
}
