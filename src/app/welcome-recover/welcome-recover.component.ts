import { DatePipe, NgClass, NgIf, NgTemplateOutlet } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";

import { TagModel, TagsService } from "app/tags.service";
import { WalletService } from "app/wallet.service";

@Component({
    imports: [
        DatePipe,
        MatButtonModule,
        MatProgressSpinnerModule,
        NgClass,
        NgIf,
        NgTemplateOutlet,
        ReactiveFormsModule,
        RouterModule,
        TranslocoModule,
    ],
    selector: "welcome-recover",
    styleUrls: ["./welcome-recover.component.scss"],
    templateUrl: "./welcome-recover.component.html",
})
export class WelcomeRecoverComponent implements OnInit {
    captchaToken: string = "";
    form!: UntypedFormGroup;
    termsForm!: UntypedFormGroup;
    loading: boolean = false;
    showError: boolean = false;
    searching: boolean = false;
    showResult: boolean = false;
    showSearch: boolean = false;
    zelfName: string = "";
    oldZelfNameObject: any;
    newZelfNameObject: any;

    constructor(
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _walletService: WalletService,
        private _tagsService: TagsService
    ) {
        this._initForm();
    }

    async ngOnInit(): Promise<void> {
        const tagNameObject = await this._tagsService.getTagNameObject();

        if (!tagNameObject) {
            this._router.navigate(["/welcome/find"]);

            return;
        }

        this.oldZelfNameObject = new TagModel(tagNameObject);
    }

    private _initForm(): void {
        this.form = this._formBuilder.group({
            zelfName: ["", [Validators.required, Validators.pattern(this._walletService.TagRegexNoPostfix)]],
        });

        this.termsForm = this._formBuilder.group({
            termsAndConditions: [false, Validators.requiredTrue],
        });
    }

    private async _queryForZelfObject(query: string): Promise<any> {
        this.searching = true;

        try {
            const zelfNameObject = await this._queryZNS("zelfName", query);

            if (!zelfNameObject?.available) {
                this._setError();

                return zelfNameObject;
            }

            this.showSearch = false;

            this.showResult = true;

            const newTagNameObject = new TagModel(zelfNameObject);

            return newTagNameObject;
        } catch (error) {
            this._setError();
        } finally {
            this.searching = false;
        }
    }

    async _queryZNS(key: string, value: string): Promise<any> {
        const tagName = value.split(".")[0];

        const domain = value.split(".")[1] || "zelf";

        try {
            const response = await this._tagsService.searchTag({ tagName, captchaToken: this.captchaToken, domain });

            if (!response.data || response.data.available) {
                return new TagModel({ name: value, available: true });
            }

            const tagObject = response.data.tagObject;

            const tagNameObject = new TagModel({ ...tagObject, name: value, domain });

            this.loading = false;

            return tagNameObject;
        } catch (error) {
            this._setError();

            console.error({ error });

            this.loading = false;

            return null;
        }
    }

    private _setError(): void {
        this.showSearch = false;
        this.showResult = true;
        this.showError = true;
    }

    async pastedZelfName(event: ClipboardEvent): Promise<void> {
        event.preventDefault();

        event.stopPropagation();

        if (this.searching) return;

        const query = event.clipboardData?.getData("text");

        if (!query) return;

        if (!this._walletService.TagRegexNoPostfix.test(query)) return;

        this.form.patchValue({ zelfName: query });

        this.newZelfNameObject = await this._queryForZelfObject(query);
    }

    returnToForm(): void {
        this.form.patchValue({ zelfName: "" }, { emitEvent: false });
        this.form.markAsPristine();

        this.showSearch = true;
        this.showResult = false;
        this.showError = false;
        this.newZelfNameObject = null;
    }

    async searchZelfName(): Promise<void> {
        if (this.searching || this.form.invalid) return;

        const query = this.form.value.zelfName;

        if (!query) return;

        this.newZelfNameObject = await this._queryForZelfObject(query);
    }

    async startReservation(): Promise<void> {
        await this._tagsService.setNewTagName(this.newZelfNameObject?.name || this.form.value.zelfName);

        await this._tagsService.setDomain(this.newZelfNameObject?.domain);

        await this._tagsService.setFlow("recover");

        this._router.navigate(["/security/password"], { queryParams: { return: "/welcome/recover" } });
    }
}
