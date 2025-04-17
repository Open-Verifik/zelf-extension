import { Subject, takeUntil } from "rxjs";

import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@ngneat/transloco";

import { CaptchaService } from "app/captcha.service";
import { ChromeService } from "app/chrome.service";
import { VaultService } from "app/vault.service";
import { WalletService } from "app/wallet.service";
import { ZelfFlow, ZelfNameService } from "app/zelf-name-service.service";
import { BiometricsGeneralComponent } from "../biometrics-general/biometrics.component";
import { HttpWrapperService } from "app/http-wrapper.service";
import { WalletModel } from "app/wallet";
import { WelcomeErrorComponent } from "app/welcome-error/welcome-error.component";
import { ErrorService } from "app/services/error.service";

@Component({
    imports: [CommonModule, RouterModule, MatButtonModule, TranslocoModule, BiometricsGeneralComponent, ReactiveFormsModule, WelcomeErrorComponent],
    selector: "security-biometrics",
    standalone: true,
    styleUrls: ["./security-biometrics.component.scss"],
    templateUrl: "./security-biometrics.component.html",
})
export class SecurityBiometricsComponent implements OnInit, OnDestroy {
    private unsubscriber$: Subject<void> = new Subject<void>();

    errorTitle: string = "";
    errorMessage: string = "";
    flow: ZelfFlow = "";
    form!: UntypedFormGroup;
    loading: boolean = true;
    notifyFailed$: Subject<void> = new Subject<any>();
    returnState: string = "";
    showBiometrics: boolean = true;
    zelfProof: string = "";
    zelfNameObject: any;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _captchaService: CaptchaService,
        private _chromeService: ChromeService,
        private _errorService: ErrorService,
        private _formBuilder: FormBuilder,
        private _httpWrapperService: HttpWrapperService,
        private _router: Router,
        private _translocoService: TranslocoService,
        private _vaultService: VaultService,
        private _walletService: WalletService,
        private _zelfNameService: ZelfNameService
    ) {
        this.form = this._formBuilder.group({
            hideBiometricsCheckbox: [false],
        });

        this._activatedRoute.snapshot.queryParams?.return && (this.returnState = this._activatedRoute.snapshot.queryParams.return);

        this._activatedRoute.queryParams.pipe(takeUntil(this.unsubscriber$)).subscribe(async (params) => {
            params?.return && (this.returnState = params.return);
        });
    }

    async ngOnInit(): Promise<void> {
        this.flow = (await this._zelfNameService.getFlow()) || "create";
        this.showBiometrics = (await this._chromeService.getItem("hideBiometricsMessage")) || false;
        this.zelfNameObject = await this._zelfNameService.getZelfNameObject();

        this.loading = false;
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    async _createWallet(payload: any): Promise<void> {
        const mnemonicCount = (await this._zelfNameService.getMnemonicCount()) || 12;

        this._zelfNameService
            .leaseZelfName({
                ...payload,
                type: "create",
                wordsCount: mnemonicCount,
            })
            .then(async (response) => {
                await this._chromeService.removeItem("flow");
                await this._chromeService.setItem("wallet", new WalletModel(response.data));

                this._redirect();
            })
            .catch((exception) => {
                console.error({ exception });

                this.errorTitle = this._translocoService.translate("errors.generic_title");
                this.errorMessage = this._errorService.translateErrorMessage(exception?.error?.message, "errors.generic_identity");
            });
    }

    private async _decryptWallet(payload: any): Promise<void> {
        const zelfProof = await this._zelfNameService.getZelfProof();
        const userFingerprint = this._walletService.getUserFingerprint();

        this._zelfNameService
            .decryptZelfName({
                ...payload,
                zelfProof,
                identifier: userFingerprint.hash,
            })
            .then(async (response) => {
                await this._chromeService.removeItem("flow");
                await this._chromeService.setItem("wallet", new WalletModel(response.data));

                this._redirect();
            })
            .catch((exception) => {
                console.error({ exception });

                this.errorTitle = this._translocoService.translate("errors.generic_title");
                this.errorMessage = this._errorService.translateErrorMessage(exception?.error?.message, "errors.generic_identity");
            });
    }

    private async _importWallet(payload: any): Promise<void> {
        this._zelfNameService
            .leaseZelfName({
                ...payload,
                mnemonic: await this._httpWrapperService.encryptMessage(this._vaultService.mnemonic),
                type: "import",
            })
            .then(async (response) => {
                this._vaultService.mnemonic = "";

                await this._chromeService.removeItem("flow");
                await this._chromeService.setItem("wallet", new WalletModel(response.data));

                this._redirect();
            })
            .catch((exception) => {
                console.error({ exception });

                this.errorTitle = this._translocoService.translate("errors.generic_title");
                this.errorMessage = this._errorService.translateErrorMessage(exception?.error?.message, "errors.generic_identity");
            });
    }

    private _redirect(): void {
        if (this.returnState) {
            this._router.navigate([this.returnState], { replaceUrl: true, queryParams: { return: this.returnState } });

            return;
        }

        this._router.navigate(["/welcome/complete"]);
    }

    async clearError(): Promise<void> {
        this.errorTitle = "";
        this.errorMessage = "";

        this.goBack();
    }

    goBack(): void {
        if (this.returnState) this._router.navigate(["/security/password"], { replaceUrl: true, queryParams: { return: this.returnState } });
        else this._router.navigate(["/security/password"]);
    }

    async onBiometricsScanned(encryptedImage: string): Promise<void> {
        const zelfName = await this._zelfNameService.getZelfName();
        const referralZelfName = await this._zelfNameService.getReferral();

        const payload: any = {
            faceBase64: encryptedImage,
            os: "DESKTOP",
            password: await this._httpWrapperService.encryptMessage(this._vaultService.password),
            zelfName,
            referralZelfName,
        };

        if (!this._chromeService.isExtension) {
            payload.captcha = this._captchaService.getCaptchaToken() || undefined;
        }

        if (this.flow === "create") {
            this._createWallet(payload);
        } else if (this.flow === "import") {
            this._importWallet(payload);
        } else {
            this._decryptWallet(payload);
        }
    }

    async startBiometrics(): Promise<void> {
        this._chromeService.setItem("hideBiometricsMessage", this.form.controls.hideBiometricsCheckbox.value);

        if (!this._chromeService.isExtension) {
            const zelfName = await this._zelfNameService.getZelfName();

            try {
                const captchaKey = zelfName.split(".zelf")[0].replace(".", "_");
                const captchaToken = await this._captchaService.executeRecaptcha(captchaKey);

                this._captchaService.retainCaptchaToken(captchaToken);
            } catch (error) {
                console.error("reCAPTCHA failed:", { error });
            }
        }

        this.showBiometrics = true;
    }
}
