import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { Subject, takeUntil } from "rxjs";

import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup } from "@angular/forms";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";

import { ChromeService } from "app/chrome.service";
import { HttpWrapperService } from "app/http-wrapper.service";
import { ReserveDoneSheetComponent } from "app/reserve-done-sheet/reserve-done-sheet.component";
import { ErrorService } from "app/services/error.service";
import { VaultService } from "app/vault.service";
import { WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { WelcomeErrorComponent } from "app/welcome-error/welcome-error.component";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";
import { ZelfFlow, ZelfNameService } from "app/zelf-name-service.service";
import { BiometricsGeneralComponent } from "../biometrics-general/biometrics.component";

@Component({
    imports: [
        BiometricsGeneralComponent,
        CommonModule,
        MatButtonModule,
        ReactiveFormsModule,
        RouterModule,
        TranslocoModule,
        WelcomeErrorComponent,
        ZelfLoaderComponent,
    ],
    selector: "security-biometrics",
    styleUrls: ["./security-biometrics.component.scss"],
    templateUrl: "./security-biometrics.component.html",
})
export class SecurityBiometricsComponent implements OnInit, OnDestroy {
    private unsubscriber$: Subject<void> = new Subject<void>();
    private _canNavigate: boolean = true;

    errorMessage: string = "";
    errorTitle: string = "";
    flow: ZelfFlow = "";
    form!: UntypedFormGroup;
    isNew: boolean = false;
    loading: boolean = true;
    newZelfName: string = "";
    returnState: string = "";
    showBiometrics: boolean = true;
    zelfNameObject: any;
    zelfProof: string = "";

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _bottomSheet: MatBottomSheet,
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
        this.newZelfName = await this._zelfNameService.getNewZelfName();
        this.showBiometrics = (await this._chromeService.getItem("hideBiometricsMessage")) || false;
        this.zelfProof = await this._zelfNameService.getZelfProof();

        const zelfNameObject = await this._zelfNameService.getZelfNameObject();

        if (zelfNameObject) this.zelfNameObject = new WalletModel(zelfNameObject);
        else this.zelfNameObject = this.zelfNameObject;

        this.isNew = this.flow === "create" || this.flow === "import" || (this.flow === "recover" && this.zelfNameObject?.available);

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
            .catch(this.onBiometricsFailed);
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
            .catch(this.onBiometricsFailed);
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
            .catch(this.onBiometricsFailed);
    }

    private async _leaseRecovery(payload: any): Promise<void> {
        this._zelfNameService
            .zelfNameLeaseRecovery({
                ...payload,
                zelfProof: this.zelfProof,
                newZelfName: this.newZelfName,
            })
            .then(async (response) => {
                await this._chromeService.removeItem("newZelfName");
                await this._chromeService.setItem("wallet", new WalletModel(response.data));

                this._bottomSheet.open(ReserveDoneSheetComponent, {
                    backdropClass: "zelf-backdrop",
                    panelClass: "zelf-bottom-sheet",
                    data: { zelfName: this.newZelfName },
                });
            })
            .catch(this.onBiometricsFailed);
    }

    private _redirect(): void {
        if (this.returnState) {
            this._router.navigate([this.returnState], { replaceUrl: true, queryParams: { return: this.returnState } });

            return;
        }

        this._router.navigate(["/welcome/complete"]);
    }

    canNavigateAway(): boolean {
        return this._canNavigate;
    }

    canNavigateAwayHandler(canNavigate: boolean = false): void {
        this._canNavigate = canNavigate;
    }

    goBack(): void {
        if (this.returnState) {
            this._router.navigate([this.returnState], { queryParams: { return: this.returnState } });
        } else this._router.navigate(["/security/password"]);
    }

    onBiometricsFailed = (exception: any): void => {
        console.error(exception);

        this.errorTitle = this._translocoService.translate("errors.generic_title");
        this.errorMessage = this._errorService.translateErrorMessage(exception?.error?.message || exception?.error?.error, "errors.generic_identity");
    };

    async onBiometricsScanned(encryptedImage: string): Promise<void> {
        const zelfName = await this._zelfNameService.getZelfName();
        const referralZelfName = await this._zelfNameService.getReferral();

        const payload: any = {
            faceBase64: encryptedImage,
            os: "DESKTOP",
            password: await this._httpWrapperService.encryptMessage(this._vaultService.password),
            referralZelfName,
            zelfName,
        };

        if (this.flow === "create") {
            this._createWallet(payload);
        } else if (this.flow === "import") {
            this._importWallet(payload);
        } else if (this.flow === "recover") {
            this._leaseRecovery(payload);
        } else {
            this._decryptWallet(payload);
        }
    }

    async startBiometrics(): Promise<void> {
        this._chromeService.setItem("hideBiometricsMessage", this.form.controls.hideBiometricsCheckbox.value);

        this.showBiometrics = true;
    }
}
