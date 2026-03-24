import { CommonModule } from "@angular/common";
import {
    afterNextRender,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    Injector,
    OnDestroy,
    OnInit,
    ViewChild,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";

import { ChromeService } from "app/chrome.service";
import { MnemonicComponent } from "../mnemonic/mnemonic.component";
import { WalletService } from "app/wallet.service";
import { VaultService } from "app/vault.service";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";
import { TagModel, TagsService } from "app/tags.service";
import { TagFlow } from "app/tags.service";

const TAG_TITLE_LINE_HEIGHT_RATIO = 40 / 32;
/** Subpixel / letter-spacing: avoid shrinking to min when text effectively fits. */
const TAG_TITLE_FIT_SLACK_PX = 12;
/** Never go below this (scaled); 10px was unreadable for short wide names. */
const TAG_TITLE_MIN_FONT_BASE_PX = 16;

@Component({
    imports: [TranslocoModule, CommonModule, RouterModule, MatButtonModule, MnemonicComponent, ZelfLoaderComponent],
    selector: "welcome-complete",
    styleUrls: ["./welcome-complete.component.scss"],
    templateUrl: "./welcome-complete.component.html",
})
export class WelcomeCompleteComponent implements OnInit, OnDestroy {
    @ViewChild("tagTitle", { read: ElementRef }) tagTitleRef?: ElementRef<HTMLElement>;

    flow: TagFlow = "";
    loading: boolean = true;
    isExtension: boolean = false;
    wallet: Partial<TagModel> | null = {};

    tagNameFontSizePx: number = 32;
    tagNameLineHeightPx: number = 40;

    private _resizeRaf: number = 0;
    private _fitWidthRetries: number = 0;

    constructor(
        private readonly _injector: Injector,
        private readonly _cdr: ChangeDetectorRef,
        private _chromeService: ChromeService,
        private _router: Router,
        private _vaultService: VaultService,
        private _walletService: WalletService,
        private _tagsService: TagsService
    ) {
        this.isExtension = this._chromeService.isExtension;

        this._chromeService.removeItem("referralTagName");

        this._chromeService.removeItem("tagObject");
    }

    async ngOnInit(): Promise<void> {
        await this._walletService.removeDuplicateWalletsInStorage();

        this.wallet = await this._walletService.getCurrentWallet();

        this.flow = await this._tagsService.getFlow();

        this.loading = false;

        afterNextRender(
            () => {
                this.fitTagNameFont();
            },
            { injector: this._injector }
        );
    }

    ngOnDestroy(): void {
        cancelAnimationFrame(this._resizeRaf);
        this._vaultService.mnemonic = "";
    }

    @HostListener("window:resize")
    onWindowResize(): void {
        if (this.loading) {
            return;
        }

        cancelAnimationFrame(this._resizeRaf);
        this._resizeRaf = requestAnimationFrame(() => this.fitTagNameFont());
    }

    complete(): void {
        this._vaultService.password = "";

        this._chromeService.removeItem("tagName");
        this._chromeService.removeItem("zelfPrice");
        this._chromeService.removeItem("zelfReward");
    }

    downloadQRCode(): void {
        const link = document.createElement("a");

        link.href = this.wallet?.image as string;

        link.download = `zelfproof_${this.wallet?.fullTagName}.png`;

        link.click();
    }

    async onMnemonicUnlock(): Promise<void> {
        await this._tagsService.setFlow("unlock");

        await this._tagsService.setTagName(this.wallet?.name as string);

        this._router.navigate(["/security/biometrics"], { queryParams: { return: "/welcome/complete" } });
    }

    fitTagNameFont(): void {
        const el = this.tagTitleRef?.nativeElement;
        const text = this.wallet?.fullTagName?.trim();

        if (!el || !text) {
            return;
        }

        const parent = el.parentElement;
        const rawWidth = parent?.clientWidth ?? el.clientWidth;
        // Match horizontal padding on .welcome-complete__tag-title (4px each side).
        const available = Math.max(0, rawWidth - 8);
        if (available <= 0) {
            if (this._fitWidthRetries < 8) {
                this._fitWidthRetries += 1;
                requestAnimationFrame(() => this.fitTagNameFont());
            }
            return;
        }

        this._fitWidthRetries = 0;

        const scale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--zns-font-scale").trim()) || 1;
        const maxFont = Math.max(1, Math.floor(32 * scale));
        const minFont = Math.max(1, Math.floor(TAG_TITLE_MIN_FONT_BASE_PX * scale));
        const hiBound = Math.max(minFont, maxFont);
        const fits = (): boolean => el.scrollWidth <= available + TAG_TITLE_FIT_SLACK_PX;

        let lo = minFont;
        let hi = hiBound;
        let best = minFont;

        while (lo <= hi) {
            const mid = Math.floor((lo + hi) / 2);
            el.style.fontSize = `${mid}px`;
            el.style.lineHeight = `${mid * TAG_TITLE_LINE_HEIGHT_RATIO}px`;

            if (fits()) {
                best = mid;
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }

        el.style.removeProperty("font-size");
        el.style.removeProperty("line-height");

        this.tagNameFontSizePx = best;
        this.tagNameLineHeightPx = Math.round(best * TAG_TITLE_LINE_HEIGHT_RATIO * 100) / 100;

        this._cdr.detectChanges();
        requestAnimationFrame(() => this._nudgeTagFontIfStillOverflowing(minFont, available));
    }

    /**
     * Binary search uses temporary inline styles; bound styles can measure slightly wider.
     * Shrink a few px only when scrollWidth still exceeds the padded content width.
     */
    private _nudgeTagFontIfStillOverflowing(minFont: number, contentWidth: number): void {
        const el = this.tagTitleRef?.nativeElement;
        if (!el || contentWidth <= 0) {
            return;
        }

        let size = this.tagNameFontSizePx;
        let guard = 0;

        while (size > minFont && el.scrollWidth > contentWidth + 1 && guard < 20) {
            size -= 1;
            this.tagNameFontSizePx = size;
            this.tagNameLineHeightPx = Math.round(size * TAG_TITLE_LINE_HEIGHT_RATIO * 100) / 100;
            this._cdr.detectChanges();
            guard += 1;
        }
    }
}
