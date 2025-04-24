import { CurrencyPipe, DatePipe, DecimalPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatRippleModule } from "@angular/material/core";
import { Router } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";
import { AddressMaskPipe } from "app/pipes/address-mask.pipe";
import { BlockchainTransactionsService } from "app/services/blockchain-transactions.service";
import { Transaction } from "app/wallet";
import { WalletService } from "app/wallet.service";

type TransactionType = "send" | "receive" | "trade" | "approve" | "";

type Signee = {
    address: string;
    amount: number;
    image: string;
    symbol: string;
    token: string;
};

type ProcessedTransaction = {
    fiatAmount: string;
    hash: string;
    from: Signee;
    to: Signee;
    type: TransactionType;
};

@Component({
    imports: [
        AddressMaskPipe,
        CurrencyPipe,
        DatePipe,
        DecimalPipe,
        MatRippleModule,
        MatButtonModule,
        NgClass,
        NgFor,
        NgIf,
        NgTemplateOutlet,
        TranslocoModule,
    ],
    selector: "zelf-history",
    styleUrls: ["./zelf-history.component.scss"],
    templateUrl: "./zelf-history.component.html",
})
export class ZelfHistoryComponent implements OnInit {
    @Input("token") token?: string = "";

    private currentPage = 0;

    public history: Record<string, ProcessedTransaction[]> | null = null;
    public loading = false;
    public noMoreTransactions = false;
    public transactionHashMap: Record<string, boolean> = {};

    constructor(private _blockchainTransactions: BlockchainTransactionsService, private _router: Router, private _walletService: WalletService) {}

    async ngOnInit(): Promise<void> {
        this._loadFirstTransactions();
    }

    get orderedHistory(): { date: string; transactions: ProcessedTransaction[] }[] {
        if (!this.history) return [];

        return Object.entries(this.history)
            .map(([date, transactions]) => ({
                date,
                transactions,
            }))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    private async _loadFirstTransactions(): Promise<void> {
        this.loading = true;

        const wallet = await this._walletService.getCurrentWallet();

        this._blockchainTransactions.getAddressData(wallet).subscribe({
            next: (response) => {
                if (!response) {
                    this.loading = false;
                    this.noMoreTransactions = true;
                    this.currentPage = 0;
                    this.history = null;

                    return;
                }

                this._processTransactions(response.transactions);

                this.loading = false;
            },
            error: (error) => {
                console.error("Error loading transactions:", error);
            },
        });
    }

    private _processTransactions(transactions: Transaction[], isPagination = false): void {
        if (!transactions || !transactions.length) return;

        transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        const groupedByDate: Record<string, any[]> = isPagination ? { ...this.history } : {};

        transactions.forEach((tx) => {
            if (this.transactionHashMap[tx.hash]) return;
            if (!tx.from || !tx.to || !tx.date) return;
            if (this.token && tx.asset !== this.token) return;

            const date = new Date(tx.date);
            const dateStr = date.toISOString().split("T")[0];

            if (!groupedByDate[dateStr]) groupedByDate[dateStr] = [];

            const tokenImage = tx.image || this._walletService.getAssetImage(tx.asset);

            const processedTx = {
                hash: tx.hash,
                type: tx.traffic === "OUT" ? "send" : "receive",
                from: {
                    address: Array.isArray(tx.from) ? tx.from[0] : tx.from,
                    amount: tx.amount,
                    symbol: tx.asset,
                    image: tokenImage,
                },
                to: {
                    address: Array.isArray(tx.to) ? tx.to[0] : tx.to,
                    amount: tx.amount,
                    symbol: tx.asset,
                    image: tokenImage,
                },
                fiatAmount: tx.fiatAmount,
            };

            groupedByDate[dateStr].push(processedTx);

            this.transactionHashMap[tx.hash] = true;
        });

        this.history = groupedByDate;
    }

    async loadMoreTransactions(): Promise<void> {
        this.loading = true;
        this.currentPage += 1;

        const wallet = await this._walletService.getCurrentWallet();

        this._blockchainTransactions.getTransactionHistory(wallet, { page: this.currentPage }).subscribe({
            next: (response) => {
                if (!response) {
                    this.noMoreTransactions = true;
                    this.currentPage = 0;
                    this.loading = false;

                    return;
                }

                this._processTransactions(response, true);

                this.loading = false;
            },
            error: (error) => {
                console.error("Error loading transactions:", error);
            },
        });
    }

    async navigateToTransaction(transaction: ProcessedTransaction): Promise<void> {
        this._router.navigate(["/transaction", transaction.hash], { queryParams: { symbol: transaction.from.symbol } });
    }
}
