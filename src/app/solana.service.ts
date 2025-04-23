import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpWrapperService } from "./http-wrapper.service";
import { environment } from "environments/environment";
import { Connection, PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction } from "@solana/spl-token";
import { Buffer } from "buffer";
import * as bip39 from "bip39";

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

    constructor(private http: HttpClient, private _httpWrapper: HttpWrapperService) {}

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
                commitment: "finalized",
                confirmTransactionInitialTimeout: 60000,
            });

            try {
                const recipientPubKey = new PublicKey(toAddress);
                if (!PublicKey.isOnCurve(recipientPubKey.toBytes())) {
                    throw new Error("Invalid recipient address format");
                }
            } catch (error) {
                console.error("Address validation error:", error);
                throw new Error("Invalid recipient address");
            }

            if (!this.validateMnemonic(mnemonic)) {
                throw new Error("Invalid mnemonic phrase");
            }

            const fromKeypair = await this.getKeypairFromMnemonic(mnemonic);
            const fromAddress = fromKeypair.publicKey.toBase58();

            console.log("Sending from wallet address:", fromAddress);
            console.log("Sending to address:", toAddress);
            console.log("Token address:", tokenAddress);
            console.log("Amount:", amount);

            if (tokenAddress && tokenAddress.trim() !== "") {
                try {
                    new PublicKey(tokenAddress);
                } catch (error) {
                    throw new Error("Invalid token address");
                }
                return this.sendSPLTokens(connection, fromKeypair, toAddress, tokenAddress, amount);
            } else {
                return this.sendSOL(connection, fromKeypair, toAddress, amount);
            }
        } catch (error: any) {
            console.error("Transaction failed:", {
                error,
                errorMessage: error.message,
                errorStack: error.stack,
                params: { toAddress, tokenAddress, amount },
            });
            throw error;
        }
    }

    private async sendSOL(connection: Connection, fromKeypair: Keypair, toAddress: string, amount: number): Promise<string> {
        try {
            const walletBalance = await connection.getBalance(fromKeypair.publicKey);
            const lamports = Math.floor(amount * LAMPORTS_PER_SOL);
            const estimatedFee = await this.getTransactionCost(toAddress, amount);

            if (walletBalance < lamports + Number(estimatedFee.estimatedGas)) {
                throw new Error(
                    `Insufficient funds. Required: ${(lamports + Number(estimatedFee.estimatedGas)) / LAMPORTS_PER_SOL} SOL, Available: ${
                        walletBalance / LAMPORTS_PER_SOL
                    } SOL`
                );
            }

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: fromKeypair.publicKey,
                    toPubkey: new PublicKey(toAddress),
                    lamports,
                })
            );

            const signature = await sendAndConfirmTransaction(connection, transaction, [fromKeypair], {
                skipPreflight: true,
                maxRetries: 3,
            });

            try {
                await new Promise((resolve) => setTimeout(resolve, 1000));

                const status = await connection.getSignatureStatus(signature);

                if (status.value?.err) {
                    throw new Error("Transaction failed: " + status.value.err.toString());
                }

                return signature;
            } catch (confirmError) {
                console.warn("Confirmation check failed, but transaction might still be successful:", confirmError);
                return signature;
            }
        } catch (error: any) {
            console.error("SOL transfer failed:", error);
            throw error;
        }
    }

    private async sendSPLTokens(
        connection: Connection,
        fromKeypair: Keypair,
        toAddress: string,
        mintAddress: string,
        amount: number
    ): Promise<string> {
        try {
            console.log("Starting SPL token transfer with params:", {
                fromPubKey: fromKeypair.publicKey.toBase58(),
                toAddress,
                mintAddress,
                amount,
            });

            const mint = new PublicKey(mintAddress);
            const recipientAddress = new PublicKey(toAddress);

            const senderTokenAccount = await getAssociatedTokenAddress(mint, fromKeypair.publicKey);
            console.log("Sender token account:", senderTokenAccount.toBase58());

            const recipientTokenAccount = await getAssociatedTokenAddress(mint, recipientAddress);
            console.log("Recipient token account:", recipientTokenAccount.toBase58());

            const tokenInfo = await connection.getParsedAccountInfo(mint);
            if (!tokenInfo.value?.data) {
                throw new Error("Invalid token mint address");
            }

            const tokenDecimals = (tokenInfo.value.data as any).parsed.info.decimals;
            const amountInTokenUnits = Math.floor(amount * 10 ** tokenDecimals);

            const tokenBalance = await connection.getTokenAccountBalance(senderTokenAccount);
            if (!tokenBalance.value || Number(tokenBalance.value.amount) < amountInTokenUnits) {
                throw new Error(
                    `Insufficient token balance. Required: ${amount}, Available: ${Number(tokenBalance.value?.amount || 0) / 10 ** tokenDecimals}`
                );
            }

            const transaction = new Transaction();

            const recipientTokenAccountInfo = await connection.getAccountInfo(recipientTokenAccount);
            if (!recipientTokenAccountInfo) {
                transaction.add(createAssociatedTokenAccountInstruction(fromKeypair.publicKey, recipientTokenAccount, recipientAddress, mint));
            }

            transaction.add(createTransferInstruction(senderTokenAccount, recipientTokenAccount, fromKeypair.publicKey, amountInTokenUnits));

            const signature = await sendAndConfirmTransaction(connection, transaction, [fromKeypair], {
                skipPreflight: true,
                maxRetries: 3,
            });

            try {
                await new Promise((resolve) => setTimeout(resolve, 1000));

                const status = await connection.getSignatureStatus(signature);

                if (status.value?.err) {
                    throw new Error("Transaction failed: " + status.value.err.toString());
                }

                return signature;
            } catch (confirmError) {
                console.warn("Confirmation check failed, but transaction might still be successful:", confirmError);
                return signature;
            }
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

    async getTransactionCost(
        toAddress: string,
        amount: number,
        tokenAddress?: string
    ): Promise<{ estimatedGas: number; gasPrice: string; totalCost: string; fiatFee?: number }> {
        try {
            const connection = new Connection(environment.solanaRpc.mainnet, {
                commitment: "confirmed",
            });

            const baseCostLamports = tokenAddress ? 20000 : 10000;

            const recentBlocks = await connection.getRecentPrioritizationFees();

            let prioritizationFees = recentBlocks.map((fee) => fee.prioritizationFee);
            prioritizationFees.sort((a, b) => a - b);
            const medianPrioritizationFee = prioritizationFees[Math.floor(prioritizationFees.length * 0.75)] || 12345;

            const computeUnits = tokenAddress ? 300000 : 200000;

            const prioritizationFeeLamports = (medianPrioritizationFee * computeUnits) / 1000000;

            const totalLamports = Math.ceil((baseCostLamports + prioritizationFeeLamports) * 1.2);

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

            const baseFee = 0.00001;
            return {
                estimatedGas: 10000,
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

            console.log("Derived keypair public key:", keypair.publicKey.toBase58());
            return keypair;
        } catch (error) {
            console.error("Error deriving keypair from mnemonic:", error);
            throw error;
        }
    }

    async generateAddressFromMnemonic(mnemonic: string): Promise<{ address: string; privateKey: string } | null> {
        try {
            if (!this.validateMnemonic(mnemonic)) {
                return null;
            }

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
}
