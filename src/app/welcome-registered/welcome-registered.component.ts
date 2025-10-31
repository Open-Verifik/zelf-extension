import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { TagsService, TagModel, TagSearchResponse } from "app/tags.service";
import { CopyToClipboardBase } from "app/base/copy-to-clipboard/copy-to-clipboard.base";
import { ChromeService } from "app/chrome.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { environment } from "environments/environment";

@Component({
    imports: [CommonModule, RouterModule, TranslocoModule, MatButtonModule],
    selector: "welcome-registered",
    styleUrls: ["./welcome-registered.component.scss"],
    templateUrl: "./welcome-registered.component.html",
})
export class WelcomeRegisteredComponent extends CopyToClipboardBase implements OnInit {
    qrCodeImage: string;
    zelfProof: string | undefined;
    tagModel?: TagModel;
    tagResponse?: TagSearchResponse;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _tagsService: TagsService,
        public _chromeService: ChromeService,
        public _translocoService: TranslocoService,
        public _snackBar: MatSnackBar
    ) {
        super(_chromeService, _snackBar, _translocoService);

        this.qrCodeImage = "./assets/images/qr-preload.png";
    }

    async ngOnInit(): Promise<void> {
        // Load tag data from the new TagsService
        this.zelfProof = await this._tagsService.getZelfProof();

        const tagData = await this._tagsService.getTagNameObject();

        this.tagResponse = (await this._tagsService.getTagResponse()) || undefined;

        // Create TagModel if we have tag data
        if (tagData) {
            this.tagModel = tagData instanceof TagModel ? tagData : new TagModel(tagData);
        }

        this.qrCodeImage = this.tagModel?.image || this.qrCodeImage;

        this._changeDetectorRef.markForCheck();
    }

    async copyToClipboard(address: string): Promise<void> {
        await this._copyToClipboard(address);
    }

    async login(): Promise<void> {
        await this._tagsService.setFlow("unlock");

        this._router.navigate(["../../security/password"], { relativeTo: this._activatedRoute });
    }

    purchaseNow(): void {
        const name = this.tagModel?.tagName || "";
        const domain = this.tagModel?.domain || "zelf";
        const duration = 1;
        this._router.navigate(["/external-link"], {
            queryParams: {
                externalUrl: `${environment.paymentDomainUrl}/portfolio/payment?tagname=${name}&domain=${domain}&duration=${duration}`,
            },
        });
    }
}
