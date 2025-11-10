import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from "rxjs";

import { ChromeService } from "app/chrome.service";
import { BillingService } from "../../services/billing.service";
import { DataPassingService } from "../../services/data-passing.service";
import { PasswordDataService } from "../../services/password-data.service";
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
    selector: "zelf-keys-passwords",
    styleUrls: ["./zelf-keys-passwords.component.scss"],
    templateUrl: "./zelf-keys-passwords.component.html",
})
export class ZelfKeysPasswordsComponent implements OnInit, OnDestroy {
    private _currentPlan: string = "";
    private destroy$ = new Subject<void>();

    error: string | null = null;
    filteredPasswords: any[] = [];
    folders: FolderGroup[] = [];
    itemsWithoutFolder: any[] = [];
    loading = true;
    searchControl = new FormControl("");
    showFilter = false;
    storedPasswords: any[] = [];
    viewMode: "list" | "folder" = "list";

    private readonly VIEW_MODE_KEY = "zelfKeysViewMode";

    constructor(
        private _billingService: BillingService,
        private _chromeService: ChromeService,
        private _dataPassingService: DataPassingService,
        private _passwordDataService: PasswordDataService,
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

    async ngOnInit(): Promise<void> {
        this._setupSearchFilter();
        this._dataPassingService.clearData("passwords");
        this._subscribeToDataService();
        this._subscribeToLoadingState();
        this._subscribeToErrorState();

        await this._loadPasswords();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public get currentPlan(): string {
        return this._currentPlan;
    }

    public set currentPlan(value: string) {
        if (this._currentPlan === value) return;

        this._currentPlan = value;
        this._loadPasswords();
    }

    private _subscribeToDataService(): void {
        this._zelfKeysDataService.data$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
            if (data?.passwords && Array.isArray(data.passwords)) {
                this.storedPasswords = data.passwords;
                this.filteredPasswords = [...this.storedPasswords];
                this.showFilter = this.storedPasswords.length > 5;
                this._buildDirectoryStructure();
            } else {
                this.storedPasswords = [];
                this.filteredPasswords = [];
                this.folders = [];
                this.itemsWithoutFolder = [];
                this.showFilter = false;
            }
        });
    }

    private _buildDirectoryStructure(): void {
        const folderMap = new Map<string, any[]>();
        const withoutFolder: any[] = [];

        this.storedPasswords.forEach((item) => {
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
            this.error = error ? this._translocoService.translate("zelf_keys.passwords.error.load_failed") : null;
        });
    }

    private _filterPasswords(searchTerm: string): void {
        if (!searchTerm.trim()) {
            this.filteredPasswords = [...this.storedPasswords];
            this._buildDirectoryStructure();

            return;
        }

        const term = searchTerm.toLowerCase();

        this.filteredPasswords = this.storedPasswords.filter((password) => {
            const title = this._getPasswordTitle(password).toLowerCase();
            const subtitle = this._getPasswordSubtitle(password).toLowerCase();

            return title.includes(term) || subtitle.includes(term);
        });

        // Rebuild directory structure with filtered items
        const folderMap = new Map<string, any[]>();
        const withoutFolder: any[] = [];

        this.filteredPasswords.forEach((item) => {
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

    private _getPasswordTitle(password: any): string {
        if (password.publicData?.website) {
            try {
                const url = new URL(password.publicData.website);

                return url.hostname;
            } catch {
                return password.publicData.website;
            }
        }

        if (password.publicData?.title) return password.publicData.title;
        if (password.title) return password.title;

        if (password.name) {
            return (
                password.name
                    ?.replace(/\.png$/, "")
                    .split("_")
                    .pop() || this._translocoService.translate("zelf_keys.data_card.untitled")
            );
        }

        return this._translocoService.translate("zelf_keys.data_card.untitled");
    }

    private _getPasswordSubtitle(password: any): string {
        if (password.publicData?.username) return `Username: ${password.publicData.username}`;
        if (password.publicData?.description) return password.publicData.description;
        if (password.subtitle) return password.subtitle;
        if (password.publicData?.zelfName) return `Zelf Name: ${password.publicData.zelfName}`;
        if (password.publicData?.category) return `Category: ${password.publicData.category}`;
        if (password.publicData?.type) return `Type: ${password.publicData.type}`;

        return this._translocoService.translate("zelf_keys.data_card.secure_credential");
    }

    private _setupSearchFilter(): void {
        this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((searchTerm) => {
            this._filterPasswords(searchTerm || "");
        });
    }

    private _subscribeToBillingService(): void {
        this.currentPlan = this._billingService.currentPlan;

        this._billingService.currentPlan$.pipe(takeUntil(this.destroy$)).subscribe((plan) => {
            this.currentPlan = plan;
        });
    }

    private async _loadPasswords(): Promise<void> {
        await this._zelfKeysDataService.load();
    }

    onAddPassword(): void {
        this._router.navigate(["/zelf-keys/passwords/new"]);
    }

    onPasswordClick(password: any): void {
        this._passwordDataService.setCurrentPassword(password);

        this._router.navigate(["/zelf-keys/passwords/detail"]);
    }

    async onRefresh(): Promise<void> {
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

    trackByPassword(index: number, password: any): any {
        return password.publicData?.id || password.publicData?.title || index;
    }

    trackByFolder(index: number, folder: FolderGroup): string {
        return folder.name;
    }
}
