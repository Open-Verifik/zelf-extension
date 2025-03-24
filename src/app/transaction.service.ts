import { Injectable } from "@angular/core";
import { Transaction, TransactionModel } from "./wallet";
import { ChromeService } from "./chrome.service";

export type Network = "Ethereum" | "Solana" | "Bitcoin" | "";

export type RecentAddress = {
    address: string;
    lastUsed: Date | string;
    network: string;
    zelfName: string;
};

@Injectable({
    providedIn: "root",
})
export class TransactionService {
    private _fromAddress: string = "";
    private _fromBalance: number = 0;
    private _network: Network = "";
    private _recentAddresses: RecentAddress[] = [];
    private _toAddress: string = "";
    private _withdrawalAmount: number = 0;
    private _selectedToken: any = null;

    transactionData!: Transaction;

    get selectedToken(): any {
        return this._selectedToken;
    }

    set selectedToken(value: any) {
        this._selectedToken = value;
    }

    get network(): Network {
        return this._network;
    }

    set network(value: Network) {
        this._network = value;
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

    get toAddress(): string {
        return this._toAddress;
    }

    set toAddress(value: string) {
        console.log(` TransactionService ~ settoAddress ~ value:`, value);
        this._toAddress = value;
    }

    get withdrawalAmount(): number {
        return this._withdrawalAmount;
    }

    set withdrawalAmount(value: number) {
        this._withdrawalAmount = value;
    }

    constructor(private _chromeService: ChromeService) {
        this._chromeService.getItem("temp_transactionData").then((temp) => {
            if (temp) this.transactionData = new TransactionModel(JSON.parse(temp));
        });
    }

    addRecentAddress(): void {
        if (!this._toAddress) return;

        if (this._recentAddresses.some((recentAddress) => recentAddress.address === this._toAddress)) return;

        this._recentAddresses.push({ address: this._toAddress, lastUsed: new Date(), network: this._network, zelfName: "" });

        this._chromeService.setItem("recentAddresses", this._recentAddresses);
    }

    findRecentAddressesByCurrentNetwork(): RecentAddress[] {
        return this._recentAddresses.filter((recent) => recent.network === this.network);
    }

    removeRecentAddress(address: string): void {
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
            // Update each key-value pair in the transactionData object
            Object.assign(this.transactionData, data);
        }

        if (!syncInStorage) return;

        this._chromeService.setItem("temp_transactionData", this.transactionData);
    }
}
