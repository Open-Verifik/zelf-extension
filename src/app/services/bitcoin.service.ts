import secp256k1 from "@bitcoinerlab/secp256k1";
import { BIP32Factory } from "bip32";
import * as bip39 from "bip39";
import * as bitcoin from "bitcoinjs-lib";
import { Buffer } from "buffer";
import { ECPairFactory, ECPairInterface } from "ecpair";

import { Injectable } from "@angular/core";

import { environment } from "../../environments/environment";
import { AssetService } from "../asset.service";
import { TransactionFeeEstimate, TransactionParams, TransactionResult } from "../core/models/transaction-fee.model";
import { HttpWrapperService } from "./../http-wrapper.service";

const ECPair = ECPairFactory(secp256k1);
const bip32 = BIP32Factory(secp256k1);

bitcoin.initEccLib(secp256k1);

export type MempoolFeeRates = {
    fastestFee: number;
    halfHourFee: number;
    hourFee: number;
    economyFee: number;
    minimumFee: number;
};

@Injectable({
    providedIn: "root",
})
export class BitcoinService {
    private _baseUrl: string = environment.apiUrl;
    private _BTC_REGEX = /^(?:(?:bc1|tb1|1|32)[a-zA-HJ-NP-Z0-9]{25,59})$/;
    private _selectedFeeRate: number = 0;

    constructor(
        private _httpWrapperService: HttpWrapperService,
        private _assetService: AssetService
    ) {}

    public feeRates: MempoolFeeRates = {
        economyFee: 0,
        fastestFee: 0,
        halfHourFee: 0,
        hourFee: 0,
        minimumFee: 0,
    };

    public get selectedFeeRate(): number {
        return this._selectedFeeRate;
    }

    public set selectedFeeRate(value: number) {
        this._selectedFeeRate = value;
    }

    private _defaultResponse(): any {
        return {
            data: {
                _balance: 0,
                balance: "0",
                fiatBalance: "0",
                account: {
                    asset: "BTC",
                    price: "0",
                },
                tokenHoldings: {
                    tokens: [],
                },
            },
        };
    }

    private _convertBTCToSatoshi(amount: number): number {
        return Math.floor(amount * 100000000);
    }

    private _convertSatoshiToBTC(amount: number): number {
        return amount / 100000000;
    }

    private _getAddressType(address: string): "segwit" | "testnet" | "legacy" {
        if (address.startsWith("bc1")) {
            return "segwit";
        } else if (address.startsWith("tb1")) {
            return "testnet";
        } else if (address.startsWith("1")) {
            return "legacy";
        }

        throw new Error("Unsupported address type");
    }

    private _getPrivateKey(seed: Buffer, path: string, network: any): ECPairInterface {
        const root = bip32.fromSeed(seed, network);
        const child = root.derivePath(path);

        return ECPair.fromPrivateKey(child.privateKey!, { network });
    }

    private _processTestnetUTXOs(utxos: any[], sourceAddress: string) {
        return utxos?.map((tx: any) => [...tx.outputs.map((output: any) => (sourceAddress === output.scriptpubkey_address ? output.value : 0))]);
    }

    calculateBitcoinTransactionFee(feeRate: number, networkPrice: number): { feeBTC: number; fiatFee: number } {
        const estimatedInputs = 1;
        const estimatedOutputs = 2;
        const estimatedSize = estimatedInputs * 68 + estimatedOutputs * 31 + 10;
        const estimatedFeeInSatoshis = estimatedSize * feeRate;

        const feeBTC = this._convertSatoshiToBTC(estimatedFeeInSatoshis);

        const fiatFee = feeBTC * (networkPrice || 0);

        return { feeBTC, fiatFee };
    }

    async calculateTransactionFees(amount: number, tokenPrice: number, selectedFeeRate: number): Promise<TransactionFeeEstimate> {
        try {
            const response = await this._assetService.fetchAssetPrice("BTC");
            const networkPrice = response?.data?.length ? response.data[0].open : 0;

            const calculatedFee = this.calculateBitcoinTransactionFee(selectedFeeRate, networkPrice);
            const amountInUsd = amount * tokenPrice;

            return {
                fee: calculatedFee.feeBTC,
                fiatFee: calculatedFee.fiatFee,
                total: amountInUsd + calculatedFee.fiatFee,
                networkPrice,
            };
        } catch (error) {
            console.warn("Failed to fetch Bitcoin fee rates, using fallback", error);

            const estimatedFeeInSatoshis = 150 * 10;
            const feeBTC = this._convertSatoshiToBTC(estimatedFeeInSatoshis);
            const networkPrice = 0;
            const fiatFee = feeBTC * networkPrice;
            const amountInUsd = amount * tokenPrice;

            return {
                fee: feeBTC,
                fiatFee,
                total: amountInUsd + fiatFee,
                networkPrice,
            };
        }
    }

    async estimateFee(utxos: any[]): Promise<number> {
        const feeRate = 10;
        const estimatedSize = utxos.length * 180 + 34 * 2 + 10;

        return estimatedSize * feeRate;
    }

    async getBitcoinBalance(address: string): Promise<{ balance: number; fiatBalance: number; transactions: any[] }> {
        try {
            const response = await this._httpWrapperService.sendRequest("get", `${this._baseUrl}/api/bitcoin/address/${address}`, {});

            if (!response || !response.data) {
                throw new Error("No data received from Bitcoin API");
            }

            return {
                balance: response.data.balance || 0,
                fiatBalance: response.data.fiatBalance || 0,
                transactions: response.data.transactions || [],
            };
        } catch (error) {
            console.error("Error fetching Bitcoin balance:", error);

            return { balance: 0, fiatBalance: 0, transactions: [] };
        }
    }

    async getFeeRates(): Promise<MempoolFeeRates> {
        try {
            const response = await fetch("https://mempool.space/api/v1/fees/recommended");

            const data = await response.json();

            return data;
        } catch (error) {
            console.error("Error fetching fee rates:", error);

            return {
                fastestFee: 12,
                halfHourFee: 9,
                hourFee: 6,
                economyFee: 2,
                minimumFee: 1,
            };
        }
    }

    async getUTXOs(address: string): Promise<any[]> {
        const addressType = this._getAddressType(address);

        let utxos: any[] = [];

        if (addressType === "testnet") {
            const response = await this.requestTestnetTransactions(address);

            utxos = this._processTestnetUTXOs(response.data.transactions || [], address);
        } else {
            const response = await this.requestTransactions(address);

            utxos = response.data.transactions;
        }

        return utxos;
    }

    async getWalletDetails(address: string, isTestnet?: boolean): Promise<any> {
        try {
            let url: string;

            if (isTestnet) {
                url = `${this._baseUrl}/api/bitcoin/testnet/address/${address}`;
            } else {
                url = `${this._baseUrl}/api/bitcoin/address/${address}`;
            }

            return this._httpWrapperService
                .sendRequest("get", url)
                .then((response) => response)
                .catch(() => this._defaultResponse());
        } catch (error) {
            console.error("Exception in Bitcoin getWalletDetails:", error);
            return Promise.resolve(this._defaultResponse());
        }
    }

    isValidBTCAddress(address: string): boolean {
        return this._BTC_REGEX.test(address);
    }

    async requestTestnetTransactions(address: string) {
        return this._httpWrapperService.sendRequest("get", `${this._baseUrl}/api/bitcoin/testnet/transactions/${address}`);
    }

    async requestTransactions(address: string) {
        return this._httpWrapperService.sendRequest("get", `${this._baseUrl}/api/bitcoin/${address}/transactions`);
    }

    async requestTransactionDetails(transactionHash: string): Promise<{ data: any }> {
        return this._httpWrapperService.sendRequest("get", `${this._baseUrl}/api/bitcoin/transaction/${transactionHash}`);
    }

    async requestTransactionHistory(address: string, pagination: { page: number; show?: number }, isTestnet?: boolean): Promise<any> {
        try {
            let url: string;

            const params = {
                page: pagination.page,
                show: pagination.show || 25,
            };

            if (isTestnet) {
                url = `${this._baseUrl}/api/bitcoin/testnet/transactions/${address}`;
            } else {
                url = `${this._baseUrl}/api/bitcoin/${address}/transactions`;
            }

            return this._httpWrapperService
                .sendRequest("get", url, params)
                .then((response) => response)
                .catch(() => ({ data: [] }));
        } catch (error) {
            console.error("Exception in Bitcoin requestTransactionHistory:", error);

            return Promise.resolve({ data: [] });
        }
    }

    async sendTransaction(params: TransactionParams): Promise<TransactionResult> {
        if (!params.mnemonic) throw new Error("Mnemonic is required for Bitcoin transactions");

        try {
            const amount = parseFloat(params.value);
            const isTestnet = params.to.startsWith("tb1");
            const feeRate = 10; // Default fee rate

            const seed = bip39.mnemonicToSeedSync(params.mnemonic);
            const network = isTestnet ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;

            const path = isTestnet ? "m/86'/1'/0'/0/0" : "m/84'/0'/0'/0/0";

            const keyPair = this._getPrivateKey(seed, path, network);
            const pubkey = Buffer.from(keyPair.publicKey);

            const { address: sourceAddress } = bitcoin.payments.p2wpkh({
                pubkey,
                network,
            });

            if (!sourceAddress) throw new Error("Failed to derive Bitcoin address");

            const baseUrl = isTestnet ? "https://mempool.space/testnet/api" : "https://mempool.space/api";
            const utxoResponse = await fetch(`${baseUrl}/address/${sourceAddress}/utxo`);

            if (!utxoResponse.ok) {
                if (utxoResponse.status === 404 || utxoResponse.status === 400) {
                    throw new Error(`No funds available in address ${sourceAddress}. Please fund this address first.`);
                }

                throw new Error(`Failed to fetch UTXOs: ${utxoResponse.statusText}`);
            }

            const utxos = await utxoResponse.json();

            if (!utxos || utxos.length === 0) {
                throw new Error(`No UTXOs found for address ${sourceAddress}. Please fund this address first.`);
            }

            const utxoDetails = await Promise.all(
                utxos.map(async (utxo: any) => {
                    const txResponse = await fetch(`${baseUrl}/tx/${utxo.txid}/hex`);
                    const txHex = await txResponse.text();
                    return {
                        ...utxo,
                        txHex,
                    };
                })
            );

            const psbt = new bitcoin.Psbt({ network });

            let totalInput = 0;

            const amountInSatoshis = this._convertBTCToSatoshi(amount);

            const estimatedSizePerInput = 68;
            const estimatedOutputSize = 31;
            const estimatedOverhead = 10;

            const minTransactionSize = estimatedSizePerInput + 2 * estimatedOutputSize + estimatedOverhead;
            const minFee = minTransactionSize * feeRate;

            const sortedUtxos = [...utxoDetails].sort((a, b) => a.value - b.value);

            let selectedUtxos = [];
            let estimatedFee = minFee;

            for (const utxo of sortedUtxos) {
                selectedUtxos.push(utxo);
                totalInput += utxo.value;

                const estimatedSize = selectedUtxos.length * estimatedSizePerInput + 2 * estimatedOutputSize + estimatedOverhead;

                estimatedFee = estimatedSize * feeRate;

                if (totalInput >= amountInSatoshis + estimatedFee + 1000) break;
            }

            if (totalInput < amountInSatoshis + estimatedFee) {
                throw new Error(
                    `Insufficient funds. Available: ${this._convertSatoshiToBTC(totalInput)} BTC, Required: ${this._convertSatoshiToBTC(amountInSatoshis + estimatedFee)} BTC`
                );
            }

            for (const utxo of selectedUtxos) {
                const p2wpkh = bitcoin.payments.p2wpkh({
                    pubkey,
                    network,
                });

                psbt.addInput({
                    hash: utxo.txid,
                    index: utxo.vout,
                    witnessUtxo: {
                        script: p2wpkh.output!,
                        value: utxo.value,
                    },
                });
            }

            psbt.addOutput({
                address: params.to,
                value: amountInSatoshis,
            });

            const change = totalInput - amountInSatoshis - estimatedFee;

            if (change > 546) {
                psbt.addOutput({
                    address: sourceAddress,
                    value: change,
                });
            }

            for (let i = 0; i < selectedUtxos.length; i++) {
                psbt.signInput(i, {
                    publicKey: pubkey,
                    sign: (hash: Buffer) => Buffer.from(keyPair.sign(hash)),
                });
            }

            psbt.finalizeAllInputs();

            const tx = psbt.extractTransaction();
            const txHex = tx.toHex();

            const broadcastResponse = await fetch(`${baseUrl}/tx`, {
                method: "POST",
                body: txHex,
            });

            if (!broadcastResponse.ok) {
                const errorText = await broadcastResponse.text();

                throw new Error(`Failed to broadcast transaction: ${errorText}`);
            }

            const txid = await broadcastResponse.text();

            return {
                hash: txid,
                status: "pending",
            };
        } catch (error) {
            console.error("Bitcoin transaction error:", error);

            throw error;
        }
    }
}
