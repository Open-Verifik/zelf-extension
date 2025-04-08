import * as bip39 from "bip39";
import { HDNodeWallet, ethers, parseEther } from "ethers";
import { BehaviorSubject, Observable } from "rxjs";
import Web3 from "web3";
import { isAddress } from "web3-validator";

import { Core } from "@quicknode/sdk";
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
            rpcUrls: [environment.ethereumRpc.testnet],
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
        this.web3 = new Web3(new Web3.providers.HttpProvider(environment.ethereumRpc.mainnet));
    }

    changeNetwork(): void {
        const url = environment.ethereumRpc.mainnet;
        this.web3 = new Web3(new Web3.providers.HttpProvider(url));
    }

    createAccount(): any {
        const account = this.web3.eth.accounts.create();

        this.account.next(account.address);

        return account;
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
            let chainId;

            switch (network.toLowerCase()) {
                case "avalanche":
                    rpcUrl = environment.avalancheRpc.mainnet;
                    chainId = 43114;
                    break;
                case "ethereum":
                default:
                    rpcUrl = environment.ethereumRpc.mainnet;
                    chainId = 1;
                    break;
            }

            const provider = new ethers.JsonRpcProvider(rpcUrl);
            const wallet = new ethers.Wallet(privateKey, provider);
            const amountInEth = ethers.parseEther(amount);

            const gasEstimate = await provider.estimateGas({
                from: wallet.address,
                to: toAddress,
                value: amountInEth,
            });

            const gasLimit = gasEstimate + gasEstimate / BigInt(5);

            const tx = await wallet.sendTransaction({
                to: toAddress,
                value: amountInEth,
                gasLimit: gasLimit,
                chainId: chainId,
            });

            const receipt = await tx.wait();
            return receipt;
        } catch (error) {
            console.error(`Error sending native token on ${network}:`, error);
            throw error;
        }
    }

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

        return ethers.parseUnits(amount, decimals).toString();
    }

    public fromWei(amount: string, decimals: number = 18): string {
        if (decimals === 18) {
            return this.web3.utils.fromWei(amount, "ether");
        }

        return ethers.formatUnits(amount, decimals);
    }

    async getTransactionCost(
        to: string,
        value: string,
        data: string = "0x"
    ): Promise<{
        estimatedGas: number;
        gasPrice: string;
        totalCost: string;
    }> {
        try {
            if (!to || !this.checkIfValidAddress(to)) {
                throw new Error("Invalid address");
            }
            const formattedAddress = to.toLowerCase();

            const from = this.account.value || "0x0000000000000000000000000000000000000000";

            const [gasPrice, estimatedGas] = await Promise.all([
                this.web3.eth.getGasPrice(),
                this.web3.eth.estimateGas({
                    from,
                    to: formattedAddress,
                    value,
                    data,
                }),
            ]);

            return {
                estimatedGas: Number(estimatedGas),
                gasPrice: gasPrice.toString(),
                totalCost: (BigInt(gasPrice) * BigInt(estimatedGas)).toString(),
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
        let baseUrl = this.baseUrl;
        let endpoint = "";

        switch (network.toLowerCase()) {
            case "avalanche":
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
            let chainId;

            switch (network.toLowerCase()) {
                case "avalanche":
                    rpcUrl = environment.avalancheRpc.mainnet;
                    chainId = 43114; // C-Chain
                    break;
                case "ethereum":
                    rpcUrl = environment.ethereumRpc.mainnet;
                    chainId = 1; // Mainnet
                    break;
                default:
                    throw new Error(`Unsupported network: ${network}`);
            }

            const provider = new ethers.JsonRpcProvider(rpcUrl);
            const wallet = new ethers.Wallet(privateKey, provider);

            const nativeBalance = await provider.getBalance(wallet.address);
            const minGasBalance = ethers.parseEther("0.01");

            if (nativeBalance < minGasBalance) {
                throw new Error(`Insufficient ${network === "avalanche" ? "AVAX" : "ETH"} for gas fees`);
            }

            const tokenAbi = [
                "function symbol() view returns (string)",
                "function decimals() view returns (uint8)",
                "function balanceOf(address) view returns (uint256)",
                "function transfer(address to, uint amount) returns (bool)",
            ];

            const contract = new ethers.Contract(tokenAddress, tokenAbi, wallet);

            const [symbol, decimals, tokenBalance] = await Promise.all([contract.symbol(), contract.decimals(), contract.balanceOf(wallet.address)]);

            const parsedAmount = ethers.parseUnits(amount, decimals);

            if (tokenBalance < parsedAmount) {
                throw new Error(`Insufficient ${symbol} balance`);
            }

            const gasEstimate = await contract.transfer.estimateGas(toAddress, parsedAmount);
            const adjustedGas = gasEstimate + gasEstimate / BigInt(5); // 20% extra

            const tx = await contract.transfer(toAddress, parsedAmount, {
                gasLimit: adjustedGas,
            });

            const receipt = await tx.wait();

            return {
                ...receipt,
                transactionHash: receipt.hash,
            };
        } catch (error) {
            console.error(`Transaction error: ${error instanceof Error ? error.message : "Unknown error"}`);
            throw error;
        }
    }
}
