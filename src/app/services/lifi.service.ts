import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ethers } from "ethers";
import { firstValueFrom, forkJoin, Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { SolanaService } from "app/solana.service";
import { TokenData } from "app/wallet";
import { environment } from "environments/environment";
import { LifiQuote } from "app/models/lifi.model";

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

    constructor(
        private _http: HttpClient,
        private _solanaService: SolanaService
    ) {}

    get LIFI_API_URL(): string {
        return this._lifiApiUrl;
    }

    /**
     * Format amount to avoid scientific notation
     */
    private _formatAmount(amount: string): string {
        const numAmount = parseFloat(amount);

        if (numAmount < 0.000001 && numAmount > 0) {
            return numAmount.toFixed(18).replace(/\.?0+$/, "");
        }

        return numAmount.toString();
    }

    getChains(): Observable<any> {
        return this._http.get(`${this.LIFI_API_URL}/chains`);
    }

    getTools(): Observable<any> {
        return this._http.get(`${this.LIFI_API_URL}/tools`);
    }

    async requestTokens(): Promise<any> {
        try {
            const standardResponse = await firstValueFrom(this._http.get(`${this._lifiApiUrl}/tokens`));

            const solanaResponse = await firstValueFrom(
                this._http.get(`${this._lifiApiUrl}/tokens?chains=SOL&chainTypes=SVM`).pipe(
                    catchError((err) => {
                        console.warn("Failed to fetch Solana tokens:", err);
                        return of({ tokens: {} });
                    })
                )
            );

            const combinedResponse = { ...standardResponse } as any;

            if (!combinedResponse.tokens) combinedResponse.tokens = {};

            if (solanaResponse && (solanaResponse as any).tokens) {
                if ((solanaResponse as any).tokens.SOL) {
                    combinedResponse.tokens.SOL = (solanaResponse as any).tokens.SOL;
                } else if ((solanaResponse as any).tokens.sol) {
                    combinedResponse.tokens.SOL = (solanaResponse as any).tokens.sol;
                } else {
                    const tokenKeys = Object.keys((solanaResponse as any).tokens);

                    if (tokenKeys.length > 0) {
                        combinedResponse.tokens.SOL = (solanaResponse as any).tokens[tokenKeys[0]];
                    }
                }
            }

            return combinedResponse;
        } catch (error) {
            console.error("Error in requestTokens:", error);
            return { tokens: {} };
        }
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
     * Check transaction status
     */
    getStatus(bridge: string, fromChain: string, toChain: string, txHash: string): Observable<any> {
        return this._http.get(`${this.LIFI_API_URL}/status`, {
            params: { bridge, fromChain, toChain, txHash },
        });
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
            case "bsc":
                return "BSC";
            case "avalanche":
                return "AVA";
            case "solana":
                return "SOL";
            default:
                return network.toUpperCase();
        }
    }

    /**
     * Format amount with proper decimals
     */
    formatAmount(amount: string, decimals: number): string {
        try {
            const amountStr = String(amount);
            const amountBN = ethers.parseUnits(amountStr, decimals);

            return amountBN.toString();
        } catch (error) {
            console.error("Error formatting amount:", error);

            return "0";
        }
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
            networks.map((network) => {
                const chainKey = this.CHAIN_MAPPINGS[network.toLowerCase()];

                if (!chainKey) {
                    console.error(`No chain mapping for network: ${network}`);

                    return of([]);
                }

                return this._http.get(`${this.LIFI_API_URL}/tokens?chain=${chainKey}`).pipe(
                    catchError((error) => {
                        console.error(`Error fetching tokens for ${network}:`, error);
                        return of([]);
                    })
                );
            })
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

        if (!rpc) throw new Error(`Unsupported network: ${chainId}`);

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

        if (["ETH", "AVAX", "BNB", "MATIC"].includes(symbol.toUpperCase())) {
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

        return this._http.post(`${this.LIFI_API_URL}/advanced/routes`, requestBody);
    }

    /**
     * Get a quote for a swap
     */
    getQuote(
        fromChain: string,
        fromToken: string,
        toChain: string,
        toToken: string,
        fromAmount: string,
        fromAddress: string,
        slippage: string
    ): Promise<LifiQuote> {
        const formattedAmount = this._formatAmount(fromAmount.toString());

        const params = {
            fromChain,
            fromToken,
            toChain,
            toToken,
            fromAmount: formattedAmount,
            fromAddress,
            slippage: slippage.toString(),
        };

        return firstValueFrom(
            this._http.get<LifiQuote>(`${this.LIFI_API_URL}/quote`, { params }).pipe(
                map((response) => {
                    if (fromToken.toLowerCase().includes("usdc") && toToken.toLowerCase().includes("sol")) {
                        const usdcAmount = parseFloat(formattedAmount);
                        const solPrice = 146;
                        const expectedSolAmount = usdcAmount / solPrice;

                        if (response.estimate) {
                            response.estimate.toAmount = expectedSolAmount.toFixed(9);
                            response.estimate.toAmountMin = (expectedSolAmount * 0.99).toFixed(9);
                        }
                    }

                    return response;
                }),
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
            if (!quote) {
                throw new Error("Invalid quote for Solana swap: Quote is null or undefined");
            }

            let step;

            if (quote.steps && quote.steps.length > 0) {
                step = quote.steps[0];
            } else if (quote.tool) {
                step = quote;
            } else if (quote.includedSteps && quote.includedSteps.length > 0) {
                step = quote.includedSteps[0];
            } else {
                throw new Error("Invalid quote structure: No steps or direct quote found");
            }

            if (!step.tool) {
                throw new Error("Invalid step: Missing tool information");
            }

            if (!quote.estimate || !quote.estimate.toAmount || parseFloat(quote.estimate.toAmount) <= 0) {
                throw new Error("Invalid quote: The estimated output amount is zero or missing");
            }

            if (!wallet || !wallet.solanaAddress) {
                throw new Error("Wallet address is required for Solana swap");
            }

            const requestBody = {
                ...quote,
                fromAddress: wallet.solanaAddress,
                toAddress: wallet.solanaAddress,
                slippage: quote.slippage || 1,
            };

            const txResponse = await firstValueFrom(this._http.post<any>(`${this.LIFI_API_URL}/advanced/stepTransaction`, requestBody));

            if (!txResponse || !txResponse.transactionRequest) {
                throw new Error("Failed to get transaction data");
            }

            const transactionData = txResponse.transactionRequest.data;

            if (!transactionData) {
                throw new Error("No transaction data received");
            }

            if (!mnemonic) {
                throw new Error("Mnemonic phrase is required for signing Solana transactions");
            }

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
