import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";
import { WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { TransactionService } from "app/transaction.service";
import { TokenItemComponent } from "app/token-item/token-item.component";
import { BlockchainTransactionsService } from "app/services/blockchain-transactions.service";
import { firstValueFrom } from "rxjs";

@Component({
    imports: [CommonModule, RouterModule, TranslocoModule, MatButtonModule, TokenItemComponent],
    selector: "send-currency",
    standalone: true,
    styleUrls: ["./send-currency.component.scss"],
    templateUrl: "./send-currency.component.html",
})
export class SendCurrencyComponent implements OnInit {
    private CAN_SEND = {
        AVAX: true,
        BTC: false,
        ETH: true,
        SOL: false,
    };

    loading: boolean = true;
    tokens: any[] = [];
    wallet: Partial<WalletModel> = {};

    constructor(
        private _changeDetectionRef: ChangeDetectorRef,
        private _router: Router,
        private _transactionService: TransactionService,
        private _walletService: WalletService,
        private _blockchainTransactionsService: BlockchainTransactionsService
    ) {
        this._transactionService.fromAddress = "";
        this._transactionService.fromBalance = 0;
        this._transactionService.toAddress = "";
        this._transactionService.token = "";
    }

    async ngOnInit(): Promise<void> {
        this.wallet = (await this._walletService.getFirstWalletFromStorage()) || {};

        if (this.wallet.pgp) {
            delete this.wallet.pgp;
            await this._walletService.updateCurrentWallet(this.wallet);
        }

        await this._loadTokens();

        this.loading = false;
    }

    private async _loadTokens(): Promise<void> {
        try {
            const response = await firstValueFrom(this._blockchainTransactionsService.getAddressData(this.wallet));

            if (response?.ethereum?.data?.tokenHoldings?.tokens && this.CAN_SEND.ETH) {
                this._getCurrencies("Ethereum", response.ethereum.data.tokenHoldings.tokens);
            }

            if (response?.solana?.data?.tokenHoldings?.tokens && this.CAN_SEND.SOL) {
                this._getCurrencies("Solana", response.solana.data.tokenHoldings.tokens);
            }

            if (response?.avalanche?.data && this.CAN_SEND.AVAX) {
                const avalancheTokens = [];

                if ("balance" in response.avalanche.data) {
                    const avaxToken = {
                        tokenType: "AVAX",
                        symbol: "AVAX",
                        name: "Avalanche",
                        amount: response.avalanche.data.balance,
                        price: response.avalanche.data.price,
                        fiatBalance: response.avalanche.data.fiatBalance,
                        image: response.avalanche.data.image,
                    };

                    avalancheTokens.push(avaxToken);
                }

                this._getCurrencies("Avalanche", avalancheTokens);
            }

            this.loading = false;
        } catch (error) {
            this.loading = false;
        }
    }

    private _getCurrencies(network: string, currencies: Array<any>): void {
        for (const token of currencies) {
            if (network === "Solana" && this.CAN_SEND.SOL) {
                const _token = { ...token, symbol: token.symbol || token.name, network };

                if (_token.name === "Zelf") {
                    _token.symbol = "ZNS";
                }

                this.tokens.push(_token);
            }

            if (network === "Ethereum" && this.CAN_SEND.ETH) {
                if (["ERC-20", "ETH"].includes(token.tokenType) && token.price) {
                    this.tokens.push({ ...token, network });
                }
            }

            if (network === "Avalanche" && this.CAN_SEND.AVAX) {
                if (token.tokenType === "AVAX" || token.tokenType === "ERC-20") {
                    this.tokens.push({ ...token, network });
                }
            }
        }

        this._changeDetectionRef.detectChanges();
    }

    onTokenClick(token: any): void {
        let address = "";

        if (token.network === "Ethereum" || token.network === "Avalanche") {
            address = this.wallet?.ethAddress || "";
        } else if (token.network === "Solana") {
            address = this.wallet?.solanaAddress || "";
        } else if (token.network === "Bitcoin") {
            address = this.wallet?.btcAddress || "";
        }

        if (!address) return;

        this._transactionService.token = token;
        this._transactionService.fromAddress = address;
        this._transactionService.fromBalance = token.amount;

        this._router.navigate(["/send/transaction"]);
    }
}
