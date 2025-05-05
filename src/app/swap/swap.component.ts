import * as ethers from "ethers";
import { firstValueFrom, Subject, takeUntil } from "rxjs";
import { debounceTime, distinctUntilChanged, filter } from "rxjs/operators";

import { CurrencyPipe, DecimalPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from "@angular/forms";
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
import { NetworkName, NetworkService } from "app/services/network.service";
import { SlippageSheetComponent } from "app/slippage-sheet/slippage-sheet.component";
import { VaultService } from "app/vault.service";
import { TokenData, WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { LifiService } from "../services/lifi.service";
import { AssetChangeData, SwapCurrencyComponent } from "../swap-currency/swap-currency.component";

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

    private CAN_SWAP: NetworkPermissions = {
        AVAX: true,
        BTC: false,
        ETH: true,
        SOL: false,
        SUI: false,
    };

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
    swapError: string = "";
    swapQuote: any = null;
    swapSource: "source" | "target" | "" = "";
    tokens: TokenData[] = [];
    transactionHash: string = "";
    wallet?: WalletModel;

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
        private _networkService: NetworkService,
        private _router: Router,
        private _snackBar: MatSnackBar,
        private _translocoService: TranslocoService,
        private _vaultService: VaultService,
        private _walletService: WalletService,
        private _lifiService: LifiService
    ) {
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

        this._initForm();
    }

    async ngOnInit(): Promise<void> {
        this.wallet = (await this._walletService.getCurrentWallet()) as WalletModel;

        await this._loadTokensFromSession();
        await this._decryptMnemonics();
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    get canCheckQuote(): boolean {
        return this.hasBothAssetsSet && !!this.form.get("sourceAmount")?.valid;
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

        this._mnemonics = JSON.parse(await this._decryptMessage())
            .mnemonic?.trim()
            ?.toLowerCase();
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
            targetSwapValue: [""],
            sourceAmount: ["", [Validators.required, Validators.min(0)]],
            sourceAsset: [null, [Validators.required]],
            targetAmount: [{ value: "", disabled: true }, [Validators.required, Validators.min(0)]],
            targetAsset: [null, [Validators.required]],
        });

        this.form
            .get("sourceAsset")
            ?.valueChanges.pipe(takeUntil(this.unsubscriber$))
            .subscribe((value) => {
                this.selectedSourceAsset = value;

                this._updateTargetAmount();

                this.getSwapQuote().catch((error) => {
                    console.error("Error getting swap quote:", error);
                });
            });

        this.form
            .get("targetAsset")
            ?.valueChanges.pipe(takeUntil(this.unsubscriber$))
            .subscribe((value) => {
                this.selectedTargetAsset = value;

                this._updateTargetAmount();

                this.getSwapQuote().catch((error) => {
                    console.error("Error getting swap quote:", error);
                });
            });

        this._setupQuoteUpdates();
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

            this._changeDetectionRef.detectChanges();
        } catch (error) {
            console.error("Error loading tokens:", error);
        } finally {
            this._initForm();
            this.loading = false;
        }
    }

    private _updateTargetAmount(): void {
        if (this.swapQuote) return;

        const value = this.form.get("sourceAmount")?.value;

        if (!value || !this.selectedTargetAsset.price || !this.selectedSourceAsset.price) {
            this.form.get("targetAmount")?.setValue("");
            this.form.get("targetSwapValue")?.setValue("");
            this.form.get("fee")?.setValue(0);

            return;
        }

        const sourceValue = this.swapBalanceDisplay === "token" ? value : value / (this.selectedSourceAsset.price as number);
        const fiatValue = sourceValue * (this.selectedSourceAsset.price as number);
        const targetValue = this.swapBalanceDisplay === "token" ? fiatValue / (this.selectedTargetAsset.price as number) : fiatValue;

        const targetSwapValue = (this.selectedSourceAsset.price as number) / (this.selectedTargetAsset.price as number);

        this.form.get("targetAmount")?.setValue(targetValue, { emitEvent: true });
        this.form.get("targetSwapValue")?.setValue(targetSwapValue.toString(), { emitEvent: false });
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
        if (!this.canCheckQuote) return;

        if (!this.selectedSourceAsset.contractAddress || !this.selectedTargetAsset.contractAddress) {
            this.openErrorSnackBar("errors.missing_contract_address");
            return;
        }

        const sourceAmount = this.form.get("sourceAmount")?.value;

        if (!+sourceAmount) {
            this.form.patchValue({ targetAmount: "0", fee: 0, targetSwapValue: "0" }, { emitEvent: false });
            return;
        }

        this.quoteLoading = true;

        try {
            const sourceNetwork = this.selectedSourceAsset.network?.toLowerCase();
            const targetNetwork = this.selectedTargetAsset.network?.toLowerCase();

            const fromChain = this._lifiService.getChainIdentifier(sourceNetwork || "");
            const toChain = this._lifiService.getChainIdentifier(targetNetwork || "");

            let fromToken: string;
            let toToken: string;

            if (this.selectedSourceAsset.symbol === "AVAX") {
                fromToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
            } else {
                fromToken = this.selectedSourceAsset.contractAddress || "";
            }

            if (this.selectedTargetAsset.symbol === "AVAX") {
                toToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
            } else {
                toToken = this.selectedTargetAsset.contractAddress || "";
            }

            const fromAmount = this._lifiService.formatAmount(parseFloat(sourceAmount), this.selectedSourceAsset.decimals as number);
            const fromAddress = this._getAddressForNetwork(sourceNetwork || "");
            const slippage = this.form.get("slippage")?.value || 0.5;

            const quote = await firstValueFrom(this._lifiService.getQuote(fromChain, fromToken, toChain, toToken, fromAmount, fromAddress, slippage));

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
                },
                { emitEvent: false }
            );
        } catch (error) {
            console.error("Quote error:", error);
            this.openErrorSnackBar("errors.failed_to_get_quote");

            this.form.patchValue({ targetAmount: "0", fee: 0, targetSwapValue: "0" }, { emitEvent: false });
        } finally {
            this.quoteLoading = false;
            this._changeDetectionRef.detectChanges();
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
        if (this.isConfirmDisabled()) return;

        this.sending = true;
        this.swapError = "";

        try {
            if (!(await this._validateCredentials())) {
                throw new Error("Invalid credentials");
            }

            if (!ethers.Mnemonic.isValidMnemonic(this._mnemonics)) {
                throw new Error("Invalid mnemonic");
            }

            const ethWallet = ethers.Wallet.fromPhrase(this._mnemonics);
            const sourceNetwork = this.selectedSourceAsset.network?.toLowerCase();

            if (sourceNetwork === "avalanche" || sourceNetwork === "ethereum") {
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

    private async _handleSuccessfulSwap(receipt: any): Promise<void> {
        this.sending = false;
        this.swapError = "";

        if (!this.transactionHash) return;

        const pendingTransactionData = {
            ...receipt,
            amount: this.form.get("sourceAmount")?.value,
            total: this.form.get("sourceAmount")?.value + this.form.get("fee")?.value,
            fee: this.form.get("fee")?.value,
            date: new Date().toISOString(),
            from: this.wallet?.ethAddress,
            network: this.selectedSourceAsset.network,
            status: "pending",
            to: this.selectedTargetAsset.contractAddress,
            tokenType: this.selectedSourceAsset.symbol,
        };

        await this._walletService.addTransactionToPending(pendingTransactionData);
        await this._chromeService.removeItemSession("tokensTtl");

        await this._router.navigate(["/transaction", this.transactionHash], {
            queryParams: { network: this.selectedSourceAsset.network },
        });
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

                    this.form.get("commission")?.setValue(result.commission, { emitEvent: true });
                    this.form.get("commissionToggle")?.setValue(result.commissionToggle, { emitEvent: true });
                    this.form.get("slippage")?.setValue(result.slippage, { emitEvent: true });
                    this.form.get("slippageToggle")?.setValue(result.slippageToggle, { emitEvent: true });

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
            .subscribe(async () => {
                try {
                    await this.getSwapQuote();
                } catch (error) {
                    console.error("Error getting swap quote:", error);
                }
            });

        this.form
            .get("slippage")
            ?.valueChanges.pipe(takeUntil(this.unsubscriber$))
            .subscribe(async () => {
                try {
                    await this.getSwapQuote();
                } catch (error) {
                    console.error("Error getting swap quote:", error);
                }
            });
    }

    handleSourceAmountChange(event: any) {
        this.form.get("sourceAmount")?.setValue(event.target.value, { emitEvent: true });
    }

    isConfirmDisabled(): boolean {
        const hasValidAmount = !!this.form.get("sourceAmount")?.value && parseFloat(this.form.get("sourceAmount")?.value) > 0;
        const hasValidQuote = !!this.swapQuote;
        const isNotSending = !this.sending;
        const hasAssets = this.hasBothAssetsSet;

        return !(hasValidAmount && hasValidQuote && isNotSending && hasAssets);
    }
}
