import { NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, NgTemplateOutlet, UpperCasePipe } from "@angular/common";
import { ChangeDetectorRef, Component, Inject, OnDestroy } from "@angular/core";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";

import { ConfirmationDialogComponent } from "app/confirmation-dialog/confirmation-dialog.component";
import { TagModel, TagsService, TagSearchResponse } from "app/tags.service";
import { WalletService } from "app/wallet.service";
import { ZelfNameService } from "app/zelf-name-service.service";
import { environment } from "environments/environment";

type CtaSheetData = {
    wallet: Partial<TagModel>;
};

type BenefitItem = {
    title: string;
    subtitle: string;
};

@Component({
    imports: [NgIf, NgFor, NgClass, NgTemplateOutlet, NgSwitch, NgSwitchCase, NgSwitchDefault, TranslocoModule, MatButtonModule, UpperCasePipe],
    selector: "cta-sheet",
    styleUrl: "./cta-sheet.component.scss",
    templateUrl: "./cta-sheet.component.html",
})
export class CtaSheetComponent implements OnDestroy {
    private _isAvailable: boolean = false;
    private _timeUpdateInterval: any;
    private _minutesLeftCount: number = 0;
    private _secondsLeftCount: number = 0;

    benefits: BenefitItem[] = [];
    isExpanded: boolean = false;

    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: CtaSheetData,
        private _bottomSheetRef: MatBottomSheetRef<CtaSheetComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _dialog: MatDialog,
        private _router: Router,
        private _translocoService: TranslocoService,
        private _walletService: WalletService,
        private _zelfNameService: ZelfNameService,
        private _tagsService: TagsService
    ) {
        this._setBenefits();
    }

    async ngOnInit(): Promise<void> {
        if (!this.data.wallet.publicData?.isFullyExpired) {
            this._isAvailable = false;

            this._startTimeUpdateInterval();

            return;
        }

        if (this.data.wallet.available) {
            this._isAvailable = true;

            return;
        }

        await this._checkZelfNameAvailability();
    }

    ngOnDestroy(): void {
        this._stopTimeUpdateInterval();
    }

    get isAvailable(): boolean {
        return this._isAvailable;
    }

    set isAvailable(value: boolean) {
        this._isAvailable = value;
    }

    get isHold(): boolean {
        return this.data.wallet.publicData?.type !== "hold";
    }

    get isMainnet(): boolean {
        return this.data.wallet.publicData?.type === "mainnet";
    }

    get expiresAt(): string {
        return this.data.wallet.publicData?.expiresAt || "";
    }

    get gracePeriod(): Date | string {
        return this.data.wallet.publicData?.gracePeriod || "";
    }

    get secondsLeftCount(): number {
        return this._secondsLeftCount;
    }

    get minutesLeftCount(): number {
        return this._minutesLeftCount;
    }

    get secondsLeft(): number {
        const totalSeconds = Math.floor(this._getTimeDiff(this.expiresAt) / 1000);
        return Math.max(0, totalSeconds % 60);
    }

    get minutesLeft(): number {
        const timeDiff = this._getTimeDiff(this.expiresAt);
        return Math.max(0, Math.floor(timeDiff / (1000 * 60)));
    }

    get hoursLeft(): number {
        const timeDiff = this._getTimeDiff(this.expiresAt);
        return Math.max(0, Math.floor(timeDiff / (1000 * 60 * 60)));
    }

    get daysLeft(): number {
        const timeDiff = this._getTimeDiff(this.expiresAt);
        return Math.max(0, Math.floor(timeDiff / (1000 * 60 * 60 * 24)));
    }

    private async _checkZelfNameAvailability(): Promise<void> {
        const response = await this._tagsService.searchTag({
            tagName: this.data.wallet.tagName || "",
            domain: this.data.wallet.publicData?.domain || "zelf",
        });

        this._isAvailable = response?.data?.available ?? false;
    }

    private _getTimeDiff(dateToCompare: string): number {
        if (!dateToCompare) return 0;

        const now = new Date();
        const expirationDate = new Date(dateToCompare);

        const diff = expirationDate.getTime() - now.getTime();
        return diff;
    }

    private _setBenefits(): void {
        this.benefits = [
            {
                title: this._translocoService.translate("cta_sheet.benefit_1_title"),
                subtitle: this._translocoService.translate("cta_sheet.benefit_1_subtitle"),
            },
            {
                title: this._translocoService.translate("cta_sheet.benefit_2_title"),
                subtitle: this._translocoService.translate("cta_sheet.benefit_2_subtitle"),
            },
            {
                title: this._translocoService.translate("cta_sheet.benefit_3_title"),
                subtitle: this._translocoService.translate("cta_sheet.benefit_3_subtitle"),
            },
        ];
    }

    private _startTimeUpdateInterval(): void {
        this._stopTimeUpdateInterval();

        if (this.minutesLeft >= 15) return;

        this._minutesLeftCount = this.minutesLeft;
        this._secondsLeftCount = this.secondsLeft;

        this._timeUpdateInterval = setInterval(() => {
            const timeDiff = this._getTimeDiff(this.expiresAt);

            if (timeDiff <= 0) {
                this._minutesLeftCount = 0;
                this._secondsLeftCount = 0;
                return;
            }

            this._minutesLeftCount = this.minutesLeft;
            this._secondsLeftCount = this.secondsLeft;

            this._changeDetectorRef.detectChanges();
        }, 1000);
    }

    private _stopTimeUpdateInterval(): void {
        if (!this._timeUpdateInterval) return;

        clearInterval(this._timeUpdateInterval);
        this._timeUpdateInterval = null;
    }

    cancel(): void {
        this._bottomSheetRef.dismiss();
    }

    async chooseNewZelfName(): Promise<void> {
        await this._zelfNameService.setZelfName(this.data.wallet.tagName || "");
        await this._zelfNameService.setZelfProof(this.data.wallet.zelfProof || "");
        await this._zelfNameService.setZelfNameObject({ ...this.data.wallet, available: false });

        await this._walletService.setWalletsToColdStorage();

        this._router.navigate(["/welcome/recover"]);
        this._bottomSheetRef.dismiss();
    }

    confirm(): void {
        this._bottomSheetRef.dismiss(true);
    }

    async deleteWallet(): Promise<void> {
        const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
            data: {
                title: this._translocoService.translate("cta_sheet.delete_wallet_title"),
                message: this._translocoService.translate("cta_sheet.delete_wallet_message"),
                cancel: this._translocoService.translate("common.no"),
                confirm: this._translocoService.translate("common.yes"),
                destructiveButton: true,
            },
        });

        dialogRef.afterClosed().subscribe(async (result: boolean) => {
            if (!result) return;

            await this._walletService.deleteZelfProof(this.data.wallet as TagModel);

            this._bottomSheetRef.dismiss();
        });
    }

    async goToRecovery(): Promise<void> {
        const tagModel = this.data.wallet as TagModel;

        // Set data in TagsService (used by welcome-grace)
        await this._tagsService.setTagName(tagModel?.tagName);

        await this._tagsService.setDomain(tagModel?.domain || "zelf");

        // Set zelfProof in ZelfNameService (still used by welcome-grace)
        await this._zelfNameService.setZelfProof(this.data.wallet.zelfProof || "");

        // Create tagResponse from wallet data for welcome-grace
        if (this.data.wallet) {
            const tagResponse: TagSearchResponse = {
                ipfs: [],
                arweave: [],
                available: tagModel.available,
                tagName: tagModel.tagName,
                domain: tagModel.domain,
                tagObject: this.data.wallet as TagModel,
            };

            await this._tagsService.setTagResponse(tagResponse);
        }

        await this._walletService.setWalletsToColdStorage();

        await this._tagsService.setTagNameObject(tagModel);

        await this._tagsService.setDomain(tagModel.domain || "zelf");

        await this._tagsService.setTagName(tagModel.tagName);

        await this._tagsService.setZelfProof(this.data.wallet.zelfProof || "");

        if (tagModel.available) {
            this._router.navigate(["/welcome/recover"]);
        } else {
            this._router.navigate(["/welcome/grace"]);
        }

        this._bottomSheetRef.dismiss();
    }

    async goToPayments(): Promise<void> {
        const name = this.data.wallet.tagName || this.data.wallet.publicData?.tagName || this.data.wallet.name || "";
        const domain = this.data.wallet.publicData?.domain || "zelf";
        const duration = 1;

        await this._router.navigate(["/external-link"], {
            queryParams: {
                externalUrl: `${environment.paymentDomainUrl}/portfolio/payment?tagname=${name}&domain=${domain}&duration=${duration}`,
            },
        });

        this._bottomSheetRef.dismiss();
    }

    has30To16DaysLeft(dateToCompare: string): boolean {
        if (!dateToCompare) return false;

        const timeDiff = this._getTimeDiff(dateToCompare);
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        const sixteenDays = 16 * 24 * 60 * 60 * 1000;

        return timeDiff <= thirtyDays && timeDiff > sixteenDays;
    }

    has15To7DaysLeft(dateToCompare: string): boolean {
        if (!dateToCompare) return false;

        const timeDiff = this._getTimeDiff(dateToCompare);
        const fifteenDays = 15 * 24 * 60 * 60 * 1000;
        const sevenDays = 7 * 24 * 60 * 60 * 1000;

        return timeDiff <= fifteenDays && timeDiff > sevenDays;
    }

    has7DaysLeft(dateToCompare: string): boolean {
        if (!dateToCompare) return false;

        const timeDiff = this._getTimeDiff(dateToCompare);
        const sevenDays = 7 * 24 * 60 * 60 * 1000;

        return timeDiff <= sevenDays && timeDiff > 0;
    }

    isExpired(dateToCompare: string): boolean {
        if (!dateToCompare) return false;

        const timeDiff = this._getTimeDiff(dateToCompare);
        return timeDiff <= 0;
    }

    toggleExpand(): void {
        this.isExpanded = !this.isExpanded;
    }

    /**
     * Calculate dynamic font-size for zelf name labels based on length
     */
    getInfoTitleFontSize(text: string | undefined | null): string {
        const value = (text || "").toString();
        const length = value.length;

        // Base: 18px (matches SCSS). Gradually reduce for longer names.
        if (length <= 15) return "18px";
        if (length <= 20) return "16px";
        if (length <= 25) return "14px";
        if (length <= 32) return "13px";
        return "12px"; // Very long names
    }

    /**
     * Line-height proportional to chosen font-size for readability
     */
    getInfoTitleLineHeight(text: string | undefined | null): string {
        const sizePx = parseInt(this.getInfoTitleFontSize(text), 10);
        // Approximate 1.33 ratio
        return `${Math.round(sizePx * 1.33)}px`;
    }

    /**
     * Split full tag into name and ".domain" suffix, keeping suffix together (no wrap)
     */
    getTagParts(fullTagName?: string | null): { name: string; suffix: string } {
        const value = (fullTagName || "").toString();
        const lastDotIndex = value.lastIndexOf(".");
        if (lastDotIndex <= 0 || lastDotIndex === value.length - 1) {
            return { name: value, suffix: "" };
        }
        const name = value.substring(0, lastDotIndex);
        const domain = value.substring(lastDotIndex); // includes the dot
        return { name, suffix: domain };
    }

    /**
     * Dynamic size for the big title just below the chip (tagName only)
     */
    getHeaderTitleFontSize(text: string | undefined | null): string {
        const value = (text || "").toString();
        const length = value.length;
        // Base 24px as in SCSS; shrink for longer names
        if (length <= 10) return "24px";
        if (length <= 14) return "22px";
        if (length <= 18) return "20px";
        if (length <= 22) return "18px";
        return "16px";
    }

    getHeaderTitleLineHeight(text: string | undefined | null): string {
        const sizePx = parseInt(this.getHeaderTitleFontSize(text), 10);
        return `${Math.round(sizePx * 1.33)}px`;
    }
}
