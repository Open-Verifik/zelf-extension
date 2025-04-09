import { forkJoin, take } from "rxjs";
import { TranslocoModule, TranslocoService } from "@ngneat/transloco";

import { DatePipe, DecimalPipe, NgClass, NgIf, NgTemplateOutlet } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar } from "@angular/material/snack-bar";

import { EthereumService } from "app/eth.service";
import { AddressMaskPipe } from "app/pipes/address-mask.pipe";
import { AvaxTransactionModel, EthTransactionModel, SolTransactionModel, SuiTransactionModel, WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { CopyToClipboardBase } from "app/base/copy-to-clipboard/copy-to-clipboard.base";
import { ChromeService } from "app/chrome.service";
import { environment } from "environments/environment";
import { SuiService } from "app/services/sui.service";
import { SolanaService } from "app/solana.service";

@Component({
    imports: [NgIf, NgTemplateOutlet, DecimalPipe, NgClass, AddressMaskPipe, DatePipe, MatButtonModule, TranslocoModule],
    selector: "transaction-receipt",
    standalone: true,
    styleUrls: ["./transaction-receipt.component.scss"],
    templateUrl: "./transaction-receipt.component.html",
})
export class TransactionReceiptComponent extends CopyToClipboardBase implements OnInit, OnDestroy {
    private _timeout!: ReturnType<typeof setTimeout>;

    hash: string = "";
    loading: boolean = false;
    tokenType: string = "";
    transaction!: any;
    wallet!: Partial<WalletModel> | null;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _ethService: EthereumService,
        private _router: Router,
        private _solService: SolanaService,
        private _suiService: SuiService,
        private _walletService: WalletService,
        protected _chromeService: ChromeService,
        protected _snackBar: MatSnackBar,
        protected _translocoService: TranslocoService
    ) {
        super(_chromeService, _snackBar, _translocoService);

        forkJoin({
            params: this._activatedRoute.params.pipe(take(1)),
            queryParams: this._activatedRoute.queryParams.pipe(take(1)),
        }).subscribe((responses) => {
            this.hash = responses.params.hash;
            this.tokenType = responses.queryParams.tokenType;

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
    }

    _determineNetwork(): string {
        if (this.transaction?.network) return this.transaction?.network;
        else if (this.tokenType) {
            if (this.tokenType === "AVAX") return "avalanche";
            else if (this.tokenType === "MATIC") return "polygon";
            else if (this.tokenType === "BNB") return "binance";
            else if (this.tokenType === "ETH") return "ethereum";
            else if (this.tokenType === "ZELF" || this.tokenType === "SOL") return "solana";
            else if (this.tokenType === "SUI") return "sui";
            else return "ethereum";
        } else return "ethereum";
    }

    private async _requestTransactionDetails(): Promise<void> {
        if (!this.hash) return;
        if (!this.transaction) this.transaction = await this._walletService.getPendingTransaction(this.hash);

        const network = this._determineNetwork();

        if (network === "ethereum" || network === "avalanche") {
            this._ethService
                .requestTransactionDetails(this.hash, network)
                .then((response: any) => {
                    if (!response || !response.data) {
                        this._retryRequestTransactionDetails();

                        return;
                    }

                    response.data.symbol = this.tokenType;

                    if (network === "ethereum") {
                        this.transaction = new EthTransactionModel(response.data).toTransaction();
                    } else if (network === "avalanche") {
                        this.transaction = new AvaxTransactionModel(response.data).toTransaction();
                    }

                    this.loading = false;

                    if (this.transaction.status === "pending") {
                        this._retryRequestTransactionDetails();
                    } else {
                        this._walletService.removePendingTransaction(this.hash);
                    }
                })
                .catch(() => {
                    this._retryRequestTransactionDetails();

                    this.loading = false;
                });
        } else if (network === "sui") {
            this._suiService
                .requestTransactionDetails(this.hash)
                .then((response: any) => {
                    if (!response || !response.data) {
                        this._retryRequestTransactionDetails();

                        return;
                    }

                    response.data.symbol = this.tokenType;

                    this.transaction = new SuiTransactionModel(response.data).toTransaction();
                    this.loading = false;

                    if (this.transaction.status === "pending") {
                        this._retryRequestTransactionDetails();
                    } else {
                        this._walletService.removePendingTransaction(this.hash);
                    }
                })
                .catch(() => {
                    this._retryRequestTransactionDetails();

                    this.loading = false;
                });
        } else if (network === "solana") {
            this._solService
                .requestTransactionDetails(this.hash)
                .then((response: any) => {
                    if (!response || !response.data) {
                        this._retryRequestTransactionDetails();

                        return;
                    }

                    response.data.symbol = this.tokenType;

                    this.transaction = new SolTransactionModel(response.data).toTransaction();
                    this.loading = false;

                    if (this.transaction.status === "pending") {
                        this._retryRequestTransactionDetails();
                    } else {
                        this._walletService.removePendingTransaction(this.hash);
                    }
                })
                .catch(() => {
                    this._retryRequestTransactionDetails();

                    this.loading = false;
                });
        }
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
