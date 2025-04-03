import { NgFor, NgIf } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";
import { BlockchainTransactionsService } from "app/services/blockchain-transactions.service";
import { TokenItemComponent } from "app/token-item/token-item.component";
import { WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { firstValueFrom } from "rxjs";

@Component({
    imports: [NgIf, NgFor, RouterLink, TranslocoModule, MatButtonModule, TokenItemComponent],
    selector: "receive-currency",
    standalone: true,
    styleUrls: ["./receive-currency.component.scss"],
    templateUrl: "./receive-currency.component.html",
})
export class ReceiveCurrencyComponent implements OnInit {
    loading: boolean = true;
    tokens: any[] = [];
    wallet: Partial<WalletModel> = {};

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _blockchainTransactionsService: BlockchainTransactionsService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _walletService: WalletService
    ) {}

    async ngOnInit(): Promise<void> {
        this.wallet = (await this._walletService.getFirstWalletFromStorage()) || {};

        await this._loadTokens();

        this.loading = false;
    }

    private _getCurrencies(network: string, currencies: Array<any>): void {
        for (const token of currencies) {
            this._walletService.setAssetSymbol(token.symbol, token.image);

            if (network === "Solana" && this.wallet.solanaAddress) {
                const _token = { ...token, symbol: token.symbol || token.name, network, address: this.wallet.solanaAddress };

                if (_token.name === "Zelf") _token.symbol = "ZNS";
                if (_token.tokenType !== "SOL") _token.tokenType = "SOL";

                this.tokens.push(_token);

                continue;
            }

            if (network === "Ethereum" && this.wallet.ethAddress && ["ERC-20", "ETH"].includes(token.tokenType) && token.price) {
                if (token.tokenType !== "ETH" && token.tokenType !== "ERC-20") token.tokenType = "ETH";

                this.tokens.push({ ...token, network, address: this.wallet.ethAddress });

                continue;
            }

            if (network === "Avalanche" && this.wallet.ethAddress && (token.tokenType === "AVAX" || token.tokenType === "ERC-20")) {
                if (token.tokenType !== "AVAX" && token.tokenType !== "ERC-20") token.tokenType = "AVAX";

                this.tokens.push({ ...token, network, address: this.wallet.ethAddress });

                continue;
            }

            if (network === "Sui" && this.wallet.suiAddress && token.tokenType === "SUI") {
                this.tokens.push({ ...token, network, address: this.wallet.suiAddress });

                continue;
            }
        }

        this._changeDetectorRef.detectChanges();
    }

    private async _loadTokens(): Promise<void> {
        try {
            const response = await firstValueFrom(this._blockchainTransactionsService.getAddressData(this.wallet));

            if (response?.ethereum?.data?.tokenHoldings?.tokens) {
                this._getCurrencies("Ethereum", response.ethereum.data.tokenHoldings.tokens);
            }

            if (response?.solana?.data?.tokenHoldings?.tokens) {
                this._getCurrencies("Solana", response.solana.data.tokenHoldings.tokens);
            }

            if (response?.sui?.data) {
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

                    if (otherTokens.length > 0) this._getCurrencies("Sui", otherTokens);
                }
            }

            if (response?.avalanche?.data) {
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

    public getTokenName(token: string): string {
        return token === "ZELF" ? "ZELF" : token;
    }

    public redirectToQr(token: any): void {
        this._router.navigate(["qr", token.symbol, token.tokenType, token.name], { relativeTo: this._activatedRoute });
    }
}
