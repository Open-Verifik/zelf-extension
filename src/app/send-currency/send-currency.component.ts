import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";
import { TransactionData, WalletModel } from "app/wallet";
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
        SUI: true,
    };

    loading: boolean = true;
    tokens: any[] = [];
    transactionData!: TransactionData;
    wallet: Partial<WalletModel> = {};

    constructor(
        private _blockchainTransactionsService: BlockchainTransactionsService,
        private _changeDetectionRef: ChangeDetectorRef,
        private _router: Router,
        private _transactionService: TransactionService,
        private _walletService: WalletService
    ) {}

    async ngOnInit(): Promise<void> {
        this.wallet = (await this._walletService.getFirstWalletFromStorage()) || {};
        this.transactionData = await this._transactionService.getCurrentTransactionData();

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

            if (response?.sui?.data && this.CAN_SEND.SUI) {
                const balance = parseFloat(response.sui.data.balance || response.sui.data._balance || "0");
                const fiatBalance = parseFloat(response.sui.data.fiatBalance || response.sui.data._fiatBalance || "0");
                const price = parseFloat(response.sui.data.account?.price || "0");

                const suiToken = {
                    symbol: "SUI",
                    name: "Sui",
                    balance: balance.toString(),
                    amount: balance.toString(),
                    fiatBalance: fiatBalance,
                    price: price,
                    tokenType: "SUI",
                    network: "Sui",
                    image: "assets/images/sui.png",
                };

                this._getCurrencies("Sui", [suiToken]);

                if (response.sui.data.tokenHoldings?.tokens) {
                    const otherTokens = response.sui.data.tokenHoldings.tokens.filter((token: any) => token.symbol !== "SUI");
                    if (otherTokens.length > 0) {
                        this._getCurrencies("Sui", otherTokens);
                    }
                }
            }

            if (response?.avalanche?.data && this.CAN_SEND.AVAX) {
                const avalancheTokens = [];

                if ("balance" in response.avalanche.data) {
                    const price =
                        response.avalanche.data.account?.price ||
                        response.avalanche.data.price ||
                        response.avalanche.data.tokenHoldings?.tokens?.[0]?.price ||
                        "0";

                    const avaxToken = {
                        amount: response.avalanche.data.balance,
                        balance: response.avalanche.data.balance,
                        fiatBalance: response.avalanche.data.fiatBalance,
                        image: response.avalanche.data.image || "assets/images/avax.png",
                        name: "Avalanche",
                        price: parseFloat(price),
                        symbol: "AVAX",
                        tokenType: "AVAX",
                        network: "Avalanche",
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

                if (_token.name === "Zelf") _token.symbol = "ZNS";

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

            if (network === "Sui" && this.CAN_SEND.SUI) {
                if (token.tokenType === "SUI") {
                    this.tokens.push({ ...token, network });
                }
            }
        }

        this._changeDetectionRef.detectChanges();
    }

    async removeTransactionData(): Promise<void> {
        await this._transactionService.removeTransactionData();
    }

    async onTokenClick(token: any): Promise<void> {
        let address = "";

        if (token.tokenType === "ETH" || token.tokenType === "AVAX" || token.tokenType === "ERC-20") {
            address = this.wallet?.ethAddress || "";
        } else if (token.tokenType === "SOL") {
            address = this.wallet?.solanaAddress || "";
        } else if (token.tokenType === "BTC") {
            address = this.wallet?.btcAddress || "";
        } else if (token.tokenType === "SUI") {
            address = this.wallet?.suiAddress || "";
        }

        if (!address) return;

        await this._transactionService.setCurrentTransactionData(
            new TransactionData({
                token,
                sender: { address, zelfName: this.wallet?.publicData?.zelfName || "" },
            })
        );

        this._router.navigate(["/send/transaction"]);
    }
}
