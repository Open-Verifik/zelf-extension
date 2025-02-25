import { Injectable } from "@angular/core";
import * as openpgp from "openpgp";

@Injectable({
    providedIn: "root",
})
export class VaultService {
    _password: string = "";

    constructor() {}

    get password(): string {
        console.log(` VaultService ~ getpassword ~ this._password:`, this._password);
        return this._password || "";
    }

    set password(value: string) {
        console.log(` VaultService ~ setpassword ~ value:`, value);
        this._password = value;
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
            console.error("Error during PGP decryption:", error);
            throw error;
        }
    }
}
