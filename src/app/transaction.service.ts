import { Injectable } from "@angular/core";
import { AddressBook, SwapData, TransactionData } from "./wallet";
import { ChromeService } from "./chrome.service";
import { Observable, Subject } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class TransactionService {
    private _recentAddresses: AddressBook[] = [];
    private _swapData: SwapData = new SwapData({});
    private _swapData$: Subject<SwapData> = new Subject<SwapData>();
    private _transactionData: TransactionData = new TransactionData({});
    private _transactionData$: Subject<TransactionData> = new Subject<TransactionData>();

    constructor(private _chromeService: ChromeService) {
        this._chromeService.getItem("transactionData").then((response) => {
            if (!response) this._transactionData = new TransactionData({});
            else this._transactionData = new TransactionData(response);

            this._transactionData$.next(this._transactionData);
        });

        this._chromeService.getItem("swapData").then((response) => {
            if (!response) this._swapData = new SwapData({});
            else this._swapData = new SwapData(response);

            this._swapData$.next(this._swapData);
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

    get swapData$(): Observable<SwapData> {
        return this._swapData$.asObservable();
    }

    set swapData(value: SwapData) {
        this._chromeService.setItem("swapData", value);
        this._swapData = value;
        this._swapData$.next(this._swapData);
    }

    get transactionData$(): Observable<TransactionData> {
        return this._transactionData$.asObservable();
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

    async getCurrentSwapData(): Promise<SwapData> {
        if (this._swapData) return this._swapData;

        this._swapData = new SwapData((await this._chromeService.getItem("swapData")) || {});

        return this._swapData;
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
}
