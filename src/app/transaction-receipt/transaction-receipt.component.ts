import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { firstValueFrom, forkJoin, take } from "rxjs";

import { DatePipe, DecimalPipe, NgClass, NgIf, NgTemplateOutlet } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";

import { AssetService, NetworkPermissions } from "app/asset.service";
import { CopyToClipboardBase } from "app/base/copy-to-clipboard/copy-to-clipboard.base";
import { ChromeService } from "app/chrome.service";
import { AddressMaskPipe } from "app/pipes/address-mask.pipe";
import { BlockchainTransactionsService } from "app/services/blockchain-transactions.service";
import { NetworkName, NetworkService } from "app/services/network.service";
import { TokenData, WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";

@Component({
    imports: [NgIf, NgTemplateOutlet, DecimalPipe, NgClass, AddressMaskPipe, DatePipe, MatButtonModule, TranslocoModule, ZelfLoaderComponent],
    selector: "transaction-receipt",
    styleUrls: ["./transaction-receipt.component.scss"],
    templateUrl: "./transaction-receipt.component.html",
})
export class TransactionReceiptComponent extends CopyToClipboardBase implements OnInit, OnDestroy {
    private _timeout!: ReturnType<typeof setTimeout>;

    hash: string = "";
    loading: boolean = false;
    network: string = "";
    symbol: string = "";
    transaction!: any;
    tokens: TokenData[] = [];
    wallet!: Partial<WalletModel> | null;

    private CAN_SWAP: NetworkPermissions = {};

    tokenProperties: any = {
        sourceImage: "",
        sourceNetwork: "",
        sourceNetworkImage: "",
        sourceSymbol: "",
        targetImage: "",
        targetNetwork: "",
        targetNetworkImage: "",
        targetSymbol: "",
    };

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _assetService: AssetService,
        private _blockchainTransactionsService: BlockchainTransactionsService,
        private _networkService: NetworkService,
        private _router: Router,
        private _walletService: WalletService,
        protected _chromeService: ChromeService,
        protected _snackBar: MatSnackBar,
        protected _translocoService: TranslocoService
    ) {
        super(_chromeService, _snackBar, _translocoService);

        this.CAN_SWAP = this._assetService.canSwap;

        forkJoin({
            params: this._activatedRoute.params.pipe(take(1)),
            queryParams: this._activatedRoute.queryParams.pipe(take(1)),
        }).subscribe((responses) => {
            this.hash = responses.params.hash;
            this.symbol = responses.queryParams.symbol;
            this.network = responses.queryParams.network?.toLowerCase();

            if (this.loading) return;

            this._requestTransactionDetails();
        });
    }

    async ngOnInit(): Promise<void> {
        this.loading = true;

        this.tokens = await this._loadTokensFromSession();
        this.wallet = await this._walletService.getFirstWalletFromStorage();
    }

    ngOnDestroy(): void {
        clearTimeout(this._timeout);
    }

    get transactionType(): string {
        if (this.transaction?.type === "swap") return "swap";
        else return "transfer";
    }

    get networkSymbol(): string {
        return this._networkService.getNetworkSymbol(this.network?.toLowerCase() as NetworkName);
    }

    _determineNetwork(): string {
        if (this.transaction?.network || this.network) return this.transaction?.network?.toLowerCase() || this.network;
        else if (this.symbol) {
            if (this.symbol === "AVAX") return "avalanche";
            else if (this.symbol === "BTC") return "bitcoin";
            else if (this.symbol === "ETH") return "ethereum";
            else if (this.symbol === "ZNS" || this.symbol === "SOL") return "solana";
            else if (this.symbol === "BNB") return "binance";
            else if (this.symbol === "POL") return "polygon";
            else if (this.symbol === "SUI") return "sui";
            else return "ethereum";
        } else return "ethereum";
    }

    private async _fetchTokens(): Promise<TokenData[]> {
        if (!this.wallet) return [];

        const response = await firstValueFrom(this._blockchainTransactionsService.getAddressData(this.wallet));
        const result = await this._assetService.processTokensFromResponse(response, this.CAN_SWAP);

        return result.tokens;
    }

    private async _loadTokensFromSession(): Promise<TokenData[]> {
        if (this.tokens) return this.tokens;

        try {
            const sessionTokens = await this._assetService.loadTokensFromSession();

            if (sessionTokens.length > 0) {
                return sessionTokens;
            } else {
                return await this._fetchTokens();
            }
        } catch (error) {
            console.error("Error loading tokens:", error);
        }

        return [];
    }

    private _networkSymbol(network: string): string {
        return this._networkService.getNetworkSymbol(network.toLowerCase() as NetworkName);
    }

    private async _networkImage(network: string): Promise<string> {
        const token = await this._networkService.getNetworkToken(network.toLowerCase() as NetworkName);

        return token?.image || "";
    }

    private _handleTransactionDetailsError = (e: any) => {
        this._retryRequestTransactionDetails();

        this.loading = false;
    };

    private async _requestTransactionDetails(): Promise<void> {
        if (!this.hash) return;
        if (!this.transaction) this.transaction = await this._walletService.getPendingTransaction(this.hash);

        this.network = this._determineNetwork();
        this._setNetworkProperties();

        try {
            const response = await this._blockchainTransactionsService.requestTransactionDetails(this.hash, this.network);

            if (!response || !response.data) return this._retryRequestTransactionDetails();

            this.transaction = this._blockchainTransactionsService.processTransactionResponse(response, this.network);

            if (!this.transaction) return this._retryRequestTransactionDetails();

            if (!this.transaction.network) this.transaction.network = this.network;

            this.transaction.networkSymbol = this._networkService.getNetworkSymbol(this.transaction.network.toLowerCase() as NetworkName);

            this._setNetworkProperties();

            this.loading = false;

            if (this.transaction.status === "pending") this._retryRequestTransactionDetails();
            else this._walletService.removePendingTransaction(this.hash);
        } catch (error) {
            this._handleTransactionDetailsError(error);
        }
    }

    private async _retryRequestTransactionDetails(): Promise<void> {
        this._timeout = setTimeout(() => {
            this._requestTransactionDetails();
        }, 5000);
    }

    private async _setNetworkProperties(): Promise<void> {
        if (!this.transaction || this.transaction.type !== "swap") return;

        this.tokenProperties.sourceImage = this.transaction.image;
        this.tokenProperties.sourceNetwork = this._networkSymbol(this.transaction.network.toLowerCase() as NetworkName);
        this.tokenProperties.sourceNetworkImage = await this._networkImage(this.transaction.network.toLowerCase() as NetworkName);
        this.tokenProperties.sourceNetworkSymbol = this._networkService.getNetworkSymbol(this.transaction.network.toLowerCase() as NetworkName);
        this.tokenProperties.sourceSymbol = this.transaction.asset;

        this.tokenProperties.targetImage = this.transaction.targetImage;
        this.tokenProperties.targetNetwork = this._networkSymbol(this.transaction.targetNetwork.toLowerCase() as NetworkName);
        this.tokenProperties.targetNetworkImage = await this._networkImage(this.transaction.targetNetwork.toLowerCase() as NetworkName);
        this.tokenProperties.targetNetworkSymbol = this._networkService.getNetworkSymbol(this.transaction.targetNetwork.toLowerCase() as NetworkName);
        this.tokenProperties.targetSymbol = this.transaction.targetSymbol;
    }

    async copyToClipboard(value?: string): Promise<void> {
        if (!value) return;

        await this._copyToClipboard(value);
    }

    async goToHistory(): Promise<void> {
        if (this.transaction?.status === "pending") {
            this._walletService.addTransactionToPending(this.transaction);
        }

        this._router.navigate(["/activity"]);
    }

    async shareTransaction(): Promise<void> {
        if (!this.hash) return;

        const transactionUrl = this._blockchainTransactionsService.generateShareLink(this.hash, this._determineNetwork() as NetworkName);

        await this.copyToClipboard(transactionUrl);
    }
}
