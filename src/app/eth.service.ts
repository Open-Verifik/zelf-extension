import { ethers } from "ethers";
import { BehaviorSubject, Observable } from "rxjs";
import Web3 from "web3";
import { isAddress } from "web3-validator";

import { Injectable } from "@angular/core";

import { environment } from "environments/environment";

import { TransactionFeeEstimate, TransactionParams, TransactionResult } from "./core/models/transaction-fee.model";
import { HttpWrapperService } from "./http-wrapper.service";
import { EthTransaction } from "./wallet";

export interface ChainConfig {
    blockExplorerUrls: string[];
    chainId: number;
    chainName: string;
    rpcUrls: string[];
    nativeCurrency: {
        decimals: number;
        name: string;
        symbol: string;
    };
}

@Injectable({
    providedIn: "root",
})
export class EthereumService {
    private _account: BehaviorSubject<string> = new BehaviorSubject("");
    private _baseUrl: string = environment.apiUrl;
    private _tokens: Array<any> = [];
    private _web3: Web3;

    private _chainConfigs = {
        mainnet: {
            blockExplorerUrls: ["https://etherscan.io"],
            chainId: 1,
            chainName: "Ethereum Mainnet",
            rpcUrls: [environment.ethereumRpc.mainnet],
            nativeCurrency: {
                decimals: 18,
                name: "Ether",
                symbol: "ETH",
            },
        },
        testnet: {
            blockExplorerUrls: ["https://sepolia.etherscan.io"],
            chainId: 11155111,
            chainName: "Sepolia Testnet",
            rpcUrls: [environment.ethereumRpc.testnet],
            nativeCurrency: {
                decimals: 18,
                name: "Sepolia Ether",
                symbol: "SepoliaETH",
            },
        },
    };

    constructor(private _httpWrapper: HttpWrapperService) {
        this._web3 = new Web3(new Web3.providers.HttpProvider(this._chainConfigs.mainnet.rpcUrls[0]));
    }

    private _defaultEthResponse(): any {
        return {
            data: {
                _balance: 0,
                balance: "0",
                fiatBalance: "0",
                account: {
                    asset: "ETH",
                    price: "0",
                },
                tokenHoldings: {
                    tokens: [],
                },
            },
        };
    }

    private _fromWei(amount: string, decimals: number = 18): string {
        if (decimals === 18) return this._web3.utils.fromWei(amount, "ether");

        return ethers.formatUnits(amount, decimals);
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
            if (!to || !this.checkIfValidAddress(to)) throw new Error("Invalid address");

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
                const data = contract.methods.transfer(to, value).encodeABI();

                const fromAddress =
                    senderAddress && this.checkIfValidAddress(senderAddress) ? senderAddress : "0x0000000000000000000000000000000000000000";

                try {
                    estimatedGas = await this._web3.eth.estimateGas({
                        from: fromAddress,
                        to: tokenAddress,
                        data,
                        value: "0",
                    });

                    estimatedGas = Math.floor(Number(estimatedGas) * 1.2); // 20% buffer
                } catch (gasError) {
                    console.warn("Gas estimation failed, using fallback:", gasError);

                    estimatedGas = 65000;
                }
            } else {
                const fromAddress =
                    senderAddress && this.checkIfValidAddress(senderAddress) ? senderAddress : "0x0000000000000000000000000000000000000000";

                try {
                    estimatedGas = await this._web3.eth.estimateGas({
                        from: fromAddress,
                        to,
                        value,
                        data,
                    });
                } catch (gasError) {
                    console.warn("Gas estimation failed, using fallback:", gasError);

                    estimatedGas = 21000;
                }
            }

            const gasTracker = await this.getGasPrices();
            const gasPrice = this._web3.utils.toWei(gasTracker.data.average.gwei, "gwei");

            const totalCost = (BigInt(gasPrice) * BigInt(estimatedGas)).toString();
            const nativeFee = Number(this._web3.utils.fromWei(totalCost, "ether"));
            const price = await this.getETHPrice();

            return {
                estimatedGas: Number(estimatedGas),
                fee: nativeFee,
                fiatFee: nativeFee * price,
                gasPrice: gasPrice.toString(),
                networkPrice: price,
                total: nativeFee * price,
                totalCost,
            };
        } catch (error) {
            console.error("Error in getTransactionCost:", error);

            throw error;
        }
    }

    private async _sendERC20Transaction(amount: string, privateKey: string, toAddress: string, tokenAddress: string): Promise<any> {
        let signedTx: any;

        try {
            const account = this._web3.eth.accounts.privateKeyToAccount(privateKey);

            this._web3.eth.transactionConfirmationBlocks = 1;
            this._web3.eth.transactionPollingInterval = 2000;
            this._web3.eth.transactionReceiptPollingInterval = 2000;
            this._web3.eth.transactionPollingTimeout = 30000;

            // ERC20 Token Contract ABI (minimal required for transfer)
            const minABI = [
                {
                    constant: false,
                    inputs: [
                        {
                            name: "_to",
                            type: "address",
                        },
                        {
                            name: "_value",
                            type: "uint256",
                        },
                    ],
                    name: "transfer",
                    outputs: [
                        {
                            name: "",
                            type: "bool",
                        },
                    ],
                    type: "function",
                },
                {
                    constant: true,
                    inputs: [],
                    name: "decimals",
                    outputs: [
                        {
                            name: "",
                            type: "uint8",
                        },
                    ],
                    type: "function",
                },
            ];

            const contract = new this._web3.eth.Contract(minABI, tokenAddress);

            const decimals = Number(await contract.methods.decimals().call());
            const amountInWei = this._toWei(amount, decimals);

            const transferData = contract.methods.transfer(toAddress, amountInWei).encodeABI();

            const [nonce, gasPrice] = await Promise.all([
                this._web3.eth.getTransactionCount(account.address, "latest"),
                this._web3.eth.getGasPrice(),
            ]);

            const gasEstimate = await this._web3.eth.estimateGas({
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

            signedTx = await this._web3.eth.accounts.signTransaction(tx, privateKey);

            const receipt = await this._web3.eth.sendSignedTransaction(signedTx.rawTransaction);

            return receipt;
        } catch (error) {
            if (signedTx) return signedTx;

            console.error("Error sending ERC20 token on Ethereum:", error);

            throw error;
        }
    }

    async _sendNativeTransaction(amount: string, privateKey: string, toAddress: string): Promise<any> {
        try {
            const account = this._web3.eth.accounts.privateKeyToAccount(privateKey);
            const amountInWei = this._web3.utils.toWei(amount, "ether");

            const nonce = await this._web3.eth.getTransactionCount(account.address, "latest");

            const transactionCost = await this._getTransactionCost(toAddress, amountInWei, "0x");

            const tx = {
                chainId: this._chainConfigs.mainnet.chainId,
                from: account.address,
                gas: transactionCost.estimatedGas,
                gasPrice: transactionCost.gasPrice,
                nonce: nonce,
                to: toAddress,
                value: amountInWei,
            };

            const signedTx = await this._web3.eth.accounts.signTransaction(tx, privateKey);

            try {
                return await this._web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            } catch (txError) {
                console.error("Detailed transaction error for Ethereum:", {
                    error: txError,
                    tx: {
                        ...tx,
                        value: this._web3.utils.fromWei(tx.value, "ether"),
                        gasPrice: this._web3.utils.fromWei(tx.gasPrice, "gwei") + " gwei",
                    },
                });

                return signedTx;
            }
        } catch (error) {
            console.error("Error in transaction preparation for Ethereum:", error);

            throw error;
        }
    }

    private _toWei(amount: string, decimals: number = 18): string {
        if (decimals === 18) return this._web3.utils.toWei(amount, "ether");

        return ethers.parseUnits(amount, decimals).toString();
    }

    checkIfValidAddress(address: string): boolean {
        return !!address && isAddress(address);
    }

    async getBalance(): Promise<string> {
        const balance = await this._web3.eth.getBalance(this._account.value);

        return this._web3.utils.fromWei(balance, "ether");
    }

    async getGasPrices(): Promise<any> {
        return this._httpWrapper.sendRequest("get", `${this._baseUrl}/api/ethereum/gas-tracker`);
    }

    getTokens(): Observable<Array<any>> {
        return new Observable((observer) => observer.next(this._tokens));
    }

    async calculateTransactionFees(
        receiverAddress: string,
        amount: number,
        tokenType: string,
        tokenAddress: string | undefined,
        tokenDecimals: number | undefined,
        senderAddress?: string
    ): Promise<TransactionFeeEstimate> {
        const isNonNative = tokenType === "ERC-20" || tokenType === "BEP-20";

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
    }

    async getETHPrice(): Promise<number> {
        try {
            try {
                const response = await this._httpWrapper.sendRequest(
                    "get",
                    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
                    {
                        headers: {
                            Accept: "application/json",
                            "Cache-Control": "no-cache",
                        },
                    }
                );

                if (response?.ethereum?.usd) return response.ethereum.usd;
            } catch (coinGeckoError) {
                console.warn("CoinGecko API failed, trying backup source:", coinGeckoError);
            }

            try {
                const response = await this._httpWrapper.sendRequest("get", "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT");

                if (response?.price) return parseFloat(response.price);
            } catch (binanceError) {
                console.warn("Binance API failed:", binanceError);
            }

            console.warn("All price APIs failed, using fallback price");

            return 2000;
        } catch (error) {
            console.error("Error getting ETH price:", error);

            return 2000;
        }
    }

    async getWalletDetails(address: string): Promise<any> {
        try {
            const url = `${this._baseUrl}/api/ethereum/address`;
            const requestOptions = { address };

            return await this._httpWrapper
                .sendRequest("get", url, requestOptions)
                .then((response) => response)
                .catch(() => this._defaultEthResponse());
        } catch (error) {
            console.error("Exception in Ethereum getWalletDetails:", error);

            return Promise.resolve(this._defaultEthResponse());
        }
    }

    async requestTransactionDetails(transactionHash: string): Promise<{ data: EthTransaction }> {
        return this._httpWrapper.sendRequest("get", `${this._baseUrl}/api/ethereum/transaction/${transactionHash}`);
    }

    async requestTransactionHistory(address: string, pagination: { page: number; show?: number }): Promise<any> {
        try {
            const url = `${this._baseUrl}/api/ethereum/transactions`;

            const params = {
                page: pagination.page,
                show: pagination.show || 25,
                address: address,
            };

            return await this._httpWrapper
                .sendRequest("get", url, params)
                .then((response) => response)
                .catch(() => ({ data: [] }));
        } catch (error) {
            console.error("Exception in Ethereum requestTransactionHistory:", error);

            return Promise.resolve({ data: [] });
        }
    }

    async sendTransaction(params: TransactionParams): Promise<TransactionResult> {
        if (!params.privateKey) throw new Error("Private key is required for Ethereum transactions");

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
