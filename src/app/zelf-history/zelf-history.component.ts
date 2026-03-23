import { CurrencyPipe, DatePipe, DecimalPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatRippleModule } from "@angular/material/core";
import { Router } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";
import { AddressMaskPipe } from "app/pipes/address-mask.pipe";
import { BlockchainTransactionsService } from "app/services/blockchain-transactions.service";
import { Transaction } from "@shared/types/wallet.types";
import { WalletService } from "app/wallet.service";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";
import { SettingsService } from "app/services/settings.service";

type TransactionType = "send" | "receive" | "swap" | "approve" | "";

type Signee = {
    address: string;
    amount: number;
    image: string;
    symbol: string;
    token: string;
};

type ProcessedTransaction = {
    fiatAmount: number;
    hash: string;
    network: string;
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
        ZelfLoaderComponent,
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

    constructor(
        private _blockchainTransactions: BlockchainTransactionsService,
        private _router: Router,
        private _settingsService: SettingsService,
        private _walletService: WalletService
    ) {}

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

    private _getEnabledNetworkIds(): string[] | undefined {
        return this._settingsService.getEnabledNetworkIds();
    }

    private async _loadFirstTransactions(): Promise<void> {
        this.loading = true;

        const wallet = await this._walletService.getCurrentWallet();

        const enabledNetworks = this._getEnabledNetworkIds();

        (this.token
            ? this._blockchainTransactions.getAddressDataByToken(wallet, this.token)
            : this._blockchainTransactions.getAddressData(wallet, enabledNetworks)
        ).subscribe({
            next: async (response) => {
                if (!response) {
                    this.currentPage = 0;
                    this.loading = false;
                    this.noMoreTransactions = true;

                    return;
                }

                await this._processTransactions(response.transactions);

                this.loading = false;
            },
            error: (error) => {
                console.error("Error loading transactions:", error);
            },
        });
    }

    private _determineTransactionTraffic(tx: Transaction, wallet: any): void {
        if (tx.traffic) return;

        const fromAddr = Array.isArray(tx.from) ? tx.from[0] : tx.from || "";
        const publicData = wallet?.publicData;
        const walletEth = (publicData?.ethAddress || "").toLowerCase();
        const walletSol = (publicData?.solanaAddress || "").toLowerCase();
        const walletBtc = (publicData?.btcAddress || "").toLowerCase();
        const walletSui = (publicData?.suiAddress || "").toLowerCase();
        const walletBDAG = (publicData?.blockDAGAddress || "").toLowerCase();
        const walletXlm = publicData?.xlmAddress || "";

        const fromAddrLower = fromAddr.toLowerCase();
        const isStellarTx = tx.network === "stellar" || (walletXlm && fromAddr.startsWith("G"));

        if (isStellarTx && walletXlm && fromAddr === walletXlm) {
            tx.traffic = "OUT";
        } else if (
            (walletEth && fromAddrLower === walletEth) ||
            (walletSol && fromAddrLower === walletSol) ||
            (walletBtc && fromAddrLower === walletBtc) ||
            (walletSui && fromAddrLower === walletSui) ||
            (walletBDAG && fromAddrLower === walletBDAG)
        ) {
            tx.traffic = "OUT";
        } else {
            tx.traffic = "IN";
        }
    }

    private async _processTransactions(transactions: Transaction[], isPagination = false): Promise<void> {
        if (!transactions || !transactions.length) return;

        transactions.sort(
            (a, b) =>
                new Date(typeof b.date === "string" ? b.date : b.date * 1000).getTime() -
                new Date(typeof a.date === "string" ? a.date : a.date * 1000).getTime()
        );

        const groupedByDate: Record<string, any[]> = isPagination ? { ...this.history } : {};
        const wallet = await this._walletService.getCurrentWallet();

        transactions.forEach((tx) => {
            if (this.transactionHashMap[tx.hash] || !wallet) return;

            if (!tx.from || !tx.date) return;
            if (this.token && tx.asset !== this.token) return;

            const dateStr = new Date(tx.date).toLocaleDateString("en-US");

            if (!groupedByDate[dateStr]) groupedByDate[dateStr] = [];

            this._determineTransactionTraffic(tx, wallet);

            const type = tx.method?.toLowerCase().includes("swap") ? "swap" : tx.traffic === "OUT" ? "send" : "receive";
            const tokenImage = tx.image || this._walletService.getAssetImage(tx.asset);
            const toAddress = tx.to != null ? (Array.isArray(tx.to) ? tx.to[0] : tx.to) : "";
            const toAmount = tx.amount ?? 0;

            const processedTx = {
                fiatAmount: tx.fiatAmount ?? 0,
                hash: tx.hash,
                network: tx.network,
                type,
                from: {
                    address: Array.isArray(tx.from) ? tx.from[0] : tx.from,
                    amount: tx.amount ?? 0,
                    symbol: tx.asset,
                    image: tokenImage,
                    token: tx.asset,
                },
                to: {
                    address: toAddress,
                    amount: toAmount,
                    symbol: tx.asset,
                    image: tokenImage,
                    token: tx.asset,
                },
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
        const enabledNetworks = this._getEnabledNetworkIds();

        this._blockchainTransactions.getTransactionHistory(wallet, { page: this.currentPage }, enabledNetworks).subscribe({
            next: async (response) => {
                if (!response) {
                    this.noMoreTransactions = true;
                    this.currentPage = 0;
                    this.loading = false;

                    return;
                }

                await this._processTransactions(response, true);

                this.loading = false;
            },
            error: (error) => {
                console.error("Error loading transactions:", error);
            },
        });
    }

    async navigateToTransaction(transaction: ProcessedTransaction): Promise<void> {
        this._router.navigate(["/transaction", transaction.hash], { queryParams: { symbol: transaction.from.symbol, network: transaction.network } });
    }
}
