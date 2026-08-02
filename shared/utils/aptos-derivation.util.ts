import { Account, AccountAddress } from "@aptos-labs/ts-sdk";

/** Ledger-compatible legacy Ed25519 path shared by the backend and all Zelf clients. */
export const APTOS_DERIVATION_PATH = "m/44'/637'/0'/0'/0'";

/** Native APT precision (1 APT = 100,000,000 octas). */
export const APTOS_DECIMALS = 8;

export function aptosAccountFromMnemonic(mnemonic: string) {
    const normalizedMnemonic = mnemonic.trim().toLowerCase().replace(/\s+/g, " ");

    if (!normalizedMnemonic) throw new Error("Mnemonic is required for Aptos transactions");

    return Account.fromDerivationPath({
        mnemonic: normalizedMnemonic,
        path: APTOS_DERIVATION_PATH,
    });
}

export function aptosAddressFromMnemonic(mnemonic: string): string {
    return aptosAccountFromMnemonic(mnemonic).accountAddress.toStringLong();
}

export function isValidAptosAddress(address: string): boolean {
    const input = `${address || ""}`.trim();
    if (!input) return false;

    return AccountAddress.isValid({ input, strict: false }).valid;
}

/** Decimal APT string to exact octas, avoiding floating-point rounding. */
export function aptToOctas(amount: string | number): bigint {
    const raw = `${amount}`.trim();

    if (!/^(?:0|[1-9]\d*)(?:\.\d{1,8})?$/.test(raw)) {
        throw new Error("Invalid APT amount");
    }

    const [whole, fraction = ""] = raw.split(".");
    const octas = BigInt(whole) * 10n ** BigInt(APTOS_DECIMALS) + BigInt(fraction.padEnd(APTOS_DECIMALS, "0"));

    if (octas <= 0n) throw new Error("APT amount must be greater than zero");

    return octas;
}
