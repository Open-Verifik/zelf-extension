import {
    createAssociatedTokenAccountInstruction,
    createTransferInstruction,
    getAssociatedTokenAddress,
    TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
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
} from "@solana/web3.js";
import * as bip39 from "bip39";
import { Buffer } from "buffer";
import slip10 from "micro-key-producer/slip10.js";

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";

import { environment } from "environments/environment";
import { RpcProviderService } from "app/services/rpc-provider.service";
import { TransactionFeeEstimate, TransactionParams, TransactionResult } from "./core/models/transaction-fee.model";
import { HttpWrapperService } from "./http-wrapper.service";

if (typeof window !== "undefined") window.Buffer = window.Buffer || Buffer;

@Injectable({
    providedIn: "root",
})
export class SolanaService {
    private readonly _baseUrl: string = environment.apiUrl;
    /** All RPC calls: `POST /api/protected/rpc/solana` + JWT when session is available. */
    private readonly _connectionReady: Promise<Connection>;

    tokens: Array<any> = [];

    constructor(
        private http: HttpClient,
        private _httpWrapper: HttpWrapperService,
        private _rpcProvider: RpcProviderService
    ) {
        this._connectionReady = this._rpcProvider.getSolanaConnection();
    }

    /** ZNS SPL token mint on Solana mainnet */
    static readonly ZNS_MINT_ADDRESS = "GfF6PSkH8bKLkws5RMFdzgASwcVbgCfhhKfp8zeoFBkx";

    /** Solana RPC (Zelf protected proxy + JWT, or direct fallback). */
    getConnection(): Promise<Connection> {
        return this._connectionReady;
    }

    /**
     * Get ZNS token balance for a wallet via Solana RPC.
     * ownerAddress = the holder's Solana wallet (the one that holds the tokens), not the minter.
     * Uses getTokenAccountsByOwner to find any token account holding ZNS for this wallet.
     * Tries legacy SPL Token (mint filter) then Token-2022 (list all, filter by mint).
     */
    async getZnsBalanceViaRpc(ownerAddress: string): Promise<number> {
        try {
            const connection = await this._connectionReady;
            const mint = new PublicKey(SolanaService.ZNS_MINT_ADDRESS);
            const owner = new PublicKey(ownerAddress);
            const mintStr = SolanaService.ZNS_MINT_ADDRESS;

            const tryBalance = async (accountPubkey: PublicKey): Promise<number> => {
                const balance = await connection.getTokenAccountBalance(accountPubkey);
                const amount = balance?.value?.uiAmount ?? 0;
                return typeof amount === "number" ? amount : parseFloat(String(amount)) || 0;
            };

            const responseLegacy = await connection.getTokenAccountsByOwner(owner, { mint });
            if (responseLegacy.value.length > 0) {
                return tryBalance(responseLegacy.value[0].pubkey);
            }

            const parsed2022 = await connection.getParsedTokenAccountsByOwner(owner, {
                programId: TOKEN_2022_PROGRAM_ID,
            });
            for (const item of parsed2022.value) {
                const info = item.account?.data?.parsed?.info;
                if (info?.mint === mintStr) {
                    return tryBalance(item.pubkey);
                }
            }
            return 0;
        } catch (error: any) {
            const msg = error?.message ?? String(error);
            if (msg.includes("could not find account") || msg.includes("Invalid param")) {
                return 0;
            }
            console.warn("Solana RPC ZNS balance error:", error);
            return 0;
        }
    }

    private _defaultResponse(): any {
        return {
            data: {
                _balance: 0,
                balance: "0",
                fiatBalance: "0",
                account: {
                    asset: "SOL",
                    price: "0",
                },
                tokenHoldings: {
                    tokens: [],
                },
            },
        };
    }

    public async getSolanaAccount(mnemonic: string): Promise<Keypair> {
        return this._getKeypairFromMnemonic(mnemonic);
    }

    private async _getKeypairFromMnemonic(mnemonic: string): Promise<Keypair> {
        if (!this._validateMnemonic(mnemonic)) throw new Error("Invalid mnemonic phrase");

        try {
            const seed = bip39.mnemonicToSeedSync(mnemonic, "");
            const hd = slip10.fromMasterSeed(seed.toString("hex"));
            const keypair = Keypair.fromSeed(hd.derive("m/44'/501'/0'/0'").privateKey);

            return keypair;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Polls getSignatureStatuses (HTTP only) until confirmed/finalized or timeout.
     * Avoids WebSocket signatureSubscribe which fails when the RPC endpoint is HTTP-only.
     */
    private async _waitForConfirmation(connection: Connection, signature: string, timeoutMs = 60_000): Promise<void> {
        const start = Date.now();

        while (Date.now() - start < timeoutMs) {
            const { value } = await connection.getSignatureStatuses([signature], { searchTransactionHistory: false });
            const status = value?.[0];

            if (status) {
                if (status.err) throw new Error(`Transaction failed on-chain: ${JSON.stringify(status.err)}`);
                if (status.confirmationStatus === "confirmed" || status.confirmationStatus === "finalized") return;
            }

            await new Promise<void>((r) => setTimeout(r, 2000));
        }

        throw new Error("Transaction confirmation timed out after 60 seconds");
    }

    private async _sendSOL(connection: Connection, fromKeypair: Keypair, toAddress: string, amount: number): Promise<string> {
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

            const { blockhash } = await connection.getLatestBlockhash("confirmed");
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = fromKeypair.publicKey;
            transaction.sign(fromKeypair);

            const signature = await connection.sendRawTransaction(transaction.serialize(), { skipPreflight: false, maxRetries: 3 });

            await this._waitForConfirmation(connection, signature);

            return signature;
        } catch (error: any) {
            console.error("SOL transfer failed:", error);

            throw error;
        }
    }

    private async _sendSPLTokens(params: { fromPubKey: Keypair; toAddress: string; mintAddress: string; amount: number }): Promise<string> {
        try {
            const connection = await this._connectionReady;

            const fromKeypair = params.fromPubKey;
            const mint = new PublicKey(params.mintAddress);
            const recipientAddress = new PublicKey(params.toAddress);

            const senderTokenAccount = await getAssociatedTokenAddress(mint, fromKeypair.publicKey);
            const recipientTokenAccount = await getAssociatedTokenAddress(mint, recipientAddress);

            const tokenInfo = await connection.getParsedAccountInfo(mint);

            if (!tokenInfo.value) throw new Error("Token not found");

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

            const walletBalance = await connection.getBalance(fromKeypair.publicKey);

            const gasEstimate = 510000; // Prioritization fee (500k) + Base fee (10k)
            const senderRent = await connection.getMinimumBalanceForRentExemption(0);
            let totalNeededSOL = gasEstimate + senderRent;

            if (!recipientTokenAccountInfo) {
                const ataRent = await connection.getMinimumBalanceForRentExemption(165);
                totalNeededSOL += ataRent;
            }

            if (walletBalance < totalNeededSOL) throw new Error("errors.solana_insufficient_sol_for_fees");

            const { blockhash } = await connection.getLatestBlockhash("confirmed");
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = fromKeypair.publicKey;
            transaction.sign(fromKeypair);

            const signature = await connection.sendRawTransaction(transaction.serialize(), { skipPreflight: false, maxRetries: 3 });

            await this._waitForConfirmation(connection, signature);

            return signature;
        } catch (error: any) {
            console.error("SPL token transfer failed:", error);

            if (error.logs) {
                console.error("Solana transaction logs:", error.logs);
            } else if (typeof error.getLogs === "function") {
                console.error("Solana transaction logs (from getLogs):", error.getLogs());
            }

            const errorMsg = error.message || "";
            if (errorMsg.includes("insufficient funds for rent") || errorMsg.includes("insufficient lamports")) {
                throw new Error("errors.solana_insufficient_sol_for_rent");
            }

            throw error;
        }
    }

    private async _sendTokens(mnemonic: string, toAddress: string, tokenAddress: string, amount: number): Promise<string> {
        try {
            const connection = await this._connectionReady;

            const fromKeypair = await this._getKeypairFromMnemonic(mnemonic);

            if (tokenAddress) {
                return this._sendSPLTokens({
                    fromPubKey: fromKeypair,
                    toAddress,
                    mintAddress: tokenAddress,
                    amount,
                });
            } else {
                return this._sendSOL(connection, fromKeypair, toAddress, amount);
            }
        } catch (error: any) {
            console.error("Error sending tokens:", error);

            throw error;
        }
    }

    private _validateMnemonic(mnemonic: string): boolean {
        return bip39.validateMnemonic(mnemonic);
    }

    async calculateTransactionFees(tokenAddress: string | undefined, amount: number, tokenPrice: number): Promise<TransactionFeeEstimate> {
        const feeEstimate = await this.getTransactionCost(tokenAddress);
        const amountInUsd = amount * tokenPrice;
        const fee = typeof feeEstimate.gasPrice === "number" ? feeEstimate.gasPrice : parseFloat(feeEstimate.gasPrice || "0");
        const fiatFee = typeof feeEstimate.fiatFee === "number" ? feeEstimate.fiatFee : parseFloat(feeEstimate.fiatFee || "0");

        return {
            fee,
            fiatFee,
            total: amountInUsd + fiatFee,
        };
    }

    async getSolPrice(): Promise<number> {
        try {
            const response = await firstValueFrom(this.http.get<any>("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"));

            if (response && response.solana && response.solana.usd) return response.solana.usd;

            console.warn("Could not fetch SOL price, using default value");

            return 150;
        } catch (error) {
            console.error("Error fetching SOL price:", error);

            return 150;
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
                fiatFee: fiatFee,
                gasPrice: totalCostSOL.toString(),
                totalCost: totalCostSOL.toString(),
            };
        } catch (error) {
            console.error("Error getting Solana transaction cost:", error);

            const baseFee = 0.00005;

            return {
                estimatedGas: 50000,
                fiatFee: baseFee,
                gasPrice: baseFee.toString(),
                totalCost: baseFee.toString(),
            };
        }
    }

    /**
     * Get Solana address details (balance, tokenHoldings, etc.) from the backend.
     * @param address - Solana wallet address
     * @param params - Optional query params, e.g. { source: 'oklink' } to force OKLink
     */
    async getWalletDetails(address: string, params?: { source?: string }): Promise<any> {
        const url = `${this._baseUrl}/api/solana/address/${address}`;

        try {
            return this._httpWrapper
                .sendRequest("get", url, params ?? {})
                .then((response) => response)
                .catch(() => this._defaultResponse());
        } catch (error) {
            console.error("Exception in Solana getWalletDetails:", error);

            return Promise.resolve(this._defaultResponse());
        }
    }

    checkIfValidAddress(address: string): boolean {
        return this.isValidSolanaAddress(address);
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

    async requestTransactionDetails(transactionHash: string): Promise<{ data: any }> {
        return this._httpWrapper.sendRequest("get", `${this._baseUrl}/api/solana/transaction/${transactionHash}`);
    }

    async requestTransactionHistory(address: string, pagination: { page: number; show?: number }): Promise<any> {
        const url = `${this._baseUrl}/api/solana/transactions/${address}`;

        const params = {
            page: pagination.page,
            show: pagination.show || 25,
        };

        try {
            return this._httpWrapper
                .sendRequest("get", url, params)
                .then((response) => response)
                .catch(() => ({ data: [] }));
        } catch (error) {
            console.error("Exception in Solana requestTransactionHistory:", error);

            return Promise.resolve({ data: [] });
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
            const connection = await this._connectionReady;

            const fromKeypair = await this._getKeypairFromMnemonic(mnemonic);
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
            console.error("Serialized transaction failed:", error);

            if (error.logs) {
                console.error("Solana transaction logs:", error.logs);
            } else if (typeof error.getLogs === "function") {
                console.error("Solana transaction logs (from getLogs):", error.getLogs());
            }

            const msg = error.message || "";
            if (msg.includes("insufficient lamports") || msg.includes("Fondos insuficientes") || msg.includes("insufficient funds for rent")) {
                throw new Error("errors.solana_insufficient_sol_for_fees");
            }

            throw error;
        }
    }

    async sendTransaction(params: TransactionParams): Promise<TransactionResult> {
        if (!params.mnemonic) throw new Error("Mnemonic is required for Solana transactions");

        const hash = await this._sendTokens(params.mnemonic, params.to, params.tokenAddress || "", parseFloat(params.value));

        return {
            hash,
            status: "confirmed",
        };
    }
}
