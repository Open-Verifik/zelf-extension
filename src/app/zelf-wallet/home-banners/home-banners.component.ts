import { CommonModule, DecimalPipe } from "@angular/common";
import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";

import { TagModel } from "@shared/types/tag.types";
import { WalletService } from "app/wallet.service";

@Component({
    imports: [CommonModule, DecimalPipe, RouterModule, TranslocoModule],
    selector: "home-banners",
    styleUrls: ["./home-banners.component.scss"],
    templateUrl: "./home-banners.component.html",
})
export class HomeBannersComponent implements OnChanges {
    @Input() wallet!: TagModel;
    @Input() tokens: any[] = [];
    @Input() balancesLoading: boolean = false;
    @Input() hideBalances: boolean = false;

    showExpiration: boolean = false;

    private _znsLogoUseFallback = false;

    constructor(private _walletService: WalletService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["wallet"]) {
            this._evaluateExpiration();
        }
        if (changes["tokens"]) {
            this._znsLogoUseFallback = false;
        }
    }

    get znsToken(): any | null {
        if (!this.tokens?.length) return null;
        return this.tokens.find((t: any) => (t.symbol || "").toUpperCase() === "ZNS") ?? null;
    }

    get znsLogoSrc(): string {
        if (this._znsLogoUseFallback) {
            return this._walletService.getAssetImage("ZNS", "/assets/images/token-placeholder.png");
        }
        return this._walletService.getAssetImage("ZNS", this.znsToken?.image);
    }

    onZnsImageError(): void {
        this._znsLogoUseFallback = true;
    }

    get znsAmount(): number {
        const zns = this.znsToken;
        if (!zns) return 0;
        const raw = zns.amount ?? zns.balance ?? 0;
        const n = typeof raw === "string" ? parseFloat(raw) : Number(raw);
        return Number.isFinite(n) ? n : 0;
    }

    get daysRemaining(): number {
        if (!this.wallet?.publicData?.expiresAt) return 0;

        const expiresAt = new Date(this.wallet.publicData.expiresAt);
        const now = new Date();
        const diffTime = expiresAt.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return Math.max(0, diffDays);
    }

    get expirationDaysLabelKey(): string {
        const days = this.daysRemaining;
        if (days <= 0) return "home_banners.expiration.expired_label";
        if (days === 1) return "home_banners.expiration.day_label";
        return "home_banners.expiration.days_label";
    }

    get zelfQrImageSrc(): string {
        return this.wallet?.image || this.wallet?.zelfProofQRCode || "";
    }

    get showZelfQrInBanner(): boolean {
        return !this.showExpiration && !!this.zelfQrImageSrc;
    }

    private _evaluateExpiration(): void {
        this.showExpiration = this._shouldShowExpirationBanner();
    }

    private _shouldShowExpirationBanner(): boolean {
        if (!this.wallet?.publicData) return false;
        return this.wallet.isHold || this.wallet.isExpiringSoon;
    }
}
