import { Asset, StrKey } from "@stellar/stellar-sdk";

const STROOPS = 10_000_000;

/** Minimum balance for an account with zero sub-entries: (2 + 0) × base_reserve. */
export function minimumNewAccountBalanceXlm(baseReserveStroops: number): number {
    return (2 * baseReserveStroops) / STROOPS;
}

export function stroopsToXlm(stroops: number): number {
    return stroops / STROOPS;
}

/** Stellar amount strings use at most 7 decimal places. */
export function formatTokenAmount(amount: number, maxDecimals: number = 7): string {
    if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("Invalid amount");
    }

    const d = Math.min(7, Math.max(0, Math.floor(maxDecimals)));
    const s = amount.toFixed(d).replace(/\.?0+$/, "");

    return s || "0";
}

/**
 * Classic asset: `CODE:ISSUER` (issuer = G… public key). Native when `tokenAddress` is empty.
 */
export function parseClassicAsset(tokenAddress: string | undefined): Asset {
    const raw = tokenAddress?.trim();

    if (!raw) {
        return Asset.native();
    }

    const idx = raw.lastIndexOf(":");

    if (idx <= 0 || idx === raw.length - 1) {
        throw new Error("errors.stellar_invalid_asset_format");
    }

    const code = raw.slice(0, idx).trim();
    const issuer = raw.slice(idx + 1).trim();

    if (!code || code.length > 12) {
        throw new Error("errors.stellar_invalid_asset_format");
    }

    if (!StrKey.isValidEd25519PublicKey(issuer)) {
        throw new Error("errors.stellar_invalid_asset_format");
    }

    return new Asset(code, issuer);
}

/** Soroban contract IDs are StrKey-encoded and start with C (protocol 20+). */
export function isLikelySorobanContractId(tokenAddress: string | undefined): boolean {
    const s = tokenAddress?.trim();

    if (!s || s.includes(":")) return false;

    return s.startsWith("C") && s.length >= 50;
}

export function isClassicAssetRef(tokenAddress: string | undefined): boolean {
    const raw = tokenAddress?.trim();

    return !!raw && raw.includes(":") && !isLikelySorobanContractId(raw);
}
