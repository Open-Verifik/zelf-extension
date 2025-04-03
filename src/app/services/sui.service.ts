import { Injectable } from "@angular/core";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";

import { mnemonicToSeed } from "@mysten/sui.js/cryptography";

import { SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { HttpWrapperService } from "app/http-wrapper.service";
import { environment } from "environments/environment";

const SUI_COIN_TYPE = 784;
const SUI_RPC_URL = "https://fullnode.mainnet.sui.io:443";
const SUI_TESTNET_RPC_URL = "https://fullnode.testnet.sui.io:443";
const SUI_DEVNET_RPC_URL = "https://fullnode.devnet.sui.io:443";

function derivationPathForCoinType(coinType: number): string {
    return "m/44'/784'/0'/0'/0'";
}

@Injectable({
    providedIn: "root",
})
export class SuiService {
    private baseUrl: string = environment.apiUrl;
    private suiClient: SuiClient;
    private networkType: string = "mainnet";

    constructor(private _httpWrapper: HttpWrapperService) {
        this.suiClient = new SuiClient({ url: SUI_RPC_URL });
    }

    getWalletDetails(address?: string): Promise<any> {
        console.log(`Fetching SUI wallet details for address: ${address}`);

        const url = `${this.baseUrl}/api/sui/address/${address}`;
        console.log(`SUI API request URL: ${url}`);

        try {
            return this._httpWrapper
                .sendRequest("get", url)
                .then((response) => {
                    console.log("SUI API response successful:", response ? "Data received" : "Empty response");
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
        console.log(`SUI network changed to ${network}: ${rpcUrl}`);
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
            console.log("Importing SUI wallet from mnemonic...");

            // First get the seed from mnemonic
            const seed = await mnemonicToSeed(mnemonic);

            // Create keypair using the standard derivation path for SUI
            const DERIVATION_PATH = "m/44'/784'/0'/0'/0'";
            const keypair = Ed25519Keypair.deriveKeypair(mnemonic, DERIVATION_PATH);

            // Get and log the address to verify
            const address = keypair.getPublicKey().toSuiAddress();
            console.log(`Generated SUI address: ${address}`);

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
            console.log(`Fetching real SUI balance for address: ${address}`);

            // Call the SUI API to get the balance
            const { totalBalance } = await this.suiClient.getBalance({
                owner: address,
                coinType: "0x2::sui::SUI", // SUI coin type
            });

            // Convert from MIST (base unit) to SUI (1 SUI = 10^9 MIST)
            const balanceInSui = Number(totalBalance) / 1_000_000_000;

            console.log(`SUI balance obtained: ${balanceInSui} SUI (${totalBalance} MIST)`);

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

            console.log(`Requesting funds from faucet for ${address} on ${this.networkType}`);

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
            console.log("Faucet response:", result);
            return true;
        } catch (error) {
            console.error("Error requesting funds from faucet:", error);
            return false;
        }
    }

    /**
     * Transfers SUI tokens to a specific address
     * @param keypair - The source wallet keypair
     * @param recipientAddress - The destination address
     * @param amount - Amount to transfer (optional, default transfers almost all balance)
     * @returns The transaction hash
     */
    async transferSui(keypair: Ed25519Keypair, recipientAddress: string, amount?: number): Promise<string> {
        try {
            const senderAddress = this.getAddressFromKeypair(keypair);
            console.log(`Starting transfer from ${senderAddress} to ${recipientAddress}`);

            // Get current balance if amount is not specified
            if (!amount) {
                const balance = await this.getSuiBalance(senderAddress);
                // Leave a small margin for fees (0.01 SUI)
                amount = Math.max(0, balance - 0.01);
                console.log(`Balance obtained: ${balance} SUI, will transfer: ${amount} SUI`);
            }

            if (amount <= 0) {
                console.log("Transfer cancelled: insufficient balance");
                throw new Error("Insufficient balance to perform the transfer");
            }

            // Create a transaction block
            const tx = new TransactionBlock();

            // Convert to MIST (smallest unit of SUI - 1 SUI = 10^9 MIST)
            const amountInMist = Math.floor(amount * 1_000_000_000);
            console.log(`Amount in MIST to transfer: ${amountInMist}`);

            // Split the gas coin to get the specific amount
            const [coin] = tx.splitCoins(tx.gas, [tx.pure(amountInMist)]);

            // Transfer the split coin to the recipient
            tx.transferObjects([coin], tx.pure(recipientAddress));
            console.log("Transaction prepared, sending...");

            // Sign and send the transaction
            const result = await this.suiClient.signAndExecuteTransactionBlock({
                signer: keypair,
                transactionBlock: tx,
            });

            console.log(`Transfer completed successfully. Hash: ${result.digest}`);
            console.log("Complete transaction details:", JSON.stringify(result, null, 2));

            return result.digest;
        } catch (error) {
            console.error("Error transferring SUI:", error);
            console.error("Error details:", JSON.stringify(error, null, 2));
            throw new Error(`Error transferring SUI: ${(error as Error).message}`);
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
        // Remove 0x prefix if present
        const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
        const bytes = new Uint8Array(cleanHex.length / 2);

        for (let i = 0; i < cleanHex.length; i += 2) {
            bytes[i / 2] = parseInt(cleanHex.slice(i, i + 2), 16);
        }

        return bytes;
    }
}
