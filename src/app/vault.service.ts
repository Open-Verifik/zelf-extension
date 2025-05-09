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
    private _passwordAttempts: number = 4;
    private _password$: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);
    private _password: string = "";
    private _mnemonic: string = "";
    private _lastVerified: number = 0;

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
            this._chromeService.setItem("lastVerified", this._lastVerified);
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

    setLastVerified(): void {
        this._incorrectCount = 0;
        this._lastVerified = new Date().getTime();
        this._chromeService.setItem("lastVerified", this._lastVerified);
    }

    get remainingAttempts(): number {
        return this._passwordAttempts - this._incorrectCount;
    }

    private async _checkBiometricInterval(): Promise<boolean> {
        const lastVerified = await this._chromeService.getItem("lastVerified");

        if (!lastVerified) return false;

        // Force biometrics if someone has tampered with the lastVerified timestamp
        if (this._lastVerified !== lastVerified) return false;

        const settings = await this._chromeService.getItem("settings");
        const hoursSinceLastVerified = Math.floor((new Date().getTime() - new Date(lastVerified).getTime()) / (1000 * 60 * 60));

        if (hoursSinceLastVerified > settings.security.biometricVerificationHours) return false;

        return true;
    }

    async decryptMessage(encryptedMessage: string, privateKeyArmoured: string, passphrase: string): Promise<string> {
        try {
            if (!(await this._checkBiometricInterval())) throw new Error("expired");

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
}
