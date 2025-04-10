import * as bip39 from "bip39";
import { HDNodeWallet, ethers, parseEther } from "ethers";
import { BehaviorSubject, Observable } from "rxjs";
import Web3 from "web3";
import { isAddress } from "web3-validator";

import { Core } from "@quicknode/sdk";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "environments/environment";

import { HttpWrapperService } from "./http-wrapper.service";
import { EthTransaction } from "./wallet";

const ethCore = new Core({
    endpointUrl: environment.ethereumRpc.mainnet,
});

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
    private account: BehaviorSubject<string> = new BehaviorSubject("");
    private web3: Web3;
    private chainConfigs = {
        sepolia: {
            chainId: 11155111,
            chainName: "Sepolia Testnet",
            nativeCurrency: {
                name: "Sepolia Ether",
                symbol: "SepoliaETH",
                decimals: 18,
            },
            rpcUrls: [environment.ethereumRpc.testnet],
            blockExplorerUrls: ["https://sepolia.etherscan.io"],
        },
        ethereum: {
            chainId: 1,
            chainName: "Ethereum Mainnet",
            nativeCurrency: {
                name: "Ether",
                symbol: "ETH",
                decimals: 18,
            },
            rpcUrls: [environment.ethereumRpc.mainnet],
            blockExplorerUrls: ["https://etherscan.io"],
        },
        polygon: {
            chainId: 137,
            chainName: "Polygon Mainnet",
            nativeCurrency: {
                name: "MATIC",
                symbol: "MATIC",
                decimals: 18,
            },
            rpcUrls: [environment.polygonRpc.mainnet],
            blockExplorerUrls: ["https://polygonscan.com"],
        },
        avalanche: {
            chainId: 43114,
            chainName: "Avalanche C-Chain",
            nativeCurrency: {
                name: "AVAX",
                symbol: "AVAX",
                decimals: 18,
            },
            rpcUrls: [environment.avalancheRpc.mainnet],
            blockExplorerUrls: ["https://snowtrace.io"],
        },
        binance: {
            chainId: 56,
            chainName: "BNB Smart Chain",
            nativeCurrency: {
                name: "BNB",
                symbol: "BNB",
                decimals: 18,
            },
            rpcUrls: [environment.binanceRpc.mainnet],
            blockExplorerUrls: ["https://bscscan.com"],
        },
    };

    baseUrl: String = environment.apiUrl;
    tokens: Array<any> = [];

    constructor(private http: HttpClient, private _httpWrapper: HttpWrapperService) {
        this.web3 = new Web3(new Web3.providers.HttpProvider("https://sepolia.infura.io/v3/0714254b0de84112a865096da1050ae5"));
    }

    changeNetwork(production?: boolean): void {
        const url = production
            ? "https://mainnet.infura.io/v3/0714254b0de84112a865096da1050ae5"
            : "https://sepolia.infura.io/v3/0714254b0de84112a865096da1050ae5";

        this.web3 = new Web3(new Web3.providers.HttpProvider(url));
    }

    createAccount(): any {
        const account = this.web3.eth.accounts.create();

        this.account.next(account.address);

        return account; // Be extremely cautious with how you handle the private key
    }

    validateMnemonic(mnemonic: string): boolean {
        return bip39.validateMnemonic(mnemonic);
    }

    generateAddressFromMnemonic(mnemonic: string): HDNodeWallet | null {
        try {
            const wallet = ethers.Wallet.fromPhrase(mnemonic);

            return wallet;
        } catch (exception) {
            return null;
        }
    }

    importAccount(privateKey: string): void {
        const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
        this.web3.eth.accounts.wallet.add(account);
        this.account.next(account.address);
    }

    getAccount(): BehaviorSubject<string> {
        return this.account;
    }

    async getBalance(): Promise<string> {
        const balance = await this.web3.eth.getBalance(this.account.value);
        return this.web3.utils.fromWei(balance, "ether");
    }

    async getBalanceByAddress(address: string): Promise<string> {
        try {
            const balanceWei = await this.web3.eth.getBalance(address);

            const balanceEth = this.web3.utils.fromWei(balanceWei, "ether");

            return balanceEth;
        } catch (error) {
            console.error("Error getting balance:", { error });

            throw error;
        }
    }

    checkIfValidAddress(address: string): boolean {
        return !!address && isAddress(address);
    }

    async sendTransaction(amount: string, privateKey: string, toAddress: string, network: string = "ethereum"): Promise<any> {
        try {
            let rpcUrl;
            let web3;
            let chainId;

            switch (network.toLowerCase()) {
                case "avalanche":
                    rpcUrl = environment.avalancheRpc.mainnet;
                    web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
                    chainId = 43114; // C-Chain
                    break;
                case "ethereum":
                default:
                    rpcUrl = environment.ethereumRpc.mainnet;
                    web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
                    chainId = 1;
                    break;
            }

            const account = web3.eth.accounts.privateKeyToAccount(privateKey);
            const amountInWei = web3.utils.toWei(amount, "ether");

            const nonce = await web3.eth.getTransactionCount(account.address, "latest");

            const transactionCost = await this.getTransactionCost(toAddress, amountInWei, "0x", network);

            const tx = {
                from: account.address,
                to: toAddress,
                value: amountInWei,
                nonce: nonce,
                gasPrice: transactionCost.gasPrice,
                gas: transactionCost.estimatedGas,
                chainId: chainId,
            };

            const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

            try {
                return await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            } catch (txError) {
                console.error(`Detailed transaction error for ${network}:`, {
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
            console.error(`Error in transaction preparation for ${network}:`, error);
            throw error;
        }
    }

    // async sendQuickNodeTransaction(amount: string, privateKey: string, toAddress: string, network: string = "ethereum"): Promise<any> {
    //     if (network !== "ethereum") throw new Error("Unsupported network");

    //     const account = privateKeyToAccount(privateKey as `0x${string}`);
    //     const walletClient = createWalletClient({
    //         chain: ethCore.client.chain,
    //         account,
    //         transport: http(environment.ethereumRpc.mainnet),
    //     });

    //     const results = await ethCore.client.multicall();

    //     const ethSendContract = {
    //         address: toAddress as `0x${string}`,
    //         functionName: "transfer",
    //         args: [toAddress as `0x${string}`, parseEther(amount)],
    //         account,
    //         abi: [
    //             {
    //                 inputs: [
    //                     {
    //                         internalType: "address",
    //                         name: "to",
    //                         type: "address",
    //                     },
    //                     {
    //                         internalType: "uint256",
    //                         name: "value",
    //                         type: "uint256",
    //                     },
    //                 ],
    //                 name: "sendTransaction",
    //                 outputs: [],
    //                 stateMutability: "nonpayable",
    //                 type: "function",
    //             },
    //         ],
    //     };

    //     const { request } = await ethCore.client.simulateContract(ethSendContract);

    //     await walletClient.writeContract(request);
    // }

    getGasPrices(): Promise<any> {
        return this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/ethereum/gas-tracker`);
    }

    async getWalletDetails(address?: string, network: string = "ethereum"): Promise<any> {
        if (network === "avalanche") {
            return this.getAvalancheWalletDetails(address);
        }
        return this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/ethereum/address`, {
            address,
        });
    }

    formatTokens(details: any, network: string = "ethereum"): void {
        if (network === "ethereum") {
            for (let index = 0; index < details.data.tokenHoldings.tokens.length; index++) {
                const token = details.data.tokenHoldings.tokens[index];
                if (["ERC-20", "ETH"].includes(token.tokenType) && token.price) {
                    this.tokens?.push({ ...token, network: "Ethereum" });
                }
            }
        } else if (network === "avalanche") {
            if (details.data?.tokenHoldings?.tokens) {
                details.data.tokenHoldings.tokens.forEach((token: any) => {
                    if (token.tokenType === "AVAX") {
                        this.tokens?.push({
                            ...token,
                            network: "Avalanche",
                            symbol: "AVAX",
                            tokenType: "AVAX",
                        });
                    }
                });
            }
        }
    }

    getTokens(): Observable<Array<any>> {
        return new Observable((observer) => {
            observer.next(this.tokens);
        });
    }

    clearTokens(): void {
        this.tokens = [];
    }

    // Switch network function (updated to include Sepolia)
    async switchNetwork(networkName: "sepolia"): Promise<boolean> {
        if (!window.ethereum) return false;

        const config = this.chainConfigs[networkName];

        try {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: `0x${config.chainId.toString(16)}` }],
            });
            return true;
        } catch (switchError: any) {
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [config],
                    });
                    return true;
                } catch (addError) {
                    console.error("Error adding chain:", addError);
                    return false;
                }
            }
            console.error("Error switching chain:", switchError);
            return false;
        }
    }

    public toWei(amount: string, decimals: number = 18): string {
        if (decimals === 18) {
            return this.web3.utils.toWei(amount, "ether");
        }
        // For non-standard decimals (ERC20 tokens)
        return ethers.parseUnits(amount, decimals).toString();
    }

    public fromWei(amount: string, decimals: number = 18): string {
        if (decimals === 18) {
            return this.web3.utils.fromWei(amount, "ether");
        }
        // For non-standard decimals (ERC20 tokens)
        return ethers.formatUnits(amount, decimals);
    }

    async getTransactionCost(
        to: string,
        value: string,
        data: string = "0x",
        network: string = "ethereum",
        tokenAddress?: string
    ): Promise<{
        estimatedGas: number;
        gasPrice: string;
        totalCost: string;
        fiatFee?: number;
        total?: number;
    }> {
        try {
            if (!to || !this.checkIfValidAddress(to)) {
                throw new Error("Invalid address");
            }

            const web3 =
                network.toLowerCase() === "avalanche" ? new Web3(new Web3.providers.HttpProvider(environment.avalancheRpc.mainnet)) : this.web3;

            let estimatedGas;

            if (tokenAddress) {
                // ABI mínimo para tokens ERC20
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
                const data = contract.methods.transfer(to, value).encodeABI();

                // Estimación de gas con un buffer del 20%
                estimatedGas = await web3.eth.estimateGas({
                    from: this.account.value || "0x0000000000000000000000000000000000000000",
                    to: tokenAddress,
                    data,
                    value: "0",
                });

                estimatedGas = Math.floor(Number(estimatedGas) * 1.2); // 20% buffer
            } else {
                estimatedGas = await web3.eth.estimateGas({
                    from: this.account.value || "0x0000000000000000000000000000000000000000",
                    to,
                    value,
                    data,
                });
            }

            let gasPrice;

            if (network.toLowerCase() === "ethereum") {
                const gasTracker = await this.getGasPrices();

                gasPrice = web3.utils.toWei(gasTracker.data.average.gwei, "gwei"); // Usar gas price alto para ERC20
            } else {
                gasPrice = await web3.eth.getGasPrice();

                // Para Avalanche, aumentar el gas price en un 10%
                gasPrice = ((BigInt(gasPrice) * BigInt(110)) / BigInt(100)).toString();
            }

            const totalCost = (BigInt(gasPrice) * BigInt(estimatedGas)).toString();
            const nativeFee = Number(web3.utils.fromWei(totalCost, "ether"));

            const price = network.toLowerCase() === "avalanche" ? await this.getAVAXPrice() : await this.getETHPrice();

            return {
                estimatedGas: Number(estimatedGas),
                gasPrice: gasPrice.toString(),
                totalCost,
                fiatFee: nativeFee,
                total: nativeFee * price,
            };
        } catch (error) {
            console.error("Error in getTransactionCost:", error);
            throw error;
        }
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

                if (response?.ethereum?.usd) {
                    return response.ethereum.usd;
                }
            } catch (coinGeckoError) {
                console.warn("CoinGecko API failed, trying backup source:", coinGeckoError);
            }

            try {
                const response = await this._httpWrapper.sendRequest("get", "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT");

                if (response?.price) {
                    return parseFloat(response.price);
                }
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

    async getAvalancheWalletDetails(address?: string): Promise<any> {
        try {
            const avalancheWeb3 = new Web3(new Web3.providers.HttpProvider(environment.avalancheRpc.mainnet));

            const [rawBalance, avaxPrice] = await Promise.all([avalancheWeb3.eth.getBalance(address || this.account.value), this.getAVAXPrice()]);

            const avaxBalance = Number(avalancheWeb3.utils.fromWei(rawBalance, "ether"));
            const fiatBalance = avaxBalance * avaxPrice;

            const details = {
                data: {
                    tokenHoldings: {
                        tokens: [
                            {
                                symbol: "AVAX",
                                tokenType: "AVAX",
                                balance: avaxBalance,
                                amount: avaxBalance.toString(),
                                price: avaxPrice,
                                fiatBalance: fiatBalance,
                                name: "Avalanche",
                                image: "assets/images/avax.png",
                                network: "Avalanche",
                                decimals: 18,
                            },
                        ],
                    },
                    account: {
                        balance: avaxBalance,
                        price: avaxPrice,
                        fiatBalance: fiatBalance,
                        asset: "AVAX",
                    },
                },
            };

            return details;
        } catch (error) {
            console.error("Error in getAvalancheWalletDetails:", error);
            throw error;
        }
    }

    async getAVAXPrice(): Promise<number> {
        try {
            // Intentar primero con CoinGecko
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

            // Fallback a otra API o valor por defecto
            return 0; // O podrías usar otro servicio de precios como fallback
        } catch (error) {
            console.error("Error getting AVAX price:", error);
            return 0;
        }
    }

    getAvailableNetworks() {
        return [
            {
                id: "ethereum",
                name: "Ethereum",
                symbol: "ETH",
                rpcUrl: environment.ethereumRpc.mainnet,
            },
            {
                id: "avalanche",
                name: "Avalanche",
                symbol: "AVAX",
                rpcUrl: environment.avalancheRpc.mainnet,
            },
        ];
    }

    requestTransactionFromRPC(transactionHash: string): Promise<any> {
        const rpcUrl = environment.ethereumRpc.mainnet;
        const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
        return web3.eth.getTransaction(transactionHash);
    }

    async requestTransactionDetails(transactionHash: string, network: string = "ethereum"): Promise<{ data: EthTransaction }> {
        // Determinar la URL base según la red
        let baseUrl = this.baseUrl;
        let endpoint = "";

        switch (network.toLowerCase()) {
            case "avalanche":
                // Usar el endpoint específico de Avalanche
                endpoint = `/api/avalanche/transaction/${transactionHash}`;
                break;
            case "ethereum":
            default:
                endpoint = `/api/ethereum/transaction/${transactionHash}`;
                break;
        }

        return this._httpWrapper.sendRequest("get", `${baseUrl}${endpoint}`);
    }

    async sendERC20Transaction(
        amount: string,
        privateKey: string,
        toAddress: string,
        tokenAddress: string,
        network: string = "ethereum"
    ): Promise<any> {
        try {
            let rpcUrl;

            switch (network.toLowerCase()) {
                case "avalanche":
                    rpcUrl = environment.avalancheRpc.mainnet;

                    break;
                case "ethereum":
                default:
                    rpcUrl = environment.ethereumRpc.mainnet;

                    break;
            }

            const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
            const account = web3.eth.accounts.privateKeyToAccount(privateKey);
            web3.eth.transactionConfirmationBlocks = 1;
            web3.eth.transactionPollingInterval = 2000;
            web3.eth.transactionReceiptPollingInterval = 2000;
            web3.eth.transactionPollingTimeout = 6000;
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

            const contract = new web3.eth.Contract(minABI, tokenAddress);

            const decimals = Number(await contract.methods.decimals().call());
            const amountInWei = this.toWei(amount, decimals);

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

            const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
            const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

            return receipt;
        } catch (error) {
            console.error(`Error sending ERC20 token on ${network}:`, error);
            throw error;
        }
    }
}
