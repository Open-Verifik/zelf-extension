import { CommonModule, NgFor, NgIf, NgTemplateOutlet } from "@angular/common";
import { Component } from "@angular/core";
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
export class ManageDomainsComponent {
    wallet: Partial<WalletModel> = {};
    wallets: WalletModel[] = [];
    loading: boolean = false;

    constructor(
        private _chromeService: ChromeService,
        private _dialog: MatDialog,
        private _translocoService: TranslocoService,
        private _router: Router
    ) {}

    ngOnInit(): void {
        this._setWallets().then(() => {
            this.loading = false;
        });
    }

    private _getTimeLeft(wallet: WalletModel): number {
        const expiresAt = new Date(wallet.publicData?.expiresAt).getTime();

        return expiresAt - Date.now();
    }

    private _openConfirmationDialog(): void {
        const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
            panelClass: "zelf-dialog",
            backdropClass: "zelf-backdrop",
            data: {
                message: this._translocoService.translate("last_wallet_logout"),
                confirm: this._translocoService.translate("confirm"),
                cancel: this._translocoService.translate("cancel"),
                title: this._translocoService.translate("logout_of_wallet_confirm"),
            },
        });

        dialogRef.afterClosed().subscribe(async (confirmed) => {
            if (!confirmed) return;

            this._chromeService.removeItem("wallet");
            this._chromeService.removeItem("wallets");

            this._router.navigate(["/onboarding"]);
        });
    }

    private async _setWallets(): Promise<void> {
        this.loading = true;

        let wallet = (await this._chromeService.getItem("wallet")) as WalletModel;
        let wallets = (await this._chromeService.getItem("wallets")) as WalletModel[];

        if (!wallet) {
            wallet = wallets[0];

            await this._chromeService.setItem("wallet", wallet);
        }

        this.wallet = wallet;
        this.wallets = [wallet, ...wallets];
    }

    goToPayments(): void {
        window.open("https://payment.zelf.world", "_blank");
    }

    isExpired(wallet: WalletModel): boolean {
        const timeLeft = this._getTimeLeft(wallet);

        return timeLeft <= 0;
    }

    isExpiringSoon(wallet: WalletModel): boolean {
        const oneDayInMs = 24 * 60 * 60 * 1000;
        const timeLeft = this._getTimeLeft(wallet);

        return timeLeft > 0 && timeLeft <= oneDayInMs;
    }

    async logoutOfWallet(wallet: WalletModel): Promise<void> {
        const currentWallet = await this._chromeService.getItem("wallet");
        const wallets = await this._chromeService.getItem("wallets");

        if (!wallets || !wallets.length) {
            this._openConfirmationDialog();

            return;
        }

        if (currentWallet.publicData.zelfName === wallet.publicData.zelfName) {
            await this._chromeService.removeItem("wallet");

            this.wallet = wallets.shift();
            this.wallets = [wallet, ...wallets];

            this._chromeService.setItem("wallet", this.wallet);
            this._chromeService.setItem("wallets", wallets);
        } else {
            const newWallets = wallets.filter((_wallet: WalletModel) => _wallet.publicData.zelfName !== wallet.publicData.zelfName);

            this.wallets = [wallet, ...newWallets];

            this._chromeService.setItem("wallets", this.wallets);
        }
    }

    showDetails(wallet: WalletModel): boolean {
        return this.isExpiringSoon(wallet) || this.isExpired(wallet);
    }
}
