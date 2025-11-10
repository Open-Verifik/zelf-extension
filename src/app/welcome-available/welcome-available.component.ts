import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";
import { CaptchaService } from "app/captcha.service";
import { ChromeService } from "app/chrome.service";
import { DiscountType } from "app/pipes/discount.pipe";
import { ZelfNamePipe } from "app/pipes/zelf-name.pipe";
import { TagsService, TagModel, TagSearchResponse } from "app/tags.service";
import { WelcomeAvailableContentComponent } from "./welcome-available-content.component";

@Component({
    imports: [
        CommonModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        RouterModule,
        TranslocoModule,
        WelcomeAvailableContentComponent,
        ZelfNamePipe,
    ],
    selector: "welcome-available",
    styleUrls: ["./welcome-available.component.scss"],
    templateUrl: "./welcome-available.component.html",
})
export class WelcomeAvailableComponent implements OnInit, OnDestroy {
    private _invalidTimeout!: ReturnType<typeof setTimeout>;

    discount: number = 0;
    discountType: DiscountType = "";
    form!: UntypedFormGroup;
    loading: boolean = false;
    loadingReferral: boolean = false;
    invalidReferral: boolean = false;
    tagName: string = "";
    domain: string = "";
    tagModel: TagModel | null = null;
    tagResponse: TagSearchResponse | null = null;
    referralTagModel: TagModel | null = null;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _captchaService: CaptchaService,
        private _chromeService: ChromeService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _tagsService: TagsService
    ) {
        this._initForm();
    }

    async ngOnInit(): Promise<void> {
        // Load tag data from localStorage (saved from search)
        this.tagName = await this._tagsService.getNewTagName();
        this.domain = await this._tagsService.getDomain();
        this.tagModel = await this._tagsService.getTagNameObject();
        this.tagResponse = await this._tagsService.getTagResponse();
    }

    ngOnDestroy(): void {
        clearTimeout(this._invalidTimeout);
    }

    private _initForm(): void {
        this.form = this._formBuilder.group({
            referralName: ["", Validators.maxLength(32)],
            termsAndConditions: [false, Validators.requiredTrue],
        });
    }

    private _setInvalidReferral(): void {
        this.invalidReferral = true;
        this.referralTagModel = null; // Clear referral model when invalid

        this._invalidTimeout = setTimeout(() => {
            this.invalidReferral = false;
        }, 5000);
    }

    clearInvalidReferral(): void {
        clearTimeout(this._invalidTimeout);

        this.invalidReferral = false;
        this.referralTagModel = null; // Clear referral model when manually cleared
    }

    async goToImport(): Promise<void> {
        await this._tagsService.setFlow("import");

        this._router.navigate(["../import"], { relativeTo: this._activatedRoute });
    }

    async goToSecurity(): Promise<void> {
        await this._tagsService.setFlow("create");

        this._router.navigate(["../../security"], { relativeTo: this._activatedRoute });
    }

    sanitizeZelfName(): void {
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

    async searchZelfName(event: any): Promise<any> {
        const referralNameCtrl = this.form.get("referralName");

        if (!referralNameCtrl) return;

        if (!referralNameCtrl.value || referralNameCtrl.invalid) {
            this.form.patchValue({ zelfName: "" });
            this.form.markAsPristine();
        }

        if (this.loading || this.loadingReferral || !referralNameCtrl?.dirty || !referralNameCtrl?.value) return;

        event.preventDefault();

        this.loadingReferral = true;

        // Parse domain from referral tag name (if included) or use current domain
        const referralTagNameInput = referralNameCtrl.value.toLowerCase().trim();

        // If input contains a dot, parse it; otherwise use current domain
        let referralDomain: string;
        let referralTagName: string;

        if (referralTagNameInput.includes(".")) {
            // User provided domain in the tag name (e.g., "alice.zelf")
            const parsedReferral = this._tagsService.parseTagName(referralTagNameInput);
            referralDomain = parsedReferral.domain;
            referralTagName = parsedReferral.name;
        } else {
            // No domain provided, use the current domain context
            referralDomain = this.tagModel?.publicData?.domain || "zelf";
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
                // If tag is available (not found), it's invalid as referral
                if (response?.data.available) {
                    this.form.patchValue({ referralName: "" });
                    this.form.markAsPristine();

                    this.loadingReferral = false;
                    this.referralTagModel = null;
                    this._setInvalidReferral();

                    return;
                }

                this.form.markAsPristine();

                // Create TagModel from the found referral tag
                const referralTagModel = this._tagsService.createTagModelFromSearchResponse(response.data);

                if (referralTagModel) {
                    // Store the referral tag model so it can be displayed in the UI
                    this.referralTagModel = referralTagModel;

                    // Get the referral tag name from publicData (tagName or zelfName based on domain config)
                    const referralTagName = referralTagModel.publicData.tagName || referralTagModel.name;
                    this._tagsService.setReferral(referralTagName);
                } else {
                    // If model creation failed, mark as invalid
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
}
