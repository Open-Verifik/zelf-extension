import { NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, NgTemplateOutlet, UpperCasePipe } from "@angular/common";
import { Component, Inject, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { WalletService } from "app/wallet.service";
import { WalletModel } from "app/wallet";
import { ZelfNameService } from "app/zelf-name-service.service";
import { ConfirmationDialogComponent } from "app/confirmation-dialog/confirmation-dialog.component";

type CtaSheetData = {
    wallet: Partial<WalletModel>;
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
        private _zelfNameService: ZelfNameService
    ) {
        this._setBenefits();
    }

    async ngOnInit(): Promise<void> {
        if (!this.data.wallet.publicData?.isFullyExpired) {
            this._isAvailable = false;
            this._startTimeUpdateInterval();

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
        return this.data.wallet.publicData?.expiresAt as string;
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
        const response = await this._zelfNameService.searchZelfNameV2("zelfName", this.data.wallet.publicData?.zelfName || "");

        this._isAvailable = response?.data?.available || false;
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
        await this._zelfNameService.setZelfName(this.data.wallet.publicData?.zelfName || "");
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
            },
        });

        dialogRef.afterClosed().subscribe(async (result: boolean) => {
            if (!result) return;

            await this._walletService.logoutOfWallet(this.data.wallet as WalletModel);

            this._bottomSheetRef.dismiss();
        });
    }

    async goToRecovery(): Promise<void> {
        await this._zelfNameService.setZelfName(this.data.wallet.publicData?.zelfName || "");
        await this._zelfNameService.setZelfProof(this.data.wallet.zelfProof || "");
        await this._zelfNameService.setZelfNameObject(this.data.wallet);

        await this._walletService.setWalletsToColdStorage();

        this._router.navigate(["/welcome/grace"]);
        this._bottomSheetRef.dismiss();
    }

    async goToPayments(): Promise<void> {
        await this._router.navigate(["/external-link"], {
            queryParams: {
                externalUrl: `https://payment.zelf.world?zelfName=${this.data.wallet.publicData?.zelfName}`,
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
}
