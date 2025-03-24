import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";
import { EthereumService } from "app/eth.service";
import { SolanaService } from "app/solana.service";
import { WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { CurrencyItemComponent } from "../currency-item/currency-item.component";

@Component({
    imports: [CommonModule, RouterModule, TranslocoModule, MatButtonModule, CurrencyItemComponent],
    selector: "send-currency",
    standalone: true,
    styleUrls: ["./send-currency.component.scss"],
    templateUrl: "./send-currency.component.html",
})
export class SendCurrencyComponent implements OnInit {
    currencies: any[] = [];
    wallet: Partial<WalletModel> = {};

    constructor(
        private _changeDetectionRef: ChangeDetectorRef,
        private _ethService: EthereumService,
        private _solanaService: SolanaService,
        private _walletService: WalletService
    ) {}

    async ngOnInit(): Promise<void> {
        this.wallet = (await this._walletService.getCurrentWalletFromStorage()) as WalletModel;

        await this._getETHDetails();
        await this._getSolanaDetails();
    }

    private async _getETHDetails(): Promise<any> {
        if (!this.wallet?.ethAddress) return;

        const details = await this._ethService.getWalletDetails(this.wallet.ethAddress);

        this._getCurrencies("Ethereum", details.data.tokenHoldings.tokens);
    }

    private async _getSolanaDetails(): Promise<any> {
        const details = await this._solanaService.getWalletDetails(this.wallet.solanaAddress);

        if (!details) return;

        this._getCurrencies("Solana", details.data.tokenHoldings.tokens);
    }

    private _getCurrencies(network: string, currencies: Array<any>): void {
        for (let index = 0; index < currencies.length; index++) {
            const currency = currencies[index];

            if (network === "Solana") {
                const _currency = { ...currency, symbol: currency.symbol || currency.name, network };

                if (_currency.name === "Zelf") {
                    _currency.symbol = "ZNS";
                }

                this.currencies.push(_currency);
            }

            if (["ERC-20", "ETH"].includes(currency.tokenType) && currency.price) {
                this.currencies.push({ ...currency, network });
            }
        }

        this._changeDetectionRef.detectChanges();
    }

    onCurrencyClick(currency: any): void {
        console.log("Currency clicked", currency);
    }
}
