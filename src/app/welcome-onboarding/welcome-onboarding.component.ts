import { Subject, takeUntil } from "rxjs";

import { CommonModule } from "@angular/common";
import { AfterContentInit, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSelectModule } from "@angular/material/select";
import { MatDialog } from "@angular/material/dialog";
import { MatDialogModule } from "@angular/material/dialog";
import { Router, RouterLink } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";

import { swipeLeft } from "app/animations/swipe-left.animation";
import { CaptchaService } from "app/captcha.service";
import { ChromeService } from "app/chrome.service";
import { VaultService } from "app/vault.service";
import { WalletService } from "app/wallet.service";
import { ZelfNameService } from "app/zelf-name-service.service";
import { TagsService } from "app/tags.service";
import { DomainService, DomainConfig } from "app/domain.service";
import { DomainSelectionModalComponent, DomainSelectionData } from "app/domain-selection-modal/domain-selection-modal.component";

@Component({
    animations: [swipeLeft],
    imports: [
        CommonModule,
        TranslocoModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatSelectModule,
        MatDialogModule,
        RouterLink,
    ],
    selector: "welcome-onboarding",
    styleUrls: ["./welcome-onboarding.component.scss"],
    templateUrl: "./welcome-onboarding.component.html",
})
export class WelcomeOnboardingComponent implements OnInit, OnDestroy, AfterContentInit {
    private _carouselItemInterval!: ReturnType<typeof setInterval>;
    private unsubscriber$: Subject<void> = new Subject<void>();

    carouselIndex: number = 0;
    carouselProgress: number = 0;
    form!: UntypedFormGroup;
    loading: boolean = false;
    showHomeButton: boolean = false;
    domainHover: boolean = false;
    availableDomains: DomainConfig[] = [];
    loadingDomains: boolean = false;

    constructor(
        private _captchaService: CaptchaService,
        private _chromeService: ChromeService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _walletService: WalletService,
        private _vaultService: VaultService,
        private _tagsService: TagsService,
        private _domainService: DomainService,
        private _dialog: MatDialog
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

    private _clearChromeItems(): void {
        this._chromeService.removeItem("flow");
        this._chromeService.removeItem("mnemonicCount");
        this._chromeService.removeItem("newTagName");
        this._chromeService.removeItem("referralTagName");
        this._chromeService.removeItem("tagName");
        this._chromeService.removeItem("tagNameObject");
        this._chromeService.removeItem("tagNameReward");
        this._chromeService.removeItem("tagResponse");
        this._chromeService.removeItem("domain");
        this._chromeService.removeItem("network");
        this._chromeService.removeItem("zelfNameObject");
    }

    async ngOnInit(): Promise<void> {
        await this._walletService.setWalletsToColdStorage();

        this._initCarousel();
        await this._loadDomains();
    }

    async ngAfterContentInit(): Promise<void> {
        const wallets = await this._walletService.getWalletsFromStorage();

        if (wallets.length) this.showHomeButton = true;

        // Enforce default domain on initial render (prevents browser autofill overriding it)
        if (!this.form.value.domain) {
            this.form.patchValue({ domain: "zelf" }, { emitEvent: false });
        }
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

    private _initForm(): void {
        this.form = this._formBuilder.group({
            tagName: ["", [Validators.required, Validators.minLength(1), Validators.maxLength(27)]],
            domain: ["zelf", [Validators.required]],
        });
    }

    private async _existingTagName(responseData: any): Promise<void> {
        // Create TagModel from the tagObject (selected record)
        const tagModel = this._tagsService.createTagModelFromSearchResponse(responseData);

        if (!tagModel) {
            this.loading = false;
            return;
        }

        // Get the tag name from publicData (could be tagName or zelfName based on domain config)
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
                // Check if tag is available (not found)
                if (!response?.data.available) {
                    await this._existingTagName(response?.data);
                    return;
                }

                // Tag is available, proceed with registration flow
                await this._tagsService.setNewTagName(tagName);

                await this._tagsService.setDomain(domain);

                // Save the complete response data for the available page
                await this._tagsService.setTagResponse(response.data);

                // Create a basic tag object for available tags (no tagObject exists yet)
                const availableTagData = {
                    name: tagName,
                    available: true,
                    publicData: {
                        tagName: tagName,
                        domain: domain,
                        btcAddress: "",
                        ethAddress: "",
                        solanaAddress: "",
                        suiAddress: "",
                        hasPassword: "false",
                        type: "",
                        origin: "",
                        registeredAt: "",
                        expiresAt: "",
                        blockDAGAddress: "",
                        avalancheAddress: "",
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

        // Remove invalid characters, ensure it doesn't start with a number or special character and doesn't end with '.' or '-'
        let sanitizedValue = control.value.replace(/[^a-zA-Z0-9.-]|^[^a-zA-Z]+|[.-]$/g, "");

        sanitizedValue = sanitizedValue.toUpperCase().trim();

        control.patchValue(sanitizedValue, { emitEvent: false });

        if (!sanitizedValue) control.markAsPristine();
    }

    get isZelfNameEmpty(): boolean {
        const value = (this.form?.value?.tagName || "").trim();
        return value?.length === 0;
    }

    /**
     * Open domain selection modal
     */
    openDomainSelectionModal(): void {
        const dialogData: DomainSelectionData = {
            domains: this.availableDomains,
            selectedDomain: this.form.get("domain")?.value || "zelf",
        };

        const dialogRef = this._dialog.open(DomainSelectionModalComponent, {
            data: dialogData,
            width: "450px",
            maxWidth: "90vw",
            position: { bottom: "0" },
            panelClass: "domain-selection-dialog",
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.form.get("domain")?.setValue(result);
            }
        });
    }

    /**
     * Load available domains from storage first, then API
     */
    private async _loadDomains(): Promise<void> {
        this.loadingDomains = true;
        try {
            // Try to load from cache first
            const loadedFromCache = await this._loadDomainsFromCache();

            if (loadedFromCache) return; // Successfully loaded from cache

            // Cache is invalid or empty, fetch from API
            await this._loadDomainsFromAPI();
        } catch (error) {
            console.error("Error loading domains:", error);
            // Fallback to default domains if API fails
            this._loadFallbackDomains();
        } finally {
            this.loadingDomains = false;
        }
    }

    /**
     * Load fallback domains when API fails
     */
    private _loadFallbackDomains(): void {
        this.availableDomains = [
            {
                name: "zelf",
                type: "license",
                holdSuffix: ".hold",
                status: "active",
                owner: "miguel@zelf.world",
                description: "Official Zelf domain",
                features: [],
                tags: {
                    minLength: 1,
                    maxLength: 27,
                    allowedChars: {},
                    reserved: ["www", "api", "admin", "support", "help", "google"],
                    customRules: [],
                    payment: {
                        methods: ["coinbase", "crypto", "stripe"],
                        currencies: ["BTC", "ETH", "USDC", "BDAG", "ZNS", "AVAX"],
                        discounts: { yearly: 0.1, lifetime: 0.2 },
                        rewardPrice: 10,
                        whitelist: {},
                        pricingTable: {},
                    },
                    storage: {
                        keyPrefix: "zelfName",
                        ipfsEnabled: true,
                        arweaveEnabled: true,
                        walrusEnabled: true,
                        backupEnabled: false,
                    },
                },
                zelfkeys: {
                    plans: [],
                    payment: { whitelist: {}, pricingTable: {} },
                    storage: {
                        keyPrefix: "zelfKey",
                        ipfsEnabled: true,
                        arweaveEnabled: true,
                        walrusEnabled: true,
                        backupEnabled: false,
                    },
                },
                storage: {
                    keyPrefix: "zelfName",
                    ipfsEnabled: true,
                    arweaveEnabled: true,
                    walrusEnabled: true,
                    backupEnabled: false,
                },
                metadata: {
                    launchDate: "2023-01-01",
                    version: "1.0.0",
                    documentation: "https://docs.zelf.world",
                    support: "standard",
                },
            },
            {
                name: "bdag",
                type: "license",
                holdSuffix: ".hold",
                status: "active",
                owner: "miguel@zelf.world",
                description: "BDAG domain",
                features: [],
                tags: {
                    minLength: 1,
                    maxLength: 27,
                    allowedChars: {},
                    reserved: ["www", "api", "admin"],
                    customRules: [],
                    payment: {
                        methods: ["crypto"],
                        currencies: ["BDAG"],
                        whitelist: {},
                        pricingTable: {},
                    },
                    storage: {
                        keyPrefix: "bdagName",
                        ipfsEnabled: true,
                        arweaveEnabled: false,
                        walrusEnabled: false,
                        backupEnabled: false,
                    },
                },
                zelfkeys: {
                    plans: [],
                    payment: { whitelist: {}, pricingTable: {} },
                    storage: {
                        keyPrefix: "bdagKey",
                        ipfsEnabled: true,
                        arweaveEnabled: false,
                        walrusEnabled: false,
                        backupEnabled: false,
                    },
                },
                storage: {
                    keyPrefix: "bdagName",
                    ipfsEnabled: true,
                    arweaveEnabled: false,
                    walrusEnabled: false,
                    backupEnabled: false,
                },
            },
            {
                name: "avax",
                type: "license",
                holdSuffix: ".hold",
                status: "active",
                owner: "miguel@zelf.world",
                description: "AVAX domain",
                features: [],
                tags: {
                    minLength: 1,
                    maxLength: 27,
                    allowedChars: {},
                    reserved: ["www", "api", "admin"],
                    customRules: [],
                    payment: {
                        methods: ["crypto"],
                        currencies: ["AVAX"],
                        whitelist: {},
                        pricingTable: {},
                    },
                    storage: {
                        keyPrefix: "avaxName",
                        ipfsEnabled: true,
                        arweaveEnabled: false,
                        walrusEnabled: false,
                        backupEnabled: false,
                    },
                },
                zelfkeys: {
                    plans: [],
                    payment: { whitelist: {}, pricingTable: {} },
                    storage: {
                        keyPrefix: "avaxKey",
                        ipfsEnabled: true,
                        arweaveEnabled: false,
                        walrusEnabled: false,
                        backupEnabled: false,
                    },
                },
                storage: {
                    keyPrefix: "avaxName",
                    ipfsEnabled: true,
                    arweaveEnabled: false,
                    walrusEnabled: false,
                    backupEnabled: false,
                },
            },
        ];
    }

    /**
     * Load domains from cache if valid
     * @returns boolean - true if successfully loaded from cache, false otherwise
     */
    private async _loadDomainsFromCache(): Promise<boolean> {
        try {
            // Check if we have valid cached data
            const isCacheValid = await this._domainService.isCacheValid();

            if (!isCacheValid) {
                return false;
            }

            // Load from cache
            await this._domainService.loadDomainsFromStorage();
            const cachedDomains = this._domainService.getAllDomainConfigs();

            if (Object.keys(cachedDomains).length === 0) {
                return false;
            }

            // Use cached domains
            this.availableDomains = Object.values(cachedDomains);
            this.loadingDomains = false;

            // Still fetch fresh data in background for next time
            this._refreshDomainsInBackground();
            return true;
        } catch (error) {
            console.error("Error loading domains from cache:", error);
            return false;
        }
    }

    /**
     * Load domains from API
     */
    private async _loadDomainsFromAPI(): Promise<void> {
        const response = await this._domainService.getDomains();

        if (!response) throw new Error("No domains found");

        // Convert the domain map to an array for the dropdown
        this.availableDomains = Object.values(response.data);
    }

    /**
     * Refresh domains in background without affecting UI
     */
    private async _refreshDomainsInBackground(): Promise<void> {
        try {
            const response = await this._domainService.getDomains();
            if (response?.success && response.data) {
                // Update the dropdown with fresh data
                this.availableDomains = Object.values(response.data);
            }
        } catch (error) {
            console.error("Error refreshing domains in background:", error);
        }
    }
}
