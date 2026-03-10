import { ethers } from "ethers";
import { Injectable } from "@angular/core";

import { TransactionParams, TransactionResult } from "../core/models/transaction-fee.model";
import { BlockchainTransactionsService } from "./blockchain-transactions.service";
import { VaultService } from "../vault.service";
import { environment } from "environments/environment";
import { WalletService } from "../wallet.service";
import { TagModel } from "../tags.service";

export interface SignMessageParams {
    message: string;
    method: "personal_sign" | "eth_signTypedData_v4" | "eth_sign";
    chainId?: number;
}

export interface SignMessageResult {
    signature: string;
}

export interface DappTransactionParams {
    to: string;
    value?: string;
    data?: string;
    gasLimit?: string;
    gasPrice?: string;
    maxFeePerGas?: string;
    maxPriorityFeePerGas?: string;
    nonce?: number;
    chainId?: number;
    network: string;
}

export interface DeriveKeyResult {
    privateKey: string;
    address: string;
}

const CHAIN_ID_TO_NETWORK: Record<number, string> = {
    1: "ethereum",
    10: "ethereum",
    42161: "ethereum",
    8453: "ethereum",
    43114: "avalanche",
    137: "polygon",
    56: "binance",
    1404: "blockdag",
};

const NETWORK_TO_CHAIN_ID: Record<string, number> = {
    ethereum: 1,
    avalanche: 43114,
    polygon: 137,
    binance: 56,
    blockdag: 1404,
};

@Injectable({
    providedIn: "root",
})
export class SigningService {
    constructor(
        private _blockchainTransactionsService: BlockchainTransactionsService,
        private _vaultService: VaultService,
        private _walletService: WalletService
    ) {}

    static getNetworkFromChainId(chainId: number): string | null {
        return CHAIN_ID_TO_NETWORK[chainId] || null;
    }

    static getChainIdFromNetwork(network: string): number | null {
        return NETWORK_TO_CHAIN_ID[network.toLowerCase()] || null;
    }

    static getSupportedChainIds(): number[] {
        return Object.keys(CHAIN_ID_TO_NETWORK).map(Number);
    }

    static getSupportedEipChains(): string[] {
        return Object.keys(CHAIN_ID_TO_NETWORK).map((id) => `eip155:${id}`);
    }

    static isEvmNetwork(network: string): boolean {
        return ["ethereum", "avalanche", "polygon", "binance", "blockdag", "optimism", "arbitrum", "base"].includes(network.toLowerCase());
    }

    deriveEvmKey(mnemonic: string): DeriveKeyResult {
        const wallet = ethers.Wallet.fromPhrase(mnemonic.trim().toLowerCase());

        return {
            privateKey: wallet.privateKey,
            address: wallet.address,
        };
    }

    async signEvmTransaction(mnemonic: string, txParams: DappTransactionParams): Promise<TransactionResult> {
        const cleanMnemonic = mnemonic.trim().toLowerCase();

        if (!ethers.Mnemonic.isValidMnemonic(cleanMnemonic)) {
            throw new Error("Invalid mnemonic");
        }

        const { privateKey, address } = this.deriveEvmKey(cleanMnemonic);

        const params: TransactionParams = {
            from: address,
            to: txParams.to,
            value: txParams.value || "0",
            network: txParams.network,
            privateKey,
            data: txParams.data,
            chainId: txParams.chainId,
        };

        if (txParams.data && txParams.data !== "0x") {
            params.data = txParams.data;
        }

        return this._blockchainTransactionsService.sendTransaction(params);
    }

    async signMessage(mnemonic: string, params: SignMessageParams): Promise<SignMessageResult> {
        const cleanMnemonic = mnemonic.trim().toLowerCase();

        if (!ethers.Mnemonic.isValidMnemonic(cleanMnemonic)) {
            throw new Error("Invalid mnemonic");
        }

        const wallet = ethers.Wallet.fromPhrase(cleanMnemonic);

        switch (params.method) {
            case "personal_sign": {
                const message = params.message.startsWith("0x") ? ethers.toUtf8String(ethers.getBytes(params.message)) : params.message;
                const signature = await wallet.signMessage(message);
                return { signature };
            }

            case "eth_signTypedData_v4": {
                const typedData = JSON.parse(params.message);
                const { domain, types, message, primaryType } = typedData;

                const filteredTypes = { ...types };
                delete filteredTypes.EIP712Domain;

                const signature = await wallet.signTypedData(domain, filteredTypes, message);
                return { signature };
            }

            case "eth_sign": {
                const messageBytes = ethers.getBytes(params.message);
                const signature = await wallet.signMessage(messageBytes);
                return { signature };
            }

            default:
                throw new Error(`Unsupported signing method: ${params.method}`);
        }
    }

    async signRawTransaction(mnemonic: string, txParams: DappTransactionParams): Promise<string> {
        const cleanMnemonic = mnemonic.trim().toLowerCase();
        const wallet = ethers.Wallet.fromPhrase(cleanMnemonic);

        const tx: ethers.TransactionRequest = {
            to: txParams.to,
            value: txParams.value ? BigInt(txParams.value) : 0n,
            data: txParams.data || "0x",
            chainId: txParams.chainId,
        };

        if (txParams.gasLimit) tx.gasLimit = BigInt(txParams.gasLimit);
        if (txParams.gasPrice) tx.gasPrice = BigInt(txParams.gasPrice);
        if (txParams.maxFeePerGas) tx.maxFeePerGas = BigInt(txParams.maxFeePerGas);
        if (txParams.maxPriorityFeePerGas) tx.maxPriorityFeePerGas = BigInt(txParams.maxPriorityFeePerGas);
        if (txParams.nonce !== undefined) tx.nonce = txParams.nonce;

        return wallet.signTransaction(tx);
    }

    async sendTransaction(mnemonic: string, txParams: DappTransactionParams): Promise<TransactionResult> {
        const network = txParams.network.toLowerCase();

        if (SigningService.isEvmNetwork(network)) {
            return this.sendEvmTransactionNative(mnemonic, txParams);
        }

        const params: TransactionParams = {
            from: "",
            to: txParams.to,
            value: txParams.value || "0",
            network,
            mnemonic: mnemonic.trim().toLowerCase(),
        };

        return this._blockchainTransactionsService.sendTransaction(params);
    }

    async decryptMnemonic(wallet: TagModel, password: string): Promise<string | null> {
        if (!wallet?.pgp?.encryptedMessage || !wallet?.pgp?.privateKey || !password) {
            return null;
        }

        const raw = await this._vaultService.decryptMessage(wallet.pgp.encryptedMessage, wallet.pgp.privateKey, password);
        const secret = JSON.parse(raw);

        return secret.mnemonic?.trim()?.toLowerCase() || null;
    }

    async decryptMnemonicOnce(wallet: TagModel, password: string): Promise<string | null> {
        if (!wallet?.pgp?.encryptedMessage || !wallet?.pgp?.privateKey || !password) {
            return null;
        }

        const raw = await this._vaultService.oneTimeDecryptMessage(wallet.pgp.encryptedMessage, wallet.pgp.privateKey, password);
        const secret = JSON.parse(raw);

        return secret.mnemonic?.trim()?.toLowerCase() || null;
    }

    async getAccountsForWallet(wallet: Partial<TagModel>): Promise<string[]> {
        const accounts: string[] = [];

        if (wallet?.publicData?.ethAddress) {
            accounts.push(wallet.publicData.ethAddress);
        }

        return accounts;
    }

    async getAllWalletAccounts(): Promise<{ tagName: string; address: string; wallet: Partial<TagModel> }[]> {
        const current = await this._walletService.getCurrentWallet();
        const others = await this._walletService.getWalletsFromStorage();

        const allWallets: Partial<TagModel>[] = [];
        if (current?.publicData?.ethAddress) allWallets.push(current);
        allWallets.push(...others.filter((w) => w.publicData?.ethAddress));

        const seen = new Set<string>();

        return allWallets
            .filter((w) => {
                const addr = w.publicData?.ethAddress?.toLowerCase();
                if (!addr || seen.has(addr)) return false;
                seen.add(addr);
                return true;
            })
            .map((w) => ({
                tagName: w.publicData?.tagName || w.fullTagName || "",
                address: w.publicData?.ethAddress || "",
                wallet: w,
            }));
    }

    async sendEvmTransactionNative(mnemonic: string, txParams: DappTransactionParams): Promise<TransactionResult> {
        const cleanMnemonic = mnemonic.trim().toLowerCase();
        const network = txParams.network.toLowerCase();
        let rpcUrl = "";
        
        switch (network) {
            case "ethereum": rpcUrl = environment.ethereumRpc.mainnet; break;
            case "bsc":
            case "binance": rpcUrl = environment.binanceRpc.mainnet; break;
            case "polygon": rpcUrl = environment.polygonRpc.mainnet; break;
            case "avalanche": rpcUrl = environment.avalancheRpc.mainnet; break;
            case "blockdag": rpcUrl = "https://rpc.bdagscan.com"; break;
            default: rpcUrl = environment.ethereumRpc.mainnet;
        }

        const provider = new ethers.JsonRpcProvider(rpcUrl);
        const wallet = ethers.Wallet.fromPhrase(cleanMnemonic).connect(provider);

        const tx: ethers.TransactionRequest = {
            to: txParams.to,
            value: txParams.value ? BigInt(txParams.value) : 0n,
            data: txParams.data || "0x",
            chainId: txParams.chainId,
        };

        if (txParams.gasLimit) tx.gasLimit = BigInt(txParams.gasLimit);
        if (txParams.gasPrice) tx.gasPrice = BigInt(txParams.gasPrice);
        if (txParams.maxFeePerGas) tx.maxFeePerGas = BigInt(txParams.maxFeePerGas);
        if (txParams.maxPriorityFeePerGas) tx.maxPriorityFeePerGas = BigInt(txParams.maxPriorityFeePerGas);
        if (txParams.nonce !== undefined) tx.nonce = txParams.nonce;

        try {
            const txResponse = await wallet.sendTransaction(tx);
            return {
                hash: txResponse.hash,
                status: "pending",
            };
        } catch (error: any) {
            console.error("Direct EVM Transaction Failed:", error);
            throw error;
        }
    }
}
