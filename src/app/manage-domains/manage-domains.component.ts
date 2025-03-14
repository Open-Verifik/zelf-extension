import { debounce, DebouncedFunc } from "lodash";

import { CommonModule, NgFor, NgIf, NgTemplateOutlet } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { Router, RouterLink, RouterModule } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@ngneat/transloco";
import { ChromeService } from "app/chrome.service";
import { ConfirmationDialogComponent } from "app/confirmation-dialog/confirmation-dialog.component";
import { FirstLetterPipe } from "app/pipes/first-letter.pipe";
import { TimerPipe } from "app/pipes/timer.pipe";
import { ZelfNamePipe } from "app/pipes/zelf-name.pipe";
import { WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "manage-domains",
    standalone: true,
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
    templateUrl: "./manage-domains.component.html",
    styleUrls: ["./manage-domains.component.scss"],
})
export class ManageDomainsComponent implements OnInit, OnDestroy {
    private unsubscriber$ = new Subject<void>();
    private _loadWalletsDebounced: DebouncedFunc<() => void>;

    loading: boolean = false;
    wallets: Partial<WalletModel>[] = [];

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _chromeService: ChromeService,
        private _dialog: MatDialog,
        private _router: Router,
        private _translocoService: TranslocoService,
        private _walletService: WalletService
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

    private _openConfirmationDialog(): void {
        const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
            panelClass: "zelf-dialog",
            backdropClass: "zelf-backdrop",
            data: {
                message: this._translocoService.translate("manage_domains.last_wallet_logout"),
                confirm: this._translocoService.translate("common.confirm"),
                cancel: this._translocoService.translate("common.cancel"),
                title: this._translocoService.translate("manage_domains.logout_of_wallet_confirm"),
            },
        });

        dialogRef.afterClosed().subscribe(async (confirmed) => {
            if (!confirmed) return;

            this._chromeService.removeItem("wallet");
            this._chromeService.removeItem("wallets");

            this._router.navigate(["/welcome"]);
        });
    }

    private async _setWallets(): Promise<void> {
        const { wallet, wallets } = await this._walletService.getAllWalletsFromStorage();

        this.wallets = [wallet || {}, ...wallets];
        this.loading = false;

        this._changeDetectorRef.detectChanges();
    }

    goToPayments(): void {
        window.open("https://payment.zelf.world", "_blank");
    }

    async logoutOfWallet(wallet: Partial<WalletModel>): Promise<void> {
        if (!wallet.name) return;

        const isLastWallet = await this._walletService.logoutOfWallet(wallet as WalletModel);

        if (!isLastWallet) return;

        this._openConfirmationDialog();
    }

    showDetails(wallet: Partial<WalletModel>): boolean {
        return Boolean(wallet.publicData?.isExpired || wallet.publicData?.isExpiringSoon);
    }
}
