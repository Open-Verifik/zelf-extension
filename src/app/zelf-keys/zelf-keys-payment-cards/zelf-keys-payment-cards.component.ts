import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from "rxjs";

import { ChromeService } from "app/chrome.service";
import { PaymentCardItem } from "../../models/zelf-key-item.model";
import { PaymentCardDataService } from "../../services/payment-card-data.service";
import { ZelfKeysDataService } from "../../services/zelf-keys-data.service";

interface FolderGroup {
    name: string;
    open: boolean;
    items: any[];
}

@Component({
    imports: [CommonModule, TranslocoModule, ReactiveFormsModule],
    selector: "zelf-keys-payment-cards",
    styleUrls: ["./zelf-keys-payment-cards.component.scss"],
    templateUrl: "./zelf-keys-payment-cards.component.html",
})
export class ZelfKeysPaymentCardsComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    error: string | null = null;
    filteredPaymentCards: any[] = [];
    folders: FolderGroup[] = [];
    isLoading = false;
    itemsWithoutFolder: any[] = [];
    paymentCards: any[] = [];
    searchControl = new FormControl("");
    showFilter = false;
    viewMode: "list" | "folder" = "list";

    private readonly VIEW_MODE_KEY = "zelfKeysViewMode";

    constructor(
        private _chromeService: ChromeService,
        private _paymentCardDataService: PaymentCardDataService,
        private _router: Router,
        private _translocoService: TranslocoService,
        private _zelfKeysDataService: ZelfKeysDataService
    ) {
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
        return "premium";
    }

    async ngOnInit(): Promise<void> {
        this._setupSearchFilter();
        this._subscribeToDataService();
        this._subscribeToLoadingState();
        this._subscribeToErrorState();

        await this._loadPaymentCards();
    }

    private _subscribeToDataService(): void {
        this._zelfKeysDataService.data$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
            if (data?.paymentCards && Array.isArray(data.paymentCards)) {
                const cardsArray = data.paymentCards;

                if (cardsArray && cardsArray.length > 0) {
                    this.paymentCards = this._mapPaymentCards(cardsArray);
                    this.filteredPaymentCards = [...this.paymentCards];
                    this.showFilter = this.paymentCards.length > 5;
                    this._buildDirectoryStructure();
                } else {
                    this.paymentCards = [];
                    this.filteredPaymentCards = [];
                    this.folders = [];
                    this.itemsWithoutFolder = [];
                    this.showFilter = false;
                }
            } else {
                this.paymentCards = [];
                this.filteredPaymentCards = [];
                this.folders = [];
                this.itemsWithoutFolder = [];
                this.showFilter = false;
            }
        });
    }

    private _buildDirectoryStructure(): void {
        const folderMap = new Map<string, any[]>();
        const withoutFolder: any[] = [];

        this.paymentCards.forEach((item) => {
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
            this.isLoading = loading;
        });
    }

    private _subscribeToErrorState(): void {
        this._zelfKeysDataService.error$.pipe(takeUntil(this.destroy$)).subscribe((error) => {
            this.error = error ? this._translocoService.translate("zelf_keys.payment_cards.error.load_failed") : null;
        });
    }

    private _mapPaymentCards(cardsArray: any[]): any[] {
        return cardsArray.map((item: any) => {
            let parsedCardData: any = {};

            if (item.publicData?.card) {
                try {
                    parsedCardData = JSON.parse(item.publicData.card);
                } catch (error) {
                    console.error("Error parsing card data:", error, item.publicData?.card);
                }
            }

            let expiryMonth = "";
            let expiryYear = "";

            if (parsedCardData.expires) {
                const [month, year] = parsedCardData.expires.split("/");

                expiryMonth = month || "";
                expiryYear = year ? `20${year}` : "";
            }

            const timestamp = item.createdAt || item.publicData?.timestamp || new Date().toISOString();
            const zelfProof = item.zelfProof || item.publicData?.zelfProof || item.id;
            const url = item.url || item.publicData?.url || "";

            const publicData = {
                ...item.publicData,
                type: "credit_card" as const,
                card: item.publicData?.card || JSON.stringify(parsedCardData),
                zelfProof: zelfProof,
            };

            return {
                id: item.id || item.identifier || "",
                name: item.name || parsedCardData.name || item.identifier || "",
                url: url,
                size: item.size || 0,
                timestamp: timestamp,
                publicData: publicData,
                bankName: parsedCardData.bankName || this._translocoService.translate("zelf_keys.payment_cards.unknown_bank"),
                cardName: parsedCardData.name || this._translocoService.translate("zelf_keys.payment_cards.unknown"),
                cardNumber: parsedCardData.number || "",
                createdAt: new Date(timestamp),
                expiryMonth: expiryMonth,
                expiryYear: expiryYear,
                zelfProof: zelfProof,
                zelfQR: item.zelfProofQRCode || item.publicData?.zelfProofQRCode || url,
                rawData: item,
            };
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private async _loadPaymentCards(): Promise<void> {
        // Load data from service (will use cache if available and valid)
        await this._zelfKeysDataService.load();
    }

    private _filterPaymentCards(searchTerm: string): void {
        if (!searchTerm.trim()) {
            this.filteredPaymentCards = [...this.paymentCards];
            this._buildDirectoryStructure();

            return;
        }

        const term = searchTerm.toLowerCase();

        this.filteredPaymentCards = this.paymentCards.filter((card) => {
            const title = this._getPaymentCardTitle(card).toLowerCase();
            const subtitle = this._getPaymentCardSubtitle(card).toLowerCase();

            return title.includes(term) || subtitle.includes(term);
        });

        // Rebuild directory structure with filtered items
        const folderMap = new Map<string, any[]>();
        const withoutFolder: any[] = [];

        this.filteredPaymentCards.forEach((item) => {
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

    private _getPaymentCardTitle(card: any): string {
        if (card.cardName && card.cardName !== this._translocoService.translate("zelf_keys.payment_cards.unknown")) {
            return card.cardName;
        }
        if (card.bankName && card.bankName !== this._translocoService.translate("zelf_keys.payment_cards.unknown_bank")) {
            return card.bankName;
        }
        if (card.name) {
            return (
                card.name
                    ?.replace(/\.png$/, "")
                    .split("_")
                    .pop() || this._translocoService.translate("zelf_keys.payment_cards.unknown")
            );
        }

        return this._translocoService.translate("zelf_keys.payment_cards.unknown");
    }

    private _getPaymentCardSubtitle(card: any): string {
        if (card.cardNumber) {
            return `Card: ${this.getMaskedCardNumber(card.cardNumber)}`;
        }
        if (card.bankName) {
            return `Bank: ${card.bankName}`;
        }
        if (card.expiryMonth && card.expiryYear) {
            return `Expires: ${card.expiryMonth}/${card.expiryYear.slice(-2)}`;
        }

        return this._translocoService.translate("zelf_keys.payment_cards.unknown");
    }

    private _setupSearchFilter(): void {
        this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((searchTerm) => {
            this._filterPaymentCards(searchTerm || "");
        });
    }

    onAddNewCard(): void {
        this._router.navigate(["/zelf-keys/payment-cards/new"]);
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

    trackByFolder(index: number, folder: FolderGroup): string {
        return folder.name;
    }

    onPaymentCardClick(paymentCard: any): void {
        // Ensure the payment card has the correct PaymentCardItem structure
        // Use the rawData if available to preserve the original structure
        const sourceCard = paymentCard.rawData || paymentCard;

        // Extract zelfProof for top-level access (required by biometrics bottom sheet)
        const zelfProof =
            paymentCard.zelfProof || paymentCard.publicData?.zelfProof || sourceCard.zelfProof || sourceCard.publicData?.zelfProof || paymentCard.id;

        // Ensure publicData is properly structured
        const publicData = {
            ...(sourceCard.publicData || {}),
            ...(paymentCard.publicData || {}),
            type: "credit_card" as const,
            card: paymentCard.publicData?.card || sourceCard.publicData?.card || "",
            zelfProof: zelfProof,
        };

        const cardItem: PaymentCardItem & { zelfProof?: string } = {
            id: paymentCard.id || sourceCard.id || sourceCard.identifier || "",
            name: paymentCard.name || sourceCard.name || "",
            url: paymentCard.url || sourceCard.url || "",
            size: paymentCard.size || sourceCard.size || 0,
            timestamp: paymentCard.timestamp || sourceCard.timestamp || sourceCard.createdAt || new Date().toISOString(),
            publicData: publicData,
            zelfProof: zelfProof, // Add at top level for biometrics bottom sheet
        };

        this._paymentCardDataService.setCurrentPaymentCard(cardItem);
        this._router.navigate(["/zelf-keys/payment-cards/detail"]);
    }

    getCardType(cardNumber: string): string {
        if (cardNumber.startsWith("4")) return "VISA";
        if (cardNumber.startsWith("5") || cardNumber.startsWith("2")) return "MASTERCARD";
        if (cardNumber.startsWith("3")) return "AMEX";
        if (cardNumber.startsWith("6")) return "DISCOVER";

        return "CARD";
    }

    getMaskedCardNumber(cardNumber: string): string {
        if (!cardNumber) return "•••• •••• •••• ••••";

        // If already masked (contains asterisks or dashes), return as is but format consistently
        if (cardNumber.includes("*") || cardNumber.includes("•")) {
            // Extract last 4 digits from masked format like "****-****-****-1111"
            const lastFour = cardNumber.replace(/[^0-9]/g, "").slice(-4);
            return lastFour ? "•••• •••• •••• " + lastFour : cardNumber;
        }

        if (cardNumber.length < 4) return cardNumber;

        const lastFour = cardNumber.replace(/[^0-9]/g, "").slice(-4);

        return "•••• •••• •••• " + lastFour;
    }

    getCardColor(zelfProof: string): string {
        let hash = 0;

        for (let i = 0; i < zelfProof.length; i++) {
            const char = zelfProof.charCodeAt(i);

            hash = (hash << 5) - hash + char;
            hash = hash & hash;
        }

        const hue = Math.abs(hash) % 360;
        const saturation = 60 + (Math.abs(hash) % 30);
        const lightness = 45 + (Math.abs(hash) % 20);

        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    getCardGradient(zelfProof: string): string {
        const baseColor = this.getCardColor(zelfProof);
        const hsl = baseColor.match(/\d+/g);

        if (!hsl) return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

        const h = parseInt(hsl[0]);
        const s = parseInt(hsl[1]);
        const l = parseInt(hsl[2]);

        const complementaryH = (h + 180) % 360;
        const lighterL = Math.min(95, l + 20);
        const darkerL = Math.max(25, l - 20);

        return `linear-gradient(135deg, hsl(${h}, ${s}%, ${lighterL}%) 0%, hsl(${complementaryH}, ${s}%, ${darkerL}%) 100%)`;
    }
}
