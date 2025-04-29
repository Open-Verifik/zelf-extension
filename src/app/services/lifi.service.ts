import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, forkJoin, firstValueFrom } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { TokenData } from "app/wallet";
import { environment } from "environments/environment";
import { EthereumService } from "app/eth.service";
import Web3 from "web3";
import { ethers } from "ethers";

@Injectable({
    providedIn: "root",
})
export class LifiService {
    private readonly _API_URL = "https://li.quest/v1";

    private readonly CHAIN_MAPPINGS: Record<string, string> = {
        ethereum: "eth",
        avalanche: "avax",
        solana: "sol",
        sui: "sui",
        bitcoin: "btc",
    };

    constructor(private _http: HttpClient, private _ethService: EthereumService) {}

    get API_URL(): string {
        return this._API_URL;
    }

    getChains(): Observable<any> {
        return this._http.get(`${this.API_URL}/chains`);
    }

    getTools(): Observable<any> {
        return this._http.get(`${this.API_URL}/tools`);
    }

    getTokens(): Observable<any> {
        const chains = ["eth", "avax", "sol", "sui"];
        const requests: Observable<any>[] = [];

        chains.forEach((chain) => {
            requests.push(
                this._http.get(`${this.API_URL}/tokens?chain=${chain}`).pipe(
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
        return this._http.get(`${this.API_URL}/connections`);
    }

    /**
     * Get a quote for swapping tokens
     * @param fromChain Source chain
     * @param fromToken Source token address
     * @param toChain Target chain
     * @param toToken Target token address
     * @param fromAmount Amount to swap in smallest unit
     * @param fromAddress Sender's address
     * @param slippage Slippage tolerance percentage
     */
    getQuote(
        fromChain: number,
        fromToken: string,
        toChain: number,
        toToken: string,
        fromAmount: string,
        fromAddress: string,
        slippage: number
    ): Observable<any> {
        return this._http.get<any>(`${this._API_URL}/quote`, {
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
     * Get transaction status
     * @param bridge Bridge name
     * @param fromChain Source chain
     * @param toChain Target chain
     * @param txHash Transaction hash
     */
    getStatus(bridge: string, fromChain: string, toChain: string, txHash: string): Observable<any> {
        const params = {
            bridge,
            fromChain,
            toChain,
            txHash,
        };

        return this._http.get(`${this.API_URL}/status`, { params });
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
            arbitrum: 42161,
            arb: 42161,
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
        return this._http.get(`${this.API_URL}/token?chain=${chainId}&token=${tokenAddress}`);
    }

    trackTransaction(txHash: string, fromChain: string, toChain: string): Observable<any> {
        const fromChainId = this.getChainIdentifier(fromChain);
        const toChainId = this.getChainIdentifier(toChain);

        return this._http.get(`${this.API_URL}/status?txHash=${txHash}&fromChain=${fromChainId}&toChain=${toChainId}`);
    }

    getTokensForNetworks(networks: string[]): Observable<any> {
        return forkJoin(
            networks.map((network) =>
                this._http.get(`${this.API_URL}/tokens?chain=${this.CHAIN_MAPPINGS[network]}`).pipe(
                    catchError((error) => {
                        console.error(`Error fetching tokens for ${network}:`, error);
                        return of([]);
                    })
                )
            )
        ).pipe(
            map((responses) => {
                return networks.reduce((acc, network, index) => {
                    acc[network] = responses[index];
                    return acc;
                }, {} as Record<string, any>);
            })
        );
    }

    async executeSwap(swapData: any): Promise<any> {
        try {
            const quote = await firstValueFrom(
                this.getQuote(
                    swapData.fromChainId,
                    swapData.fromToken.contractAddress,
                    swapData.toChainId,
                    swapData.toToken.contractAddress,
                    swapData.fromAmount,
                    this._getWalletAddress(swapData.fromToken.network),
                    0.5
                )
            );

            const response = await firstValueFrom(
                this._http.post(`${this.API_URL}/execute`, {
                    route: quote,
                    fromAddress: this._getWalletAddress(swapData.fromToken.network),
                })
            );
            return response;
        } catch (error) {
            console.error("Error executing swap:", error);
            throw error;
        }
    }

    private _getWalletAddress(network: string): string {
        return "";
    }

    getTokenImage(token: TokenData): string {
        if (token.image && token.image.startsWith("http") && !token.image.includes("monerium.app") && !token.image.includes("onbons.ai")) {
            return token.image;
        }

        const trustWalletUrl = token.contractAddress
            ? `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${token.contractAddress}/logo.png`
            : null;

        const fallbackUrls = [
            trustWalletUrl,
            `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/${token.symbol.toLowerCase()}.png`,
            "/assets/images/default-token.png",
        ].filter((url) => url !== null);

        return fallbackUrls[0] || "/assets/images/default-token.png";
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

    private getNetworkRPC(network: string): string {
        const rpcs: { [key: string]: string } = {
            ethereum: environment.networks.ethereum,
            avalanche: environment.networks.avalanche,
        };

        console.log("Getting RPC for network:", network);
        return rpcs[network.toLowerCase()] || rpcs.avalanche;
    }

    /**
     * Send a transaction for a swap
     * @param params Transaction parameters
     * @returns Transaction receipt
     */
    async sendTransaction(params: any): Promise<any> {
        try {
            console.log("Transaction parameters received:", params);

            let txRequest;
            if (params.transactionRequest) {
                txRequest = params.transactionRequest;
            } else if (params.data && params.to) {
                txRequest = {
                    to: params.to,
                    data: params.data,
                    value: params.value || "0x0",
                    gasLimit: params.gasLimit || "300000",
                    gasPrice: params.gasPrice,
                    chainId: this.getChainIdentifier(params.network),
                };
            } else {
                txRequest = params;
            }

            let privateKey = params.privateKey;
            const network = params.network;

            if (!txRequest || !txRequest.to) {
                console.error("Transaction request is undefined or missing required fields", params);
                throw new Error("Solicitud de transacción inválida");
            }

            if (!privateKey.startsWith("0x")) {
                privateKey = "0x" + privateKey;
            }

            const rpcUrl = this.getNetworkRPC(network);
            const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

            const account = web3.eth.accounts.privateKeyToAccount(privateKey);

            let gasPrice = txRequest.gasPrice;
            if (!gasPrice) {
                gasPrice = await web3.eth.getGasPrice();
                console.log("Using network gas price:", gasPrice);
            }

            const chainId = txRequest.chainId || this.getChainIdentifier(network);
            const nonce = await web3.eth.getTransactionCount(account.address, "latest");

            let gasLimit = txRequest.gasLimit || txRequest.gas || "300000";
            if (gasLimit && !gasLimit.toString().startsWith("0x")) {
                gasLimit = "0x" + parseInt(gasLimit.toString()).toString(16);
            }

            let tx: any = {
                from: account.address,
                to: txRequest.to,
                value: txRequest.value || "0x0",
                data: txRequest.data,
                nonce: nonce,
                chainId: chainId,
            };

            if (txRequest.maxFeePerGas && txRequest.maxPriorityFeePerGas) {
                tx.maxFeePerGas = txRequest.maxFeePerGas;
                tx.maxPriorityFeePerGas = txRequest.maxPriorityFeePerGas;
                tx.gas = gasLimit;
                console.log("Using EIP-1559 transaction format");
            } else {
                tx.gasPrice = gasPrice;
                tx.gas = gasLimit;
                console.log("Using legacy transaction format");
            }

            console.log("Final transaction object:", tx);

            const signedTx = await account.signTransaction(tx);
            const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

            return receipt;
        } catch (error: any) {
            console.error("Error sending transaction:", error);

            if (error.message?.includes("insufficient funds")) {
                throw new Error("Fondos insuficientes para la transacción");
            } else if (error.message?.includes("reverted")) {
                throw new Error("Transacción revertida: posiblemente slippage demasiado bajo o ruta de swap no disponible");
            } else if (error.message?.includes("gas")) {
                throw new Error("Error con los parámetros de gas: " + error.message);
            }

            throw error;
        }
    }

    /**
     * Check if token approval is needed and execute it if required
     * @param tokenAddress ERC20 token address
     * @param owner Owner address
     * @param spender Spender address (usually the router contract)
     * @param amount Amount to approve
     * @param privateKey Private key for signing
     * @param network Network name
     */
    async checkAndApproveToken(
        tokenAddress: string,
        owner: string,
        spender: string,
        amount: string,
        privateKey: string,
        network: string
    ): Promise<boolean> {
        try {
            const rpcUrl = this.getNetworkRPC(network);
            const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

            if (tokenAddress === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
                return true;
            }

            if (!privateKey.startsWith("0x")) {
                privateKey = "0x" + privateKey;
            }

            const erc20ABI = [
                {
                    constant: true,
                    inputs: [
                        { name: "_owner", type: "address" },
                        { name: "_spender", type: "address" },
                    ],
                    name: "allowance",
                    outputs: [{ name: "", type: "uint256" }],
                    type: "function",
                },
                {
                    constant: false,
                    inputs: [
                        { name: "_spender", type: "address" },
                        { name: "_value", type: "uint256" },
                    ],
                    name: "approve",
                    outputs: [{ name: "", type: "bool" }],
                    type: "function",
                },
            ];

            const tokenContract = new web3.eth.Contract(erc20ABI, tokenAddress);

            const currentAllowance = await tokenContract.methods.allowance(owner, spender).call();

            const allowanceBigInt = currentAllowance && /^\d+$/.test(currentAllowance.toString()) ? BigInt(currentAllowance.toString()) : BigInt(0);

            if (allowanceBigInt < BigInt(amount)) {
                console.log("Approving token...", {
                    token: tokenAddress,
                    owner,
                    spender,
                    amount,
                });

                const approveData = tokenContract.methods.approve(spender, amount).encodeABI();

                const nonce = await web3.eth.getTransactionCount(owner, "latest");
                const gasPrice = await web3.eth.getGasPrice();

                let gasLimit;
                try {
                    gasLimit = await tokenContract.methods.approve(spender, amount).estimateGas({ from: owner });
                } catch (error) {
                    console.warn("Error estimating gas for approval:", error);
                    gasLimit = 100000;
                }

                const approveTx = {
                    from: owner,
                    to: tokenAddress,
                    data: approveData,
                    gas: gasLimit,
                    gasPrice: gasPrice,
                    nonce: nonce,
                    chainId: this.getChainIdentifier(network),
                };

                const account = web3.eth.accounts.privateKeyToAccount(privateKey);
                const signedTx = await account.signTransaction(approveTx);
                const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

                console.log("Token approval successful:", receipt.transactionHash);
                return true;
            }

            console.log("Token already approved");
            return true;
        } catch (error) {
            console.error("Error in token approval:", error);
            throw error;
        }
    }

    /**
     * Execute a swap including any necessary approvals
     */
    async executeSwapWithApproval(quote: any, wallet: any, sourceNetwork: string, sourceToken: any, targetToken: any): Promise<any> {
        try {
            const rpcUrl = this.getNetworkRPC(sourceNetwork);
            const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

            let privateKey = wallet.privateKey;

            if (wallet.mnemonic && !privateKey.startsWith("0x")) {
                const ethWallet = ethers.Wallet.fromPhrase(wallet.mnemonic.trim().toLowerCase());
                privateKey = ethWallet.privateKey;
            }

            const account = web3.eth.accounts.privateKeyToAccount(privateKey);

            console.log("Executing swap with quote:", {
                fromToken: quote.action?.fromToken?.symbol,
                toToken: quote.action?.toToken?.symbol,
                fromAmount: quote.action?.fromAmount,
                toAmount: quote.estimate?.toAmount,
            });

            if (!quote.transactionRequest) {
                console.error("Transaction request is missing in quote", quote);
                throw new Error("Falta la solicitud de transacción en la cotización");
            }

            if (sourceToken.address && sourceToken.address !== "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
                const approvalAddress = quote.estimate?.approvalAddress || quote.action?.toAddress || quote.transactionRequest?.to;

                if (approvalAddress) {
                    console.log("Checking approval for token", {
                        token: sourceToken.address,
                        owner: account.address,
                        spender: approvalAddress,
                        amount: quote.action?.fromAmount || "0",
                    });

                    await this.checkAndApproveToken(
                        sourceToken.address,
                        account.address,
                        approvalAddress,
                        quote.action?.fromAmount || "0",
                        privateKey,
                        sourceNetwork
                    );

                    await new Promise((resolve) => setTimeout(resolve, 8000));
                }
            }

            return await this.sendTransaction({
                transactionRequest: quote.transactionRequest,
                privateKey: privateKey,
                network: sourceNetwork,
            });
        } catch (error) {
            console.error("Error ejecutando swap:", error);
            throw error;
        }
    }
}
