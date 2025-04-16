import { DatePipe, NgIf, NgTemplateOutlet } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";
import { CaptchaService } from "app/captcha.service";
import { ChromeService } from "app/chrome.service";
import { ZelfNamePipe } from "app/pipes/zelf-name.pipe";
import { WalletModel } from "app/wallet";
import { ZelfNameService } from "app/zelf-name-service.service";

@Component({
    imports: [RouterModule, NgIf, NgTemplateOutlet, DatePipe, ZelfNamePipe, TranslocoModule, MatButtonModule],
    selector: "welcome-grace",
    standalone: true,
    styleUrls: ["./welcome-grace.component.scss"],
    templateUrl: "./welcome-grace.component.html",
})
export class WelcomeGraceComponent implements OnInit {
    loading: boolean = false;
    captchaToken: string | undefined;
    zelfNameObject!: WalletModel;
    zelfProof: string | undefined;
    zelfName: string | undefined;

    constructor(
        private _chromeService: ChromeService,
        private _captchaService: CaptchaService,
        private _router: Router,
        private _zelfNameService: ZelfNameService
    ) {}

    async ngOnInit(): Promise<void> {
        this.zelfName = await this._zelfNameService.getZelfName();
        this.zelfNameObject = new WalletModel(await this._zelfNameService.getZelfNameObject());
        this.zelfProof = await this._zelfNameService.getZelfProof();

        await this._queryZNS(this.zelfName!);
    }

    get externalUrl(): string {
        return `https://payment.zelf.world/purchase?zelfName=${this.zelfNameObject?.publicData?.zelfName}`;
    }

    private async _captchaGeneration(zelfName: string): Promise<any> {
        if (this._chromeService.isExtension) return;

        try {
            this.captchaToken = await this._captchaService.executeRecaptcha(zelfName);
        } catch (error) {
            console.error("reCAPTCHA failed:", error);
        }
    }

    private async _queryZNS(zelfName: string): Promise<void> {
        try {
            await this._captchaGeneration(zelfName);

            const response = await this._zelfNameService.searchZelfNameV2("zelfName", zelfName, this.captchaToken);

            if (!response.data) {
                this._router.navigate(["/welcome/available"]);

                return;
            }

            const zelfNameObject = new WalletModel(response.data.ipfs?.length ? response.data.ipfs[0] : response.data.arweave[0]);
            const isOwnedByUser = zelfNameObject.zelfProof === this.zelfNameObject.zelfProof;

            if (!isOwnedByUser && zelfNameObject.publicData?.isExpired) {
                this._router.navigate(["/welcome/recover"]);

                return;
            }

            this.loading = false;
        } catch (error) {
            console.error({ error });

            this.loading = false;
        }
    }

    decryptZelfName(): void {
        this._zelfNameService.setFlow("unlock");

        this._router.navigate(["/security/password"], { queryParams: { return: "/welcome/grace" } });
    }

    renewZelfName(): void {
        this._zelfNameService.setFlow("renew");

        this._router.navigate(["/security/password"], { queryParams: { return: "/welcome/grace" } });
    }
}
