import { CommonModule } from "@angular/common";
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";

import { TagModel } from "@shared/types/tag.types";

export interface BannerItem {
    id: string;
    type: "expiration" | "rewards";
    /** Translation key for the banner title (use transloco pipe in template). */
    titleKey: string;
    /** Translation key for the banner subtitle (use transloco pipe in template). */
    subtitleKey: string;
    /** Params for the subtitle translation (e.g. `{ days: 5 }`). */
    subtitleParams?: Record<string, unknown>;
    route: string[];
    visible: boolean;
}

type SlideDirection = "left" | "right" | null;

const AUTO_SLIDE_INTERVAL_MS = 5000;

@Component({
    imports: [CommonModule, RouterModule, TranslocoModule],
    selector: "home-banners",
    styleUrls: ["./home-banners.component.scss"],
    templateUrl: "./home-banners.component.html",
})
export class HomeBannersComponent implements OnChanges, OnDestroy {
    @Input() wallet!: TagModel;
    @Output() bannerClick: EventEmitter<BannerItem> = new EventEmitter<BannerItem>();
    @ViewChild("carouselContainer") carouselContainer!: ElementRef<HTMLDivElement>;

    banners: BannerItem[] = [];
    currentIndex: number = 0;
    slideDirection: SlideDirection = null;
    isAnimating: boolean = false;

    // Auto-slide timer (5 seconds between banners)
    private autoSlideTimer: ReturnType<typeof setInterval> | null = null;

    // Swipe handling
    private touchStartX: number = 0;
    private touchCurrentX: number = 0;
    private isDragging: boolean = false;
    private readonly swipeThreshold: number = 50;

    dragOffset: number = 0;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["wallet"]) {
            this._buildBanners();
            this._restartAutoSlide();
        }
    }

    ngOnDestroy(): void {
        this._stopAutoSlide();
    }

    private _startAutoSlide(): void {
        if (this.visibleBanners.length <= 1) return;
        this.autoSlideTimer = setInterval(() => {
            this.nextSlide();
        }, AUTO_SLIDE_INTERVAL_MS);
    }

    private _stopAutoSlide(): void {
        if (this.autoSlideTimer) {
            clearInterval(this.autoSlideTimer);
            this.autoSlideTimer = null;
        }
    }

    private _restartAutoSlide(): void {
        this._stopAutoSlide();
        this._startAutoSlide();
    }

    private _buildBanners(): void {
        this.banners = [];

        // Expiration banner for hold type tags
        if (this._shouldShowExpirationBanner()) {
            const { key, params } = this._getExpirationSubtitleKeyAndParams();
            this.banners.push({
                id: "expiration",
                type: "expiration",
                titleKey: "home_banners.expiration.title",
                subtitleKey: key,
                subtitleParams: params,
                route: ["/manage-domains"],
                visible: true,
            });
        }

        // Rewards banner - always visible
        this.banners.push({
            id: "rewards",
            type: "rewards",
            titleKey: "home_banners.rewards.title",
            subtitleKey: "home_banners.rewards.subtitle",
            route: ["/rewards"],
            visible: true,
        });

        // Reset index if out of bounds
        if (this.currentIndex >= this.banners.length) {
            this.currentIndex = 0;
        }
    }

    private _shouldShowExpirationBanner(): boolean {
        if (!this.wallet?.publicData) return false;

        // Show for hold tags or mainnet tags that are expiring soon
        return this.wallet.isHold || this.wallet.isExpiringSoon;
    }

    private _getExpirationSubtitleKeyAndParams(): { key: string; params?: Record<string, unknown> } {
        const daysRemaining = this._getDaysRemaining();

        if (daysRemaining <= 0) {
            return { key: "home_banners.expiration.expired" };
        }

        if (daysRemaining === 1) {
            return { key: "home_banners.expiration.one_day" };
        }

        return { key: "home_banners.expiration.days_left", params: { days: daysRemaining } };
    }

    private _getDaysRemaining(): number {
        if (!this.wallet?.publicData?.expiresAt) return 0;

        const expiresAt = new Date(this.wallet.publicData.expiresAt);
        const now = new Date();
        const diffTime = expiresAt.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return Math.max(0, diffDays);
    }

    get visibleBanners(): BannerItem[] {
        return this.banners.filter((b) => b.visible);
    }

    get hasBanners(): boolean {
        return this.visibleBanners.length > 0;
    }

    get showPagination(): boolean {
        return this.visibleBanners.length > 1;
    }

    get currentBanner(): BannerItem | null {
        return this.visibleBanners[this.currentIndex] || null;
    }

    goToSlide(index: number): void {
        if (index >= 0 && index < this.visibleBanners.length && index !== this.currentIndex && !this.isAnimating) {
            this.slideDirection = index > this.currentIndex ? "left" : "right";
            this._animateSlide(index);
            this._restartAutoSlide();
        }
    }

    nextSlide(): void {
        if (this.isAnimating) return;

        const nextIndex = this.currentIndex < this.visibleBanners.length - 1 ? this.currentIndex + 1 : 0;
        this.slideDirection = "left";
        this._animateSlide(nextIndex);
        this._restartAutoSlide();
    }

    previousSlide(): void {
        if (this.isAnimating) return;

        const prevIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.visibleBanners.length - 1;
        this.slideDirection = "right";
        this._animateSlide(prevIndex);
        this._restartAutoSlide();
    }

    private _animateSlide(newIndex: number): void {
        this.isAnimating = true;

        // After animation completes, update the index
        setTimeout(() => {
            this.currentIndex = newIndex;
            this.isAnimating = false;
            this.slideDirection = null;
        }, 300);
    }

    onBannerClick(banner: BannerItem): void {
        if (!this.isDragging) {
            this.bannerClick.emit(banner);
        }
    }

    // Touch event handlers for swipe
    onTouchStart(event: TouchEvent): void {
        if (this.isAnimating) return;
        this.touchStartX = event.touches[0].clientX;
        this.touchCurrentX = this.touchStartX;
        this.isDragging = true;
        this.dragOffset = 0;
    }

    onTouchMove(event: TouchEvent): void {
        if (!this.isDragging || this.isAnimating) return;
        this.touchCurrentX = event.touches[0].clientX;
        this.dragOffset = this.touchCurrentX - this.touchStartX;

        // Limit drag offset for visual feedback
        const maxDrag = 100;
        this.dragOffset = Math.max(-maxDrag, Math.min(maxDrag, this.dragOffset));
    }

    onTouchEnd(): void {
        if (!this.isDragging) return;
        this._handleSwipe();
        this.isDragging = false;
        this.dragOffset = 0;
    }

    // Mouse event handlers for desktop swipe
    onMouseDown(event: MouseEvent): void {
        if (this.isAnimating) return;
        event.preventDefault();
        this.touchStartX = event.clientX;
        this.touchCurrentX = this.touchStartX;
        this.isDragging = true;
        this.dragOffset = 0;
    }

    onMouseMove(event: MouseEvent): void {
        if (!this.isDragging || this.isAnimating) return;
        this.touchCurrentX = event.clientX;
        this.dragOffset = this.touchCurrentX - this.touchStartX;

        // Limit drag offset for visual feedback
        const maxDrag = 100;
        this.dragOffset = Math.max(-maxDrag, Math.min(maxDrag, this.dragOffset));
    }

    onMouseUp(): void {
        if (!this.isDragging) return;
        this._handleSwipe();
        this.isDragging = false;
        this.dragOffset = 0;
    }

    onMouseLeave(): void {
        if (this.isDragging) {
            this.isDragging = false;
            this.dragOffset = 0;
        }
    }

    private _handleSwipe(): void {
        const swipeDistance = this.touchStartX - this.touchCurrentX;

        if (Math.abs(swipeDistance) < this.swipeThreshold) {
            return;
        }

        if (swipeDistance > 0) {
            // Swipe left - go to next slide
            this.nextSlide();
        } else {
            // Swipe right - go to previous slide
            this.previousSlide();
        }
    }

    getSlideTransform(): string {
        if (this.isDragging && this.dragOffset !== 0) {
            return `translateX(${this.dragOffset}px)`;
        }
        return "translateX(0)";
    }

    getSlideClasses(): Record<string, boolean> {
        return {
            "home-banners__slide-wrapper": true,
            "home-banners__slide-wrapper--animating": this.isAnimating,
            "home-banners__slide-wrapper--slide-left": this.isAnimating && this.slideDirection === "left",
            "home-banners__slide-wrapper--slide-right": this.isAnimating && this.slideDirection === "right",
            "home-banners__slide-wrapper--dragging": this.isDragging,
        };
    }
}
