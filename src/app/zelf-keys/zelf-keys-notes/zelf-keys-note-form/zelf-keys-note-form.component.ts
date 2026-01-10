import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";

import { Wallet } from "@shared/types/wallet.types";
import { WalletService } from "app/wallet.service";
import { HttpWrapperService } from "app/http-wrapper.service";
import { DataPassingService } from "../../../services/data-passing.service";
import {
    BiometricResult,
    BiometricsBottomSheetComponent,
    BiometricsBottomSheetData,
} from "../../shared/biometrics-bottom-sheet/biometrics-bottom-sheet.component";

@Component({
    imports: [CommonModule, TranslocoModule, RouterModule, FormsModule],
    selector: "zelf-keys-note-form",
    styleUrls: ["./zelf-keys-note-form.component.scss"],
    templateUrl: "./zelf-keys-note-form.component.html",
})
export class NoteFormComponent implements OnInit {
    noteData = {
        title: "Meeting Notes",
        content: `Date: ${new Date().toLocaleDateString()}
Location: Conference Room A
Attendees: Team Members

Agenda: Q1 Planning

Notes:
- Discussed project timeline and goals
- Reviewed budget allocation
- Set quarterly objectives
- Assigned team responsibilities`,
        folder: "Work",
        insideFolder: true,
        useMasterPassword: false,
        masterPassword: "",
    };

    formValid = false;
    hasMasterPassword = false;
    isNewNote = true;
    shareables: any = {};
    showMasterPassword = false;
    transformedNoteData: any = null;
    wallet!: Wallet;

    constructor(
        private _bottomSheet: MatBottomSheet,
        private _changeDetectorRef: ChangeDetectorRef,
        private _dataPassingService: DataPassingService,
        private _httpWrapperService: HttpWrapperService,
        private _router: Router,
        private _walletService: WalletService
    ) {}

    async ngOnInit(): Promise<void> {
        this.isNewNote = true;

        await this._setWallet();

        this.checkFormValidity();
    }

    private async _setWallet(): Promise<any> {
        const wallet = await this._walletService.getFirstWalletFromStorage();

        if (!wallet?.name) {
            this._router.navigate(["/welcome"]);

            return;
        }

        this.shareables.wallet = wallet;
        this.wallet = this.shareables.wallet;
        this.hasMasterPassword = wallet.hasPassword || false;

        this._changeDetectorRef.detectChanges();

        this.checkFormValidity();
    }

    toggleFolder(): void {
        this.noteData.insideFolder = !this.noteData.insideFolder;
    }

    toggleMasterPassword(): void {
        this.noteData.useMasterPassword = !this.noteData.useMasterPassword;

        if (!this.noteData.useMasterPassword) {
            this.noteData.masterPassword = ""; // Clear password when toggling off
        }

        this.checkFormValidity();
    }

    checkFormValidity(): void {
        const hasTitle = !!this.noteData.title.trim();
        const hasContent = !!this.noteData.content.trim();

        const hasMasterPassword = !!this.noteData.masterPassword;
        const masterPasswordValid = this.hasMasterPassword ? hasMasterPassword : true;

        this.formValid = hasTitle && hasContent && masterPasswordValid;
    }

    onCancel(): void {
        this._router.navigate(["/zelf-keys/notes"]);
    }

    onBiometricsSuccess(): void {
        this._router.navigate(["/zelf-keys/notes/result"]);
    }

    async onSave(): Promise<void> {
        if (!this.formValid) return;

        this.transformedNoteData = {
            title: this.noteData.title,
            keyValuePairs: {
                content: await this._httpWrapperService.encryptMessage(this.noteData.content),
            },
            folder: this.noteData.folder,
            insideFolder: this.noteData.insideFolder,
            useMasterPassword: this.noteData.useMasterPassword,
            masterPassword: await this._httpWrapperService.encryptMessage(this.noteData.masterPassword),
            type: "notes",
        };

        await this._dataPassingService.storeData("notes", this.transformedNoteData);

        this._openBiometricsBottomSheet();
    }

    toggleMasterPasswordVisibility(): void {
        this.showMasterPassword = !this.showMasterPassword;
    }

    private _openBiometricsBottomSheet(): void {
        const data: BiometricsBottomSheetData = {
            itemData: this.transformedNoteData,
            itemType: "note",
            mode: "encrypt",
        };

        const bottomSheetRef = this._bottomSheet.open(BiometricsBottomSheetComponent, {
            data: data,
            backdropClass: "zelf-backdrop",
            panelClass: "zelf-bottom-sheet-biometrics",
        });

        bottomSheetRef.afterDismissed().subscribe((result: BiometricResult | undefined) => {
            if (!result) return;

            this.onBiometricsSuccess();
        });
    }
}
