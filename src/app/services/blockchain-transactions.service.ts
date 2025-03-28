import { Injectable } from "@angular/core";
import { forkJoin, Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "environments/environment";
import { HttpWrapperService } from "app/http-wrapper.service";
import { WalletModel } from "app/wallet";

export interface Transaction {
    hash: string;
    method: string;
    block: string;
    age: string;
    date: string;
    from: string;
    traffic: string;
    to: string;
    amount: string;
    fiatAmount?: string;
    asset: string;
    txnFee?: string;
    status?: string;
    image?: string;
}

@Injectable({
    providedIn: "root",
})
export class BlockchainTransactionsService {
    constructor(private _httpWrapperService: HttpWrapperService) {}

    getAddressData(wallet: Partial<WalletModel> | null): Observable<Transaction[]> {
        if (!wallet) return of([]);

        return forkJoin({
            ethereum: this._httpWrapperService.sendRequest("get", `${environment.apiUrl}/api/ethereum/address`, { address: wallet.ethAddress }),
            avalanche: this._httpWrapperService.sendRequest("get", `${environment.apiUrl}/api/avalanche/address/${wallet.ethAddress}`, {}),
            solana: wallet.solanaAddress
                ? this._httpWrapperService.sendRequest("get", `${environment.apiUrl}/api/solana/address/${wallet.solanaAddress}`, {})
                : of(null),
        }).pipe(
            map((responses) => {
                const transactions: Transaction[] = [];

                if (responses.ethereum?.data) {
                    const ethImage = responses.ethereum.data.tokenHoldings?.tokens?.find((t: any) => t.symbol === "ETH")?.image;

                    if (responses.ethereum.data.transactions) {
                        transactions.push(
                            ...responses.ethereum.data.transactions.map((tx: any) => ({
                                ...tx,
                                image: ethImage,
                            }))
                        );
                    }
                }

                if (responses.avalanche?.data?.transactions) {
                    transactions.push(...responses.avalanche.data.transactions);
                }

                if (responses.solana?.data?.transactions) {
                    transactions.push(...responses.solana.data.transactions);
                }

                return transactions;
            })
        );
    }
}
