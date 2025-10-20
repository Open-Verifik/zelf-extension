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
import { WalletService } from "app/wallet.service";
import { WelcomeErrorComponent } from "app/welcome-error/welcome-error.component";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";
import { BiometricsGeneralComponent } from "../biometrics-general/biometrics.component";
import { TagFlow, TagsService } from "app/tags.service";
import { TagModel } from "app/tags.service";

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
    flow: TagFlow = "";
    form!: UntypedFormGroup;
    isNew: boolean = false;
    loading: boolean = true;
    newTagName: string = "";
    returnState: string = "";
    showBiometrics: boolean = true;
    tagObject: TagModel = new TagModel();
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
        private _tagsService: TagsService
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
        this.flow = (await this._tagsService.getFlow()) || "create";

        this.newTagName = await this._tagsService.getNewTagName();

        this.showBiometrics = (await this._chromeService.getItem("hideBiometricsMessage")) || false;

        this.zelfProof = await this._tagsService.getZelfProof();

        const tagObject = await this._tagsService.getTagNameObject();

        if (tagObject) this.tagObject = new TagModel(tagObject);

        this.isNew = this.flow === "create" || this.flow === "import" || (this.flow === "recover" && this.tagObject?.available);

        this.loading = false;
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    async _createTag(payload: any): Promise<void> {
        const mnemonicCount = (await this._tagsService.getMnemonicCount()) || 12;

        this._tagsService
            .leaseTag({
                ...payload,
                type: "create",
                wordsCount: mnemonicCount,
            })
            .then(async (response) => {
                const tagObject = response.data?.tagObject;

                const pgp = response.data?.pgp;

                const newWallet = new TagModel({ ...tagObject, pgp });

                await this._chromeService.removeItem("flow");

                await this._chromeService.setItem("wallet", newWallet);

                this._redirect();
            })
            .catch(this.onBiometricsFailed);
    }

    private async _decryptTag(payload: any): Promise<void> {
        const zelfProof = await this._tagsService.getZelfProof();

        const userFingerprint = this._walletService.getUserFingerprint();

        this._tagsService
            .decryptTag({
                ...payload,
                zelfProof,
                identifier: userFingerprint.hash,
            })
            .then(async (response) => {
                await this._chromeService.removeItem("flow");
                await this._chromeService.setItem("wallet", new TagModel(response.data));

                this._redirect();
            })
            .catch(this.onBiometricsFailed);
    }

    private async _importTag(payload: any): Promise<void> {
        this._tagsService
            .leaseTag({
                ...payload,
                mnemonic: await this._httpWrapperService.encryptMessage(this._vaultService.mnemonic),
                type: "import",
            })
            .then(async (response) => {
                this._vaultService.mnemonic = "";

                const tagObject = response.data?.tagObject;

                console.log(tagObject, { response: response.data });

                const pgp = response.data?.pgp;

                const newWallet = new TagModel({ ...tagObject, pgp });

                await this._chromeService.removeItem("flow");

                await this._chromeService.setItem("wallet", newWallet);

                this._redirect();
            })
            .catch(this.onBiometricsFailed);
    }

    private async _tagLeaseRecovery(payload: any): Promise<void> {
        this._tagsService
            .leaseRecovery({
                ...payload,
                zelfProof: this.zelfProof,
                newTagName: this.newTagName,
            })
            .then(async (response) => {
                const tagObject = response.data?.tagObject;

                const pgp = response.data?.pgp;

                const newWallet = new TagModel({ ...tagObject, pgp });

                console.log({ responseData: response.data });

                await this._chromeService.removeItem("flow");

                await this._chromeService.removeItem("newTagName");

                await this._chromeService.setItem("wallet", newWallet);

                this._bottomSheet.open(ReserveDoneSheetComponent, {
                    backdropClass: "zelf-backdrop",
                    panelClass: "zelf-bottom-sheet",
                    data: { tagName: this.newTagName },
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
        this.errorTitle = this._translocoService.translate("errors.generic_title");

        this.errorMessage = this._errorService.translateErrorMessage(exception?.error?.message || exception?.error?.error, "errors.generic_identity");
    };

    async onBiometricsScanned(encryptedImage: string): Promise<void> {
        const referralTagName = await this._tagsService.getReferral();

        const domain = await this._tagsService.getDomain();

        const tagName = this.flow === "create" ? await this._tagsService.getNewTagName() : await this._tagsService.getTagName();

        const payload: any = {
            faceBase64: encryptedImage,
            os: "DESKTOP",
            password: await this._httpWrapperService.encryptMessage(this._vaultService.password),
            referralTagName,
            domain,
            tagName,
        };

        if (this.flow === "create") {
            this._createTag(payload);
        } else if (this.flow === "import") {
            this._importTag(payload);
        } else if (this.flow === "recover") {
            this._tagLeaseRecovery(payload);
        } else {
            this._decryptTag(payload);
        }
    }

    async startBiometrics(): Promise<void> {
        this._chromeService.setItem("hideBiometricsMessage", this.form.controls.hideBiometricsCheckbox.value);

        this.showBiometrics = true;
    }
}
