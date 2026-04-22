import * as ethers from "ethers";
import { firstValueFrom, merge, Observable, Subject, takeUntil } from "rxjs";
import { debounceTime, filter, pairwise, startWith, tap } from "rxjs/operators";

import { CurrencyPipe, DecimalPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, ReactiveFormsModule, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NavigationEnd, Router } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";

import { SwapData, TokenData } from "@shared/types/wallet.types";
import { AssetService, NetworkPermissions } from "app/asset.service";
import { ChromeService } from "app/chrome.service";
import { mapTransactionErrorToTranslationKey } from "app/core/utils/user-facing-transaction-error.util";
import { BlockchainTransactionsService } from "app/services/blockchain-transactions.service";
import { LifiService } from "app/services/lifi.service";
import { NetworkName, NetworkService, NetworkSymbol } from "app/services/network.service";
import { SlippageSheetComponent } from "app/slippage-sheet/slippage-sheet.component";
import { TagModel, TagsService } from "app/tags.service";
import { TransactionService } from "app/transaction.service";
import { VaultService } from "app/vault.service";
import { WalletService } from "app/wallet.service";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";
import { SettingsService } from "app/services/settings.service";
import { environment } from "environments/environment";
import { AssetChangeData, SwapCurrencyComponent } from "../swap-currency/swap-currency.component";

export type SwapFlowMode = "swaps" | "cross_chain";

export interface SwapNetworkRow {
    displayName: string;
    extraTokenCount: number;
    icons: string[];
    id: string;
    usdTotal: number;
}

@Component({
    imports: [
        CurrencyPipe,
        DecimalPipe,
        MatButtonModule,
        MatMenuModule,
        MatProgressSpinnerModule,
        NgClass,
        NgFor,
        NgIf,
        NgTemplateOutlet,
        ReactiveFormsModule,
        SwapCurrencyComponent,
        TranslocoModule,
        ZelfLoaderComponent,
    ],
    selector: "swap",
    styleUrls: ["./swap.component.scss"],
    templateUrl: "./swap.component.html",
})
export class SwapComponent implements OnInit, OnDestroy {
    private _feeUpdateInterval: ReturnType<typeof setInterval> | null = null;
    private _mnemonics: string = "";
    private _password: string = "";
    private _requiresBiometricsInterval: ReturnType<typeof setInterval> | null = null;

    private CAN_SWAP: NetworkPermissions = {};
    private unsubscriber$: Subject<void> = new Subject<void>();
    private formUnsubscriber$: Subject<void> = new Subject<void>();

    form!: UntypedFormGroup;
    loading: boolean = true;
    network: NetworkName = "ethereum";
    networkImage: string = "";
    networkSymbol: string = "";
    passwordError: boolean = false;
    passwordSet: boolean = false;
    quoteLoading: boolean = false;
    remainingAttempts: number = 0;
    requiresBiometrics: boolean = false;
    sending: boolean = false;
    showPassword: boolean = false;
    slippage: number = 0.5;
    swapBalanceDisplay: "token" | "fiat" = "token";
    swapData: SwapData = new SwapData({});
    swapError: string = "";
    swapQuote: any = null;
    swapSource: "network" | "source" | "target" | "" = "";
    swapMode: SwapFlowMode = "swaps";
    networkPickerSearch = "";
    selectedSwapNetworkId: string | null = null;
    tokens: TokenData[] = [];
    transactionHash: string = "";
    wallet?: TagModel;
    swapExecuting: boolean = false;
    swapExecuted: boolean = false;
    swapLoading: boolean = false;
    /** When true, returning from e.g. transaction receipt may refresh balances / clear stale quote. */
    private _swapNavRefreshReady = false;

    bridgeOptions = [
        {
            label: "Li.Fi",
            value: "li.fi",
        },
    ];

    selectedSourceAsset: Partial<TokenData> = {};
    selectedTargetAsset: Partial<TokenData> = {};

    constructor(
        private _assetService: AssetService,
        private _blockchainTransactionsService: BlockchainTransactionsService,
        private _bottomSheet: MatBottomSheet,
        private _changeDetectionRef: ChangeDetectorRef,
        private _chromeService: ChromeService,
        private _formBuilder: FormBuilder,
        private _lifiService: LifiService,
        private _networkService: NetworkService,
        private _router: Router,
        private _snackBar: MatSnackBar,
        private _transactionService: TransactionService,
        private _translocoService: TranslocoService,
        private _vaultService: VaultService,
        private _walletService: WalletService,
        private _tagsService: TagsService,
        private _settingsService: SettingsService
    ) {
        this.CAN_SWAP = this._assetService.canSwap;
        this.wallet = {} as TagModel;
        this.remainingAttempts = this._vaultService.remainingAttempts;

        this._mnemonics = "";
        this._password = this._vaultService.password;

        this._vaultService.mnemonic = "";
        this._vaultService.password = "";

        if (this._password && this._password.trim()) {
            this.passwordSet = true;
            this.requiresBiometrics = false;
        }

        this._setRequiresBiometricsInterval();
    }

    async ngOnInit(): Promise<void> {
        this._router.events
            .pipe(
                filter((e): e is NavigationEnd => e instanceof NavigationEnd),
                startWith(null as NavigationEnd | null),
                pairwise(),
                takeUntil(this.unsubscriber$)
            )
            .subscribe(([prev, curr]) => {
                void this._onNavigationMayRequireSwapRefresh(prev, curr);
            });

        this.wallet = (await this._walletService.getCurrentWallet()) as TagModel;

        this._initForm();

        await this._loadTokensFromSession();
        await this._decryptMnemonics();
        await this._findPreviousSwapData();

        if (this.swapData && this.swapData.hasSwapData) {
            this._swapNavRefreshReady = true;

            return;
        }

        this.loading = false;
        this._swapNavRefreshReady = true;
    }

    ngOnDestroy(): void {
        this._clearFeeUpdateInterval();
        this._clearRequiresBiometricsInterval();

        this.unsubscriber$.next();
        this.unsubscriber$.complete();

        this.formUnsubscriber$.next();
        this.formUnsubscriber$.complete();
    }

    get canCheckQuote(): boolean {
        return (
            !this.loading &&
            !this.quoteLoading &&
            !this.sending &&
            this.hasBothAssetsSet &&
            !!this.form.get("sourceAmount")?.valid &&
            !!this.form.get("targetAsset")?.valid &&
            !this.form.errors?.crossNetwork &&
            !this.form.errors?.sameChainSwap
        );
    }

    get hasBothAssetsSet(): boolean {
        return !!this.hasSelectedSourceAsset && !!this.hasSelectedTargetAsset;
    }

    get hasSelectedSourceAsset(): boolean {
        return !!Object.keys(this.selectedSourceAsset).length;
    }

    get hasSelectedTargetAsset(): boolean {
        return !!Object.keys(this.selectedTargetAsset).length;
    }

    /**
     * Locks LiFi token fetch to one chain when the user explicitly picks NET.
     * Until then, `null` lists all swappable chains in the picker (inline filters + wallet-only tokens).
     * Cross-chain mode uses only `selectedSwapNetworkId` the same way.
     */
    get effectiveTokenPickerNetworkId(): string | null {
        if (this.swapMode !== "swaps") {
            return this.selectedSwapNetworkId;
        }

        return this.selectedSwapNetworkId ? this.selectedSwapNetworkId.toLowerCase() : null;
    }

    get targetTokenPricePerDollar(): number {
        return 1 / ((this.selectedTargetAsset?.price as number) || 1);
    }

    get totalTargetFiat(): number {
        return ((this.form?.get("targetAmount")?.value as number) || 0) * ((this.selectedTargetAsset?.price as number) || 0);
    }

    get totalTargetToken(): number {
        return ((this.form?.get("targetFiat")?.value as number) || 0) / ((this.selectedTargetAsset?.price as number) || 0);
    }

    get totalSourceFiat(): number {
        return ((this.form?.get("sourceAmount")?.value as number) || 0) * ((this.selectedSourceAsset?.price as number) || 0);
    }

    get totalSourceToken(): number {
        return ((this.form?.get("sourceFiat")?.value as number) || 0) / ((this.selectedSourceAsset?.price as number) || 0);
    }

    get heroSecondaryUsd(): number {
        return this.totalSourceFiat;
    }

    get heroSecondaryTokenAmount(): number {
        return this.totalSourceToken;
    }

    get sourceFiatInputMax(): number | null {
        const amt = parseFloat(String(this.selectedSourceAsset.amount ?? 0)) || 0;
        const price = Number(this.selectedSourceAsset.price) || 0;
        const v = amt * price;

        return v > 0 ? v : null;
    }

    get filteredNetworkPickerRows(): SwapNetworkRow[] {
        const q = this.networkPickerSearch.trim().toLowerCase();

        return this.swapNetworkPickerRows.filter((row) => !q || row.id.includes(q) || row.displayName.toLowerCase().includes(q));
    }

    get swapNetworkPickerRows(): SwapNetworkRow[] {
        const enabledIds = this._getEnabledNetworkIds();
        const rows = new Map<string, SwapNetworkRow>();

        for (const sym of Object.keys(this.CAN_SWAP)) {
            if (!this.CAN_SWAP[sym as keyof NetworkPermissions]) continue;

            const name = this._networkService.getNetworkName(sym as NetworkSymbol);
            const id = String(name).toLowerCase();

            if (!id) continue;
            if (enabledIds && !enabledIds.includes(id)) continue;

            rows.set(id, {
                id,
                displayName: id.charAt(0).toUpperCase() + id.slice(1),
                usdTotal: 0,
                icons: [],
                extraTokenCount: 0,
            });
        }

        const iconBuckets = new Map<string, string[]>();

        for (const t of this.tokens) {
            const id = (t.network || "").toLowerCase();

            if (!id || !rows.has(id)) continue;

            const row = rows.get(id)!;
            const fiat = parseFloat(String(t.fiatBalance ?? 0)) || 0;
            const amt = parseFloat(String(t.amount ?? 0)) || 0;
            const price = (t.price as number) || 0;

            row.usdTotal += fiat > 0 ? fiat : amt * price;

            const icon = t.image || this._walletService.getAssetImage(t.symbol as string, t.image);

            if (icon) {
                if (!iconBuckets.has(id)) iconBuckets.set(id, []);

                const list = iconBuckets.get(id)!;

                if (!list.includes(icon)) list.push(icon);
            }
        }

        rows.forEach((row, id) => {
            const list = iconBuckets.get(id) || [];

            row.icons = list.slice(0, 3);
            row.extraTokenCount = Math.max(0, list.length - 3);
        });

        return Array.from(rows.values()).sort((a, b) => b.usdTotal - a.usdTotal);
    }

    get selectedNetworkButtonLabel(): string {
        if (!this.selectedSwapNetworkId) return this._translocoService.translate("swap.all_networks");

        const row = this.swapNetworkPickerRows.find((r) => r.id === this.selectedSwapNetworkId);

        return row?.displayName || this.selectedSwapNetworkId;
    }

    private _getEnabledNetworkIds(): string[] | undefined {
        return this._settingsService.getEnabledNetworkIds();
    }

    private _sameChainSwapValidator = (): ValidatorFn => {
        return (control: AbstractControl): ValidationErrors | null => {
            if (this.swapMode !== "swaps") return null;

            const sourceAsset = control.get("sourceAsset")?.value;
            const targetAsset = control.get("targetAsset")?.value;

            if (!sourceAsset?.network || !targetAsset?.network) return null;

            if (sourceAsset.network.toLowerCase() !== targetAsset.network.toLowerCase()) return { sameChainSwap: true };

            return null;
        };
    };

    private _clearFeeUpdateInterval(): void {
        if (!this._feeUpdateInterval) return;

        clearInterval(this._feeUpdateInterval as ReturnType<typeof setInterval>);

        this._feeUpdateInterval = null;
    }

    private _clearRequiresBiometricsInterval(): void {
        if (!this._requiresBiometricsInterval) return;

        clearInterval(this._requiresBiometricsInterval as ReturnType<typeof setInterval>);
    }

    private async _decryptMnemonics(): Promise<any> {
        this.requiresBiometrics = await this._vaultService.biometricsRequired();

        if (!this.wallet?.pgp?.encryptedMessage || !this.wallet?.pgp?.privateKey || this.requiresBiometrics) {
            this.requiresBiometrics = true;

            return;
        }

        if (!this._password && !this.form.get("password")?.value) return;

        const secret = JSON.parse(await this._decryptMessage());

        this._mnemonics = secret?.mnemonic?.trim()?.toLowerCase();
        this.requiresBiometrics = !this._mnemonics;
    }

    private async _decryptMessage(): Promise<any> {
        const encryptedMessage = this.wallet?.pgp?.encryptedMessage as string;
        const privateKeyArmoured = this.wallet?.pgp?.privateKey as string;
        const passphrase = this._password || this.form.get("password")?.value;

        if (!encryptedMessage || !privateKeyArmoured || !passphrase) return;

        try {
            return await this._vaultService.decryptMessage(encryptedMessage, privateKeyArmoured, passphrase);
        } catch (error) {
            this.wallet = (await this._walletService.getCurrentWallet()) as TagModel;

            this.remainingAttempts = this._vaultService.remainingAttempts + 1;

            if (!this.wallet?.pgp) {
                this._mnemonics = "";
                this._password = "";

                this.passwordError = false;
                this.passwordSet = false;
                this.requiresBiometrics = true;
            } else {
                this.passwordError = true;
            }

            throw error;
        }
    }

    private async _fetchTokens(): Promise<void> {
        if (!this.wallet) return;

        const response = await firstValueFrom(this._blockchainTransactionsService.getAddressData(this.wallet));
        const result = await this._assetService.processTokensFromResponse(response, this.CAN_SWAP);

        this.tokens = result.tokens;
    }

    private async _findPreviousSwapData(): Promise<void> {
        this.swapData = await this._transactionService.getCurrentSwapData();

        if (this.swapData && this.swapData.hasSwapData) {
            this._initSwapData().finally(() => (this.loading = false));

            return;
        }
    }

    private _greaterThanZero(control: AbstractControl): ValidationErrors | null {
        if (control.value && control.value > 0) return null;

        return { greaterThanZero: true };
    }

    private _toTokenDecimalsFromQuote(quote: { action?: { toToken?: { decimals?: number } } }, fallback: number): number {
        const d = quote?.action?.toToken?.decimals;

        if (typeof d === "number" && Number.isFinite(d) && d >= 0 && d <= 78) {
            return Math.floor(d);
        }

        return fallback;
    }

    private _getAddressForNetwork(network: string): string {
        if (!this.wallet) return "";

        switch (network.toLowerCase()) {
            case "ethereum":
                return this.wallet.publicData?.ethAddress;
            case "solana":
                return this.wallet.publicData?.solanaAddress;
            case "avalanche":
                return this.wallet.publicData?.ethAddress;
            case "binance":
                return this.wallet.publicData?.ethAddress;
            case "polygon":
                return this.wallet.publicData?.ethAddress;
            default:
                return this.wallet.publicData?.ethAddress;
        }
    }

    private _getFeeFromQuote(quote: any): number {
        let fee = 0;

        if (!quote.estimate) return fee;

        quote.estimate.gasCosts?.forEach((gasCost: { amountUSD?: string }) => {
            if (!gasCost.amountUSD) return;

            fee += parseFloat(gasCost.amountUSD);
        });

        quote.estimate.feeCosts?.forEach((feeCost: { amountUSD?: string }) => {
            if (!feeCost.amountUSD) return;

            fee += parseFloat(feeCost.amountUSD);
        });

        quote.estimate.bridgeCosts?.forEach((bridgeCost: { amountUSD?: string }) => {
            if (!bridgeCost.amountUSD) return;

            fee += parseFloat(bridgeCost.amountUSD);
        });

        quote.estimate.executionCosts?.forEach((executionCost: { amountUSD?: string }) => {
            if (!executionCost.amountUSD) return;

            fee += parseFloat(executionCost.amountUSD);
        });

        quote.includedSteps?.forEach((step: { estimate: { feeCosts: { amountUSD?: string }[] } }) => {
            if (!step.estimate || !step.estimate.feeCosts) return;

            step.estimate.feeCosts.forEach((feeCost: { amountUSD?: string }) => {
                if (!feeCost.amountUSD) return;

                fee += parseFloat(feeCost.amountUSD);
            });
        });

        return fee;
    }

    private async _onNavigationMayRequireSwapRefresh(prev: NavigationEnd | null, curr: NavigationEnd | null): Promise<void> {
        if (!this._swapNavRefreshReady || !this.form || !curr) return;

        const curPath = curr.urlAfterRedirects.split("?")[0].replace(/\/$/, "");

        if (!curPath.endsWith("/swap")) return;

        if (!prev) return;

        const prevPath = prev.urlAfterRedirects.split("?")[0].replace(/\/$/, "");

        if (!prevPath.includes("/transaction/")) return;

        await this._refreshSwapStateAfterCompletedFlow();
    }

    /**
     * Fresh balances from API, drop stale LiFi quote/amounts, re-attach selected tokens from updated `tokens`.
     */
    private async _refreshSwapStateAfterCompletedFlow(): Promise<void> {
        this._clearFeeUpdateInterval();
        this.swapQuote = null;
        this.swapError = "";

        try {
            await this._fetchTokens();
            await this._assetService.saveTokensToSession(this.tokens);
            this._rebindPickersToFreshTokens();

            const pwd = this.form.get("password")?.value ?? "";

            this.form.patchValue(
                {
                    fee: 0,
                    password: pwd,
                    sourceAmount: "",
                    sourceFiat: 0,
                    targetAmount: "0",
                    targetFiat: 0,
                    targetSwapValue: "0",
                },
                { emitEvent: false }
            );

            this.form.updateValueAndValidity({ emitEvent: true });
        } catch (error) {
            console.error("Swap refresh after transaction failed:", error);
        }

        this._changeDetectionRef.markForCheck();
    }

    private _rebindPickersToFreshTokens(): void {
        const normNet = (n?: string) => (n || "").toLowerCase();

        const bind = (partial: Partial<TokenData>): TokenData | null => {
            if (!partial?.symbol || !partial?.network) return null;

            const hit = this.tokens.find(
                (t) => t.symbol === partial.symbol && normNet(t.network) === normNet(partial.network)
            );

            return hit || null;
        };

        const src = bind(this.selectedSourceAsset);
        const tgt = bind(this.selectedTargetAsset);

        if (src) {
            this.selectedSourceAsset = src;
            this.form.patchValue({ sourceAsset: src }, { emitEvent: false });
        } else {
            this.selectedSourceAsset = {};
            this.form.patchValue({ sourceAsset: null }, { emitEvent: false });
        }

        if (tgt) {
            this.selectedTargetAsset = tgt;
            this.form.patchValue({ targetAsset: tgt }, { emitEvent: false });
        } else {
            this.selectedTargetAsset = {};
            this.form.patchValue({ targetAsset: null }, { emitEvent: false });
        }
    }

    private async _handleSuccessfulSwap(receipt: any): Promise<void> {
        this.sending = false;
        this.swapError = "";

        if (!this.transactionHash) return;

        const raw = this.form.getRawValue();
        const srcSym = String(this.selectedSourceAsset.symbol ?? "").trim() || String(this.selectedSourceAsset.name ?? "").trim() || "Asset";
        const tgtSym = String(this.selectedTargetAsset.symbol ?? "").trim() || String(this.selectedTargetAsset.name ?? "").trim() || "Asset";

        const pendingTransactionData = {
            ...receipt,
            transactionHash: this.transactionHash,
            amount: raw.sourceAmount ?? this.form.get("sourceAmount")?.value,
            asset: srcSym,
            date: new Date().toISOString(),
            fee: raw.fee ?? this.form.get("fee")?.value,
            from: this.wallet?.publicData?.ethAddress,
            image: this.selectedSourceAsset.image,
            network: this.selectedSourceAsset.network,
            status: "pending",
            targetAddress: this.selectedTargetAsset.contractAddress ?? "",
            targetAmount: raw.targetAmount ?? this.form.get("targetAmount")?.value,
            targetImage: this.selectedTargetAsset.image,
            targetNetwork: this.selectedTargetAsset.network ?? this.selectedSourceAsset.network,
            targetSymbol: tgtSym,
            to: this.selectedTargetAsset.contractAddress,
            tokenType: srcSym,
            total: (raw.sourceAmount ?? this.form.get("sourceAmount")?.value) + (raw.fee ?? this.form.get("fee")?.value),
            type: "swap",
            swapIntentFromSymbol: srcSym,
            swapIntentToSymbol: tgtSym,
        };

        await this._walletService.addTransactionToPending(pendingTransactionData);
        await this._chromeService.removeItemSession("tokens");
        await this._chromeService.removeItemSession("tokensTtl");
        await this._transactionService.clearPersistedSwapData();

        await this._router.navigate(["/transaction", this.transactionHash], {
            queryParams: { network: this.selectedSourceAsset.network, symbol: this.selectedSourceAsset.symbol },
        });
    }

    private _initForm(): void {
        this.form = this._formBuilder.group(
            {
                bridge: ["li.fi", [Validators.required]],
                commission: [0, [Validators.required, Validators.min(0)]],
                commissionToggle: ["automatic", [Validators.required]],
                fee: [0, [Validators.required, Validators.min(0)]],
                password: [this._password || "", [Validators.required]],
                slippage: [0.5, [Validators.required, Validators.min(0), Validators.max(0.8)]],
                slippageToggle: ["automatic", [Validators.required]],
                sourceAmount: ["", [Validators.required, this._greaterThanZero]],
                sourceAsset: [null, [Validators.required]],
                sourceFiat: [0, [Validators.required, this._greaterThanZero]],
                targetAmount: [{ value: "", disabled: true }, [Validators.required, Validators.min(0)]],
                targetAsset: [null, [Validators.required, this._notMatchingValidator("sourceAsset")]],
                targetFiat: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]],
                targetSwapValue: [""],
            },
            {
                validators: [this._insufficientFundsValidator(), this._crossNetworkValidator(), this._sameChainSwapValidator()],
            }
        );

        this._setupQuoteUpdates();
    }

    private _crossNetworkValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (this.swapMode === "cross_chain") return null;

            const sourceAsset = control.get("sourceAsset");
            const targetAsset = control.get("targetAsset");

            if (!sourceAsset?.value || !targetAsset?.value) return null;

            const hasSolAsset = [sourceAsset.value.network.toLowerCase(), targetAsset.value.network.toLowerCase()].indexOf("solana") > -1;

            if (hasSolAsset && sourceAsset.value.network !== targetAsset.value.network) return { crossNetwork: true };

            return null;
        };
    }

    private async _initSwapData(): Promise<void> {
        this.swapMode = this.swapData.swapFlowMode === "cross_chain" ? "cross_chain" : "swaps";
        this.selectedSwapNetworkId = this.swapData.selectedSwapNetworkId ?? null;

        this.form.patchValue(this.swapData);

        const src = this.form.get("sourceAsset")?.value;
        const tgt = this.form.get("targetAsset")?.value;

        if (src) this.selectedSourceAsset = src;
        if (tgt) this.selectedTargetAsset = tgt;

        this.form.updateValueAndValidity({ emitEvent: true });
        this._changeDetectionRef.markForCheck();
    }

    private _insufficientFundsValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) return null;
            if (!this.swapQuote) return null;

            const sourceAmount = control.get("sourceAmount")?.value;
            const sourceAsset = control.get("sourceAsset")?.value;

            if (!sourceAmount || !sourceAsset) return null;

            const sourceBalance = sourceAsset?.amount;

            if (!sourceBalance) return null;

            return sourceBalance < sourceAmount ? { insufficientFunds: true } : null;
        };
    }

    private async _loadTokensFromSession(): Promise<void> {
        try {
            const sessionTokens = await this._assetService.loadTokensFromSession();

            if (sessionTokens.length > 0) {
                this.tokens = sessionTokens;
            } else {
                await this._fetchTokens();
            }

            this._changeDetectionRef.detectChanges();
        } catch (error) {
            console.error("Error loading tokens:", error);
        } finally {
            this._initForm();
            this.loading = false;
        }
    }

    private _notMatchingValidator(matchTo: string): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) return null;

            const targetAsset = control.value;
            const sourceAsset = control.parent?.get(matchTo)?.value;

            const targetKey = `${targetAsset?.symbol}-${targetAsset?.network}`;
            const sourceKey = `${sourceAsset?.symbol}-${sourceAsset?.network}`;

            return targetKey === sourceKey ? { mustNotMatch: true } : null;
        };
    }

    async _redirectToBiometrics(): Promise<void> {
        await this._tagsService.setFlow("unlock");

        await this._tagsService.setTagName(this.wallet?.tagName as string);

        const { password: _password, ...rest } = this.form.value;

        this._transactionService.swapData = new SwapData({
            ...rest,
            swapFlowMode: this.swapMode,
            selectedSwapNetworkId: this.selectedSwapNetworkId,
        });
        this._vaultService.password = this.form.get("password")?.value;
        this._router.navigate(["/security/biometrics"], { queryParams: { return: "/swap" } });
    }

    private _setFeeUpdateInterval(): void {
        if (!environment.production) return;

        if (this._feeUpdateInterval) this._clearFeeUpdateInterval();

        this._feeUpdateInterval = setInterval(() => {
            if (!this.canCheckQuote) return this._clearFeeUpdateInterval();

            this.getSwapQuote(true);
        }, 1000 * 15);
    }

    private _setRequiresBiometricsInterval(): void {
        if (this._requiresBiometricsInterval) this._clearRequiresBiometricsInterval();

        this._requiresBiometricsInterval = setInterval(() => {
            this._vaultService.biometricsRequired().then((result) => {
                if (!this.wallet?.pgp) this.requiresBiometrics = true;
                else this.requiresBiometrics = result;
            });
        }, 1000);
    }

    private _setupQuoteUpdates(): void {
        const sourceFiatChanges = this.form.get("sourceFiat")?.valueChanges.pipe(
            takeUntil(this.formUnsubscriber$),
            filter((value) => value !== null && value !== "")
        ) as Observable<any>;

        sourceFiatChanges?.subscribe(() => {
            if (this.swapBalanceDisplay === "token") return;

            this.form.get("sourceAmount")?.setValue(this.totalSourceToken);
            this.form.get("sourceAmount")?.markAsDirty();
            this.form.get("sourceAmount")?.markAsTouched();
            this.form.get("sourceAmount")?.updateValueAndValidity();
        });

        const sourceAmountChanges = this.form.get("sourceAmount")?.valueChanges.pipe(
            takeUntil(this.formUnsubscriber$),
            filter((value) => value !== null && value !== ""),
            tap(() => {
                if (this.swapBalanceDisplay === "fiat") return;

                this.form.get("sourceFiat")?.setValue(this.totalSourceFiat || 0);
                this.form.get("sourceFiat")?.markAsDirty();
                this.form.get("sourceFiat")?.markAsTouched();
                this.form.get("sourceFiat")?.updateValueAndValidity();
            })
        ) as Observable<any>;

        const slippageChanges = this.form.get("slippage")?.valueChanges.pipe(takeUntil(this.formUnsubscriber$)) as Observable<any>;

        const sourceAssetChanges = this.form.get("sourceAsset")?.valueChanges.pipe(
            takeUntil(this.formUnsubscriber$),
            filter((value) => !!value),
            tap((value) => (this.selectedSourceAsset = value))
        ) as Observable<any>;

        const targetAssetChanges = this.form.get("targetAsset")?.valueChanges.pipe(
            takeUntil(this.formUnsubscriber$),
            filter((value) => !!value),
            tap((value) => (this.selectedTargetAsset = value))
        ) as Observable<any>;

        const REQUIRED_QUOTE_FIELDS = ["sourceAmount", "sourceAsset", "targetAsset", "slippage"];

        merge(sourceAmountChanges, slippageChanges, sourceAssetChanges, targetAssetChanges)
            .pipe(takeUntil(this.formUnsubscriber$), debounceTime(300))
            .subscribe(async () => {
                if (this.quoteLoading) return;
                if (REQUIRED_QUOTE_FIELDS.some((field) => this.form.get(field)?.invalid)) return;

                try {
                    await this.getSwapQuote();
                } catch (error) {
                    console.error("Error getting swap quote:", error);
                } finally {
                    this.quoteLoading = false;
                }
            });
    }

    private async _validateCredentials(): Promise<boolean> {
        if (!this._password && !this.form.get("password")?.value) {
            this.openErrorSnackBar("errors.empty_password");

            return false;
        }

        if (this.requiresBiometrics) {
            await this._redirectToBiometrics();

            return false;
        }

        if (this._mnemonics) return true;

        try {
            await this._decryptMnemonics();

            if (this._mnemonics) return true;
        } catch (error: unknown) {
            if ((error as { message?: string })?.message === "expired") {
                await this._redirectToBiometrics();

                return false;
            }

            this.openErrorSnackBar("errors.invalid_credentials");

            return false;
        }

        if (this.requiresBiometrics) return false;
        if (this._mnemonics) return true;

        this.openErrorSnackBar("errors.private_key_locked");

        return false;
    }

    async confirmSwap(): Promise<void> {
        if (this.isConfirmDisabled()) return;

        this.sending = true;
        this.swapError = "";

        try {
            if (!(await this._validateCredentials())) return;

            if (!ethers.Mnemonic.isValidMnemonic(this._mnemonics)) {
                throw new Error("Invalid mnemonic");
            }

            const ethWallet = ethers.Wallet.fromPhrase(this._mnemonics);
            const sourceNetwork = this.selectedSourceAsset.network?.toLowerCase();

            const EVM_NETWORKS = ["ethereum", "avalanche", "binance", "polygon"];

            if (sourceNetwork && EVM_NETWORKS.includes(sourceNetwork)) {
                const receipt = await this._lifiService.executeEvmLiFiSwap(this.swapQuote, {
                    privateKey: ethWallet.privateKey,
                    address: ethWallet.address,
                });

                if (!receipt?.transactionHash) return;

                this.transactionHash = receipt.transactionHash;

                await this._handleSuccessfulSwap(receipt);
            } else if (sourceNetwork === "solana") {
                const receipt = await this._lifiService.executeSolanaSwap(this.swapQuote, this.wallet, this._mnemonics);

                if (!receipt?.transactionHash) return;

                this.transactionHash = receipt.transactionHash;

                await this._handleSuccessfulSwap(receipt);
            } else {
                throw new Error(`Unsupported network: ${sourceNetwork}`);
            }
        } catch (error: unknown) {
            console.error("Swap execution error:", error);
            const messageKey = mapTransactionErrorToTranslationKey(error);
            this.swapError = this._translocoService.translate(messageKey);
            this.openErrorSnackBar(messageKey);
        } finally {
            this.sending = false;
            this._changeDetectionRef.detectChanges();
        }
    }

    findToken(symbol: string): TokenData | undefined {
        return this.tokens.find((token) => token.symbol === symbol);
    }

    getBridgeLabel(): string {
        return this.bridgeOptions.find((option) => option.value === this.form.get("bridge")?.value)?.label || "";
    }

    getNetworkImage(network?: string): string {
        if (!network) return "";

        return this._walletService.getAssetImage(this._networkService.getNetworkSymbol(network.toLowerCase() as NetworkName));
    }

    getNetworkSymbol(network?: string): string {
        if (!network) return "";

        return this._networkService.getNetworkSymbol(network.toLowerCase() as NetworkName);
    }

    async getSwapQuote(silentLoading: boolean = false): Promise<void> {
        if (!this.canCheckQuote) {
            this._clearFeeUpdateInterval();

            return;
        }

        const sourceNetwork = this.selectedSourceAsset.network?.toLowerCase() || "";
        const targetNetwork = this.selectedTargetAsset.network?.toLowerCase() || "";

        const fromToken = this._lifiService.getTokenAddress(
            sourceNetwork,
            this.selectedSourceAsset.symbol || "",
            this.selectedSourceAsset.contractAddress || ""
        );

        const toToken = this._lifiService.getTokenAddress(
            targetNetwork,
            this.selectedTargetAsset.symbol || "",
            this.selectedTargetAsset.contractAddress || ""
        );

        if (!String(fromToken).trim() || !String(toToken).trim()) {
            this.openErrorSnackBar("errors.missing_contract_address");

            this._clearFeeUpdateInterval();

            return;
        }

        const sourceAmount = this.form.get("sourceAmount")?.value;
        const isSameAsset = sourceNetwork === targetNetwork && fromToken.toLowerCase() === toToken.toLowerCase();

        if (!+sourceAmount || isSameAsset) {
            this.form.patchValue({ targetAmount: "0", fee: 0, targetSwapValue: "0" }, { emitEvent: false });

            this._clearFeeUpdateInterval();

            return;
        }

        this._clearFeeUpdateInterval();
        this.quoteLoading = !silentLoading;

        try {
            const fromChain = this._lifiService.getChainIdentifier(sourceNetwork);
            const toChain = this._lifiService.getChainIdentifier(targetNetwork);

            const sourceAmountStr = sourceAmount.toString();

            const fromAmount = this._lifiService.formatAmount(sourceAmountStr, this.selectedSourceAsset.decimals as number);
            const fromAddress = this._getAddressForNetwork(sourceNetwork);
            const toAddress = this._getAddressForNetwork(targetNetwork);

            if (targetNetwork === "solana" && !String(toAddress || "").trim()) {
                this.openErrorSnackBar("errors.missing_solana_recipient");
                this.form.patchValue({ targetAmount: "0", fee: 0, targetSwapValue: "0" }, { emitEvent: false });

                return;
            }

            const slippage = this.form.get("slippage")?.value || 0.5;
            const slippageStr = slippage.toString();

            const quote = await this._lifiService.getQuote(
                fromChain,
                fromToken,
                toChain,
                toToken,
                fromAmount,
                fromAddress,
                slippageStr,
                toAddress || undefined
            );

            const fallbackDecimals =
                targetNetwork === "solana" ? (this.selectedTargetAsset.decimals ?? 9) : (this.selectedTargetAsset.decimals ?? 18);
            const toTokenDecimals = this._toTokenDecimalsFromQuote(quote, fallbackDecimals);

            if (sourceNetwork === "solana" || targetNetwork === "solana") {
                if (!quote || !quote.estimate || !quote.estimate.toAmount) {
                    throw new Error("No hay rutas disponibles para este swap en Solana");
                }

                this.swapQuote = quote;

                const estimatedAmount = parseFloat(quote.estimate.toAmount) / Math.pow(10, toTokenDecimals);
                const sourceTokenAmount = parseFloat(sourceAmount);

                const targetSwapValue = estimatedAmount / sourceTokenAmount;

                let fee = 0;

                if (quote.estimate.gasCosts) {
                    quote.estimate.gasCosts.forEach((gasCost: any) => {
                        if (gasCost.amountUSD) {
                            fee += parseFloat(gasCost.amountUSD);
                        }
                    });
                }

                this.form.patchValue(
                    {
                        fee,
                        targetSwapValue: targetSwapValue.toString(),
                        targetAmount: estimatedAmount.toString(),
                        targetFiat: quote.estimate.toAmountUSD,
                    },
                    { emitEvent: false }
                );

                this._setFeeUpdateInterval();
            } else {
                if (!quote || !quote?.estimate) throw new Error("Quote error");

                this.swapQuote = quote;

                const estimatedAmount = parseFloat(quote.estimate.toAmount) / Math.pow(10, toTokenDecimals);
                const sourceTokenAmount = parseFloat(sourceAmount);
                const targetSwapValue = estimatedAmount / sourceTokenAmount;

                let fee = this._getFeeFromQuote(quote);

                this.form.patchValue(
                    {
                        fee,
                        targetSwapValue: targetSwapValue.toString(),
                        targetAmount: estimatedAmount.toString(),
                        targetFiat: quote.estimate.toAmountUSD,
                    },
                    { emitEvent: false }
                );
            }
        } catch (error) {
            console.error("Quote error:", error);
            this.openErrorSnackBar(mapTransactionErrorToTranslationKey(error));

            this.form.patchValue({ targetAmount: "0", fee: 0, targetSwapValue: "0" }, { emitEvent: false });

            this._clearFeeUpdateInterval();
        } finally {
            this.quoteLoading = false;

            this._changeDetectionRef.detectChanges();
        }
    }

    handleAssetChange(event: AssetChangeData): void {
        if (event.source === "source") {
            this.form.patchValue({ sourceAsset: event.asset });
        } else {
            this.form.patchValue({ targetAsset: event.asset });
        }

        this.form.markAsDirty();
        this.form.markAsTouched();

        this.swapSource = "";
    }

    handlePickerBack(): void {
        this.swapSource = "";
    }

    handleSwapNavBack(): void {
        if (this.swapSource) {
            this.swapSource = "";

            return;
        }

        this._router.navigate(["/home"]);
    }

    setSwapMode(mode: SwapFlowMode): void {
        this.swapMode = mode;
        this.form?.updateValueAndValidity({ emitEvent: true });
        this._changeDetectionRef.markForCheck();
    }

    openNetworkPicker(): void {
        this.networkPickerSearch = "";
        this.swapSource = "network";
    }

    selectSwapNetworkRow(row: SwapNetworkRow): void {
        this.selectedSwapNetworkId = row.id;
        this.swapSource = "";

        const norm = (n?: string) => (n || "").toLowerCase();

        if (this.selectedSourceAsset.network && norm(this.selectedSourceAsset.network) !== row.id) {
            this.form.patchValue({ sourceAsset: null, sourceAmount: "", sourceFiat: 0 });
            this.selectedSourceAsset = {};
            this.swapQuote = null;
        }

        if (this.selectedTargetAsset.network && norm(this.selectedTargetAsset.network) !== row.id) {
            this.form.patchValue({ targetAsset: null, targetAmount: "0", targetFiat: 0, targetSwapValue: "0" });
            this.selectedTargetAsset = {};
            this.swapQuote = null;
        }

        this.form.updateValueAndValidity();
        this._changeDetectionRef.markForCheck();
    }

    clearSelectedSwapNetwork(): void {
        this.selectedSwapNetworkId = null;
        this._changeDetectionRef.markForCheck();
    }

    selectAllSwapNetworks(): void {
        this.clearSelectedSwapNetwork();
        this.swapSource = "";
    }

    handleBalanceDisplayChange(): void {
        this.swapBalanceDisplay = this.swapBalanceDisplay === "token" ? "fiat" : "token";
    }

    isConfirmDisabled(): boolean {
        const hasValidAmount = !!this.form.get("sourceAmount")?.value && parseFloat(this.form.get("sourceAmount")?.value) > 0;
        const hasValidBalance = !this.form.errors?.insufficientFunds;
        const hasValidNetworks = !this.form.errors?.crossNetwork && !this.form.errors?.sameChainSwap;
        const hasValidQuote = !!this.swapQuote;
        const hasAssets = this.hasBothAssetsSet;
        const isNotLoadingOrSending = !this.sending && !this.loading && !this.quoteLoading;

        return !(hasValidAmount && hasValidQuote && isNotLoadingOrSending && hasAssets && hasValidBalance && hasValidNetworks);
    }

    openErrorSnackBar(message: string): void {
        this._snackBar.open(this._translocoService.translate(message), this._translocoService.translate("common.close"), {
            duration: 5000,
            panelClass: "zelf-snackbar",
            verticalPosition: "top",
        });
    }

    openSlippageSheet(): void {
        this._bottomSheet
            .open(SlippageSheetComponent, {
                backdropClass: "zelf-backdrop",
                panelClass: "zelf-bottom-sheet",
                data: {
                    commission: this.form.get("commission")?.value,
                    commissionToggle: this.form.get("commissionToggle")?.value,
                    network: this.network,
                    slippage: this.form.get("slippage")?.value,
                    slippageToggle: this.form.get("slippageToggle")?.value,
                },
            })
            .afterDismissed()
            .subscribe({
                next: (result) => {
                    if (!result) return;

                    this.form.get("commission")?.patchValue(result.commission);
                    this.form.get("commissionToggle")?.patchValue(result.commissionToggle);
                    this.form.get("slippage")?.patchValue(result.slippage);
                    this.form.get("slippageToggle")?.patchValue(result.slippageToggle);

                    this._changeDetectionRef.detectChanges();
                },
            });
    }

    setAmount(modifier: number): void {
        const amount = this.selectedSourceAsset.amount as number;
        const modifiedValue = Number((amount * modifier).toFixed(8));

        if (this.swapBalanceDisplay === "token") {
            this.form.get("sourceAmount")?.patchValue(modifiedValue || "");
            this.form.get("sourceAmount")?.markAsDirty();
            this.form.get("sourceAmount")?.markAsTouched();
            this.form.get("sourceAmount")?.updateValueAndValidity();
        } else {
            this.form.get("sourceFiat")?.patchValue(modifiedValue * (this.selectedSourceAsset.price as number) || 0);
            this.form.get("sourceFiat")?.markAsDirty();
            this.form.get("sourceFiat")?.markAsTouched();
            this.form.get("sourceFiat")?.updateValueAndValidity();
        }

        this._changeDetectionRef.detectChanges();
    }

    setBridge(bridge: string): void {
        this.form.get("bridge")?.patchValue(bridge);

        this._changeDetectionRef.detectChanges();
    }

    showDetails(): boolean {
        return !!(this.form.get("sourceAmount")?.valid && this.form.get("targetAsset")?.valid);
    }

    swapTargetWithSource(): void {
        if (!this.hasBothAssetsSet) return;

        this.formUnsubscriber$.next();
        this.formUnsubscriber$.complete();

        const _tempSourceFiat = this.form.get("sourceFiat")?.value || 0;
        const _tempTargetFiat = 0;
        const _tempSource = { ...(this.form.get("sourceAsset")?.value || {}) };
        const _tempTarget = { ...(this.form.get("targetAsset")?.value || {}) };

        const fromTokenDecimals = _tempSource?.decimals || 9;
        const toTokenDecimals = _tempTarget?.decimals || 9;

        let _tempSourceAmount = this.form.get("sourceAmount")?.value || "";
        let _tempTargetAmount = this.form.get("targetAmount")?.value || "";

        _tempSourceAmount = Number(_tempSourceAmount).toFixed(fromTokenDecimals);
        _tempTargetAmount = Number(_tempTargetAmount).toFixed(toTokenDecimals);

        this._changeDetectionRef.detectChanges();

        this._setupQuoteUpdates();

        this.form.patchValue(
            {
                sourceAmount: _tempTargetAmount,
                sourceAsset: _tempTarget,
                sourceFiat: _tempTargetFiat,
                targetAmount: _tempSourceAmount,
                targetAsset: _tempSource,
                targetFiat: _tempSourceFiat,
            },
            { onlySelf: true }
        );

        this.form.get("sourceAsset")?.markAsDirty();
        this.form.get("sourceAsset")?.markAsTouched();
        this.form.get("targetAsset")?.markAsDirty();
        this.form.get("targetAsset")?.markAsTouched();

        this.form.updateValueAndValidity();
    }

    toggleShowPassword(): void {
        this.showPassword = !this.showPassword;
    }
}
