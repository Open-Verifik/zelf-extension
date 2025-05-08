import { forkJoin, Observable, of } from "rxjs";
import { map } from "rxjs/operators";

import { Injectable } from "@angular/core";

import { environment } from "environments/environment";

import { HttpWrapperService } from "app/http-wrapper.service";
import { Transaction, WalletModel } from "app/wallet";
import { NetworkName } from "./network.service";

@Injectable({
    providedIn: "root",
})
export class BlockchainTransactionsService {
    constructor(private _httpWrapperService: HttpWrapperService) {}

    getAddressData(wallet: Partial<WalletModel> | null): Observable<any> {
        if (!wallet) return of([]);

        return forkJoin({
            ethereum: this._httpWrapperService.sendRequest("get", `${environment.apiUrl}/api/ethereum/address`, {
                address: wallet.ethAddress,
            }),
            avalanche: this._httpWrapperService.sendRequest("get", `${environment.apiUrl}/api/avalanche/address/${wallet.ethAddress}`, {}),
            solana: wallet.solanaAddress
                ? this._httpWrapperService.sendRequest("get", `${environment.apiUrl}/api/solana/address/${wallet.solanaAddress}`, {})
                : of(null),
            sui: wallet.suiAddress
                ? this._httpWrapperService.sendRequest("get", `${environment.apiUrl}/api/sui/address/${wallet.suiAddress}`, {})
                : of(null),
        }).pipe(
            map((responses) => {
                return {
                    transactions: this._processTransactions(responses),
                    ethereum: responses.ethereum,
                    avalanche: responses.avalanche,
                    solana: responses.solana,
                    sui: responses.sui,
                };
            })
        );
    }

    getTransactionHistory(wallet: Partial<WalletModel> | null, pagination: { page: number }): Observable<any> {
        if (!wallet) return of([]);

        return forkJoin({
            ethereum: this._httpWrapperService.sendRequest("get", `${environment.apiUrl}/api/ethereum/transactions`, {
                address: wallet.ethAddress,
                page: pagination.page,
                show: 25,
            }),
            avalanche: this._httpWrapperService.sendRequest("get", `${environment.apiUrl}/api/avalanche/address/${wallet.ethAddress}/transactions`, {
                page: pagination.page,
                show: 25,
            }),
            solana: wallet.solanaAddress
                ? this._httpWrapperService.sendRequest("get", `${environment.apiUrl}/api/solana/transactions/${wallet.solanaAddress}`, {
                      page: pagination.page,
                      show: 25,
                  })
                : of(null),
            sui: wallet.suiAddress
                ? this._httpWrapperService.sendRequest("get", `${environment.apiUrl}/api/sui/transactions/${wallet.suiAddress}`, {
                      page: pagination.page,
                      show: 25,
                  })
                : of(null),
        }).pipe(
            map((responses) => {
                return this._processTransactions(responses);
            })
        );
    }

    private _processTransactions(responses: any): Transaction[] {
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

        if (responses.sui?.data?.transactions) {
            transactions.push(...responses.sui.data.transactions);
        }

        return transactions;
    }

    generateShareLink(hash: string, network: NetworkName): string {
        if (network === "ethereum") {
            return `http://etherscan.io/tx/${hash}`;
        }

        if (network === "avalanche") {
            return `https://avascan.info/blockchain/c/tx/${hash}`;
        }

        if (network === "solana") {
            return `https://solscan.io/tx/${hash}`;
        }

        if (network === "sui") {
            return `https://suiscan.xyz/tx/${hash}`;
        }

        return "";
    }
}
