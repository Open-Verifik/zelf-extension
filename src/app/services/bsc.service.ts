import { ethers } from "ethers";
import Web3 from "web3";
import { isAddress } from "web3-validator";

import { Injectable } from "@angular/core";

import { HttpWrapperService } from "app/http-wrapper.service";
import { RpcProviderService } from "app/services/rpc-provider.service";
import { environment } from "environments/environment";
import { TransactionFeeEstimate, TransactionParams, TransactionResult } from "../core/models/transaction-fee.model";

@Injectable({
    providedIn: "root",
})
export class BscService {
    private _baseUrl: string = environment.apiUrl;
    private readonly _web3Utils = new Web3().utils;
    private readonly _web3Promise: Promise<Web3>;

    private readonly _chainConfigs = {
        mainnet: {
            blockExplorerUrls: ["https://bscscan.com"],
            chainId: 56,
            chainName: "BNB Smart Chain",
            rpcUrls: [environment.binanceRpc.mainnet],
            nativeCurrency: {
                decimals: 18,
                name: "BNB",
                symbol: "BNB",
            },
        },
        // Testnet configuration can be added when needed
        // testnet: {
        //     blockExplorerUrls: ["https://testnet.bscscan.com"],
        //     chainId: 97,
        //     chainName: "BNB Smart Chain Testnet",
        //     rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
        //     nativeCurrency: {
        //         decimals: 18,
        //         name: "tBNB",
        //         symbol: "tBNB",
        //     },
        // },
    };

    constructor(
        private _httpWrapper: HttpWrapperService,
        private _rpcProvider: RpcProviderService
    ) {
        this._web3Promise = this._rpcProvider.getWeb3("bsc", { allowDirectFallback: false });
    }

    private async web3(): Promise<Web3> {
        return this._web3Promise;
    }

    private _defaultResponse(): any {
        return {
            data: {
                _balance: 0,
                balance: "0",
                fiatBalance: "0",
                account: {
                    asset: "BNB",
                    price: "0",
                },
                tokenHoldings: {
                    tokens: [],
                },
            },
        };
    }

    private _fromWei(amount: string, decimals: number = 18): string {
        return this._web3Utils.fromWei(amount, decimals === 18 ? "ether" : "wei");
    }

    private async _getTransactionCost(
        to: string,
        value: string,
        data: string = "0x",
        tokenAddress?: string,
        senderAddress?: string
    ): Promise<{
        estimatedGas: number;
        gasPrice: string;
        networkPrice: number;
        totalCost: string;
        fee?: number;
        fiatFee?: number;
        total?: number;
    }> {
        try {
            const w3 = await this.web3();
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

                const contract = new w3.eth.Contract(minABI, tokenAddress);
                const encodedData = contract.methods.transfer(to, value).encodeABI();

                // Use sender address if provided, otherwise fall back to zero address
                const fromAddress =
                    senderAddress && this.checkIfValidAddress(senderAddress) ? senderAddress : "0x0000000000000000000000000000000000000000";

                estimatedGas = await w3.eth.estimateGas({
                    from: fromAddress,
                    to: tokenAddress,
                    data: encodedData,
                    value: "0",
                });
            } else {
                // Use sender address if provided, otherwise fall back to zero address
                const fromAddress =
                    senderAddress && this.checkIfValidAddress(senderAddress) ? senderAddress : "0x0000000000000000000000000000000000000000";

                estimatedGas = await w3.eth.estimateGas({
                    from: fromAddress,
                    to,
                    value,
                    data,
                });
            }

            // Get current gas price (BSC is usually faster/cheaper than Ethereum)
            const gasPrice = await w3.eth.getGasPrice();

            // Add 5% buffer for gas price (BSC is typically more stable)
            const adjustedGasPrice = ((BigInt(gasPrice) * BigInt(105)) / BigInt(100)).toString();

            const totalCost = (BigInt(adjustedGasPrice) * BigInt(estimatedGas)).toString();
            const nativeFee = Number(this._web3Utils.fromWei(totalCost, "ether"));
            const price = await this.getBNBPrice();

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
            console.error("Error in BSC getTransactionCost:", error);

            throw error;
        }
    }

    private _toWei(amount: string, decimals: number = 18): string {
        return this._web3Utils.toWei(amount, decimals === 18 ? "ether" : "wei");
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
            let transactionCost;

            const isBEP20 = tokenType === "BEP-20" || tokenType === "ERC-20"; // BEP20 is compatible with ERC20

            if (isBEP20 && tokenAddress) {
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
            console.error("Error calculating BSC transaction fees:", error);

            throw error;
        }
    }

    checkIfValidAddress(address: string): boolean {
        return !!address && isAddress(address);
    }

    async getBNBPrice(): Promise<number> {
        try {
            const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd");

            const data = await response.json();

            return data["binancecoin"]?.usd || 0;
        } catch (error) {
            console.error("Error fetching BNB price:", error);

            return 0;
        }
    }

    async getWalletDetails(address?: string): Promise<any> {
        const url = `${this._baseUrl}/api/bsc/address/${address}`;

        try {
            return this._httpWrapper
                .sendRequest("get", url)
                .then((response) => response)
                .catch(() => this._defaultResponse());
        } catch (error) {
            console.error("Exception in BSC getWalletDetails:", error);

            return Promise.resolve(this._defaultResponse());
        }
    }

    async requestTransactionDetails(transactionHash: string): Promise<{ data: any }> {
        return this._httpWrapper.sendRequest("get", `${this._baseUrl}/api/bsc/transaction/${transactionHash}`);
    }

    async requestTransactionHistory(address: string, pagination: { page: number; show?: number }): Promise<any> {
        const url = `${this._baseUrl}/api/bsc/address/${address}/transactions`;

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
            console.error("Exception in BSC requestTransactionHistory:", error);

            return Promise.resolve({ data: [] });
        }
    }

    async sendTransaction(params: TransactionParams): Promise<TransactionResult> {
        try {
            if (!params.privateKey) throw new Error("Private key is required for BSC transactions");

            const provider = await this._rpcProvider.getEthersProvider("bsc", { allowDirectFallback: false });
            const wallet = new ethers.Wallet(params.privateKey, provider);

            let txResponse;
            const isBEP20 = !!params.tokenAddress;

            if (isBEP20) {
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
            console.error("Error sending BSC transaction:", error);

            throw error;
        }
    }
}
