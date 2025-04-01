import { Injectable } from "@angular/core";
import { AddressBook, Transaction, TransactionData, TransactionModel } from "./wallet";
import { ChromeService } from "./chrome.service";

@Injectable({
    providedIn: "root",
})
export class TransactionService {
    private _recentAddresses: AddressBook[] = [];
    private _transactionData: TransactionData = new TransactionData({});

    /** @deprecated */
    transactionData!: Transaction;

    constructor(private _chromeService: ChromeService) {
        this._chromeService.getItem("transactionData").then((response) => {
            if (!response) this._transactionData = new TransactionData({});
            else this._transactionData = new TransactionData(response);
        });

        this._chromeService.getItem("recentAddresses").then((response) => {
            if (!response) this._recentAddresses = [];
            else {
                response.forEach((address: AddressBook) => {
                    this._recentAddresses.push(address);
                });
            }
        });
    }

    addToRecentAddresses(address: AddressBook): void {
        if (!this._transactionData?.receiver?.address) return;

        const index = this._recentAddresses.map((recent) => recent.address).indexOf(address.address);

        if (index > -1) {
            this._recentAddresses[index].lastUsed = new Date().toISOString();

            this._recentAddresses.sort((a, b) => new Date(b.lastUsed!).getTime() - new Date(a.lastUsed!).getTime());
        } else {
            this._recentAddresses.push({
                ...address,
                lastUsed: new Date().toISOString(),
            });

            if (this._recentAddresses.length > 5) {
                this._recentAddresses.sort((a, b) => new Date(a.lastUsed!).getTime() - new Date(b.lastUsed!).getTime());
                this._recentAddresses.shift();
            }
        }

        this._chromeService.setItem("recentAddresses", this._recentAddresses);
    }

    findAddressInRecentAddresses<K extends keyof AddressBook>(key: K, value: any): AddressBook[] {
        return this._recentAddresses.filter((recent) => recent[key] === value);
    }

    async getCurrentTransactionData(): Promise<TransactionData> {
        if (this._transactionData) return this._transactionData;

        this._transactionData = new TransactionData((await this._chromeService.getItem("transactionData")) || {});

        return this._transactionData;
    }

    async removeTransactionData(): Promise<void> {
        await this._chromeService.removeItem("transactionData");
    }

    removeAddressFromRecentAddresses(address: string): void {
        const index = this._recentAddresses.map((recent) => recent.address).indexOf(address);

        if (index === -1) return;

        this._recentAddresses.splice(index, 1);
    }

    async setCurrentTransactionData(data: TransactionData): Promise<void> {
        this._transactionData = new TransactionData(data);

        await this._chromeService.setItem("transactionData", this._transactionData);
    }

    /** @deprecated */
    getTransactionData(): any {
        return this.transactionData;
    }

    /** @deprecated */
    setTransactionData(data: Partial<Transaction>, syncInStorage?: boolean): void {
        if (!this.transactionData) {
            this.transactionData = new TransactionModel(data);
        } else {
            Object.assign(this.transactionData, data);
        }

        if (!syncInStorage) return;

        this._chromeService.setItem("temp_transactionData", this.transactionData);
    }
}
