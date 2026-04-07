import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from "rxjs";

import { PaymentCardItem } from "../../models/zelf-key-item.model";
import { PasswordDataService } from "../../services/password-data.service";
import { PaymentCardDataService } from "../../services/payment-card-data.service";
import { ZelfKeysDataService } from "../../services/zelf-keys-data.service";

export interface VaultItem {
    type: "password" | "card";
    title: string;
    subtitle: string;
    raw: any;
}

@Component({
    imports: [CommonModule, TranslocoModule, RouterModule, ReactiveFormsModule],
    selector: "zelf-keys-vault",
    styleUrls: ["./zelf-keys-vault.component.scss"],
    templateUrl: "./zelf-keys-vault.component.html",
})
export class ZelfKeysVaultComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    allItems: VaultItem[] = [];
    filteredItems: VaultItem[] = [];
    loading = true;
    error: string | null = null;
    searchControl = new FormControl("");
    showFilter = false;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _passwordDataService: PasswordDataService,
        private _paymentCardDataService: PaymentCardDataService,
        private _router: Router,
        private _translocoService: TranslocoService,
        private _zelfKeysDataService: ZelfKeysDataService
    ) {}

    public get currentPlan(): string {
        return "premium";
    }

    public set currentPlan(value: string) {}

    ngOnInit(): void {
        this._setupSearchFilter();
        this._subscribeToDataService();
        this._subscribeToLoadingState();
        this._subscribeToErrorState();
        this._zelfKeysDataService.load();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private _subscribeToDataService(): void {
        this._zelfKeysDataService.data$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
            if (!data) {
                this.allItems = [];
                this.filteredItems = [];
                this.showFilter = false;
                return;
            }

            const passwords: VaultItem[] = (data.passwords || []).map((p: any) => ({
                type: "password" as const,
                title: this._getPasswordTitle(p),
                subtitle: this._getPasswordSubtitle(p),
                raw: p,
            }));

            const cards: VaultItem[] = (data.paymentCards || []).map((c: any) => ({
                type: "card" as const,
                title: c.cardName || c.publicData?.cardName || this._translocoService.translate("zelf_keys.data_card.untitled"),
                subtitle: this._getMaskedCardNumber(c.cardNumber || c.publicData?.card || ""),
                raw: c,
            }));

            this.allItems = [...passwords, ...cards];
            this.filteredItems = [...this.allItems];
            this.showFilter = this.allItems.length > 5;
        });
    }

    private _subscribeToLoadingState(): void {
        this._zelfKeysDataService.loading$.pipe(takeUntil(this.destroy$)).subscribe((loading) => {
            this.loading = loading;
            this._changeDetectorRef.detectChanges();
        });
    }

    private _subscribeToErrorState(): void {
        this._zelfKeysDataService.error$.pipe(takeUntil(this.destroy$)).subscribe((error) => {
            this.error = error ? this._translocoService.translate("zelf_keys.passwords.error.load_failed") : null;
        });
    }

    private _setupSearchFilter(): void {
        this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((term) => {
            this._filterItems(term || "");
        });
    }

    private _filterItems(term: string): void {
        if (!term.trim()) {
            this.filteredItems = [...this.allItems];
            return;
        }

        const lower = term.toLowerCase();

        this.filteredItems = this.allItems.filter(
            (item) => item.title.toLowerCase().includes(lower) || item.subtitle.toLowerCase().includes(lower)
        );
    }

    private _getPasswordTitle(password: any): string {
        if (password.publicData?.website) {
            try {
                return new URL(password.publicData.website).hostname;
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
        if (password.publicData?.username) return password.publicData.username;
        if (password.publicData?.description) return password.publicData.description;
        if (password.subtitle) return password.subtitle;
        if (password.publicData?.zelfName) return password.publicData.zelfName;
        return this._translocoService.translate("zelf_keys.data_card.secure_credential");
    }

    private _getMaskedCardNumber(cardNumber: string): string {
        if (!cardNumber) return "•••• ••••";
        const cleaned = cardNumber.replace(/\D/g, "");
        if (cleaned.length < 4) return "•••• " + cleaned;
        const last4 = cleaned.slice(-4);
        return "•••• •••• •••• " + last4;
    }

    onItemClick(item: VaultItem): void {
        if (item.type === "password") {
            this._passwordDataService.setCurrentPassword(item.raw);
            this._router.navigate(["/zelf-keys/passwords/detail"]);
        } else {
            const sourceCard = item.raw.rawData || item.raw;
            const zelfProof =
                item.raw.zelfProof || item.raw.publicData?.zelfProof || sourceCard.zelfProof || sourceCard.publicData?.zelfProof || item.raw.id;

            const publicData = {
                ...(sourceCard.publicData || {}),
                ...(item.raw.publicData || {}),
                type: "credit_card" as const,
                card: item.raw.publicData?.card || sourceCard.publicData?.card || "",
                zelfProof: zelfProof,
            };

            const cardItem: PaymentCardItem & { zelfProof?: string } = {
                id: item.raw.id || sourceCard.id || sourceCard.identifier || "",
                name: item.raw.name || sourceCard.name || "",
                url: item.raw.url || sourceCard.url || "",
                size: item.raw.size || sourceCard.size || 0,
                timestamp: item.raw.timestamp || sourceCard.timestamp || sourceCard.createdAt || new Date().toISOString(),
                publicData: publicData,
                zelfProof: zelfProof,
            };

            this._paymentCardDataService.setCurrentPaymentCard(cardItem);
            this._router.navigate(["/zelf-keys/payment-cards/detail"]);
        }
    }

    onAddPassword(): void {
        this._router.navigate(["/zelf-keys/passwords/new"]);
    }

    onAddCard(): void {
        this._router.navigate(["/zelf-keys/payment-cards/new"]);
    }

    async onRefresh(): Promise<void> {
        await this._zelfKeysDataService.refresh();
    }

    trackByItem(index: number, item: VaultItem): string {
        return item.type + "-" + (item.raw?.id || item.raw?.publicData?.id || index);
    }
}
