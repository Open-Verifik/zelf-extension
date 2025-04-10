import { Injectable } from "@angular/core";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";

import { mnemonicToSeed } from "@mysten/sui.js/cryptography";

import { SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { HttpWrapperService } from "app/http-wrapper.service";
import { environment } from "environments/environment";
import { VaultService } from "../vault.service";
import * as bip39 from "bip39";

const SUI_RPC_URL = "https://fullnode.mainnet.sui.io:443";
const SUI_TESTNET_RPC_URL = "https://fullnode.testnet.sui.io:443";
const SUI_DEVNET_RPC_URL = "https://fullnode.devnet.sui.io:443";

interface TransactionCostEstimate {
    estimatedFee: number;
    estimatedFeeUsd: number;
}

@Injectable({
    providedIn: "root",
})
export class SuiService {
    private baseUrl: string = environment.apiUrl;
    private suiClient: SuiClient;
    private networkType: string = "mainnet";

    constructor(private _httpWrapper: HttpWrapperService, private _vaultService: VaultService) {
        this.suiClient = new SuiClient({ url: SUI_RPC_URL });
    }

    getWalletDetails(address?: string): Promise<any> {
        const url = `${this.baseUrl}/api/sui/address/${address}`;

        try {
            return this._httpWrapper
                .sendRequest("get", url)
                .then((response) => {
                    return response;
                })
                .catch((error) => {
                    console.error("SUI API request failed with httpWrapper:", error);

                    return this._getDefaultSuiResponse();
                });
        } catch (error) {
            console.error("Exception in SUI getWalletDetails:", error);

            return Promise.resolve(this._getDefaultSuiResponse());
        }
    }

    private _getDefaultSuiResponse(): any {
        return {
            data: {
                balance: "0",
                _balance: 0,
                fiatBalance: "0",
                account: {
                    asset: "SUI",
                    price: "0",
                },
                tokenHoldings: {
                    tokens: [],
                },
            },
        };
    }

    /**
     * Changes the SUI network (mainnet, testnet, devnet)
     * @param network - Network name to use
     */
    setNetwork(network: "mainnet" | "testnet" | "devnet"): void {
        this.networkType = network;
        let rpcUrl = SUI_RPC_URL;

        if (network === "testnet") {
            rpcUrl = SUI_TESTNET_RPC_URL;
        } else if (network === "devnet") {
            rpcUrl = SUI_DEVNET_RPC_URL;
        }

        this.suiClient = new SuiClient({ url: rpcUrl });
    }

    /**
     * Gets the current SUI network
     * @returns The name of the current network
     */
    getNetwork(): string {
        return this.networkType;
    }

    /**
     * Imports a SUI wallet using a mnemonic phrase
     * @param mnemonic - The mnemonic phrase
     * @returns The keypair object containing the imported wallet
     */
    async importWalletFromMnemonic(mnemonic: string): Promise<Ed25519Keypair> {
        try {
            const DERIVATION_PATH = "m/44'/784'/0'/0'/0'";
            const keypair = Ed25519Keypair.deriveKeypair(mnemonic, DERIVATION_PATH);

            const address = keypair.getPublicKey().toSuiAddress();

            return keypair;
        } catch (error) {
            console.error("Error importing SUI wallet:", error);
            throw error;
        }
    }

    async createWalletFromMnemonic(mnemonic: string): Promise<string> {
        try {
            const keypair = Ed25519Keypair.deriveKeypair(mnemonic);
            const publicKey = keypair.getPublicKey();
            const address = publicKey.toSuiAddress();

            return address;
        } catch (error) {
            throw new Error(`Failed to create SUI wallet: ${(error as Error).message}`);
        }
    }

    /**
     * Gets the address from a keypair
     * @param keypair - The Ed25519Keypair
     * @returns The SUI address
     */
    getAddressFromKeypair(keypair: Ed25519Keypair): string {
        return keypair.getPublicKey().toSuiAddress();
    }

    /**
     * Gets the SUI balance for a specific address
     * @param address - The SUI address
     * @returns The balance in SUI
     */
    async getSuiBalance(address: string): Promise<number> {
        try {
            const { totalBalance } = await this.suiClient.getBalance({
                owner: address,
                coinType: "0x2::sui::SUI",
            });

            const balanceInSui = Number(totalBalance) / 1_000_000_000;

            return balanceInSui;
        } catch (error) {
            console.error("Error getting SUI balance:", error);
            throw new Error(`Error getting SUI balance: ${(error as Error).message}`);
        }
    }

    /**
     * Requests funds from SUI faucet (only for testnet/devnet)
     * @param address - The address to fund
     * @returns true if the request was completed, false otherwise
     */
    async requestSuiFaucet(address: string): Promise<boolean> {
        try {
            if (this.networkType === "mainnet") {
                console.warn("Cannot request funds from faucet on mainnet");
                return false;
            }

            let faucetUrl = "https://faucet.testnet.sui.io/gas";
            if (this.networkType === "devnet") {
                faucetUrl = "https://faucet.devnet.sui.io/gas";
            }

            const response = await fetch(faucetUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ FixedAmountRequest: { recipient: address } }),
            });

            const result = await response.json();

            return true;
        } catch (error) {
            console.error("Error requesting funds from faucet:", error);
            return false;
        }
    }

    /**
     * Transfers SUI tokens to a specific address
     * @param mnemonic - The source wallet mnemonic
     * @param recipientAddress - The destination address
     * @param amount - Amount to transfer (optional, default transfers almost all balance)
     * @returns The transaction hash
     */
    async transferSui(mnemonic: string, recipientAddress: string, amount?: number): Promise<any> {
        try {
            const keypair = Ed25519Keypair.deriveKeypair(mnemonic);

            const tx = new TransactionBlock();
            const amountInMist = Math.floor((amount || 0) * 1_000_000_000);

            const [coin] = tx.splitCoins(tx.gas, [tx.pure(amountInMist)]);
            tx.transferObjects([coin], tx.pure(recipientAddress));

            const result = await this.suiClient.signAndExecuteTransactionBlock({
                signer: keypair,
                transactionBlock: tx,
                options: {
                    showEffects: true,
                    showEvents: true,
                    showObjectChanges: true,
                },
            });

            if (result.effects?.status?.error) {
                throw new Error(`Transaction failed: ${result.effects.status.error}`);
            }

            return {
                ...result,
                transactionHash: result.digest,
            };
        } catch (error: any) {
            console.error("Detailed error in SUI transfer:", {
                error,
                errorMessage: error.message,
                errorStack: error.stack,
            });

            throw error;
        }
    }

    /**
     * Converts a byte array to a hexadecimal string
     * @param bytes - The byte array to convert
     * @returns The hexadecimal string
     */
    bytesToHex(bytes: Uint8Array): string {
        return Array.from(bytes)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
    }

    /**
     * Converts a hexadecimal string to a byte array
     * @param hex - The hexadecimal string
     * @returns The byte array
     */
    hexToBytes(hex: string): Uint8Array {
        const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
        const bytes = new Uint8Array(cleanHex.length / 2);

        for (let i = 0; i < cleanHex.length; i += 2) {
            bytes[i / 2] = parseInt(cleanHex.slice(i, i + 2), 16);
        }

        return bytes;
    }

    async transferToken(mnemonic: string, recipientAddress: string, tokenObjectId: string, amount: number): Promise<any> {
        try {
            const keypair = Ed25519Keypair.deriveKeypair(mnemonic);
            const senderAddress = keypair.getPublicKey().toSuiAddress();

            const walletDetails = await this.getWalletDetails(senderAddress);
            const tokenInfo = walletDetails?.data?.tokenHoldings?.tokens?.find((token: any) => token.address_token === tokenObjectId);

            if (!tokenInfo) {
                throw new Error(`Token information not found for address: ${tokenObjectId}`);
            }

            const actualTokenBalance = Number(tokenInfo.amount || 0);

            if (actualTokenBalance < amount) {
                throw new Error(`Insufficient token balance. Available: ${actualTokenBalance}, Required: ${amount}`);
            }

            const coinType = `${tokenObjectId}::coin::COIN`;

            const { data: tokenObjects } = await this.suiClient.getOwnedObjects({
                owner: senderAddress,
                filter: {
                    StructType: `0x2::coin::Coin<${coinType}>`,
                },
                options: {
                    showContent: true,
                    showType: true,
                },
            });

            if (!tokenObjects || tokenObjects.length === 0) {
                throw new Error(`No coins found in wallet for type: ${coinType}`);
            }

            // Calculate total balance across all coin objects
            let totalBalance = BigInt(0);
            const validCoinObjects = tokenObjects.filter((obj) => (obj.data?.content as any)?.fields?.balance && obj.data?.objectId);

            for (const obj of validCoinObjects) {
                const coinData = obj.data?.content as unknown as { fields: { balance: string } };
                totalBalance += BigInt(coinData.fields.balance);
            }

            const decimals = tokenInfo.decimals || 6;
            const amountInSmallestUnit = BigInt(Math.floor(amount * Math.pow(10, decimals)));

            console.log("Debug balances:", {
                tokenObjectId,
                actualTokenBalance,
                totalBalance: totalBalance.toString(),
                amountRequested: amount,
                amountInSmallestUnit: amountInSmallestUnit.toString(),
                decimals,
                availableFormatted: Number(totalBalance) / Math.pow(10, decimals),
                numberOfCoinObjects: validCoinObjects.length,
            });

            if (totalBalance < amountInSmallestUnit) {
                const availableFormatted = Number(totalBalance) / Math.pow(10, decimals);
                throw new Error(`Insufficient total balance. Available: ${availableFormatted}, Required: ${amount}`);
            }

            const tx = new TransactionBlock();
            if (validCoinObjects.length > 1) {
                const primaryCoin = tx.object(validCoinObjects[0].data!.objectId);

                const coinsToMerge = validCoinObjects.slice(1).map((obj) => tx.object(obj.data!.objectId));

                tx.mergeCoins(primaryCoin, coinsToMerge);

                const [sendCoin] = tx.splitCoins(primaryCoin, [tx.pure(amountInSmallestUnit)]);
                tx.transferObjects([sendCoin], tx.pure(recipientAddress));
            } else {
                const coin = tx.object(validCoinObjects[0].data!.objectId);
                const [sendCoin] = tx.splitCoins(coin, [tx.pure(amountInSmallestUnit)]);
                tx.transferObjects([sendCoin], tx.pure(recipientAddress));
            }

            const result = await this.suiClient.signAndExecuteTransactionBlock({
                signer: keypair,
                transactionBlock: tx,
                options: {
                    showEffects: true,
                    showEvents: true,
                    showInput: true,
                },
            });

            if (result.effects?.status?.error) {
                throw new Error(`Transaction failed: ${result.effects.status.error}`);
            }

            return { ...result, transactionHash: result.digest };
        } catch (error: any) {
            console.error("Error in token transfer:", error);
            throw error;
        }
    }

    async estimateSuiTransactionFee(receiverAddress: string, amount: number): Promise<TransactionCostEstimate> {
        try {
            const tx = new TransactionBlock();
            const amountInMist = Math.floor(amount * 1_000_000_000);
            const [coin] = tx.splitCoins(tx.gas, [tx.pure(amountInMist)]);

            tx.transferObjects([coin], tx.pure(receiverAddress));

            const dryRunResult = await this.suiClient.dryRunTransactionBlock({
                transactionBlock: tx.serialize(),
            });

            const estimatedFee = Number(dryRunResult.effects.gasUsed.computationCost) / 1_000_000_000;

            const suiPrice = 2;
            const estimatedFeeUsd = estimatedFee * suiPrice;

            return {
                estimatedFee,
                estimatedFeeUsd,
            };
        } catch (error) {
            console.error("Error estimating SUI transaction fee:", error);

            return {
                estimatedFee: 0.001,
                estimatedFeeUsd: 0.002,
            };
        }
    }

    async estimateTokenTransactionFee(
        receiverAddress: string,
        contractAddress: string,
        amount: number,
        decimals: number = 9
    ): Promise<TransactionCostEstimate> {
        try {
            const tx = new TransactionBlock();
            const amountInBaseUnits = BigInt(Math.floor(amount * Math.pow(10, decimals)));

            tx.moveCall({
                target: `${contractAddress}::transfer::transfer`,
                arguments: [tx.pure(amountInBaseUnits), tx.pure(receiverAddress)],
            });

            const dryRunResult = await this.suiClient.dryRunTransactionBlock({
                transactionBlock: tx.serialize(),
            });

            const estimatedFee = Number(dryRunResult.effects.gasUsed.computationCost) / 1_000_000_000;

            return {
                estimatedFee,
                estimatedFeeUsd: estimatedFee * 2,
            };
        } catch (error) {
            console.error("Error estimating token transaction fee:", error);
            return {
                estimatedFee: 0.002,
                estimatedFeeUsd: 0.004,
            };
        }
    }

    isValidSuiAddress(address: string): boolean {
        return /^0x[a-fA-F0-9]{64}$/.test(address);
    }

    generateAddressFromMnemonic(mnemonic: string): { address: string; privateKey: string } | null {
        try {
            const seed = bip39.mnemonicToSeedSync(mnemonic);
            const keypair = Ed25519Keypair.deriveKeypair(mnemonic);
            const privateKey = `0x${Buffer.from(keypair.export().privateKey).toString("hex")}`;
            const address = keypair.getPublicKey().toSuiAddress();

            return {
                address,
                privateKey,
            };
        } catch (exception) {
            console.error("Error generating SUI address from mnemonic:", exception);
            return null;
        }
    }

    async requestTransactionDetails(transactionHash: string): Promise<{ data: any }> {
        return this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/sui/transaction/${transactionHash}`);
    }

    validateMnemonic(mnemonic: string): boolean {
        return bip39.validateMnemonic(mnemonic);
    }
}
