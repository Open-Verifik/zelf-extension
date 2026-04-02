import { ethers } from "ethers";
import { isAddress } from "web3-validator";

import { Injectable } from "@angular/core";

import { HttpWrapperService } from "app/http-wrapper.service";
import { RpcProviderService } from "app/services/rpc-provider.service";
import { environment } from "environments/environment";
import { TransactionFeeEstimate, TransactionParams, TransactionResult } from "../core/models/transaction-fee.model";

@Injectable({
    providedIn: "root",
})
export class BlockDAGService {
    private _baseUrl: string = environment.apiUrl;

    private readonly _chainConfigs = {
        mainnet: {
            blockExplorerUrls: ["https://bdagscan.com"],
            chainId: 1404,
            chainName: "BlockDAG Mainnet",
            rpcUrls: ["https://rpc.bdagscan.com"],
            nativeCurrency: {
                decimals: 18,
                name: "BDAG",
                symbol: "BDAG",
            },
        },
    };

    constructor(
        private _httpWrapper: HttpWrapperService,
        private _rpcProvider: RpcProviderService
    ) {}

    async getCurrentPrice(): Promise<number> {
        try {
            const response = await this._httpWrapper.sendRequest("get", `${this._baseUrl}/api/blockdag/price`);
            return response.data?.price || 0.05;
        } catch (error) {
            console.error("Error fetching BlockDAG price:", error);
            return 0.05;
        }
    }

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

            const provider = await this._rpcProvider.getEthersProvider("blockdag");

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

            // Get BDAG price
            const bdagPrice = await this.getCurrentPrice();

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

            const provider = await this._rpcProvider.getEthersProvider("blockdag");
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
                const transaction = {
                    to: params.to,
                    value: ethers.parseEther(params.value),
                    chainId: this._chainConfigs.mainnet.chainId,
                };

                txResponse = await wallet.sendTransaction(transaction);
            }

            return {
                hash: txResponse.hash,
                status: "pending",
            };
        } catch (error: any) {
            console.error("Error sending BlockDAG transaction:", error);
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
