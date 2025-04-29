import { TranslocoModule } from "@ngneat/transloco";
import { firstValueFrom, Subject, takeUntil } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { catchError, finalize } from "rxjs/operators";
import { of } from "rxjs";
import { debounceTime, distinctUntilChanged, filter } from "rxjs/operators";

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { NgClass, NgFor, NgIf, NgTemplateOutlet } from "@angular/common";
import { CurrencyPipe, DecimalPipe } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from "@angular/forms";
import { AssetService, NetworkPermissions } from "app/asset.service";
import { BlockchainTransactionsService } from "app/services/blockchain-transactions.service";
import { NetworkName, NetworkService } from "app/services/network.service";
import { AssetChangeData, SwapCurrencyComponent } from "../swap-currency/swap-currency.component";
import { SwapSource, TokenData, WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { MatButtonModule } from "@angular/material/button";
import { Router, RouterLink } from "@angular/router";
import { MatMenuModule } from "@angular/material/menu";
import { VaultService } from "app/vault.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslocoService } from "@ngneat/transloco";
import { SlippageSheetComponent } from "app/slippage-sheet/slippage-sheet.component";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { LifiService } from "../services/lifi.service";
import { HttpClient } from "@angular/common/http";
import * as ethers from "ethers";
import { EthereumService } from "app/eth.service";
import { ChromeService } from "app/chrome.service";

interface LifiExecuteResponse {
    transactionHash: string;
}

@Component({
    imports: [
        CurrencyPipe,
        DecimalPipe,
        MatButtonModule,
        MatMenuModule,
        NgClass,
        NgFor,
        NgIf,
        NgTemplateOutlet,
        ReactiveFormsModule,
        RouterLink,
        SwapCurrencyComponent,
        TranslocoModule,
    ],
    selector: "swap",
    standalone: true,
    styleUrls: ["./swap.component.scss"],
    templateUrl: "./swap.component.html",
})
export class SwapComponent implements OnInit, OnDestroy {
    private unsubscriber$: Subject<void> = new Subject<void>();
    private _password: string = "";
    private _mnemonics: string = "";
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
    passwordError: boolean = false;
    passwordSet: boolean = false;
    remainingAttempts: number = this._vaultService.remainingAttempts;
    requiresBiometrics: boolean = false;
    sending: boolean = false;
    showPassword: boolean = false;
    slippage: number = 0.5;
    swapBalanceDisplay: "token" | "fiat" = "token";
    swapSource: "source" | "target" | "" = "";
    tokens: TokenData[] = [];
    wallet?: WalletModel;
    swapQuote: any = null;
    quoteLoading: boolean = false;
    transactionHash: string = "";
    swapError: string = "";

    bridgeOptions = [
        {
            label: "Li.Fi",
            value: "li.fi",
        },
    ];

    selectedSourceAsset: TokenData = {
        amount: "0",
        decimals: 0,
        fiatBalance: "0",
        image: "",
        name: "",
        network: "",
        price: 0,
        symbol: "",
        tokenType: "",
        contractAddress: "",
    };

    selectedTargetAsset: TokenData = {
        amount: "0",
        decimals: 0,
        fiatBalance: "0",
        image: "",
        name: "",
        network: "",
        price: 0,
        symbol: "",
        tokenType: "",
        contractAddress: "",
    };

    constructor(
        private _assetService: AssetService,
        private _blockchainTransactionsService: BlockchainTransactionsService,
        private _bottomSheet: MatBottomSheet,
        private _changeDetectionRef: ChangeDetectorRef,
        private _ethService: EthereumService,
        private _formBuilder: FormBuilder,
        private _networkService: NetworkService,
        private _router: Router,
        private _snackBar: MatSnackBar,
        private _translocoService: TranslocoService,
        private _vaultService: VaultService,
        private _walletService: WalletService,
        private _lifiService: LifiService,
        private _http: HttpClient,
        private _chromeService: ChromeService
    ) {
        this.wallet = {} as WalletModel;

        this._mnemonics = "";
        this._password = this._vaultService.password;

        this._vaultService.mnemonic = "";
        this._vaultService.password = "";

        if (this._password && this._password.trim()) {
            this.passwordSet = true;
            this.requiresBiometrics = false;
        }

        this._initForm();
    }

    async ngOnInit(): Promise<void> {
        this.wallet = (await this._walletService.getCurrentWallet()) as WalletModel;

        if (Object.keys(this._assetService.sourceAsset).length) {
            this.selectedSourceAsset = {
                ...this.selectedSourceAsset,
                ...(this._assetService.sourceAsset as TokenData),
            };
        }
        if (Object.keys(this._assetService.targetAsset).length) {
            this.selectedTargetAsset = {
                ...this.selectedTargetAsset,
                ...(this._assetService.targetAsset as TokenData),
            };
        }

        await this._loadTokensFromSession();
        await this._decryptMnemonics();
        this._setupQuoteUpdates();

        console.log("Form initialized:", {
            sourceAmount: this.form.get("sourceAmount")?.value,
            controls: Object.keys(this.form.controls),
        });

        console.log("Token details:", {
            source: {
                symbol: this.selectedSourceAsset.symbol,
                contractAddress: this.selectedSourceAsset.contractAddress,
            },
            target: {
                symbol: this.selectedTargetAsset.symbol,
                contractAddress: this.selectedTargetAsset.contractAddress,
            },
        });

        const fromToken =
            this.selectedSourceAsset.symbol === "AVAX" ? "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" : this.selectedSourceAsset.contractAddress;

        const toToken =
            this.selectedTargetAsset.symbol === "AVAX"
                ? "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
                : this.selectedTargetAsset.contractAddress || "0xc7198437980c041c805A1EDcbA50c1Ce5db95118";

        if (!fromToken || !toToken) {
            console.error("Missing token addresses:", { fromToken, toToken });
            throw new Error(`Invalid token addresses: from=${fromToken}, to=${toToken}`);
        }

        return Promise.resolve();
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    get hasBothAssetsSet(): boolean {
        return !!Object.keys(this.selectedSourceAsset).length && !!Object.keys(this.selectedTargetAsset).length;
    }

    get hasSelectedTargetAsset(): boolean {
        return !!Object.keys(this.selectedTargetAsset).length;
    }

    get targetTokenPricePerDollar(): number {
        return 1 / ((this.selectedTargetAsset?.price as number) || 1);
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

    private async _decryptMnemonics(): Promise<any> {
        if (!this.wallet?.pgp?.encryptedMessage || !this.wallet?.pgp?.privateKey) {
            this.passwordSet = false;
            this.requiresBiometrics = true;

            return;
        }

        if (!this._password && !this.form.get("password")?.value) return;

        this._mnemonics = JSON.parse(await this._decryptMessage()).mnemonic;
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

    private _initForm(): void {
        this.form = this._formBuilder.group({
            bridge: ["li.fi", [Validators.required]],
            commission: [0, [Validators.required, Validators.min(0)]],
            commissionToggle: ["automatic", [Validators.required]],
            fee: [0, [Validators.required, Validators.min(0)]],
            password: [this._password || "", [Validators.required]],
            slippage: [0.5, [Validators.required, Validators.min(0), Validators.max(0.8)]],
            slippageToggle: ["automatic", [Validators.required]],
            sourceAmount: ["", [Validators.required, Validators.min(0)]],
            sourceAsset: [this.selectedSourceAsset, [Validators.required]],
            targetAmount: [{ value: "", disabled: true }],
            targetAsset: [this.selectedTargetAsset, [Validators.required]],
        });

        this.form
            .get("sourceAmount")
            ?.valueChanges.pipe(takeUntil(this.unsubscriber$))
            .subscribe(() => {
                if (this.hasBothAssetsSet) {
                    this.getSwapQuote().catch((error) => {
                        console.error("Error getting swap quote:", error);
                    });
                }
            });

        this.form
            .get("sourceAsset")
            ?.valueChanges.pipe(takeUntil(this.unsubscriber$))
            .subscribe((value) => {
                this.selectedSourceAsset = value;

                this._updateTargetAmount();
            });

        this.form
            .get("targetAsset")
            ?.valueChanges.pipe(takeUntil(this.unsubscriber$))
            .subscribe((value) => {
                this.selectedTargetAsset = value;

                this._updateTargetAmount();
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

        this.selectedTargetAsset = this.tokens.find((token) => token.network === this.network && token !== this.tokens[0]) || {
            amount: "0",
            decimals: 0,
            fiatBalance: "0",
            image: "",
            name: "",
            network: "",
            price: 0,
            symbol: "",
            tokenType: "",
            contractAddress: "",
        };
    }

    private _updateTargetAmount(): void {
        if (this.swapQuote) {
            return;
        }

        const value = this.form.get("sourceAmount")?.value;

        if (!value || !this.selectedTargetAsset.price || !this.selectedSourceAsset.price) {
            this.form.get("targetAmount")?.setValue("");

            return;
        }

        const sourceValue = this.swapBalanceDisplay === "token" ? value : value / (this.selectedSourceAsset.price as number);
        const fiatValue = sourceValue * (this.selectedSourceAsset.price as number);
        const targetValue = this.swapBalanceDisplay === "token" ? fiatValue / (this.selectedTargetAsset.price as number) : fiatValue;

        this.form.get("targetAmount")?.setValue(targetValue, { emitEvent: true });
    }

    private async _validateCredentials(): Promise<boolean> {
        if (!this.form.get("password")?.value) {
            this.openErrorSnackBar("errors.empty_password");

            return false;
        }

        if (this.requiresBiometrics) {
            this._vaultService.password = this.form.get("password")?.value;
            this._router.navigate(["/biometrics"], { queryParams: { return: "/swap" } });

            return false;
        }

        if (!this._mnemonics) {
            await this._decryptMnemonics();

            if (this.requiresBiometrics) {
                this._vaultService.password = this.form.get("password")?.value;
                this._router.navigate(["/biometrics"], { queryParams: { return: "/swap" } });

                return false;
            }

            if (!this._mnemonics) {
                this.openErrorSnackBar("errors.private_key_locked");

                return false;
            }
        }

        return true;
    }

    async getSwapQuote(): Promise<void> {
        const sourceAmount = this.form.get("sourceAmount")?.value;
        console.log("Starting getSwapQuote with amount:", sourceAmount);

        if (!this.hasBothAssetsSet || !sourceAmount || sourceAmount === "0") {
            this.form.patchValue({ targetAmount: "0" });
            return;
        }

        this.quoteLoading = true;

        try {
            const sourceNetwork = this.selectedSourceAsset.network?.toLowerCase();
            const targetNetwork = this.selectedTargetAsset.network?.toLowerCase();

            console.log("Selected assets:", {
                source: this.selectedSourceAsset,
                target: this.selectedTargetAsset,
            });

            const fromChain = this._lifiService.getChainIdentifier(sourceNetwork);
            const toChain = this._lifiService.getChainIdentifier(targetNetwork);

            let fromToken: string;
            let toToken: string;

            if (this.selectedSourceAsset.symbol === "AVAX") {
                fromToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
            } else {
                console.log("Source token properties:", {
                    address: (this.selectedSourceAsset as any).address,
                    contractAddress: this.selectedSourceAsset.contractAddress,
                    fullObject: this.selectedSourceAsset,
                });

                fromToken =
                    this.selectedSourceAsset.contractAddress ||
                    (this.selectedSourceAsset as any).address ||
                    (this.selectedSourceAsset as any).tokenAddress;

                if (!fromToken && this.selectedSourceAsset.image && this.selectedSourceAsset.image.includes("43114-0x")) {
                    const matches = this.selectedSourceAsset.image.match(/43114-([^\.]+)/);
                    if (matches && matches[1]) {
                        fromToken = matches[1];
                        console.log("Extracted address from image URL:", fromToken);
                    }
                }
            }

            if (this.selectedTargetAsset.symbol === "AVAX") {
                toToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
            } else {
                console.log("Target token properties:", {
                    address: (this.selectedTargetAsset as any).address,
                    contractAddress: this.selectedTargetAsset.contractAddress,
                    fullObject: this.selectedTargetAsset,
                });

                toToken =
                    this.selectedTargetAsset.contractAddress ||
                    (this.selectedTargetAsset as any).address ||
                    (this.selectedTargetAsset as any).tokenAddress ||
                    "0xc7198437980c041c805A1EDcbA50c1Ce5db95118";

                if (!toToken && this.selectedTargetAsset.image && this.selectedTargetAsset.image.includes("43114-0x")) {
                    const matches = this.selectedTargetAsset.image.match(/43114-([^\.]+)/);
                    if (matches && matches[1]) {
                        toToken = matches[1];
                        console.log("Extracted address from image URL:", toToken);
                    }
                }
            }

            console.log("Final token addresses:", { fromToken, toToken });

            if (!fromToken || !toToken) {
                console.error("Missing token addresses:", { fromToken, toToken });
                throw new Error(`Invalid token addresses: from=${fromToken}, to=${toToken}`);
            }

            const fromAmount = this._lifiService.formatAmount(parseFloat(sourceAmount), this.selectedSourceAsset.decimals as number);

            const fromAddress = this._getAddressForNetwork(sourceNetwork);
            const slippage = this.form.get("slippage")?.value || 0.5;

            console.log("Quote Request:", {
                fromChain,
                toChain,
                fromToken,
                toToken,
                fromAmount,
                fromAddress,
                slippage,
                sourceAsset: this.selectedSourceAsset,
                targetAsset: this.selectedTargetAsset,
            });

            const quote = await firstValueFrom(this._lifiService.getQuote(fromChain, fromToken, toChain, toToken, fromAmount, fromAddress, slippage));

            console.log("Quote Response:", quote);

            if (quote && quote.estimate) {
                this.swapQuote = quote;
                const estimatedAmount = parseFloat(quote.estimate.toAmount) / Math.pow(10, this.selectedTargetAsset.decimals as number);

                console.log("Setting target amount:", estimatedAmount);

                this.form.patchValue(
                    {
                        targetAmount: estimatedAmount.toString(),
                    },
                    { emitEvent: false }
                );

                this._changeDetectionRef.detectChanges();
            }
        } catch (error) {
            console.error("Quote error:", error);
            this.form.patchValue({ targetAmount: "0" }, { emitEvent: false });
        } finally {
            this.quoteLoading = false;
            this._changeDetectionRef.detectChanges();
        }
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
            case "sui":
                return this.wallet.suiAddress;
            case "bitcoin":
                return this.wallet.btcAddress;
            default:
                return this.wallet.ethAddress;
        }
    }

    async confirmSwap(): Promise<void> {
        if (!this.swapQuote) {
            this.openErrorSnackBar("errors.no_quote_available");
            return;
        }

        this.sending = true;
        this.swapError = "";

        try {
            if (!this.wallet?.pgp?.encryptedMessage || !this.wallet?.pgp?.privateKey) {
                throw new Error("Missing required keys");
            }

            const password = this.form.get("password")?.value;
            const decryptedData = await this._vaultService.decryptMessage(this.wallet.pgp.encryptedMessage, this.wallet.pgp.privateKey, password);

            const cleanMnemonic = JSON.parse(decryptedData).mnemonic.trim().toLowerCase();

            if (!ethers.Mnemonic.isValidMnemonic(cleanMnemonic)) {
                throw new Error("Invalid mnemonic");
            }

            const wallet = ethers.Wallet.fromPhrase(cleanMnemonic);
            const sourceNetwork = this.selectedSourceAsset.network?.toLowerCase();

            if (sourceNetwork === "avalanche" || sourceNetwork === "ethereum") {
                const txData = this.swapQuote.transactionRequest;
                console.log("Original transaction request:", txData);

                const modifiedTxData = {
                    ...txData,
                    gasLimit: "0x493e0",
                    maxFeePerGas: "0x" + (3 * 1e9).toString(16),
                    maxPriorityFeePerGas: "0x" + (2 * 1e9).toString(16),
                    gasPrice: "0x" + (3 * 1e9).toString(16),
                };

                console.log("Modified gas parameters:", {
                    original: {
                        gasLimit: txData.gasLimit,
                        gasPrice: txData.gasPrice,
                    },
                    modified: {
                        gasLimit: modifiedTxData.gasLimit,
                        gasPrice: modifiedTxData.gasPrice,
                    },
                });

                const receipt = await this._lifiService.sendTransaction({
                    value: modifiedTxData.value?.toString() || "0",
                    privateKey: wallet.privateKey,
                    to: modifiedTxData.to,
                    network: sourceNetwork,
                    data: modifiedTxData.data,
                    gasLimit: "300000",
                });

                console.log("Transaction receipt:", receipt);

                if (receipt?.transactionHash) {
                    this.transactionHash = receipt.transactionHash;
                    this._handleSuccessfulSwap();
                }
            } else {
                throw new Error(`Unsupported network: ${sourceNetwork}`);
            }
        } catch (error: any) {
            console.error("Swap execution error:", error);
            this.swapError = error?.message || "Failed to execute swap";
            this.openErrorSnackBar(this.swapError);
        } finally {
            this.sending = false;
            this._changeDetectionRef.detectChanges();
        }
    }

    getBridgeLabel(): string {
        return this.bridgeOptions.find((option) => option.value === this.form.get("bridge")?.value)?.label || "";
    }

    findToken(symbol: string): TokenData | undefined {
        return this.tokens.find((token) => token.symbol === symbol);
    }

    getNetworkImage(network?: string): string {
        if (!network) return "";
        return this._walletService.getAssetImage(this._networkService.getNetworkSymbol(network.toLowerCase()));
    }

    getNetworkSymbol(network?: string): string {
        if (!network) return "";
        return this._networkService.getNetworkSymbol(network.toLowerCase());
    }

    handleAssetChange(event: AssetChangeData): void {
        if (event.source === "source") {
            this.selectedSourceAsset = event.asset;
        } else {
            this.selectedTargetAsset = event.asset;
        }
        this.swapSource = "";
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

    setBridge(bridge: string): void {
        this.form.get("bridge")?.setValue(bridge, { emitEvent: true });

        this._changeDetectionRef.detectChanges();
    }

    swapTargetWithSource(): void {
        if (!this.hasBothAssetsSet) return;

        const _tempSource = { ...this.selectedSourceAsset };
        const _tempTarget = { ...this.selectedTargetAsset };

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

        this.form.get("sourceAsset")?.setValue(_tempTarget, { emitEvent: true });
        this.form.get("targetAsset")?.setValue(_tempSource, { emitEvent: true });

        this._changeDetectionRef.detectChanges();
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

                    this.form.get("slippage")?.setValue(result.slippage, { emitEvent: true });
                    this.form.get("slippageToggle")?.setValue(result.slippageToggle, { emitEvent: true });
                    this.form.get("commission")?.setValue(result.commission, { emitEvent: true });
                    this.form.get("commissionToggle")?.setValue(result.commissionToggle, { emitEvent: true });

                    this._changeDetectionRef.detectChanges();
                },
            });
    }

    toggleShowPassword(): void {
        this.showPassword = !this.showPassword;
    }

    /**
     * Setup watchers for form changes that should trigger quote updates
     */
    private _setupQuoteUpdates(): void {
        this.form
            .get("sourceAmount")
            ?.valueChanges.pipe(
                takeUntil(this.unsubscriber$),
                filter((value) => value !== null && value !== ""),
                distinctUntilChanged(),
                debounceTime(300)
            )
            .subscribe(async (value) => {
                console.log("Source amount changed to:", value);
                if (this.hasBothAssetsSet) {
                    try {
                        await this.getSwapQuote();
                    } catch (error) {
                        console.error("Error getting swap quote:", error);
                    }
                }
            });

        this.form
            .get("slippage")
            ?.valueChanges.pipe(takeUntil(this.unsubscriber$))
            .subscribe(async () => {
                if (this.hasBothAssetsSet && this.form.get("sourceAmount")?.value) {
                    try {
                        await this.getSwapQuote();
                    } catch (error) {
                        console.error("Error getting swap quote:", error);
                    }
                }
            });
    }

    handleSourceAmountChange(event: any) {
        console.log("Source amount input changed:", event.target.value);
        this.form.get("sourceAmount")?.setValue(event.target.value, { emitEvent: true });
    }

    private async _handleSuccessfulSwap(): Promise<void> {
        this.sending = false;
        this.swapError = "";

        await this._chromeService.removeItemSession("tokensTtl");

        if (this.transactionHash) {
            this._router.navigate(["/transaction", this.transactionHash], {
                queryParams: { tokenType: this.selectedSourceAsset.symbol },
            });
        }
    }
}
