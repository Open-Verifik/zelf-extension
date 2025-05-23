import jsQR from "jsqr";
import { Buffer } from "buffer";

import { CommonModule } from "@angular/common";
import { Component, OnDestroy } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { CaptchaService } from "app/captcha.service";
import { ChromeService } from "app/chrome.service";
import { DragAndDropDirective } from "app/directives/drag-and-drop.directive";
import { WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { ZelfNameService } from "app/zelf-name-service.service";
import { WelcomeErrorComponent } from "../welcome-error/welcome-error.component";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";
@Component({
    imports: [
        CommonModule,
        DragAndDropDirective,
        MatButtonModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        RouterModule,
        TranslocoModule,
        WelcomeErrorComponent,
        ZelfLoaderComponent,
    ],
    selector: "welcome-find",
    styleUrls: ["./welcome-find.component.scss"],
    templateUrl: "./welcome-find.component.html",
})
export class WelcomeFindComponent implements OnDestroy {
    private _invalidTimeout!: ReturnType<typeof setTimeout>;

    captchaToken: string = "";
    ethAddress: string = "";
    errorTitle: string = "";
    errorMessage: string = "";
    fileBase64: string = "";
    form!: UntypedFormGroup;
    loading: boolean = false;
    notFound: boolean = false;
    searching: boolean = false;
    zelfNameObject!: WalletModel;
    zelfProof: string = "";

    constructor(
        private _captchaService: CaptchaService,
        private _chromeService: ChromeService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _translocoService: TranslocoService,
        private _walletService: WalletService,
        private _zelfNameService: ZelfNameService
    ) {
        this._initForm();
    }

    ngOnDestroy(): void {
        clearTimeout(this._invalidTimeout);
    }

    private async _captchaGeneration(query: string, type = "preview"): Promise<any> {
        return null;

        // if (this._chromeService.isExtension) return;

        const action = query.replace(".", "_");

        try {
            this.captchaToken = await this._captchaService.executeRecaptcha(action);
        } catch (error) {
            console.error("reCAPTCHA failed:", error);
        }
    }

    private _decodeQRCode(base64: string): void {
        const img = new Image();

        img.src = base64;

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            if (!context) return;

            canvas.width = img.width;
            canvas.height = img.height;

            context.drawImage(img, 0, 0, img.width, img.height);

            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const extractedQRData = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "attemptBoth" });

            this._extractBinaryData(extractedQRData);
        };
    }

    private async _extractBinaryData(extractedQRData: any): Promise<any> {
        if (!extractedQRData || !extractedQRData.binaryData) return this._setNotFound();

        const hexString = this._toHexString(extractedQRData.binaryData);

        const buffer = Buffer.from(hexString.replace(/\s/g, ""), "hex");
        const base64String = buffer.toString("base64");

        await this._zelfNameService.setZelfProof(base64String);

        this.zelfProof = base64String;

        await this._previewQRCode();
    }

    private _getAddressPattern(): RegExp {
        const ethPattern = this._walletService.ETHRegex;
        const solPattern = this._walletService.SOLRegex;
        const btcPattern = this._walletService.BTCRegex;

        return new RegExp(`(${ethPattern.source})|(${solPattern.source})|(${btcPattern.source})`);
    }

    private _handleFile(file: File): void {
        const reader = new FileReader();

        reader.onload = () => {
            this.fileBase64 = reader.result as string;

            if (typeof this.fileBase64 !== "string") return;

            this._decodeQRCode(this.fileBase64);
        };

        reader.readAsDataURL(file);
    }

    private _initForm(): void {
        const combinedPattern = this._getAddressPattern();

        this.form = this._formBuilder.group({
            publicAddress: ["", [Validators.pattern(combinedPattern)]],
            zelfProof: [""],
        });
    }

    private async _previewQRCode(): Promise<void> {
        if (!this.zelfProof) return;

        const response = await this._zelfNameService.previewZelfProof(this.zelfProof, this.captchaToken);

        if (!response.data) {
            this.errorTitle = this._translocoService.translate("errors.incorrect_zelf_proof_title");
            this.errorMessage = this._translocoService.translate("errors.incorrect_zelf_proof_message");

            return;
        }

        this.ethAddress = response.data.publicData.ethAddress;

        this.form.patchValue({ publicAddress: this.ethAddress });

        response.data.publicData.zelfName = `${response.data.publicData.zelfName}`.toLowerCase();

        this._zelfNameService.setZelfName(response.data.publicData.zelfName);

        this._zelfNameService.setZelfProof(this.zelfProof);

        await this._queryForZelfObject(this.ethAddress);

        const currentZelfNameObject = await this._queryForZelfObjectByZelfName(response.data.publicData.zelfName);

        if (currentZelfNameObject?.available) this._zelfNameService.setZelfNameObject(new WalletModel({ ...response.data, available: true }));

        this._redirectAfterZelfProofSearch(currentZelfNameObject);
    }

    private async _queryForZelfObjectByZelfName(query: string): Promise<any> {
        this.searching = true;

        try {
            await this._captchaGeneration(query, "zelfName");
            return await this._queryZNS("zelfName", query);
        } catch (error) {
            this._setNotFound();
        } finally {
            this.searching = false;
        }
    }

    private async _queryForZelfObject(query: string): Promise<any> {
        this.searching = true;

        try {
            await this._captchaGeneration(query);

            let zelfNameObject: WalletModel | null = null;

            if (this._walletService.ETHRegex.test(query)) {
                zelfNameObject = await this._queryZNS("ethAddress", query);
            } else if (this._walletService.SOLRegex.test(query)) {
                zelfNameObject = await this._queryZNS("solanaAddress", query);
            } else if (this._walletService.BTCRegex.test(query)) {
                zelfNameObject = await this._queryZNS("btcAddress", query);
            }

            return zelfNameObject;
        } catch (error) {
            this._setNotFound();
        } finally {
            this.searching = false;
        }
    }

    async _queryZNS(key: string, value: string): Promise<any> {
        try {
            const response = await this._zelfNameService.searchZelfNameV2(key, value);

            if (!response.data) return null;

            if (response.data?.available) return response.data;

            const zelfNameObject = new WalletModel(response.data.ipfs?.length ? response.data.ipfs[0] : response.data.arweave[0]);

            // Do not store this zelfNameObject - it is only used to check for ownership
            if (key === "zelfName") {
                await this._zelfNameService.setZelfName(zelfNameObject.name, { price: 0, reward: 0 });

                await this._zelfNameService.setZelfNameObject(zelfNameObject);
            }

            this.loading = false;

            return zelfNameObject;
        } catch (error) {
            console.error({ error });

            this.loading = false;

            return null;
        }
    }

    // In this flow - we don't know who owns the name
    private _redirectAfterTextSearch(zelfNameObject: WalletModel | any): void {
        if (!zelfNameObject || zelfNameObject?.available) {
            this._router.navigate(["/welcome/available"]);

            return;
        }

        if (zelfNameObject.publicData.isInGracePeriod || zelfNameObject.publicData?.isExpired) {
            this._router.navigate(["/welcome/grace"]);
        } else {
            this._router.navigate(["/welcome/registered"]);
        }
    }

    // In this flow, we know who owns a zelfproof to the name, but it may have been taken if they let the grace period expire
    private _redirectAfterZelfProofSearch(zelfNameObject: WalletModel | any): void {
        const ownedByThisUser = zelfNameObject.ethAddress === this.ethAddress;

        if (ownedByThisUser && (zelfNameObject.publicData?.isInGracePeriod || zelfNameObject.publicData?.isExpired)) {
            this._router.navigate(["/welcome/grace"]);
        } else if (!ownedByThisUser) {
            this._router.navigate(["/welcome/recover"]);
        } else {
            this._router.navigate(["/welcome/registered"]);
        }
    }

    private _setNotFound(): void {
        this.notFound = true;

        this._invalidTimeout = setTimeout(() => {
            this.notFound = false;
        }, 5000);
    }

    private _toHexString(byteArray: any): string {
        return Array.from(byteArray, (byte: any) => {
            return ("0" + (byte & 0xff).toString(16)).slice(-2);
        }).join("");
    }

    async clearError(): Promise<void> {
        await this._chromeService.removeItem("zelfName");
        await this._chromeService.removeItem("zelfNameObject");
        await this._chromeService.removeItem("zelfProof");

        this.errorMessage = "";
        this.errorTitle = "";
        this.ethAddress = "";
        this.zelfProof = "";

        this.form.reset();
    }

    clearNotFound(): void {
        clearTimeout(this._invalidTimeout);

        this.notFound = false;
    }

    fileBrowseHandler(event: Event): void {
        const files = (event.target as HTMLInputElement).files;

        if (!files?.length) return;

        const file = files[0];

        this._handleFile(file);
    }

    async onDrop(event: DragEvent): Promise<any> {
        event.preventDefault();
        event.stopPropagation();

        if (!event.dataTransfer || !event.dataTransfer.files.length) return;

        const file = event.dataTransfer.files[0];

        this._handleFile(file);
    }

    async pastedAddress(event: ClipboardEvent): Promise<void> {
        event.preventDefault();
        event.stopPropagation();

        if (this.searching) return;

        const query = event.clipboardData?.getData("text");

        if (!query) return;

        const combinedPattern = this._getAddressPattern();

        if (!combinedPattern.test(query)) return;

        this.ethAddress = "";

        this.form.patchValue({ publicAddress: query }, { emitEvent: false });

        const zelfNameObject = await this._queryForZelfObject(query);

        if (!zelfNameObject) return;

        this._redirectAfterTextSearch(zelfNameObject);
    }

    async searchAddress(): Promise<void> {
        if (this.searching || this.form.invalid) return;

        const query = this.form.value.publicAddress;

        if (!query) return;

        this.ethAddress = "";

        const zelfNameObject = await this._queryForZelfObject(query);

        if (!zelfNameObject) return;

        this._redirectAfterTextSearch(zelfNameObject);
    }
}
