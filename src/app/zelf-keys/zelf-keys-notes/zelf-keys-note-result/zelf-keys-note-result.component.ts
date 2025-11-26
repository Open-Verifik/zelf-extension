import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";

import { CopyToClipboardBase } from "app/base/copy-to-clipboard/copy-to-clipboard.base";
import { ChromeService } from "app/chrome.service";
import { DataPassingService } from "app/services/data-passing.service";
import { ZelfKeysDataService } from "app/services/zelf-keys-data.service";

@Component({
    imports: [CommonModule, TranslocoModule, RouterModule],
    selector: "zelf-keys-note-result",
    styleUrls: ["./zelf-keys-note-result.component.scss"],
    templateUrl: "./zelf-keys-note-result.component.html",
})
export class ZelfKeysNoteResultComponent extends CopyToClipboardBase implements OnInit {
    apiResult: any = null;
    error: string | null = null;
    loading = false;
    noteData: any = null;

    constructor(
        private _dataPassingService: DataPassingService,
        private _router: Router,
        private _zelfKeysDataService: ZelfKeysDataService,
        protected chromeService: ChromeService,
        protected snackBar: MatSnackBar,
        protected translocoService: TranslocoService
    ) {
        super(chromeService, snackBar, translocoService);
    }

    async ngOnInit(): Promise<void> {
        // Get API result from service
        const apiResult = this._dataPassingService.getResult("notes");

        if (apiResult) {
            await this._zelfKeysDataService.clearCache();

            this.apiResult = apiResult;
        } else {
            this.error = this._translocoService.translate("zelf_keys.note_result.error.no_result");
        }
    }

    getResultStatus(): "success" | "error" | "unknown" {
        if (this.error || this.apiResult?.error) {
            return "error";
        }
        if (this.apiResult?.success === true) {
            return "success";
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
                return this._translocoService.translate("zelf_keys.note_result.status.success_title");
            case "error":
                return this._translocoService.translate("zelf_keys.note_result.status.error_title");
            default:
                return this._translocoService.translate("zelf_keys.note_result.status.unknown_title");
        }
    }

    getStatusMessage(): string {
        switch (this.getResultStatus()) {
            case "success":
                return this._translocoService.translate("zelf_keys.note_result.status.success_message");
            case "error":
                return this.error || this._translocoService.translate("zelf_keys.note_result.status.error_message");
            default:
                return this._translocoService.translate("zelf_keys.note_result.status.unknown_message");
        }
    }

    async onBackToNotes(): Promise<void> {
        await this._dataPassingService.clearAll("notes");

        this._router.navigate(["/zelf-keys/notes"]);
    }

    async onAddAnotherNote(): Promise<void> {
        await this._dataPassingService.clearAll("notes");

        this._router.navigate(["/zelf-keys/notes/new"]);
    }

    async copyZelfProof(): Promise<void> {
        if (!this.apiResult?.zelfProof) return;

        await this._copyToClipboard(this.apiResult.zelfProof);
    }

    async copyContractAddress(): Promise<void> {
        if (!this.apiResult?.NFT?.contractAddress) return;

        await this._copyToClipboard(this.apiResult.NFT.contractAddress);
    }

    getTitle(): string {
        return this.apiResult?.ipfs?.publicData?.title || this.noteData?.title || "N/A";
    }

    getFolder(): string {
        return this.apiResult?.ipfs?.publicData?.folder || this.noteData?.folder || "N/A";
    }

    getType(): string {
        return this.apiResult?.ipfs?.publicData?.type || this.apiResult?.type || "notes";
    }

    getCategory(): string {
        return this.apiResult?.ipfs?.publicData?.category || "N/A";
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

    getIpfsHash(): string {
        return this.apiResult?.ipfs?.ipfsHash || this.apiResult?.ipfs?.ipfs_pin_hash || this.apiResult?.ipfs?.cid || "N/A";
    }

    getIpfsGatewayUrl(): string {
        return this.apiResult?.ipfs?.url || "N/A";
    }

    getIpfsFileSize(): number | null {
        return this.apiResult?.ipfs?.size || null;
    }

    getIpfsUploadTimestamp(): string | null {
        return this.apiResult?.ipfs?.date_pinned || this.apiResult?.ipfs?.created_at || null;
    }

    getWalrusBlobId(): string | null {
        return this.apiResult?.walrus?.blobId || null;
    }

    getWalrusPublicUrl(): string | null {
        return this.apiResult?.walrus?.publicUrl || null;
    }

    getWalrusExplorerUrl(): string | null {
        return this.apiResult?.walrus?.explorerUrl || null;
    }

    getWalrusSuccess(): boolean {
        return this.apiResult?.walrus?.success === true;
    }
}
