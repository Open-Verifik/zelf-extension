import * as bip39 from "bip39";
import { HDNodeWallet, ethers } from "ethers";
import { BehaviorSubject, Observable } from "rxjs";
import Web3 from "web3";
import { isAddress } from "web3-validator";

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "environments/environment";

import { HttpWrapperService } from "./http-wrapper.service";

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
        return isAddress(address);
    }

    async sendTransaction(to: string, value: number): Promise<any> {
        const valueWei = this.web3.utils.toWei(value.toString(), "ether");
        const gasPrice = await this.web3.eth.getGasPrice();
        const gasEstimate = await this.web3.eth.estimateGas({
            from: this.account.value,
            to: to,
            value: valueWei,
        });

        // Convert using BigInt
        const valueWeiBN = BigInt(valueWei);
        const gasPriceBN = BigInt(gasPrice);
        const gasEstimateBN = BigInt(gasEstimate);

        // Perform arithmetic using BigInt
        const totalCost = gasEstimateBN * gasPriceBN + valueWeiBN;

        const balance = await this.web3.eth.getBalance(this.account.value);
        const balanceBN = BigInt(balance);

        if (balanceBN < totalCost) {
            throw new Error("Insufficient funds: Balance is too low for this transaction.");
        }

        const tx = {
            from: this.account.value,
            to: to,
            value: valueWei,
            gas: Number(gasEstimate), // BigInt to number for gas, ensure it's safe to convert
            gasPrice: gasPrice,
        };

        return await this.web3.eth.sendTransaction(tx);
    }

    getGasPrices(): Promise<any> {
        return this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/ethereum/gas-tracker`);
    }

    getWalletDetails(address?: string): Promise<any> {
        return this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/ethereum/address`, {
            address,
        });
    }

    formatTokens(details: any): void {
        for (let index = 0; index < details.data.tokenHoldings.tokens.length; index++) {
            const token = details.data.tokenHoldings.tokens[index];

            if (["ERC-20", "ETH"].includes(token.tokenType) && token.price) {
                this.tokens?.push({ ...token, network: "Ethereum" });
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

    async sendTestTransaction(amount: string = "0.01", privateKey: string, toAddress: string): Promise<any> {
        try {
            await this.switchNetwork("sepolia");
            const web3 = new Web3(this.web3.currentProvider);
            const account = web3.eth.accounts.privateKeyToAccount(privateKey);

            const amountInWei = web3.utils.toWei(amount, "ether");

            const nonce = await web3.eth.getTransactionCount(account.address, "latest");
            const gasPrice = await web3.eth.getGasPrice();

            const tx = {
                from: account.address,
                to: toAddress,
                value: amountInWei,
                nonce: nonce,
                gasPrice: gasPrice,
                gas: "21000",
            };

            const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

            const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

            return receipt;
        } catch (error) {
            console.error("Error sending test transaction:", error);
            throw error;
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
        data: string = "0x"
    ): Promise<{
        estimatedGas: number;
        gasPrice: string;
        totalCost: string;
    }> {
        try {
            // Validar y formatear la dirección
            if (!to || !this.checkIfValidAddress(to)) {
                throw new Error("Invalid address");
            }
            const formattedAddress = to.toLowerCase();

            // Use a default address for gas estimation if no account is available
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
}
