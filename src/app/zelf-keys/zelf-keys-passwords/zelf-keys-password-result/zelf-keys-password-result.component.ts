import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";

import { CopyToClipboardBase } from "app/base/copy-to-clipboard/copy-to-clipboard.base";
import { ChromeService } from "app/chrome.service";
import { DataPassingService } from "app/services/data-passing.service";
import { ZelfKeysService } from "app/services/zelf-keys.service";
import { ZelfKeysDataService } from "app/services/zelf-keys-data.service";
import { ZelfKeyPasswordResult } from "app/models/zelf-key-item.model";

@Component({
    imports: [CommonModule, TranslocoModule, RouterModule],
    selector: "zelf-keys-password-result",
    styleUrls: ["./zelf-keys-password-result.component.scss"],
    templateUrl: "./zelf-keys-password-result.component.html",
})
export class ZelfKeysPasswordResultComponent extends CopyToClipboardBase implements OnInit {
    apiResult: ZelfKeyPasswordResult | null = null;
    passwordData: any | null = null;
    loading = true;

    constructor(
        private dataPassingService: DataPassingService,
        private router: Router,
        private zelfKeysDataService: ZelfKeysDataService,
        protected chromeService: ChromeService,
        protected snackBar: MatSnackBar,
        protected translocoService: TranslocoService
    ) {
        super(chromeService, snackBar, translocoService);
    }

    async ngOnInit(): Promise<void> {
        const apiResult = this.dataPassingService.getResult("passwords");

        if (apiResult && this._isValidZelfKeyPasswordResult(apiResult)) {
            await this.zelfKeysDataService.clearCache();

            this.apiResult = apiResult;
        } else {
            // Handle error case - create a minimal error result
            this.apiResult = null;
        }

        const passwordData = this.dataPassingService.getData("passwords");

        if (passwordData) this.passwordData = passwordData;

        this.loading = false;
    }

    private _isValidZelfKeyPasswordResult(data: any): data is ZelfKeyPasswordResult {
        return (
            data &&
            typeof data === "object" &&
            "ipfs" in data &&
            "walrus" in data &&
            "type" in data &&
            "message" in data &&
            typeof data.ipfs === "object" &&
            typeof data.walrus === "object"
        );
    }

    async onBackToPasswords(): Promise<void> {
        await this.dataPassingService.clearAll("passwords");

        this.router.navigate(["/zelf-keys/passwords"]);
    }

    async onAddAnotherPassword(): Promise<void> {
        await this.dataPassingService.clearAll("passwords");

        this.router.navigate(["/zelf-keys/passwords/new"]);
    }

    async copyZelfProof(): Promise<void> {
        if (!this.apiResult?.zelfProof) return;

        await this._copyToClipboard(this.apiResult.zelfProof);
    }

    async copyZelfProofQRCode(): Promise<void> {
        if (!this.apiResult?.zelfProofQRCode) return;

        await this._copyToClipboard(this.apiResult.zelfProofQRCode);
    }

    async copyIpfsId(): Promise<void> {
        if (!this.apiResult?.ipfs?.id) return;

        await this._copyToClipboard(this.apiResult.ipfs.id);
    }

    async copyIpfsUrl(): Promise<void> {
        if (!this.apiResult?.ipfs?.url) return;

        await this._copyToClipboard(this.apiResult.ipfs.url);
    }

    getResultStatus(): "success" | "error" | "unknown" {
        if (!this.apiResult) return "error";

        // Check if IPFS storage was successful
        if (this.apiResult.ipfs?.saved === true && this.apiResult.ipfs?.pinned === true) {
            return "success";
        }

        // Check for error messages
        if (this.apiResult.walrus?.error || this.apiResult.message?.toLowerCase().includes("error")) {
            return "error";
        }

        return "unknown";
    }

    getStatusIcon(): string {
        switch (this.getResultStatus()) {
            case "success":
                return "check_circle";
            case "error":
                return "error";
            default:
                return "help";
        }
    }

    getStatusTitle(): string {
        switch (this.getResultStatus()) {
            case "success":
                return this._translocoService.translate("zelf_keys.password_result.status.success_title");
            case "error":
                return this._translocoService.translate("zelf_keys.password_result.status.error_title");
            default:
                return this._translocoService.translate("zelf_keys.password_result.status.unknown_title");
        }
    }

    getStatusMessage(): string {
        switch (this.getResultStatus()) {
            case "success":
                return this._translocoService.translate("zelf_keys.password_result.status.success_message");
            case "error":
                return this._translocoService.translate("zelf_keys.password_result.status.error_message");
            default:
                return this._translocoService.translate("zelf_keys.password_result.status.unknown_message");
        }
    }

    getWebsite(): string {
        if (this.apiResult?.ipfs?.publicData?.website) return this.apiResult.ipfs.publicData.website;
        if (this.passwordData?.url) return this.passwordData.url;

        return "N/A";
    }

    getUsername(): string {
        if (this.apiResult?.ipfs?.publicData?.username) return this.apiResult.ipfs.publicData.username;
        if (this.passwordData?.email) return this.passwordData.email;

        return "N/A";
    }

    getType(): string {
        return this.apiResult?.ipfs?.publicData?.type || this.apiResult?.type || "password";
    }

    getCategory(): string | null {
        const category = this.apiResult?.ipfs?.publicData?.category;

        return ZelfKeysService.parseCategory(category);
    }

    getCategoryTranslationKey(): string | null {
        const category = this.getCategory();

        return category ? `zelf_keys.categories.${category}` : null;
    }

    getZelfName(): string {
        return this.apiResult?.ipfs?.publicData?.keyOwner || this.apiResult?.ipfs?.name || "N/A";
    }

    getTimestamp(): string {
        if (this.apiResult?.ipfs?.publicData?.timestamp) {
            return this.apiResult.ipfs.publicData.timestamp;
        }

        if (this.apiResult?.ipfs?.date_pinned) {
            return this.apiResult.ipfs.date_pinned;
        }

        return "";
    }

    async copyContractAddress(): Promise<void> {
        if (!this.apiResult?.NFT?.contractAddress) return;

        await this._copyToClipboard(this.apiResult.NFT.contractAddress);
    }
}
