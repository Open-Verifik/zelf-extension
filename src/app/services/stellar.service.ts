import { Injectable } from "@angular/core";

import { environment } from "environments/environment";
import { HttpWrapperService } from "../http-wrapper.service";

@Injectable({
    providedIn: "root",
})
export class StellarService {
    private _baseUrl: string = environment.apiUrl;

    constructor(private _httpWrapper: HttpWrapperService) {}

    private _defaultResponse(): any {
        return {
            data: {
                address: "",
                balance: 0,
                fiatBalance: 0,
                type: "account",
                account: {
                    asset: "XLM",
                    fiatValue: "0",
                    price: "0",
                },
                tokenHoldings: {
                    total: 0,
                    balance: 0,
                    fiatBalance: 0,
                    tokens: [],
                },
                transactions: [],
                transactionsNext: false,
            },
        };
    }

    async getWalletDetails(address: string): Promise<any> {
        try {
            const url = `${this._baseUrl}/api/stellar/address/${address}`;

            return await this._httpWrapper
                .sendRequest("get", url, {})
                .then((response) => response)
                .catch(() => this._defaultResponse());
        } catch (error) {
            console.error("Exception in Stellar getWalletDetails:", error);

            return Promise.resolve(this._defaultResponse());
        }
    }

    async requestTransactionHistory(
        address: string,
        pagination: { page: number; show?: number },
        cursor?: string
    ): Promise<any> {
        try {
            const url = `${this._baseUrl}/api/stellar/address/${address}/transactions`;

            const params: Record<string, string | number> = {
                limit: pagination.show || 25,
            };
            if (cursor) {
                params.cursor = cursor;
            }

            return await this._httpWrapper
                .sendRequest("get", url, params)
                .then((response) => response)
                .catch(() => ({ data: { transactions: [], next: false } }));
        } catch (error) {
            console.error("Exception in Stellar requestTransactionHistory:", error);

            return Promise.resolve({ data: { transactions: [], next: false } });
        }
    }

    async requestTransactionDetails(transactionHash: string): Promise<any> {
        return this._httpWrapper.sendRequest("get", `${this._baseUrl}/api/stellar/transaction/${transactionHash}`);
    }
}
