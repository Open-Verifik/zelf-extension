import { ethers } from "ethers";
import { isAddress } from "web3-validator";

import { Injectable } from "@angular/core";

import { HttpWrapperService } from "app/http-wrapper.service";
import { environment } from "environments/environment";
import { TransactionFeeEstimate, TransactionParams, TransactionResult } from "../core/models/transaction-fee.model";

@Injectable({
    providedIn: "root",
})
export class BlockDAGService {
    private _baseUrl: string = environment.apiUrl;

    private readonly _chainConfigs = {
        mainnet: {
            blockExplorerUrls: ["https://awakening.bdagscan.com"],
            chainId: 1043,
            chainName: "BlockDAG Awakening Network",
            rpcUrls: ["https://rpc.awakening.bdagscan.com"],
            nativeCurrency: {
                decimals: 18,
                name: "BDAG",
                symbol: "BDAG",
            },
        },
    };

    constructor(private _httpWrapper: HttpWrapperService) {}

    private _defaultResponse(): any {
        return {
            data: {
                _balance: 0,
                balance: "0",
                fiatBalance: "0",
                account: {
                    asset: "BDAG",
                    price: "0",
                },
                tokenHoldings: {
                    tokens: [],
                },
            },
        };
    }

    async calculateTransactionFees(
        receiverAddress: string,
        amount: string,
        tokenAddress?: string,
        tokenDecimals: number = 18,
        senderAddress?: string
    ): Promise<TransactionFeeEstimate> {
        try {
            if (!isAddress(receiverAddress)) {
                throw new Error("Invalid receiver address");
            }

            const provider = new ethers.JsonRpcProvider(this._chainConfigs.mainnet.rpcUrls[0]);

            let estimatedGas: bigint;

            if (tokenAddress) {
                // ERC20 token transfer
                const amountInWei = ethers.parseUnits(amount, tokenDecimals);

                estimatedGas = await provider.estimateGas({
                    to: tokenAddress,
                    from: senderAddress,
                    data: ethers.concat([
                        ethers.id("transfer(address,uint256)").slice(0, 10),
                        ethers.zeroPadValue(receiverAddress, 32),
                        ethers.zeroPadValue(ethers.toBeHex(amountInWei), 32),
                    ]),
                });
            } else {
                // Native BDAG transfer
                const amountInWei = ethers.parseEther(amount);

                estimatedGas = await provider.estimateGas({
                    to: receiverAddress,
                    from: senderAddress,
                    value: amountInWei,
                });
            }

            const feeData = await provider.getFeeData();
            const gasPrice = feeData.gasPrice || ethers.parseUnits("1", "gwei");
            const totalCost = estimatedGas * gasPrice;

            const feeInBDAG = parseFloat(ethers.formatEther(totalCost));
            const amountInBDAG = parseFloat(amount);

            // Get BDAG price (placeholder for now)
            const bdagPrice = 0.001; // Default price

            return {
                fee: feeInBDAG,
                fiatFee: feeInBDAG * bdagPrice,
                total: (amountInBDAG + feeInBDAG) * bdagPrice,
                networkPrice: bdagPrice,
            };
        } catch (error) {
            console.error("Error calculating transaction fees:", error);

            return {
                fee: 0,
                fiatFee: 0,
                total: 0,
                networkPrice: 0,
            };
        }
    }

    async getWalletDetails(address: string): Promise<any> {
        try {
            if (!isAddress(address)) {
                return this._defaultResponse();
            }

            const response = await this._httpWrapper.sendRequest("get", `${this._baseUrl}/api/blockdag/address/${address}`);

            if (!response || !response.data) {
                return this._defaultResponse();
            }

            return response;
        } catch (error) {
            console.error("Error getting BlockDAG wallet details:", error);

            return this._defaultResponse();
        }
    }

    async requestTransactionDetails(hash: string): Promise<any> {
        try {
            const response = await this._httpWrapper.sendRequest("get", `${this._baseUrl}/api/blockdag/address/0x0/transaction/${hash}`);

            return response;
        } catch (error) {
            console.error("Error getting BlockDAG transaction details:", error);

            throw error;
        }
    }

    async requestTransactionHistory(address: string, pagination: { page: number }): Promise<any> {
        try {
            if (!isAddress(address)) {
                return { data: { transactions: [] } };
            }

            const response = await this._httpWrapper.sendRequest("get", `${this._baseUrl}/api/blockdag/address/${address}/transactions`, {
                page: pagination.page,
                show: 20,
            });

            return response;
        } catch (error) {
            console.error("Error getting BlockDAG transaction history:", error);

            return { data: { transactions: [] } };
        }
    }

    async sendTransaction(params: TransactionParams): Promise<TransactionResult> {
        try {
            if (!params.privateKey) {
                throw new Error("Private key is required for BlockDAG transactions");
            }

            if (!isAddress(params.to)) {
                throw new Error("Invalid receiver address");
            }

            const provider = new ethers.JsonRpcProvider(this._chainConfigs.mainnet.rpcUrls[0]);
            const wallet = new ethers.Wallet(params.privateKey, provider);

            let txResponse;

            if (params.tokenAddress) {
                // ERC20 token transfer
                const tokenContract = new ethers.Contract(
                    params.tokenAddress,
                    ["function transfer(address to, uint256 amount) returns (bool)", "function decimals() view returns (uint8)"],
                    wallet
                );

                const decimals = params.tokenDecimals || 18;
                const amount = ethers.parseUnits(params.value, decimals);

                txResponse = await tokenContract.transfer(params.to, amount);
            } else {
                // Native BDAG transfer
                // Get current gas price to ensure transaction isn't dropped
                const feeData = await provider.getFeeData();
                const gasPrice = feeData.gasPrice || ethers.parseUnits("1", "gwei");

                // Estimate gas for the transaction
                const estimatedGas = await provider.estimateGas({
                    to: params.to,
                    from: wallet.address,
                    value: ethers.parseEther(params.value),
                });

                const transaction = {
                    to: params.to,
                    value: ethers.parseEther(params.value),
                    chainId: this._chainConfigs.mainnet.chainId,
                    gasPrice: gasPrice,
                    gasLimit: estimatedGas,
                };

                txResponse = await wallet.sendTransaction(transaction);
            }

            // Wait for transaction to be mined (with timeout)
            // This ensures we catch dropped transactions early
            try {
                const receipt = await Promise.race([
                    txResponse.wait(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error("Transaction timeout")), 30000)), // 30 second timeout
                ]);

                // Check if transaction was successful
                if (receipt && receipt.status === 1) {
                    return {
                        hash: txResponse.hash,
                        status: "success",
                    };
                } else {
                    return {
                        hash: txResponse.hash,
                        status: "failed",
                    };
                }
            } catch (waitError: any) {
                // If waiting times out or fails, return pending status
                // The transaction receipt component will check status later
                console.log("Transaction wait timeout or error, returning pending:", waitError.message);
                return {
                    hash: txResponse.hash,
                    status: "pending",
                };
            }
        } catch (error: any) {
            console.error("Error sending BlockDAG transaction:", error);

            // Check if it's a transaction replacement or dropped error
            if (error.code === "TRANSACTION_REPLACED" || error.code === "REPLACED") {
                throw new Error("Transaction was replaced by another transaction");
            }

            if (error.reason === "replaced" || error.message?.includes("replaced")) {
                throw new Error("Transaction was replaced");
            }

            throw error;
        }
    }

    getChainConfig() {
        return this._chainConfigs.mainnet;
    }

    isValidAddress(address: string): boolean {
        return isAddress(address);
    }
}
