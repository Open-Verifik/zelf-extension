import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { forkJoin, take } from "rxjs";

import { DatePipe, DecimalPipe, NgClass, NgIf, NgTemplateOutlet } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";

import { CopyToClipboardBase } from "app/base/copy-to-clipboard/copy-to-clipboard.base";
import { ChromeService } from "app/chrome.service";
import { EthereumService } from "app/eth.service";
import { AddressMaskPipe } from "app/pipes/address-mask.pipe";
import { AvaxService } from "app/services/avax.service";
import { SuiService } from "app/services/sui.service";
import { SolanaService } from "app/solana.service";
import { AvaxTransactionModel, EthTransactionModel, SolTransactionModel, SuiTransactionModel, WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";

import { environment } from "environments/environment";

@Component({
    imports: [NgIf, NgTemplateOutlet, DecimalPipe, NgClass, AddressMaskPipe, DatePipe, MatButtonModule, TranslocoModule],
    selector: "transaction-receipt",
    styleUrls: ["./transaction-receipt.component.scss"],
    templateUrl: "./transaction-receipt.component.html",
})
export class TransactionReceiptComponent extends CopyToClipboardBase implements OnInit, OnDestroy {
    private _timeout!: ReturnType<typeof setTimeout>;

    hash: string = "";
    loading: boolean = false;
    network: string = "";
    symbol: string = "";
    transaction!: any;
    wallet!: Partial<WalletModel> | null;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _avaxService: AvaxService,
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
            this.symbol = responses.queryParams.symbol;
            this.network = responses.queryParams.network?.toLowerCase();

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
        if (this.transaction?.network || this.network) return this.transaction?.network?.toLowerCase() || this.network;
        else if (this.symbol) {
            if (this.symbol === "AVAX") return "avalanche";
            else if (this.symbol === "MATIC") return "polygon";
            else if (this.symbol === "BNB") return "binance";
            else if (this.symbol === "ETH") return "ethereum";
            else if (this.symbol === "ZELF" || this.symbol === "SOL") return "solana";
            else if (this.symbol === "SUI") return "sui";
            else return "ethereum";
        } else return "ethereum";
    }

    private async _requestTransactionDetails(): Promise<void> {
        if (!this.hash) return;
        if (!this.transaction) this.transaction = await this._walletService.getPendingTransaction(this.hash);

        const network = this._determineNetwork();

        let promise: Promise<any> | null = null;

        if (network === "ethereum") {
            promise = this._ethService.requestTransactionDetails(this.hash);

            promise.then((response: any) => {
                if (!response || !response.data) return false;

                response.data.symbol = this.symbol;

                this.transaction = new EthTransactionModel(response.data).toTransaction();

                return true;
            });
        } else if (network === "avalanche") {
            promise = this._avaxService.requestTransactionDetails(this.hash);

            promise.then((response: any) => {
                if (!response || !response.data) return false;

                response.data.symbol = this.symbol;

                this.transaction = new AvaxTransactionModel(response.data).toTransaction();

                return true;
            });
        } else if (network === "sui") {
            promise = this._suiService.requestTransactionDetails(this.hash);

            promise.then((response: any) => {
                if (!response || !response.data) return false;

                response.data.symbol = this.symbol;

                this.transaction = new SuiTransactionModel(response.data).toTransaction();

                return true;
            });
        } else if (network === "solana") {
            promise = this._solService.requestTransactionDetails(this.hash);

            promise.then((response: any) => {
                if (!response || !response.data) return false;

                response.data.symbol = this.symbol;

                this.transaction = new SolTransactionModel(response.data).toTransaction();

                return true;
            });
        }

        if (!promise) {
            this.loading = false;

            return;
        }

        promise
            .then((response: boolean) => {
                if (!response) {
                    this._retryRequestTransactionDetails();

                    return;
                }

                if (this.transaction.status === "pending") {
                    this._retryRequestTransactionDetails();
                } else {
                    this._walletService.removePendingTransaction(this.hash);
                    this.loading = false;
                }
            })
            .catch(this._handleTransactionDetailsError);
    }

    private _handleTransactionDetailsError = () => {
        this._retryRequestTransactionDetails();

        this.loading = false;
    };

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
