import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { TranslocoModule } from "@jsverse/transloco";
import { MnemonicComponent } from "../mnemonic/mnemonic.component";
import { Wallet } from "app/wallet";
import { ZelfNameService } from "app/zelf-name-service.service";
import { Router } from "@angular/router";
import { ChromeService } from "app/chrome.service";

@Component({
    selector: "private-key",
    imports: [CommonModule, TranslocoModule, MnemonicComponent],
    templateUrl: "./private-key.component.html",
    styleUrls: ["./private-key.component.scss"],
})
export class PrivateKeyComponent {
    blurMnemonic: boolean = false;
    wallet: Wallet;

    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
        private _bottomSheetRef: MatBottomSheetRef<PrivateKeyComponent>,
        private _chromeService: ChromeService,
        private _router: Router,
        private _zelfNameService: ZelfNameService
    ) {
        this.wallet = data.wallet;
    }

    close(): void {
        this._bottomSheetRef.dismiss();
    }

    async onMnemonicRedirect(): Promise<void> {
        await this._chromeService.setItem("parameters", { openPrivateKeyBottomSheet: true });

        await this._zelfNameService.setFlow("unlock");
        await this._zelfNameService.setZelfName(this.wallet?.publicData?.zelfName as string);

        this.close();

        this._router.navigate(["/security/biometrics"], { queryParams: { return: "/wallet" } });
    }
}
