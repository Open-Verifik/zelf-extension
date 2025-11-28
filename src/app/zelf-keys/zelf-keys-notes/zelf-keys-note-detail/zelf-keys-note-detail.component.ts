import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { Subject, takeUntil } from "rxjs";

import { CopyToClipboardBase } from "app/base/copy-to-clipboard/copy-to-clipboard.base";
import { ChromeService } from "../../../chrome.service";
import { DecryptedNoteData, NoteItem } from "../../../models/zelf-key-item.model";
import { PopoutDecryptorComponent } from "../../../popout-decryptor/popout-decryptor.component";
import { NoteDataService } from "../../../services/note-data.service";
import { PopoutCommunicationService, PopoutDecryptionResult } from "../../../services/popout-communication.service";
import { ScrollToSectionService } from "../../../services/scroll-to-section.service";

@Component({
    imports: [CommonModule, TranslocoModule, RouterModule, PopoutDecryptorComponent],
    selector: "zelf-keys-note-detail",
    styleUrls: ["./zelf-keys-note-detail.component.scss"],
    templateUrl: "./zelf-keys-note-detail.component.html",
})
export class ZelfKeysNoteDetailComponent extends CopyToClipboardBase implements OnInit, OnDestroy {
    private _destroy$ = new Subject<void>();

    decryptedData: DecryptedNoteData | null = null;
    decrypting = false;
    error: string | null = null;
    isPopout = false;
    loading = false;
    note: NoteItem | null = null;
    showBiometrics = false;
    showPopoutDecryptor = false;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _noteDataService: NoteDataService,
        private _popoutCommunicationService: PopoutCommunicationService,
        private _router: Router,
        private _scrollToSectionService: ScrollToSectionService,
        protected _chromeService: ChromeService,
        protected _snackBar: MatSnackBar,
        protected _translocoService: TranslocoService
    ) {
        super(_chromeService, _snackBar, _translocoService);

        this.isPopout = this._chromeService.isPopout;

        this._initSubscriptions();
    }

    async ngOnInit(): Promise<void> {
        this.loadNoteData();
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();

        this._popoutCommunicationService.clearDecryptionData();
        this._popoutCommunicationService.clearDecryptionResult();

        chrome.runtime.onMessage.removeListener(this._handleDecryptionResultListener);
    }

    private async loadNoteData(): Promise<void> {
        this.loading = true;
        this.error = null;

        try {
            const noteData = this._noteDataService.getCurrentNote();

            if (!noteData) {
                this.error = this._translocoService.translate("zelf_keys.notes.detail.error.not_found");
                return;
            }

            this.note = noteData;
        } catch (error) {
            console.error("Error loading note data:", error);
            this.error = this._translocoService.translate("zelf_keys.notes.detail.error.load_failed");
        } finally {
            this.loading = false;
        }
    }

    async onDecryptClick(): Promise<void> {
        if (this.decryptedData) {
            this._scrollToSectionService.scrollToSection("note-decrypted-content", "note");
            return;
        }

        if (this.isPopout) {
            this.showPopoutDecryptor = true;
            this._setDecryptionDataForService();
            return;
        }

        const isPopoutOpen = await this._popoutCommunicationService.isPopoutOpen();
        const payload = this.decryptionPayload;

        if (isPopoutOpen) {
            await this._popoutCommunicationService.redirectPopout("popout-decryptor", payload);
        } else {
            await this._popoutCommunicationService.openPopout("popout-decryptor", payload);
        }

        chrome.runtime.onMessage.addListener(this._handleDecryptionResultListener);
    }

    handleDecryptionResult(data: any): void {
        if (!data) return;

        const title = data.title || this.note?.publicData?.title || this._translocoService.translate("zelf_keys.notes.detail.no_title");

        let content = data.content || this._translocoService.translate("zelf_keys.notes.detail.no_content");

        if (typeof content === "string" && content.trim().startsWith("-----BEGIN PGP MESSAGE-----")) {
            this.error = this._translocoService.translate("zelf_keys.notes.detail.error.decrypt_failed");

            return;
        }

        this.decryptedData = {
            title,
            content,
            folder: this.note?.publicData?.folder || this._translocoService.translate("zelf_keys.common.no_folder"),
        };

        this._changeDetectorRef.detectChanges();

        setTimeout(() => {
            this._scrollToSectionService.scrollToSection("note-decrypted-content", "note");
        }, 500);
    }

    get decryptionPayload(): any {
        if (!this.note) return null;

        return {
            requestId: this.note.id,
            type: "notes",
            zelfProof: (this.note as any).zelfProof || this.note.publicData?.zelfProof || "",
            publicData: {
                title: this.note.publicData?.title || "Note",
                website: "Note",
            },
        };
    }

    private _handleDecryptionResultListener = (message: any) => {
        if (message.type === "DECRYPTION_RESULT_FROM_POPOUT" && this.note?.id === message.payload?.requestId) {
            this.handleDecryptionResult(message.payload?.result?.data);

            chrome.runtime.onMessage.removeListener(this._handleDecryptionResultListener);
        }

        return true;
    };

    private _initSubscriptions(): void {
        this._chromeService.isPopout$.pipe(takeUntil(this._destroy$)).subscribe((isPopout: boolean) => {
            this.isPopout = isPopout;
        });

        this._popoutCommunicationService.decryptionResult$.pipe(takeUntil(this._destroy$)).subscribe((result: PopoutDecryptionResult | null) => {
            if (!result?.success || !this.showPopoutDecryptor) return;

            this.handleDecryptionResult(result.data);
            this.showPopoutDecryptor = false;
        });
    }

    private _setDecryptionDataForService(): void {
        if (!this.isPopout) return;

        this._popoutCommunicationService.setDecryptionData(this.decryptionPayload);
    }

    onBackToList(): void {
        this._noteDataService.clearCurrentNote();
        this._router.navigate(["/zelf-keys/notes"]);
    }

    onCopyNoteId(): void {
        if (!this.note?.id) return;

        this._copyToClipboard(this.note.id);
    }

    onCopyNoteContent(): void {
        if (!this.decryptedData?.content) return;

        this._copyToClipboard(this.decryptedData.content);
    }

    onCopyNoteTitle(): void {
        if (!this.decryptedData?.title) return;

        this._copyToClipboard(this.decryptedData.title);
    }

    onImageError(event: Event): void {
        const img = event.target as HTMLImageElement;

        img.style.display = "none";

        const container = img.parentElement;

        if (!container) return;

        container.innerHTML = `<div class="note-detail__image-error">${this._translocoService.translate("zelf_keys.common.image_not_available")}</div>`;
    }

    onDownloadZelfProof(): void {
        if (!this.note?.url) return;

        const link = document.createElement("a");

        link.href = this.note.url;
        link.download = `zelfproof-${this.note.publicData.title || "note"}.png`;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    }
}
