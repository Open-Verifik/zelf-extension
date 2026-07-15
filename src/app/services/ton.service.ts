import { Injectable } from "@angular/core";

import { HttpWrapperService } from "app/http-wrapper.service";
import { environment } from "environments/environment";

@Injectable({
    providedIn: "root",
})
export class TonService {
    private _baseUrl: string = environment.apiUrl;

    constructor(private _httpWrapper: HttpWrapperService) {}

    private _defaultResponse(): any {
        return {
            data: {
                _balance: 0,
                balance: "0",
                fiatBalance: "0",
                account: {
                    asset: "TON",
                    price: "0",
                },
                tokenHoldings: {
                    tokens: [],
                },
            },
        };
    }

    async getWalletDetails(address: string): Promise<any> {
        const url = `${this._baseUrl}/api/ton/address/${encodeURIComponent(address)}`;

        try {
            return this._httpWrapper
                .sendRequest("get", url)
                .then((response) => response)
                .catch(() => this._defaultResponse());
        } catch (error) {
            console.error("Exception in TON getWalletDetails:", error);

            return Promise.resolve(this._defaultResponse());
        }
    }

    async requestTransactionDetails(transactionHash: string): Promise<{ data: any }> {
        return this._httpWrapper.sendRequest("get", `${this._baseUrl}/api/ton/transaction/${encodeURIComponent(transactionHash)}`);
    }

    async requestTransactionHistory(address: string, pagination: { page: number; show?: number }): Promise<any> {
        const url = `${this._baseUrl}/api/ton/address/${encodeURIComponent(address)}/transactions`;

        const params = {
            page: pagination.page,
            show: pagination.show || 25,
        };

        try {
            return this._httpWrapper
                .sendRequest("get", url, params)
                .then((response) => response)
                .catch(() => ({ data: { transactions: [] } }));
        } catch (error) {
            console.error("Exception in TON requestTransactionHistory:", error);

            return Promise.resolve({ data: { transactions: [] } });
        }
    }
}
