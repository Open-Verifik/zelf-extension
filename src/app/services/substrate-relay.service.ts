import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiPromise } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { HttpProvider } from "@polkadot/rpc-provider";
import { BN } from "@polkadot/util";
import { decodeAddress } from "@polkadot/util-crypto";
import { firstValueFrom } from "rxjs";

import { environment } from "environments/environment";
import { TransactionFeeEstimate, TransactionParams, TransactionResult } from "../core/models/transaction-fee.model";
import { substrateCryptoReady, substrateKeyringPairFromMnemonic } from "@shared/utils/substrate-derivation.util";

export type SubstrateRelay = "polkadot" | "kusama";

@Injectable({
    providedIn: "root",
})
export class SubstrateRelayService {
    private _apis: Partial<Record<SubstrateRelay, ApiPromise>> = {};
    private _kusamaAssetHubApi: ApiPromise | null = null;

    constructor(private readonly _http: HttpClient) {}

    private _rpcUrl(relay: SubstrateRelay): string {
        return relay === "polkadot" ? environment.polkadotRelayRpc : environment.kusamaRelayRpc;
    }

    private _nativeSymbol(relay: SubstrateRelay): "DOT" | "KSM" {
        return relay === "polkadot" ? "DOT" : "KSM";
    }

    async getApi(relay: SubstrateRelay): Promise<ApiPromise> {
        const existing = this._apis[relay];
        if (existing) return existing;
        await substrateCryptoReady();
        const provider = new HttpProvider(this._rpcUrl(relay));
        const api = await ApiPromise.create({ provider });
        this._apis[relay] = api;
        return api;
    }

    /** Kusama Asset Hub (parachain id 1000) — native KSM balances are often here (e.g. Trust Wallet). */
    async getKusamaAssetHubApi(): Promise<ApiPromise> {
        const existing = this._kusamaAssetHubApi;
        if (existing) return existing;
        await substrateCryptoReady();
        const provider = new HttpProvider(environment.kusamaAssetHubRpc);
        const api = await ApiPromise.create({ provider });
        this._kusamaAssetHubApi = api;
        return api;
    }

    isValidAddress(address: string): boolean {
        try {
            decodeAddress(address);
            return true;
        } catch {
            return false;
        }
    }

    parseHumanAmountToBn(api: ApiPromise, human: string): BN {
        const decimals = api.registry.chainDecimals[0] ?? 10;
        const s = human.trim().replace(/,/g, "");
        const negative = s.startsWith("-");
        const t = negative ? s.slice(1) : s;
        const [whole, frac = ""] = t.split(".");
        const fracPadded = (frac + "0".repeat(decimals)).slice(0, decimals);
        const intDigits = (whole || "0").replace(/\D/g, "") || "0";
        const combined = intDigits + fracPadded.replace(/\D/g, "");
        const bn = new BN(combined.replace(/^0+/, "") || "0");
        return negative ? bn.neg() : bn;
    }

    private _transferExtrinsic(api: ApiPromise, dest: string, value: BN): SubmittableExtrinsic<"promise"> {
        const b = api.tx.balances as unknown as Record<string, (d: unknown, v: unknown) => SubmittableExtrinsic<"promise">>;
        if (b.transferAllowDeath) return b.transferAllowDeath(dest, value);
        if (b.transfer_allow_death) return b.transfer_allow_death(dest, value);
        if (b.transferKeepAlive) return b.transferKeepAlive(dest, value);
        if (b.transfer_keep_alive) return b.transfer_keep_alive(dest, value);
        if (b.transfer) return b.transfer(dest, value);
        throw new Error("balances.transfer not available on this runtime");
    }

    private async _fetchUsdPrice(symbol: "DOT" | "KSM"): Promise<number> {
        try {
            const id = symbol === "DOT" ? "polkadot" : "kusama";
            const url = `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`;
            const res = await firstValueFrom(this._http.get<Record<string, { usd: number }>>(url));
            return res[id]?.usd ?? 0;
        } catch {
            return 0;
        }
    }

    private async _nativeFreeBn(api: ApiPromise, address: string): Promise<BN> {
        const acc = await api.query.system.account(address);
        const free = (acc as { data?: { free?: { toString(): string } } }).data?.free;
        if (!free) return new BN(0);
        return new BN(free.toString());
    }

    private async _nativeFreeHuman(api: ApiPromise, address: string): Promise<number> {
        const freeBn = await this._nativeFreeBn(api, address);
        const decimals = api.registry.chainDecimals[0] ?? 10;
        return freeBn.toNumber() / 10 ** decimals;
    }

    async getFreeBalance(relay: SubstrateRelay, address: string): Promise<number> {
        const api = await this.getApi(relay);
        return this._nativeFreeHuman(api, address);
    }

    /**
     * Prefer relay when it can cover amount + fee; otherwise Asset Hub if that can cover.
     */
    private async _kusamaPickApiForTransfer(
        sender: string,
        dest: string,
        amountHuman: string
    ): Promise<{ api: ApiPromise; value: BN }> {
        const relayApi = await this.getApi("kusama");
        const hubApi = await this.getKusamaAssetHubApi();
        const valueRelay = this.parseHumanAmountToBn(relayApi, amountHuman);
        const valueHub = this.parseHumanAmountToBn(hubApi, amountHuman);
        const extRelay = this._transferExtrinsic(relayApi, dest, valueRelay);
        const extHub = this._transferExtrinsic(hubApi, dest, valueHub);
        const [infoRelay, infoHub, freeRelay, freeHub] = await Promise.all([
            extRelay.paymentInfo(sender),
            extHub.paymentInfo(sender),
            this._nativeFreeBn(relayApi, sender),
            this._nativeFreeBn(hubApi, sender),
        ]);
        const feeRelay = new BN((infoRelay.partialFee as unknown as { toString(): string }).toString());
        const feeHub = new BN((infoHub.partialFee as unknown as { toString(): string }).toString());
        if (freeRelay.gte(valueRelay.add(feeRelay))) {
            return { api: relayApi, value: valueRelay };
        }
        if (freeHub.gte(valueHub.add(feeHub))) {
            return { api: hubApi, value: valueHub };
        }
        throw new Error("Insufficient KSM on Kusama relay and Asset Hub for this amount (including fees).");
    }

    /**
     * Shape aligned with other `getWalletDetails` responses so `AssetService.processTokens` can ingest native balance.
     */
    async getWalletDetails(relay: SubstrateRelay, address: string): Promise<{
        data: {
            balance: string;
            fiatBalance: string;
            account: { asset: string; price: string };
            tokenHoldings: { tokens: Record<string, unknown>[] };
        };
    }> {
        let balance: number;
        if (relay === "kusama") {
            const relayApi = await this.getApi("kusama");
            const hubApi = await this.getKusamaAssetHubApi();
            const [relayHuman, hubHuman] = await Promise.all([this._nativeFreeHuman(relayApi, address), this._nativeFreeHuman(hubApi, address)]);
            balance = relayHuman + hubHuman;
        } else {
            balance = await this.getFreeBalance(relay, address);
        }
        const symbol = this._nativeSymbol(relay);
        const name = relay === "polkadot" ? "Polkadot" : "Kusama";
        const network = name;
        const price = await this._fetchUsdPrice(symbol);
        const fiatBalance = balance * price;
        return {
            data: {
                balance: String(balance),
                fiatBalance: String(fiatBalance),
                account: { asset: symbol, price: String(price) },
                tokenHoldings: {
                    tokens: [
                        {
                            symbol,
                            name,
                            balance,
                            amount: balance,
                            fiatBalance,
                            price,
                            decimals: 10,
                            tokenType: symbol,
                            image: relay === "polkadot" ? "./assets/networks/dot.svg" : "./assets/networks/ksm.svg",
                            network,
                        },
                    ],
                },
            },
        };
    }

    async calculateTransactionFees(
        relay: SubstrateRelay,
        senderAddress: string,
        receiverAddress: string,
        amountHuman: number,
        tokenPriceUsd: number
    ): Promise<TransactionFeeEstimate> {
        let api: ApiPromise;
        let value: BN;

        if (relay === "kusama") {
            const picked = await this._kusamaPickApiForTransfer(senderAddress, receiverAddress, String(amountHuman));
            api = picked.api;
            value = picked.value;
        } else {
            api = await this.getApi(relay);
            value = this.parseHumanAmountToBn(api, String(amountHuman));
        }

        const ext = this._transferExtrinsic(api, receiverAddress, value);
        const info = await ext.paymentInfo(senderAddress);
        const partialFee = new BN((info.partialFee as unknown as { toString(): string }).toString());
        const decimals = api.registry.chainDecimals[0] ?? 10;
        const feeNative = partialFee.toNumber() / 10 ** decimals;
        const networkPrice = tokenPriceUsd || (await this._fetchUsdPrice(this._nativeSymbol(relay)));
        const fiatFee = feeNative * networkPrice;
        const amountUsd = amountHuman * (tokenPriceUsd || networkPrice);
        return {
            fee: feeNative,
            fiatFee,
            total: amountUsd + fiatFee,
            networkPrice,
        };
    }

    async sendTransaction(params: TransactionParams): Promise<TransactionResult> {
        const network = (params.network || "").toLowerCase();
        const relay: SubstrateRelay = network === "kusama" || network === "ksm" ? "kusama" : "polkadot";
        if (!params.mnemonic?.trim()) throw new Error("Mnemonic required");

        const pair = await substrateKeyringPairFromMnemonic(params.mnemonic, relay === "polkadot" ? 0 : 2);
        const sender = params.from?.trim() || pair.address;
        let api: ApiPromise;
        let value: BN;

        if (relay === "kusama") {
            const picked = await this._kusamaPickApiForTransfer(sender, params.to, params.value);
            api = picked.api;
            value = picked.value;
        } else {
            api = await this.getApi(relay);
            value = this.parseHumanAmountToBn(api, params.value);
        }

        const ext = this._transferExtrinsic(api, params.to, value);

        return await new Promise<TransactionResult>((resolve, reject) => {
            let settled = false;

            ext.signAndSend(pair, (result) => {
                if (result.dispatchError) {
                    if (settled) return;
                    settled = true;
                    try {
                        const err = result.dispatchError;
                        if (err.isModule) {
                            const decoded = api.registry.findMetaError(err.asModule);
                            reject(new Error(`${decoded.section}.${decoded.name}: ${decoded.docs.join(" ")}`));
                        } else {
                            reject(new Error(err.toString()));
                        }
                    } catch (e) {
                        reject(e);
                    }
                    return;
                }

                if (result.status.isInBlock || result.status.isFinalized) {
                    if (settled) return;
                    settled = true;
                    resolve({ hash: result.txHash.toHex(), status: "Success" });
                }
            }).catch(reject);
        });
    }
}
