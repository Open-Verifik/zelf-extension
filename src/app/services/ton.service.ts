import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Address, beginCell, external, fromNano, internal, SendMode, storeMessage, toNano } from "@ton/core";
import { TonClient } from "@ton/ton";
import { firstValueFrom } from "rxjs";

import { environment } from "environments/environment";
import { TransactionFeeEstimate, TransactionParams, TransactionResult } from "../core/models/transaction-fee.model";
import { isValidTonAddress, TON_DECIMALS, tonKeyPairFromMnemonic, tonWalletFromPublicKey } from "@shared/utils/ton-derivation.util";

/**
 * TON (The Open Network) chain service. Mirrors {@link SubstrateRelayService}:
 * pure client-side access through a public RPC (toncenter) with a `getWalletDetails`
 * response shaped so `AssetService.processTokens` can ingest the native balance.
 *
 * Keys are derived client-side from the wallet's BIP39 mnemonic — see
 * `ton-derivation.util.ts`. The display address comes from `publicData.tonAddress`.
 */
@Injectable({
    providedIn: "root",
})
export class TonService {
    private _client: TonClient | null = null;

    /** A standard TON transfer costs a stable, tiny fee (~0.0055 TON). Used until
     * dynamic `estimateExternalMessageFee` is wired (needs the signed body). */
    private static readonly TYPICAL_TRANSFER_FEE_TON = 0.0055;

    constructor(private readonly _http: HttpClient) {}

    private _getClient(): TonClient {
        if (this._client) return this._client;

        this._client = new TonClient({
            endpoint: environment.tonRpc.mainnet,
            apiKey: environment.tonRpc.apiKey || undefined,
        });

        return this._client;
    }

    isValidAddress(address: string): boolean {
        return isValidTonAddress(address);
    }

    private async _fetchUsdPrice(): Promise<number> {
        try {
            const url = `https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd`;
            const res = await firstValueFrom(this._http.get<Record<string, { usd: number }>>(url));

            return res["the-open-network"]?.usd ?? 0;
        } catch {
            return 0;
        }
    }

    async getBalance(address: string): Promise<number> {
        const client = this._getClient();
        const nano = await client.getBalance(Address.parse(address));

        return Number(fromNano(nano));
    }

    /**
     * Shape aligned with other `getWalletDetails` responses so `AssetService.processTokens`
     * can ingest the native TON balance.
     */
    async getWalletDetails(address: string): Promise<{
        data: {
            balance: string;
            fiatBalance: string;
            account: { asset: string; price: string };
            tokenHoldings: { tokens: Record<string, unknown>[] };
        };
    }> {
        const [balance, price] = await Promise.all([this.getBalance(address), this._fetchUsdPrice()]);
        const fiatBalance = balance * price;

        return {
            data: {
                balance: String(balance),
                fiatBalance: String(fiatBalance),
                account: { asset: "TON", price: String(price) },
                tokenHoldings: {
                    tokens: [
                        {
                            symbol: "TON",
                            name: "Toncoin",
                            balance,
                            amount: balance,
                            fiatBalance,
                            price,
                            decimals: TON_DECIMALS,
                            tokenType: "TON",
                            image: "./assets/networks/ton.svg",
                            network: "TON",
                        },
                    ],
                },
            },
        };
    }

    async calculateTransactionFees(amount: number, tokenPriceUsd: number): Promise<TransactionFeeEstimate> {
        const networkPrice = tokenPriceUsd || (await this._fetchUsdPrice());
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

    async sendTransaction(params: TransactionParams): Promise<TransactionResult> {
        if (!params.mnemonic?.trim()) throw new Error("Mnemonic is required for TON transactions");
        if (!this.isValidAddress(params.to)) throw new Error("Invalid TON recipient address");

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
