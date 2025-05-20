import secp256k1 from "@bitcoinerlab/secp256k1";
import { BIP32Factory } from "bip32";
import * as bip39 from "bip39";
import * as bitcoin from "bitcoinjs-lib";
import { ECPairFactory, ECPairInterface } from "ecpair";

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "../../environments/environment";
import { HttpWrapperService } from "./../http-wrapper.service";

const ECPair = ECPairFactory(secp256k1);
const bip32 = BIP32Factory(secp256k1);

bitcoin.initEccLib(secp256k1);

@Injectable({
    providedIn: "root",
})
export class BitcoinService {
    private _BTC_REGEX = /^(?:(?:bc1|tb1|1|32)[a-zA-HJ-NP-Z0-9]{25,59})$/;

    constructor(
        private _httpClient: HttpClient,
        private _httpWrapperService: HttpWrapperService
    ) {}

    public convertBTCToSatoshi(amount: number): number {
        return Math.floor(amount * 100000000);
    }

    public convertSatoshiToBTC(amount: number): number {
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

    async createBitcoinTransaction(mnemonic: string, targetAddress: string, amount: number, isTestnet: boolean = false) {
        try {
            const seed = bip39.mnemonicToSeedSync(mnemonic);
            const network = isTestnet ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;

            // NOTE: Testnet addresses are not supported for p2wpkh use p2tr instead
            const path = isTestnet ? "m/86'/1'/0'/0/0" : "m/84'/0'/0'/0/0";

            const keyPair = this._getPrivateKey(seed, path, network);
            const pubkey = Buffer.from(keyPair.publicKey);

            const { address: sourceAddress } = bitcoin.payments.p2wpkh({
                pubkey,
                network,
            });

            if (!sourceAddress) {
                throw new Error("Failed to derive Bitcoin address");
            }

            console.log(`Derived ${isTestnet ? "testnet" : "mainnet"} address: ${sourceAddress}`);

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

            const amountInSatoshis = this.convertBTCToSatoshi(amount);

            const feeRateResponse = await fetch("https://mempool.space/api/v1/fees/recommended");
            const feeRates = await feeRateResponse.json();

            const feeRate = isTestnet ? 5 : feeRates.economyFee || 10;

            console.log(`Using fee rate: ${feeRate} sat/vB`);

            const estimatedSizePerInput = 68;
            const estimatedOutputSize = 31;
            const estimatedOverhead = 10;

            const minTransactionSize = estimatedSizePerInput + 2 * estimatedOutputSize + estimatedOverhead;
            const minFee = minTransactionSize * feeRate;

            console.log(`Minimum estimated fee: ${minFee} satoshis`);

            const sortedUtxos = [...utxoDetails].sort((a, b) => a.value - b.value);

            let selectedUtxos = [];
            let estimatedFee = minFee;

            for (const utxo of sortedUtxos) {
                selectedUtxos.push(utxo);
                totalInput += utxo.value;

                const estimatedSize = selectedUtxos.length * estimatedSizePerInput + 2 * estimatedOutputSize + estimatedOverhead;
                estimatedFee = estimatedSize * feeRate;

                if (totalInput >= amountInSatoshis + estimatedFee + 1000) {
                    break;
                }
            }

            if (totalInput < amountInSatoshis + estimatedFee) {
                throw new Error(
                    `Insufficient funds. Available: ${this.convertSatoshiToBTC(totalInput)} BTC, Required: ${this.convertSatoshiToBTC(amountInSatoshis + estimatedFee)} BTC`
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
                address: targetAddress,
                value: amountInSatoshis,
            });

            const change = totalInput - amountInSatoshis - estimatedFee;

            if (change > 546) {
                psbt.addOutput({
                    address: sourceAddress,
                    value: change,
                });
                console.log(`Adding change output: ${this.convertSatoshiToBTC(change)} BTC back to ${sourceAddress}`);
            } else {
                console.log(`Change too small (${change} satoshis), adding to fee`);
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

            const actualFee = totalInput - amountInSatoshis - (change > 546 ? change : 0);
            console.log(`Actual fee: ${actualFee} satoshis (${this.convertSatoshiToBTC(actualFee)} BTC)`);
            console.log(`Fee rate: ${(actualFee / tx.virtualSize()).toFixed(2)} sat/vB`);
            console.log(`Total input: ${totalInput} satoshis, Output: ${amountInSatoshis} satoshis, Change: ${change > 546 ? change : 0} satoshis`);

            const broadcastResponse = await fetch(`${baseUrl}/tx`, {
                method: "POST",
                body: txHex,
            });

            if (!broadcastResponse.ok) {
                const errorText = await broadcastResponse.text();
                throw new Error(`Failed to broadcast transaction: ${errorText}`);
            }

            const txid = await broadcastResponse.text();

            console.log(`Transaction broadcast successfully: ${txid}`);
            console.log(`From: ${sourceAddress}`);
            console.log(`To: ${targetAddress}`);
            console.log(`Amount: ${amount} BTC (${amountInSatoshis} satoshis)`);
            console.log(`Fee: ${this.convertSatoshiToBTC(actualFee)} BTC (${actualFee} satoshis)`);
            console.log(`Change: ${change > 546 ? this.convertSatoshiToBTC(change) : 0} BTC (${change > 546 ? change : 0} satoshis)`);

            return txid;
        } catch (error) {
            console.error("Bitcoin transaction error:", error);
            throw error;
        }
    }

    public async estimateFee(utxos: any[]): Promise<number> {
        const feeRate = 10;
        const estimatedSize = utxos.length * 180 + 34 * 2 + 10;

        return estimatedSize * feeRate;
    }

    public async getUTXOs(address: string): Promise<any[]> {
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

    public isValidBTCAddress(address: string): boolean {
        return this._BTC_REGEX.test(address);
    }

    public requestTransactions(address: string) {
        return this._httpWrapperService.sendRequest("get", `${environment.apiUrl}/bitcoin/transactions/${address}`);
    }

    public requestTestnetTransactions(address: string) {
        return this._httpWrapperService.sendRequest("get", `${environment.apiUrl}/bitcoin/testnet/transactions/${address}`);
    }

    public async getFeeRates(): Promise<number> {
        try {
            const response = await fetch("https://mempool.space/api/v1/fees/recommended");
            const data = await response.json();
            return data.fastestFee || 20;
        } catch (error) {
            console.error("Error fetching fee rates:", error);
            return 20;
        }
    }

    /**
     * Send Bitcoin to an address
     * @param mnemonic Bitcoin wallet mnemonic
     * @param targetAddress Destination address
     * @param amount Amount in BTC
     * @returns Transaction hash
     */
    async sendBitcoin(mnemonic: string, targetAddress: string, amount: number): Promise<string> {
        console.log(`Sending ${amount} BTC to ${targetAddress}`);

        try {
            const isTestnet = false;

            const txid = await this.createBitcoinTransaction(mnemonic, targetAddress, amount, isTestnet);

            console.log(`Transaction sent successfully: ${txid}`);
            return txid;
        } catch (error) {
            console.error("Error sending Bitcoin:", error);
            throw error;
        }
    }

    /**
     * Get the Bitcoin balance of an address
     * @param address Bitcoin address
     * @returns balance in BTC and additional data
     */
    async getBitcoinBalance(address: string): Promise<{ balance: number; fiatBalance: number; transactions: any[] }> {
        try {
            const response = await this._httpWrapperService.sendRequest("get", `${environment.apiUrl}/api/bitcoin/address/${address}`, {});

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
}
