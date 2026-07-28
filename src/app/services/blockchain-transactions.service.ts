import { isEmptyTransactionApiPayload } from "app/core/utils/empty-transaction-api-payload.util";
import { forkJoin, from, Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { Injectable } from "@angular/core";

import { environment } from "environments/environment";

import {
    Transaction,
    TransactionDetailModel,
    TransactionModel,
    BitcoinTransactionModel,
    SuiTransactionModel,
    BlockDAGTransactionModel,
} from "@shared/types/wallet.types";
import { FeeCalculationParams, TransactionFeeEstimate, TransactionParams, TransactionResult } from "../core/models/transaction-fee.model";
import { EthereumService } from "../eth.service";
import { SolanaService } from "../solana.service";
import { AvaxService } from "./avax.service";
import { BitcoinService } from "./bitcoin.service";
import { BlockDAGService } from "./blockdag.service";
import { BscService } from "./bsc.service";
import { NetworkName } from "./network.service";
import { PolygonService } from "./polygon.service";
import { StellarService } from "./stellar.service";
import { SuiService } from "./sui.service";
import { TonService } from "./ton.service";
import { readPublicDataDotAddress, readPublicDataKsmAddress, readPublicDataXlmAddress } from "@shared/types/tag.types";
import { TagModel } from "app/tags.service";
import { SubstrateRelayService } from "./substrate-relay.service";

@Injectable({
    providedIn: "root",
})
export class BlockchainTransactionsService {
    constructor(
        private _avaxService: AvaxService,
        private _bitcoinService: BitcoinService,
        private _blockdagService: BlockDAGService,
        private _bscService: BscService,
        private _ethereumService: EthereumService,
        private _polygonService: PolygonService,
        private _solanaService: SolanaService,
        private _stellarService: StellarService,
        private _suiService: SuiService,
        private _tonService: TonService,
        private _substrateRelayService: SubstrateRelayService
    ) {}

    private _getXlmAddress(wallet: Partial<TagModel> | null | undefined): string {
        return readPublicDataXlmAddress(wallet?.publicData as Record<string, unknown> | undefined);
    }

    private _getDotAddress(wallet: Partial<TagModel> | null | undefined): string {
        return readPublicDataDotAddress(wallet?.publicData as Record<string, unknown> | undefined);
    }

    private _getKsmAddress(wallet: Partial<TagModel> | null | undefined): string {
        return readPublicDataKsmAddress(wallet?.publicData as Record<string, unknown> | undefined);
    }

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
        if (responses.blockdag?.data?.transactions) transactions.push(...responses.blockdag.data.transactions);
        if (responses.polygon?.data?.transactions) transactions.push(...responses.polygon.data.transactions);
        if (responses.solana?.data?.transactions) transactions.push(...responses.solana.data.transactions);
        if (responses.stellar?.data?.transactions) {
            const stellarPrice = parseFloat(responses.stellar.data.account?.price || "0") || 0;
            transactions.push(
                ...responses.stellar.data.transactions.map((tx: any) => ({
                    ...tx,
                    network: "stellar",
                    gasFee: parseFloat(tx.fee || 0) || 0,
                    fiatAmount: (tx.amount || 0) * stellarPrice,
                }))
            );
        }
        if (responses.sui?.data?.transactions) transactions.push(...responses.sui.data.transactions);
        if (responses.ton?.data?.transactions) {
            transactions.push(
                ...responses.ton.data.transactions.map((tx: any) => ({
                    ...tx,
                    network: tx.network || "ton",
                }))
            );
        }

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
                case "stellar":
                    return await this._stellarService.calculateTransactionFees(
                        receiverAddress,
                        amount,
                        tokenPrice || 0,
                        tokenAddress,
                        tokenDecimals
                    );
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
                case "blockdag":
                    return await this._blockdagService.calculateTransactionFees(
                        receiverAddress,
                        amount.toString(),
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
                case "polkadot":
                    return await this._substrateRelayService.calculateTransactionFees("polkadot", params.senderAddress || "", receiverAddress, amount, tokenPrice || 0);
                case "kusama":
                case "ksm":
                    return await this._substrateRelayService.calculateTransactionFees("kusama", params.senderAddress || "", receiverAddress, amount, tokenPrice || 0);
                case "ton":
                    return await this._tonService.calculateTransactionFees(amount, tokenPrice || 0);
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
        if (network === "blockdag") return `https://bdagscan.com/tx/${hash}`;
        if (network === "ethereum") return `http://etherscan.io/tx/${hash}`;
        if (network === "polygon") return `https://polygonscan.com/tx/${hash}`;
        if (network === "solana") return `https://solscan.io/tx/${hash}`;
        if (network === "stellar") return `https://stellar.expert/explorer/public/tx/${hash}`;
        if (network === "sui") return `https://suiscan.xyz/tx/${hash}`;
        if (network === "ton") return `https://tonviewer.com/transaction/${hash}`;
        if (network === "polkadot") return `https://polkadot.subscan.io/extrinsic/${hash}`;
        if (network === "kusama") return `https://kusama.subscan.io/extrinsic/${hash}`;

        return "";
    }

    getAddressData(wallet: Partial<TagModel> | null, enabledNetworks?: string[]): Observable<any> {
        if (!wallet) return of([]);

        const isEnabled = (network: string) => !enabledNetworks || enabledNetworks.includes(network);
        const xlmAddr = this._getXlmAddress(wallet);
        const dotAddr = this._getDotAddress(wallet);
        const ksmAddr = this._getKsmAddress(wallet);

        return forkJoin({
            ethereum:
                isEnabled("ethereum") && wallet.publicData?.ethAddress
                    ? from(this._ethereumService.getWalletDetails(wallet.publicData?.ethAddress)).pipe(catchError(() => of(null)))
                    : of(null),
            avalanche:
                isEnabled("avalanche") && wallet.publicData?.ethAddress
                    ? from(this._avaxService.getWalletDetails(wallet.publicData?.ethAddress)).pipe(catchError(() => of(null)))
                    : of(null),
            binance:
                isEnabled("binance") && wallet.publicData?.ethAddress
                    ? from(this._bscService.getWalletDetails(wallet.publicData?.ethAddress)).pipe(catchError(() => of(null)))
                    : of(null),
            bitcoin:
                isEnabled("bitcoin") && wallet.publicData?.btcAddress
                    ? from(this._bitcoinService.getWalletDetails(wallet.publicData?.btcAddress, false)).pipe(catchError(() => of(null)))
                    : of(null),
            bitcoinTestnet:
                isEnabled("bitcoin") && environment.testnetAddress
                    ? from(this._bitcoinService.getWalletDetails(environment.testnetAddress, true)).pipe(catchError(() => of(null)))
                    : of(null),
            blockdag:
                isEnabled("blockdag") && wallet.publicData?.ethAddress
                    ? from(this._blockdagService.getWalletDetails(wallet.publicData?.ethAddress)).pipe(catchError(() => of(null)))
                    : of(null),
            polygon:
                isEnabled("polygon") && wallet.publicData?.ethAddress
                    ? from(this._polygonService.getWalletDetails(wallet.publicData?.ethAddress)).pipe(catchError(() => of(null)))
                    : of(null),
            solana:
                isEnabled("solana") && wallet.publicData?.solanaAddress
                    ? from(this._solanaService.getWalletDetails(wallet.publicData?.solanaAddress)).pipe(catchError(() => of(null)))
                    : of(null),
            stellar:
                isEnabled("stellar") && xlmAddr
                    ? from(this._stellarService.getWalletDetails(xlmAddr)).pipe(catchError(() => of(null)))
                    : of(null),
            sui:
                isEnabled("sui") && wallet.publicData?.suiAddress
                    ? from(this._suiService.getWalletDetails(wallet.publicData?.suiAddress)).pipe(catchError(() => of(null)))
                    : of(null),
            ton:
                isEnabled("ton") && wallet.publicData?.tonAddress
                    ? from(this._tonService.getWalletDetails(wallet.publicData?.tonAddress)).pipe(catchError(() => of(null)))
                    : of(null),
            polkadot:
                isEnabled("polkadot") && dotAddr
                    ? from(this._substrateRelayService.getWalletDetails("polkadot", dotAddr)).pipe(catchError(() => of(null)))
                    : of(null),
            kusama:
                isEnabled("kusama") && ksmAddr
                    ? from(this._substrateRelayService.getWalletDetails("kusama", ksmAddr)).pipe(catchError(() => of(null)))
                    : of(null),
        }).pipe(
            map((responses) => {
                return {
                    ethereum: responses.ethereum,
                    avalanche: responses.avalanche,
                    binance: responses.binance,
                    bitcoin: responses.bitcoin,
                    bitcoinTestnet: responses.bitcoinTestnet,
                    blockdag: responses.blockdag,
                    polygon: responses.polygon,
                    solana: responses.solana,
                    stellar: responses.stellar,
                    sui: responses.sui,
                    ton: responses.ton,
                    polkadot: responses.polkadot,
                    kusama: responses.kusama,
                    transactions: this._processTransactions(responses),
                };
            })
        );
    }

    getAddressDataByToken(wallet: Partial<TagModel> | null, token: string): Observable<any> {
        if (!wallet) return of([]);

        let observable: Observable<any> | null = null;

        if (wallet.publicData?.ethAddress) {
            if (token === "ETH") {
                observable = forkJoin({ ethereum: from(this._ethereumService.getWalletDetails(wallet.publicData?.ethAddress)) });
            } else if (token === "AVAX") {
                observable = forkJoin({ avalanche: from(this._avaxService.getWalletDetails(wallet.publicData?.ethAddress)) });
            } else if (token === "BDAG") {
                observable = forkJoin({ blockdag: from(this._blockdagService.getWalletDetails(wallet.publicData?.ethAddress)) });
            } else if (token === "BNB") {
                observable = forkJoin({ binance: from(this._bscService.getWalletDetails(wallet.publicData?.ethAddress)) });
            } else if (token === "POL") {
                observable = forkJoin({ polygon: from(this._polygonService.getWalletDetails(wallet.publicData?.ethAddress)) });
            }
        }

        if (wallet.publicData?.solanaAddress) {
            if (token === "SOL") {
                observable = forkJoin({ ethereum: from(this._solanaService.getWalletDetails(wallet.publicData?.solanaAddress)) });
            }
        }

        if (wallet.publicData?.suiAddress) {
            if (token === "SUI") {
                observable = forkJoin({ sui: from(this._suiService.getWalletDetails(wallet.publicData?.suiAddress)) });
            }
        }

        if (wallet.publicData?.tonAddress) {
            if (token === "TON") {
                observable = forkJoin({ ton: from(this._tonService.getWalletDetails(wallet.publicData?.tonAddress)) });
            }
        }

        const xlmAddr = this._getXlmAddress(wallet);

        if (xlmAddr) {
            if (token === "XLM") {
                observable = forkJoin({ stellar: from(this._stellarService.getWalletDetails(xlmAddr)) });
            }
        }

        const dotAddress = this._getDotAddress(wallet);
        if (dotAddress && token === "DOT") {
            observable = forkJoin({ polkadot: from(this._substrateRelayService.getWalletDetails("polkadot", dotAddress)) });
        }

        const ksmAddress = this._getKsmAddress(wallet);
        if (ksmAddress && token === "KSM") {
            observable = forkJoin({ kusama: from(this._substrateRelayService.getWalletDetails("kusama", ksmAddress)) });
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
                          blockdag: responses.blockdag,
                          polygon: responses.polygon,
                          solana: responses.solana,
                          stellar: responses.stellar,
                          sui: responses.sui,
                          ton: responses.ton,
                          polkadot: responses.polkadot,
                          kusama: responses.kusama,
                          transactions: this._processTransactions(responses),
                      };
                  })
              )
            : of([]);
    }

    getTransactionHistory(wallet: Partial<TagModel> | null, pagination: { page: number }, enabledNetworks?: string[]): Observable<any> {
        if (!wallet) return of([]);

        const isEnabled = (network: string) => !enabledNetworks || enabledNetworks.includes(network);
        const xlmAddr = this._getXlmAddress(wallet);

        return forkJoin({
            avalanche:
                isEnabled("avalanche") && wallet.publicData?.ethAddress
                    ? from(this._avaxService.requestTransactionHistory(wallet.publicData?.ethAddress, pagination)).pipe(catchError(() => of(null)))
                    : of(null),
            binance:
                isEnabled("binance") && wallet.publicData?.ethAddress
                    ? from(this._bscService.requestTransactionHistory(wallet.publicData?.ethAddress, pagination)).pipe(catchError(() => of(null)))
                    : of(null),
            bitcoin:
                isEnabled("bitcoin") && wallet.publicData?.btcAddress
                    ? from(this._bitcoinService.requestTransactionHistory(wallet.publicData?.btcAddress, pagination, false)).pipe(
                          catchError(() => of(null))
                      )
                    : of(null),
            bitcoinTestnet:
                isEnabled("bitcoin") && environment.testnetAddress
                    ? from(this._bitcoinService.requestTransactionHistory(environment.testnetAddress, pagination, true)).pipe(
                          catchError(() => of(null))
                      )
                    : of(null),
            blockdag:
                isEnabled("blockdag") && wallet.publicData?.ethAddress
                    ? from(this._blockdagService.requestTransactionHistory(wallet.publicData?.ethAddress, pagination)).pipe(
                          catchError(() => of(null))
                      )
                    : of(null),
            ethereum:
                isEnabled("ethereum") && wallet.publicData?.ethAddress
                    ? from(this._ethereumService.requestTransactionHistory(wallet.publicData?.ethAddress, pagination)).pipe(
                          catchError(() => of(null))
                      )
                    : of(null),
            polygon:
                isEnabled("polygon") && wallet.publicData?.ethAddress
                    ? from(this._polygonService.requestTransactionHistory(wallet.publicData?.ethAddress, pagination)).pipe(catchError(() => of(null)))
                    : of(null),
            solana:
                isEnabled("solana") && wallet.publicData?.solanaAddress
                    ? from(this._solanaService.requestTransactionHistory(wallet.publicData?.solanaAddress, pagination)).pipe(
                          catchError(() => of(null))
                      )
                    : of(null),
            stellar:
                isEnabled("stellar") && xlmAddr
                    ? from(this._stellarService.requestTransactionHistory(xlmAddr, pagination)).pipe(catchError(() => of(null)))
                    : of(null),
            sui:
                isEnabled("sui") && wallet.publicData?.suiAddress
                    ? from(this._suiService.requestTransactionHistory(wallet.publicData?.suiAddress, pagination)).pipe(catchError(() => of(null)))
                    : of(null),
            ton:
                isEnabled("ton") && wallet.publicData?.tonAddress
                    ? from(this._tonService.requestTransactionHistory(wallet.publicData?.tonAddress, pagination)).pipe(catchError(() => of(null)))
                    : of(null),
        }).pipe(map((responses) => this._processTransactions(responses)));
    }

    private _stellarTxToTransaction(data: any): Transaction {
        const STROOPS_TO_XLM = 1 / 10_000_000;
        if (data.hash && typeof data.traffic === "string") {
            return new TransactionModel({ ...data, network: "stellar", gasFee: parseFloat(data.fee || 0) || 0 }) as Transaction;
        }
        const created = data.created_at ? new Date(data.created_at) : new Date();
        const feeXLM = ((parseInt(data.fee_charged || 0, 10) || 0) * STROOPS_TO_XLM).toString();
        return new TransactionModel({
            hash: data.hash || data.id || "",
            from: data.source_account || "",
            to: null,
            amount: 0,
            asset: "XLM",
            date: created.toISOString().slice(0, 10),
            age: "",
            gasFee: parseFloat(feeXLM) || 0,
            status: data.successful ? "Success" : "Failed",
            traffic: "",
            network: "stellar",
            fiatAmount: 0,
        }) as Transaction;
    }

    processTransactionResponse(response: any, network: string): Transaction | null {
        if (!response || response.data == null) {
            return null;
        }

        if (isEmptyTransactionApiPayload(response.data)) {
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
            case "stellar":
                return this._stellarTxToTransaction(response.data);
            case "blockdag":
                return new BlockDAGTransactionModel(response.data).toTransaction();
            case "sui":
                return new SuiTransactionModel(response.data).toTransaction();
            case "ton":
                return new TransactionModel({ ...response.data, network: "ton" }) as Transaction;
            case "bitcoin":
                return new BitcoinTransactionModel(response.data[0]).toTransaction();
            default:
                throw new Error(`Unsupported network for transaction processing: ${network}`);
        }
    }

    /**
     * @param polygonSource — optional rotation hint forwarded to the Polygon backend
     * (`"rpc" | "bogota"`) so each backend call stays a single fast attempt.
     */
    async requestTransactionDetails(hash: string, network: string, polygonSource?: "rpc" | "bogota"): Promise<any> {
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
                case "blockdag":
                    promise = this._blockdagService.requestTransactionDetails(hash);
                    break;
                case "sui":
                    promise = this._suiService.requestTransactionDetails(hash);
                    break;
                case "ton":
                    promise = this._tonService.requestTransactionDetails(hash);
                    break;
                case "solana":
                    promise = this._solanaService.requestTransactionDetails(hash);
                    break;
                case "stellar":
                    promise = this._stellarService.requestTransactionDetails(hash);
                    break;
                case "bitcoin":
                    promise = this._bitcoinService.requestTransactionDetails(hash);
                    break;
                case "binance":
                    promise = this._bscService.requestTransactionDetails(hash);
                    break;
                case "polygon":
                    promise = this._polygonService.requestTransactionDetails(hash, polygonSource);
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
                case "blockdag":
                    return await this._blockdagService.sendTransaction(params);
                case "solana":
                    return await this._solanaService.sendTransaction(params);
                case "stellar":
                    return await this._stellarService.sendTransaction(params);
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
                case "polkadot":
                    return await this._substrateRelayService.sendTransaction(params);
                case "kusama":
                case "ksm":
                    return await this._substrateRelayService.sendTransaction({ ...params, network: "kusama" });
                case "ton":
                    return await this._tonService.sendTransaction(params);
                default:
                    throw new Error(`Unsupported network: ${network}`);
            }
        } catch (error) {
            console.error(`Error sending transaction on ${network}:`, error);

            throw error;
        }
    }
}
