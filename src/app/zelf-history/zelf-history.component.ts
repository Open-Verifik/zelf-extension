import { CurrencyPipe, DatePipe, DecimalPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { TranslocoModule } from "@ngneat/transloco";
import { AddressMaskPipe } from "app/pipes/address-mask.pipe";
import { BlockchainTransactionsService, Transaction } from "app/services/blockchain-transactions.service";
import { WalletService } from "app/wallet.service";

type TransactionType = "send" | "receive" | "trade" | "approve" | "";

type Signee = {
    address: string;
    amount: string | number;
    symbol: string;
    token: string;
    image: string;
};

type ProcessedTransaction = {
    type: TransactionType;
    from: Signee;
    to: Signee;
    fiatAmount: string;
};

@Component({
    imports: [NgIf, NgClass, NgFor, NgTemplateOutlet, DatePipe, TranslocoModule, DecimalPipe, CurrencyPipe, AddressMaskPipe],
    selector: "zelf-history",
    standalone: true,
    styleUrls: ["./zelf-history.component.scss"],
    templateUrl: "./zelf-history.component.html",
})
export class ZelfHistoryComponent implements OnInit {
    public history: Record<string, ProcessedTransaction[]> | null = null;
    public loading = false;

    constructor(private _blockchainTransactions: BlockchainTransactionsService, private _walletService: WalletService) {}

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

        const wallet = await this._walletService.getCurrentWalletFromStorage();

        this._blockchainTransactions.getAddressData(wallet).subscribe({
            next: (transactions) => {
                this.processTransactions(transactions);

                this.loading = false;
            },
            error: (error) => {
                console.error("Error loading transactions:", error);
            },
        });
    }

    private processTransactions(transactions: Transaction[]): void {
        if (!transactions.length) {
            this.history = null;

            return;
        }

        const groupedByDate: Record<string, any[]> = {};

        transactions.forEach((tx) => {
            const date = new Date(tx.date);
            const dateStr = date.toISOString().split("T")[0];

            if (!groupedByDate[dateStr]) groupedByDate[dateStr] = [];

            const tokenImage = tx.image || this._walletService.getAssetImage(tx.asset);

            const processedTx = {
                type: tx.traffic === "OUT" ? "send" : "receive",
                from: {
                    address: tx.from,
                    amount: tx.amount,
                    symbol: tx.asset,
                    image: tokenImage,
                },
                to: {
                    address: tx.to,
                    amount: tx.amount,
                    symbol: tx.asset,
                    image: tokenImage,
                },
                fiatAmount: tx.fiatAmount,
            } as ProcessedTransaction;

            groupedByDate[dateStr].push(processedTx);
        });

        this.history = groupedByDate;
    }
}
