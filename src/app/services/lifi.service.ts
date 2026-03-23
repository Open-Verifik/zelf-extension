import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ethers } from "ethers";
import { firstValueFrom, Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { SolanaService } from "app/solana.service";
import { TokenData } from "@shared/types/wallet.types";
import { environment } from "environments/environment";
import { LifiQuote, LifiToken, LifiTokensResponse } from "app/models/lifi.model";

@Injectable({
    providedIn: "root",
})
export class LifiService {
    private readonly ERC20_ABI = [
        {
            name: "approve",
            inputs: [
                { name: "spender", type: "address" },
                { name: "amount", type: "uint256" },
            ],
            outputs: [{ name: "", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            name: "allowance",
            inputs: [
                { name: "owner", type: "address" },
                { name: "spender", type: "address" },
            ],
            outputs: [{ name: "amount", type: "uint256" }],
            stateMutability: "view",
            type: "function",
        },
    ];

    constructor(
        private _http: HttpClient,
        private _solanaService: SolanaService
    ) {}

    get MIN_PRICE_USD(): number {
        return 0.01;
    }

    get LIFI_API_URL(): string {
        return `${environment.apiUrl}/api/lifi`;
    }

    get chainIdToSymbol(): Record<string, string> {
        return {
            "1": "ETH",
            "137": "POL",
            "43114": "AVAX",
            "56": "BNB",
        };
    }

    get lifiChainSymbols(): string[] {
        return ["eth", "ava", "sol", "pol", "bsc"];
    }

    /**
     * Maps LiFi `/tokens` bucket keys (chain symbols like ETH, AVA, SOL or numeric chain IDs)
     * to internal lowercase network slugs (settings `id`, `NetworkName` without casing quirks).
     */
    chainBucketKeyToInternalNetwork(bucketKey: string | number): string {
        const raw = String(bucketKey).trim();

        if (!raw) return "unknown";

        const byChainId: Record<string, string> = {
            "1": "ethereum",
            "56": "binance",
            "137": "polygon",
            "43114": "avalanche",
            "42161": "arbitrum",
        };

        if (/^\d+$/.test(raw) && byChainId[raw]) return byChainId[raw];

        const upper = raw.toUpperCase();

        const bySymbol: Record<string, string> = {
            ETH: "ethereum",
            AVA: "avalanche",
            AVAX: "avalanche",
            BSC: "binance",
            BNB: "binance",
            POL: "polygon",
            MATIC: "polygon",
            SOL: "solana",
            SUI: "sui",
        };

        if (bySymbol[upper]) return bySymbol[upper];

        const lower = raw.toLowerCase();

        const byLower: Record<string, string> = {
            eth: "ethereum",
            ava: "avalanche",
            avax: "avalanche",
            bsc: "binance",
            bnb: "binance",
            pol: "polygon",
            matic: "polygon",
            sol: "solana",
            sui: "sui",
        };

        if (byLower[lower]) return byLower[lower];

        return "unknown";
    }

    /**
     * Format amount to avoid scientific notation
     */
    private _formatAmount(amount: string): string {
        const numAmount = parseFloat(amount);

        if (numAmount < 0.000001 && numAmount > 0) return numAmount.toFixed(18).replace(/\.?0+$/, "");

        return numAmount.toString();
    }

    /**
     * LiFi `/tokens` chain keys we request via the EVM-style query (no chainTypes).
     * Solana is always a separate request with chainTypes=SVM.
     */
    private _lifiEvmTokensChainParam(internalNetworkLower: string): string | null {
        const id = this.getChainIdentifier(internalNetworkLower);
        const supported = new Set(["ETH", "AVA", "SUI", "POL", "BNB"]);

        if (id === "SOL") return null;

        if (supported.has(id)) return id;

        return null;
    }

    /**
     * Loads trusted tokens from the LiFi proxy.
     * @param lockedInternalNetwork Optional lowercase network id (e.g. `avalanche`). When set, only that chain is fetched (no Solana call for EVM/Sui locks). Omit or pass null for the full multi-chain catalog.
     */
    async requestTokens(lockedInternalNetwork?: string | null): Promise<{ tokens: { [chainId: string]: LifiToken[] } }> {
        const defaultResponse = { data: { tokens: {} } };

        const lock = lockedInternalNetwork?.trim().toLowerCase() || null;

        let fetchEvmChains = "ETH,AVA,POL,BNB,SUI";
        let fetchSolana = true;

        if (lock) {
            if (lock === "solana") {
                fetchEvmChains = "";
                fetchSolana = true;
            } else {
                fetchSolana = false;
                const single = this._lifiEvmTokensChainParam(lock);

                if (single) fetchEvmChains = single;
                else {
                    fetchEvmChains = "ETH,AVA,POL,BNB,SUI";
                    fetchSolana = true;
                }
            }
        }

        try {
            const result = { tokens: {} as { [chainId: string]: LifiToken[] } };

            if (fetchEvmChains) {
                const { data: standardResponse } = await firstValueFrom<LifiTokensResponse>(
                    this._http
                        .get<LifiTokensResponse>(`${this.LIFI_API_URL}/tokens`, {
                            params: { chains: fetchEvmChains, minPriceUSD: this.MIN_PRICE_USD },
                        })
                        .pipe(
                            catchError((err) => {
                                console.warn("Failed to fetch standard tokens:", err);

                                return of(defaultResponse);
                            })
                        )
                );

                Object.assign(result.tokens, standardResponse.tokens || {});
            }

            if (fetchSolana) {
                const { data: solanaResponse } = await firstValueFrom<LifiTokensResponse>(
                    this._http
                        .get<LifiTokensResponse>(`${this.LIFI_API_URL}/tokens`, {
                            params: { chains: "SOL", chainTypes: "SVM", minPriceUSD: this.MIN_PRICE_USD },
                        })
                        .pipe(
                            catchError((err) => {
                                console.warn("Failed to fetch Solana tokens:", err);

                                return of(defaultResponse);
                            })
                        )
                );

                if (solanaResponse?.tokens) {
                    result.tokens.SOL = solanaResponse.tokens?.SOL || solanaResponse.tokens?.sol || [];

                    if (!result.tokens.SOL.length) result.tokens.SOL = Object.values(solanaResponse.tokens).flat();
                }
            }

            return result;
        } catch (error) {
            console.error("Error in requestTokens:", error);

            return { tokens: {} };
        }
    }

    /** Maps LiFi `chains` query keys (eth, pol, bsc, …) to wallet token bucket symbols. */
    private _lifiQueryKeyToWalletSymbol(key: string): string | null {
        const k = String(key).toLowerCase();

        const map: Record<string, string> = {
            eth: "ETH",
            ava: "AVAX",
            pol: "POL",
            bsc: "BNB",
            sol: "SOL",
        };

        return map[k] ?? null;
    }

    getTokens(): Observable<Record<string, LifiToken[]>> {
        const chains = this.lifiChainSymbols;
        const combined: Record<string, LifiToken[]> = {};

        return this._http
            .get<LifiTokensResponse>(`${this.LIFI_API_URL}/tokens`, { params: { chains: chains.join(","), minPriceUSD: this.MIN_PRICE_USD } })
            .pipe(
                map((result) => {
                    if (!result?.data?.tokens) return combined;

                    chains.forEach((chain) => {
                        const chainSymbol = this._lifiQueryKeyToWalletSymbol(chain);

                        if (!chainSymbol) return;

                        combined[chainSymbol] = result.data.tokens[chain] || [];
                    });

                    return combined;
                }),
                catchError((error) => {
                    console.error("Error in combined token request:", error);

                    return of(combined);
                })
            );
    }

    /**
     * Get the chain identifier for LiFi API
     */
    getChainIdentifier(network: string): string {
        switch (network.toLowerCase()) {
            case "ethereum":
                return "ETH";
            case "polygon":
                return "POL";
            case "binance":
                return "BNB";
            case "avalanche":
                return "AVA";
            case "solana":
                return "SOL";
            default:
                return network.toUpperCase();
        }
    }

    /** LiFi `fromChain` query symbols for numeric chain IDs used in stepTransaction bodies. */
    getChainIdentifierFromChainId(chainId: number | string): string {
        const id = Number(chainId);

        const map: Record<number, string> = {
            1: "ETH",
            56: "BNB",
            137: "POL",
            43114: "AVA",
        };

        if (map[id]) return map[id];

        return String(chainId);
    }

    /**
     * Truncate fractional digits to `decimals` so `ethers.parseUnits` never throws NUMERIC_FAULT
     * (human-entered or float-derived strings often exceed USDC-style 6 dp).
     */
    private _clampDecimalPlacesForParseUnits(amount: unknown, decimals: number): string {
        let s = String(amount).trim().replace(/,/g, "");

        if (!s || s === "." || s.startsWith("-")) {
            return "0";
        }

        if (/[eE]/.test(s)) {
            const n = Number(s);

            if (!Number.isFinite(n) || n < 0) {
                return "0";
            }

            return n.toFixed(decimals);
        }

        const dotIdx = s.indexOf(".");
        let intPart = dotIdx === -1 ? s : s.slice(0, dotIdx);
        let fracPart = dotIdx === -1 ? "" : s.slice(dotIdx + 1);

        intPart = intPart.replace(/\D/g, "") || "0";
        fracPart = fracPart.replace(/\D/g, "").slice(0, decimals);

        if (decimals === 0) {
            return intPart;
        }

        return fracPart.length > 0 ? `${intPart}.${fracPart}` : intPart;
    }

    /**
     * Format amount with proper decimals
     */
    formatAmount(amount: string, decimals: number): string {
        try {
            let d = Math.floor(Number(decimals));

            if (!Number.isFinite(d) || d < 0) {
                d = 18;
            }

            if (d > 78) {
                d = 78;
            }

            const normalized = this._clampDecimalPlacesForParseUnits(amount, d);
            const amountBN = ethers.parseUnits(normalized, d);

            return amountBN.toString();
        } catch (error) {
            console.error("Error formatting amount:", error);

            return "0";
        }
    }

    /**
     * Execute a swap transaction (single EVM tx from LiFi `transactionRequest`).
     */
    async executeSwap(quote: any, wallet: any): Promise<any> {
        if (!quote?.transactionRequest || !quote?.action || !quote?.estimate) {
            throw new Error("Invalid quote: missing transactionRequest");
        }

        return this._sendEvmLifiTransactionRequest(quote.transactionRequest, quote.action, quote.estimate, wallet);
    }

    /**
     * Cross-chain / multi-step: first source tx via `executeSwap`, poll bridge status, then sign any destination-chain steps.
     */
    async executeEvmLiFiSwap(quote: any, wallet: { privateKey: string; address: string }): Promise<any> {
        const receipt = await this.executeSwap(quote, wallet);
        const txHash = receipt?.transactionHash ?? receipt?.hash;
        const fromChainId = Number(quote?.action?.fromChainId);
        const toChainId = Number(quote?.action?.toChainId);
        const isCross = Number.isFinite(fromChainId) && Number.isFinite(toChainId) && fromChainId !== toChainId;

        if (isCross && txHash && quote?.tool) {
            await this.waitForLiFiTransferStatus({
                txHash,
                tool: String(quote.tool),
                fromChainId,
                toChainId,
            });
        }

        if (isCross) {
            await this.executeDestinationEvmStepsIfAny(quote, wallet);
        }

        return receipt;
    }

    private async _sendEvmLifiTransactionRequest(
        transactionRequest: { to: string; data: string; value?: string; gasLimit?: string },
        action: { fromChainId: number | string; fromToken: { address: string }; fromAmount: string },
        estimate: { approvalAddress: string },
        wallet: { privateKey: string; address: string }
    ): Promise<any> {
        try {
            const chainId = action.fromChainId;
            const provider = new ethers.JsonRpcProvider(this.getNetworkRPC(chainId));
            const signer = new ethers.Wallet(wallet.privateKey, provider);

            const NATIVE_TOKEN_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
            const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

            const isFromNative =
                action.fromToken.address.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase() ||
                action.fromToken.address.toLowerCase() === ZERO_ADDRESS.toLowerCase();

            const feeData = await provider.getFeeData();
            const nonce = await provider.getTransactionCount(signer.address, "latest");

            const tx = {
                to: transactionRequest.to,
                data: transactionRequest.data,
                nonce: nonce,
                value: isFromNative ? (transactionRequest.value ?? "0") : "0",
                maxFeePerGas: feeData.maxFeePerGas,
                maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
                gasLimit: transactionRequest.gasLimit ? BigInt(transactionRequest.gasLimit) : ethers.parseUnits("800000", "wei"),
            };

            if (!isFromNative) {
                await this.checkAndSetAllowance(
                    action.fromToken.address,
                    estimate.approvalAddress,
                    action.fromAmount,
                    wallet.address,
                    wallet.privateKey,
                    chainId.toString()
                );
            }

            await new Promise((resolve) => setTimeout(resolve, 1000));

            const latestNonce = await provider.getTransactionCount(signer.address, "latest");

            tx.nonce = latestNonce;

            const transaction = await signer.sendTransaction(tx);

            try {
                const waited = await transaction.wait();

                return { ...(waited || {}), transactionHash: waited?.hash || transaction?.hash };
            } catch (error) {
                return { ...transaction, transactionHash: transaction.hash };
            }
        } catch (error) {
            console.error("Detailed swap execution error:", error);
            throw error;
        }
    }

    async getTransferStatus(params: { txHash: string; bridge?: string; fromChain?: string; toChain?: string }): Promise<any> {
        const query: Record<string, string> = { txHash: params.txHash };

        if (params.bridge) query.bridge = params.bridge;
        if (params.fromChain !== undefined && params.fromChain !== "") query.fromChain = params.fromChain;
        if (params.toChain !== undefined && params.toChain !== "") query.toChain = params.toChain;

        return firstValueFrom(
            this._http.get<{ data: any }>(`${this.LIFI_API_URL}/status`, { params: query }).pipe(
                map((r) => r.data ?? r),
                catchError((err) => {
                    console.warn("LiFi status error:", err);

                    return of(null);
                })
            )
        );
    }

    private async waitForLiFiTransferStatus(opts: {
        txHash: string;
        tool: string;
        fromChainId: number;
        toChainId: number;
    }): Promise<void> {
        const maxAttempts = 48;
        const delayMs = 5000;

        for (let i = 0; i < maxAttempts; i++) {
            await new Promise((resolve) => setTimeout(resolve, delayMs));

            const s = await this.getTransferStatus({
                txHash: opts.txHash,
                bridge: opts.tool,
                fromChain: String(opts.fromChainId),
                toChain: String(opts.toChainId),
            });

            if (!s) continue;

            const st = String(s.status ?? "").toUpperCase();

            if (st === "DONE" || st === "FAILED" || st === "INVALID" || st === "NOT_FOUND") break;
        }
    }

    private async executeDestinationEvmStepsIfAny(quote: any, wallet: { privateKey: string; address: string }): Promise<void> {
        const dest = Number(quote?.action?.toChainId);

        if (!Number.isFinite(dest) || !Array.isArray(quote?.includedSteps)) return;

        for (const step of quote.includedSteps) {
            const from = Number(step?.action?.fromChainId);

            if (from !== dest) continue;
            if (!step?.tool || !step?.estimate || !step?.action) continue;

            try {
                await this.postEvmLiFiStepAndSend(quote, step, wallet);
            } catch (e) {
                console.warn("LiFi destination-chain step skipped:", e);

                break;
            }
        }
    }

    private async postEvmLiFiStepAndSend(quote: any, step: any, wallet: { privateKey: string; address: string }): Promise<void> {
        const fromChainId = Number(step.action.fromChainId);
        const lifiChain = this.getChainIdentifierFromChainId(fromChainId);
        const body = {
            ...step,
            id: quote.id,
            fromChain: lifiChain,
            fromAddress: wallet.address,
            toAddress: step.action.toAddress || quote.action?.toAddress || wallet.address,
        };

        const { data: txResponse } = await firstValueFrom(
            this._http.post<{ data: any }>(`${this.LIFI_API_URL}/execute-advanced-step-transaction`, body)
        );

        if (!txResponse?.transactionRequest) return;

        await this._sendEvmLifiTransactionRequest(txResponse.transactionRequest, step.action, step.estimate, wallet);
    }

    private async checkAndSetAllowance(
        tokenAddress: string,
        spender: string,
        amount: string,
        owner: string,
        privateKey: string,
        network: string
    ): Promise<void> {
        try {
            const provider = new ethers.JsonRpcProvider(this.getNetworkRPC(network));
            const signer = new ethers.Wallet(privateKey, provider);
            const contract = new ethers.Contract(tokenAddress, this.ERC20_ABI, signer);

            const currentAllowance = await contract.allowance.staticCall(owner, spender);

            if (BigInt(currentAllowance.toString()) < BigInt(amount)) {
                const feeData = await provider.getFeeData();

                const tx = await contract.approve(spender, amount, {
                    gasLimit: ethers.parseUnits("200000", "wei"),
                    maxFeePerGas: feeData.maxFeePerGas,
                    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
                });

                await tx.wait();
            }
        } catch (error) {
            console.error("Error in checkAndSetAllowance:", error);
            throw error;
        }
    }

    private getNetworkRPC(chainIdOrSlug: string | number): string {
        const raw = String(chainIdOrSlug).trim();
        const slugToId: Record<string, string> = {
            ethereum: "1",
            avalanche: "43114",
            binance: "56",
            polygon: "137",
        };

        const id = /^\d+$/.test(raw) ? raw : slugToId[raw.toLowerCase()];

        if (!id) throw new Error(`Unsupported network: ${chainIdOrSlug}`);

        const networkMappings: { [key: string]: string } = {
            "1": environment.ethereumRpc.mainnet,
            "56": environment.binanceRpc.mainnet,
            "137": environment.polygonRpc.mainnet,
            "43114": environment.avalancheRpc.mainnet,
        };

        const rpc = networkMappings[id];

        if (!rpc) throw new Error(`Unsupported network: ${chainIdOrSlug}`);

        return rpc;
    }

    async sendTransaction(params: any): Promise<any> {
        try {
            const provider = new ethers.JsonRpcProvider(params.network);
            const signer = new ethers.Wallet(params.privateKey, provider);

            const gasEstimate = await provider.estimateGas({
                to: params.to,
                data: params.data,
                value: params.value,
            });

            const feeData = await provider.getFeeData();
            const tx = {
                to: params.to,
                data: params.data,
                value: params.value,
                gasLimit: ethers.parseUnits(Math.floor(Number(gasEstimate) * 1.2).toString(), "wei"),
                maxFeePerGas: feeData.maxFeePerGas,
                maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
            };

            const transaction = await signer.sendTransaction(tx);

            try {
                const receipt = await transaction.wait();

                return { ...(receipt || {}), transactionHash: receipt?.hash || transaction?.hash };
            } catch (error) {
                return { ...transaction, transactionHash: transaction.hash };
            }
        } catch (error) {
            console.error("Error sending transaction:", error);
            throw error;
        }
    }

    getTokenImage(token: TokenData): string {
        if (token.image?.startsWith("http")) return token.image;

        return `assets/tokens/placeholder-coin.png`;
    }

    /**
     * Get the correct token address for the given network and symbol
     */
    getTokenAddress(network: string, symbol: string, contractAddress: string): string {
        if (network.toLowerCase() === "solana") {
            const solanaTokens: { [key: string]: string } = {
                SOL: "So11111111111111111111111111111111111111112",
            };

            if (solanaTokens[symbol.toUpperCase()]) {
                return solanaTokens[symbol.toUpperCase()];
            }

            if (contractAddress && !contractAddress.startsWith("0x")) {
                return contractAddress;
            }

            console.warn(`Token ${symbol} no reconocido en Solana, usando SOL nativo como fallback`);

            return "So11111111111111111111111111111111111111112";
        }

        if (["ETH", "AVAX", "BNB", "MATIC", "POL"].includes(symbol.toUpperCase())) {
            return "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
        }

        return contractAddress;
    }
    async getSwapGasCost(swapQuote: any): Promise<any> {
        try {
            return {
                gasLimit: "300000",
                gasPrice: "3000000000",
                maxFeePerGas: "4000000000",
                maxPriorityFeePerGas: "2000000000",
            };
        } catch (error) {
            console.error("Error estimating swap gas:", error);
            throw error;
        }
    }

    /**
     * Get routes for token swap including Solana support
     */
    getRoutes(
        fromChain: string | number,
        fromToken: string,
        toChain: string | number,
        toToken: string,
        fromAmount: string,
        fromAddress: string,
        toAddress: string,
        slippage: number = 3
    ): Observable<any> {
        const requestBody = {
            fromChainId: fromChain,
            fromAmount,
            toChainId: toChain,
            fromTokenAddress: fromToken,
            toTokenAddress: toToken,
            fromAddress,
            toAddress,
            options: {
                slippage: slippage / 100,
            },
        };

        return this._http.post<{ data: any }>(`${this.LIFI_API_URL}/advanced/routes`, requestBody);
    }

    /**
     * Converts UI slippage in percent (slider 0.1–0.8 = 0.1%–0.8%) to LiFi's decimal fraction (e.g. 0.005 = 0.5%).
     */
    private _uiSlippagePercentToLiFiDecimal(slippageInput: string): string {
        const raw = Number(String(slippageInput).trim().replace(/,/g, "."));
        const percent = Number.isFinite(raw) && raw > 0 ? raw : 0.5;
        let d = percent / 100;

        if (d < 0.0001) d = 0.0001;
        if (d > 0.99) d = 0.99;

        let s = d.toFixed(10).replace(/\.?0+$/, "");

        if (!s || s === ".") s = "0.0001";

        return s;
    }

    /**
     * Get a quote for a swap.
     * @param slippage UI percent (same as swap form / slippage sheet), not LiFi raw decimal.
     */
    getQuote(
        fromChain: string,
        fromToken: string,
        toChain: string,
        toToken: string,
        fromAmount: string,
        fromAddress: string,
        slippage: string,
        toAddress?: string
    ): Promise<LifiQuote> {
        const formattedAmount = this._formatAmount(fromAmount.toString());

        const params: Record<string, string> = {
            fromChain,
            fromToken,
            toChain,
            toToken,
            fromAmount: formattedAmount,
            fromAddress,
            slippage: this._uiSlippagePercentToLiFiDecimal(slippage),
        };

        const to = String(toAddress || "").trim();

        if (to) params.toAddress = to;

        return firstValueFrom(
            this._http.get<{ data: LifiQuote }>(`${this.LIFI_API_URL}/quote`, { params }).pipe(
                map((response) => response.data),
                catchError((error) => {
                    console.error("Error getting quote:", error);
                    throw error;
                })
            )
        );
    }

    async executeSwapWithApproval(quote: any, wallet: any, sourceNetwork: string, sourceToken: any, targetToken: any): Promise<any> {
        try {
            if (!quote || !quote.estimate || Number(quote.estimate.toAmount) === 0) {
                console.error("No hay ruta de swap o liquidez insuficiente. Aborting swap.");
                throw new Error("No hay ruta de swap o liquidez insuficiente");
            }

            if (sourceNetwork === "avalanche") {
                return this.executeDirectSwap(wallet, sourceNetwork, sourceToken, targetToken, quote.action.fromAmount);
            }
        } catch (error) {
            console.error("Error ejecutando swap:", error);
            throw error;
        }
    }

    async executeDirectSwap(wallet: any, sourceNetwork: string, sourceToken: any, targetToken: any, amount: string): Promise<any> {
        try {
            const ROUTER_ADDRESS = "0x60aE616a2155Ee3d9A68541Ba4544862310933d4";
            const WAVAX_ADDRESS = "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7";
            const ROUTER_ABI = [
                {
                    inputs: [
                        { name: "amountIn", type: "uint256" },
                        { name: "amountOutMin", type: "uint256" },
                        { name: "path", type: "address[]" },
                        { name: "to", type: "address" },
                        { name: "deadline", type: "uint256" },
                    ],
                    name: "swapExactTokensForTokens",
                    outputs: [{ name: "amounts", type: "uint256[]" }],
                    type: "function",
                },

                {
                    inputs: [
                        { name: "amountIn", type: "uint256" },
                        { name: "amountOutMin", type: "uint256" },
                        { name: "path", type: "address[]" },
                        { name: "to", type: "address" },
                        { name: "deadline", type: "uint256" },
                    ],
                    name: "swapExactTokensForAVAX",
                    outputs: [{ name: "amounts", type: "uint256[]" }],
                    type: "function",
                },

                {
                    inputs: [
                        { name: "amountOutMin", type: "uint256" },
                        { name: "path", type: "address[]" },
                        { name: "to", type: "address" },
                        { name: "deadline", type: "uint256" },
                    ],
                    name: "swapExactAVAXForTokens",
                    outputs: [{ name: "amounts", type: "uint256[]" }],
                    stateMutability: "payable",
                    type: "function",
                },
            ];

            const rpcUrl = this.getNetworkRPC(sourceNetwork);
            const provider = new ethers.JsonRpcProvider(rpcUrl);
            const privateKey = wallet.privateKey.startsWith("0x")
                ? wallet.privateKey
                : ethers.Wallet.fromPhrase(wallet.mnemonic.trim().toLowerCase()).privateKey;
            const signer = new ethers.Wallet(privateKey, provider);
            const router = new ethers.Contract(ROUTER_ADDRESS, ROUTER_ABI, signer);
            const deadline = Math.floor(Date.now() / 1000) + 1200;

            const isSourceNative = !sourceToken.address || sourceToken.address === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
            const isTargetNative = !targetToken.address || targetToken.address === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

            try {
                if (isSourceNative && !isTargetNative) {
                    const path = [WAVAX_ADDRESS, targetToken.address];
                    return await router.swapExactAVAXForTokens(
                        ethers.parseUnits(amount, "wei"),
                        ethers.parseUnits("1", "wei"),
                        path,
                        signer.address,
                        deadline
                    );
                } else if (!isSourceNative && isTargetNative) {
                    const path = [sourceToken.address, WAVAX_ADDRESS];

                    await this.approveToken(sourceToken.address, signer.address, ROUTER_ADDRESS, amount, privateKey, sourceNetwork);

                    await new Promise((resolve) => setTimeout(resolve, 5000));

                    return await router.swapExactTokensForAVAX(
                        ethers.parseUnits(amount, "wei"),
                        ethers.parseUnits("1", "wei"),
                        path,
                        signer.address,
                        deadline
                    );
                } else if (!isSourceNative && !isTargetNative) {
                    const path = [sourceToken.address, WAVAX_ADDRESS, targetToken.address];

                    await this.approveToken(sourceToken.address, signer.address, ROUTER_ADDRESS, amount, privateKey, sourceNetwork);

                    await new Promise((resolve) => setTimeout(resolve, 5000));

                    return await router.swapExactTokensForTokens(
                        ethers.parseUnits(amount, "wei"),
                        ethers.parseUnits("1", "wei"),
                        path,
                        signer.address,
                        deadline
                    );
                } else {
                    throw new Error("Tipo de swap inválido: AVAX a AVAX");
                }
            } catch (error) {
                console.error("Error ejecutando swap directo:", error);
                throw new Error("Error en la transacción: " + (error as Error).message || "Desconocido");
            }
        } catch (error) {
            console.error("Error ejecutando swap directo:", error);
            throw error;
        }
    }

    private async approveToken(
        tokenAddress: string,
        owner: string,
        spender: string,
        amount: string,
        privateKey: string,
        network: string
    ): Promise<void> {
        await this.checkAndSetAllowance(tokenAddress, spender, amount, owner, privateKey, network);
    }

    /**
     * Execute a swap on Solana
     */
    async executeSolanaSwap(quote: any, wallet: any, mnemonic?: string): Promise<any> {
        try {
            if (!quote) throw new Error("Invalid quote for Solana swap: Quote is null or undefined");

            let step;

            if (quote.steps && quote.steps.length > 0) {
                step = quote.steps[0];
            } else if (quote.tool) {
                step = quote;
            } else if (quote.includedSteps && quote.includedSteps.length > 0) {
                step = quote.includedSteps[0];
            } else throw new Error("Invalid quote structure: No steps or direct quote found");

            if (!step.tool) throw new Error("Invalid step: Missing tool information");

            if (!quote.estimate || !quote.estimate.toAmount || parseFloat(quote.estimate.toAmount) <= 0) {
                throw new Error("Invalid quote: The estimated output amount is zero or missing");
            }

            if (!wallet || !wallet.solanaAddress) throw new Error("Wallet address is required for Solana swap");

            const requestBody = {
                ...quote,
                fromAddress: wallet.solanaAddress,
                toAddress: wallet.solanaAddress,
                slippage: quote.slippage || 1,
            };

            const { data: txResponse } = await firstValueFrom(
                this._http.post<{ data: any }>(`${this.LIFI_API_URL}/execute-advanced-step-transaction`, requestBody)
            );

            if (!txResponse || !txResponse.transactionRequest) throw new Error("Failed to get transaction data");

            const transactionData = txResponse.transactionRequest.data;

            if (!transactionData) throw new Error("No transaction data received");
            if (!mnemonic) throw new Error("Mnemonic phrase is required for signing Solana transactions");

            try {
                const cleanMnemonic = mnemonic.trim();
                const signature = await this._solanaService.sendSerializedTransaction(cleanMnemonic, transactionData);

                await new Promise((resolve) => setTimeout(resolve, 2000));

                return {
                    status: "SUCCESS",
                    message: "Transaction successfully executed",
                    transactionHash: signature,
                    transactionData: transactionData,
                    network: "solana",
                    fromToken: quote.action?.fromToken?.symbol || "",
                    toToken: quote.action?.toToken?.symbol || "",
                    fromAmount: quote.action?.fromAmount || "0",
                    toAmount: quote.estimate?.toAmount || "0",
                    fromAddress: wallet.solanaAddress,
                    toAddress: wallet.solanaAddress,
                };
            } catch (error: any) {
                console.error("Error in Solana transaction:", error);

                if (error.message && error.message.includes("Fondos insuficientes")) {
                    throw new Error(
                        "Para realizar un swap en Solana, necesitas tener al menos 0.002 SOL para cubrir las tarifas de red y la creación de cuentas de token. Por favor, añade SOL a tu cuenta e inténtalo de nuevo."
                    );
                }

                if (error.message && (error.message.includes("Instruction") || error.message.includes("Program Error"))) {
                    throw new Error(
                        "La transacción falló en la blockchain de Solana. Esto puede deberse a slippage, liquidez insuficiente o problemas con las cuentas de token. Por favor, intenta con un monto menor o un slippage mayor."
                    );
                }

                if (error.message && error.message.includes("expired")) {
                    throw new Error(
                        "La transacción expiró antes de ser confirmada. Esto puede deberse a congestión en la red. Por favor, intenta nuevamente."
                    );
                }

                throw error;
            }
        } catch (error) {
            console.error("Error executing Solana swap:", error);

            throw error;
        }
    }
}
