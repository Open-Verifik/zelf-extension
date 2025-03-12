import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";
import { ZelfNamePipe } from "app/pipes/zelf-name.pipe";
import { Wallet, WalletModel } from "app/wallet";
import { ZelfNameService } from "app/zelf-name-service.service";

@Component({
    selector: "welcome-registered",
    standalone: true,
    imports: [CommonModule, RouterModule, TranslocoModule, MatButtonModule, ZelfNamePipe],
    templateUrl: "./welcome-registered.component.html",
    styleUrls: ["./welcome-registered.component.scss"],
})
export class WelcomeRegisteredComponent implements OnInit {
    zelfNameObject?: Wallet;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _zelfNameService: ZelfNameService
    ) {}

    async ngOnInit(): Promise<void> {
        this.zelfNameObject = new WalletModel(await this._zelfNameService.getZelfNameObject());

        this._changeDetectorRef.markForCheck();
    }

    async login(): Promise<void> {
        await this._zelfNameService.setFlow("unlock");

        this._router.navigate(["../../security/password"], { relativeTo: this._activatedRoute });
    }

    purchaseNow(): void {
        this._router.navigate(["/external-link"], {
            queryParams: { externalUrl: `https://payment.zelf.world/purchase?zelfName=${this.zelfNameObject?.publicData.zelfName}` },
        });
    }
}
