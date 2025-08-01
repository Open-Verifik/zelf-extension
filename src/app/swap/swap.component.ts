import * as ethers from "ethers";
import { firstValueFrom, merge, Observable, Subject, takeUntil } from "rxjs";
import { debounceTime, filter, tap } from "rxjs/operators";

import { CurrencyPipe, DecimalPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, ReactiveFormsModule, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, RouterLink } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";

import { AssetService, NetworkPermissions } from "app/asset.service";
import { ChromeService } from "app/chrome.service";
import { BlockchainTransactionsService } from "app/services/blockchain-transactions.service";
import { LifiService } from "app/services/lifi.service";
import { NetworkName, NetworkService } from "app/services/network.service";
import { SlippageSheetComponent } from "app/slippage-sheet/slippage-sheet.component";
import { TransactionService } from "app/transaction.service";
import { VaultService } from "app/vault.service";
import { SwapData, TokenData, WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { ZelfNameService } from "app/zelf-name-service.service";
import { AssetChangeData, SwapCurrencyComponent } from "../swap-currency/swap-currency.component";
import { environment } from "environments/environment";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";

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
        RouterLink,
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
    swapSource: "source" | "target" | "" = "";
    tokens: TokenData[] = [];
    transactionHash: string = "";
    wallet?: WalletModel;
    swapExecuting: boolean = false;
    swapExecuted: boolean = false;
    swapLoading: boolean = false;

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
        private _zelfNameService: ZelfNameService
    ) {
        this.CAN_SWAP = this._assetService.canSwap;
        this.wallet = {} as WalletModel;
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
        this.wallet = (await this._walletService.getCurrentWallet()) as WalletModel;

        this._initForm();

        await this._loadTokensFromSession();
        await this._decryptMnemonics();
        await this._findPreviousSwapData();

        if (this.swapData && this.swapData.hasSwapData) return;

        this.loading = false;
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
            !this.form.errors?.crossNetwork
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
            this.wallet = (await this._walletService.getCurrentWallet()) as WalletModel;
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

    private _getAddressForNetwork(network: string): string {
        if (!this.wallet) return "";

        switch (network.toLowerCase()) {
            case "ethereum":
                return this.wallet.ethAddress;
            case "solana":
                return this.wallet.solanaAddress;
            case "avalanche":
                return this.wallet.ethAddress;
            case "binance":
                return this.wallet.ethAddress;
            case "polygon":
                return this.wallet.ethAddress;
            default:
                return this.wallet.ethAddress;
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

    private async _handleSuccessfulSwap(receipt: any): Promise<void> {
        this.sending = false;
        this.swapError = "";

        if (!this.transactionHash) return;

        const pendingTransactionData = {
            ...receipt,
            amount: this.form.get("sourceAmount")?.value,
            asset: this.selectedSourceAsset.symbol,
            date: new Date().toISOString(),
            fee: this.form.get("fee")?.value,
            from: this.wallet?.ethAddress,
            image: this.selectedSourceAsset.image,
            network: this.selectedSourceAsset.network,
            status: "pending",
            targetAddress: this.selectedTargetAsset.contractAddress,
            targetAmount: this.form.get("targetAmount")?.value,
            targetImage: this.selectedTargetAsset.image,
            targetNetwork: this.selectedTargetAsset.network,
            targetSymbol: this.selectedTargetAsset.symbol,
            to: this.selectedTargetAsset.contractAddress,
            tokenType: this.selectedSourceAsset.symbol,
            total: this.form.get("sourceAmount")?.value + this.form.get("fee")?.value,
            type: "swap",
        };

        await this._walletService.addTransactionToPending(pendingTransactionData);
        await this._chromeService.removeItemSession("tokensTtl");
        await this._chromeService.removeItem("swapData");

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
            { validators: [this._insufficientFundsValidator(), this._crossNetworkValidator()] }
        );

        this._setupQuoteUpdates();
    }

    private _crossNetworkValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const sourceAsset = control.get("sourceAsset");
            const targetAsset = control.get("targetAsset");

            if (!sourceAsset?.value || !targetAsset?.value) return null;

            const hasSolAsset = [sourceAsset.value.network.toLowerCase(), targetAsset.value.network.toLowerCase()].indexOf("solana") > -1;

            if (hasSolAsset && sourceAsset.value.network !== targetAsset.value.network) return { crossNetwork: true };

            return null;
        };
    }

    private async _initSwapData(): Promise<void> {
        this.form.patchValue(this.swapData);
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
        await this._zelfNameService.setFlow("unlock");
        await this._zelfNameService.setZelfName(this.wallet?.publicData?.zelfName as string);

        const { password: _password, ...rest } = this.form.value;

        this._transactionService.swapData = new SwapData(rest);
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
            this._vaultService.biometricsRequired().then((result) => (this.requiresBiometrics = result));
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
                const isFromNative =
                    this.swapQuote.action.fromToken.address === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" ||
                    this.swapQuote.action.fromToken.address === "0x0000000000000000000000000000000000000000";

                const receipt = await this._lifiService.executeSwap(this.swapQuote, {
                    privateKey: ethWallet.privateKey,
                    address: ethWallet.address,
                    isFromNative,
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
        } catch (error: any) {
            console.error("Swap execution error:", error);
            this.swapError = error.message;
            this.openErrorSnackBar(error.message || "errors.something_went_wrong");
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

        if (!this.selectedSourceAsset.contractAddress || !this.selectedTargetAsset.contractAddress) {
            this.openErrorSnackBar("errors.missing_contract_address");

            this._clearFeeUpdateInterval();

            return;
        }

        const sourceAmount = this.form.get("sourceAmount")?.value;
        const isSameAsset = this.selectedSourceAsset.contractAddress === this.selectedTargetAsset.contractAddress;

        if (!+sourceAmount || isSameAsset) {
            this.form.patchValue({ targetAmount: "0", fee: 0, targetSwapValue: "0" }, { emitEvent: false });

            this._clearFeeUpdateInterval();

            return;
        }

        this._clearFeeUpdateInterval();
        this.quoteLoading = !silentLoading;

        try {
            const sourceNetwork = this.selectedSourceAsset.network?.toLowerCase();
            const targetNetwork = this.selectedTargetAsset.network?.toLowerCase();

            const fromChain = this._lifiService.getChainIdentifier(sourceNetwork || "");
            const toChain = this._lifiService.getChainIdentifier(targetNetwork || "");

            const fromToken = this._lifiService.getTokenAddress(
                sourceNetwork || "",
                this.selectedSourceAsset.symbol || "",
                this.selectedSourceAsset.contractAddress || ""
            );

            const toToken = this._lifiService.getTokenAddress(
                targetNetwork || "",
                this.selectedTargetAsset.symbol || "",
                this.selectedTargetAsset.contractAddress || ""
            );

            const sourceAmountStr = sourceAmount.toString();

            const fromAmount = this._lifiService.formatAmount(sourceAmountStr, this.selectedSourceAsset.decimals as number);
            const fromAddress = this._getAddressForNetwork(sourceNetwork || "");

            const slippage = this.form.get("slippage")?.value || 0.5;
            const slippageStr = slippage.toString();

            const quote = await this._lifiService.getQuote(fromChain, fromToken, toChain, toToken, fromAmount, fromAddress, slippageStr);

            const toTokenDecimals = this.selectedTargetAsset.decimals || 9;

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

                const estimatedAmount = parseFloat(quote.estimate.toAmount) / Math.pow(10, this.selectedTargetAsset.decimals as number);
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
            this.openErrorSnackBar(error instanceof Error ? error.message : "errors.failed_to_get_quote");

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

    handleBalanceDisplayChange(): void {
        this.swapBalanceDisplay = this.swapBalanceDisplay === "token" ? "fiat" : "token";
    }

    isConfirmDisabled(): boolean {
        const hasValidAmount = !!this.form.get("sourceAmount")?.value && parseFloat(this.form.get("sourceAmount")?.value) > 0;
        const hasValidBalance = !this.form.errors?.insufficientFunds;
        const hasValidNetworks = !this.form.errors?.crossNetwork;
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
