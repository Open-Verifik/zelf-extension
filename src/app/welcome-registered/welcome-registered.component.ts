import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { ZelfNamePipe } from "app/pipes/zelf-name.pipe";
import { WalletModel } from "app/wallet";
import { ZelfNameService } from "app/zelf-name-service.service";
import { CopyToClipboardBase } from "app/base/copy-to-clipboard/copy-to-clipboard.base";
import { ChromeService } from "app/chrome.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    imports: [CommonModule, RouterModule, TranslocoModule, MatButtonModule, ZelfNamePipe],
    selector: "welcome-registered",
    styleUrls: ["./welcome-registered.component.scss"],
    templateUrl: "./welcome-registered.component.html",
})
export class WelcomeRegisteredComponent extends CopyToClipboardBase implements OnInit {
    qrCodeImage: string;
    zelfProof: string | undefined;
    zelfNameObject?: WalletModel;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _zelfNameService: ZelfNameService,
        public _chromeService: ChromeService,
        public _translocoService: TranslocoService,
        public _snackBar: MatSnackBar
    ) {
        super(_chromeService, _snackBar, _translocoService);

        this.qrCodeImage = "./assets/images/qr-preload.png";
    }

    async ngOnInit(): Promise<void> {
        this.zelfProof = await this._zelfNameService.getZelfProof();
        this.zelfNameObject = new WalletModel(await this._zelfNameService.getZelfNameObject());

        this.qrCodeImage = this.zelfNameObject?.image || this.qrCodeImage;

        this._changeDetectorRef.markForCheck();
    }

    async copyToClipboard(address: string): Promise<void> {
        await this._copyToClipboard(address);
    }

    async login(): Promise<void> {
        await this._zelfNameService.setFlow("unlock");

        this._router.navigate(["../../security/password"], { relativeTo: this._activatedRoute });
    }

    purchaseNow(): void {
        this._router.navigate(["/external-link"], {
            queryParams: {
                externalUrl: `https://payment.zelf.world/purchase?zelfName=${this.zelfNameObject?.publicData?.zelfName}`,
            },
        });
    }
}
