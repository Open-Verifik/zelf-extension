import { ethers } from "ethers";
import { firstValueFrom, Subject, takeUntil } from "rxjs";

import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";

import { AssetService } from "app/asset.service";
import { ChromeService } from "app/chrome.service";
import { FeeCalculationParams, TransactionFeeEstimate, TransactionParams, TransactionResult } from "app/core/models/transaction-fee.model";
import { AddressMaskPipe } from "app/pipes/address-mask.pipe";
import { BitcoinService, MempoolFeeRates } from "app/services/bitcoin.service";
import { BlockDAGService } from "app/services/blockdag.service";
import { BlockchainTransactionsService } from "app/services/blockchain-transactions.service";
import { NetworkName, NetworkService } from "app/services/network.service";
import { TransactionService } from "app/transaction.service";
import { VaultService } from "app/vault.service";
import { TransactionData } from "@shared/types/wallet.types";
import { WalletService } from "app/wallet.service";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";
import { TagModel } from "app/tags.service";
import { TagsService } from "app/tags.service";
import { SolanaService } from "app/solana.service";
import { StellarFeeBreakdown } from "app/services/stellar-send.types";
import { StellarSendSummaryComponent } from "app/stellar-send-summary/stellar-send-summary.component";

@Component({
    imports: [
        AddressMaskPipe,
        CommonModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        RouterModule,
        StellarSendSummaryComponent,
        TranslocoModule,
        ZelfLoaderComponent,
    ],
    selector: "send-confirm",
    styleUrls: ["./send-confirm.component.scss"],
    templateUrl: "./send-confirm.component.html",
})
export class SendConfirmComponent implements OnInit, OnDestroy {
    private _mnemonics: string = "";
    private _password: string = "";
    private _interval!: ReturnType<typeof setInterval>;
    private _intervalTime: number = 30000;
    private _skipPriceFetch: boolean = false;
    private unsubcriber$: Subject<void> = new Subject<void>();

    feeRates: MempoolFeeRates = {
        fastestFee: 0,
        halfHourFee: 0,
        hourFee: 0,
        economyFee: 0,
        minimumFee: 0,
    };

    availableNetworks = [
        { id: "avalanche", name: "Avalanche", symbol: "AVAX" },
        { id: "binance", name: "Binance", symbol: "BNB" },
        { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
        { id: "blockdag", name: "BlockDAG", symbol: "BDAG" },
        { id: "ethereum", name: "Ethereum", symbol: "ETH" },
        { id: "polygon", name: "Polygon", symbol: "POL" },
        { id: "solana", name: "Solana", symbol: "SOL" },
        { id: "stellar", name: "Stellar", symbol: "XLM" },
        { id: "sui", name: "Sui", symbol: "SUI" },
    ];

    form!: UntypedFormGroup;
    isNativeAsset: boolean = false;
    loading: boolean;
    networkPrice: number = 0;
    networkToken?: any;
    passwordError: boolean = false;
    passwordSet: boolean = true;
    price: number = 0;
    remainingAttempts: number = 0;
    requiresBiometrics: boolean = false;
    selectedFeeRate: number = 0;
    sending: boolean = false;
    showFeeInfo: boolean = false;
    showPassword: boolean = false;
    transactionData!: TransactionData;
    wallet?: TagModel;
    isStealthMode: boolean = false;
    /** Stellar fee preview (native + classic) for confirm UI. */
    stellarFeeBreakdown: StellarFeeBreakdown | null = null;

    constructor(
        private _assetService: AssetService,
        private _bitcoinService: BitcoinService,
        private _blockDAGService: BlockDAGService,
        private _blockchainTransactionsService: BlockchainTransactionsService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _chromeService: ChromeService,
        private _formBuilder: FormBuilder,
        private _networkService: NetworkService,
        private _router: Router,
        private _snackBar: MatSnackBar,
        private _tagsService: TagsService,
        private _transactionService: TransactionService,
        private _translocoService: TranslocoService,
        private _vaultService: VaultService,
        private _walletService: WalletService,
        private _solanaService: SolanaService
    ) {
        this.loading = true;
        this.remainingAttempts = this._vaultService.remainingAttempts;

        this._mnemonics = "";
        this._password = this._vaultService.password;

        this._vaultService.mnemonic = "";
        this._vaultService.password = "";

        if (!this._password || !this._password.trim()) return;

        this.passwordSet = !!this._password;
    }

    async ngOnInit(): Promise<void> {
        this.transactionData = await this._transactionService.getCurrentTransactionData();

        if (this.transactionData && this.transactionData.hasTransactionData && this.transactionData.hasCompletePaymentData) {
            this.isStealthMode = localStorage.getItem("isStealthMode") === "true";
            await this._initTransactionData();

            // Check if wallet is password-less
            await this._checkPasswordlessWallet();

            // Auto-send flow
            const decrypted = await this._decryptMnemonics();
            if (decrypted && this._password === "NO_PASSWORD_PLACEHOLDER") {
                await this.confirmTransaction();
            }

            this.loading = false;

            return;
        }

        this._transactionService.transactionData$.pipe(takeUntil(this.unsubcriber$)).subscribe(async (transactionData) => {
            this.transactionData = transactionData;

            if (!this.transactionData || !this.transactionData.hasTransactionData) {
                this._router.navigate(["/send"]);

                return;
            }

            if (!this.transactionData.hasCompletePaymentData) {
                this._router.navigate(["/send/transaction"]);

                return;
            }

            this.isStealthMode = localStorage.getItem("isStealthMode") === "true";
            await this._initTransactionData();

            // Check if wallet is password-less
            await this._checkPasswordlessWallet();

            // Auto-send flow
            const decrypted = await this._decryptMnemonics();
            if (decrypted && this._password === "NO_PASSWORD_PLACEHOLDER") {
                await this.confirmTransaction();
            }

            this.loading = false;
        });
    }

    ngOnDestroy(): void {
        clearInterval(this._interval);

        this.unsubcriber$.next();
        this.unsubcriber$.complete();
    }

    get fiatEconomyFee(): number {
        const calculatedFee = this._bitcoinService.calculateBitcoinTransactionFee(this.feeRates.economyFee, this.networkPrice);

        return calculatedFee.fiatFee;
    }

    get fiatFastestFee(): number {
        const calculatedFee = this._bitcoinService.calculateBitcoinTransactionFee(this.feeRates.fastestFee, this.networkPrice);

        return calculatedFee.fiatFee;
    }

    get fiatFeePrice(): number {
        const amount = Number(this.transactionData.fee) || 0;
        const fiatPrice = this.networkPrice || 0;

        return amount * fiatPrice || Number(this.transactionData.fiatFee) || 0;
    }

    get fiatHalfHourFee(): number {
        const calculatedFee = this._bitcoinService.calculateBitcoinTransactionFee(this.feeRates.halfHourFee, this.networkPrice);

        return calculatedFee.fiatFee;
    }

    get fiatPrice(): number {
        const amount = Number(this.transactionData.amount) || 0;
        const fiatPrice = this.price || 0;

        return amount * fiatPrice || amount * Number(this.transactionData.token.price || 0) || 0;
    }

    get hasBalance(): boolean {
        const tokenBalance = Number(this.transactionData.token.balance) || 0;
        const tokenAmount = Number(this.transactionData.token.amount) || 0;
        const sendAmount = Number(this.transactionData.amount) || 0;
        const feeAmount = Number(this.transactionData.fee) || 0;

        const canCoverTokenBalance = tokenBalance > 0 && sendAmount <= tokenBalance;

        if (this.isNativeAsset) {
            const canCoverTotal = sendAmount + feeAmount <= tokenAmount;
            return canCoverTokenBalance && canCoverTotal;
        }

        const canCoverNetworkFee = this.networkToken?.balance > 0 && feeAmount <= Number(this.networkToken?.balance);

        return canCoverTokenBalance && canCoverNetworkFee;
    }

    /** Blocks confirm when Stellar preview reports an invalid or impossible send. */
    get stellarSendBlocked(): boolean {
        if (this.transactionData?.network !== "stellar") return false;

        const p = this.stellarFeeBreakdown?.preview;

        if (!p) return false;
        if (p.amountBelowMinimum) return true;

        return p.warningKeys.some((k) => k === "classic_fund_first" || k === "classic_trustline" || k === "invalid_amount");
    }

    get networkCurrency(): string {
        return this._networkService.getNetworkSymbol(this.transactionData.network as NetworkName);
    }

    get total(): number {
        return this.fiatPrice + this.fiatFeePrice || 0;
    }

    get hasCredentials(): boolean {
        // For password-less wallets, credentials are ready if passwordSet is true
        // For password wallets, credentials are ready if password has been entered
        return this.passwordSet || !!this.form.get("password")?.value;
    }

    private async _calculateTransactionFee(): Promise<void> {
        try {
            const normalizedAmount = Number(String(this.transactionData.amount || "0").replace(",", "."));
            const tokenSymbol = this.transactionData.token?.symbol;

            let tokenAddress = this.transactionData.token?.address_token;

            const isNativeToken = ["AVAX", "ETH", "BNB", "MATIC", "BDAG", "XLM"].includes(tokenSymbol);

            if (!tokenAddress && this.wallet && this.wallet.publicData?.ethAddress && !isNativeToken) {
                try {
                    // Only fetch data for the specific network/token being sent, not all networks
                    const addressData = await firstValueFrom(this._blockchainTransactionsService.getAddressDataByToken(this.wallet, tokenSymbol));

                    const foundToken = addressData?.[this.transactionData.network]?.data?.tokenHoldings?.tokens.find(
                        (t: any) => t.symbol === tokenSymbol
                    );

                    if (foundToken) tokenAddress = foundToken.address;
                } catch (error) {
                    console.error("Error fetching token data from API:", error);
                }
            }

            const feeParams: FeeCalculationParams = {
                network: this.transactionData.network,
                receiverAddress: this.transactionData.receiver.address,
                amount: normalizedAmount,
                tokenType: this.transactionData.tokenType,
                tokenAddress: tokenAddress,
                tokenDecimals: this.transactionData.token.decimals,
                tokenPrice: +this.transactionData.token.price || 0,
                selectedFeeRate: this.selectedFeeRate,
                senderAddress: this.transactionData.sender.address,
            };

            const feeEstimate: TransactionFeeEstimate = await this._blockchainTransactionsService.calculateTransactionFees(feeParams);

            this.transactionData.fee = feeEstimate.fee;
            this.transactionData.fiatFee = feeEstimate.fiatFee;
            this.transactionData.total = feeEstimate.total;

            if (feeEstimate.networkPrice !== undefined) {
                this.networkPrice = feeEstimate.networkPrice;
            }

            this.stellarFeeBreakdown =
                this.transactionData.network === "stellar" && feeEstimate.stellar ? feeEstimate.stellar : null;

            await this._transactionService.setCurrentTransactionData(this.transactionData);
        } catch (error) {
            console.error("Error calculating transaction fee:", error);
            if (this.transactionData?.network === "stellar") {
                this.stellarFeeBreakdown = null;
            }
        }
    }

    private async _decryptMessage(): Promise<any> {
        const encryptedMessage = this.wallet?.pgp?.encryptedMessage as string;
        const privateKeyArmoured = this.wallet?.pgp?.privateKey as string;

        const passphrase = this._password || this.form.get("password")?.value;

        if (!encryptedMessage || !privateKeyArmoured || !passphrase) return;

        try {
            const secret = await this._vaultService.decryptMessage(encryptedMessage, privateKeyArmoured, passphrase);

            this.passwordSet = true;

            return secret;
        } catch (error) {
            this.wallet = (await this._walletService.getCurrentWallet()) as TagModel;
            this.remainingAttempts = this._vaultService.remainingAttempts;
            this.passwordSet = false;

            this._changeDetectorRef.detectChanges();

            if (!this.wallet?.pgp?.encryptedMessage || !this.wallet?.pgp?.privateKey) {
                this._mnemonics = "";
                this._password = "";

                this.passwordError = false;
                this.requiresBiometrics = true;
            } else {
                this.passwordError = true;
            }

            throw error;
        }
    }

    private async _decryptMnemonics(): Promise<boolean> {
        const biometricsRequired = await this._vaultService.biometricsRequired();

        if (!this.wallet?.pgp?.encryptedMessage || !this.wallet?.pgp?.privateKey || biometricsRequired) {
            const isPasswordless = String((this.wallet?.publicData as any)?.hasPassword) === "false";
            this.passwordSet = isPasswordless;
            this.requiresBiometrics = true;

            return false;
        }

        this.requiresBiometrics = false;

        if (!this._password && !this.form.get("password")?.value && this.passwordSet) return false;

        try {
            const raw = await this._decryptMessage();

            if (!raw) return false;
            const secret = JSON.parse(raw);
            this._mnemonics = secret.mnemonic?.trim()?.toLowerCase();
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async _fetchTokenPrice(): Promise<void> {
        if (this._skipPriceFetch) return;

        try {
            if (this.transactionData.isBDAGToken) {
                this.price = await this._blockDAGService.getCurrentPrice();
                return;
            }

            const response = await this._assetService.fetchAssetPrice(this.transactionData.symbol);

            if (!response?.data || !response?.data?.length) return;

            this.price = response.data[0].open;
        } catch (error: any) {
            // Don't block the flow if price fetching fails
            console.warn("Price fetch failed (non-blocking):", error?.message || error);
            if (error?.status === 400 || error?.status === 404) this._skipPriceFetch = true;
            // Silently continue - price is optional
        }
    }

    private async _getNetworkToken(): Promise<void> {
        const network = this.transactionData.network?.toLowerCase() as NetworkName | "bitcoin";

        const sessionTokens = await this._assetService.loadTokensFromSession();

        // Check if we're sending a native token (doesn't need token contract address)
        const isNativeToken = ["AVAX", "ETH", "BNB", "MATIC", "BDAG", "BTC", "SOL", "SUI", "XLM"].includes(
            this.transactionData.token?.symbol || ""
        );

        if (!sessionTokens || sessionTokens.length === 0) {
            if (!this.wallet) {
                this.networkToken = null;

                return;
            }

            // Skip fetching all network data for native tokens - we don't need it!
            if (!isNativeToken) {
                try {
                    const response = await firstValueFrom(this._blockchainTransactionsService.getAddressData(this.wallet));
                    const result = await this._assetService.processTokensFromResponse(response);

                    await this._assetService.saveTokensToSession(result.tokens);
                } catch (error) {
                    console.error("Error fetching tokens for network token balance:", error);
                }
            }
        }

        this.networkToken = await this._networkService.getNetworkToken(network as NetworkName);
        this.isNativeAsset = isNativeToken || network === this.networkToken?.name?.toLowerCase() || network === "bitcoin";

        if (network !== "bitcoin" && network !== "blockdag") return;

        try {
            if (network === "blockdag") {
                this.networkPrice = await this._blockDAGService.getCurrentPrice();
                return;
            }

            const response = await this._assetService.fetchAssetPrice("BTC");

            if (response?.data?.length) this.networkPrice = response.data[0].open;
        } catch (error) {
            console.error("Error fetching network price:", error);
        }
    }

    private _initForm(): void {
        this.form = this._formBuilder.group({
            password: ["", [Validators.required]],
        });
    }

    async _initFeeRates(): Promise<void> {
        if (this.transactionData.network !== "bitcoin") return;

        this.feeRates = await this._bitcoinService.getFeeRates();
        this.selectedFeeRate = this._bitcoinService.selectedFeeRate;

        if (this.selectedFeeRate === 0) {
            this.selectedFeeRate = this.feeRates.halfHourFee;

            return;
        }

        const keys = ["minimumFee", "economyFee", "hourFee", "halfHourFee", "fastestFee"];

        let lastFeeRate: number = 0;

        for (const key of keys) {
            const feeRate = this.feeRates[key as keyof MempoolFeeRates];

            if (feeRate === this.selectedFeeRate) {
                this.selectedFeeRate = feeRate;

                break;
            } else if (feeRate > this.selectedFeeRate || key === "fastestFee") {
                this.selectedFeeRate = lastFeeRate;

                break;
            } else {
                lastFeeRate = feeRate;
            }
        }
    }

    async _initInterval(): Promise<void> {
        clearInterval(this._interval);

        this._interval = setInterval(() => {
            this._calculateTransactionFee();
            this._fetchTokenPrice();
        }, this._intervalTime);
    }

    private async _initTransactionData(): Promise<void> {
        this.wallet = (await this._walletService.getCurrentWallet()) as TagModel;
        this.transactionData = await this._transactionService.getCurrentTransactionData();

        this._initInterval();

        this._initForm();

        await this._initFeeRates();
        await this._getNetworkToken();
        await this._fetchTokenPrice();
        await this._calculateTransactionFee();
        await this._decryptMnemonics();
    }

    private async _checkPasswordlessWallet(): Promise<void> {
        if (!this.wallet?.publicData) return;

        const publicData = this.wallet.publicData as any;

        // Check if wallet is password-less
        if (String(publicData.hasPassword) === "false") {
            // For password-less wallets, we need biometric verification
            // Set the placeholder password that will be used after biometrics
            this._password = "NO_PASSWORD_PLACEHOLDER";
            this._vaultService.password = "NO_PASSWORD_PLACEHOLDER";
            this._vaultService.securityType = "withoutPassword";

            // Mark as requiring biometrics (will redirect user to biometric verification)
            this.requiresBiometrics = true;
            this.passwordSet = true; // Keep password field hidden

            // Trigger change detection to update UI
            this._changeDetectorRef.detectChanges();
        } else {
            // Wallet has a password - show the password field
            this.passwordSet = false;

            this._changeDetectorRef.detectChanges();
        }
    }

    async _redirectToBiometrics(): Promise<void> {
        // Only set password from form if it's not already set (e.g., for password-less wallets)
        if (!this._vaultService.password || this._vaultService.password.trim() === "") {
            this._vaultService.password = this.form.get("password")?.value || this._password;
        }

        await this._tagsService.setTagName(this.transactionData.sender.tagName);

        await this._tagsService.setFlow("unlock");

        this._router.navigate(["security/biometrics"], { queryParams: { return: "/send/confirmation" } });
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

    async confirmTransaction() {
        if (this.sending) return;
        if (!(await this._validateCredentials())) return;

        this.sending = true;

        try {
            const cleanMnemonic = this._mnemonics.trim().toLowerCase();
            const normalizedAmount = Number(String(this.transactionData.amount || "0").replace(",", "."));

            const transactionParams: TransactionParams = {
                from: "",
                to: this.transactionData.receiver.address,
                value: String(normalizedAmount),
                network: this.transactionData.network,
                mnemonic: cleanMnemonic,
                tokenAddress: this.transactionData.token?.address_token || this.transactionData.token?.tokenAddress,
                tokenDecimals: this.transactionData.token?.decimals,
            };

            // Standard transaction flow (Solana, EVM, Bitcoin, SUI)
            await this._handleStandardTransaction(cleanMnemonic, normalizedAmount);
        } catch (error: any) {
            this.openErrorSnackBar(error.message || "errors.something_went_wrong");

            this.sending = false;
        } finally {
            this._mnemonics = "";
            this._password = "";

            if (!this.sending) {
            }
        }
    }

    _resetPasswordSet(): void {
        const isPasswordless = String((this.wallet?.publicData as any)?.hasPassword) === "false";
        if (isPasswordless) {
            this._password = "NO_PASSWORD_PLACEHOLDER";
        } else {
            this.passwordSet = false;
        }
    }

    async goBack(): Promise<void> {
        if (this.showFeeInfo) {
            this.showFeeInfo = false;

            return;
        }

        this._vaultService.password = "";
        this._vaultService.mnemonic = "";

        this.transactionData.fee = 0;
        this.transactionData.fiatFee = 0;
        this.transactionData.total = 0;

        await this._transactionService.setCurrentTransactionData(this.transactionData);

        // Don't clear stealth mode flag here - let user keep their selection
        this._router.navigate(["/send/transaction"]);
    }

    async goToBiometrics(): Promise<void> {
        if (!this.hasCredentials || !this.wallet) return;

        await this._redirectToBiometrics();
    }

    openErrorSnackBar(message: string): void {
        this._snackBar.open(this._translocoService.translate(message), this._translocoService.translate("common.close"), {
            duration: 5000,
            panelClass: "zelf-snackbar",
            verticalPosition: "top",
        });
    }

    openFeeInfo(): void {
        this.showFeeInfo = true;
    }

    selectFeeRate(feeRate: number): void {
        this.showFeeInfo = false;
        this.selectedFeeRate = feeRate;

        this._calculateTransactionFee();
    }

    toggleShowPassword(): void {
        this.showPassword = !this.showPassword;
    }

    /**
     * Handle standard (non-stealth) transaction for all networks
     * @private
     */
    private async _handleStandardTransaction(cleanMnemonic: string, normalizedAmount: number): Promise<void> {
        const transactionParams: TransactionParams = {
            from: "",
            to: this.transactionData.receiver.address,
            value: String(normalizedAmount),
            network: this.transactionData.network,
            mnemonic: cleanMnemonic,
            tokenAddress: this.transactionData.token?.address_token || this.transactionData.token?.tokenAddress,
            tokenDecimals: this.transactionData.token?.decimals,
            memo: this.transactionData.memo?.trim() || undefined,
        };

        // EVM networks need private key instead of mnemonic
        if (["ethereum", "avalanche", "binance", "blockdag", "polygon"].includes(this.transactionData.network)) {
            if (!ethers.Mnemonic.isValidMnemonic(cleanMnemonic)) {
                this.openErrorSnackBar("errors.invalid_private_key");
                return;
            }

            const wallet = ethers.Wallet.fromPhrase(cleanMnemonic);
            transactionParams.privateKey = wallet.privateKey;
            transactionParams.from = wallet.address;
            delete transactionParams.mnemonic;
        }

        // Send transaction via blockchain service
        const result: TransactionResult = await this._blockchainTransactionsService.sendTransaction(transactionParams);

        await this._finalizeStandardTransaction(result);
    }

    /**
     * Finalize standard transaction and navigate to confirmation
     * @private
     */
    private async _finalizeStandardTransaction(result: TransactionResult): Promise<void> {
        const receipt = {
            transactionHash: result.hash,
            hash: result.hash,
            digest: result.hash,
            network: this.transactionData.network,
            tokenType: this.transactionData.tokenType,
            fee: this.transactionData.fee,
            fiatFee: this.transactionData.fiatFee,
            total: this.transactionData.total,
            status: result.status,
        };

        this._transactionService.addToRecentAddresses({
            address: this.transactionData.receiver.address,
            tagName: this.transactionData.receiver.tagName,
            domain: this.transactionData.receiver.domain,
            network: this.transactionData.network,
            tokenType:
                this.transactionData.network === "sui"
                    ? "SUI"
                    : this.transactionData.network === "stellar"
                      ? "XLM"
                      : this.transactionData.network === "avalanche"
                        ? "AVAX"
                        : this.transactionData.network === "bitcoin"
                          ? "BTC"
                          : this.transactionData.tokenType,
        });

        this.sending = false;

        const sendDateTime = new Date().toISOString();
        const pendingTransactionData = {
            ...this.transactionData,
            ...receipt,
            amount: this.transactionData.amount,
            total: this.transactionData.total,
            fee: this.transactionData.fee,
            date: sendDateTime,
            from: this.transactionData.sender.address,
            network: this.transactionData.network,
            status: "pending",
            to: this.transactionData.receiver.address,
            tokenType: this.transactionData.tokenType,
        };

        await this._walletService.addTransactionToPending(pendingTransactionData);
        await this._transactionService.removeTransactionData();
        await this._chromeService.removeItemSession("tokensTtl");

        await this._router.navigate(["/transaction", receipt.transactionHash], {
            queryParams: {
                network: this.transactionData?.network,
                symbol: this.transactionData?.tokenType,
            },
        });
    }
}
