import { ethers } from "ethers";

import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
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

@Component({
    imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslocoModule, MatButtonModule, MatProgressSpinnerModule, AddressMaskPipe],
    selector: "send-confirm",
    standalone: true,
    styleUrls: ["./send-confirm.component.scss"],
    templateUrl: "./send-confirm.component.html",
})
export class SendConfirmComponent implements OnInit {
    private _password: string = "";
    private _mnemonics: string = "";

    availableNetworks = [
        { id: "ethereum", name: "Ethereum", symbol: "ETH" },
        { id: "avalanche", name: "Avalanche", symbol: "AVAX" },
    ];

    amount: number = 0;
    form!: UntypedFormGroup;
    loading: boolean = true;
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
        private _zelfNameService: ZelfNameService
    ) {
        this._mnemonics = ""; // Should always be empty on init
        this._password = this._vaultService.password; // Get from service, then clear immediately

        this._vaultService.mnemonic = "";
        this._vaultService.password = "";

        if (this._password && this._password.trim()) {
            this.passwordSet = true;
            this.requiresBiometrics = false;
        }
    }

    async ngOnInit(): Promise<void> {
        this.wallet = (await this._walletService.getCurrentWallet()) as WalletModel;
        this.transactionData = await this._transactionService.getCurrentTransactionData();
        console.log(` SendConfirmComponent ~ ngOnInit ~ this.transactionData:`, this.transactionData);

        this._initForm();

        await this._calculateTransactionFee();
        await this._decryptMnemonics();

        this.loading = false;
    }

    private async _calculateTransactionFee(): Promise<void> {
        try {
            const token = this.transactionData.token;
            const senderAddress = this.transactionData.sender.address;

            let transactionCost;

            if (!this.transactionData.isEthToken && !this.transactionData.isAvaxToken) {
                if (!this._ethService.checkIfValidAddress(senderAddress)) {
                    console.error("Invalid token address:", senderAddress);

                    return;
                }

                const formattedTokenAddress = senderAddress.startsWith("0x") ? senderAddress : `0x${senderAddress}`;

                transactionCost = await this._ethService.getTransactionCost(
                    formattedTokenAddress,
                    this._ethService.toWei(String(this.amount || "0"), token.decimals)
                );
            } else {
                if (!this._ethService.checkIfValidAddress(senderAddress)) {
                    console.error("Invalid destination address:", senderAddress);

                    return;
                }

                const formattedToAddress = senderAddress.startsWith("0x") ? senderAddress : `0x${senderAddress}`;
                const normalizedAmount = String(this.amount || "0").replace(",", ".");
                const amountInWei = this._ethService.toWei(normalizedAmount);

                transactionCost = await this._ethService.getTransactionCost(formattedToAddress, amountInWei);
            }

            this.transactionData.fee = Number(this._ethService.fromWei(transactionCost.totalCost));

            const price = this.transactionData.network === "avalanche" ? await this._ethService.getAVAXPrice() : await this._ethService.getETHPrice();

            this.transactionData.fiatFee = Number(this.transactionData.fee) * price;

            const amountInUsd = Number(this.transactionData.amount) * (+token.price || 0);

            this.transactionData.total = amountInUsd + this.transactionData.fiatFee;

            await this._transactionService.setCurrentTransactionData(this.transactionData);
        } catch (error) {
            console.error("Error calculating transaction fee:", error);
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
            this.remainingAttempts = this._vaultService.remainingAttempts;

            if (!this.wallet.pgp) {
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

            if (!ethers.Mnemonic.isValidMnemonic(cleanMnemonic)) {
                this.openErrorSnackBar("errors.invalid_private_key");

                return;
            }

            const wallet = ethers.Wallet.fromPhrase(cleanMnemonic);
            const amountStr = String(this.amount);
            const normalizedAmount = amountStr.replace(",", ".");

            let receipt;

            // Determine if it's an ERC20 token
            if (this.transactionData.tokenType === "ERC-20" && this.transactionData.sender.address) {
                const tokenAddress = this.transactionData.sender.address.split("?")[0]; // Remove query parameters if present

                receipt = await this._ethService.sendERC20Transaction(
                    normalizedAmount,
                    wallet.privateKey,
                    this.transactionData.sender.address,
                    tokenAddress,
                    this.transactionData.network
                );
            } else {
                receipt = await this._ethService.sendTransaction(
                    normalizedAmount,
                    wallet.privateKey,
                    this.transactionData.sender.address,
                    this.transactionData.network
                );
            }

            this._transactionService.addToRecentAddresses({
                address: this.transactionData.receiver.address,
                zelfName: this.transactionData.receiver.zelfName,
                network: this.transactionData.network,
                tokenType: this.transactionData.tokenType,
            });

            this.sending = false;

            if (!receipt.blockHash) {
                const sendDateTime = new Date().toISOString();

                this._walletService.addTransactionToPending({
                    ...receipt,
                    ...this.transactionData,
                    date: sendDateTime,
                    from: this.transactionData.sender.address,
                    network: this.transactionData.network,
                    status: "pending",
                    to: this.transactionData.receiver.address,
                });
            }

            await this._transactionService.removeTransactionData();

            this._router.navigate(["/transaction", receipt.transactionHash]);
        } catch (error: any) {
            this.sending = false;

            console.error("Error during transaction execution:", error);
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
