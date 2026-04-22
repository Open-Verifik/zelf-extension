import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { firstValueFrom, forkJoin, take } from "rxjs";

import { DatePipe, DecimalPipe, NgClass, NgIf, NgTemplateOutlet } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";

import { isEmptyTransactionApiPayload } from "app/core/utils/empty-transaction-api-payload.util";
import { AssetService, NetworkPermissions } from "app/asset.service";
import { CopyToClipboardBase } from "app/base/copy-to-clipboard/copy-to-clipboard.base";
import { ChromeService } from "app/chrome.service";
import { AddressMaskPipe } from "app/pipes/address-mask.pipe";
import { BlockchainTransactionsService } from "app/services/blockchain-transactions.service";
import { NetworkName, NetworkService } from "app/services/network.service";
import { TokenData } from "@shared/types/wallet.types";
import { WalletService } from "app/wallet.service";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";
import { TagModel } from "app/tags.service";

@Component({
    imports: [NgIf, NgTemplateOutlet, DecimalPipe, NgClass, AddressMaskPipe, DatePipe, MatButtonModule, TranslocoModule, ZelfLoaderComponent],
    selector: "transaction-receipt",
    styleUrls: ["./transaction-receipt.component.scss"],
    templateUrl: "./transaction-receipt.component.html",
})
export class TransactionReceiptComponent extends CopyToClipboardBase implements OnInit, OnDestroy {
    /**
     * Poll the tx API on a short interval (many fast requests) instead of one long server
     * round-trip. The backend returns quickly; the indexer + client together resolve the receipt.
     */
    private static readonly _RECEIPT_POLL_INTERVAL_MS = 1000;

    /**
     * Polygon source rotation: try chain RPC first (fastest signal a tx exists), then
     * fall back to the Bogota indexer for richer fields, then back to RPC. Cycles forever
     * while the backend keeps returning empty data.
     */
    private static readonly _POLYGON_SOURCE_ROTATION: ReadonlyArray<"rpc" | "bogota"> = [
        "rpc", "rpc", "rpc", "rpc", "rpc",
        "bogota", "bogota", "bogota", "bogota", "bogota",
        "rpc", "rpc", "rpc", "rpc", "rpc",
    ];

    private _timeout!: ReturnType<typeof setTimeout>;
    private _originalPendingTransaction: any = null; // Store original pending transaction to preserve amount
    private _polygonAttempt: number = 0;

    hash: string = "";
    loading: boolean = false;
    network: string = "";
    symbol: string = "";
    transaction!: any;
    tokens: TokenData[] = [];
    wallet!: Partial<TagModel> | null;


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
        private _changeDetectionRef: ChangeDetectorRef,
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
            else if (this.symbol === "BDAG") return "blockdag";
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
        const net = (network || "").trim().toLowerCase() as NetworkName;

        if (!net) return "";

        const token = await this._networkService.getNetworkToken(net);
        const fromSession = typeof token?.image === "string" ? token.image.trim() : "";

        if (fromSession) return fromSession;

        return this._networkService.getNetworkImage(net) || "";
    }

    private _handleTransactionDetailsError = (e: any) => {
        this._retryRequestTransactionDetails();

        this.loading = false;
    };

    private async _requestTransactionDetails(): Promise<void> {
        if (!this.hash) return;

        // Always try to get the original pending transaction first to preserve the amount
        // Store it in a class property so it persists across retries
        if (!this._originalPendingTransaction) {
            this._originalPendingTransaction = await this._walletService.getPendingTransaction(this.hash);
        }

        if (!this._originalPendingTransaction) {
            const swapSnap = await this._walletService.getSwapReceiptDisplay(this.hash);

            if (swapSnap && String(swapSnap.type || "").toLowerCase() === "swap") {
                this._originalPendingTransaction = swapSnap;
            }
        }

        // Use the original pending transaction if we don't have a transaction yet
        if (!this.transaction && this._originalPendingTransaction) {
            this.transaction = this._originalPendingTransaction;
        }

        this.network = this._determineNetwork();
        await this._setNetworkProperties();

        try {
            const polygonSource = this.network === "polygon" ? this._nextPolygonSource() : undefined;
            const response = await this._blockchainTransactionsService.requestTransactionDetails(this.hash, this.network, polygonSource);

            if (!response || response.data == null) return this._retryRequestTransactionDetails();

            if (isEmptyTransactionApiPayload(response.data)) return this._retryRequestTransactionDetails();

            const apiTransaction = this._blockchainTransactionsService.processTransactionResponse(response, this.network);

            if (!apiTransaction) return this._retryRequestTransactionDetails();

            // Merge API response with original pending transaction, preserving original amount, fee, and total
            // Always use _originalPendingTransaction to ensure we preserve the original values
            const merged = this._mergeTransactionData(this._originalPendingTransaction || this.transaction, apiTransaction);

            this.transaction = this._overlayPendingSwapLegs(merged);

            if (!this.transaction.network) this.transaction.network = this.network;

            this.transaction.networkSymbol = this._networkService.getNetworkSymbol(this.transaction.network.toLowerCase() as NetworkName);

            await this._setNetworkProperties();
            this._changeDetectionRef.markForCheck();

            this.loading = false;

            if (this.transaction.status === "pending") this._retryRequestTransactionDetails();
            else this._walletService.removePendingTransaction(this.hash);


        } catch (error) {
            this._handleTransactionDetailsError(error);
        }
    }



    /**
     * Merges API transaction response with pending transaction data.
     * Uses the shared mergeTransactionData method from WalletService.
     * This ensures consistent merging logic across the application.
     */
    private _mergeTransactionData(originalPending: any, apiResponse: any): any {
        // Delegate to the shared utility method in WalletService
        return this._walletService.mergeTransactionData(originalPending, apiResponse);
    }

    /**
     * Pending swap rows are what the user confirmed (source/target symbols and amounts).
     * Indexer/API merge can mis-attribute legs (USDC→AVAX shown as AVAX→USDt); prefer pending for display.
     */
    private _overlayPendingSwapLegs(merged: any): any {
        const pending = this._originalPendingTransaction;

        if (!pending || String(pending.type || "").toLowerCase() !== "swap") {
            return merged;
        }

        const src = Number(pending.amount);

        if (Number.isNaN(src) || src <= 0) {
            return merged;
        }

        const isPresent = (v: unknown): boolean => {
            if (v === undefined || v === null) return false;
            if (typeof v === "string") return v.trim() !== "";
            if (typeof v === "number") return !Number.isNaN(v);

            return true;
        };

        const pick = (pVal: unknown, pAlt: unknown, mergedVal: unknown): unknown => {
            if (isPresent(pVal)) {
                return typeof pVal === "string" ? pVal.trim() : pVal;
            }

            if (isPresent(pAlt)) {
                return typeof pAlt === "string" ? pAlt.trim() : pAlt;
            }

            return mergedVal;
        };

        return {
            ...merged,
            type: "swap",
            amount: pending.amount,
            asset: pending.asset,
            image: pending.image,
            network: pending.network || merged.network,
            targetAmount: pick(pending.targetAmount, null, merged.targetAmount),
            targetSymbol: pick(pending.targetSymbol, pending.swapIntentToSymbol, merged.targetSymbol),
            targetImage: pick(pending.targetImage, null, merged.targetImage),
            targetAddress: pick(pending.targetAddress, null, merged.targetAddress),
            targetNetwork: pick(pending.targetNetwork, null, merged.targetNetwork),
        };
    }

    private async _retryRequestTransactionDetails(): Promise<void> {
        if (this._timeout) clearTimeout(this._timeout);
        this._timeout = setTimeout(() => {
            this._requestTransactionDetails();
        }, TransactionReceiptComponent._RECEIPT_POLL_INTERVAL_MS);
    }

    private _nextPolygonSource(): "rpc" | "bogota" {
        const rotation = TransactionReceiptComponent._POLYGON_SOURCE_ROTATION;
        const next = rotation[this._polygonAttempt % rotation.length];
        this._polygonAttempt += 1;
        return next;
    }

    private async _setNetworkProperties(): Promise<void> {
        if (!this.transaction || this.transaction.type !== "swap") return;

        const sourceNet = (this.transaction.network || "").toLowerCase() as NetworkName;
        const targetNet = (this.transaction.targetNetwork || this.transaction.network || "").toLowerCase() as NetworkName;

        this.tokenProperties.sourceImage = this.transaction.image;
        this.tokenProperties.sourceNetwork = sourceNet ? this._networkSymbol(sourceNet) : "";
        this.tokenProperties.sourceNetworkImage = sourceNet ? await this._networkImage(sourceNet) : "";
        this.tokenProperties.sourceNetworkSymbol = sourceNet ? this._networkService.getNetworkSymbol(sourceNet) : "";
        this.tokenProperties.sourceSymbol = this.transaction.asset;

        this.tokenProperties.targetImage = this.transaction.targetImage;
        this.tokenProperties.targetNetwork = targetNet ? this._networkSymbol(targetNet) : "";
        this.tokenProperties.targetNetworkImage = targetNet ? await this._networkImage(targetNet) : "";
        this.tokenProperties.targetNetworkSymbol = targetNet ? this._networkService.getNetworkSymbol(targetNet) : "";
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
