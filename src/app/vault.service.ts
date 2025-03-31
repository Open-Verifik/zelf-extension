import { Injectable } from "@angular/core";
import * as openpgp from "openpgp";
import { BehaviorSubject, Observable } from "rxjs";
import { WalletService } from "./wallet.service";

@Injectable({
    providedIn: "root",
})
export class VaultService {
    private _incorrectCount: number = 0;
    private _incorrectMax: number = 5;
    private _password$: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);
    private _password: string = "";
    private _mnemonic: string = "";

    constructor(private _walletService: WalletService) {}

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

    get mnemonic(): string {
        return this._mnemonic;
    }

    set mnemonic(value: string) {
        this._mnemonic = value;
    }

    /**
     * Decrypts a PGP encrypted message.
     * @param encryptedMessage - The armored PGP message.
     * @param privateKeyArmoured - The armored private key.
     * @param passphrase - The passphrase for the private key.
     * @returns The decrypted plain text.
     */
    async decryptMessage(encryptedMessage: string, privateKeyArmoured: string, passphrase: string): Promise<string> {
        try {
            // Parse the armored private key.
            const privateKey = await openpgp.readPrivateKey({
                armoredKey: privateKeyArmoured,
            });

            // Decrypt the private key using the provided passphrase.
            const decryptedPrivateKey = await openpgp.decryptKey({
                privateKey,
                passphrase,
            });

            // Parse the armored encrypted message.
            const message = await openpgp.readMessage({
                armoredMessage: encryptedMessage,
            });

            // Decrypt the message using the decrypted private key.
            const { data: decrypted } = await openpgp.decrypt({
                message,
                decryptionKeys: decryptedPrivateKey,
            });

            return decrypted as string;
        } catch (error) {
            if (this._incorrectCount < this._incorrectMax) {
                this._incorrectCount++;
                console.error("Decryption failed. Attempt:", this._incorrectCount);
            } else {
                console.error("Max decryption attempts reached. Please check your passphrase.");

                await this._walletService.clearPGPKeys();
            }

            throw error;
        }
    }
}
