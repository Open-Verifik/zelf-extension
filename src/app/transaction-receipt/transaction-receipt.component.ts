import { Subject, takeUntil } from "rxjs";
import QRCode from "qrcode";
import { TranslocoModule, TranslocoService } from "@ngneat/transloco";

import { DatePipe, DecimalPipe, NgClass, NgIf, NgTemplateOutlet } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar } from "@angular/material/snack-bar";

import { EthereumService } from "app/eth.service";
import { AddressMaskPipe } from "app/pipes/address-mask.pipe";
import { EthTransactionModel, Transaction, WalletModel } from "app/wallet";
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
    private unsubscriber$: Subject<void> = new Subject<void>();
    private _timeout!: ReturnType<typeof setTimeout>;

    loading: boolean = false;
    hash: string = "";
    transaction!: Transaction;
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

        this.hash = this._activatedRoute.snapshot?.params?.hash ? this._activatedRoute.snapshot.params?.hash : this._router.navigate(["/home"]);

        this._activatedRoute.params.pipe(takeUntil(this.unsubscriber$)).subscribe((params) => {
            this.hash = params?.hash;

            this._requestTransactionDetails();
        });
    }

    async ngOnInit(): Promise<void> {
        this.loading = true;
        this.wallet = await this._walletService.getCurrentWalletFromStorage();

        this._requestTransactionDetails();
    }

    ngOnDestroy(): void {
        clearTimeout(this._timeout);

        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    private _requestTransactionDetails(): void {
        if (!this.hash) return;

        this._ethService
            .requestTransactionDetails(this.hash)
            .then((response) => {
                if (!response || !response.data) return;

                this.transaction = new EthTransactionModel(response.data).toTransaction();

                this.loading = false;

                if (this.transaction.status === "pending") {
                    this._timeout = setTimeout(() => {
                        this._requestTransactionDetails();
                    }, 2000);
                }
            })
            .catch((error: any) => {
                console.error("Error fetching transaction details:", error);
                this.loading = false;
            });
    }

    async copyToClipboard(value?: string): Promise<void> {
        if (!value) return;

        await this._copyToClipboard(value);
    }

    async goToHistory(): Promise<void> {
        if (!this.transaction) return;

        if (this.transaction.status === "pending") {
            this._walletService.addTransactionToPending(this.transaction);
        } else {
            this._router.navigate(["/activity"]);
        }
    }

    async shareTransaction(): Promise<void> {
        if (!this.hash) return;

        const transactionUrl = `${environment.appUrl}/transaction/${this.transaction.hash}`;

        await this.copyToClipboard(transactionUrl);
    }
}
