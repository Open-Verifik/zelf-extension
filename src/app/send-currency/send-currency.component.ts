import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";
import { EthereumService } from "app/eth.service";
import { SolanaService } from "app/solana.service";
import { WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { TransactionService } from "app/transaction.service";
import { TokenItemComponent } from "app/token-item/token-item.component";

@Component({
    imports: [CommonModule, RouterModule, TranslocoModule, MatButtonModule, TokenItemComponent],
    selector: "send-currency",
    standalone: true,
    styleUrls: ["./send-currency.component.scss"],
    templateUrl: "./send-currency.component.html",
})
export class SendCurrencyComponent implements OnInit {
    tokens: any[] = [];
    wallet: Partial<WalletModel> = {};

    constructor(
        private _changeDetectionRef: ChangeDetectorRef,
        private _ethService: EthereumService,
        private _router: Router,
        private _solanaService: SolanaService,
        private _transactionService: TransactionService,
        private _walletService: WalletService
    ) {
        this._transactionService.fromAddress = "";
        this._transactionService.fromBalance = 0;
        this._transactionService.network = "";
        this._transactionService.toAddress = "";
        this._transactionService.selectedToken = "";
    }

    async ngOnInit(): Promise<void> {
        this.wallet = (await this._walletService.getCurrentWalletFromStorage()) as WalletModel;

        await this._getETHDetails();
        await this._getSolanaDetails();
    }

    private async _getETHDetails(): Promise<any> {
        if (!this.wallet?.ethAddress) return;

        const details = await this._ethService.getWalletDetails(this.wallet.ethAddress);

        if (!details) return;

        this._getCurrencies("Ethereum", details.data.tokenHoldings.tokens);
    }

    private async _getSolanaDetails(): Promise<any> {
        const details = await this._solanaService.getWalletDetails(this.wallet.solanaAddress);

        if (!details) return;

        this._getCurrencies("Solana", details.data.tokenHoldings.tokens);
    }

    private _getCurrencies(network: string, currencies: Array<any>): void {
        for (let index = 0; index < currencies.length; index++) {
            const token = currencies[index];

            if (network === "Solana") {
                const _token = { ...token, symbol: token.symbol || token.name, network };

                if (_token.name === "Zelf") {
                    _token.symbol = "ZNS";
                }

                this.tokens.push(_token);
            }

            if (["ERC-20", "ETH"].includes(token.tokenType) && token.price) {
                this.tokens.push({ ...token, network });
            }
        }

        this._changeDetectionRef.detectChanges();
    }

    onTokenClick(token: any): void {
        const tokenName = token.name?.toLowerCase();

        let address = "";

        if (tokenName === "ethereum") {
            address = this.wallet?.ethAddress || "";
        } else if (tokenName === "solana") {
            address = this.wallet?.solanaAddress || "";
        } else if (tokenName === "bitcoin") {
            address = this.wallet?.btcAddress || "";
        }

        if (!address) return;

        this._transactionService.selectedToken = token;
        this._transactionService.network = token.network;
        this._transactionService.fromAddress = address;
        this._transactionService.fromBalance = token.amount;
        this._transactionService.addRecentAddress();

        this._router.navigate(["/send/transaction"]);
    }
}
