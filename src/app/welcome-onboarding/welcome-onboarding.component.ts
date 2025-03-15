import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Router, RouterLink } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";
import { swipeLeft } from "app/animations/swipe-left.animation";
import { CaptchaService } from "app/captcha.service";
import { ChromeService } from "app/chrome.service";
import { VaultService } from "app/vault.service";
import { WalletService } from "app/wallet.service";
import { ZelfNameService } from "app/zelf-name-service.service";
import { Subject, takeUntil } from "rxjs";

@Component({
    animations: [swipeLeft],
    imports: [CommonModule, TranslocoModule, MatButtonModule, ReactiveFormsModule, MatProgressSpinnerModule, RouterLink],
    selector: "welcome-onboarding",
    standalone: true,
    styleUrls: ["./welcome-onboarding.component.scss"],
    templateUrl: "./welcome-onboarding.component.html",
})
export class WelcomeOnboardingComponent implements OnInit, OnDestroy {
    private _carouselItemInterval!: ReturnType<typeof setInterval>;
    private unsubscriber$: Subject<void> = new Subject<void>();

    carouselIndex: number = 0;
    carouselProgress: number = 0;
    form!: UntypedFormGroup;
    loading: boolean = false;
    showHomeButton: boolean = false;

    constructor(
        private _captchaService: CaptchaService,
        private _chromeService: ChromeService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _walletService: WalletService,
        private _vaultService: VaultService,
        private _zelfNameService: ZelfNameService
    ) {
        this._zelfNameService.setFlow("");
        this._zelfNameService.setMnemonicCount(0);
        this._zelfNameService.setZelfName("");
        this._zelfNameService.setReferral("");
        this._zelfNameService.setZelfNameObject(null);

        this._walletService.setWalletsToColdStorage();

        this._vaultService.password = "";
        this._vaultService.mnemonic = "";

        this._initForm();

        this._chromeService.onWalletsChanged$.pipe(takeUntil(this.unsubscriber$)).subscribe(async () => {
            const wallets = await this._walletService.getWalletsFromStorage();

            if (wallets.length) this.showHomeButton = true;
        });
    }

    async ngOnInit(): Promise<void> {
        this._initCarousel();

        const wallets = await this._walletService.getWalletsFromStorage();

        if (wallets.length) this.showHomeButton = true;
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();

        clearInterval(this._carouselItemInterval);
    }

    private _initCarousel(): void {
        this.carouselProgress = 0;

        this._carouselItemInterval = setInterval(() => {
            const tempIndex = this.carouselIndex;

            this.carouselIndex = -1;

            setTimeout(() => {
                this.carouselIndex = tempIndex === 2 ? 0 : tempIndex + 1;
                this.carouselProgress = 33 * (this.carouselIndex + 1);
            }, 500);
        }, 15000);

        setTimeout(() => {
            this.carouselProgress = 33;
        });
    }

    async _initSession(): Promise<any> {
        let { hash } = this._walletService.getUserFingerprint();

        const session = await this._walletService.createLivenessSession({
            identifier: hash,
            type: "general",
        });

        if (session?.data) this._chromeService.setItem("accessToken", session.data.token);
    }

    private _initForm(): void {
        this.form = this._formBuilder.group({
            zelfName: ["", [Validators.required, Validators.minLength(1), Validators.maxLength(27)]],
        });
    }

    private async _noZelfNameFound(zelfNameOffer: any): Promise<void> {
        await this._zelfNameService.setZelfName(zelfNameOffer.zelfName, zelfNameOffer);
        await this._zelfNameService.setZelfNameObject(null);

        this.form.clearValidators();
        this.form.reset({ zelfName: "" });

        this._router.navigate(["/welcome", "available"]);

        this.loading = false;
    }

    async searchZelfName(event: any): Promise<any> {
        if (!this.form.valid) {
            this.form.patchValue({ zelfName: "" });

            return;
        }

        if (this.loading) return;

        event.preventDefault();

        this.loading = true;

        const zelfName = `${this.form.value.zelfName}.zelf`;

        let captchaToken = "";

        if (!this._chromeService.isExtension) {
            try {
                const captchaKey = this.form.value.zelfName.replace(".", "_");

                captchaToken = await this._captchaService.executeRecaptcha(captchaKey);
            } catch (error) {
                console.error("reCAPTCHA failed:", error);
            }
        }

        await this._initSession();

        this._zelfNameService
            .searchZelfName("zelfName", zelfName, captchaToken)
            .then(async (response) => {
                if (response?.data.price) return await this._noZelfNameFound(response?.data);

                const zelfNameObject = response.data.ipfs?.length ? response.data.ipfs[0] : response.data.arweave[0];

                await this._zelfNameService.setZelfName(zelfName, { price: 0, reward: 0 });
                await this._zelfNameService.setZelfNameObject(zelfNameObject);

                this.loading = false;

                this._router.navigate(["/welcome", "registered"]);
            })
            .catch((exception) => {
                console.error({ exception });

                this.loading = false;
            });
    }

    sanitizeZelfName(): void {
        const control = this.form.get("zelfName");

        if (!control) return;

        // Remove invalid characters, ensure it doesn't start with a number or special character and doesn't end with '.' or '-'
        let sanitizedValue = control.value.replace(/[^a-zA-Z0-9.-]|^[^a-zA-Z]+|[.-]$/g, "");

        sanitizedValue = sanitizedValue.toLowerCase().trim();

        control.patchValue(sanitizedValue, { emitEvent: false });

        if (!sanitizedValue) control.markAsPristine();
    }
}
