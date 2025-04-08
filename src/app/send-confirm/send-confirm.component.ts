import { ethers } from "ethers";
import { firstValueFrom } from "rxjs";

import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@ngneat/transloco";

import { EthereumService } from "app/eth.service";
import { TransactionService } from "app/transaction.service";
import { VaultService } from "app/vault.service";
import { TransactionData, WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { AddressMaskPipe } from "app/pipes/address-mask.pipe";
import { ZelfNameService } from "app/zelf-name-service.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subject, takeUntil } from "rxjs";
import { SuiService } from "app/services/sui.service";
import { BlockchainTransactionsService } from "app/services/blockchain-transactions.service";

@Component({
    imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslocoModule, MatButtonModule, MatProgressSpinnerModule, AddressMaskPipe],
    selector: "send-confirm",
    standalone: true,
    styleUrls: ["./send-confirm.component.scss"],
    templateUrl: "./send-confirm.component.html",
})
export class SendConfirmComponent implements OnInit, OnDestroy {
    private _password: string = "";
    private _mnemonics: string = "";
    private unsubcriber$: Subject<void> = new Subject<void>();

    availableNetworks = [
        { id: "ethereum", name: "Ethereum", symbol: "ETH" },
        { id: "avalanche", name: "Avalanche", symbol: "AVAX" },
    ];

    form!: UntypedFormGroup;
    loading: boolean;
    passwordError: boolean = false;
    passwordSet: boolean = false;
    remainingAttempts: number = this._vaultService.remainingAttempts;
    requiresBiometrics: boolean = false;
    sending: boolean = false;
    showPassword: boolean = false;
    transactionData!: TransactionData;
    wallet?: WalletModel;

    constructor(
        private _ethService: EthereumService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _snackBar: MatSnackBar,
        private _transactionService: TransactionService,
        private _translocoService: TranslocoService,
        private _vaultService: VaultService,
        private _walletService: WalletService,
        private _zelfNameService: ZelfNameService,
        private _suiService: SuiService,
        private _blockchainTransactionsService: BlockchainTransactionsService
    ) {
        this.loading = true;

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
            this._initTransactionData()
                .catch(() => this.goBack())
                .finally(() => (this.loading = false));

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

            this._initTransactionData()
                .catch(() => this.goBack())
                .finally(() => (this.loading = false));
        });
    }

    ngOnDestroy(): void {
        this.unsubcriber$.next();
        this.unsubcriber$.complete();
    }

    private async _calculateTransactionFee(): Promise<void> {
        try {
            const normalizedAmount = Number(String(this.transactionData.amount || "0").replace(",", "."));

            if (this.transactionData.network === "sui") {
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

                await this._transactionService.setCurrentTransactionData(this.transactionData);

                return;
            }

            let transactionCost;

            const receiverAddress = this.transactionData.receiver.address;

            if (this.transactionData.tokenType === "ERC-20") {
                if (!this.transactionData.token?.address_token) {
                    throw new Error("Contract address is required for ERC-20 transfer");
                }

                transactionCost = await this._ethService.getTransactionCost(
                    receiverAddress,
                    this._ethService.toWei(String(normalizedAmount), this.transactionData.token.decimals)
                );
            } else {
                transactionCost = await this._ethService.getTransactionCost(receiverAddress, this._ethService.toWei(String(normalizedAmount)));
            }

            this.transactionData.fee = Number(this._ethService.fromWei(transactionCost.totalCost));

            const price = this.transactionData.network === "avalanche" ? await this._ethService.getAVAXPrice() : await this._ethService.getETHPrice();

            this.transactionData.fiatFee = Number(this.transactionData.fee) * price;

            const amountInUsd = normalizedAmount * (+this.transactionData.token.price || 0);

            this.transactionData.total = amountInUsd + this.transactionData.fiatFee;

            await this._transactionService.setCurrentTransactionData(this.transactionData);
        } catch (error) {
            this.openErrorSnackBar("errors.invalid_transaction_fee");
        }
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
            password: ["", [Validators.required]],
        });
    }

    private async _initTransactionData(): Promise<void> {
        this.wallet = (await this._walletService.getCurrentWallet()) as WalletModel;
        this.transactionData = await this._transactionService.getCurrentTransactionData();

        this._initForm();

        await this._calculateTransactionFee();
        await this._decryptMnemonics();
    }

    async confirmTransaction() {
        if (this.sending) return;

        if (!this._mnemonics) {
            if (!this.form.get("password")?.value) {
                this.openErrorSnackBar("errors.empty_password");
                return;
            }

            await this._decryptMnemonics();

            if (!this._mnemonics) {
                this.openErrorSnackBar("errors.private_key_locked");
                return;
            }
        }

        this.sending = true;

        try {
            const cleanMnemonic = this._mnemonics.trim().toLowerCase();

            let receipt;

            if (this.transactionData.network === "sui") {
                const normalizedAmount = Number(String(this.transactionData.amount || "0").replace(",", "."));

                if (this.transactionData.tokenType === "SUI") {
                    receipt = await this._suiService.transferSui(cleanMnemonic, this.transactionData.receiver.address, normalizedAmount);
                } else {
                    const tokenAddress = this.transactionData.token?.address_token;

                    if (!tokenAddress) throw new Error("Token address is required");

                    receipt = await this._suiService.transferToken(
                        cleanMnemonic,
                        this.transactionData.receiver.address,
                        tokenAddress,
                        normalizedAmount,
                        this.transactionData.token.decimals || 9
                    );
                }
            } else {
                if (!ethers.Mnemonic.isValidMnemonic(cleanMnemonic)) {
                    this.openErrorSnackBar("errors.invalid_private_key");
                    return;
                }

                const wallet = ethers.Wallet.fromPhrase(cleanMnemonic);
                const normalizedAmount = String(this.transactionData.amount || "0").replace(",", ".");

                let tokenAddress = this.transactionData.token?.address_token;
                const tokenSymbol = this.transactionData.token?.symbol || "";

                if (!tokenAddress && this.wallet && tokenSymbol !== "AVAX" && tokenSymbol !== "ETH") {
                    try {
                        const addressData = await firstValueFrom(this._blockchainTransactionsService.getAddressData(this.wallet));

                        if (this.transactionData.network.toLowerCase() === "avalanche" && addressData?.avalanche?.data?.tokenHoldings?.tokens) {
                            const foundToken = addressData.avalanche.data.tokenHoldings.tokens.find((t: any) => t.symbol === tokenSymbol);

                            if (foundToken) {
                                tokenAddress = foundToken.address;
                            }
                        } else if (this.transactionData.network.toLowerCase() === "ethereum" && addressData?.ethereum?.data?.tokenHoldings?.tokens) {
                            const foundToken = addressData.ethereum.data.tokenHoldings.tokens.find((t: any) => t.symbol === tokenSymbol);

                            if (foundToken) {
                                tokenAddress = foundToken.address;
                            }
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
                        : this.transactionData.tokenType,
            });

            this.sending = false;

            const sendDateTime = new Date().toISOString();

            const pendingTransactionData = {
                ...this.transactionData,
                ...receipt,
                amount: this.transactionData.total,
                date: sendDateTime,
                from: this.transactionData.sender.address,
                network: this.transactionData.network,
                status: "pending",
                to: this.transactionData.receiver.address,
                tokenType:
                    this.transactionData.network === "sui"
                        ? "SUI"
                        : this.transactionData.network === "avalanche"
                        ? "AVAX"
                        : this.transactionData.tokenType,
            };

            await this._walletService.addTransactionToPending(pendingTransactionData);
            await this._transactionService.removeTransactionData();

            if (receipt.transactionHash) {
                await this._router.navigate(["/transaction", receipt.transactionHash], {
                    queryParams: { tokenType: this.transactionData.tokenType },
                });
            } else {
                await this._router.navigate(["/send"]);
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

        this._vaultService.password = this.form.get("password")?.value;

        await this._zelfNameService.setZelfName(this.transactionData.sender.zelfName);
        await this._zelfNameService.setFlow("unlock");

        this._router.navigate(["security/biometrics"], { queryParams: { return: "/send/confirmation" } });
    }

    openErrorSnackBar(message: string): void {
        this._snackBar.open(this._translocoService.translate(message), this._translocoService.translate("common.close"), {
            duration: 5000,
            panelClass: "zelf-snackbar",
            verticalPosition: "top",
        });
    }

    toggleShowPassword(): void {
        this.showPassword = !this.showPassword;
    }
}
