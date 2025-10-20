import { ethers } from "ethers";
import Web3 from "web3";
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
    private _web3: Web3;

    private readonly _chainConfigs = {
        mainnet: {
            blockExplorerUrls: ["https://primordial.bdagscan.com"],
            chainId: 1043,
            chainName: "BlockDAG Testnet",
            rpcUrls: ["http://13.234.176.105:18545"],
            nativeCurrency: {
                decimals: 18,
                name: "BDAG",
                symbol: "BDAG",
            },
        },
    };

    constructor(private _httpWrapper: HttpWrapperService) {
        this._web3 = new Web3(new Web3.providers.HttpProvider(this._chainConfigs.mainnet.rpcUrls[0]));
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

    private _fromWei(amount: string, decimals: number = 18): string {
        return this._web3.utils.fromWei(amount, decimals === 18 ? "ether" : "wei");
    }

    private async _getTransactionCost(
        to: string,
        value: string,
        data: string = "0x",
        tokenAddress?: string,
        senderAddress?: string
    ): Promise<{
        estimatedGas: number;
        fee?: number;
        fiatFee?: number;
        gasPrice: string;
        networkPrice: number;
        total?: number;
        totalCost: string;
    }> {
        try {
            let estimatedGas;

            if (tokenAddress) {
                const minABI = [
                    {
                        constant: false,
                        inputs: [
                            { name: "_to", type: "address" },
                            { name: "_value", type: "uint256" },
                        ],
                        name: "transfer",
                        outputs: [{ name: "", type: "bool" }],
                        type: "function",
                    },
                ];

                const contract = new this._web3.eth.Contract(minABI as any, tokenAddress);
                const transferData = contract.methods.transfer(to, value).encodeABI();

                estimatedGas = await this._web3.eth.estimateGas({
                    to: tokenAddress,
                    from: senderAddress,
                    data: transferData,
                });
            } else {
                estimatedGas = await this._web3.eth.estimateGas({
                    to,
                    from: senderAddress,
                    value,
                    data,
                });
            }

            const gasPrice = await this._web3.eth.getGasPrice();
            const totalCost = this._web3.utils.toBigInt(estimatedGas) * this._web3.utils.toBigInt(gasPrice);

            return {
                estimatedGas: Number(estimatedGas),
                gasPrice: gasPrice.toString(),
                totalCost: totalCost.toString(),
                networkPrice: 0,
            };
        } catch (error) {
            console.error("Error calculating transaction cost:", error);

            const gasPrice = await this._web3.eth.getGasPrice();
            const defaultGas = 21000;
            const totalCost = this._web3.utils.toBigInt(defaultGas) * this._web3.utils.toBigInt(gasPrice);

            return {
                estimatedGas: defaultGas,
                gasPrice: gasPrice.toString(),
                totalCost: totalCost.toString(),
                networkPrice: 0,
            };
        }
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

            const amountInWei = this._web3.utils.toWei(amount, "ether");
            const costs = await this._getTransactionCost(receiverAddress, amountInWei, "0x", tokenAddress, senderAddress);

            const feeInBDAG = parseFloat(this._fromWei(costs.totalCost, 18));
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

            const account = this._web3.eth.accounts.privateKeyToAccount(params.privateKey);
            this._web3.eth.accounts.wallet.add(account);

            let txHash: string;

            if (params.tokenAddress) {
                // ERC20 token transfer
                const minABI = [
                    {
                        constant: false,
                        inputs: [
                            { name: "_to", type: "address" },
                            { name: "_value", type: "uint256" },
                        ],
                        name: "transfer",
                        outputs: [{ name: "", type: "bool" }],
                        type: "function",
                    },
                ];

                const contract = new this._web3.eth.Contract(minABI as any, params.tokenAddress);
                const decimals = params.tokenDecimals || 18;
                const amountInWei = this._web3.utils.toWei(params.value, decimals === 18 ? "ether" : "wei");

                const tx = await contract.methods.transfer(params.to, amountInWei).send({
                    from: account.address,
                    gas: "100000",
                });

                txHash = tx.transactionHash;
            } else {
                // Native BDAG transfer
                const amountInWei = this._web3.utils.toWei(params.value, "ether");
                const gasPrice = await this._web3.eth.getGasPrice();
                const nonce = await this._web3.eth.getTransactionCount(account.address);

                const signedTx = await this._web3.eth.accounts.signTransaction(
                    {
                        to: params.to,
                        value: amountInWei,
                        gas: "21000",
                        gasPrice: gasPrice.toString(),
                        nonce: nonce,
                    },
                    params.privateKey
                );

                const receipt = await this._web3.eth.sendSignedTransaction(signedTx.rawTransaction!);
                txHash = receipt.transactionHash.toString();
            }

            return {
                hash: txHash,
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
