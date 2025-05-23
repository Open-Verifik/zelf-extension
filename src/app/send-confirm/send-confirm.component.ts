import { ethers } from "ethers";
import { firstValueFrom, Subject, takeUntil } from "rxjs";

import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";

import { AssetService } from "app/asset.service";
import { ChromeService } from "app/chrome.service";
import { EthereumService } from "app/eth.service";
import { AddressMaskPipe } from "app/pipes/address-mask.pipe";
import { BitcoinService, MempoolFeeRates } from "app/services/bitcoin.service";
import { BlockchainTransactionsService } from "app/services/blockchain-transactions.service";
import { NetworkName, NetworkService } from "app/services/network.service";
import { SuiService } from "app/services/sui.service";
import { SolanaService } from "app/solana.service";
import { TransactionService } from "app/transaction.service";
import { VaultService } from "app/vault.service";
import { TransactionData, WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { ZelfNameService } from "app/zelf-name-service.service";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";

@Component({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        TranslocoModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        AddressMaskPipe,
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
        { id: "ethereum", name: "Ethereum", symbol: "ETH" },
        { id: "avalanche", name: "Avalanche", symbol: "AVAX" },
    ];

    form!: UntypedFormGroup;
    loading: boolean;
    passwordError: boolean = false;
    passwordSet: boolean = false;
    price: number = 0;
    networkPrice: number = 0;
    remainingAttempts: number = 0;
    requiresBiometrics: boolean = false;
    sending: boolean = false;
    selectedFeeRate: number = 0;
    showPassword: boolean = false;
    showFeeInfo: boolean = false;
    transactionData!: TransactionData;
    wallet?: WalletModel;
    networkToken?: any;
    isNativeAsset: boolean = false;

    constructor(
        private _assetService: AssetService,
        private _bitcoinService: BitcoinService,
        private _blockchainTransactionsService: BlockchainTransactionsService,
        private _chromeService: ChromeService,
        private _ethService: EthereumService,
        private _formBuilder: FormBuilder,
        private _networkService: NetworkService,
        private _router: Router,
        private _snackBar: MatSnackBar,
        private _solanaService: SolanaService,
        private _suiService: SuiService,
        private _transactionService: TransactionService,
        private _translocoService: TranslocoService,
        private _vaultService: VaultService,
        private _walletService: WalletService,
        private _zelfNameService: ZelfNameService
    ) {
        this.loading = true;
        this.remainingAttempts = this._vaultService.remainingAttempts;

        this._mnemonics = "";
        this._password = this._vaultService.password;

        this._vaultService.mnemonic = "";
        this._vaultService.password = "";

        if (this._password && this._password.trim()) {
            this.passwordSet = true;
            this.requiresBiometrics = false;
        }
    }

    async ngOnInit(): Promise<void> {
        this.transactionData = await this._transactionService.getCurrentTransactionData();

        if (this.transactionData && this.transactionData.hasTransactionData && this.transactionData.hasCompletePaymentData) {
            this._initTransactionData().finally(() => (this.loading = false));

            return;
        }

        this._transactionService.transactionData$.pipe(takeUntil(this.unsubcriber$)).subscribe((transactionData) => {
            this.transactionData = transactionData;

            if (!this.transactionData || !this.transactionData.hasTransactionData) {
                this._router.navigate(["/send"]);

                return;
            } else if (!this.transactionData.hasCompletePaymentData) {
                this._router.navigate(["/send/transaction"]);

                return;
            }

            this._initTransactionData().finally(() => (this.loading = false));
        });
    }

    ngOnDestroy(): void {
        clearInterval(this._interval);

        this.unsubcriber$.next();
        this.unsubcriber$.complete();
    }

    get fiatPrice(): number {
        const amount = Number(this.transactionData.amount) || 0;
        const fiatPrice = this.price || 0;

        return amount * fiatPrice || amount * Number(this.transactionData.token.price || 0) || 0;
    }

    get fiatFeePrice(): number {
        const amount = Number(this.transactionData.fee) || 0;
        const fiatPrice = this.networkPrice || 0;

        return amount * fiatPrice || Number(this.transactionData.fiatFee) || 0;
    }

    get hasBalance(): boolean {
        if (this.isNativeAsset) {
            return Number(this.transactionData?.token?.fiatBalance) > 0 && Number(this.transactionData?.token?.fiatBalance) > this.total;
        }

        const canCoverNetworkCharges =
            Number(this.networkToken?.fiatBalance) > 0 && Number(this.transactionData.fiatFee) <= Number(this.networkToken?.fiatBalance);

        const canCoverTokenBalance =
            Number(this.transactionData.amount) > 0 && Number(this.transactionData.amount) <= Number(this.transactionData.token.amount);

        return canCoverNetworkCharges && canCoverTokenBalance;
    }

    get networkCurrency(): string {
        return this._networkService.getNetworkSymbol(this.transactionData.network);
    }

    get total(): number {
        return this.fiatPrice + this.fiatFeePrice || 0;
    }

    get fiatFastestFee(): number {
        const calculatedFee = this._bitcoinService.calculateBitcoinTransactionFee(this.feeRates.fastestFee, this.networkPrice);

        return calculatedFee.fiatFee;
    }

    get fiatHalfHourFee(): number {
        const calculatedFee = this._bitcoinService.calculateBitcoinTransactionFee(this.feeRates.halfHourFee, this.networkPrice);

        return calculatedFee.fiatFee;
    }

    get fiatEconomyFee(): number {
        const calculatedFee = this._bitcoinService.calculateBitcoinTransactionFee(this.feeRates.economyFee, this.networkPrice);

        return calculatedFee.fiatFee;
    }

    private async _getNetworkToken(): Promise<void> {
        const network = this.transactionData.network as NetworkName | "bitcoin";

        this.networkToken = await this._networkService.getNetworkToken(network as NetworkName);
        this.isNativeAsset = network === this.networkToken?.name || network === "bitcoin";

        if (network === "bitcoin") {
            try {
                const response = await this._assetService.fetchAssetPrice("BTC");
                if (response?.data?.length) {
                    this.networkPrice = response.data[0].open;
                }
            } catch (error) {
                console.error("Error fetching Bitcoin price:", error);
            }
        }
    }

    private async _calculateTransactionFee(): Promise<void> {
        try {
            const normalizedAmount = Number(String(this.transactionData.amount || "0").replace(",", "."));

            if (this.transactionData.network === "bitcoin") {
                try {
                    const response = await this._assetService.fetchAssetPrice("BTC");

                    if (response?.data?.length) this.networkPrice = response.data[0].open;

                    const calculatedFee = this._bitcoinService.calculateBitcoinTransactionFee(this.selectedFeeRate, this.networkPrice);

                    this.transactionData.fee = calculatedFee.feeBTC;
                    this.transactionData.fiatFee = calculatedFee.fiatFee;

                    const amountInUsd = normalizedAmount * (+this.transactionData.token.price || 0);

                    this.transactionData.total = amountInUsd + this.transactionData.fiatFee;

                    await this._transactionService.setCurrentTransactionData(this.transactionData);
                } catch (error) {
                    console.warn("Failed to fetch fee rates, using fallback", error);

                    const estimatedFeeInSatoshis = 150 * 10;
                    const feeBTC = this._bitcoinService.convertSatoshiToBTC(estimatedFeeInSatoshis);
                    const fiatFee = feeBTC * (this.networkPrice || 0);

                    this.transactionData.fee = feeBTC;
                    this.transactionData.fiatFee = fiatFee;

                    const amountInUsd = normalizedAmount * (+this.transactionData.token.price || 0);
                    this.transactionData.total = amountInUsd + this.transactionData.fiatFee;

                    await this._transactionService.setCurrentTransactionData(this.transactionData);
                }

                return;
            } else if (this.transactionData.network === "solana") {
                const tokenAddress = this.transactionData.tokenType === "SPL" ? this.transactionData.token?.address_token : undefined;

                const feeEstimate = await this._solanaService.getTransactionCost(tokenAddress);

                this.transactionData.fee = feeEstimate.gasPrice || 0;
                this.transactionData.fiatFee = feeEstimate.fiatFee || 0;

                const amountInUsd = normalizedAmount * (+this.transactionData.token.price || 0);

                this.transactionData.total = amountInUsd + this.transactionData.fiatFee;

                await this._transactionService.setCurrentTransactionData(this.transactionData);

                return;
            } else if (this.transactionData.network === "sui") {
                if (this.transactionData.tokenType === "SUI") {
                    const feeEstimate = await this._suiService.estimateSuiTransactionFee(this.transactionData.receiver.address, normalizedAmount);

                    this.transactionData.fee = feeEstimate.estimatedFee;
                    this.transactionData.fiatFee = feeEstimate.estimatedFeeUsd;
                } else {
                    const tokenAddress = this.transactionData.token?.address_token;

                    if (!tokenAddress) throw new Error("Token address is required");

                    const feeEstimate = await this._suiService.estimateTokenTransactionFee(
                        this.transactionData.receiver.address,
                        tokenAddress,
                        normalizedAmount,
                        this.transactionData.token.decimals || 9
                    );

                    this.transactionData.fee = feeEstimate.estimatedFee;
                    this.transactionData.fiatFee = feeEstimate.estimatedFeeUsd;
                }

                const amountInUsd = normalizedAmount * (+this.transactionData.token.price || 0);

                this.transactionData.total = amountInUsd + this.transactionData.fiatFee;

                await this._transactionService.setCurrentTransactionData(this.transactionData);
            } else {
                let transactionCost;

                const receiverAddress = this.transactionData.receiver.address;
                const isERC20 = this.transactionData.tokenType === "ERC-20";
                const tokenAddress = this.transactionData.token?.address_token;

                if (isERC20 && tokenAddress) {
                    transactionCost = await this._ethService.getTransactionCost(
                        receiverAddress,
                        this._ethService.toWei(String(normalizedAmount), this.transactionData.token.decimals),
                        "0x",
                        this.transactionData.network,
                        tokenAddress
                    );
                } else {
                    transactionCost = await this._ethService.getTransactionCost(
                        receiverAddress,
                        this._ethService.toWei(String(normalizedAmount)),
                        "0x",
                        this.transactionData.network
                    );
                }

                this.networkPrice = transactionCost.networkPrice || 0;

                this.transactionData.fee = transactionCost.fee || 0;
                this.transactionData.fiatFee = transactionCost.fiatFee || 0;
                this.transactionData.total = transactionCost.total || 0;

                await this._transactionService.setCurrentTransactionData(this.transactionData);
            }
        } catch (error) {
            console.error("Error calculating transaction fee:", error);
        }
    }

    private async _decryptMnemonics(): Promise<any> {
        if (!this.wallet?.pgp?.encryptedMessage || !this.wallet?.pgp?.privateKey || (await this._vaultService.biometricsRequired())) {
            this.passwordSet = false;
            this.requiresBiometrics = true;

            return;
        }

        if (!this._password && !this.form.get("password")?.value) return;

        const secret = JSON.parse(await this._decryptMessage());

        this._mnemonics = secret.mnemonic?.trim()?.toLowerCase();

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

    async _fetchTokenPrice(): Promise<void> {
        if (this._skipPriceFetch) return;

        try {
            const response = await this._assetService.fetchAssetPrice(this.transactionData.symbol);

            if (!response?.data || !response?.data?.length) return;

            this.price = response.data[0].open;
        } catch (error: any) {
            if (error?.status === 400) this._skipPriceFetch = true;
        }
    }

    private _initForm(): void {
        this.form = this._formBuilder.group({
            password: ["", [Validators.required]],
        });
    }

    private async _initTransactionData(): Promise<void> {
        this.wallet = (await this._walletService.getCurrentWallet()) as WalletModel;
        this.transactionData = await this._transactionService.getCurrentTransactionData();

        this._initInterval();
        this._initForm();

        await this._initFeeRates();
        await this._getNetworkToken();
        await this._fetchTokenPrice();
        await this._calculateTransactionFee();
        await this._decryptMnemonics();
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

        // Find the fee rate that is the closest to the selected fee rate as the rates may have changed
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

    async _redirectToBiometrics(): Promise<void> {
        this._vaultService.password = this.form.get("password")?.value;

        await this._zelfNameService.setZelfName(this.transactionData.sender.zelfName);
        await this._zelfNameService.setFlow("unlock");

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

            let receipt;

            if (this.transactionData.network === "bitcoin") {
                const receiverAddress = this.transactionData.receiver.address;
                const isTestnet = receiverAddress.startsWith("tb1");

                try {
                    const txHash = await this._bitcoinService.createBitcoinTransaction(
                        cleanMnemonic,
                        receiverAddress,
                        normalizedAmount,
                        this.selectedFeeRate,
                        isTestnet
                    );

                    receipt = {
                        transactionHash: txHash,
                        network: "bitcoin",
                        tokenType: "BTC",
                        fee: this.transactionData.fee,
                        fiatFee: this.transactionData.fiatFee,
                        total: this.transactionData.total,
                    };
                } catch (error) {
                    throw new Error("Failed to create Bitcoin transaction. " + (error as any).message);
                }
            } else if (this.transactionData.network === "solana") {
                let tokenAddress = "";

                if (this.transactionData.tokenType === "SPL") {
                    tokenAddress = this.transactionData.token?.tokenAddress || this.transactionData.token?.address_token || "";

                    if (!tokenAddress) throw new Error("Token address not found for SPL token");
                }

                receipt = await this._solanaService.sendTokens(cleanMnemonic, this.transactionData.receiver.address, tokenAddress, normalizedAmount);

                receipt = {
                    transactionHash: receipt,
                    network: "solana",
                    tokenType: this.transactionData.tokenType,
                };
            } else if (this.transactionData.network === "sui") {
                if (this.transactionData.tokenType === "SUI") {
                    receipt = await this._suiService.transferSui(cleanMnemonic, this.transactionData.receiver.address, normalizedAmount);
                } else {
                    const tokenAddress = this.transactionData.token?.address_token;

                    if (!tokenAddress) throw new Error("Token address is required");

                    receipt = await this._suiService.transferToken(
                        cleanMnemonic,
                        this.transactionData.receiver.address,
                        tokenAddress,
                        normalizedAmount
                    );
                }
            } else {
                if (!ethers.Mnemonic.isValidMnemonic(cleanMnemonic)) {
                    this.openErrorSnackBar("errors.invalid_private_key");

                    return;
                }

                const wallet = ethers.Wallet.fromPhrase(cleanMnemonic);
                const normalizedAmount = String(this.transactionData.amount || "0").replace(",", ".");
                const tokenSymbol = this.transactionData.token?.symbol || "";

                let tokenAddress = this.transactionData.token?.address_token;

                if (!tokenAddress && this.wallet && tokenSymbol !== "AVAX" && tokenSymbol !== "ETH") {
                    try {
                        const addressData = await firstValueFrom(this._blockchainTransactionsService.getAddressData(this.wallet));

                        if (this.transactionData.network === "avalanche" && addressData?.avalanche?.data?.tokenHoldings?.tokens) {
                            const foundToken = addressData.avalanche.data.tokenHoldings.tokens.find((t: any) => t.symbol === tokenSymbol);

                            if (foundToken) tokenAddress = foundToken.address;
                        } else if (this.transactionData.network === "ethereum" && addressData?.ethereum?.data?.tokenHoldings?.tokens) {
                            const foundToken = addressData.ethereum.data.tokenHoldings.tokens.find((t: any) => t.symbol === tokenSymbol);

                            if (foundToken) tokenAddress = foundToken.address;
                        }
                    } catch (error) {
                        console.error("Error fetching token data from API:", error);
                    }
                }

                const isNativeToken = ["AVAX", "ETH"].includes(tokenSymbol);
                const isERC20 = !!tokenAddress && !isNativeToken;

                if (isERC20 && tokenAddress) {
                    receipt = await this._ethService.sendERC20Transaction(
                        normalizedAmount,
                        wallet.privateKey,
                        this.transactionData.receiver.address,
                        tokenAddress,
                        this.transactionData.network
                    );
                } else {
                    receipt = await this._ethService.sendTransaction(
                        normalizedAmount,
                        wallet.privateKey,
                        this.transactionData.receiver.address,
                        this.transactionData.network
                    );
                }
            }

            this._transactionService.addToRecentAddresses({
                address: this.transactionData.receiver.address,
                zelfName: this.transactionData.receiver.zelfName,
                network: this.transactionData.network,
                tokenType:
                    this.transactionData.network === "sui"
                        ? "SUI"
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

            if (this.transactionData.network === "solana" && receipt.transactionHash) {
                await this._router.navigate(["/transaction", receipt.transactionHash], {
                    queryParams: {
                        network: "solana",
                        symbol: this.transactionData.tokenType,
                    },
                });
            } else if (this.transactionData.network === "sui" && receipt.digest) {
                await this._router.navigate(["/transaction", receipt.digest], {
                    queryParams: { network: "sui", symbol: "SUI" },
                });
            } else if (this.transactionData.network === "bitcoin" && receipt.transactionHash) {
                await this._router.navigate(["/transaction", receipt.transactionHash], {
                    queryParams: {
                        network: "bitcoin",
                        tokenType: "BTC",
                    },
                });
            } else if (receipt.transactionHash) {
                await this._router.navigate(["/transaction", receipt.transactionHash], {
                    queryParams: { network: this.transactionData.network, symbol: this.transactionData.symbol },
                });
            } else {
                this._router.navigate(["/send"]);
            }
        } catch (error: any) {
            console.error("Transaction error:", error);
            this.openErrorSnackBar(error.message || "errors.something_went_wrong");
            this.sending = false;
        } finally {
            this._mnemonics = "";
            this._password = "";
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

        this._router.navigate(["/send/transaction"]);
    }

    async goToBiometrics(): Promise<void> {
        const password = this.form.get("password")?.value;

        if (!password || !password.trim() || !this.wallet) return;

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
}
