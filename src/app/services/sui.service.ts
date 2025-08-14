import { Injectable } from "@angular/core";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";

import { SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { HttpWrapperService } from "app/http-wrapper.service";
import { environment } from "environments/environment";
import { TransactionFeeEstimate, TransactionParams, TransactionResult } from "../core/models/transaction-fee.model";

interface TransactionCostEstimate {
    estimatedFee: number;
    estimatedFeeUsd: number;
}

@Injectable({
    providedIn: "root",
})
export class SuiService {
    private _baseUrl: string = environment.apiUrl;
    private _suiClient: SuiClient;

    private readonly _clientConfigs = {
        mainnet: {
            chainName: "Sui Mainnet",
            url: environment.suiRpc.mainnet,
            blockExplorerUrls: ["https://suiexplorer.com"],
            nativeCurrency: {
                decimals: 9,
                name: "SUI",
                symbol: "SUI",
            },
        },
        testnet: {
            chainName: "Sui Testnet",
            url: environment.suiRpc.testnet,
            blockExplorerUrls: ["https://suiexplorer.com/?network=testnet"],
            nativeCurrency: {
                decimals: 9,
                name: "SUI",
                symbol: "SUI",
            },
        },
        devnet: {
            chainName: "Sui Devnet",
            url: environment.suiRpc.devnet,
            blockExplorerUrls: ["https://suiexplorer.com/?network=devnet"],
            nativeCurrency: {
                decimals: 9,
                name: "SUI",
                symbol: "SUI",
            },
        },
    };

    constructor(private _httpWrapper: HttpWrapperService) {
        this._suiClient = new SuiClient({ url: this._clientConfigs.mainnet.url });
    }

    private _defaultResponse(): any {
        return {
            data: {
                _balance: 0,
                balance: "0",
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

    private async _transferSui(mnemonic: string, recipientAddress: string, amount?: number): Promise<any> {
        try {
            const keypair = Ed25519Keypair.deriveKeypair(mnemonic);

            const tx = new TransactionBlock();
            const amountInMist = Math.floor((amount || 0) * 1_000_000_000);
            const [coin] = tx.splitCoins(tx.gas, [tx.pure(amountInMist)]);

            tx.transferObjects([coin], tx.pure(recipientAddress));

            const result = await this._suiClient.signAndExecuteTransactionBlock({
                signer: keypair,
                transactionBlock: tx,
                options: {
                    showEffects: true,
                    showEvents: true,
                    showObjectChanges: true,
                },
            });

            if (result.effects?.status?.error) throw new Error(`Transaction failed: ${result.effects.status.error}`);

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

    private async _transferToken(mnemonic: string, recipientAddress: string, tokenObjectId: string, amount: number): Promise<any> {
        try {
            const keypair = Ed25519Keypair.deriveKeypair(mnemonic);
            const senderAddress = keypair.getPublicKey().toSuiAddress();

            const walletDetails = await this.getWalletDetails(senderAddress);
            const tokenInfo = walletDetails?.data?.tokenHoldings?.tokens?.find((token: any) => token.address_token === tokenObjectId);

            if (!tokenInfo) throw new Error(`Token information not found for address: ${tokenObjectId}`);

            const actualTokenBalance = Number(tokenInfo.amount || 0);

            if (actualTokenBalance < amount) throw new Error(`Insufficient token balance. Available: ${actualTokenBalance}, Required: ${amount}`);

            const coinType = `${tokenObjectId}::coin::COIN`;

            const { data: tokenObjects } = await this._suiClient.getOwnedObjects({
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

            const result = await this._suiClient.signAndExecuteTransactionBlock({
                signer: keypair,
                transactionBlock: tx,
                options: {
                    showEffects: true,
                    showEvents: true,
                    showInput: true,
                },
            });

            if (result.effects?.status?.error) throw new Error(`Transaction failed: ${result.effects.status.error}`);

            return { ...result, transactionHash: result.digest };
        } catch (error: any) {
            console.error("Error in token transfer:", error);

            throw error;
        }
    }

    async calculateTransactionFees(
        receiverAddress: string,
        amount: number,
        tokenType: string,
        tokenAddress: string | undefined,
        tokenDecimals: number | undefined,
        tokenPrice: number,
        senderAddress?: string
    ): Promise<TransactionFeeEstimate> {
        let feeEstimate;

        if (tokenType === "SUI") {
            feeEstimate = await this.estimateSuiTransactionFee(receiverAddress, amount, senderAddress);
        } else {
            if (!tokenAddress) throw new Error("Token address is required for SUI token transfers");

            feeEstimate = await this.estimateTokenTransactionFee(receiverAddress, tokenAddress, amount, tokenDecimals || 9, senderAddress);
        }

        const amountInUsd = amount * tokenPrice;

        return {
            fee: feeEstimate.estimatedFee,
            fiatFee: feeEstimate.estimatedFeeUsd,
            total: amountInUsd + feeEstimate.estimatedFeeUsd,
        };
    }

    async estimateSuiTransactionFee(receiverAddress: string, amount: number, senderAddress?: string): Promise<TransactionCostEstimate> {
        try {
            const tx = new TransactionBlock();

            tx.setGasBudget(1000000);
            tx.setSender(senderAddress || "0x0000000000000000000000000000000000000000000000000000000000000000");

            const amountInMist = Math.floor(amount * 1_000_000_000);
            const [coin] = tx.splitCoins(tx.gas, [tx.pure(amountInMist)]);

            tx.transferObjects([coin], tx.pure(receiverAddress));

            const dryRunResult = await this._suiClient.dryRunTransactionBlock({
                transactionBlock: await tx.build({ client: this._suiClient }),
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
        decimals: number = 9,
        senderAddress?: string
    ): Promise<TransactionCostEstimate> {
        try {
            const tx = new TransactionBlock();

            tx.setGasBudget(1000000);
            tx.setSender(senderAddress || "0x0000000000000000000000000000000000000000000000000000000000000000");

            const amountInBaseUnits = BigInt(Math.floor(amount * Math.pow(10, decimals)));

            tx.moveCall({
                target: `${contractAddress}::transfer::transfer`,
                arguments: [tx.pure(amountInBaseUnits), tx.pure(receiverAddress)],
            });

            const dryRunResult = await this._suiClient.dryRunTransactionBlock({
                transactionBlock: await tx.build({ client: this._suiClient }),
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

    async getSuiBalance(address: string): Promise<number> {
        try {
            const { totalBalance } = await this._suiClient.getBalance({
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

    async getWalletDetails(address: string): Promise<any> {
        const url = `${this._baseUrl}/api/sui/address/${address}`;

        try {
            return this._httpWrapper
                .sendRequest("get", url)
                .then((response) => response)
                .catch(() => this._defaultResponse());
        } catch (error) {
            console.error("Exception in SUI getWalletDetails:", error);

            return Promise.resolve(this._defaultResponse());
        }
    }

    isValidSuiAddress(address: string): boolean {
        return /^0x[a-fA-F0-9]{64}$/.test(address);
    }

    async requestTransactionDetails(transactionHash: string): Promise<{ data: any }> {
        return this._httpWrapper.sendRequest("get", `${this._baseUrl}/api/sui/transaction/${transactionHash}`);
    }

    async requestTransactionHistory(address: string, pagination: { page: number; show?: number }): Promise<any> {
        const url = `${this._baseUrl}/api/sui/address/${address}/transactions`;

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
            console.error("Exception in SUI requestTransactionHistory:", error);

            return Promise.resolve({ data: [] });
        }
    }

    async sendTransaction(params: TransactionParams): Promise<TransactionResult> {
        if (!params.mnemonic) throw new Error("Mnemonic is required for SUI transactions");

        let hash: string;

        if (params.tokenAddress) {
            hash = await this._transferToken(params.mnemonic, params.to, params.tokenAddress, parseFloat(params.value));
        } else {
            hash = await this._transferSui(params.mnemonic, params.to, parseFloat(params.value));
        }

        return {
            hash,
            status: "pending",
        };
    }
}
