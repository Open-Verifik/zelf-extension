import { Injectable } from "@angular/core";
import { Address, beginCell, external, internal, SendMode, storeMessage, toNano } from "@ton/core";
import { TonClient } from "@ton/ton";

import { HttpWrapperService } from "app/http-wrapper.service";
import { environment } from "environments/environment";
import { TransactionFeeEstimate, TransactionParams, TransactionResult } from "../core/models/transaction-fee.model";
import { isValidTonAddress, tonKeyPairFromMnemonic, tonWalletFromPublicKey } from "@shared/utils/ton-derivation.util";

@Injectable({
    providedIn: "root",
})
export class TonService {
    private _baseUrl: string = environment.apiUrl;
    private _client: TonClient | null = null;

    /** A standard TON transfer costs a stable, tiny fee (~0.0055 TON). Used for the fee quote. */
    private static readonly TYPICAL_TRANSFER_FEE_TON = 0.0055;

    constructor(private _httpWrapper: HttpWrapperService) {}

    private _getClient(): TonClient {
        if (this._client) return this._client;

        this._client = new TonClient({
            endpoint: (environment as any).tonRpc?.mainnet || "https://toncenter.com/api/v2/jsonRPC",
            apiKey: (environment as any).tonRpc?.apiKey || undefined,
        });

        return this._client;
    }

    isValidAddress(address: string): boolean {
        return isValidTonAddress(address);
    }

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

    async calculateTransactionFees(amount: number, tokenPriceUsd: number): Promise<TransactionFeeEstimate> {
        const networkPrice = tokenPriceUsd || 0;
        const fee = TonService.TYPICAL_TRANSFER_FEE_TON;
        const fiatFee = fee * networkPrice;
        const amountUsd = amount * networkPrice;

        return {
            fee,
            fiatFee,
            total: amountUsd + fiatFee,
            networkPrice,
        };
    }

    /**
     * Native TON transfer, signed client-side (like the extension's other chains) with the Wallet
     * V5R1 contract derived from the wallet mnemonic — the same contract/derivation the Zelf backend
     * uses, so it sends FROM the address stored in `publicData.tonAddress`. Broadcast via toncenter.
     */
    async sendTransaction(params: TransactionParams): Promise<TransactionResult> {
        if (!params.mnemonic?.trim()) throw new Error("Mnemonic is required for TON transactions");
        if (!isValidTonAddress(params.to)) throw new Error("Invalid TON recipient address");

        const client = this._getClient();
        const keyPair = await tonKeyPairFromMnemonic(params.mnemonic);
        const wallet = tonWalletFromPublicKey(keyPair.publicKey);
        const contract = client.open(wallet);

        const seqno = await contract.getSeqno();

        const body = wallet.createTransfer({
            seqno,
            secretKey: keyPair.secretKey,
            sendMode: SendMode.PAY_GAS_SEPARATELY + SendMode.IGNORE_ERRORS,
            messages: [
                internal({
                    to: Address.parse(params.to),
                    value: toNano(params.value),
                    bounce: false,
                    body: params.memo?.trim() || undefined,
                }),
            ],
        });

        // Wrap in the external-in message ourselves so the returned hash matches what we broadcast.
        const externalMessage = external({
            to: wallet.address,
            init: seqno === 0 ? wallet.init : undefined,
            body,
        });
        const boc = beginCell().store(storeMessage(externalMessage)).endCell();

        await client.sendFile(boc.toBoc());

        return {
            hash: boc.hash().toString("hex"),
            status: "pending",
        };
    }
}
