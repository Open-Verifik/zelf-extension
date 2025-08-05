import { forkJoin, from, Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { Injectable } from "@angular/core";

import { environment } from "environments/environment";

import { Transaction, WalletModel, TransactionDetailModel, BitcoinTransactionModel, SuiTransactionModel } from "app/wallet";
import { FeeCalculationParams, TransactionFeeEstimate, TransactionParams, TransactionResult } from "../core/models/transaction-fee.model";
import { EthereumService } from "../eth.service";
import { SolanaService } from "../solana.service";
import { AvaxService } from "./avax.service";
import { BitcoinService } from "./bitcoin.service";
import { BscService } from "./bsc.service";
import { NetworkName } from "./network.service";
import { PolygonService } from "./polygon.service";
import { SuiService } from "./sui.service";

@Injectable({
    providedIn: "root",
})
export class BlockchainTransactionsService {
    constructor(
        private _avaxService: AvaxService,
        private _bitcoinService: BitcoinService,
        private _bscService: BscService,
        private _ethereumService: EthereumService,
        private _polygonService: PolygonService,
        private _solanaService: SolanaService,
        private _suiService: SuiService
    ) {}

    private _processTransactions(responses: any): Transaction[] {
        const transactions: Transaction[] = [];

        if (responses.ethereum?.data) {
            const ethImage = responses.ethereum.data.tokenHoldings?.tokens?.find((t: any) => t.symbol === "ETH")?.image;

            if (responses.ethereum.data.transactions) {
                transactions.push(
                    ...responses.ethereum.data.transactions.map((tx: any) => ({
                        ...tx,
                        image: ethImage,
                    }))
                );
            }
        }

        if (responses.avalanche?.data?.transactions) transactions.push(...responses.avalanche.data.transactions);
        if (responses.binance?.data?.transactions) transactions.push(...responses.binance.data.transactions);
        if (responses.bitcoin?.data?.transactions) transactions.push(...responses.bitcoin.data.transactions);
        if (responses.polygon?.data?.transactions) transactions.push(...responses.polygon.data.transactions);
        if (responses.solana?.data?.transactions) transactions.push(...responses.solana.data.transactions);
        if (responses.sui?.data?.transactions) transactions.push(...responses.sui.data.transactions);

        return transactions;
    }

    async calculateTransactionFees(params: FeeCalculationParams): Promise<TransactionFeeEstimate> {
        const { network, receiverAddress, amount, tokenType, tokenAddress, tokenDecimals, tokenPrice, selectedFeeRate } = params;

        try {
            switch (network.toLowerCase()) {
                case "bitcoin":
                    return await this._bitcoinService.calculateTransactionFees(amount, tokenPrice || 0, selectedFeeRate || 10);
                case "solana":
                    return await this._solanaService.calculateTransactionFees(tokenAddress, amount, tokenPrice || 0);
                case "sui":
                    return await this._suiService.calculateTransactionFees(
                        receiverAddress,
                        amount,
                        tokenType,
                        tokenAddress,
                        tokenDecimals,
                        tokenPrice || 0,
                        params.senderAddress
                    );
                case "polygon":
                    return await this._polygonService.calculateTransactionFees(
                        receiverAddress,
                        amount,
                        tokenType,
                        tokenAddress,
                        tokenDecimals,
                        params.senderAddress
                    );
                case "binance":
                    return await this._bscService.calculateTransactionFees(
                        receiverAddress,
                        amount,
                        tokenType,
                        tokenAddress,
                        tokenDecimals,
                        params.senderAddress
                    );
                case "avalanche":
                    return await this._avaxService.calculateTransactionFees(
                        receiverAddress,
                        amount,
                        tokenAddress,
                        tokenDecimals,
                        params.senderAddress
                    );
                case "ethereum":
                default:
                    return await this._ethereumService.calculateTransactionFees(
                        receiverAddress,
                        amount,
                        tokenType,
                        tokenAddress,
                        tokenDecimals,
                        params.senderAddress
                    );
            }
        } catch (error) {
            console.error(`Error calculating fees for ${network}:`, error);

            const amountInUsd = amount * (tokenPrice || 0);

            return {
                fee: 0,
                fiatFee: 0,
                total: amountInUsd,
                networkPrice: 0,
            };
        }
    }

    generateShareLink(hash: string, network: NetworkName): string {
        if (network === "avalanche") return `https://avascan.info/blockchain/c/tx/${hash}`;
        if (network === "binance") return `https://bscscan.com/tx/${hash}`;
        if (network === "bitcoin") return `https://mempool.space/tx/${hash}`;
        if (network === "bitcoinTestnet") return `https://mempool.space/testnet/tx/${hash}`;
        if (network === "ethereum") return `http://etherscan.io/tx/${hash}`;
        if (network === "polygon") return `https://polygonscan.com/tx/${hash}`;
        if (network === "solana") return `https://solscan.io/tx/${hash}`;
        if (network === "sui") return `https://suiscan.xyz/tx/${hash}`;

        return "";
    }

    getAddressData(wallet: Partial<WalletModel> | null): Observable<any> {
        if (!wallet) return of([]);

        return forkJoin({
            ethereum: wallet.ethAddress ? from(this._ethereumService.getWalletDetails(wallet.ethAddress)).pipe(catchError(() => of(null))) : of(null),
            avalanche: wallet.ethAddress ? from(this._avaxService.getWalletDetails(wallet.ethAddress)).pipe(catchError(() => of(null))) : of(null),
            binance: wallet.ethAddress ? from(this._bscService.getWalletDetails(wallet.ethAddress)).pipe(catchError(() => of(null))) : of(null),
            bitcoin: wallet.btcAddress
                ? from(this._bitcoinService.getWalletDetails(wallet.btcAddress, false)).pipe(catchError(() => of(null)))
                : of(null),
            bitcoinTestnet: environment.testnetAddress
                ? from(this._bitcoinService.getWalletDetails(environment.testnetAddress, true)).pipe(catchError(() => of(null)))
                : of(null),
            polygon: wallet.ethAddress ? from(this._polygonService.getWalletDetails(wallet.ethAddress)).pipe(catchError(() => of(null))) : of(null),
            solana: wallet.solanaAddress
                ? from(this._solanaService.getWalletDetails(wallet.solanaAddress)).pipe(catchError(() => of(null)))
                : of(null),
            sui: wallet.suiAddress ? from(this._suiService.getWalletDetails(wallet.suiAddress)).pipe(catchError(() => of(null))) : of(null),
        }).pipe(
            map((responses) => {
                return {
                    ethereum: responses.ethereum,
                    avalanche: responses.avalanche,
                    binance: responses.binance,
                    bitcoin: responses.bitcoin,
                    bitcoinTestnet: responses.bitcoinTestnet,
                    polygon: responses.polygon,
                    solana: responses.solana,
                    sui: responses.sui,
                    transactions: this._processTransactions(responses),
                };
            })
        );
    }

    getAddressDataByToken(wallet: Partial<WalletModel> | null, token: string): Observable<any> {
        if (!wallet) return of([]);

        let observable: Observable<any> | null = null;

        if (wallet.ethAddress) {
            if (token === "ETH") {
                observable = forkJoin({ ethereum: from(this._ethereumService.getWalletDetails(wallet.ethAddress)) });
            } else if (token === "AVAX") {
                observable = forkJoin({ avalanche: from(this._avaxService.getWalletDetails(wallet.ethAddress)) });
            } else if (token === "BNB") {
                observable = forkJoin({ binance: from(this._bscService.getWalletDetails(wallet.ethAddress)) });
            } else if (token === "POL") {
                observable = forkJoin({ polygon: from(this._polygonService.getWalletDetails(wallet.ethAddress)) });
            }
        }

        if (wallet.solanaAddress) {
            if (token === "SOL") {
                observable = forkJoin({ ethereum: from(this._solanaService.getWalletDetails(wallet.solanaAddress)) });
            }
        }

        if (wallet.suiAddress) {
            if (token === "SUI") {
                observable = forkJoin({ sui: from(this._suiService.getWalletDetails(wallet.suiAddress)) });
            }
        }

        return observable
            ? observable.pipe(
                  map((responses) => {
                      return {
                          ethereum: responses.ethereum,
                          avalanche: responses.avalanche,
                          binance: responses.binance,
                          bitcoin: responses.bitcoin,
                          bitcoinTestnet: responses.bitcoinTestnet,
                          polygon: responses.polygon,
                          solana: responses.solana,
                          sui: responses.sui,
                          transactions: this._processTransactions(responses),
                      };
                  })
              )
            : of([]);
    }

    getTransactionHistory(wallet: Partial<WalletModel> | null, pagination: { page: number }): Observable<any> {
        if (!wallet) return of([]);

        return forkJoin({
            avalanche: wallet.ethAddress
                ? from(this._avaxService.requestTransactionHistory(wallet.ethAddress, pagination)).pipe(catchError(() => of(null)))
                : of(null),
            binance: wallet.ethAddress
                ? from(this._bscService.requestTransactionHistory(wallet.ethAddress, pagination)).pipe(catchError(() => of(null)))
                : of(null),
            bitcoin: wallet.btcAddress
                ? from(this._bitcoinService.requestTransactionHistory(wallet.btcAddress, pagination, false)).pipe(catchError(() => of(null)))
                : of(null),
            bitcoinTestnet: environment.testnetAddress
                ? from(this._bitcoinService.requestTransactionHistory(environment.testnetAddress, pagination, true)).pipe(catchError(() => of(null)))
                : of(null),
            ethereum: wallet.ethAddress
                ? from(this._ethereumService.requestTransactionHistory(wallet.ethAddress, pagination)).pipe(catchError(() => of(null)))
                : of(null),
            polygon: wallet.ethAddress
                ? from(this._polygonService.requestTransactionHistory(wallet.ethAddress, pagination)).pipe(catchError(() => of(null)))
                : of(null),
            solana: wallet.solanaAddress
                ? from(this._solanaService.requestTransactionHistory(wallet.solanaAddress, pagination)).pipe(catchError(() => of(null)))
                : of(null),
            sui: wallet.suiAddress
                ? from(this._suiService.requestTransactionHistory(wallet.suiAddress, pagination)).pipe(catchError(() => of(null)))
                : of(null),
        }).pipe(map((responses) => this._processTransactions(responses)));
    }

    processTransactionResponse(response: any, network: string): Transaction | null {
        if (!response || !response.data) {
            return null;
        }

        const networkLower = network.toLowerCase();

        switch (networkLower) {
            case "ethereum":
            case "avalanche":
            case "binance":
            case "polygon":
            case "solana":
                return new TransactionDetailModel(response.data).toTransaction();
            case "sui":
                return new SuiTransactionModel(response.data).toTransaction();
            case "bitcoin":
                return new BitcoinTransactionModel(response.data[0]).toTransaction();
            default:
                throw new Error(`Unsupported network for transaction processing: ${network}`);
        }
    }

    async requestTransactionDetails(hash: string, network: string): Promise<any> {
        const networkLower = network.toLowerCase();

        try {
            let promise: Promise<any> | null = null;

            switch (networkLower) {
                case "ethereum":
                    promise = this._ethereumService.requestTransactionDetails(hash);
                    break;
                case "avalanche":
                    promise = this._avaxService.requestTransactionDetails(hash);
                    break;
                case "sui":
                    promise = this._suiService.requestTransactionDetails(hash);
                    break;
                case "solana":
                    promise = this._solanaService.requestTransactionDetails(hash);
                    break;
                case "bitcoin":
                    promise = this._bitcoinService.requestTransactionDetails(hash);
                    break;
                case "binance":
                    promise = this._bscService.requestTransactionDetails(hash);
                    break;
                case "polygon":
                    promise = this._polygonService.requestTransactionDetails(hash);
                    break;
                default:
                    throw new Error(`Unsupported network: ${network}`);
            }

            if (!promise) throw new Error(`No service available for network: ${network}`);

            return await promise;
        } catch (error) {
            console.error(`Error requesting transaction details for ${network}:`, error);

            throw error;
        }
    }

    async sendTransaction(params: TransactionParams): Promise<TransactionResult> {
        const network = params.network?.toLowerCase() || "ethereum";

        try {
            switch (network) {
                case "bitcoin":
                    return await this._bitcoinService.sendTransaction(params);
                case "solana":
                    return await this._solanaService.sendTransaction(params);
                case "sui":
                    return await this._suiService.sendTransaction(params);
                case "avalanche":
                    return await this._avaxService.sendTransaction(params);
                case "ethereum":
                    return await this._ethereumService.sendTransaction(params);
                case "polygon":
                    return await this._polygonService.sendTransaction(params);
                case "binance":
                    return await this._bscService.sendTransaction(params);
                default:
                    throw new Error(`Unsupported network: ${network}`);
            }
        } catch (error) {
            console.error(`Error sending transaction on ${network}:`, error);

            throw error;
        }
    }
}
