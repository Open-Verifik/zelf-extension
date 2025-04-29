import { debounce, DebouncedFunc } from "lodash";
import { Subject, takeUntil } from "rxjs";

import { CommonModule, NgFor, NgIf, NgTemplateOutlet } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { Router, RouterLink, RouterModule } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";

import { ChromeService } from "app/chrome.service";
import { ConfirmationDialogComponent } from "app/confirmation-dialog/confirmation-dialog.component";
import { CtaSheetComponent } from "app/cta-sheet/cta-sheet.component";
import { FirstLetterPipe } from "app/pipes/first-letter.pipe";
import { TimerPipe } from "app/pipes/timer.pipe";
import { ZelfNamePipe } from "app/pipes/zelf-name.pipe";
import { WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { ZelfNameService } from "app/zelf-name-service.service";

@Component({
    imports: [
        CommonModule,
        FirstLetterPipe,
        MatIconModule,
        MatMenuModule,
        NgFor,
        NgIf,
        NgTemplateOutlet,
        RouterLink,
        RouterModule,
        TimerPipe,
        TranslocoModule,
        ZelfNamePipe,
    ],
    selector: "manage-domains",
    styleUrls: ["./manage-domains.component.scss"],
    templateUrl: "./manage-domains.component.html",
})
export class ManageDomainsComponent implements OnInit, OnDestroy {
    private unsubscriber$ = new Subject<void>();
    private _loadWalletsDebounced: DebouncedFunc<() => void>;

    loading: boolean = false;
    wallets: Partial<WalletModel>[] = [];

    constructor(
        private _bottomSheet: MatBottomSheet,
        private _changeDetectorRef: ChangeDetectorRef,
        private _chromeService: ChromeService,
        private _dialog: MatDialog,
        private _router: Router,
        private _translocoService: TranslocoService,
        private _walletService: WalletService,
        private _zelfNameService: ZelfNameService
    ) {
        this._loadWalletsDebounced = debounce(this._loadWallets, 1000);

        this._chromeService.onWalletChanged$.pipe(takeUntil(this.unsubscriber$)).subscribe(this._loadWalletsDebounced);
        this._chromeService.onWalletsChanged$.pipe(takeUntil(this.unsubscriber$)).subscribe(this._loadWalletsDebounced);
    }

    ngOnInit(): void {
        this._loadWallets();
    }

    ngOnDestroy(): void {
        this._loadWalletsDebounced?.cancel();

        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    private _loadWallets = () => {
        if (this.loading) return;

        this.loading = true;

        this._setWallets();
    };

    private _openConfirmationDialog(isLastWallet: boolean, wallet: Partial<WalletModel> = {}): void {
        const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
            panelClass: "zelf-dialog",
            backdropClass: "zelf-backdrop",
            data: {
                message: this._translocoService.translate(
                    isLastWallet ? "manage_domains.last_wallet_logout" : "manage_domains.logout_of_wallet_message"
                ),
                confirm: this._translocoService.translate("common.confirm"),
                cancel: this._translocoService.translate("common.cancel"),
                title: this._translocoService.translate(
                    isLastWallet ? "manage_domains.last_wallet_logout" : "manage_domains.logout_of_wallet_confirm"
                ),
            },
        });

        dialogRef.afterClosed().subscribe(async (confirmed) => {
            if (!confirmed) return;

            if (!isLastWallet) {
                await this._walletService.logoutOfWallet(wallet as WalletModel);

                return;
            }

            await this._chromeService.removeItem("wallet");
            await this._chromeService.removeItem("wallets");

            this._router.navigate(["/welcome"]);
        });
    }

    private _openCTASheet(wallet: Partial<WalletModel>): void {
        const bottomSheetRef = this._bottomSheet.open(CtaSheetComponent, {
            backdropClass: "zelf-backdrop",
            panelClass: "zelf-bottom-sheet",
            height: "100vh",
            maxHeight: "100vh",
            data: { wallet },
        });

        bottomSheetRef.afterDismissed().subscribe((confirmed) => {
            if (!confirmed) return;

            this._router.navigate(["/domain"], { queryParams: { zelfName: wallet.publicData?.zelfName } });
        });
    }

    private async _setWallets(): Promise<void> {
        const { wallet, wallets } = await this._walletService.getAllWalletsFromStorage();

        this.wallets = [wallet || {}, ...wallets];
        this.loading = false;

        this._changeDetectorRef.detectChanges();
    }

    downloadZelfProof(wallet: Partial<WalletModel>): void {
        if (!wallet.name) return;

        const link = document.createElement("a");

        link.href = wallet?.image as string;
        link.download = `zelfproof_${wallet?.publicData?.zelfName}.png`;
        link.click();
    }

    goToDomain(wallet: Partial<WalletModel>): void {
        if (this.showDetails(wallet)) {
            this._openCTASheet(wallet);

            return;
        }

        this._router.navigate(["/domain"], { queryParams: { zelfName: wallet.publicData?.zelfName } });
    }

    goToPayments(): void {
        window.open("https://payment.zelf.world", "_blank");
    }

    async goToRecovery(wallet: Partial<WalletModel>): Promise<void> {
        await this._zelfNameService.setZelfName(wallet.publicData?.zelfName || "");
        await this._zelfNameService.setZelfProof(wallet.zelfProof || "");
        await this._zelfNameService.setZelfNameObject(wallet);

        await this._walletService.setWalletsToColdStorage();

        this._router.navigate(["/welcome/grace"]);
    }

    async logoutOfWallet(wallet: Partial<WalletModel>): Promise<void> {
        if (!wallet.name) return;

        const isLastWallet = await this._walletService.checkIfLastWallet();

        if (!isLastWallet) return this._openConfirmationDialog(isLastWallet, wallet as WalletModel);

        this._openConfirmationDialog(isLastWallet);
    }

    showDetails(wallet: Partial<WalletModel>): boolean {
        return Boolean(wallet.publicData?.isFullyExpired || wallet.publicData?.isExpiringSoon || wallet.publicData?.isInGracePeriod);
    }
}
