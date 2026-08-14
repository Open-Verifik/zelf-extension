import { Injectable } from "@angular/core";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

import { aptosAccountFromMnemonic, aptToOctas, isValidAptosAddress } from "@shared/utils/aptos-derivation.util";
import { HttpWrapperService } from "app/http-wrapper.service";
import { environment } from "environments/environment";
import { TransactionFeeEstimate, TransactionParams, TransactionResult } from "../core/models/transaction-fee.model";

type AptosEstimateResponse = {
    data?: {
        estimatedFeeApt?: string;
        maxFeeApt?: string;
    };
};

@Injectable({
    providedIn: "root",
})
export class AptosService {
    private readonly _baseUrl = environment.apiUrl;
    private readonly _client = new Aptos(
        new AptosConfig({
            network: Network.MAINNET,
            fullnode: (environment as any).aptosRpc?.mainnet || "https://api.mainnet.aptoslabs.com/v1",
        })
    );

    constructor(private _httpWrapper: HttpWrapperService) {}

    isValidAddress(address: string): boolean {
        return isValidAptosAddress(address);
    }

    private _defaultResponse(): any {
        return {
            data: {
                _balance: "0",
                balance: "0",
                fiatBalance: 0,
                network: "aptos",
                account: {
                    asset: "APT",
                    price: "0",
                },
                tokenHoldings: {
                    tokens: [],
                },
                transactions: [],
            },
        };
    }

    async getWalletDetails(address: string): Promise<any> {
        const url = `${this._baseUrl}/api/aptos/address/${encodeURIComponent(address)}`;

        try {
            return await this._httpWrapper.sendRequest("get", url);
        } catch (error) {
            console.error("Exception in Aptos getWalletDetails:", error);
            return this._defaultResponse();
        }
    }

    async requestTransactionDetails(transactionHash: string): Promise<{ data: any }> {
        return this._httpWrapper.sendRequest("get", `${this._baseUrl}/api/aptos/transaction/${encodeURIComponent(transactionHash)}`);
    }

    async requestTransactionHistory(address: string, pagination: { page: number; show?: number }): Promise<any> {
        const url = `${this._baseUrl}/api/aptos/address/${encodeURIComponent(address)}/transactions`;

        try {
            return await this._httpWrapper.sendRequest("get", url, {
                page: pagination.page,
                show: pagination.show || 25,
            });
        } catch (error) {
            console.error("Exception in Aptos requestTransactionHistory:", error);
            return { data: { transactions: [] } };
        }
    }

    async calculateTransactionFees(fromAddress: string, toAddress: string, amount: number, tokenPriceUsd: number): Promise<TransactionFeeEstimate> {
        const response = await this._httpWrapper.sendRequest<AptosEstimateResponse>("post", `${this._baseUrl}/api/aptos/transfer/estimate`, {
            fromAddress,
            toAddress,
            amountApt: String(amount),
        });
        const fee = Number(response?.data?.estimatedFeeApt || response?.data?.maxFeeApt || 0);
        const networkPrice = tokenPriceUsd || 0;
        const fiatFee = fee * networkPrice;

        return {
            fee,
            fiatFee,
            total: amount * networkPrice + fiatFee,
            networkPrice,
        };
    }

    /** Builds, signs and submits native APT locally. The mnemonic never reaches the backend. */
    async sendTransaction(params: TransactionParams): Promise<TransactionResult> {
        if (!params.mnemonic?.trim()) throw new Error("Mnemonic is required for Aptos transactions");
        if (!isValidAptosAddress(params.to)) throw new Error("Invalid Aptos recipient address");

        const signer = aptosAccountFromMnemonic(params.mnemonic);
        const expectedFrom = `${params.from || ""}`.trim();

        if (expectedFrom && signer.accountAddress.toStringLong().toLowerCase() !== expectedFrom.toLowerCase()) {
            throw new Error("Aptos signer does not match the selected wallet");
        }

        const transaction = await this._client.transferCoinTransaction({
            sender: signer.accountAddress,
            recipient: params.to,
            amount: aptToOctas(params.value),
        });
        const pending = await this._client.signAndSubmitTransaction({ signer, transaction });

        return {
            hash: pending.hash,
            status: "pending",
        };
    }
}
