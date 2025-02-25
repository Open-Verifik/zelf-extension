import { Component, OnInit } from "@angular/core";

import { Router } from "@angular/router";
import { EthereumService } from "app/eth.service";
import { SolanaService } from "app/solana.service";
import { Wallet } from "app/wallet";
import { WalletService } from "app/wallet.service";

@Component({
    selector: "send-transaction",
    templateUrl: "./send-transaction.component.html",
    styleUrls: ["./send-transaction.component.scss", "../main.scss"],
})
export class SendTransactionComponent implements OnInit {
    shareables: any;
    session: any;
    wallet?: Wallet;
    tokens: Array<any> = [];
    views = ["pickReceiver", "tokens"];

    constructor(
        private _walletService: WalletService,
        private _router: Router,
        private _ethService: EthereumService,
        private _solanaService: SolanaService
    ) {
        this.shareables = {
            view: "tokens",
        };

        this._solanaService.clearTokens();
        this._ethService.clearTokens();

        this.tokens = [];
    }

    async ngOnInit(): Promise<any> {
        this.session = this._walletService.getSessionData();

        const wallet = await this._walletService.retrieveWallet();

        if (!wallet) return;

        this.wallet = wallet;

        if (!this.wallet?.ethAddress) return;

        await this._getETHDetails();

        this.tokens = this._ethService.tokens;

        await this._getSolanaDetails();

        this.tokens.push(...this._solanaService.tokens);
    }

    async _getETHDetails(): Promise<any> {
        const details = await this._ethService.getWalletDetails(this.wallet?.ethAddress);

        this._ethService.formatTokens(details);
    }

    async _getSolanaDetails(): Promise<any> {
        const details = await this._solanaService.getWalletDetails(this.wallet?.solanaAddress);

        if (!details) return;

        this._solanaService.formatTokens(details);
        this._solanaService.formatTokens(details.data.tokenHoldings.tokens);
    }

    cancel(): void {
        this._router.navigate(["/home"]);
    }

    selectToken(account: any): void {
        this.shareables.token = account;

        this.shareables.view = "pickReceiver";
    }
}
