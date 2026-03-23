import { Injectable } from "@angular/core";
import StellarHDWallet from "stellar-hd-wallet";
import { Asset, Horizon, Keypair, Memo, Networks, Operation, StrKey, TransactionBuilder } from "@stellar/stellar-sdk";

import { environment } from "environments/environment";
import { TransactionFeeEstimate, TransactionParams, TransactionResult } from "../core/models/transaction-fee.model";
import { HttpWrapperService } from "../http-wrapper.service";
import { StellarSorobanService } from "./stellar-soroban.service";
import { StellarFeeBreakdown, StellarSendPreview } from "./stellar-send.types";
import {
    formatTokenAmount,
    isClassicAssetRef,
    minimumNewAccountBalanceXlm,
    parseClassicAsset,
} from "./stellar-transaction.util";

@Injectable({
    providedIn: "root",
})
export class StellarService {
    private _baseUrl: string = environment.apiUrl;

    constructor(
        private _httpWrapper: HttpWrapperService,
        private _stellarSoroban: StellarSorobanService
    ) {}

    private _horizonServer(): Horizon.Server {
        const url = environment.stellarRpc?.mainnet || "https://horizon.stellar.org";

        return new Horizon.Server(url);
    }

    private _networkPassphrase(): string {
        return Networks.PUBLIC;
    }

    isValidStellarAddress(address: string): boolean {
        if (!address || typeof address !== "string") return false;

        const trimmed = address.trim();

        return StrKey.isValidEd25519PublicKey(trimmed);
    }

    /** Matches Zelf `Repositories/Wallet/modules/stellar.js`: `StellarHDWallet.fromMnemonic`, index `0`. */
    getSecretKeyFromMnemonic(mnemonic: string): string {
        const normalized = mnemonic.trim().toLowerCase();

        return StellarHDWallet.fromMnemonic(normalized).getSecret(0);
    }

    getPublicKeyFromMnemonic(mnemonic: string): string {
        const normalized = mnemonic.trim().toLowerCase();

        return StellarHDWallet.fromMnemonic(normalized).getPublicKey(0);
    }

    private async _fetchLatestBaseReserveStroops(server: Horizon.Server): Promise<number> {
        const res = await server.ledgers().order("desc").limit(1).call();
        const stroops = res.records[0]?.base_reserve_in_stroops;

        if (!stroops || stroops <= 0) {
            throw new Error("Could not read Stellar base reserve from Horizon");
        }

        return stroops;
    }

    async destinationAccountExists(destination: string): Promise<boolean> {
        const server = this._horizonServer();

        try {
            await server.accounts().accountId(destination.trim()).call();

            return true;
        } catch (err: unknown) {
            const e = err as { response?: { status?: number }; constructor?: { name?: string } };
            const status = e?.response?.status;
            const name = e?.constructor?.name;

            if (status === 404 || name === "NotFoundError") {
                return false;
            }

            throw err;
        }
    }

    /**
     * Native XLM preview: payment vs createAccount vs createAccount+payment (merged ops).
     */
    async getNativeSendPreview(destination: string, amountXlm: number): Promise<StellarSendPreview> {
        const server = this._horizonServer();
        const baseReserveStroops = await this._fetchLatestBaseReserveStroops(server);
        const minReserveXlm = minimumNewAccountBalanceXlm(baseReserveStroops);
        const exists = await this.destinationAccountExists(destination);

        if (!Number.isFinite(amountXlm) || amountXlm <= 0) {
            return {
                mode: "payment",
                destinationAccountMissing: !exists,
                minReserveXlm,
                userAmount: amountXlm,
                amountBelowMinimum: true,
                warningKeys: ["invalid_amount"],
            };
        }

        if (exists) {
            return {
                mode: "payment",
                destinationAccountMissing: false,
                minReserveXlm,
                userAmount: amountXlm,
                amountBelowMinimum: false,
                warningKeys: [],
            };
        }

        if (amountXlm + 1e-12 < minReserveXlm) {
            return {
                mode: "create_only",
                destinationAccountMissing: true,
                minReserveXlm,
                userAmount: amountXlm,
                amountBelowMinimum: true,
                warningKeys: ["below_min"],
            };
        }

        const eps = 1e-10;

        if (amountXlm <= minReserveXlm + eps) {
            return {
                mode: "create_only",
                destinationAccountMissing: true,
                minReserveXlm,
                reservePortionXlm: minReserveXlm,
                userAmount: amountXlm,
                amountBelowMinimum: false,
                warningKeys: ["new_account_explainer"],
            };
        }

        return {
            mode: "create_and_pay",
            destinationAccountMissing: true,
            minReserveXlm,
            reservePortionXlm: minReserveXlm,
            transferPortionXlm: amountXlm - minReserveXlm,
            userAmount: amountXlm,
            amountBelowMinimum: false,
            warningKeys: ["new_account_explainer"],
        };
    }

    private async _destinationHasTrustlineForAsset(destination: string, asset: Asset): Promise<boolean> {
        if (asset.isNative()) return true;

        const server = this._horizonServer();
        const acc = await server.accounts().accountId(destination.trim()).call();

        return acc.balances.some(
            (b: { asset_type?: string; asset_code?: string; asset_issuer?: string }) =>
                b.asset_type !== "native" && b.asset_code === asset.getCode() && b.asset_issuer === asset.getIssuer()
        );
    }

    /**
     * Classic (non-native) asset: requires funded destination + recipient trustline.
     */
    async getClassicSendPreview(destination: string, amount: number, tokenAddress: string | undefined): Promise<StellarSendPreview> {
        this._stellarSoroban.assertClassicOrNativeOnly(tokenAddress);

        const server = this._horizonServer();
        const baseReserveStroops = await this._fetchLatestBaseReserveStroops(server);
        const minReserveXlm = minimumNewAccountBalanceXlm(baseReserveStroops);
        const asset = parseClassicAsset(tokenAddress);
        const exists = await this.destinationAccountExists(destination);

        if (!Number.isFinite(amount) || amount <= 0) {
            return {
                mode: "payment",
                destinationAccountMissing: !exists,
                minReserveXlm,
                userAmount: amount,
                amountBelowMinimum: true,
                warningKeys: ["invalid_amount"],
            };
        }

        if (!exists) {
            return {
                mode: "payment",
                destinationAccountMissing: true,
                minReserveXlm,
                userAmount: amount,
                amountBelowMinimum: false,
                warningKeys: ["classic_fund_first"],
            };
        }

        const hasLine = await this._destinationHasTrustlineForAsset(destination, asset);

        if (!hasLine) {
            return {
                mode: "payment",
                destinationAccountMissing: false,
                minReserveXlm,
                userAmount: amount,
                amountBelowMinimum: false,
                warningKeys: ["classic_trustline"],
            };
        }

        return {
            mode: "payment",
            destinationAccountMissing: false,
            minReserveXlm,
            userAmount: amount,
            amountBelowMinimum: false,
            warningKeys: [],
        };
    }

    async calculateTransactionFees(
        receiverAddress: string,
        amount: number,
        tokenPrice: number,
        tokenAddress?: string,
        tokenDecimals?: number
    ): Promise<TransactionFeeEstimate> {
        const server = this._horizonServer();
        const baseFeeStroops = await server.fetchBaseFee();
        const feeXlm = baseFeeStroops / 1e7;
        const price = tokenPrice || 0;
        const fiatFee = feeXlm * price;
        const amountInUsd = amount * price;

        this._stellarSoroban.assertClassicOrNativeOnly(tokenAddress);

        let preview: StellarSendPreview;

        if (!tokenAddress?.trim() || !isClassicAssetRef(tokenAddress)) {
            preview = await this.getNativeSendPreview(receiverAddress?.trim() || "", amount);
        } else {
            preview = await this.getClassicSendPreview(receiverAddress?.trim() || "", amount, tokenAddress);
        }

        const xlmOut =
            !tokenAddress?.trim() || !isClassicAssetRef(tokenAddress)
                ? preview.userAmount
                : 0;

        const stellar: StellarFeeBreakdown = {
            preview,
            xlmDebitedExcludingNetworkFee: xlmOut,
        };

        return {
            fee: feeXlm,
            fiatFee,
            total: amountInUsd + fiatFee,
            networkPrice: price,
            stellar,
        };
    }

    private _formatNativeAmount(amount: number): string {
        return formatTokenAmount(amount, 7);
    }

    private _isCreateAccountRaceError(err: unknown): boolean {
        const data = err as { response?: { data?: { extras?: { result_codes?: { operations?: string[] } } } } };
        const ops = data?.response?.data?.extras?.result_codes?.operations;

        if (!ops?.length) return false;

        const joined = ops.join(" ").toLowerCase();

        return joined.includes("account_exists") || joined.includes("already_exists") || joined.includes("op_already_exists");
    }

    private async _submitBuilt(server: Horizon.Server, keypair: Keypair, builder: TransactionBuilder): Promise<TransactionResult> {
        const transaction = builder.setTimeout(180).build();

        transaction.sign(keypair);

        try {
            const response = await server.submitTransaction(transaction);

            return {
                hash: response.hash,
                status: "pending",
            };
        } catch (err: unknown) {
            const resultCodes = (err as { response?: { data?: { extras?: { result_codes?: unknown } } } })?.response?.data?.extras
                ?.result_codes;

            const opErr = (resultCodes as { operations?: string[] })?.operations?.[0] || (resultCodes as { transaction?: string })?.transaction;

            const message = opErr || (err as Error)?.message || "Stellar transaction failed";

            throw new Error(typeof message === "string" ? message : JSON.stringify(message));
        }
    }

    async sendTransaction(params: TransactionParams): Promise<TransactionResult> {
        if (!params.mnemonic?.trim()) {
            throw new Error("Mnemonic is required for Stellar transactions");
        }

        this._stellarSoroban.assertClassicOrNativeOnly(params.tokenAddress);

        const destination = params.to?.trim();

        if (!destination || !this.isValidStellarAddress(destination)) {
            throw new Error("Invalid Stellar address");
        }

        const secret = this.getSecretKeyFromMnemonic(params.mnemonic);
        const keypair = Keypair.fromSecret(secret);
        const server = this._horizonServer();
        const amountNum = parseFloat(params.value);

        if (!Number.isFinite(amountNum) || amountNum <= 0) {
            throw new Error("Invalid amount");
        }

        const account = await server.loadAccount(keypair.publicKey());
        const baseFee = await server.fetchBaseFee();
        const baseReserveStroops = await this._fetchLatestBaseReserveStroops(server);
        const minReserveXlm = minimumNewAccountBalanceXlm(baseReserveStroops);

        const memoText = params.memo?.trim();
        const passphrase = this._networkPassphrase();

        const appendMemo = (b: TransactionBuilder): TransactionBuilder => {
            if (!memoText) return b;

            return b.addMemo(Memo.text(memoText));
        };

        const tokenAddress = params.tokenAddress?.trim();

        if (tokenAddress && isClassicAssetRef(tokenAddress)) {
            const exists = await this.destinationAccountExists(destination);

            if (!exists) {
                throw new Error("errors.stellar_classic_fund_xlm_first");
            }

            const asset = parseClassicAsset(tokenAddress);
            const hasLine = await this._destinationHasTrustlineForAsset(destination, asset);

            if (!hasLine) {
                throw new Error("errors.stellar_classic_trustline_required");
            }

            const dec = params.tokenDecimals !== undefined ? Math.min(7, Math.max(0, params.tokenDecimals)) : 7;
            const amountStr = formatTokenAmount(amountNum, dec);

            let builder = new TransactionBuilder(account, {
                fee: baseFee.toString(),
                networkPassphrase: passphrase,
            }).addOperation(
                Operation.payment({
                    destination,
                    asset,
                    amount: amountStr,
                })
            );

            builder = appendMemo(builder);

            return this._submitBuilt(server, keypair, builder);
        }

        const destExists = await this.destinationAccountExists(destination);

        if (destExists) {
            let builder = new TransactionBuilder(account, {
                fee: baseFee.toString(),
                networkPassphrase: passphrase,
            }).addOperation(
                Operation.payment({
                    destination,
                    asset: Asset.native(),
                    amount: this._formatNativeAmount(amountNum),
                })
            );

            builder = appendMemo(builder);

            return this._submitBuilt(server, keypair, builder);
        }

        if (amountNum + 1e-12 < minReserveXlm) {
            throw new Error("errors.stellar_amount_below_reserve");
        }

        const startingBalanceStr = this._formatNativeAmount(Math.max(amountNum, minReserveXlm));

        let builder = new TransactionBuilder(account, {
            fee: baseFee.toString(),
            networkPassphrase: passphrase,
        });

        const remainderXlm = amountNum - minReserveXlm;

        if (remainderXlm <= 1e-8) {
            builder = builder.addOperation(
                Operation.createAccount({
                    destination,
                    startingBalance: this._formatNativeAmount(amountNum),
                })
            );
        } else {
            const reserveStr = this._formatNativeAmount(minReserveXlm);
            const remainderStr = this._formatNativeAmount(remainderXlm);

            builder = builder
                .addOperation(
                    Operation.createAccount({
                        destination,
                        startingBalance: reserveStr,
                    })
                )
                .addOperation(
                    Operation.payment({
                        destination,
                        asset: Asset.native(),
                        amount: remainderStr,
                    })
                );
        }

        builder = appendMemo(builder);

        try {
            return await this._submitBuilt(server, keypair, builder);
        } catch (err: unknown) {
            if (this._isCreateAccountRaceError(err)) {
                const refreshed = await server.loadAccount(keypair.publicKey());
                let retry = new TransactionBuilder(refreshed, {
                    fee: baseFee.toString(),
                    networkPassphrase: passphrase,
                }).addOperation(
                    Operation.payment({
                        destination,
                        asset: Asset.native(),
                        amount: this._formatNativeAmount(amountNum),
                    })
                );

                retry = appendMemo(retry);

                return this._submitBuilt(server, keypair, retry);
            }

            throw err;
        }
    }

    private _defaultResponse(): any {
        return {
            data: {
                address: "",
                balance: 0,
                fiatBalance: 0,
                type: "account",
                account: {
                    asset: "XLM",
                    fiatValue: "0",
                    price: "0",
                },
                tokenHoldings: {
                    total: 0,
                    balance: 0,
                    fiatBalance: 0,
                    tokens: [],
                },
                transactions: [],
                transactionsNext: false,
            },
        };
    }

    async getWalletDetails(address: string): Promise<any> {
        try {
            const url = `${this._baseUrl}/api/stellar/address/${address}`;

            return await this._httpWrapper
                .sendRequest("get", url, {})
                .then((response) => response)
                .catch(() => this._defaultResponse());
        } catch (error) {
            console.error("Exception in Stellar getWalletDetails:", error);

            return Promise.resolve(this._defaultResponse());
        }
    }

    async requestTransactionHistory(
        address: string,
        pagination: { page: number; show?: number },
        cursor?: string
    ): Promise<any> {
        try {
            const url = `${this._baseUrl}/api/stellar/address/${address}/transactions`;

            const params: Record<string, string | number> = {
                limit: pagination.show || 25,
            };
            if (cursor) {
                params.cursor = cursor;
            }

            return await this._httpWrapper
                .sendRequest("get", url, params)
                .then((response) => response)
                .catch(() => ({ data: { transactions: [], next: false } }));
        } catch (error) {
            console.error("Exception in Stellar requestTransactionHistory:", error);

            return Promise.resolve({ data: { transactions: [], next: false } });
        }
    }

    async requestTransactionDetails(transactionHash: string): Promise<any> {
        return this._httpWrapper.sendRequest("get", `${this._baseUrl}/api/stellar/transaction/${transactionHash}`);
    }
}
