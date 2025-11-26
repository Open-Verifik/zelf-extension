import { Subject, takeUntil } from "rxjs";

import { CommonModule } from "@angular/common";
import { AfterContentInit, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { Router, RouterLink } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";

import { swipeLeft } from "app/animations/swipe-left.animation";
import { CaptchaService } from "app/captcha.service";
import { ChromeService } from "app/chrome.service";
import { DomainLicense } from "app/core/models/domain.type";
import { DomainSelectionData, DomainSelectionModalComponent } from "app/domain-selection-modal/domain-selection-modal.component";
import { DomainService } from "app/domain.service";
import { TagsService } from "app/tags.service";
import { VaultService } from "app/vault.service";
import { WalletService } from "app/wallet.service";
import { MatBottomSheet } from "@angular/material/bottom-sheet";

@Component({
    animations: [swipeLeft],
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        ReactiveFormsModule,
        RouterLink,
        TranslocoModule,
    ],
    selector: "welcome-onboarding",
    styleUrls: ["./welcome-onboarding.component.scss"],
    templateUrl: "./welcome-onboarding.component.html",
})
export class WelcomeOnboardingComponent implements OnInit, OnDestroy, AfterContentInit {
    private _carouselItemInterval!: ReturnType<typeof setInterval>;
    private unsubscriber$: Subject<void> = new Subject<void>();

    activeThemeClass: string = "";
    availableDomains: DomainLicense[] = [];
    carouselIndex: number = 0;
    carouselProgress: number = 0;
    currentDomainConfig: DomainLicense | null = null;
    domain: string = "zelf";
    domainHover: boolean = false;
    form!: UntypedFormGroup;
    loading: boolean = false;
    showHomeButton: boolean = false;

    gridItems = [
        { text: "Spark", row: 1, col: 1 },
        { text: "Shadow", row: 1, col: 2 },
        { text: "Whisper", row: 1, col: 3 },
        { text: "Puzzle", row: 2, col: 1 },
        { text: "Lush", row: 2, col: 2 },
        { text: "Frost", row: 2, col: 3 },
        { text: "Glimpse", row: 3, col: 1 },
        { text: "Tangle", row: 3, col: 2 },
        { text: "Drift", row: 3, col: 3 },
        { text: "Hollow", row: 4, col: 1 },
        { text: "Echo", row: 4, col: 2 },
        { text: "Breeze", row: 4, col: 3 },
    ];

    constructor(
        private _captchaService: CaptchaService,
        private _chromeService: ChromeService,
        private _bottomSheet: MatBottomSheet,
        private _domainService: DomainService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _tagsService: TagsService,
        private _vaultService: VaultService,
        private _walletService: WalletService
    ) {
        this._clearChromeItems();

        this._vaultService.password = "";
        this._vaultService.mnemonic = "";

        this._initForm();

        this._chromeService.onWalletsChanged$.pipe(takeUntil(this.unsubscriber$)).subscribe(async () => {
            const wallets = await this._walletService.getWalletsFromStorage();

            if (wallets.length) this.showHomeButton = true;
        });
    }

    async ngOnInit(): Promise<void> {
        await this._walletService.setWalletsToColdStorage();

        this._initCarousel();

        await this._loadDomains();
    }

    async ngAfterContentInit(): Promise<void> {
        const wallets = await this._walletService.getWalletsFromStorage();

        if (wallets.length) this.showHomeButton = true;

        if (!this.form.value.domain) {
            this.form.patchValue({ domain: "zelf" }, { emitEvent: false });
        }

        const initialDomain = this.form.get("domain")?.value || "zelf";
        this._updateTagNameValidators(initialDomain);
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();

        clearInterval(this._carouselItemInterval);
    }

    get isZelfNameEmpty(): boolean {
        const value = (this.form?.value?.tagName || "").trim();
        return value?.length === 0;
    }

    private async _loadDomains(): Promise<void> {
        this.domain = await this._chromeService.getItem<string>("domain");
        this.availableDomains = await this._domainService.loadDomainsFromStorage();

        this.form.patchValue({ domain: this.domain }, { emitEvent: false });
    }

    private _clearChromeItems(): void {
        this._chromeService.removeItem("flow");
        this._chromeService.removeItem("mnemonicCount");
        this._chromeService.removeItem("network");
        this._chromeService.removeItem("newTagName");
        this._chromeService.removeItem("referralTagName");
        this._chromeService.removeItem("tagName");
        this._chromeService.removeItem("tagNameObject");
        this._chromeService.removeItem("tagNameReward");
        this._chromeService.removeItem("tagResponse");
        this._chromeService.removeItem("zelfNameObject");
        this._chromeService.removeItem("zelfProof");
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

    private _initForm(): void {
        this.form = this._formBuilder.group({
            tagName: ["", [Validators.required, Validators.minLength(1), Validators.maxLength(27)]],
            domain: [this.domain || "zelf", [Validators.required]],
        });

        this.form
            .get("domain")
            ?.valueChanges.pipe(takeUntil(this.unsubscriber$))
            .subscribe((domain: string) => {
                this._updateTagNameValidators(domain);
            });
    }

    private _updateTagNameValidators(domain: string): void {
        if (!domain) return;

        const domainConfig = this.availableDomains.find((d) => d.name === domain);

        if (!domainConfig) {
            const configFromService = this._domainService.getDomainLicense(domain);

            if (configFromService && configFromService.tags) {
                this.currentDomainConfig = configFromService;

                this._applyValidators(configFromService.tags.minLength, configFromService.tags.maxLength);
            }

            return;
        }

        if (!domainConfig.tags || !domainConfig.tags.minLength || !domainConfig.tags.maxLength) {
            console.warn(`Domain config for "${domain}" is missing tags validation rules. Using defaults.`);
            return;
        }

        this.currentDomainConfig = domainConfig;

        const { minLength, maxLength } = domainConfig.tags;

        this._applyValidators(minLength, maxLength);
    }

    private _applyValidators(minLength: number, maxLength: number): void {
        const tagNameControl = this.form.get("tagName");

        if (!tagNameControl) return;

        tagNameControl.clearValidators();
        tagNameControl.setValidators([Validators.required, Validators.minLength(minLength), Validators.maxLength(maxLength)]);

        const currentValue = tagNameControl.value;

        if (currentValue && currentValue.length > maxLength) {
            tagNameControl.setValue(currentValue.substring(0, maxLength));
        }

        tagNameControl.updateValueAndValidity();
    }

    getMaxTagNameLength(): number {
        return this.currentDomainConfig?.tags?.maxLength || 27;
    }

    getMinTagNameLength(): number {
        return this.currentDomainConfig?.tags?.minLength || 1;
    }

    private async _existingTagName(responseData: any): Promise<void> {
        const tagModel = this._tagsService.createTagModelFromSearchResponse(responseData);

        if (!tagModel) {
            this.loading = false;
            return;
        }

        const tagName = tagModel.publicData.tagName || tagModel.name;

        if (tagName) {
            await this._tagsService.setTagName(tagName.toLowerCase(), responseData);
            await this._tagsService.setZelfProof(tagModel.zelfProof);
            await this._tagsService.setDomain(tagModel.publicData.domain);
            await this._tagsService.setTagNameObject(tagModel);
            await this._tagsService.setTagResponse(responseData);
        }

        this.form.clearValidators();
        this.form.reset({ tagName: "" });

        this._router.navigate(["/welcome", "registered"]);

        this.loading = false;
    }

    async searchZelfName(event: any): Promise<any> {
        if (!this.form.valid) {
            this.form.patchValue({ tagName: "" });

            return;
        }

        if (this.loading) return;

        event.preventDefault();

        this.loading = true;

        const domain: string = this.form.value.domain || "zelf";
        const tagName = `${this.form.value.tagName}`.toLowerCase();

        let captchaToken = "";

        if (!this._chromeService.isExtension) {
            try {
                const captchaKey = this.form.value.tagName.replace(".", "_");

                captchaToken = await this._captchaService.executeRecaptcha(captchaKey);
            } catch (error) {
                console.error("reCAPTCHA failed:", error);
            }
        }

        this._tagsService
            .searchTag({ tagName, domain: domain, captchaToken: captchaToken })
            .then(async (response) => {
                if (!response?.data.available) {
                    await this._existingTagName(response?.data);

                    return;
                }

                await this._tagsService.setNewTagName(tagName);
                await this._tagsService.setDomain(domain);
                await this._tagsService.setTagResponse(response.data);

                const availableTagData = {
                    name: tagName,
                    available: true,
                    publicData: {
                        avalancheAddress: "",
                        blockDAGAddress: "",
                        btcAddress: "",
                        domain: domain,
                        ethAddress: "",
                        expiresAt: "",
                        hasPassword: "false",
                        origin: "",
                        registeredAt: "",
                        solanaAddress: "",
                        suiAddress: "",
                        tagName: tagName,
                        type: "",
                    },
                };

                await this._tagsService.setTagNameObject(availableTagData);

                this.loading = false;

                this._router.navigate(["/welcome", "available"]);
            })
            .catch((exception) => {
                console.error({ exception });

                this.loading = false;
            });
    }

    sanitizeZelfName(): void {
        const control = this.form.get("tagName");

        if (!control) return;

        let sanitizedValue = control.value.replace(/[^a-zA-Z0-9.-]|^[^a-zA-Z]+|[.-]$/g, "");

        sanitizedValue = sanitizedValue.toUpperCase().trim();

        control.patchValue(sanitizedValue, { emitEvent: false });

        if (!sanitizedValue) control.markAsPristine();
    }

    openDomainSelectionModal(): void {
        const dialogData: DomainSelectionData = {
            domains: this.availableDomains,
            selectedDomain: this.form.get("domain")?.value || "zelf",
        };

        const bottomSheetRef = this._bottomSheet.open(DomainSelectionModalComponent, {
            data: dialogData,
            disableClose: true,
            backdropClass: "zelf-backdrop",
            panelClass: "zelf-bottom-sheet-seasalt",
        });

        bottomSheetRef.afterDismissed().subscribe((result: string) => {
            if (!result) return;

            this.form.get("domain")?.setValue(result);
            this._tagsService.setDomain(result);
        });
    }
}
