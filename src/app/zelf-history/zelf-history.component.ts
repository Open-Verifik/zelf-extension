import { CurrencyPipe, DatePipe, DecimalPipe, KeyValuePipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from "@angular/common";
import { Component, OnInit, Input, OnChanges, SimpleChanges } from "@angular/core";
import { TranslocoModule } from "@ngneat/transloco";
import { AddressMaskPipe } from "app/pipes/address-mask.pipe";
import { Transaction } from "app/services/blockchain-transactions.service";

interface TokenInfo {
    symbol: string;
    image: string;
}

@Component({
    imports: [NgIf, NgClass, NgFor, NgTemplateOutlet, KeyValuePipe, DatePipe, TranslocoModule, DecimalPipe, CurrencyPipe, AddressMaskPipe],
    selector: "zelf-history",
    standalone: true,
    styleUrls: ["./zelf-history.component.scss"],
    templateUrl: "./zelf-history.component.html",
})
export class ZelfHistoryComponent implements OnChanges {
    @Input() transactions: Transaction[] = [];
    public history: Record<string, any[]> | null = null;
    public loading = false;
    private tokenImages: Map<string, string> = new Map();

    ngOnChanges(changes: SimpleChanges) {
        if (changes["transactions"] && changes["transactions"].currentValue) {
            const firstTx = this.transactions[0];
            if (firstTx?.asset && firstTx?.image) {
                this.updateTokenImage(firstTx.asset, firstTx.image);
            }
            this.processTransactions();
        }
    }

    private updateTokenImage(symbol: string, image: string) {
        if (image && !this.tokenImages.has(symbol)) {
            this.tokenImages.set(symbol, image);
        }
    }

    private getAssetImage(symbol: string): string {
        const cachedImage = this.tokenImages.get(symbol);
        if (cachedImage) {
            return cachedImage;
        }

        return `assets/images/tokens/${symbol.toLowerCase()}.png`;
    }

    private processTransactions() {
        if (!this.transactions.length) {
            this.history = null;
            return;
        }

        console.log("Transactions recibidas:", this.transactions);

        const groupedByDate: Record<string, any[]> = {};

        this.transactions.forEach((tx) => {
            const date = new Date();
            const dateStr = date.toISOString().split("T")[0];

            if (!groupedByDate[dateStr]) {
                groupedByDate[dateStr] = [];
            }

            console.log("Procesando transacción:", tx);
            console.log("Imagen del token:", tx.image);

            if (tx.asset && tx.image) {
                this.updateTokenImage(tx.asset, tx.image);
                console.log("Imagen actualizada en caché para", tx.asset, ":", tx.image);
            }

            const tokenImage = tx.image || this.getAssetImage(tx.asset);
            console.log("Imagen final a usar:", tokenImage);

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
            };

            console.log("Transacción procesada:", processedTx);
            groupedByDate[dateStr].push(processedTx);
        });

        this.history = groupedByDate;
        console.log("Historia final:", this.history);
    }
}
