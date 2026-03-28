import { Subject, takeUntil } from "rxjs";

import { CommonModule } from "@angular/common";
import { AfterContentInit, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";

import { CaptchaService } from "app/captcha.service";
import { ChromeService } from "app/chrome.service";
import { DomainLicense } from "app/core/models/domain.type";
import { DomainSelectionData, DomainSelectionModalComponent } from "app/domain-selection-modal/domain-selection-modal.component";
import { DomainService } from "app/domain.service";
import { HttpWrapperService } from "app/http-wrapper.service";
import { ZelfNamePipe } from "app/pipes/zelf-name.pipe";
import { TagsService, TagModel } from "app/tags.service";
import { VaultService } from "app/vault.service";
import { WalletService } from "app/wallet.service";
import { WelcomeAvailableContentComponent } from "app/welcome-available/welcome-available-content.component";
import { MatBottomSheet } from "@angular/material/bottom-sheet";

@Component({
    imports: [
        CommonModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        RouterLink,
        TranslocoModule,
        WelcomeAvailableContentComponent,
        ZelfNamePipe,
    ],
    selector: "welcome-claim",
    styleUrls: ["./welcome-claim.component.scss"],
    templateUrl: "./welcome-claim.component.html",
})
export class WelcomeClaimComponent implements OnInit, OnDestroy, AfterContentInit {
    private unsubscriber$: Subject<void> = new Subject<void>();
    private _invalidTimeout!: ReturnType<typeof setTimeout>;

    availableDomains: DomainLicense[] = [];
    currentDomainConfig: DomainLicense | null = null;
    domain: string = "zelf";
    domainHover: boolean = false;
    form!: UntypedFormGroup;
    loading: boolean = false;

    // Availability state
    availabilityChecked: boolean = false;
    isAvailable: boolean = false;
    checkedTagName: string = "";

    // Step state: 1 = search, 2 = confirm
    step: number = 1;

    // Step 2 (confirm) state — absorbed from welcome-available
    loadingReferral: boolean = false;
    invalidReferral: boolean = false;
    referralTagModel: TagModel | null = null;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _captchaService: CaptchaService,
        private _chromeService: ChromeService,
        private _bottomSheet: MatBottomSheet,
        private _domainService: DomainService,
        private _formBuilder: FormBuilder,
        private _httpWrapperService: HttpWrapperService,
        private _router: Router,
        private _tagsService: TagsService,
        private _vaultService: VaultService,
        private _walletService: WalletService
    ) {
        this._initForm();
    }

    async ngOnInit(): Promise<void> {
        await this._loadDomains();
    }

    async ngAfterContentInit(): Promise<void> {
        if (!this.form.value.domain) {
            this.form.patchValue({ domain: "zelf" }, { emitEvent: false });
        }

        const initialDomain = this.form.get("domain")?.value || "zelf";
        this._updateTagNameValidators(initialDomain);
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
        clearTimeout(this._invalidTimeout);
    }

    get isZelfNameEmpty(): boolean {
        const value = (this.form?.value?.tagName || "").trim();
        return value?.length === 0;
    }

    private async _loadDomains(): Promise<void> {
        this.domain = await this._chromeService.getItem<string>("domain");

        try {
            await this._domainService.getDomains();
        } catch {
            // Fall back to cached storage if API fails
        }
        this.availableDomains = await this._domainService.loadDomainsFromStorage();

        this.form.patchValue({ domain: this.domain }, { emitEvent: false });
    }

    private _initForm(): void {
        this.form = this._formBuilder.group({
            tagName: ["", [Validators.required, Validators.minLength(1), Validators.maxLength(27)]],
            domain: [this.domain || "zelf", [Validators.required]],
            // Step 2 fields
            referralName: ["", Validators.maxLength(32)],
            termsAndConditions: [false, Validators.requiredTrue],
        });

        this.form
            .get("domain")
            ?.valueChanges.pipe(takeUntil(this.unsubscriber$))
            .subscribe((domain: string) => {
                this._updateTagNameValidators(domain);
            });

        // Reset availability when tagName changes
        this.form
            .get("tagName")
            ?.valueChanges.pipe(takeUntil(this.unsubscriber$))
            .subscribe(() => {
                if (this.step === 2) {
                    // Go back to step 1 when editing the name
                    this.step = 1;
                }
                this.availabilityChecked = false;
                this.isAvailable = false;
                this.checkedTagName = "";
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

        // Tag is taken — just update status, don't touch the form
        this.availabilityChecked = true;
        this.isAvailable = false;

        this.loading = false;
    }

    async searchZelfName(event: any): Promise<any> {
        if (!this.form.get("tagName")?.valid || !this.form.get("domain")?.valid) {
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

                // Show availability inline, then auto-advance to step 2
                this.availabilityChecked = true;
                this.isAvailable = true;
                this.checkedTagName = tagName;

                // Auto-advance to confirm step after a brief pause
                setTimeout(() => {
                    this.step = 2;
                }, 800);
            })
            .catch((exception) => {
                console.error({ exception });

                this.loading = false;
            });
    }

    // --- Step transitions ---

    goBackToSearch(): void {
        this.step = 1;
    }

    // --- Step 2: Confirm actions (absorbed from welcome-available) ---

    async goToSecurity(): Promise<void> {
        await this._tagsService.setFlow("create");

        this._router.navigate(["/security"]);
    }

    async goToImport(): Promise<void> {
        await this._tagsService.setFlow("import");

        this._router.navigate(["/welcome", "import"]);
    }

    // --- Referral logic (absorbed from welcome-available) ---

    private _setInvalidReferral(): void {
        this.invalidReferral = true;
        this.referralTagModel = null;

        this._invalidTimeout = setTimeout(() => {
            this.invalidReferral = false;
        }, 5000);
    }

    clearInvalidReferral(): void {
        clearTimeout(this._invalidTimeout);

        this.invalidReferral = false;
        this.referralTagModel = null;
    }

    sanitizeZelfName(): void {
        const control = this.form.get("tagName");

        if (!control) return;

        let sanitizedValue = control.value.replace(/[^a-zA-Z0-9.-]|^[^a-zA-Z]+|[.-]$/g, "");

        sanitizedValue = sanitizedValue.toUpperCase().trim();

        control.patchValue(sanitizedValue, { emitEvent: false });

        if (!sanitizedValue) control.markAsPristine();
    }

    sanitizeReferralName(): void {
        this.clearInvalidReferral();

        const referralNameCtrl = this.form.get("referralName");

        if (!referralNameCtrl) return;

        const sanitizedValue = referralNameCtrl.value
            .replace(/[^a-zA-Z0-9.-]|^[^a-zA-Z]+/g, "")
            .toLowerCase()
            .trim();

        referralNameCtrl.patchValue(sanitizedValue, { emitEvent: false });

        if (!sanitizedValue) referralNameCtrl.markAsPristine();
    }

    async searchReferralName(event: any): Promise<any> {
        const referralNameCtrl = this.form.get("referralName");

        if (!referralNameCtrl) return;

        if (!referralNameCtrl.value || referralNameCtrl.invalid) {
            this.form.patchValue({ referralName: "" });
            this.form.markAsPristine();
        }

        if (this.loading || this.loadingReferral || !referralNameCtrl?.dirty || !referralNameCtrl?.value) return;

        event.preventDefault();

        this.loadingReferral = true;

        const referralTagNameInput = referralNameCtrl.value.toLowerCase().trim();

        let referralDomain: string;
        let referralTagName: string;

        if (referralTagNameInput.includes(".")) {
            const parsedReferral = this._tagsService.parseTagName(referralTagNameInput);
            referralDomain = parsedReferral.domain;
            referralTagName = parsedReferral.name;
        } else {
            referralDomain = this.form.value.domain || "zelf";
            referralTagName = referralTagNameInput;
        }

        let captchaToken = "";

        if (!this._chromeService.isExtension) {
            try {
                const captchaKey = referralNameCtrl.value.replace(".", "_");
                captchaToken = await this._captchaService.executeRecaptcha(captchaKey);
            } catch (error) {
                console.error("reCAPTCHA failed:", error);
            }
        }

        this._tagsService
            .searchTag({
                tagName: referralTagName,
                domain: referralDomain,
                captchaToken: captchaToken,
            })
            .then((response) => {
                if (response?.data.available) {
                    this.form.patchValue({ referralName: "" });
                    this.form.markAsPristine();

                    this.loadingReferral = false;
                    this.referralTagModel = null;
                    this._setInvalidReferral();

                    return;
                }

                this.form.markAsPristine();

                const referralTagModel = this._tagsService.createTagModelFromSearchResponse(response.data);

                if (referralTagModel) {
                    this.referralTagModel = referralTagModel;
                    const refName = referralTagModel.publicData.tagName || referralTagModel.name;
                    this._tagsService.setReferral(refName);
                } else {
                    this.referralTagModel = null;
                    this._setInvalidReferral();
                }

                this.loadingReferral = false;
            })
            .catch((exception) => {
                console.error({ exception });

                this.form.patchValue({ referralName: "" });
                this.form.markAsPristine();

                this.loadingReferral = false;
                this.referralTagModel = null;
                this._setInvalidReferral();
            });
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
