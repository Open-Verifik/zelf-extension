import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ethers } from "ethers";
import { firstValueFrom, forkJoin, Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { TokenData } from "app/wallet";
import { environment } from "environments/environment";

@Injectable({
    providedIn: "root",
})
export class LifiService {
    private readonly _lifiApiUrl = "https://li.quest/v1";
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

    private readonly CHAIN_MAPPINGS: Record<string, string> = {
        ethereum: "eth",
        avalanche: "avax",
        solana: "sol",
        sui: "sui",
        bitcoin: "btc",
    };

    constructor(private _http: HttpClient) {}

    get LIFI_API_URL(): string {
        return this._lifiApiUrl;
    }

    getChains(): Observable<any> {
        return this._http.get(`${this.LIFI_API_URL}/chains`);
    }

    getTools(): Observable<any> {
        return this._http.get(`${this.LIFI_API_URL}/tools`);
    }

    requestTokens(): Promise<any> {
        return firstValueFrom(this._http.get(`${this.LIFI_API_URL}/tokens`));
    }

    getTokens(): Observable<any> {
        const chains = ["eth", "avax", "sol", "sui"];
        const requests: Observable<any>[] = [];

        chains.forEach((chain) => {
            requests.push(
                this._http.get(`${this.LIFI_API_URL}/tokens?chain=${chain}`).pipe(
                    catchError((err) => {
                        console.warn(`Failed to fetch tokens for chain ${chain}:`, err);
                        return of(null);
                    })
                )
            );
        });

        return forkJoin(requests).pipe(
            map((results) => {
                const combined: any = {};

                chains.forEach((chain, index) => {
                    if (results[index]) {
                        combined[chain] = results[index].tokens || [];
                    }
                });

                return combined;
            }),
            catchError((error) => {
                console.error("Error in combined token request:", error);
                return of({});
            })
        );
    }

    getConnections(): Observable<any> {
        return this._http.get(`${this.LIFI_API_URL}/connections`);
    }

    /**
     * Get a quote for swapping tokens
     */
    getQuote(
        fromChain: number,
        fromToken: string,
        toChain: number,
        toToken: string,
        fromAmount: string,
        fromAddress: string,
        slippage: number = 3
    ): Observable<any> {
        return this._http.get<any>(`${this.LIFI_API_URL}/quote`, {
            params: {
                fromChain: fromChain.toString(),
                fromToken,
                toChain: toChain.toString(),
                toToken,
                fromAmount,
                fromAddress,
                slippage: slippage.toString(),
            },
        });
    }

    /**
     * Check transaction status
     */
    getStatus(bridge: string, fromChain: string, toChain: string, txHash: string): Observable<any> {
        return this._http.get(`${this.LIFI_API_URL}/status`, {
            params: { bridge, fromChain, toChain, txHash },
        });
    }

    getChainIdentifier(network: string): number {
        if (!network) {
            throw new Error("Network is required");
        }

        const chainIds: { [key: string]: number } = {
            ethereum: 1,
            eth: 1,
            avalanche: 43114,
            avax: 43114,
            polygon: 137,
            matic: 137,
            binance: 56,
            bsc: 56,
        };

        const chainId = chainIds[network.toLowerCase()];

        if (!chainId) {
            console.error(`Unsupported network: ${network}`);
            throw new Error(`Unsupported network: ${network}`);
        }

        return chainId;
    }

    formatAmount(amount: number, decimals: number): string {
        if (!amount || isNaN(amount) || !decimals || isNaN(decimals)) {
            return "0";
        }

        const multiplier = Math.pow(10, decimals);
        const formattedAmount = Math.floor(amount * multiplier).toString();

        return formattedAmount;
    }

    getToken(chainId: string, tokenAddress: string): Observable<any> {
        return this._http.get(`${this.LIFI_API_URL}/token?chain=${chainId}&token=${tokenAddress}`);
    }

    trackTransaction(txHash: string, fromChain: string, toChain: string): Observable<any> {
        const fromChainId = this.getChainIdentifier(fromChain);
        const toChainId = this.getChainIdentifier(toChain);

        return this._http.get(`${this.LIFI_API_URL}/status?txHash=${txHash}&fromChain=${fromChainId}&toChain=${toChainId}`);
    }

    getTokensForNetworks(networks: string[]): Observable<any> {
        return forkJoin(
            networks.map((network) =>
                this._http.get(`${this.LIFI_API_URL}/tokens?chain=${this.CHAIN_MAPPINGS[network]}`).pipe(
                    catchError((error) => {
                        console.error(`Error fetching tokens for ${network}:`, error);
                        return of([]);
                    })
                )
            )
        ).pipe(
            map((responses) => {
                return networks.reduce(
                    (acc, network, index) => {
                        acc[network] = responses[index];
                        return acc;
                    },
                    {} as Record<string, any>
                );
            })
        );
    }

    /**
     * Execute a swap transaction
     */
    async executeSwap(quote: any, wallet: any): Promise<any> {
        try {
            const provider = new ethers.JsonRpcProvider(this.getNetworkRPC(quote.action.fromChainId));
            const signer = new ethers.Wallet(wallet.privateKey, provider);

            const NATIVE_TOKEN_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
            const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

            const isFromNative =
                quote.action.fromToken.address.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase() ||
                quote.action.fromToken.address.toLowerCase() === ZERO_ADDRESS.toLowerCase();

            console.log("Swap details:", {
                fromToken: quote.action.fromToken.address,
                isFromNative,
                value: quote.transactionRequest.value,
                fromTokenSymbol: quote.action.fromToken.symbol,
            });

            const feeData = await provider.getFeeData();
            const nonce = await provider.getTransactionCount(signer.address, "latest");

            const tx = {
                to: quote.transactionRequest.to,
                data: quote.transactionRequest.data,
                nonce: nonce,
                value: isFromNative ? quote.transactionRequest.value : "0",
                maxFeePerGas: feeData.maxFeePerGas,
                maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
                gasLimit: ethers.parseUnits("800000", "wei"),
            };

            if (!isFromNative) {
                await this.checkAndSetAllowance(
                    quote.action.fromToken.address,
                    quote.estimate.approvalAddress,
                    quote.action.fromAmount,
                    wallet.address,
                    wallet.privateKey,
                    quote.action.fromChainId.toString()
                );
            }

            await new Promise((resolve) => setTimeout(resolve, 1000));

            const latestNonce = await provider.getTransactionCount(signer.address, "latest");

            tx.nonce = latestNonce;

            const transaction = await signer.sendTransaction(tx);

            try {
                const receipt = await transaction.wait();

                return { ...(receipt || {}), transactionHash: receipt?.hash || transaction?.hash };
            } catch (error) {
                return { ...transaction, transactionHash: transaction.hash };
            }
        } catch (error) {
            console.error("Detailed swap execution error:", error);
            throw error;
        }
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

    private getNetworkRPC(chainId: string | number): string {
        const networkMappings: { [key: string]: string } = {
            "1": environment.ethereumRpc.mainnet,
            "137": environment.polygonRpc.mainnet,

            "43114": environment.avalancheRpc.mainnet,
        };

        const rpc = networkMappings[chainId.toString()];
        if (!rpc) {
            throw new Error(`Unsupported network: ${chainId}`);
        }
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

        return `assets/icons/placeholder-coin.png`;
    }

    getTokenAddress(network: string, symbol: string): string {
        const nativeTokens: { [key: string]: string } = {
            ethereum: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
            avalanche: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
            polygon: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
            binance: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
            arbitrum: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        };

        return nativeTokens[network.toLowerCase()];
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
     * Get a swap quote from Li.Fi API with simplified parameters
     */
    async getSwapQuote(
        fromChain: string,
        fromToken: string,
        toChain: string,
        toToken: string,
        fromAmount: string,
        fromAddress: string,
        slippage: number = 3
    ): Promise<any> {
        try {
            console.log("Getting swap quote with params:", {
                fromChain,
                fromToken,
                toChain,
                toToken,
                fromAmount,
                fromAddress,
                slippage,
            });

            slippage = Math.max(slippage, 3);

            const url = `${this.LIFI_API_URL}/quote?fromChain=${fromChain}&fromToken=${fromToken}&toChain=${toChain}&toToken=${toToken}&fromAmount=${fromAmount}&fromAddress=${fromAddress}&slippage=${slippage}&allowExchanges=openocean,paraswap,0x&fee=0`;

            const response = await firstValueFrom(
                this._http.get(url).pipe(
                    catchError((error) => {
                        console.error("Error getting swap quote:", error);
                        throw new Error("Error al obtener cotización de swap");
                    })
                )
            );

            const quote: any = response;

            console.log("Quote recibido de LiFi:", quote);
            if (quote?.action) {
                console.log("Ruta de swap:", {
                    fromToken: quote.action.fromToken,
                    toToken: quote.action.toToken,
                    tool: quote.tool,
                    toolDetails: quote.toolDetails,
                    steps: quote.steps,
                });
            }
            if (quote?.estimate) {
                console.log("Montos estimados:", {
                    fromAmount: quote.estimate.fromAmount,
                    toAmount: quote.estimate.toAmount,
                    gasCosts: quote.estimate.gasCosts,
                });
            }

            return quote;
        } catch (error) {
            console.error("Error in getSwapQuote:", error);
            throw error;
        }
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
}
