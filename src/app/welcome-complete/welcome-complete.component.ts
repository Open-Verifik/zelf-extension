import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";

import { ChromeService } from "app/chrome.service";
import { MnemonicComponent } from "../mnemonic/mnemonic.component";
import { WalletService } from "app/wallet.service";
import { VaultService } from "app/vault.service";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";
import { TagModel, TagsService } from "app/tags.service";
import { TagFlow } from "app/tags.service";

@Component({
    imports: [TranslocoModule, CommonModule, RouterModule, MatButtonModule, MnemonicComponent, ZelfLoaderComponent],
    selector: "welcome-complete",
    styleUrls: ["./welcome-complete.component.scss"],
    templateUrl: "./welcome-complete.component.html",
})
export class WelcomeCompleteComponent implements OnInit, OnDestroy {
    flow: TagFlow = "";
    loading: boolean = true;
    isExtension: boolean = false;
    wallet: Partial<TagModel> | null = {};

    constructor(
        private _chromeService: ChromeService,
        private _router: Router,
        private _vaultService: VaultService,
        private _walletService: WalletService,
        private _tagsService: TagsService
    ) {
        this.isExtension = this._chromeService.isExtension;

        this._chromeService.removeItem("referralTagName");

        this._chromeService.removeItem("tagObject");
    }

    async ngOnInit(): Promise<void> {
        await this._walletService.removeDuplicateWalletsInStorage();

        this.wallet = await this._walletService.getCurrentWallet();

        this.flow = await this._tagsService.getFlow();

        this.loading = false;
    }

    ngOnDestroy(): void {
        this._vaultService.mnemonic = "";
    }

    complete(): void {
        this._vaultService.password = "";

        this._chromeService.removeItem("tagName");
        this._chromeService.removeItem("zelfPrice");
        this._chromeService.removeItem("zelfReward");
    }

    downloadQRCode(): void {
        const link = document.createElement("a");

        link.href = this.wallet?.image as string;

        link.download = `zelfproof_${this.wallet?.fullTagName}.png`;

        link.click();
    }

    async onMnemonicUnlock(): Promise<void> {
        await this._tagsService.setFlow("unlock");

        await this._tagsService.setTagName(this.wallet?.name as string);

        this._router.navigate(["/security/biometrics"], { queryParams: { return: "/welcome/complete" } });
    }

    /**
     * Calculate font size based on tag name length
     * Gradual reduction to ensure text fits within the container
     * Max length: 27 chars (tag) + 10 chars (domain) = 37 chars
     */
    getTagNameFontSize(): string {
        const fullTagName = this.wallet?.fullTagName || "";
        const length = fullTagName.length;

        // Gradual font size reduction based on text length
        if (length <= 15) {
            return "32px"; // Base size
        } else if (length <= 20) {
            return "22px";
        } else if (length <= 25) {
            return "20px";
        } else if (length <= 30) {
            return "16px";
        } else if (length <= 35) {
            return "14px";
        } else {
            return "12px"; // Minimum size for very long names
        }
    }

    /**
     * Calculate line height based on tag name length
     * Proportional to font size for proper text rendering
     */
    getTagNameLineHeight(): string {
        const fullTagName = this.wallet?.fullTagName || "";
        const length = fullTagName.length;

        // Line height proportional to font size (ratio ~1.25)
        if (length <= 15) {
            return "40px"; // Base line-height (matches CSS)
        } else if (length <= 20) {
            return "35px";
        } else if (length <= 25) {
            return "30px";
        } else if (length <= 30) {
            return "25px";
        } else if (length <= 35) {
            return "23px";
        } else {
            return "20px"; // Minimum line-height
        }
    }
}
