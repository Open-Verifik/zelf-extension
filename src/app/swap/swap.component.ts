import { TranslocoModule } from "@ngneat/transloco";
import { firstValueFrom, Subject, takeUntil } from "rxjs";

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { NgIf, NgTemplateOutlet } from "@angular/common";
import { CurrencyPipe, DecimalPipe } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from "@angular/forms";
import { AssetService, NetworkPermissions } from "app/asset.service";
import { BlockchainTransactionsService } from "app/services/blockchain-transactions.service";
import { NetworkName, NetworkService } from "app/services/network.service";
import { SwapCurrencyComponent } from "../swap-currency/swap-currency.component";
import { TokenData, WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { MatMenuModule } from "@angular/material/menu";
export type SwapSource = "source" | "target" | "";

@Component({
    imports: [
        TranslocoModule,
        NgIf,
        SwapCurrencyComponent,
        MatButtonModule,
        RouterLink,
        NgTemplateOutlet,
        ReactiveFormsModule,
        CurrencyPipe,
        DecimalPipe,
        MatMenuModule,
    ],
    selector: "swap",
    standalone: true,
    styleUrls: ["./swap.component.scss"],
    templateUrl: "./swap.component.html",
})
export class SwapComponent implements OnInit, OnDestroy {
    private unsubscriber$: Subject<void> = new Subject<void>();
    private _selectedSourceAsset: Partial<TokenData> = {};
    private _selectedTargetAsset: Partial<TokenData> = {};

    private CAN_SWAP: NetworkPermissions = {
        AVAX: true,
        BTC: false,
        ETH: true,
        SOL: true,
        SUI: true,
    };

    form!: UntypedFormGroup;
    loading: boolean = true;
    network: NetworkName = "ethereum";
    networkImage: string = "";
    networkSymbol: string = "";
    networkFee: number = 0;
    slippage: number = 0.5;
    swapBalanceDisplay: "token" | "fiat" = "token";
    swapSource: SwapSource = "";
    tokens: TokenData[] = [];
    wallet?: WalletModel;

    constructor(
        private _assetService: AssetService,
        private _blockchainTransactionsService: BlockchainTransactionsService,
        private _changeDetectionRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _networkService: NetworkService,
        private _walletService: WalletService
    ) {
        this.wallet = {} as WalletModel;

        this._initForm();

        this._assetService.sourceAsset$.pipe(takeUntil(this.unsubscriber$)).subscribe((asset) => {
            this._selectedSourceAsset = asset;
        });

        this._assetService.targetAsset$.pipe(takeUntil(this.unsubscriber$)).subscribe((asset) => {
            this._selectedTargetAsset = asset;
        });
    }

    async ngOnInit(): Promise<void> {
        this.wallet = (await this._walletService.getCurrentWallet()) as WalletModel;

        if (Object.keys(this._assetService.sourceAsset).length) this.selectedSourceAsset = this._assetService.sourceAsset;
        if (Object.keys(this._assetService.targetAsset).length) this.selectedTargetAsset = this._assetService.targetAsset;

        await this._loadTokensFromSession();
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    get hasBothAssetsSet(): boolean {
        return Object.keys(this.selectedSourceAsset).length > 0 && Object.keys(this.selectedTargetAsset).length > 0;
    }

    get targetTokenPricePerDollar(): number {
        return 1 / ((this.selectedTargetAsset?.price as number) || 1);
    }

    get selectedSourceAsset(): Partial<TokenData> {
        return this._selectedSourceAsset;
    }

    set selectedSourceAsset(asset: Partial<TokenData>) {
        this._selectedSourceAsset = asset;
        this._assetService.setSourceAsset(asset);

        this.network = asset.network as NetworkName;
        this.networkSymbol = this._networkService.getNetworkSymbol(this.network.toLowerCase());
        this.networkImage = this._walletService.getAssetImage(this.networkSymbol);

        if (!this._selectedTargetAsset?.network || this._selectedTargetAsset.network === this.network) return;

        this.selectedTargetAsset = {};
    }

    get selectedTargetAsset(): Partial<TokenData> {
        return this._selectedTargetAsset;
    }

    set selectedTargetAsset(asset: Partial<TokenData>) {
        this._selectedTargetAsset = asset;
        this._assetService.setTargetAsset(asset);
    }

    get totalSourceFiat(): number {
        return ((this.form?.get("sourceAmount")?.value as number) || 0) * ((this.selectedSourceAsset?.price as number) || 0);
    }

    get totalSourceToken(): number {
        return ((this.form?.get("sourceAmount")?.value as number) || 0) / ((this.selectedSourceAsset?.price as number) || 0);
    }

    get totalTargetFiat(): number {
        return ((this.form?.get("targetAmount")?.value as number) || 0) * ((this.selectedTargetAsset?.price as number) || 0);
    }

    get totalTargetToken(): number {
        return ((this.form?.get("targetAmount")?.value as number) || 0) / ((this.selectedTargetAsset?.price as number) || 0);
    }

    private _initForm(): void {
        this.form = this._formBuilder.group({
            sourceAmount: ["", [Validators.required, Validators.min(0)]],
            targetAmount: ["", [Validators.required, Validators.min(0)]],
        });

        this.form.get("sourceAmount")?.valueChanges.subscribe((value) => {
            if (!value || !this.selectedSourceAsset?.price || !this.selectedTargetAsset?.price) {
                this.form.get("targetAmount")?.setValue("");

                return;
            }

            const sourceValue = this.swapBalanceDisplay === "token" ? value : value / (this.selectedSourceAsset.price as number);
            const fiatValue = sourceValue * (this.selectedSourceAsset.price as number);
            const targetValue = this.swapBalanceDisplay === "token" ? fiatValue / (this.selectedTargetAsset.price as number) : fiatValue;

            this.form.get("targetAmount")?.setValue(targetValue);
        });
    }

    private async _fetchTokens(): Promise<void> {
        if (!this.wallet) return;

        const response = await firstValueFrom(this._blockchainTransactionsService.getAddressData(this.wallet));
        const result = await this._assetService.processTokensFromResponse(response, this.wallet as any, this.CAN_SWAP);

        this.tokens = result.tokens;
    }

    private async _loadTokensFromSession(): Promise<void> {
        try {
            const sessionTokens = await this._assetService.loadTokensFromSession();

            if (sessionTokens.length > 0) {
                this.tokens = sessionTokens;
            } else {
                await this._fetchTokens();
            }

            this._setDefaultSourceAsset();
            this._setDefaultTargetAsset();

            this._changeDetectionRef.detectChanges();
        } catch (error) {
            console.error("Error loading tokens:", error);
        } finally {
            this._initForm();
            this.loading = false;
        }
    }

    private _setDefaultSourceAsset(): void {
        if (!this.tokens.length) return;

        this.selectedSourceAsset = this.tokens[0];
    }

    private _setDefaultTargetAsset(): void {
        if (!this.tokens.length) return;

        this.selectedTargetAsset = this.tokens.find((token) => token.network === this.network && token !== this.tokens[0]) || {};
    }

    findToken(symbol: string): TokenData | undefined {
        return this.tokens.find((token) => token.symbol === symbol);
    }

    handleBalanceDisplayChange(): void {
        this.swapBalanceDisplay = this.swapBalanceDisplay === "token" ? "fiat" : "token";

        this.form.get("sourceAmount")?.setValue(this.swapBalanceDisplay === "token" ? this.totalSourceToken : this.totalSourceFiat, {
            emitEvent: true,
        });

        this._changeDetectionRef.detectChanges();
    }

    setAmount(modifier: number): void {
        const amount = this.selectedSourceAsset.amount as number;
        const modifiedValue = amount * modifier;

        const value = this.swapBalanceDisplay === "token" ? modifiedValue : modifiedValue * ((this.selectedSourceAsset.price as number) || 1);

        this.form.get("sourceAmount")?.setValue(value, { emitEvent: true });

        this._changeDetectionRef.detectChanges();
    }

    swapTargetWithSource(): void {
        if (!this.hasBothAssetsSet) return;

        const _tempSource = { ...this.selectedSourceAsset };
        const _tempTarget = { ...this.selectedTargetAsset };

        this.selectedSourceAsset = _tempTarget;
        this.selectedTargetAsset = _tempSource;

        const currentAmount = this.form.get("sourceAmount")?.value || 0;

        let newSourceAmount;

        if (this.swapBalanceDisplay === "token") {
            newSourceAmount = Math.min(currentAmount, this.selectedSourceAsset.amount as number);
        } else {
            const currentTokenAmount = currentAmount / ((this.selectedSourceAsset.price as number) || 1);

            newSourceAmount = Math.min(currentTokenAmount, this.selectedSourceAsset.amount as number);
            newSourceAmount = newSourceAmount * ((this.selectedSourceAsset.price as number) || 1);
        }

        this.form.get("sourceAmount")?.setValue(newSourceAmount, { emitEvent: true });

        this._changeDetectionRef.detectChanges();
    }
}
