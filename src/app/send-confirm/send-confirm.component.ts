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
import { WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";

@Component({
    imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslocoModule, MatButtonModule, MatProgressSpinnerModule],
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
    fee: string = "0";
    feeUsd: string = "0";
    form!: UntypedFormGroup;
    fromAddress: string = "";
    requiresBiometrics: boolean = false;
    selectedToken: any;
    sending: boolean = false;
    showPassword: boolean = false;
    toAddress: string = "";
    total: string = "0";
    transactionData: any;
    wallet?: WalletModel;

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
        this.selectedToken = this._transactionService.selectedToken;
        this.toAddress = this._transactionService.toAddress;

        if (this._password && this._password.trim()) this.requiresBiometrics = false;

        this._initForm();
    }

    async ngOnInit(): Promise<void> {
        this.wallet = (await this._walletService.getCurrentWalletFromStorage()) as WalletModel;

        await this._calculateTransactionFee();
        await this._decryptMnemonics();
    }

    private async _calculateTransactionFee(): Promise<void> {
        try {
            if (!this.selectedToken) {
                console.error("No transaction details available");

                return;
            }

            let transactionCost;

            if (this.selectedToken.tokenType !== "ETH") {
                const tokenAddress = this.selectedToken.address;

                if (!tokenAddress || !this._ethService.checkIfValidAddress(tokenAddress)) {
                    console.error("Invalid token address:", tokenAddress);

                    return;
                }

                const formattedTokenAddress = tokenAddress.startsWith("0x") ? tokenAddress : `0x${tokenAddress}`;

                transactionCost = await this._ethService.getTransactionCost(
                    formattedTokenAddress,
                    this._ethService.toWei(String(this.amount || "0"), this.selectedToken.decimals)
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

            this.fee = Number(this._ethService.fromWei(transactionCost.totalCost)).toFixed(6);

            const ethPrice = await this._ethService.getETHPrice();

            this.feeUsd = (Number(this.fee) * ethPrice).toFixed(2);

            const amountInUsd = Number(this.amount) * this.selectedToken.price;

            this.total = (amountInUsd + Number(this.feeUsd)).toFixed(2);

            this.transactionData = {
                amount: this.amount,
                gasFee: this.fee,
                feeUsd: this.feeUsd,
                sender: this.fromAddress,
                receiver: this.toAddress,
                total: this.total,
            };
        } catch (error) {
            console.error("Error calculating transaction fee:", error);
        }
    }

    private async _decryptMnemonics(): Promise<any> {
        if (!this.wallet?.pgp?.encryptedMessage || !this.wallet?.pgp?.privateKey || !this._password) this.requiresBiometrics = true;
        else {
            const mnemonicString = await this._decryptMessage();

            this._mnemonics = mnemonicString.split(" ");
            this.canConfirm = true;
        }
    }

    private async _decryptMessage(): Promise<any> {
        const encryptedMessage = this.wallet?.pgp?.encryptedMessage as string;
        const privateKeyArmoured = this.wallet?.pgp?.privateKey as string;
        const passphrase = this._password;

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

        this.sending = true;

        try {
            const cleanMnemonic = this._mnemonics.trim().toLowerCase();

            if (!ethers.Mnemonic.isValidMnemonic(cleanMnemonic)) {
                throw new Error("Invalid mnemonic phrase");
            }

            const wallet = ethers.Wallet.fromPhrase(cleanMnemonic);

            const amountStr = String(this.amount);
            const normalizedAmount = amountStr.replace(",", ".");

            const receipt = await this._ethService.sendTestTransaction(normalizedAmount, wallet.privateKey, this.toAddress);

            await this._router.navigate(["/home"]);
        } catch (error: any) {
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
