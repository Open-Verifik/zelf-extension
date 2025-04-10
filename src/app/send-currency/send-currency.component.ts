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
import { SuiService } from "app/services/sui.service";
import { EthereumService } from "app/eth.service";
import { SolanaService } from "app/solana.service";

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
        SOL: true,
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
        private _walletService: WalletService,
        private _suiService: SuiService,
        private _ethService: EthereumService,
        private _solanaService: SolanaService
    ) {}

    async ngOnInit(): Promise<void> {
        this.wallet = (await this._walletService.getCurrentWallet()) || {};
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
                if ("balance" in response.sui.data || "_balance" in response.sui.data) {
                    const balance = parseFloat(response.sui.data.balance || response.sui.data._balance || "0");
                    const fiatBalance = parseFloat(response.sui.data.fiatBalance || response.sui.data._fiatBalance || "0");
                    const price = parseFloat(response.sui.data.account?.price || response.sui.data.price || "0");

                    const suiToken = {
                        amount: balance.toString(),
                        balance: balance.toString(),
                        fiatBalance: fiatBalance,
                        image: "assets/images/sui.png",
                        name: "Sui",
                        network: "Sui",
                        price: price,
                        symbol: "SUI",
                        tokenType: "SUI",
                    };

                    this._getCurrencies("Sui", [suiToken]);
                }

                if (response.sui.data.tokenHoldings?.tokens) {
                    this._getCurrencies("Sui", response.sui.data.tokenHoldings.tokens);
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

                if (response.avalanche.data.tokenHoldings?.tokens) {
                    avalancheTokens.push(...response.avalanche.data.tokenHoldings.tokens);
                }

                this._getCurrencies("Avalanche", avalancheTokens);
            }

            await this._getSolanaDetails();
            await this._getSuiDetails();
            await this._getAvaxDetails();

            this.loading = false;
            this._changeDetectionRef.detectChanges();
        } catch (error) {
            console.error("Error loading tokens:", error);
            this.loading = false;
        }
    }

    private async _getSolanaDetails(): Promise<void> {
        if (!this.wallet?.solanaAddress) return;

        try {
            const details = await this._solanaService.getWalletDetails(this.wallet.solanaAddress);

            if (details?.data?.tokenHoldings?.tokens) {
                const tokensToAdd = details.data.tokenHoldings.tokens
                    .filter((token: any) => token.symbol && !this.tokens.some((t) => t.symbol === token.symbol && t.network === "Solana"))
                    .map((token: any) => ({
                        ...token,
                        network: "Solana",
                        balance: parseFloat(token.balance || token.amount || "0"),
                        fiatBalance: token.fiatBalance !== null ? parseFloat(token.fiatBalance || "0") : null,
                        price: parseFloat(token.price || "0"),
                        tokenType: "SPL",
                        image: token.image || "assets/images/sol.png",
                        name: token.name || token.symbol,
                        symbol: token.symbol || token.name,
                    }));

                if (tokensToAdd.length > 0) {
                    this._getCurrencies("Solana", tokensToAdd);
                }
            }
        } catch (error) {
            console.error("Error getting Solana details:", error);
        }
    }

    private async _getSuiDetails(): Promise<void> {
        if (!this.wallet?.suiAddress) return;

        try {
            const details = await this._suiService.getWalletDetails(this.wallet.suiAddress);

            if (details?.data?.tokenHoldings?.tokens) {
                const newTokens = details.data.tokenHoldings.tokens
                    .filter((token: any) => token.symbol && !this.tokens.some((t) => t.symbol === token.symbol && t.network === "Sui"))
                    .map((token: any) => ({
                        ...token,
                        network: "Sui",
                        balance: parseFloat(token.balance || token.amount || "0"),
                        fiatBalance: token.fiatBalance !== null ? parseFloat(token.fiatBalance || "0") : null,
                        price: parseFloat(token.price || "0"),
                        tokenType: "SUI_TOKEN",
                        image: token.image || "assets/images/sui.png",
                        name: token.name || token.symbol,
                        symbol: token.symbol || token.name,
                    }));

                if (newTokens.length > 0) {
                    this.tokens.push(...newTokens);
                    this._changeDetectionRef.detectChanges();
                }
            }
        } catch (error) {}
    }

    private async _getAvaxDetails(): Promise<void> {
        if (!this.wallet?.ethAddress || !this.CAN_SEND.AVAX) return;

        try {
            const details = await this._ethService.getAvalancheWalletDetails(this.wallet.ethAddress);

            if (details?.data?.tokenHoldings?.tokens) {
                const tokensToAdd = details.data.tokenHoldings.tokens.map((token: any) => ({
                    ...token,
                    network: "Avalanche",
                }));

                this._getCurrencies("Avalanche", tokensToAdd);
            }
        } catch (error) {
            console.error("Error getting AVAX details:", error);
        }
    }

    private _getCurrencies(network: string, currencies: Array<any>): void {
        for (const token of currencies) {
            if (!token.symbol && !token.name) {
                continue;
            }

            if (network === "Solana" && this.CAN_SEND.SOL) {
                const _token = { ...token, symbol: token.symbol || token.name, network };

                if (_token.name === "Zelf") _token.symbol = "ZNS";

                this.tokens.push(_token);
            }

            if (network === "Ethereum" && this.CAN_SEND.ETH && ["ERC-20", "ETH"].includes(token.tokenType) && token.price) {
                this.tokens.push({ ...token, network });
            }

            if (network === "Avalanche" && this.CAN_SEND.AVAX) {
                const tokenKey = `${token.symbol}-${network}-${token.tokenType || "ERC-20"}`;
                const existingTokenIndex = this.tokens.findIndex((t) => `${t.symbol}-${t.network}-${t.tokenType || "ERC-20"}` === tokenKey);

                if (existingTokenIndex === -1) {
                    const avaxToken = {
                        ...token,
                        network,
                        balance: parseFloat(token.balance || token.amount || "0"),
                        fiatBalance: token.fiatBalance !== null ? parseFloat(token.fiatBalance || "0") : null,
                        price: parseFloat(token.price || "0"),
                        tokenType: token.tokenType || "ERC-20",
                        image: token.image || (token.symbol === "AVAX" ? "assets/images/avax.png" : undefined),
                        name: token.name || token.symbol,
                        symbol: token.symbol || token.name,
                    };

                    this.tokens.push(avaxToken);
                }
            }

            if (network === "Sui" && this.CAN_SEND.SUI) {
                const tokenToAdd = {
                    ...token,
                    network: "Sui",
                    balance: parseFloat(token.balance || token.amount || "0"),
                    fiatBalance: token.fiatBalance !== null ? parseFloat(token.fiatBalance || "0") : null,
                    price: parseFloat(token.price || "0"),
                    tokenType: token.symbol === "SUI" ? "SUI" : "SUI_TOKEN",
                    image: token.image || "assets/images/sui.png",
                    name: token.name || token.symbol,
                    symbol: token.symbol || token.name,
                };

                const tokenKey = `${tokenToAdd.symbol}-${tokenToAdd.network}-${tokenToAdd.tokenType}`;
                const existingTokenIndex = this.tokens.findIndex((t) => `${t.symbol}-${t.network}-${t.tokenType}` === tokenKey);

                if (existingTokenIndex === -1) {
                    this.tokens.push(tokenToAdd);
                } else {
                    this.tokens[existingTokenIndex] = tokenToAdd;
                }
            }
        }

        this.tokens.sort((a, b) => b.fiatBalance - a.fiatBalance);

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
        } else if (token.tokenType === "SUI" || token.tokenType === "SUI_TOKEN") {
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
