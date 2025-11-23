import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslocoService } from "@jsverse/transloco";
import { ZelfKeysService } from "app/services/zelf-keys.service";

export interface DataCardItem {
    category?: string;
    description?: string;
    id?: string;
    ipfs?: any;
    metadata?: any;
    name?: string;
    publicData?: any;
    qrCode?: string;
    size?: number;
    subtitle?: string;
    timestamp?: string;
    title?: string;
    type?: string;
    url?: string;
    zelfProof?: string;
    zelfQR?: string;
}

@Component({
    selector: "data-card",
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="data-card" (click)="onCardClick()">
            <div class="data-card__title-row">
                <span class="material-symbols-outlined data-card__icon">{{ getIcon() }}</span>
                <h4 class="data-card__title">{{ getTitle() }}</h4>
            </div>

            <div class="data-card__content-row">
                <div class="data-card__info">
                    <p class="data-card__subtitle-text">{{ getSubtitle() }}</p>
                    <p *ngIf="getAdditionalInfo()" class="data-card__additional-text">{{ getAdditionalInfo() }}</p>
                </div>

                <div class="data-card__qr-code">
                    <img *ngIf="getQRCodeUrl()" [src]="getQRCodeUrl()" alt="QR Code" />
                    <div *ngIf="!getQRCodeUrl()" class="data-card__qr-placeholder">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                            <path d="M3 3h6v6H3V3zM15 3h6v6h-6V3zM3 15h6v6H3v-6zM15 15h6v6h-6v-6z" fill="#ccc" />
                            <path d="M6 6h2v2H6V6zM16 6h2v2h-2V6zM6 16h2v2H6v-2zM16 16h2v2h-2v-2z" fill="#999" />
                        </svg>
                        <span>{{ getNoQRText() }}</span>
                    </div>
                </div>
            </div>
        </div>
    `,
    styleUrls: ["./data-card.component.scss"],
})
export class DataCardComponent {
    @Input() item!: DataCardItem;
    @Input() category: string = "default";
    @Output() cardClick = new EventEmitter<DataCardItem>();

    constructor(private _translocoService: TranslocoService) {}

    getIcon(): string {
        switch (this.category) {
            case "password":
                return "lock";
            case "notes":
                return "note";
            case "payment-cards":
                return "credit_card";
            case "contacts":
                return "person";
            default:
                return "description";
        }
    }

    getTitle(): string {
        if (this.item.publicData?.website) {
            try {
                const url = new URL(this.item.publicData.website);

                return url.hostname;
            } catch {
                return this.item.publicData.website;
            }
        }

        if (this.item.publicData?.title) return this.item.publicData.title;

        if (this.item.title) return this.item.title;

        if (this.item.name) {
            return (
                this.item.name
                    ?.replace(/\.png$/, "")
                    .split("_")
                    .pop() || this._translocoService.translate("zelf_keys.data_card.untitled")
            );
        }

        return this._translocoService.translate("zelf_keys.data_card.untitled");
    }

    getSubtitle(): string {
        if (this.item.publicData?.username) {
            return this._translocoService.translate("zelf_keys.data_card.username_label", { username: this.item.publicData.username });
        }

        if (this.item.publicData?.zelfName) {
            return this._translocoService.translate("zelf_keys.data_card.zelf_name_label", { zelfName: this.item.publicData.zelfName });
        }

        if (this.item.publicData?.title && this.category === "notes") {
            return this.item.publicData.title;
        }

        if (this.item.subtitle) return this.item.subtitle;

        return this._translocoService.translate("zelf_keys.data_card.secure_credential");
    }

    getAdditionalInfo(): string | null {
        const parts: string[] = [];

        if (this.item.publicData?.description) {
            parts.push(this.item.publicData.description);
        }

        if (this.item.publicData?.category) {
            const categoryLabel = this._translocoService.translate("zelf_keys.data_card.category_label", {
                category: ZelfKeysService.parseCategory(this.item.publicData.category),
            });
            parts.push(categoryLabel);
        }

        if (this.item.publicData?.type && !this.item.publicData?.category) {
            const typeLabel = this._translocoService.translate("zelf_keys.data_card.type_label", { type: this.item.publicData.type });
            parts.push(typeLabel);
        }

        if (this.item.publicData?.email && !this.item.publicData?.username) {
            parts.push(`Email: ${this.item.publicData.email}`);
        }

        return parts.length > 0 ? parts.join(" • ") : null;
    }

    getDetailsText(): string {
        return this._translocoService.translate("zelf_keys.data_card.details");
    }

    getNoQRText(): string {
        return this._translocoService.translate("zelf_keys.data_card.no_qr");
    }

    getQRCodeUrl(): string | null {
        if (this.item.url) return this.item.url;
        if (this.item.zelfQR) return this.item.zelfQR;
        if (this.item.qrCode) return this.item.qrCode;

        return null;
    }

    onCardClick(): void {
        this.cardClick.emit(this.item);
    }
}
