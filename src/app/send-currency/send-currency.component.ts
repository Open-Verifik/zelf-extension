import { CommonModule, NgTemplateOutlet } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";
import { firstValueFrom, Subject } from "rxjs";

import { AssetService, NetworkPermissions } from "app/asset.service";
import { BitcoinService } from "app/services/bitcoin.service";
import { BlockchainTransactionsService } from "app/services/blockchain-transactions.service";
import { TokenItemComponent } from "app/token-item/token-item.component";
import { TransactionService } from "app/transaction.service";
import { TokenData, TransactionData } from "@shared/types/wallet.types";
import { WalletService } from "app/wallet.service";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";
import { TagModel } from "app/tags.service";
import { SettingsService } from "app/services/settings.service";

@Component({
    imports: [
        CommonModule,
        MatButtonModule,
        NgTemplateOutlet,
        ReactiveFormsModule,
        RouterModule,
        TokenItemComponent,
        TranslocoModule,
        ZelfLoaderComponent,
    ],
    selector: "send-currency",
    styleUrls: ["./send-currency.component.scss"],
    templateUrl: "./send-currency.component.html",
})
export class SendCurrencyComponent implements OnInit, OnDestroy {
    private unsubscriber$ = new Subject<void>();
    private CAN_SEND: NetworkPermissions = {};

    form!: UntypedFormGroup;
    loading: boolean = true;
    tokens: any[] = [];
    transactionData!: TransactionData;
    wallet: Partial<TagModel> = {};

    constructor(
        private _assetService: AssetService,
        private _blockchainTransactionsService: BlockchainTransactionsService,
        private _changeDetectionRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _transactionService: TransactionService,
        private _walletService: WalletService,
        private _settingsService: SettingsService,
        private _bitcoinService: BitcoinService
    ) {
        this.CAN_SEND = this._assetService.canSend;

        this.form = this._formBuilder.group({
            searchFilter: ["", { updateOn: "change" }],
        });

        this.loading = true;
    }

    async ngOnInit(): Promise<void> {
        this.wallet = (await this._walletService.getCurrentWallet()) || ({} as TagModel);

        this.transactionData = await this._transactionService.getCurrentTransactionData();

        await this._loadTokensFromSession();
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    get filteredTokens(): any[] {
        return this.tokens.filter((token) => {
            const searchValue = this.form.get("searchFilter")?.value.toLowerCase();

            return (
                token.name?.toLowerCase().includes(searchValue) ||
                token.symbol?.toLowerCase().includes(searchValue) ||
                token.network?.toLowerCase().includes(searchValue)
            );
        });
    }

    private _getEnabledNetworkIds(): string[] | undefined {
        const settings = this._settingsService.settings;
        if (!settings || !settings.networks) return undefined;
        return settings.networks.filter((n) => n.enabled).map((n) => n.id);
    }

    private async _loadTokensFromSession(): Promise<void> {
        try {
            const sessionTokens = await this._assetService.loadTokensFromSession();
            const enabledNetworkIds = this._getEnabledNetworkIds();

            if (sessionTokens.length) {
                this.tokens = sessionTokens.filter((token: TokenData) => {
                    if (!this.isTokenSendable(token)) return false;

                    if (enabledNetworkIds) {
                        const networkId = (token.network || "").toLowerCase();
                        return enabledNetworkIds.includes(networkId);
                    }

                    return true;
                });
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
        if (token.network === "Ethereum" && this.CAN_SEND.ETH && ["ERC-20", "ETH"].includes(token.tokenType) && token.price) return true;
        if (token.network === "Solana" && this.CAN_SEND.SOL) return true;
        if (token.network === "Avalanche" && this.CAN_SEND.AVAX) return true;
        if (token.network === "BlockDAG" && this.CAN_SEND.BDAG) return true;
        if (token.network === "Sui" && this.CAN_SEND.SUI) return true;
        if (token.network === "Binance" && this.CAN_SEND.BNB) return true;
        if (token.network === "Polygon" && this.CAN_SEND.POL) return true;
        if (token.network === "Bitcoin" && this.CAN_SEND.BTC) return true;

        return false;
    }

    private async _fetchTokens(): Promise<void> {
        try {
            if (!this.wallet || !this.wallet.publicData?.ethAddress) return;

            const enabledNetworkIds = this._getEnabledNetworkIds();
            const response = await firstValueFrom(this._blockchainTransactionsService.getAddressData(this.wallet, enabledNetworkIds));
            const result = await this._assetService.processTokensFromResponse(response, this.CAN_SEND);

            if (this.wallet.publicData?.btcAddress && (!enabledNetworkIds || enabledNetworkIds.includes("bitcoin"))) {
                try {
                    const btcBalance = await this._bitcoinService.getBitcoinBalance(this.wallet.publicData?.btcAddress);

                    if (btcBalance && btcBalance.balance > 0) {
                        const btcToken = {
                            address: this.wallet.publicData?.btcAddress,
                            amount: btcBalance.balance,
                            decimals: 8,
                            fiatBalance: btcBalance.fiatBalance,
                            name: "Bitcoin",
                            network: "Bitcoin",
                            price: btcBalance.fiatBalance / btcBalance.balance,
                            symbol: "BTC",
                            tokenType: "BTC",
                        };

                        result.tokens.push(btcToken);
                    }
                } catch (error) {
                    console.error("Error fetching Bitcoin balance:", error);
                }
            }

            this.tokens = result.tokens.filter((token: TokenData) => {
                if (!this.isTokenSendable(token)) return false;

                if (enabledNetworkIds) {
                    const networkId = (token.network || "").toLowerCase();
                    return enabledNetworkIds.includes(networkId);
                }

                return true;
            });
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

        if (
            token.tokenType === "ETH" ||
            token.tokenType === "AVAX" ||
            token.tokenType === "ERC-20" ||
            token.tokenType === "BEP-20" ||
            token.tokenType === "BNB" ||
            token.tokenType === "BSC" ||
            token.tokenType === "POL" ||
            token.tokenType === "MATIC"
        ) {
            address = this.wallet?.publicData?.ethAddress || "";
        } else if (token.tokenType === "BDAG" || token.tokenType === "BDAG-20") {
            const publicData = this.wallet?.publicData as any;
            address = publicData?.blockDAGAddress || publicData?.ethAddress || "";
        } else if (token.tokenType === "SOL" || token.tokenType === "SPL" || token.tokenType === "token") {
            address = this.wallet?.publicData?.solanaAddress || "";
            tokenType = token.symbol === "SOL" ? "SOL" : "SPL";
        } else if (token.tokenType === "BTC") {
            address = this.wallet?.publicData?.btcAddress || "";
        } else if (token.tokenType === "SUI" || token.tokenType === "SUI_TOKEN") {
            address = this.wallet?.publicData?.suiAddress || "";
        }

        if (!address) return console.error("No address found for token type:", token.tokenType, { wallet: this.wallet });

        const transactionData = new TransactionData({
            token: {
                ...token,
                tokenType: tokenType,
            },
            sender: {
                address,
                tagName: this.wallet?.tagName || "",
                domain: this.wallet?.domain || "",
                fullTagName: this.wallet?.fullTagName || "",
            },
        });

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
