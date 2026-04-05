import { Injectable } from "@angular/core";
import { ethers, JsonRpcApiProvider } from "ethers";

import { RpcProviderService } from "app/services/rpc-provider.service";
import { getChainConfig } from "@shared/types/dapp.types";
import { allowDirectFallbackForChainKey, getChainKeyFromChainId } from "@shared/utils/evm-chain-key.util";
import { environment } from "environments/environment";

export interface GasAwareDappTransactionParams {
    to?: string;
    value?: string;
    data?: string;
    gasLimit?: string;
    gasPrice?: string;
    maxFeePerGas?: string;
    maxPriorityFeePerGas?: string;
    nonce?: number;
    chainId?: number;
    network: string;
}

export interface DappGasEstimate {
    gasLimit: bigint;
    totalFeeWei: bigint;
    formattedFee: string;
    gasPrice?: bigint;
    maxFeePerGas?: bigint;
    maxPriorityFeePerGas?: bigint;
}

const BLOCKDAG_CHAIN_ID = 1404;
const MIN_GAS_PRICE_WEI = BigInt(1e9);
const BLOCKDAG_MIN_GAS_PRICE_WEI = BigInt(500e9);
const SAFE_RPC_FEE_CAP_WEI = BigInt("900000000000000000");
const MAX_CEILING_MULTIPLIER = 10n;
const PRIORITY_MULTIPLIER_NATIVE = 3n;

@Injectable({
    providedIn: "root",
})
export class DappGasEstimationService {
    private readonly _providerByRpcUrl = new Map<string, ethers.JsonRpcProvider>();

    constructor(private readonly _rpcProvider: RpcProviderService) {}

    resolveRpcUrl(chainId?: number, network?: string): string {
        const chainConfig = typeof chainId === "number" ? getChainConfig(chainId) : undefined;
        if (chainConfig?.rpcUrl) {
            return chainConfig.rpcUrl;
        }

        switch ((network || "").toLowerCase()) {
            case "ethereum":
                return environment.ethereumRpc.mainnet;
            case "arbitrum":
                return "https://arb1.arbitrum.io/rpc";
            case "optimism":
                return "https://mainnet.optimism.io";
            case "base":
                return "https://mainnet.base.org";
            case "avalanche":
                return environment.avalancheRpc.mainnet;
            case "polygon":
                return environment.polygonRpc.mainnet;
            case "bsc":
            case "binance":
                return environment.binanceRpc.mainnet;
            case "blockdag":
                return "https://rpc.bdagscan.com";
            default:
                return environment.ethereumRpc.mainnet;
        }
    }

    private async _resolveJsonRpcProvider(chainId?: number, network?: string): Promise<ethers.JsonRpcProvider> {
        if (typeof chainId === "number") {
            const key = getChainKeyFromChainId(chainId);
            if (key) {
                return this._rpcProvider.getEthersProvider(key, {
                    allowDirectFallback: allowDirectFallbackForChainKey(key),
                });
            }
        }
        return this._getProvider(this.resolveRpcUrl(chainId, network));
    }

    async estimateTransactionFee(params: GasAwareDappTransactionParams, fromAddress?: string): Promise<DappGasEstimate> {
        const provider = await this._resolveJsonRpcProvider(params.chainId, params.network);
        const txRequest = this._buildTransactionRequest(params, fromAddress);
        const gasLimit = await this._resolveGasLimit(provider, txRequest, params.gasLimit);
        const feeConfig = await this._resolveFeeConfig(provider, params, gasLimit);
        const effectiveGasPrice = feeConfig.gasPrice ?? feeConfig.maxFeePerGas ?? feeConfig.maxPriorityFeePerGas ?? 0n;
        const totalFeeWei = gasLimit * effectiveGasPrice;

        return {
            gasLimit,
            totalFeeWei,
            formattedFee: ethers.formatEther(totalFeeWei),
            gasPrice: feeConfig.gasPrice,
            maxFeePerGas: feeConfig.maxFeePerGas,
            maxPriorityFeePerGas: feeConfig.maxPriorityFeePerGas,
        };
    }

    async prepareTransactionForBroadcast(
        params: GasAwareDappTransactionParams,
        fromAddress?: string,
    ): Promise<GasAwareDappTransactionParams> {
        if (params.chainId !== BLOCKDAG_CHAIN_ID) {
            return params;
        }

        try {
            const provider = await this._resolveJsonRpcProvider(params.chainId, params.network);
            const rpcGasPrice = await this._getLegacyGasPrice(provider);
            const baseGasPrice = rpcGasPrice < BLOCKDAG_MIN_GAS_PRICE_WEI ? BLOCKDAG_MIN_GAS_PRICE_WEI : rpcGasPrice;

            return {
                ...params,
                gasPrice: baseGasPrice.toString(),
                maxFeePerGas: undefined,
                maxPriorityFeePerGas: undefined,
            };
        } catch (error) {
            console.warn("BlockDAG gas price fetch failed, using fallback gas price:", error);
            return {
                ...params,
                gasPrice: BLOCKDAG_MIN_GAS_PRICE_WEI.toString(),
                maxFeePerGas: undefined,
                maxPriorityFeePerGas: undefined,
            };
        }
    }

    private _buildTransactionRequest(params: GasAwareDappTransactionParams, fromAddress?: string): ethers.TransactionRequest {
        const txRequest: ethers.TransactionRequest = {
            chainId: params.chainId,
            data: params.data || "0x",
        };

        if (params.to) {
            txRequest.to = params.to;
        }

        if (fromAddress) {
            txRequest.from = fromAddress;
        }

        if (params.value && params.value !== "0" && params.value !== "0x0") {
            txRequest.value = BigInt(params.value);
        }

        return txRequest;
    }

    private _getProvider(rpcUrl: string): ethers.JsonRpcProvider {
        const cached = this._providerByRpcUrl.get(rpcUrl);
        if (cached) {
            return cached;
        }

        const needsNoBatch = rpcUrl.includes("bdagscan.com");
        const provider = new ethers.JsonRpcProvider(
            rpcUrl,
            undefined,
            needsNoBatch ? { batchMaxCount: 1 } : undefined,
        );
        this._providerByRpcUrl.set(rpcUrl, provider);
        return provider;
    }

    private async _resolveGasLimit(
        provider: ethers.JsonRpcProvider,
        txRequest: ethers.TransactionRequest,
        providedGasLimit?: string,
    ): Promise<bigint> {
        if (providedGasLimit) {
            return BigInt(providedGasLimit);
        }

        try {
            const estimated = await provider.estimateGas(txRequest);
            return (estimated * 110n) / 100n;
        } catch {
            return this._fallbackGasLimit(txRequest);
        }
    }

    private _fallbackGasLimit(txRequest: ethers.TransactionRequest): bigint {
        const hasData = Boolean(txRequest.data && txRequest.data !== "0x");
        const hasValue = txRequest.value != null && txRequest.value !== 0n;

        if (hasData) {
            return 200000n;
        }

        if (hasValue) {
            return 21000n;
        }

        return 100000n;
    }

    private async _resolveFeeConfig(
        provider: ethers.JsonRpcProvider,
        params: GasAwareDappTransactionParams,
        gasLimit: bigint,
    ): Promise<Pick<DappGasEstimate, "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas">> {
        if (params.chainId === BLOCKDAG_CHAIN_ID) {
            const gasPrice = await this._resolveBlockdagGasPrice(provider, gasLimit, params);
            return { gasPrice };
        }

        if (params.maxFeePerGas || params.maxPriorityFeePerGas) {
            return {
                maxFeePerGas: params.maxFeePerGas ? BigInt(params.maxFeePerGas) : undefined,
                maxPriorityFeePerGas: params.maxPriorityFeePerGas ? BigInt(params.maxPriorityFeePerGas) : undefined,
            };
        }

        if (params.gasPrice) {
            return { gasPrice: BigInt(params.gasPrice) };
        }

        const feeData = await provider.getFeeData();
        if (feeData.maxFeePerGas || feeData.maxPriorityFeePerGas) {
            return {
                maxFeePerGas: feeData.maxFeePerGas ?? undefined,
                maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ?? undefined,
            };
        }

        return {
            gasPrice: feeData.gasPrice ?? MIN_GAS_PRICE_WEI,
        };
    }

    private async _resolveBlockdagGasPrice(
        provider: ethers.JsonRpcProvider,
        gasLimit: bigint,
        params: GasAwareDappTransactionParams,
    ): Promise<bigint> {
        let rpcGasPrice = await this._getLegacyGasPrice(provider);
        if (rpcGasPrice < MIN_GAS_PRICE_WEI) {
            rpcGasPrice = MIN_GAS_PRICE_WEI;
        }

        const baseGasPrice = rpcGasPrice < BLOCKDAG_MIN_GAS_PRICE_WEI ? BLOCKDAG_MIN_GAS_PRICE_WEI : rpcGasPrice;
        const dynamicCeiling = baseGasPrice * MAX_CEILING_MULTIPLIER;
        const recommendedGasPrice = this._capGasPriceForFeeLimit(
            gasLimit,
            this._minBigInt(dynamicCeiling, (baseGasPrice * 110n * PRIORITY_MULTIPLIER_NATIVE) / 100n),
        );

        const providedGasPrice = this._readProvidedBlockdagGasPrice(params);
        if (providedGasPrice == null) {
            return recommendedGasPrice;
        }

        const sanitizedProvided = providedGasPrice < MIN_GAS_PRICE_WEI ? MIN_GAS_PRICE_WEI : providedGasPrice;
        return this._capGasPriceForFeeLimit(gasLimit, this._maxBigInt(sanitizedProvided, recommendedGasPrice));
    }

    private async _getLegacyGasPrice(provider: ethers.JsonRpcProvider): Promise<bigint> {
        try {
            const hex = await (provider as JsonRpcApiProvider).send("eth_gasPrice", []);
            return BigInt(hex);
        } catch {
            try {
                const feeData = await provider.getFeeData();
                return feeData.gasPrice ?? feeData.maxPriorityFeePerGas ?? MIN_GAS_PRICE_WEI;
            } catch {
                return MIN_GAS_PRICE_WEI;
            }
        }
    }

    private _readProvidedBlockdagGasPrice(params: GasAwareDappTransactionParams): bigint | null {
        const raw = params.gasPrice || params.maxFeePerGas || params.maxPriorityFeePerGas;
        if (!raw) {
            return null;
        }

        try {
            return BigInt(raw);
        } catch {
            return null;
        }
    }

    private _capGasPriceForFeeLimit(gasLimit: bigint, gasPrice: bigint): bigint {
        if (gasLimit <= 0n) {
            return gasPrice;
        }

        const maxGasPrice = SAFE_RPC_FEE_CAP_WEI / gasLimit;
        return gasPrice > maxGasPrice ? maxGasPrice : gasPrice;
    }

    private _maxBigInt(left: bigint, right: bigint): bigint {
        return left > right ? left : right;
    }

    private _minBigInt(left: bigint, right: bigint): bigint {
        return left < right ? left : right;
    }
}
