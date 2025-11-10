import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { Subject } from "rxjs";

import { CopyToClipboardBase } from "app/base/copy-to-clipboard/copy-to-clipboard.base";
import { ZelfKeysService } from "app/services/zelf-keys.service";
import { ChromeService } from "../../../chrome.service";
import { DecryptedNoteData, NoteItem } from "../../../models/zelf-key-item.model";
import { NoteDataService } from "../../../services/note-data.service";
import { ScrollToSectionService } from "../../../services/scroll-to-section.service";
import {
    BiometricResult,
    BiometricsBottomSheetComponent,
    BiometricsBottomSheetData,
} from "../../shared/biometrics-bottom-sheet/biometrics-bottom-sheet.component";

@Component({
    imports: [CommonModule, TranslocoModule, RouterModule],
    selector: "zelf-keys-note-detail",
    styleUrls: ["./zelf-keys-note-detail.component.scss"],
    templateUrl: "./zelf-keys-note-detail.component.html",
})
export class ZelfKeysNoteDetailComponent extends CopyToClipboardBase implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    decryptedData: DecryptedNoteData | null = null;
    decrypting = false;
    error: string | null = null;
    loading = false;
    note: NoteItem | null = null;
    showBiometrics = false;

    constructor(
        private _bottomSheet: MatBottomSheet,
        private _noteDataService: NoteDataService,
        private _router: Router,
        private _scrollToSectionService: ScrollToSectionService,
        private _zelfKeysService: ZelfKeysService,
        protected _chromeService: ChromeService,
        protected _snackBar: MatSnackBar,
        protected _translocoService: TranslocoService
    ) {
        super(_chromeService, _snackBar, _translocoService);
    }

    async ngOnInit(): Promise<void> {
        this.loadNoteData();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private async loadNoteData(): Promise<void> {
        this.loading = true;
        this.error = null;

        try {
            // Get note data from the service
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

    onDecryptClick(): void {
        const bottomSheetRef = this._bottomSheet.open(BiometricsBottomSheetComponent, {
            backdropClass: "zelf-backdrop",
            panelClass: "zelf-bottom-sheet-biometrics",
            data: {
                itemData: this.note,
                itemType: "note",
                mode: "decrypt",
            } as BiometricsBottomSheetData,
        });

        bottomSheetRef.afterDismissed().subscribe((result: BiometricResult | undefined) => {
            if (!result) return;

            this.onBiometricsSuccess(result);
        });
    }

    onBiometricsSuccess(biometricData: BiometricResult): void {
        if (biometricData.retrievedData) {
            const decryptedItem = biometricData.retrievedData;

            const publicData = decryptedItem.publicData as any;
            const title = publicData?.title || decryptedItem.metadata?.title || this._translocoService.translate("zelf_keys.notes.detail.no_title");

            let content = decryptedItem.metadata?.content || this._translocoService.translate("zelf_keys.notes.detail.no_content");

            if (typeof content === "string" && content.trim().startsWith("-----BEGIN PGP MESSAGE-----")) {
                console.warn("Received encrypted content - API should have decrypted it");

                this.error = this._translocoService.translate("zelf_keys.notes.detail.error.decrypt_failed");

                return;
            }

            this.decryptedData = {
                title,
                content,
                folder: decryptedItem.publicData?.folder || this._translocoService.translate("zelf_keys.common.no_folder"),
            };

            // Trigger scroll to decrypted content section
            this._scrollToSectionService.scrollToSection("note-decrypted-content", "note");
        } else {
            console.error("No retrieved data found in biometrics response");
            this.error = this._translocoService.translate("zelf_keys.notes.detail.error.retrieve_failed");
        }
    }

    async decryptNote(biometricData: any): Promise<void> {
        this.decrypting = true;
        this.error = null;

        try {
            const payload = {
                zelfProof: this.note!.publicData.zelfProof || "",
                faceBase64: biometricData.faceBase64,
                password: biometricData.password || undefined,
            };

            const response = await this._zelfKeysService.retrievePassword(payload.zelfProof, payload.faceBase64, payload.password);

            if (response?.data?.metadata) {
                this.decryptedData = {
                    title: response.data.metadata.title || this._translocoService.translate("zelf_keys.notes.detail.no_title"),
                    content: response.data.metadata.content || this._translocoService.translate("zelf_keys.notes.detail.no_content"),
                    folder: response.data.metadata.folder || this._translocoService.translate("zelf_keys.common.no_folder"),
                };

                this.showBiometrics = false;
            } else {
                throw new Error("Failed to decrypt note data");
            }
        } catch (error) {
            console.error("Error decrypting note:", error);
            this.error = this._translocoService.translate("zelf_keys.notes.detail.error.decrypt_failed");
        } finally {
            this.decrypting = false;
        }
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
        // Optionally show a placeholder or error message
        const container = img.parentElement;
        if (container) {
            container.innerHTML = `<div class="note-detail__image-error">${this._translocoService.translate("zelf_keys.common.image_not_available")}</div>`;
        }
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
