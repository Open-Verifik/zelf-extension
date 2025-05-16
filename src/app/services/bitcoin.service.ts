import secp256k1 from "@bitcoinerlab/secp256k1";
import { BIP32Factory } from "bip32";
import * as bip39 from "bip39";
import * as bitcoin from "bitcoinjs-lib";
import { ECPairFactory, ECPairInterface } from "ecpair";

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";

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

    constructor(private _httpClient: HttpClient, private _httpWrapperService: HttpWrapperService) {}

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

            const path = isTestnet ? "m/84'/1'/0'/0/0" : "m/84'/0'/0'/0/0";

            const keyPair = this._getPrivateKey(seed, path, network);

            const { address: sourceAddress } = bitcoin.payments.p2wpkh({
                pubkey: Buffer.from(keyPair.publicKey),
                network,
            });

            if (!sourceAddress) {
                throw new Error("Failed to derive Bitcoin address");
            }

            console.log(`Derived ${isTestnet ? "testnet" : "mainnet"} address: ${sourceAddress}`);

            const baseUrl = isTestnet ? "https://blockstream.info/testnet/api" : "https://blockstream.info/api";

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

            utxoDetails.forEach((utxo: any) => {
                const tx = bitcoin.Transaction.fromHex(utxo.txHex);

                const p2wpkh = bitcoin.payments.p2wpkh({
                    pubkey: Buffer.from(keyPair.publicKey),
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

                totalInput += utxo.value;
            });

            let amountInSatoshis = this.convertBTCToSatoshi(amount);

            const feeRateResponse = await fetch("https://mempool.space/api/v1/fees/recommended");
            const feeRates = await feeRateResponse.json();

            const feeRate = isTestnet ? 5 : feeRates.fastestFee || 20;

            const estimatedSize = utxos.length * 100 + 2 * 50 + 20;
            const fee = estimatedSize * feeRate;

            if (totalInput < amountInSatoshis + fee) {
                const adjustedAmount = totalInput - fee;

                if (adjustedAmount < 546) {
                    throw new Error(`Amount too small. Minimum amount after fees: 0.00000546 BTC`);
                }

                console.log(`Adjusting amount from ${amountInSatoshis} to ${adjustedAmount} satoshis to accommodate fee of ${fee} satoshis`);
                amountInSatoshis = adjustedAmount;
            }

            if (amountInSatoshis < 546) {
                throw new Error(`Amount too small. Minimum amount: 0.00000546 BTC`);
            }

            psbt.addOutput({
                address: targetAddress,
                value: amountInSatoshis,
            });

            for (let i = 0; i < utxos.length; i++) {
                try {
                    psbt.signInput(i, {
                        publicKey: Buffer.from(keyPair.publicKey),
                        sign: (hash: Buffer) => Buffer.from(keyPair.sign(hash)),
                    });
                } catch (error) {
                    console.error(`Error signing input ${i}:`, error);
                    throw new Error(`Failed to sign transaction input ${i}: ${error instanceof Error ? error.message : String(error)}`);
                }
            }

            try {
                psbt.finalizeAllInputs();
            } catch (error) {
                console.error("Error finalizing inputs:", error);
                throw new Error(`Failed to finalize transaction: ${error instanceof Error ? error.message : String(error)}`);
            }

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

            console.log(`Transaction broadcast successfully: ${txid}`);
            console.log(`From: ${sourceAddress}`);
            console.log(`To: ${targetAddress}`);
            console.log(`Amount: ${amount} BTC`);
            console.log(`Fee: ${this.convertSatoshiToBTC(fee)} BTC`);

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
}
