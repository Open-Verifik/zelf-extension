import { forkJoin, Observable, of } from "rxjs";
import { map } from "rxjs/operators";

import { Injectable, Injector } from "@angular/core";

import { environment } from "environments/environment";

import { HttpWrapperService } from "app/http-wrapper.service";
import { Transaction, WalletModel } from "app/wallet";
import { NetworkName } from "./network.service";
import { EthereumService } from "../eth.service";
import { SolanaService } from "../solana.service";
import { SuiService } from "./sui.service";
import { BitcoinService } from "./bitcoin.service";

@Injectable({
    providedIn: "root",
})
export class BlockchainTransactionsService {
    constructor(
        private _httpWrapperService: HttpWrapperService,
        private _ethereumService: EthereumService,
        private _solanaService: SolanaService,
        private _suiService: SuiService,
        private _injector: Injector
    ) {}

    getAddressData(wallet: Partial<WalletModel> | null): Observable<any> {
        if (!wallet) return of([]);

        return forkJoin({
            ethereum: this._httpWrapperService
                .sendRequest("get", `${environment.apiUrl}/api/ethereum/address`, {
                    address: wallet.ethAddress,
                })
                .catch(() => of(null)),
            avalanche: this._httpWrapperService
                .sendRequest("get", `${environment.apiUrl}/api/avalanche/address/${wallet.ethAddress}`, {})
                .catch(() => of(null)),
            solana: wallet.solanaAddress
                ? this._httpWrapperService
                      .sendRequest("get", `${environment.apiUrl}/api/solana/address/${wallet.solanaAddress}`, {})
                      .catch(() => of(null))
                : of(null),
            sui: wallet.suiAddress
                ? this._httpWrapperService.sendRequest("get", `${environment.apiUrl}/api/sui/address/${wallet.suiAddress}`, {}).catch(() => of(null))
                : of(null),
            bitcoin: wallet.btcAddress
                ? this._httpWrapperService
                      .sendRequest("get", `${environment.apiUrl}/api/bitcoin/address/${wallet.btcAddress}`, {})
                      .catch(() => of(null))
                : of(null),
            bitcoinTestnet: environment.testnetAddress
                ? this._httpWrapperService
                      .sendRequest("get", `${environment.apiUrl}/api/bitcoin/testnet/address/${environment.testnetAddress}`, {})
                      .catch(() => of(null))
                : of(null),
        }).pipe(
            map((responses) => {
                return {
                    avalanche: responses.avalanche,
                    bitcoin: responses.bitcoin,
                    bitcoinTestnet: responses.bitcoinTestnet,
                    ethereum: responses.ethereum,
                    solana: responses.solana,
                    sui: responses.sui,
                    transactions: this._processTransactions(responses),
                };
            })
        );
    }

    getTransactionHistory(wallet: Partial<WalletModel> | null, pagination: { page: number }): Observable<any> {
        if (!wallet) return of([]);

        return forkJoin({
            ethereum: this._httpWrapperService
                .sendRequest("get", `${environment.apiUrl}/api/ethereum/transactions`, {
                    address: wallet.ethAddress,
                    page: pagination.page,
                    show: 25,
                })
                .catch(() => of(null)),
            avalanche: this._httpWrapperService
                .sendRequest("get", `${environment.apiUrl}/api/avalanche/address/${wallet.ethAddress}/transactions`, {
                    page: pagination.page,
                    show: 25,
                })
                .catch(() => of(null)),
            solana: wallet.solanaAddress
                ? this._httpWrapperService
                      .sendRequest("get", `${environment.apiUrl}/api/solana/transactions/${wallet.solanaAddress}`, {
                          page: pagination.page,
                          show: 25,
                      })
                      .catch(() => of(null))
                : of(null),
            sui: wallet.suiAddress
                ? this._httpWrapperService
                      .sendRequest("get", `${environment.apiUrl}/api/sui/transactions/${wallet.suiAddress}`, {
                          page: pagination.page,
                          show: 25,
                      })
                      .catch(() => of(null))
                : of(null),
            bitcoin: wallet.btcAddress
                ? this._httpWrapperService
                      .sendRequest("get", `${environment.apiUrl}/api/bitcoin/transactions/${wallet.btcAddress}`, {
                          page: pagination.page,
                          show: 25,
                      })
                      .catch(() => of(null))
                : of(null),
            bitcoinTestnet: environment.testnetAddress
                ? this._httpWrapperService
                      .sendRequest("get", `${environment.apiUrl}/api/bitcoin/testnet/transactions/${environment.testnetAddress}`, {
                          page: pagination.page,
                          show: 25,
                      })
                      .catch(() => of(null))
                : of(null),
        }).pipe(
            map((responses) => {
                console.log(` BlockchainTransactionsService ~ map ~ responses:`, responses);
                return this._processTransactions(responses);
            })
        );
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

        if (responses.bitcoin?.data?.transactions) {
            transactions.push(...responses.bitcoin.data.transactions);
        }

        if (responses.avalanche?.data?.transactions) {
            transactions.push(...responses.avalanche.data.transactions);
        }

        if (responses.solana?.data?.transactions) {
            transactions.push(...responses.solana.data.transactions);
        }

        if (responses.sui?.data?.transactions) {
            transactions.push(...responses.sui.data.transactions);
        }

        return transactions;
    }

    generateShareLink(hash: string, network: NetworkName): string {
        if (network === "ethereum") {
            return `http://etherscan.io/tx/${hash}`;
        }

        if (network === "avalanche") {
            return `https://avascan.info/blockchain/c/tx/${hash}`;
        }

        if (network === "solana") {
            return `https://solscan.io/tx/${hash}`;
        }

        if (network === "sui") {
            return `https://suiscan.xyz/tx/${hash}`;
        }

        if (network === "bitcoin") {
            return `https://mempool.space/tx/${hash}`;
        }

        if (network === "bitcoinTestnet") {
            return `https://mempool.space/testnet/tx/${hash}`;
        }

        return "";
    }

    /**
     * Send a transaction on the appropriate blockchain based on network
     * @param txParams Transaction parameters including network, from, to, data, value
     * @returns Transaction hash or receipt
     */
    async sendTransaction(txParams: {
        from: string;
        to: string;
        data?: string;
        value?: string;
        chainId?: number;
        network?: string;
        privateKey?: string;
        mnemonic?: string;
        tokenAddress?: string;
    }): Promise<string> {
        const network = txParams.network?.toLowerCase() || "ethereum";

        switch (network) {
            case "ethereum":
            case "avalanche":
                if (!txParams.privateKey) {
                    throw new Error("Private key is required for Ethereum/Avalanche transactions");
                }

                if (txParams.tokenAddress) {
                    // ERC20 transfer
                    const result = await this._ethereumService.sendERC20Transaction(
                        txParams.value || "0",
                        txParams.privateKey,
                        txParams.to,
                        txParams.tokenAddress,
                        network
                    );
                    return result.transactionHash || result.hash;
                } else {
                    // Native token transfer
                    const result = await this._ethereumService.sendTransaction(txParams.value || "0", txParams.privateKey, txParams.to, network);
                    return result.transactionHash || result.hash;
                }

            case "solana":
                if (!txParams.mnemonic) {
                    throw new Error("Mnemonic is required for Solana transactions");
                }

                return this._solanaService.sendTokens(txParams.mnemonic, txParams.to, txParams.tokenAddress || "", parseFloat(txParams.value || "0"));

            case "sui":
                if (!txParams.mnemonic) {
                    throw new Error("Mnemonic is required for Sui transactions");
                }

                if (txParams.tokenAddress) {
                    const result = await this._suiService.transferToken(
                        txParams.mnemonic,
                        txParams.to,
                        txParams.tokenAddress,
                        parseFloat(txParams.value || "0")
                    );
                    return result.transactionHash;
                } else {
                    const result = await this._suiService.transferSui(txParams.mnemonic, txParams.to, parseFloat(txParams.value || "0"));
                    return result.transactionHash;
                }

            case "bitcoin":
                if (!txParams.mnemonic) {
                    throw new Error("Mnemonic is required for Bitcoin transactions");
                }

                const bitcoinService = this._injector.get(BitcoinService);

                return bitcoinService.sendBitcoin(txParams.mnemonic, txParams.to, parseFloat(txParams.value || "0"));

            default:
                throw new Error(`Unsupported network: ${network}`);
        }
    }
}
