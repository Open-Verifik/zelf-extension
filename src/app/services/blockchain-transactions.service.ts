import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { forkJoin, Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "environments/environment";
import { WalletService } from "app/wallet.service";
import { ChromeService } from "app/chrome.service";

export interface Transaction {
    hash: string;
    method: string;
    block: string;
    age: string;
    from: string;
    traffic: string;
    to: string;
    amount: string;
    fiatAmount?: string;
    asset: string;
    txnFee?: string;
    status?: string;
}

@Injectable({
    providedIn: "root",
})
export class BlockchainTransactionsService {
    constructor(private _http: HttpClient, private _walletService: WalletService, private _chromeService: ChromeService) {}

    async getAllTransactions(): Promise<Observable<Transaction[]>> {
        const wallet = await this._walletService.retrieveWallet();
        const token = await this._chromeService.getItem<string>("accessToken");

        if (!wallet || !token) {
            return of([]);
        }

        const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);

        return forkJoin({
            avalanche: this._http.get(`${environment.apiUrl}/api/avalanche/address/${wallet.ethAddress}`, { headers }),
            ethereum: this._http.get(`${environment.apiUrl}/api/ethereum/address?address=${wallet.ethAddress}`, { headers }),
            solana: wallet.solAddress ? this._http.get(`${environment.apiUrl}/api/solana/address/${wallet.solAddress}`, { headers }) : of(null),
        }).pipe(
            map((response: any) => {
                const allTransactions: Transaction[] = [];

                if (response.avalanche?.data?.transactions) {
                    allTransactions.push(...response.avalanche.data.transactions);
                }

                if (response.ethereum?.data?.transactions) {
                    allTransactions.push(...response.ethereum.data.transactions);
                }

                if (response.solana?.data?.transactions) {
                    allTransactions.push(...response.solana.data.transactions);
                }

                return allTransactions.sort((a, b) => {
                    return Number(b.block) - Number(a.block);
                });
            })
        );
    }
}
