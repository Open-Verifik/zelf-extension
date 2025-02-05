import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Subject } from "rxjs";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { TranslocoModule, TranslocoService } from "@ngneat/transloco";
import { MatButtonModule } from "@angular/material/button";

import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { FlexLayoutModule } from "@angular/flex-layout";
import { WalletService } from "../wallet.service";

import { ChromeService } from "app/chrome.service";
import { FaceScan, SmartLivenessComponent } from "../smart-liveness/smart-liveness.component";
import { ZelfNameService } from "app/zelf-name-service.service";
import { CaptchaService } from "app/captcha.service";
import { HttpWrapperService } from "app/http-wrapper.service";

let _this = {
    biometricsLoginCalled: false,
};

@Component({
    selector: "biometrics",
    standalone: true,
    templateUrl: "./biometrics.component.html",
    styleUrls: ["./biometrics.component.scss"],
    imports: [
        FlexLayoutModule,
        CommonModule,
        MatDialogModule,
        TranslocoModule,
        MatButtonModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        SmartLivenessComponent,
    ],
})
export class BiometricsComponent implements OnInit, OnDestroy {
    @ViewChild("errorDialog", { static: true }) errorDialog: TemplateRef<HTMLElement> = {} as TemplateRef<HTMLVideoElement>;

    @Input() callback: any;
    @Input() data: any;
    @Input() type?: string;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    retrySubject: Subject<void> = new Subject<void>();
    successfulUploadSubject: Subject<void> = new Subject<void>();

    base64Image: string = "";
    device: string = "";
    errorContent: string = "";
    session: any;
    showError: boolean = false;

    constructor(
        private _captchaService: CaptchaService,
        private _chromeService: ChromeService,
        private _dialog: MatDialog,
        private _httpWrapperService: HttpWrapperService,
        private _walletService: WalletService,
        private _zelfNameService: ZelfNameService,
        private _translocoService: TranslocoService
    ) {
        this.device = this._walletService.detectOS();
        this.session = this._walletService.getSessionData();
    }

    ngOnInit(): void {
        this._generateSession(this.type);
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
    }

    private async _biometricsLogin(): Promise<any> {
        if (_this["biometricsLoginCalled"]) return;

        _this["biometricsLoginCalled"] = true;

        const payload: any = {
            captchaToken: this._captchaService.getCaptchaToken(),
            faceBase64: this.base64Image,
            os: this.device,
            referralZelfName: this._zelfNameService.getReferral(),
            zelfName: this._zelfNameService.getZelfName(),
        };

        if (this.session.password) payload.password = this.session.password;

        payload.faceBase64 = await this._httpWrapperService.encryptMessage(payload.faceBase64);

        switch (this.type) {
            case "createWallet":
                this._createWallet(payload, this.data);
                break;
            case "decryptWallet":
                this._decryptWallet(payload, this.data);
                break;
            case "importWallet":
                this._importWallet(payload, this.data);
                break;
            default:
                break;
        }
    }

    private _createWallet(payload: any, data: any): void {
        this._zelfNameService
            .leaseZelfName({
                ...payload,
                type: "create",
                wordsCount: data.wordsCount || payload.wordsCount || 12,
                previewZelfProof: 1,
            })
            .then((response) => {
                this.session.showBiometrics = false;

                localStorage.setItem("durationToken", response.data.durationToken);

                this._chromeService.setItem("wallet", response.data);
                this._walletService.goToNextStep(this.session.step + 1);
                this.successfulUploadSubject.next();

                _this["biometricsLoginCalled"] = false;
            })
            .catch((exception) => {
                this.showError = true;
                this.errorContent = this._getErrorContent(exception, "failed_to_create_wallet");

                this._openErrorDialog();

                _this["biometricsLoginCalled"] = false;
            });
    }

    private _decryptWallet(payload: any, data: any): void {
        this._zelfNameService
            .decryptZelfName({
                ...payload,
                zelfName: this._zelfNameService.getZelfName(),
                zelfProof: data.zelfProof || this._zelfNameService.getZelfProof(),
                identifier: data.identifier,
            })
            .then((response) => {
                this._chromeService.setItem("unlockWallet", response.data);

                setTimeout(() => {
                    this.session.showBiometrics = false;
                    this.session.navigationStep = 2;
                    this.successfulUploadSubject.next();

                    _this["biometricsLoginCalled"] = false;
                }, 500);
            })
            .catch((exception) => {
                this.showError = true;
                this.errorContent = this._getErrorContent(exception, "failed_to_decrypt_wallet");

                this._openErrorDialog();

                _this["biometricsLoginCalled"] = false;
            });
    }

    private _generateSession(type?: string): void {
        let { hash } = this._walletService.generateUniqueId();

        this._walletService
            .createLivenessSession({
                identifier: hash,
                type,
            })
            .then((response) => {
                this._chromeService.setItem("accessToken", response.data.token);
            });
    }

    private _getErrorContent(exception: any, fallback = "failed"): string {
        const messageKey = `smart_liveness.errors.${exception?.message}`;
        const message = this._translocoService.translate(messageKey);

        return messageKey === message ? this._translocoService.translate(`smart_liveness.errors.${fallback}`) : message;
    }

    private _importWallet(payload: any, data: any): void {
        this._zelfNameService
            .leaseZelfName({
                ...payload,
                type: "import",
                mnemonic: data.phrase,
            })
            .then((response) => {
                this.session.walletCreated = response.data;

                localStorage.setItem("durationToken", response.data.durationToken);

                this._chromeService.setItem("importWallet", response.data);
                this._walletService.goToNextStep(this.session.step + 1);
                this.successfulUploadSubject.next();

                _this["biometricsLoginCalled"] = false;
            })
            .catch((exception) => {
                this.showError = true;
                this.errorContent = this._getErrorContent(exception, "failed_to_import_wallet");

                this._openErrorDialog();

                _this["biometricsLoginCalled"] = false;
            });
    }

    private _openErrorDialog() {
        const dialogRef = this._dialog.open(this.errorDialog, { disableClose: true });

        dialogRef.afterClosed().subscribe(() => {
            this.showError = false;
            this.errorContent = "";

            this.retrySubject.next();
        });
    }

    goBack(): void {
        window.location.href = "/";
    }

    onFaceScan(scan: FaceScan): void {
        this.base64Image = scan.base64Image;

        this._biometricsLogin();
    }
}
