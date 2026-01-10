import { Injectable } from "@angular/core";

/**
 * Service for generating TOTP codes using Web Crypto API
 * No external dependencies required - works in browser/extensions
 */
@Injectable({
    providedIn: "root",
})
export class TOTPService {
    /**
     * Decodes a base32 string to bytes
     */
    private _base32Decode(base32: string): Uint8Array {
        const base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        base32 = base32.toUpperCase().replace(/=+$/, "");

        let bits = 0;
        let value = 0;
        let index = 0;
        const output = new Uint8Array(Math.floor((base32.length * 5) / 8));

        for (let i = 0; i < base32.length; i++) {
            value = (value << 5) | base32Chars.indexOf(base32[i]);
            bits += 5;

            if (bits >= 8) {
                output[index++] = (value >>> (bits - 8)) & 255;
                bits -= 8;
            }
        }

        return output;
    }

    /**
     * Converts a number to a big-endian byte array
     */
    private _intToBytes(value: number): Uint8Array {
        const bytes = new Uint8Array(8);
        for (let i = 7; i >= 0; i--) {
            bytes[i] = value & 0xff;
            value = value >>> 8;
        }
        return bytes;
    }

    /**
     * Performs HMAC using Web Crypto API
     */
    private async _hmac(secret: Uint8Array, data: Uint8Array, algorithm: string = "SHA-1"): Promise<Uint8Array> {
        const key = await crypto.subtle.importKey(
            "raw",
            secret,
            {
                name: "HMAC",
                hash: algorithm,
            },
            false,
            ["sign"]
        );

        const signature = await crypto.subtle.sign("HMAC", key, data);
        return new Uint8Array(signature);
    }

    /**
     * Dynamic truncation as per RFC 4226
     */
    private _dynamicTruncate(hash: Uint8Array, digits: number): number {
        const offset = hash[hash.length - 1] & 0xf;
        const binary = ((hash[offset] & 0x7f) << 24) | ((hash[offset + 1] & 0xff) << 16) | ((hash[offset + 2] & 0xff) << 8) | (hash[offset + 3] & 0xff);
        const otp = binary % Math.pow(10, digits);

        return otp;
    }

    /**
     * Generates a TOTP code
     * @param secret Base32-encoded secret key
     * @param period Time step in seconds (default: 30)
     * @param digits Number of digits in the code (default: 6)
     * @param algorithm Hash algorithm: 'SHA1', 'SHA256', or 'SHA512' (default: 'SHA1')
     * @param time Current Unix timestamp in seconds (optional, defaults to now)
     */
    async generate(secret: string, period: number = 30, digits: number = 6, algorithm: string = "SHA1", time?: number): Promise<string> {
        try {
            // Decode the base32 secret
            const secretBytes = this._base32Decode(secret);

            // Calculate time step
            const currentTime = time || Math.floor(Date.now() / 1000);
            const timeStep = Math.floor(currentTime / period);

            // Convert time step to bytes (big-endian, 8 bytes)
            const timeStepBytes = this._intToBytes(timeStep);

            // Map algorithm name to Web Crypto API format
            const cryptoAlgorithm = algorithm.toUpperCase() === "SHA256" ? "SHA-256" : algorithm.toUpperCase() === "SHA512" ? "SHA-512" : "SHA-1";

            // Calculate HMAC
            const hmac = await this._hmac(secretBytes, timeStepBytes, cryptoAlgorithm);

            // Dynamic truncation
            const otp = this._dynamicTruncate(hmac, digits);

            // Format with leading zeros
            return otp.toString().padStart(digits, "0");
        } catch (error) {
            console.error("Error generating TOTP:", error);
            throw error;
        }
    }

    /**
     * Validates a TOTP code
     * @param secret Base32-encoded secret key
     * @param code The code to validate
     * @param period Time step in seconds (default: 30)
     * @param digits Number of digits in the code (default: 6)
     * @param algorithm Hash algorithm (default: 'SHA1')
     * @param window Time step window for validation (default: 1, meaning current and previous step)
     */
    async validate(secret: string, code: string, period: number = 30, digits: number = 6, algorithm: string = "SHA1", window: number = 1): Promise<boolean> {
        const currentTime = Math.floor(Date.now() / 1000);
        const currentStep = Math.floor(currentTime / period);

        // Check current step and previous steps within the window
        for (let i = 0; i <= window; i++) {
            const time = (currentStep - i) * period;
            const generatedCode = await this.generate(secret, period, digits, algorithm, time);

            if (generatedCode === code) {
                return true;
            }
        }

        return false;
    }
}

