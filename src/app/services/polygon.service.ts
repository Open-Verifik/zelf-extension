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
export class PolygonService {
    private _baseUrl: string = environment.apiUrl;
    private _web3: Web3;

    private readonly _chainConfigs = {
        mainnet: {
            blockExplorerUrls: ["https://polygonscan.com"],
            chainId: 137,
            chainName: "Polygon Mainnet",
            rpcUrls: [environment.polygonRpc.mainnet],
            nativeCurrency: {
                decimals: 18,
                name: "MATIC",
                symbol: "MATIC",
            },
        },
        // Testnet configuration can be added when needed
        // testnet: {
        //     blockExplorerUrls: ["https://mumbai.polygonscan.com"],
        //     chainId: 80001,
        //     chainName: "Polygon Mumbai Testnet",
        //     rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
        //     nativeCurrency: {
        //         decimals: 18,
        //         name: "MATIC",
        //         symbol: "MATIC",
        //     },
        // },
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
                    asset: "MATIC",
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

                const contract = new this._web3.eth.Contract(minABI, tokenAddress);
                const encodedData = contract.methods.transfer(to, value).encodeABI();

                // Use sender address if provided, otherwise fall back to zero address
                const fromAddress =
                    senderAddress && this.checkIfValidAddress(senderAddress) ? senderAddress : "0x0000000000000000000000000000000000000000";

                estimatedGas = await this._web3.eth.estimateGas({
                    from: fromAddress,
                    to: tokenAddress,
                    data: encodedData,
                    value: "0",
                });
            } else {
                // Use sender address if provided, otherwise fall back to zero address
                const fromAddress =
                    senderAddress && this.checkIfValidAddress(senderAddress) ? senderAddress : "0x0000000000000000000000000000000000000000";

                estimatedGas = await this._web3.eth.estimateGas({
                    from: fromAddress,
                    to,
                    value,
                    data,
                });
            }

            // Get current gas price (Polygon uses faster gas)
            const gasPrice = await this._web3.eth.getGasPrice();

            // Add 10% buffer for gas price
            const adjustedGasPrice = ((BigInt(gasPrice) * BigInt(110)) / BigInt(100)).toString();

            const totalCost = (BigInt(adjustedGasPrice) * BigInt(estimatedGas)).toString();
            const nativeFee = Number(this._web3.utils.fromWei(totalCost, "ether"));
            const price = await this.getMATICPrice();

            return {
                estimatedGas: Number(estimatedGas),
                fee: nativeFee,
                fiatFee: nativeFee * price,
                gasPrice: adjustedGasPrice,
                networkPrice: price,
                total: nativeFee * price,
                totalCost,
            };
        } catch (error) {
            console.error("Error in Polygon getTransactionCost:", error);

            throw error;
        }
    }

    private _toWei(amount: string, decimals: number = 18): string {
        return this._web3.utils.toWei(amount, decimals === 18 ? "ether" : "wei");
    }

    async calculateTransactionFees(
        receiverAddress: string,
        amount: number,
        tokenType: string,
        tokenAddress: string | undefined,
        tokenDecimals: number | undefined,
        senderAddress?: string
    ): Promise<TransactionFeeEstimate> {
        try {
            const isNonNative = tokenType === "ERC-20";

            let transactionCost;

            if (isNonNative && tokenAddress) {
                transactionCost = await this._getTransactionCost(
                    receiverAddress,
                    this._toWei(String(amount), tokenDecimals || 18),
                    "0x",
                    tokenAddress,
                    senderAddress
                );
            } else {
                transactionCost = await this._getTransactionCost(receiverAddress, this._toWei(String(amount)), "0x", undefined, senderAddress);
            }

            return {
                fee: transactionCost.fee || 0,
                fiatFee: transactionCost.fiatFee || 0,
                total: transactionCost.total || 0,
                networkPrice: transactionCost.networkPrice || 0,
            };
        } catch (error) {
            console.error("Error calculating Polygon transaction fees:", error);

            throw error;
        }
    }

    checkIfValidAddress(address: string): boolean {
        return !!address && isAddress(address);
    }

    async getMATICPrice(): Promise<number> {
        try {
            const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd");

            const data = await response.json();

            return data["matic-network"]?.usd || 0;
        } catch (error) {
            console.error("Error fetching MATIC price:", error);

            return 0;
        }
    }

    async getWalletDetails(address?: string): Promise<any> {
        const url = `${this._baseUrl}/api/polygon/address/${address}`;

        try {
            return this._httpWrapper
                .sendRequest("get", url)
                .then((response) => response)
                .catch(() => this._defaultResponse());
        } catch (error) {
            console.error("Exception in Polygon getWalletDetails:", error);

            return Promise.resolve(this._defaultResponse());
        }
    }

    async requestTransactionDetails(transactionHash: string): Promise<{ data: any }> {
        return this._httpWrapper.sendRequest("get", `${this._baseUrl}/api/polygon/transaction/${transactionHash}`);
    }

    async requestTransactionHistory(address: string, pagination: { page: number; show?: number }): Promise<any> {
        const url = `${this._baseUrl}/api/polygon/address/${address}/transactions`;

        const params = {
            page: pagination.page,
            show: pagination.show || 25,
        };

        try {
            return this._httpWrapper
                .sendRequest("get", url, params)
                .then((response) => response)
                .catch(() => ({ data: [] }));
        } catch (error) {
            console.error("Exception in Polygon requestTransactionHistory:", error);

            return Promise.resolve({ data: [] });
        }
    }

    async sendTransaction(params: TransactionParams): Promise<TransactionResult> {
        try {
            if (!params.privateKey) throw new Error("Private key is required for Polygon transactions");

            const provider = new ethers.JsonRpcProvider(this._chainConfigs.mainnet.rpcUrls[0]);
            const wallet = new ethers.Wallet(params.privateKey, provider);

            const isNonNative = !!params.tokenAddress;

            let txResponse;

            if (isNonNative) {
                const tokenContract = new ethers.Contract(
                    params.tokenAddress!,
                    ["function transfer(address to, uint256 amount) returns (bool)", "function decimals() view returns (uint8)"],
                    wallet
                );

                const decimals = params.tokenDecimals || 18;
                const amount = ethers.parseUnits(params.value, decimals);

                txResponse = await tokenContract.transfer(params.to, amount);
            } else {
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
        } catch (error) {
            console.error("Error sending Polygon transaction:", error);
            throw error;
        }
    }
}
