import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { forkJoin, Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "environments/environment";
import { WalletService } from "app/wallet.service";
import { ChromeService } from "app/chrome.service";

interface ApiResponse {
    data: {
        transactions: Transaction[];
        account?: {
            asset: string;
            fiatBalance: string;
            price: string;
        };
        tokenHoldings?: {
            tokens: {
                symbol: string;
                image: string;
            }[];
        };
    };
}

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
    image?: string;
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

        const httpHeaders = new HttpHeaders()
            .set("Authorization", `Bearer ${token.trim()}`)
            .set("Accept", "application/json")
            .set("Content-Type", "application/json");

        const options = { headers: httpHeaders };

        return forkJoin({
            ethereum: this._http.get<ApiResponse>(
                `${environment.apiUrl}/api/ethereum/address?address=0x1f9090aaE28b8a3dCeaDf281B0F12828e676c326`,
                options
            ),
            avalanche: this._http.get<ApiResponse>(`${environment.apiUrl}/api/avalanche/address/${wallet.ethAddress}`, options),
            solana: wallet.solAddress
                ? this._http.get<ApiResponse>(`${environment.apiUrl}/api/solana/address/${wallet.solAddress}`, options)
                : of(null),
        }).pipe(
            map((responses) => {
                const transactions: Transaction[] = [];

                if (responses.ethereum?.data) {
                    const ethImage = responses.ethereum.data.tokenHoldings?.tokens?.find((t) => t.symbol === "ETH")?.image;
                    if (responses.ethereum.data.transactions) {
                        transactions.push(
                            ...responses.ethereum.data.transactions.map((tx) => ({
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
