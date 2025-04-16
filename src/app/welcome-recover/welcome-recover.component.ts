import { DatePipe, NgClass, NgIf, NgTemplateOutlet } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";
import { CaptchaService } from "app/captcha.service";
import { ChromeService } from "app/chrome.service";
import { WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { ZelfNameService } from "app/zelf-name-service.service";

@Component({
    imports: [
        DatePipe,
        MatButtonModule,
        MatProgressSpinnerModule,
        NgClass,
        NgIf,
        NgTemplateOutlet,
        ReactiveFormsModule,
        RouterModule,
        TranslocoModule,
    ],
    selector: "welcome-recover",
    standalone: true,
    styleUrls: ["./welcome-recover.component.scss"],
    templateUrl: "./welcome-recover.component.html",
})
export class WelcomeRecoverComponent implements OnInit {
    captchaToken: string = "";
    form!: UntypedFormGroup;
    termsForm!: UntypedFormGroup;
    loading: boolean = false;
    showError: boolean = false;
    searching: boolean = false;
    showResult: boolean = false;
    zelfNameObject: any;
    zelfNameObjectResult: any;

    constructor(
        private _captchaService: CaptchaService,
        private _chromeService: ChromeService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _walletService: WalletService,
        private _zelfNameService: ZelfNameService
    ) {
        this._initForm();
    }

    async ngOnInit(): Promise<void> {
        this.zelfNameObject = await this._zelfNameService.getZelfNameObject();
    }

    private async _captchaGeneration(): Promise<any> {
        if (this._chromeService.isExtension) return;

        try {
            this.captchaToken = await this._captchaService.executeRecaptcha(this.form.get("zelfName")?.value);
        } catch (error) {
            console.error("reCAPTCHA failed:", error);
        }
    }

    private _initForm(): void {
        this.form = this._formBuilder.group({
            zelfName: ["", [Validators.required, Validators.pattern(this._walletService.ZelfRegexNoPostfix)]],
        });

        this.termsForm = this._formBuilder.group({
            termsAndConditions: [false, Validators.requiredTrue],
        });
    }

    private async _queryForZelfObject(query: string): Promise<any> {
        this.searching = true;

        try {
            await this._captchaGeneration();

            this.zelfNameObjectResult = await this._queryZNS("zelfName", query);

            if (this.zelfNameObjectResult) this._setError();
        } catch (error) {
            this._setError();
        } finally {
            this.searching = false;
        }
    }

    async _queryZNS(key: string, value: string): Promise<any> {
        try {
            const response = await this._zelfNameService.searchZelfNameV2(key, `${value}.zelf`, this.captchaToken);

            if (!response.data || response.data.available) {
                this._setResult();

                return null;
            }

            const zelfNameObject = new WalletModel(response.data.ipfs?.length ? response.data.ipfs[0] : response.data.arweave[0]);

            this.loading = false;

            return zelfNameObject;
        } catch (error) {
            this._setError();

            console.error({ error });

            this.loading = false;

            return null;
        }
    }

    private _setError(): void {
        this.showResult = true;
        this.showError = true;
    }

    private _setResult(): void {
        this.showResult = true;
        this.showError = false;
    }

    async pastedZelfName(event: ClipboardEvent): Promise<void> {
        event.preventDefault();
        event.stopPropagation();

        if (this.searching) return;

        const query = event.clipboardData?.getData("text");

        if (!query) return;

        if (!this._walletService.ZelfRegexNoPostfix.test(query)) return;

        this.form.patchValue({ zelfName: query });

        await this._queryForZelfObject(query);
    }

    returnToForm(): void {
        this.form.patchValue({ zelfName: "" }, { emitEvent: false });
        this.form.markAsPristine();

        this.showResult = false;
        this.showError = false;
        this.zelfNameObjectResult = null;
    }

    async searchZelfName(): Promise<void> {
        if (this.searching || this.form.invalid) return;

        const query = this.form.value.zelfName;

        if (!query) return;

        await this._queryForZelfObject(query);
    }

    async startReservation(): Promise<void> {
        await this._zelfNameService.setNewZelfName(this.form.value.zelfName);
        await this._zelfNameService.setFlow("recovery");

        this._router.navigate(["/security/password"], { queryParams: { return: "/welcome/recover" } });
    }
}
