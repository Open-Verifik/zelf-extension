import { Subject, takeUntil } from "rxjs";
import { TranslocoModule, TranslocoService } from "@ngneat/transloco";

import { DatePipe, DecimalPipe, NgClass, NgIf, NgTemplateOutlet } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar } from "@angular/material/snack-bar";

import { EthereumService } from "app/eth.service";
import { AddressMaskPipe } from "app/pipes/address-mask.pipe";
import { EthTransactionModel, WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { CopyToClipboardBase } from "app/base/copy-to-clipboard/copy-to-clipboard.base";
import { ChromeService } from "app/chrome.service";
import { environment } from "environments/environment";

@Component({
    imports: [NgIf, NgTemplateOutlet, DecimalPipe, NgClass, AddressMaskPipe, DatePipe, MatButtonModule, TranslocoModule],
    selector: "transaction-receipt",
    standalone: true,
    styleUrls: ["./transaction-receipt.component.scss"],
    templateUrl: "./transaction-receipt.component.html",
})
export class TransactionReceiptComponent extends CopyToClipboardBase implements OnInit, OnDestroy {
    private _notFoundErrorText: string = this._translocoService.translate("common.close");
    private _notFoundErrorTitle: string = this._translocoService.translate("errors.transaction_not_found");
    private _timeout!: ReturnType<typeof setTimeout>;
    private unsubscriber$: Subject<void> = new Subject<void>();

    loading: boolean = false;
    hash: string = "";
    transaction!: any;
    wallet!: Partial<WalletModel> | null;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _ethService: EthereumService,
        private _router: Router,
        private _walletService: WalletService,
        protected _chromeService: ChromeService,
        protected _snackBar: MatSnackBar,
        protected _translocoService: TranslocoService
    ) {
        super(_chromeService, _snackBar, _translocoService);

        this._activatedRoute.params.pipe(takeUntil(this.unsubscriber$)).subscribe((params) => {
            this.hash = params?.hash;

            if (this.loading) return;

            this._requestTransactionDetails();
        });
    }

    async ngOnInit(): Promise<void> {
        this.loading = true;
        this.wallet = await this._walletService.getFirstWalletFromStorage();
    }

    ngOnDestroy(): void {
        clearTimeout(this._timeout);

        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    private async _requestTransactionDetails(): Promise<void> {
        if (!this.hash) return;
        if (!this.transaction) this.transaction = await this._walletService.getPendingTransaction(this.hash);
        console.log(` TransactionReceiptComponent ~ _requestTransactionDetails ~ this.transaction:`, this.transaction);

        this._ethService
            .requestTransactionDetails(this.hash, this.transaction?.network.toLowerCase() || "ethereum")
            .then((response) => {
                if (!response || !response.data) {
                    this._retryRequestTransactionDetails();

                    return;
                }

                this.transaction = new EthTransactionModel(response.data).toTransaction();
                this.loading = false;

                if (this.transaction.status === "pending") {
                    this._retryRequestTransactionDetails();
                } else {
                    this._walletService.removePendingTransaction(this.hash);
                }
            })
            .catch(() => {
                this._snackBar.open(this._notFoundErrorTitle, this._notFoundErrorText, {
                    duration: 5000,
                    panelClass: "zelf-snackbar",
                    verticalPosition: "top",
                });

                this.transaction.status = "failed";
                this._walletService.addTransactionToPending(this.transaction);

                this.loading = false;
            });
    }

    private async _retryRequestTransactionDetails(): Promise<void> {
        this._timeout = setTimeout(() => {
            this._requestTransactionDetails();
        }, 2000);
    }

    async copyToClipboard(value?: string): Promise<void> {
        if (!value) return;

        await this._copyToClipboard(value);
    }

    async goToHistory(): Promise<void> {
        if (this.transaction?.status === "pending") {
            this._walletService.addTransactionToPending(this.transaction);
        }

        this._router.navigate(["/activity"]);
    }

    async shareTransaction(): Promise<void> {
        if (!this.hash) return;

        const transactionUrl = `${environment.appUrl}/transaction/${this.transaction.hash}`;

        await this.copyToClipboard(transactionUrl);
    }
}
