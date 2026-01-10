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
        let apiResult: any = this.dataPassingService.getResult("passwords");

        // Handle case where result might be wrapped in 'data' property
        if (apiResult && "data" in apiResult && typeof apiResult.data === "object") {
            apiResult = apiResult.data;
        }

        if (apiResult && this._isValidZelfKeyPasswordResult(apiResult)) {
            await this.zelfKeysDataService.clearCache();

            this.apiResult = apiResult as ZelfKeyPasswordResult;
        }

        const passwordData = this.dataPassingService.getData("passwords");

        if (passwordData) this.passwordData = passwordData;

        this.loading = false;
    }

    private _isValidZelfKeyPasswordResult(data: any): data is ZelfKeyPasswordResult {
        if (!data || typeof data !== "object") {
            return false;
        }

        // Must have type and message
        if (!("type" in data) || !("message" in data)) {
            return false;
        }

        // At least one storage method should be present (or zelfProof which indicates success)
        const hasStorageMethod =
            ("ipfs" in data && typeof data.ipfs === "object") ||
            ("walrus" in data && typeof data.walrus === "object") ||
            ("arweave" in data && typeof data.arweave === "object") ||
            "zelfProof" in data; // zelfProof indicates successful storage

        return hasStorageMethod;
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

        // Check if message indicates success (highest priority check)
        const message = this.apiResult.message?.toLowerCase() || "";
        if (message.includes("success") || message.includes("stored successfully")) {
            return "success";
        }

        // Check if at least one storage method succeeded
        // Success if: IPFS saved & pinned, OR Walrus success, OR Arweave success, OR general success flag
        const ipfsSuccess = this.apiResult.ipfs?.saved === true && this.apiResult.ipfs?.pinned === true;
        const walrusSuccess = (this.apiResult.walrus as any)?.success === true;
        const arweaveSuccess = (this.apiResult as any).arweave?.success === true;
        const generalSuccess = (this.apiResult as any).success === true;

        // If we have zelfProof, that's a strong indicator of success
        const hasZelfProof = !!this.apiResult.zelfProof;

        if (ipfsSuccess || walrusSuccess || arweaveSuccess || generalSuccess || hasZelfProof) {
            return "success";
        }

        // Only return error if:
        // 1. Message explicitly contains "error" AND
        // 2. ALL present storage methods failed (missing storage methods don't count as failures)
        const hasExplicitError = message.includes("error") && !message.includes("success");

        if (hasExplicitError) {
            // Check if all present storage methods failed
            const ipfsPresent = !!this.apiResult.ipfs;
            const walrusPresent = !!(this.apiResult.walrus as any) && !(this.apiResult.walrus as any)?.skipped;
            const arweavePresent = !!(this.apiResult as any).arweave;

            const allPresentMethodsFailed =
                (!ipfsPresent || !ipfsSuccess) && (!walrusPresent || !walrusSuccess) && (!arweavePresent || !arweaveSuccess);

            if (allPresentMethodsFailed) {
                return "error";
            }
        }

        // Default to unknown if we can't determine
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

    getIpfsId(): string {
        return this.apiResult?.ipfs?.id || "N/A";
    }

    getIpfsUrl(): string {
        return this.apiResult?.ipfs?.url || "N/A";
    }

    getIpfsHash(): string {
        return this.apiResult?.ipfs?.ipfsHash || this.apiResult?.ipfs?.ipfs_pin_hash || this.apiResult?.ipfs?.cid || "N/A";
    }

    getIpfsFileSize(): number | null {
        return this.apiResult?.ipfs?.size || null;
    }

    getIpfsUploadTimestamp(): string | null {
        return this.apiResult?.ipfs?.date_pinned || this.apiResult?.ipfs?.created_at || null;
    }
}
