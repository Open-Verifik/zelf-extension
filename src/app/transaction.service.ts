import { Injectable } from "@angular/core";
import { AddressBook, Transaction, TransactionModel, WalletModel } from "./wallet";
import { ChromeService } from "./chrome.service";

@Injectable({
    providedIn: "root",
})
export class TransactionService {
    private _fromAddress: string = "";
    private _fromBalance: number = 0;
    private _receiver!: WalletModel;
    private _recentAddresses: AddressBook[] = [];
    private _toAddress: string = "";
    private _token: any = null;
    private _withdrawalAmount: number = 0;

    transactionData!: Transaction;

    constructor(private _chromeService: ChromeService) {
        this._chromeService.getItem("temp_transactionData").then((temp) => {
            if (temp) this.transactionData = new TransactionModel(JSON.parse(temp));
        });

        this._chromeService.getItem("recentAddresses").then((response) => {
            if (!response) {
                this._recentAddresses = [];
            } else {
                response.forEach((address: AddressBook) => {
                    this._recentAddresses.push(address);
                });
            }
        });
    }

    get fromBalance(): number {
        return this._fromBalance;
    }

    set fromBalance(value: number) {
        this._fromBalance = value;
    }

    get fromAddress(): string {
        return this._fromAddress;
    }

    set fromAddress(value: string) {
        this._fromAddress = value;
    }

    get receiver(): WalletModel {
        return this._receiver;
    }

    set receiver(value: WalletModel) {
        this._receiver = value;
    }

    get toAddress(): string {
        return this._toAddress;
    }

    set toAddress(value: string) {
        this._toAddress = value;
    }

    get token(): any {
        return this._token;
    }

    set token(value: any) {
        this._token = value;
    }

    get withdrawalAmount(): number {
        return this._withdrawalAmount;
    }

    set withdrawalAmount(value: number) {
        this._withdrawalAmount = value;
    }

    addToRecentAddresses(address: AddressBook): void {
        if (!this._toAddress) return;

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

    removeAddressFromRecentAddresses(address: string): void {
        const index = this._recentAddresses.map((recent) => recent.address).indexOf(address);

        if (index === -1) return;

        this._recentAddresses.splice(index, 1);
    }

    getTransactionData(): any {
        return this.transactionData;
    }

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
