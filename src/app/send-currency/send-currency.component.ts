import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";
import { AssetService, NetworkPermissions } from "app/asset.service";
import { BlockchainTransactionsService } from "app/services/blockchain-transactions.service";
import { TokenItemComponent } from "app/token-item/token-item.component";
import { TransactionService } from "app/transaction.service";
import { TransactionData, WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { firstValueFrom, Subject } from "rxjs";

@Component({
    imports: [CommonModule, RouterModule, TranslocoModule, MatButtonModule, TokenItemComponent],
    selector: "send-currency",
    styleUrls: ["./send-currency.component.scss"],
    templateUrl: "./send-currency.component.html",
})
export class SendCurrencyComponent implements OnInit, OnDestroy {
    private unsubscriber$ = new Subject<void>();

    private CAN_SEND: NetworkPermissions = {
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
        private _assetService: AssetService,
        private _blockchainTransactionsService: BlockchainTransactionsService,
        private _changeDetectionRef: ChangeDetectorRef,
        private _router: Router,
        private _transactionService: TransactionService,
        private _walletService: WalletService
    ) {
        this.loading = true;
    }

    async ngOnInit(): Promise<void> {
        this.wallet = (await this._walletService.getCurrentWallet()) || {};
        this.transactionData = await this._transactionService.getCurrentTransactionData();

        await this._loadTokensFromSession();
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    private async _loadTokensFromSession(): Promise<void> {
        try {
            const sessionTokens = await this._assetService.loadTokensFromSession();

            if (sessionTokens.length > 0) {
                this.tokens = sessionTokens.filter((token) => this.isTokenSendable(token));
            } else {
                await this._fetchTokens();
            }

            this._changeDetectionRef.detectChanges();
        } catch (error) {
            console.error("Error loading tokens:", error);
        } finally {
            this.loading = false;
        }
    }

    private isTokenSendable(token: any): boolean {
        if (token.network === "Ethereum" && this.CAN_SEND.ETH && ["ERC-20", "ETH"].includes(token.tokenType) && token.price) {
            return true;
        }

        if (token.network === "Solana" && this.CAN_SEND.SOL) {
            return true;
        }

        if (token.network === "Avalanche" && this.CAN_SEND.AVAX) {
            return true;
        }

        if (token.network === "Sui" && this.CAN_SEND.SUI) {
            return true;
        }

        return false;
    }

    private async _fetchTokens(): Promise<void> {
        try {
            this.loading = true;

            if (!this.wallet || !this.wallet._id) return;

            const response = await firstValueFrom(this._blockchainTransactionsService.getAddressData(this.wallet));
            const result = await this._assetService.processTokensFromResponse(response, this.wallet as any, this.CAN_SEND);

            this.tokens = result.tokens.filter((token) => this.isTokenSendable(token));
        } catch (error) {
            console.error("Error fetching tokens:", error);
        } finally {
            this.loading = false;
        }
    }

    async removeTransactionData(): Promise<void> {
        await this._transactionService.removeTransactionData();
    }

    async onTokenClick(token: any): Promise<void> {
        let address = "";
        let tokenType = token.tokenType;

        if (token.tokenType === "ETH" || token.tokenType === "AVAX" || token.tokenType === "ERC-20") {
            address = this.wallet?.ethAddress || "";
        } else if (token.tokenType === "SOL" || token.tokenType === "SPL" || token.tokenType === "token") {
            address = this.wallet?.solanaAddress || "";
            tokenType = token.symbol === "SOL" ? "SOL" : "SPL";
        } else if (token.tokenType === "BTC") {
            address = this.wallet?.btcAddress || "";
        } else if (token.tokenType === "SUI" || token.tokenType === "SUI_TOKEN") {
            address = this.wallet?.suiAddress || "";
        }

        if (!address) {
            console.error("No address found for token type:", token.tokenType);
            return;
        }

        const transactionData = new TransactionData({
            token: {
                ...token,
                tokenType: tokenType,
            },
            sender: {
                address,
                zelfName: this.wallet?.publicData?.zelfName || "",
            },
        });

        console.log("Setting transaction data:", transactionData);

        try {
            await this._transactionService.setCurrentTransactionData(transactionData);

            this._router.navigate(["/send/transaction"]);
        } catch (error) {
            console.error("Error setting transaction data:", error);
        }
    }

    async setSourceAsset(asset: any): Promise<any> {
        await this._assetService.setSourceAsset(asset);
    }
}
