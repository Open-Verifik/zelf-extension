import { ethers } from "ethers";

import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";

import { EthereumService } from "app/eth.service";
import { TransactionService } from "app/transaction.service";
import { VaultService } from "app/vault.service";
import { Token, WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { AddressMaskPipe } from "app/pipes/address-mask.pipe";

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

    amount: number = 0;
    canConfirm: boolean = false;
    fee: number = 0;
    feeUsd: number = 0;
    form!: UntypedFormGroup;
    fromAddress: string = "";
    requiresBiometrics: boolean = false;
    receiver!: WalletModel;
    sending: boolean = false;
    showPassword: boolean = false;
    toAddress: string = "";
    token: Token;
    total: number = 0;
    transactionData: any;
    wallet?: WalletModel;
    selectedNetwork: string;
    availableNetworks = [
        { id: "ethereum", name: "Ethereum", symbol: "ETH" },
        { id: "avalanche", name: "Avalanche", symbol: "AVAX" },
    ];

    constructor(
        private _ethService: EthereumService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _transactionService: TransactionService,
        private _vaultService: VaultService,
        private _walletService: WalletService
    ) {
        this._mnemonics = "";
        this._password = this._vaultService.password;

        this.amount = this._transactionService.withdrawalAmount;
        this.fromAddress = this._transactionService.fromAddress;
        this.receiver = this._transactionService.receiver;
        this.token = this._transactionService.token;
        this.toAddress = this._transactionService.toAddress;

        if (this._password && this._password.trim()) this.requiresBiometrics = false;

        this._initForm();
        this.selectedNetwork = this.token?.network?.toLowerCase() || "ethereum";
    }

    async ngOnInit(): Promise<void> {
        this.wallet = (await this._walletService.getFirstWalletFromStorage()) as WalletModel;
        await this._calculateTransactionFee();
        await this._decryptMnemonics();
    }

    ngOnDestroy(): void {
        this._vaultService.password = "";
    }

    private async _calculateTransactionFee(): Promise<void> {
        try {
            if (!this.token) {
                console.error("No transaction details available");
                return;
            }

            let transactionCost;
            const isEthereumToken = this.token.tokenType === "ETH";
            const isAvaxToken = this.token.tokenType === "AVAX";

            if (!isEthereumToken && !isAvaxToken) {
                const tokenAddress = this.token.address;
                if (!tokenAddress || !this._ethService.checkIfValidAddress(tokenAddress)) {
                    console.error("Invalid token address:", tokenAddress);
                    return;
                }

                const formattedTokenAddress = tokenAddress.startsWith("0x") ? tokenAddress : `0x${tokenAddress}`;
                transactionCost = await this._ethService.getTransactionCost(
                    formattedTokenAddress,
                    this._ethService.toWei(String(this.amount || "0"), this.token.decimals)
                );
            } else {
                if (!this.toAddress || !this._ethService.checkIfValidAddress(this.toAddress)) {
                    console.error("Invalid destination address:", this.toAddress);
                    return;
                }

                const formattedToAddress = this.toAddress.startsWith("0x") ? this.toAddress : `0x${this.toAddress}`;
                const normalizedAmount = String(this.amount || "0").replace(",", ".");
                const amountInWei = this._ethService.toWei(normalizedAmount);

                transactionCost = await this._ethService.getTransactionCost(formattedToAddress, amountInWei);
            }

            this.fee = Number(this._ethService.fromWei(transactionCost.totalCost));

            const price = this.selectedNetwork === "avalanche" ? await this._ethService.getAVAXPrice() : await this._ethService.getETHPrice();

            this.feeUsd = Number(this.fee) * price;
            const amountInUsd = Number(this.amount) * (this.token?.price || 0);
            this.total = amountInUsd + this.feeUsd;

            this.transactionData = {
                amount: this.amount,
                gasFee: this.fee,
                feeUsd: this.feeUsd,
                sender: this.fromAddress,
                receiver: this.toAddress,
                total: this.total,
                network: this.selectedNetwork,
            };
        } catch (error) {
            console.error("Error calculating transaction fee:", error);
        }
    }

    private async _decryptMnemonics(): Promise<any> {
        if (!this.wallet?.pgp?.encryptedMessage || !this.wallet?.pgp?.privateKey) {
            this.requiresBiometrics = true;

            return;
        }

        if (!this._password && !this.form.get("password")?.value) return;

        this._mnemonics = JSON.parse(await this._decryptMessage()).mnemonic;

        this.canConfirm = true;
    }

    private async _decryptMessage(): Promise<any> {
        const encryptedMessage = this.wallet?.pgp?.encryptedMessage as string;
        const privateKeyArmoured = this.wallet?.pgp?.privateKey as string;
        const passphrase = this._password || this.form.get("password")?.value;

        if (!encryptedMessage || !privateKeyArmoured || !passphrase) return;

        return await this._vaultService.decryptMessage(encryptedMessage, privateKeyArmoured, passphrase);
    }

    private _initForm(): void {
        this.form = this._formBuilder.group({
            password: ["", [Validators.required]],
        });
    }

    async confirmTransaction() {
        if (this.sending) return;

        if (!this._mnemonics) {
            const error = new Error("mnemonics locked - add dialog here.");

            if (!this.form.get("password")?.value) throw error;

            await this._decryptMnemonics();

            if (!this._mnemonics) throw error;
        }

        this.sending = true;

        try {
            const cleanMnemonic = this._mnemonics.trim().toLowerCase();

            if (!ethers.Mnemonic.isValidMnemonic(cleanMnemonic)) {
                throw new Error("Invalid mnemonic phrase");
            }

            const wallet = ethers.Wallet.fromPhrase(cleanMnemonic);
            const amountStr = String(this.amount);
            const normalizedAmount = amountStr.replace(",", ".");

            let receipt;

            // Determine if it's an ERC20 token
            if (this.token.tokenType === "ERC-20" && this.token.address) {
                const tokenAddress = this.token.address.split("?")[0]; // Remove query parameters if present
                receipt = await this._ethService.sendERC20Transaction(
                    normalizedAmount,
                    wallet.privateKey,
                    this.toAddress,
                    tokenAddress,
                    this.selectedNetwork
                );
            } else {
                receipt = await this._ethService.sendTransaction(normalizedAmount, wallet.privateKey, this.toAddress, this.selectedNetwork);
            }

            this._transactionService.addToRecentAddresses({
                address: this.receiver.ethAddress,
                zelfName: this.receiver?.publicData?.zelfName,
                network: this.selectedNetwork,
                tokenType: this.token.tokenType,
            });

            this.sending = false;
            await this._router.navigate(["/transaction", receipt.transactionHash]);

            if (!receipt.blockHash) {
                const sendDateTime = new Date().toISOString();
                this._walletService.addTransactionToPending({
                    ...receipt,
                    date: sendDateTime,
                    from: this.fromAddress,
                    network: this.selectedNetwork,
                    status: "pending",
                    to: this.toAddress,
                });
            }

            this._router.navigate(["/transaction", receipt.transactionHash]);
        } catch (error: any) {
            this.sending = false;
            console.error("Error during transaction execution:", error);
        }
    }

    goToBiometrics(): void {
        const password = this.form.get("password")?.value;

        if (!password || !password.trim()) return;

        this._vaultService.password = this.form.get("password")?.value;
        this._router.navigate(["/security/biometrics"]);
    }

    toggleShowPassword(): void {
        this.showPassword = !this.showPassword;
    }
}
