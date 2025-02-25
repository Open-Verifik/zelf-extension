import { Injectable } from "@angular/core";
import { Transaction, TransactionModel } from "./wallet";
import { ChromeService } from "./chrome.service";

@Injectable({
    providedIn: "root",
})
export class TransactionService {
    transactionData!: Transaction;

    constructor(private _chromeService: ChromeService) {
        this._chromeService.getItem("temp_transactionData").then((temp) => {
            if (temp) this.transactionData = new TransactionModel(JSON.parse(temp));
        });
    }

    setTransactionData(data: Partial<Transaction>, syncInStorage?: boolean): void {
        if (!this.transactionData) {
            this.transactionData = new TransactionModel(data);
        } else {
            // Update each key-value pair in the transactionData object
            Object.assign(this.transactionData, data);
        }

        if (!syncInStorage) return;

        this._chromeService.setItem("temp_transactionData", this.transactionData);
    }

    getTransactionData(): any {
        return this.transactionData;
    }
}
