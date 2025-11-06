import { DatePipe, NgIf, NgTemplateOutlet } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { CopyToClipboardBase } from "app/base/copy-to-clipboard/copy-to-clipboard.base";
import { CaptchaService } from "app/captcha.service";
import { ChromeService } from "app/chrome.service";
import { TagModel, TagsService } from "app/tags.service";
import { ZelfNameService } from "app/zelf-name-service.service";
import { environment } from "environments/environment";

@Component({
    imports: [RouterModule, NgIf, NgTemplateOutlet, DatePipe, TranslocoModule, MatButtonModule],
    selector: "welcome-grace",
    styleUrls: ["./welcome-grace.component.scss"],
    templateUrl: "./welcome-grace.component.html",
})
export class WelcomeGraceComponent extends CopyToClipboardBase implements OnInit {
    loading: boolean = false;
    captchaToken: string | undefined;
    tagNameObject!: TagModel;
    zelfProof: string | undefined;
    tagName: string | undefined;
    domain: string | undefined;
    constructor(
        private _captchaService: CaptchaService,
        private _router: Router,
        private _zelfNameService: ZelfNameService,
        protected _chromeService: ChromeService,
        protected _translocoService: TranslocoService,
        protected _snackBar: MatSnackBar,
        private _tagsService: TagsService
    ) {
        super(_chromeService, _snackBar, _translocoService);
    }

    async ngOnInit(): Promise<void> {
        this.tagName = await this._tagsService.getTagName();

        console.log({ tagName: this.tagName });

        const tagResponse = await this._tagsService.getTagResponse();

        if (tagResponse?.tagObject) {
            this.tagNameObject = new TagModel(tagResponse?.tagObject);
        } else {
            this.tagNameObject = new TagModel();
        }

        this.zelfProof = await this._zelfNameService.getZelfProof();

        this.domain = await this._tagsService.getDomain();

        await this._queryZNS(this.tagName);
    }

    get externalUrl(): string {
        const name = this.tagNameObject?.tagName || "";
        const domain = this.tagNameObject?.domain || "zelf";
        const duration = 1;
        return `${environment.paymentDomainUrl}/portfolio/payment?tagname=${name}&domain=${domain}&duration=${duration}`;
    }

    private async _captchaGeneration(zelfName: string): Promise<any> {
        if (this._chromeService.isExtension) return;

        try {
            this.captchaToken = await this._captchaService.executeRecaptcha(zelfName.replace(".", "_"));
        } catch (error) {
            console.error("reCAPTCHA failed:", error);
        }
    }

    private async _queryZNS(zelfName: string): Promise<void> {
        try {
            await this._captchaGeneration(zelfName);

            const response = await this._tagsService.searchTag({ tagName: zelfName, domain: this.domain, captchaToken: this.captchaToken });

            if (!response.data) {
                this._router.navigate(["/welcome/available"]);

                return;
            }

            // If tag is available, it means it doesn't exist in IPFS/Arweave anymore
            // Redirect to welcome/find so user can recover it using their zelfProof
            if (response.data?.available) {
                // Ensure zelfProof is set in the service for recovery
                if (this.zelfProof) {
                    await this._tagsService.setZelfProof(this.zelfProof);
                }
                // Redirect to find page to recover the tag
                this._router.navigate(["/welcome/find"]);
                return;
            }

            const tagNameObject = new TagModel(response.data.tagObject);

            // Update the component's tagNameObject with fresh data
            if (response.data.tagObject) {
                this.tagNameObject = tagNameObject;
            }

            const isOwnedByUser = tagNameObject.zelfProof === this.tagNameObject.zelfProof;

            if (!isOwnedByUser && tagNameObject.publicData?.expiresAt && new Date(tagNameObject.publicData.expiresAt) < new Date()) {
                this._router.navigate(["/welcome/recover"]);

                return;
            }

            this.loading = false;
        } catch (error) {
            console.error({ error });

            this.loading = false;
        }
    }

    async copyToClipboard(address: string): Promise<void> {
        await this._copyToClipboard(address);
    }

    decryptZelfName(): void {
        this._tagsService.setFlow("unlock");

        this._router.navigate(["/security/password"], { queryParams: { return: "/welcome/grace" } });
    }

    renewZelfName(): void {
        const name = this.tagNameObject?.tagName || "";
        const domain = this.tagNameObject?.domain || "zelf";
        const duration = 1;
        this._router.navigate(["/external-link"], {
            queryParams: { externalUrl: `${environment.paymentDomainUrl}/portfolio/payment?tagname=${name}&domain=${domain}&duration=${duration}` },
        });
    }
}
