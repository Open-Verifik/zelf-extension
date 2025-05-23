import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { createAssociatedTokenAccountInstruction, createTransferInstruction, getAssociatedTokenAddress } from "@solana/spl-token";

import {
    ComputeBudgetProgram,
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    MessageV0,
    PublicKey,
    SystemProgram,
    Transaction,
    VersionedTransaction,
    sendAndConfirmTransaction,
} from "@solana/web3.js";

import * as bip39 from "bip39";
import { Buffer } from "buffer";
import { environment } from "environments/environment";
import { firstValueFrom } from "rxjs";
import { HttpWrapperService } from "./http-wrapper.service";

import slip10 from "micro-key-producer/slip10.js";

import { encode as bs58encode } from "bs58";

if (typeof window !== "undefined") {
    window.Buffer = window.Buffer || Buffer;
}

@Injectable({
    providedIn: "root",
})
export class SolanaService {
    baseUrl: string = environment.apiUrl;
    tokens: Array<any> = [];

    constructor(
        private http: HttpClient,
        private _httpWrapper: HttpWrapperService
    ) {}

    getWalletDetails(address?: string): Promise<any> {
        return this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/solana/address/${address}`);
    }

    formatTokens(tokens: Array<any>): void {
        for (let index = 0; index < tokens.length; index++) {
            const token = tokens[index];

            const _token = { ...token, symbol: token.symbol || token.name, network: "Solana" };

            if (_token.name === "Zelf") {
                _token.symbol = "ZNS";
            }

            this.tokens.push(_token);
        }
    }

    clearTokens(): void {
        this.tokens = [];
    }

    async getGasPrices(): Promise<any> {
        return this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/solana/gas-tracker`);
    }

    async requestTransactionDetails(transactionHash: string): Promise<{ data: any }> {
        return this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/solana/transaction/${transactionHash}`);
    }

    private async retryWithBackoff<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
        let retries = 0;

        while (true) {
            try {
                return await operation();
            } catch (error: any) {
                if (error?.response?.status !== 429 || retries >= maxRetries) {
                    throw error;
                }

                retries++;
                const delay = Math.min(1000 * Math.pow(2, retries), 10000);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    }

    async sendTokens(mnemonic: string, toAddress: string, tokenAddress: string, amount: number): Promise<string> {
        try {
            const connection = new Connection(environment.solanaRpc.mainnet, {
                commitment: "confirmed",
            });

            const fromKeypair = await this.getKeypairFromMnemonic(mnemonic);

            if (tokenAddress) {
                return this.sendSPLTokens({
                    fromPubKey: fromKeypair,
                    toAddress,
                    mintAddress: tokenAddress,
                    amount,
                });
            } else {
                return this.sendSOL(connection, fromKeypair, toAddress, amount);
            }
        } catch (error: any) {
            console.error("Error sending tokens:", error);
            throw error;
        }
    }

    private async sendSOL(connection: Connection, fromKeypair: Keypair, toAddress: string, amount: number): Promise<string> {
        try {
            const walletBalance = await connection.getBalance(fromKeypair.publicKey);
            const lamports = Math.floor(amount * LAMPORTS_PER_SOL);
            const estimatedFee = await this.getTransactionCost();

            if (walletBalance < lamports + Number(estimatedFee.estimatedGas)) {
                throw new Error(
                    `Insufficient funds. Required: ${(lamports + Number(estimatedFee.estimatedGas)) / LAMPORTS_PER_SOL} SOL, Available: ${
                        walletBalance / LAMPORTS_PER_SOL
                    } SOL`
                );
            }

            const transaction = new Transaction();

            transaction.add(
                ComputeBudgetProgram.setComputeUnitPrice({
                    microLamports: 500000,
                })
            );

            transaction.add(
                SystemProgram.transfer({
                    fromPubkey: fromKeypair.publicKey,
                    toPubkey: new PublicKey(toAddress),
                    lamports: lamports,
                })
            );

            const signature = await sendAndConfirmTransaction(connection, transaction, [fromKeypair]);
            return signature;
        } catch (error: any) {
            console.error("SOL transfer failed:", error);
            throw error;
        }
    }

    private async sendSPLTokens(params: { fromPubKey: Keypair; toAddress: string; mintAddress: string; amount: number }): Promise<string> {
        try {
            const connection = new Connection(environment.solanaRpc.mainnet, {
                commitment: "confirmed",
            });

            const fromKeypair = params.fromPubKey;
            const mint = new PublicKey(params.mintAddress);
            const recipientAddress = new PublicKey(params.toAddress);

            const senderTokenAccount = await getAssociatedTokenAddress(mint, fromKeypair.publicKey);
            const recipientTokenAccount = await getAssociatedTokenAddress(mint, recipientAddress);

            const tokenInfo = await connection.getParsedAccountInfo(mint);

            if (!tokenInfo.value) {
                throw new Error("Token not found");
            }

            const decimals = (tokenInfo.value.data as any).parsed.info.decimals;
            const amountInTokenUnits = Math.floor(params.amount * Math.pow(10, decimals));

            const tokenBalance = await connection.getTokenAccountBalance(senderTokenAccount);

            if (!tokenBalance.value || Number(tokenBalance.value.amount) < amountInTokenUnits) {
                throw new Error(
                    `Insufficient token balance. Required: ${params.amount}, Available: ${
                        tokenBalance.value ? Number(tokenBalance.value.amount) / Math.pow(10, decimals) : 0
                    }`
                );
            }

            const transaction = new Transaction();

            transaction.add(
                ComputeBudgetProgram.setComputeUnitPrice({
                    microLamports: 500000,
                })
            );

            const recipientTokenAccountInfo = await connection.getAccountInfo(recipientTokenAccount);

            if (!recipientTokenAccountInfo) {
                transaction.add(createAssociatedTokenAccountInstruction(fromKeypair.publicKey, recipientTokenAccount, recipientAddress, mint));
            }

            transaction.add(createTransferInstruction(senderTokenAccount, recipientTokenAccount, fromKeypair.publicKey, amountInTokenUnits));

            const signature = await sendAndConfirmTransaction(connection, transaction, [fromKeypair]);

            return signature;
        } catch (error: any) {
            console.error("SPL token transfer failed:", error);
            throw error;
        }
    }

    isValidSolanaAddress(address: string): boolean {
        try {
            if (!address) return false;

            const publicKey = new PublicKey(address);

            return PublicKey.isOnCurve(publicKey);
        } catch (error) {
            return false;
        }
    }

    async getTransactionCost(tokenAddress?: string): Promise<{ estimatedGas: number; gasPrice: string; totalCost: string; fiatFee?: number }> {
        try {
            const baseCostLamports = tokenAddress ? 10000 : 5000;
            const prioritizationFee = 500000;
            const computeUnits = tokenAddress ? 200000 : 150000;
            const prioritizationFeeLamports = (prioritizationFee * computeUnits) / 1000000;

            const totalLamports = baseCostLamports + prioritizationFeeLamports;
            const totalCostSOL = totalLamports / LAMPORTS_PER_SOL;

            let solPriceUSD = 0;
            try {
                const response = await this.http.get<any>("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd").toPromise();
                solPriceUSD = response?.solana?.usd || 0;
            } catch (error) {
                console.warn("Failed to fetch SOL price, using 0 for fiat conversion", error);
            }

            const fiatFee = totalCostSOL * solPriceUSD;

            return {
                estimatedGas: Math.round(totalLamports),
                gasPrice: totalCostSOL.toString(),
                totalCost: totalCostSOL.toString(),
                fiatFee: fiatFee,
            };
        } catch (error) {
            console.error("Error getting Solana transaction cost:", error);

            const baseFee = 0.00005;

            return {
                estimatedGas: 50000,
                gasPrice: baseFee.toString(),
                totalCost: baseFee.toString(),
                fiatFee: baseFee,
            };
        }
    }

    validateMnemonic(mnemonic: string): boolean {
        return bip39.validateMnemonic(mnemonic);
    }

    async getKeypairFromMnemonic(mnemonic: string): Promise<Keypair> {
        if (!this.validateMnemonic(mnemonic)) {
            throw new Error("Invalid mnemonic phrase");
        }

        try {
            const seed = bip39.mnemonicToSeedSync(mnemonic, "");
            const hd = slip10.fromMasterSeed(seed.toString("hex"));
            const keypair = Keypair.fromSeed(hd.derive("m/44'/501'/0'/0'").privateKey);

            return keypair;
        } catch (error) {
            throw error;
        }
    }

    async generateAddressFromMnemonic(mnemonic: string): Promise<{ address: string; privateKey: string } | null> {
        try {
            if (!this.validateMnemonic(mnemonic)) return null;

            const seed = bip39.mnemonicToSeedSync(mnemonic, "");
            const hd = slip10.fromMasterSeed(seed.toString("hex"));
            const keypair = Keypair.fromSeed(hd.derive("m/44'/501'/0'/0'").privateKey);
            const address = keypair.publicKey.toBase58();
            const privateKey = bs58encode(keypair.secretKey);

            return {
                address,
                privateKey,
            };
        } catch (exception) {
            console.error("Error generating Solana address from mnemonic:", exception);
            return null;
        }
    }

    /**
     * Send a serialized transaction using the provided mnemonic
     * @param mnemonic The mnemonic phrase to derive the keypair
     * @param serializedTransaction The base64 encoded transaction data
     * @returns The transaction signature
     */
    async sendSerializedTransaction(mnemonic: string, serializedTransaction: string): Promise<string> {
        try {
            const connection = new Connection(environment.solanaRpc.mainnet, {
                commitment: "confirmed",
            });

            const fromKeypair = await this.getKeypairFromMnemonic(mnemonic);
            const transactionBuffer = Buffer.from(serializedTransaction, "base64");

            const { blockhash } = await connection.getLatestBlockhash("finalized");

            let transaction;
            let isVersioned = false;

            try {
                transaction = VersionedTransaction.deserialize(transactionBuffer);
                isVersioned = true;
            } catch (error) {
                try {
                    transaction = Transaction.from(transactionBuffer);

                    transaction.recentBlockhash = blockhash;
                    transaction.feePayer = fromKeypair.publicKey;
                } catch (deserializeError) {
                    throw new Error("Invalid transaction data: Could not deserialize");
                }
            }

            if (isVersioned) {
                const versionedTx = transaction as VersionedTransaction;
                const messageV0 = versionedTx.message;

                const newMessage = new MessageV0({
                    header: messageV0.header,
                    staticAccountKeys: messageV0.staticAccountKeys,
                    recentBlockhash: blockhash,
                    compiledInstructions: messageV0.compiledInstructions,
                    addressTableLookups: messageV0.addressTableLookups,
                });

                transaction = new VersionedTransaction(newMessage);

                transaction.sign([fromKeypair]);
            } else {
                (transaction as Transaction).partialSign(fromKeypair);
            }

            const signature = await connection.sendRawTransaction(
                transaction instanceof VersionedTransaction ? transaction.serialize() : transaction.serialize(),
                {
                    skipPreflight: true,
                    preflightCommitment: "confirmed",
                    maxRetries: 5,
                }
            );

            return signature;
        } catch (error: any) {
            if (error.message && (error.message.includes("insufficient lamports") || error.message.includes("Fondos insuficientes"))) {
                throw new Error("Fondos insuficientes para completar la transacción. Necesitas al menos 0.002 SOL para esta operación.");
            }

            throw error;
        }
    }

    /**
     * Check the status of a transaction
     * @param signature The transaction signature to check
     * @returns The transaction status
     */
    async checkTransactionStatus(signature: string): Promise<any> {
        try {
            const connection = new Connection(environment.solanaRpc.mainnet, {
                commitment: "confirmed",
            });

            const status = await connection.getSignatureStatus(signature, {
                searchTransactionHistory: true,
            });

            return status.value;
        } catch (error) {
            console.error("Error checking transaction status:", error);
            throw error;
        }
    }

    /**
     * Send a transaction via our custom endpoint
     * @param mnemonic The mnemonic phrase to derive the keypair
     * @param transactionData The base64 encoded transaction data
     * @returns The transaction signature
     */
    async sendTransactionViaEndpoint(mnemonic: string, transactionData: string): Promise<string> {
        try {
            if (!this.validateMnemonic(mnemonic)) {
                throw new Error("Invalid mnemonic phrase");
            }

            const fromKeypair = await this.getKeypairFromMnemonic(mnemonic);

            const connection = new Connection(environment.solanaRpc.mainnet, {
                commitment: "confirmed",
            });

            const balance = await connection.getBalance(fromKeypair.publicKey);

            const response = await this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/solana/send-transaction`, {
                transactionData: transactionData,
                privateKey: bs58encode(fromKeypair.secretKey),
            });

            if (!response || !response.signature) {
                throw new Error("Failed to send transaction");
            }

            return response.signature;
        } catch (error: any) {
            console.error("Error sending transaction via endpoint:", error);

            if (error.error && error.error.message) {
                throw new Error(error.error.message);
            }

            throw error;
        }
    }

    /**
     * Get the current price of SOL in USD
     * @returns The price of SOL in USD
     */
    async getSolPrice(): Promise<number> {
        try {
            const response = await firstValueFrom(this.http.get<any>("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"));

            if (response && response.solana && response.solana.usd) {
                return response.solana.usd;
            }

            console.warn("Could not fetch SOL price, using default value");
            return 150;
        } catch (error) {
            console.error("Error fetching SOL price:", error);

            return 150;
        }
    }
}
