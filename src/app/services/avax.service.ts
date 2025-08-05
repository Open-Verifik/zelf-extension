import Web3 from "web3";
import { isAddress } from "web3-validator";

import { Injectable } from "@angular/core";

import { environment } from "environments/environment";
import { TransactionFeeEstimate, TransactionParams, TransactionResult } from "../core/models/transaction-fee.model";
import { HttpWrapperService } from "../http-wrapper.service";

@Injectable({
    providedIn: "root",
})
export class AvaxService {
    private _baseUrl: string = environment.apiUrl;

    private _chainConfigs = {
        mainnet: {
            blockExplorerUrls: ["https://snowtrace.io"],
            chainId: 43114,
            chainName: "Avalanche C-Chain",
            rpcUrls: [environment.avalancheRpc.mainnet],
            nativeCurrency: {
                decimals: 18,
                name: "AVAX",
                symbol: "AVAX",
            },
        },
        // Testnet configuration can be added when needed
        // testnet: {
        //     blockExplorerUrls: ["https://testnet.snowtrace.io"],
        //     chainId: 43113,
        //     chainName: "Avalanche Fuji Testnet",
        //     rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
        //     nativeCurrency: {
        //         decimals: 18,
        //         name: "AVAX",
        //         symbol: "AVAX",
        //     },
        // },
    };

    constructor(private _httpWrapper: HttpWrapperService) {}

    private _defaultResponse(): any {
        return {
            data: {
                _balance: 0,
                balance: "0",
                fiatBalance: "0",
                account: {
                    asset: "AVAX",
                    price: "0",
                },
                tokenHoldings: {
                    tokens: [],
                },
            },
        };
    }

    private _fromWei(amount: string, decimals: number = 18): string {
        const web3 = new Web3();

        if (decimals === 18) return web3.utils.fromWei(amount, "ether");

        const factor = Math.pow(10, decimals);

        return (parseFloat(amount) / factor).toString();
    }

    private async _getTransactionCost(toAddress: string, value: string, data: string): Promise<any> {
        const web3 = new Web3(new Web3.providers.HttpProvider(environment.avalancheRpc.mainnet));

        const estimatedGas = await web3.eth.estimateGas({
            from: "0x0000000000000000000000000000000000000000",
            to: toAddress,
            value: value,
            data: data,
        });

        const gasPriceRaw = await web3.eth.getGasPrice();
        const gasPrice = ((BigInt(gasPriceRaw) * BigInt(110)) / BigInt(100)).toString();

        return {
            estimatedGas: Number(estimatedGas),
            gasPrice: gasPrice,
        };
    }

    private async _sendERC20Transaction(amount: string, privateKey: string, toAddress: string, tokenAddress: string): Promise<any> {
        let signedTx: any;

        try {
            const web3 = new Web3(new Web3.providers.HttpProvider(environment.avalancheRpc.mainnet));
            const account = web3.eth.accounts.privateKeyToAccount(privateKey);

            web3.eth.transactionConfirmationBlocks = 1;
            web3.eth.transactionPollingInterval = 2000;
            web3.eth.transactionReceiptPollingInterval = 2000;
            web3.eth.transactionPollingTimeout = 30000;

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
                {
                    constant: true,
                    inputs: [],
                    name: "decimals",
                    outputs: [{ name: "", type: "uint8" }],
                    type: "function",
                },
            ];

            const contract = new web3.eth.Contract(minABI, tokenAddress);
            const decimals = Number(await contract.methods.decimals().call());
            const amountInWei = this._toWei(amount, decimals);

            const transferData = contract.methods.transfer(toAddress, amountInWei).encodeABI();

            const [nonce, gasPrice] = await Promise.all([web3.eth.getTransactionCount(account.address, "latest"), web3.eth.getGasPrice()]);

            const gasEstimate = await web3.eth.estimateGas({
                from: account.address,
                to: tokenAddress,
                data: transferData,
            });

            const tx = {
                from: account.address,
                to: tokenAddress,
                data: transferData,
                nonce: nonce,
                gasPrice: gasPrice,
                gas: gasEstimate,
            };

            signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

            const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

            return receipt;
        } catch (error) {
            if (signedTx) return signedTx;

            console.error("Error sending ERC20 token on Avalanche:", error);

            throw error;
        }
    }

    private async _sendNativeTransaction(amount: string, privateKey: string, toAddress: string): Promise<any> {
        try {
            const web3 = new Web3(new Web3.providers.HttpProvider(environment.avalancheRpc.mainnet));
            const account = web3.eth.accounts.privateKeyToAccount(privateKey);
            const amountInWei = web3.utils.toWei(amount, "ether");

            const nonce = await web3.eth.getTransactionCount(account.address, "latest");
            const transactionCost = await this._getTransactionCost(toAddress, amountInWei, "0x");

            const tx = {
                from: account.address,
                to: toAddress,
                value: amountInWei,
                nonce: nonce,
                gasPrice: transactionCost.gasPrice,
                gas: transactionCost.estimatedGas,
                chainId: this._chainConfigs.mainnet.chainId,
            };

            const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

            try {
                return await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            } catch (txError) {
                console.error("Detailed transaction error for Avalanche:", {
                    error: txError,
                    tx: {
                        ...tx,
                        value: web3.utils.fromWei(tx.value, "ether"),
                        gasPrice: web3.utils.fromWei(tx.gasPrice, "gwei") + " gwei",
                    },
                });

                return signedTx;
            }
        } catch (error) {
            console.error("Error in Avalanche transaction preparation:", error);

            throw error;
        }
    }

    private _toWei(amount: string, decimals: number = 18): string {
        const web3 = new Web3();

        if (decimals === 18) return web3.utils.toWei(amount, "ether");

        const factor = Math.pow(10, decimals);
        const amountInSmallestUnit = Math.floor(parseFloat(amount) * factor);

        return amountInSmallestUnit.toString();
    }

    async calculateTransactionFees(
        receiverAddress: string,
        amount: number,
        tokenAddress?: string,
        tokenDecimals?: number,
        senderAddress?: string
    ): Promise<TransactionFeeEstimate> {
        try {
            if (!receiverAddress || !this.checkIfValidAddress(receiverAddress)) {
                throw new Error("Invalid address");
            }

            const web3 = new Web3(new Web3.providers.HttpProvider(environment.avalancheRpc.mainnet));
            const value = this._toWei(amount.toString(), tokenDecimals || 18);

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

                const contract = new web3.eth.Contract(minABI, tokenAddress);
                const data = contract.methods.transfer(receiverAddress, value).encodeABI();

                // Use sender address if provided, otherwise fall back to zero address
                const fromAddress =
                    senderAddress && this.checkIfValidAddress(senderAddress) ? senderAddress : "0x0000000000000000000000000000000000000000";

                estimatedGas = await web3.eth.estimateGas({
                    from: fromAddress,
                    to: tokenAddress,
                    data,
                    value: "0",
                });

                estimatedGas = Math.floor(Number(estimatedGas) * 1.2); // 20% buffer
            } else {
                // Use sender address if provided, otherwise fall back to zero address
                const fromAddress =
                    senderAddress && this.checkIfValidAddress(senderAddress) ? senderAddress : "0x0000000000000000000000000000000000000000";

                estimatedGas = await web3.eth.estimateGas({
                    from: fromAddress,
                    to: receiverAddress,
                    value,
                });
            }

            const gasPriceRaw = await web3.eth.getGasPrice();
            const gasPrice = ((BigInt(gasPriceRaw) * BigInt(110)) / BigInt(100)).toString();

            const totalCost = (BigInt(gasPrice) * BigInt(estimatedGas)).toString();
            const nativeFee = Number(web3.utils.fromWei(totalCost, "ether"));
            const avaxPrice = await this.getAVAXPrice();

            return {
                fee: nativeFee,
                fiatFee: nativeFee * avaxPrice,
                total: amount + nativeFee,
                networkPrice: avaxPrice,
            };
        } catch (error) {
            console.error("Error calculating Avalanche transaction fees:", error);

            throw error;
        }
    }

    checkIfValidAddress(address: string): boolean {
        return isAddress(address);
    }

    async getAVAXPrice(): Promise<number> {
        try {
            try {
                const response = await this._httpWrapper.sendRequest(
                    "get",
                    "https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd"
                );

                if (response && response["avalanche-2"] && response["avalanche-2"].usd) {
                    return response["avalanche-2"].usd;
                }
            } catch (error) {
                console.warn("CoinGecko API failed:", error);
            }

            return 0;
        } catch (error) {
            console.error("Error getting AVAX price:", error);

            return 0;
        }
    }

    async getWalletDetails(address: string): Promise<any> {
        try {
            const url = `${this._baseUrl}/api/avalanche/address/${address}`;

            return await this._httpWrapper
                .sendRequest("get", url, {})
                .then((response) => response)
                .catch(() => this._defaultResponse());
        } catch (error) {
            console.error("Exception in Avalanche getWalletDetails:", error);

            return Promise.resolve(this._defaultResponse());
        }
    }

    async requestTransactionDetails(transactionHash: string): Promise<any> {
        return this._httpWrapper.sendRequest("get", `${this._baseUrl}/api/avalanche/transaction/${transactionHash}`);
    }

    async requestTransactionHistory(address: string, pagination: { page: number; show?: number }): Promise<any> {
        try {
            const url = `${this._baseUrl}/api/avalanche/address/${address}/transactions`;

            const params = {
                page: pagination.page,
                show: pagination.show || 25,
            };

            return await this._httpWrapper
                .sendRequest("get", url, params)
                .then((response) => response)
                .catch(() => ({ data: [] }));
        } catch (error) {
            console.error("Exception in Avalanche requestTransactionHistory:", error);

            return Promise.resolve({ data: [] });
        }
    }

    async sendTransaction(params: TransactionParams): Promise<TransactionResult> {
        if (!params.privateKey) throw new Error("Private key is required for Avalanche transactions");

        let result: any;

        if (params.tokenAddress) {
            result = await this._sendERC20Transaction(params.value, params.privateKey, params.to, params.tokenAddress);
        } else {
            result = await this._sendNativeTransaction(params.value, params.privateKey, params.to);
        }

        return {
            hash: result.transactionHash || result.hash,
            status: "pending",
        };
    }
}
