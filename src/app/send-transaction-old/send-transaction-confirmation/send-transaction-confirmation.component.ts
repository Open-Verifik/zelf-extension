import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ChromeService } from "app/chrome.service";
import { EthereumService } from "app/eth.service";
import { SolanaService } from "app/solana.service";
import { TransactionService } from "app/transaction.service";
import { Transaction, Wallet, WalletModel, TransactionModel } from "app/wallet";

@Component({
    selector: "app-send-transaction-confirmation",
    templateUrl: "./send-transaction-confirmation.component.html",
    styleUrls: ["./send-transaction-confirmation.component.scss", "../../main.scss"],
    standalone: false
})
export class SendTransactionConfirmationComponent implements OnInit {
    gasPrices: any;
    selectedGasFee: any;
    transactionData!: Transaction;
    wallet!: Wallet;

    constructor(
        private _transactionService: TransactionService,
        private _router: Router,
        private _chromeService: ChromeService,
        private _ethService: EthereumService,
        private _solanaService: SolanaService
    ) {
        this._chromeService.getItem("temp_transactionData").then((temp) => {
            if (temp) this.transactionData = new TransactionModel(JSON.parse(temp));

            if (!this.transactionData) {
                this.goBack();

                return;
            }
        });
    }

    async ngOnInit(): Promise<any> {
        this.wallet = new WalletModel((await this._chromeService.getItem("wallet")) || {});

        if (!this.transactionData?.sender) {
            this.transactionData.sender = this.wallet;
        }

        await this._getGasFees();
    }

    async _getGasFees(): Promise<any> {
        let fees;

        switch (this.transactionData.network) {
            case "Ethereum":
                await this._getETHGasFees();
                break;

            case "Solana":
                fees = await this._solanaService.getGasPrices();
                this.transactionData.gasFee = parseFloat((fees.data.avg_fee * fees.data.price_usdt || 0).toFixed(6));
                break;

            default:
                break;
        }
    }

    async _getETHGasFees(): Promise<any> {
        const fees = await this._ethService.getGasPrices();

        let gasFees = 0;

        if (this.transactionData.tokenType === "ETH") {
            gasFees = Number(fees.data.average.cost.replace("$", ""));
        } else if (this.transactionData.tokenType === "ERC-20") {
            for (let index = 0; index < fees.data.featuredActions.length; index++) {
                const featureGasObject = fees.data.featuredActions[index];

                if (featureGasObject.action === "Swap") {
                    gasFees = Number(featureGasObject.average);
                }
            }
        }

        this.transactionData.gasFee = gasFees;
    }

    goBack(): void {
        this._router.navigate(["/send-transaction-preview"]);
    }

    goNext(): void {
        this._setTransactionData();

        this._router.navigate(["/send-transaction-bridge"]);
    }

    _setTransactionData(): void {
        this._transactionService.setTransactionData(
            {
                gasFee: this.transactionData.gasFee,
                fiatTotal: this.transactionData.fiatAmount + this.transactionData.gasFee,
            },
            true
        );
    }

    cancel(): void {
        this._router.navigate(["/send-transaction-preview"]);
    }
}
