import { TranslocoModule } from "@jsverse/transloco";

import { Component, Inject } from "@angular/core";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { Router } from "@angular/router";

import { ChromeService } from "app/chrome.service";
import { WalletService } from "app/wallet.service";
import { ZelfNameService } from "app/zelf-name-service.service";

@Component({
    imports: [TranslocoModule],
    selector: "my-arns",
    styleUrls: ["./my-arns.component.scss"],
    templateUrl: "./my-arns.component.html",
})
export class MyArNSComponent {
    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
        private _bottomSheetRef: MatBottomSheetRef<MyArNSComponent>,
        private _chromeService: ChromeService,
        private _router: Router,
        private _walletService: WalletService,
        private _zelfNameService: ZelfNameService
    ) {}

    cancel(): void {
        this._bottomSheetRef.dismiss();
    }

    async close(): Promise<void> {
        const wallet = await this._walletService.getCurrentWallet();

        if (wallet?.publicData?.zelfName) {
            const url = this._zelfNameService.generateArNS(wallet.publicData.zelfName);

            this._router.navigate(["/external-link"], { queryParams: { externalUrl: url } });
        }

        this._bottomSheetRef.dismiss();
    }

    async dontShowAgain(): Promise<void> {
        await this._chromeService.setItem("myArnsDontShowAgain", true);

        await this.close();
    }
}
