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
    private _passwordAttempts: number = 4;

    constructor(
        private _walletService: WalletService,
        private _chromeService: ChromeService
    ) {
        this._chromeService.onLastVerifiedChanged$.subscribe((lastVerified) => {
            if (this._lastVerified === lastVerified) return;

            if (!lastVerified) {
                this._lastVerified = 0;

                return;
            }

            // Tamper resistance
            this._chromeService.setItem("lastVerified", 0);
        });

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
        const lastVerified = await this._chromeService.getItem("lastVerified");

        if (!lastVerified) return true;

        // Force biometrics if someone has tampered with the lastVerified timestamp
        if (this._lastVerified !== lastVerified) return true;

        const settings = await this._chromeService.getItem("settings");
        const minutesSinceLastVerified = Math.floor((new Date().getTime() - new Date(lastVerified).getTime()) / (1000 * 60));

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
            if (error?.message !== "expired" && this.remainingAttempts > 0) {
                this._incorrectCount++;
            } else {
                await this._walletService.clearPGPKeys();

                this._incorrectCount = 0;
            }

            throw error;
        }
    }

    async getWallet(): Promise<any> {
        if (!this.password) {
            throw new Error("Password not set");
        }

        const wallet = await this._walletService.getCurrentWallet();

        if (!wallet?.pgp?.encryptedMessage || !wallet?.pgp?.privateKey) {
            throw new Error("No wallet available");
        }

        const decryptedData = await this.decryptMessage(wallet.pgp.encryptedMessage, wallet.pgp.privateKey, this.password);

        return JSON.parse(decryptedData);
    }

    setLastVerified(): void {
        this._incorrectCount = 0;

        const newLastVerified = new Date().getTime();

        this._lastVerified = newLastVerified;
        this._chromeService.setItem("lastVerified", newLastVerified);
    }
}
