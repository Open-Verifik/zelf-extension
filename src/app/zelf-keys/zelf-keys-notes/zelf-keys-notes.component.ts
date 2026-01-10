import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from "rxjs";

import { ChromeService } from "app/chrome.service";
import { BillingService } from "../../services/billing.service";
import { NoteDataService } from "../../services/note-data.service";
import { ZelfKeysDataService } from "../../services/zelf-keys-data.service";
import { DataCardComponent } from "../shared/data-card/data-card.component";
import { SubscriptionBannerComponent } from "../shared/subscription-banner/subscription-banner.component";

interface FolderGroup {
    name: string;
    open: boolean;
    items: any[];
}

@Component({
    imports: [CommonModule, TranslocoModule, RouterModule, DataCardComponent, ReactiveFormsModule, SubscriptionBannerComponent],
    selector: "zelf-keys-notes",
    styleUrls: ["./zelf-keys-notes.component.scss"],
    templateUrl: "./zelf-keys-notes.component.html",
})
export class ZelfKeysNotesComponent implements OnInit, OnDestroy {
    private _currentPlan: string = "";
    private destroy$ = new Subject<void>();

    error: string | null = null;
    filteredNotes: any[] = [];
    folders: FolderGroup[] = [];
    itemsWithoutFolder: any[] = [];
    loading = true;
    searchControl = new FormControl("");
    showFilter = false;
    storedNotes: any[] = [];
    viewMode: "list" | "folder" = "list";

    private readonly VIEW_MODE_KEY = "zelfKeysViewMode";

    constructor(
        private _billingService: BillingService,
        private _chromeService: ChromeService,
        private _noteDataService: NoteDataService,
        private _router: Router,
        private _translocoService: TranslocoService,
        private _zelfKeysDataService: ZelfKeysDataService
    ) {
        this._subscribeToBillingService();
        this._loadViewMode();
    }

    private async _loadViewMode(): Promise<void> {
        try {
            const savedViewMode = await this._chromeService.getItemSession<"list" | "folder">(this.VIEW_MODE_KEY);

            if (savedViewMode === "list" || savedViewMode === "folder") {
                this.viewMode = savedViewMode;
            }
        } catch (error) {
            console.error("Error loading view mode:", error);
        }
    }

    public get currentPlan(): string {
        return this._currentPlan;
    }

    public set currentPlan(value: string) {
        if (this._currentPlan === value) return;

        this._currentPlan = value;
        this._loadNotes();
    }

    async ngOnInit(): Promise<void> {
        this._setupSearchFilter();
        this._subscribeToDataService();
        this._subscribeToLoadingState();
        this._subscribeToErrorState();

        await this._loadNotes();
    }

    private _subscribeToDataService(): void {
        this._zelfKeysDataService.data$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
            if (data?.notes && Array.isArray(data.notes)) {
                this.storedNotes = data.notes;
                this.filteredNotes = [...this.storedNotes];
                this.showFilter = this.storedNotes.length > 5;
                this._buildDirectoryStructure();
            } else {
                this.storedNotes = [];
                this.filteredNotes = [];
                this.folders = [];
                this.itemsWithoutFolder = [];
                this.showFilter = false;
            }
        });
    }

    private _buildDirectoryStructure(): void {
        const folderMap = new Map<string, any[]>();
        const withoutFolder: any[] = [];

        this.storedNotes.forEach((item) => {
            const folderName = item.publicData?.folder;

            if (folderName && folderName.trim()) {
                if (!folderMap.has(folderName)) {
                    folderMap.set(folderName, []);
                }
                folderMap.get(folderName)!.push(item);
            } else {
                withoutFolder.push(item);
            }
        });

        this.folders = Array.from(folderMap.entries())
            .map(([name, items]) => ({
                name,
                open: false,
                items,
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

        this.itemsWithoutFolder = withoutFolder;
    }

    private _subscribeToLoadingState(): void {
        this._zelfKeysDataService.loading$.pipe(takeUntil(this.destroy$)).subscribe((loading) => {
            this.loading = loading;
        });
    }

    private _subscribeToErrorState(): void {
        this._zelfKeysDataService.error$.pipe(takeUntil(this.destroy$)).subscribe((error) => {
            this.error = error ? this._translocoService.translate("zelf_keys.notes.error.load_failed") : null;
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private _subscribeToBillingService(): void {
        this.currentPlan = this._billingService.currentPlan || "free";

        this._billingService.currentPlan$.pipe(takeUntil(this.destroy$)).subscribe((plan) => {
            this.currentPlan = plan;
        });
    }

    private async _loadNotes(): Promise<void> {
        // Load data from service (will use cache if available and valid)
        await this._zelfKeysDataService.load();
    }

    private _filterNotes(searchTerm: string): void {
        if (!searchTerm.trim()) {
            this.filteredNotes = [...this.storedNotes];
            this._buildDirectoryStructure();

            return;
        }

        const term = searchTerm.toLowerCase();

        this.filteredNotes = this.storedNotes.filter((note) => {
            const title = this._getNoteTitle(note).toLowerCase();
            const subtitle = this._getNoteSubtitle(note).toLowerCase();

            return title.includes(term) || subtitle.includes(term);
        });

        // Rebuild directory structure with filtered items
        const folderMap = new Map<string, any[]>();
        const withoutFolder: any[] = [];

        this.filteredNotes.forEach((item) => {
            const folderName = item.publicData?.folder;

            if (folderName && folderName.trim()) {
                if (!folderMap.has(folderName)) {
                    folderMap.set(folderName, []);
                }
                folderMap.get(folderName)!.push(item);
            } else {
                withoutFolder.push(item);
            }
        });

        this.folders = Array.from(folderMap.entries())
            .map(([name, items]) => {
                const existingFolder = this.folders.find((f) => f.name === name);

                return {
                    name,
                    open: existingFolder?.open || false,
                    items,
                };
            })
            .sort((a, b) => a.name.localeCompare(b.name));

        this.itemsWithoutFolder = withoutFolder;
    }

    private _getNoteTitle(note: any): string {
        if (note.publicData?.title) return note.publicData.title;
        if (note.title) return note.title;

        if (note.name) {
            return (
                note.name
                    ?.replace(/\.png$/, "")
                    .split("_")
                    .pop() || this._translocoService.translate("zelf_keys.data_card.untitled")
            );
        }

        return this._translocoService.translate("zelf_keys.data_card.untitled");
    }

    private _getNoteSubtitle(note: any): string {
        if (note.publicData?.description) return note.publicData.description;
        if (note.subtitle) return note.subtitle;
        if (note.publicData?.content) return note.publicData.content;
        if (note.publicData?.zelfName) return `Zelf Name: ${note.publicData.zelfName}`;
        if (note.publicData?.category) return `Category: ${note.publicData.category}`;

        return this._translocoService.translate("zelf_keys.data_card.secure_note");
    }

    private _setupSearchFilter(): void {
        this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((searchTerm) => {
            this._filterNotes(searchTerm || "");
        });
    }

    onAddNote(): void {
        this._router.navigate(["/zelf-keys/notes/new"]);
    }

    async onRefresh(): Promise<void> {
        // Refresh will force fetch from API and update state
        // Loading state is automatically managed by the service
        await this._zelfKeysDataService.refresh();
    }

    async setViewMode(mode: "list" | "folder"): Promise<void> {
        this.viewMode = mode;

        try {
            await this._chromeService.setItemSession(this.VIEW_MODE_KEY, mode);
        } catch (error) {
            console.error("Error saving view mode:", error);
        }
    }

    toggleFolder(folderName: string): void {
        const folder = this.folders.find((f) => f.name === folderName);

        if (folder) {
            folder.open = !folder.open;
        }
    }

    onNoteClick(note: any): void {
        this._noteDataService.setCurrentNote(note);
        this._router.navigate(["/zelf-keys/notes/detail"]);
    }

    trackByNote(index: number, note: any): any {
        return note.id || note.publicData?.id || index;
    }

    trackByFolder(index: number, folder: FolderGroup): string {
        return folder.name;
    }
}
