import { Injectable } from "@angular/core";
import * as openpgp from "openpgp";
import { BehaviorSubject, Observable } from "rxjs";

import { ChromeService } from "./chrome.service";
import { WalletService } from "./wallet.service";

@Injectable({
    providedIn: "root",
})
export class VaultService {
    private _incorrectCount: number = 0;
    private _lastVerified: number = 0;
    private _mnemonic: string = "";
    private _password: string = "";
    private _password$: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);
    private _passwordAttempts: number = 5;

    constructor(
        private _chromeService: ChromeService,
        private _walletService: WalletService
    ) {
        this._chromeService.getItem("lastVerified").then((lastVerified) => {
            this._lastVerified = lastVerified ? lastVerified : 0;
        });
    }

    get mnemonic(): string {
        return this._mnemonic;
    }

    set mnemonic(value: string) {
        this._mnemonic = value;
    }

    set passwordAttempts(value: number) {
        this._passwordAttempts = value;
    }

    get lastVerified(): number {
        return this._lastVerified;
    }

    get password$(): Observable<void> {
        return this._password$.asObservable();
    }

    get password(): string {
        return this._password || "";
    }

    set password(value: string) {
        this._password$.next();
        this._password = value;
    }

    get remainingAttempts(): number {
        return this._passwordAttempts - this._incorrectCount;
    }

    async biometricsRequired(): Promise<boolean> {
        const settings = await this._chromeService.getItem("settings");
        const minutesSinceLastVerified = Math.floor((new Date().getTime() - new Date(this._lastVerified).getTime()) / (1000 * 60));

        if (minutesSinceLastVerified > (settings?.security?.biometricVerificationInterval || 10)) return true;

        return false;
    }

    async decryptMessage(encryptedMessage: string, privateKeyArmoured: string, passphrase: string): Promise<string> {
        try {
            if (await this.biometricsRequired()) throw new Error("expired");

            const privateKey = await openpgp.readPrivateKey({
                armoredKey: privateKeyArmoured,
            });

            const decryptedPrivateKey = await openpgp.decryptKey({
                privateKey,
                passphrase,
            });

            const message = await openpgp.readMessage({
                armoredMessage: encryptedMessage,
            });

            const { data: decrypted } = await openpgp.decrypt({
                message,
                decryptionKeys: decryptedPrivateKey,
            });

            this._incorrectCount = 0;

            return decrypted as string;
        } catch (error: any) {
            this._incorrectCount++;

            if (error?.message === "expired" || this.remainingAttempts <= 0) {
                await this._walletService.clearPGPKeys();

                this._incorrectCount = 0;

                throw error.message;
            }

            if (/incorrect key passphrase/i.test(error?.message)) throw new Error("incorrect_passphrase");

            throw error;
        }
    }

    async oneTimeDecryptMessage(encryptedMessage: string, privateKeyArmoured: string, passphrase: string): Promise<string> {
        try {
            const privateKey = await openpgp.readPrivateKey({
                armoredKey: privateKeyArmoured,
            });

            const decryptedPrivateKey = await openpgp.decryptKey({
                privateKey,
                passphrase,
            });

            const message = await openpgp.readMessage({
                armoredMessage: encryptedMessage,
            });

            const { data: decrypted } = await openpgp.decrypt({
                message,
                decryptionKeys: decryptedPrivateKey,
            });

            return decrypted as string;
        } catch (error: any) {
            if (/incorrect key passphrase/i.test(error?.message)) throw new Error("incorrect_passphrase");

            throw error;
        }
    }

    async getWallet(): Promise<any> {
        if (!this.password) throw new Error("Password not set");

        const wallet = await this._walletService.getCurrentWallet();

        if (!wallet?.pgp?.encryptedMessage || !wallet?.pgp?.privateKey) throw new Error("No wallet available");

        const decryptedData = await this.decryptMessage(wallet.pgp.encryptedMessage, wallet.pgp.privateKey, this.password);

        return JSON.parse(decryptedData);
    }

    async setLastVerified(): Promise<void> {
        this._incorrectCount = 0;

        const newLastVerified = new Date().getTime();

        this._lastVerified = newLastVerified;

        await this._chromeService.setItem("lastVerified", newLastVerified);
    }
}
