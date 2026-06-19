/**
 * TON (The Open Network) key derivation for Zelf multi-chain wallets.
 *
 * Zelf wallets use a single BIP39 mnemonic across every chain, so TON keys are
 * derived from the BIP39 seed via SLIP-0010 ed25519 at path `m/44'/607'/0'`
 * (607 = TON's registered SLIP-44 coin type) — the same scheme Trust Wallet and
 * other multi-chain wallets use. This intentionally differs from TON's native
 * 24-word mnemonic scheme so the TON address stays in sync with the rest of the
 * wallet (which is born from one BIP39 phrase).
 *
 * Wallet contract: V4R2 (`WalletContractV4`) on workchain 0 — the most widely
 * compatible standard wallet. The user-facing address uses the non-bounceable
 * (`UQ…`) form, which is the recommended format for funding a wallet.
 *
 * NOTE: this MUST match the Zelf backend TON derivation so the derived keypair
 * controls the same address the API stores in `publicData.tonAddress`.
 * Mirrors the pattern in `substrate-derivation.util.ts`.
 */
import { Address } from "@ton/core";
import { keyPairFromSeed, type KeyPair } from "@ton/crypto";
import { WalletContractV4 } from "@ton/ton";
import { derivePath } from "ed25519-hd-key";
import { mnemonicToSeed } from "@scure/bip39";

/** TON registered SLIP-44 coin type derivation path (hardened). */
export const TON_DERIVATION_PATH = "m/44'/607'/0'";

/** TON native token uses 9 decimals (1 TON = 1e9 nanoton). */
export const TON_DECIMALS = 9;

/** Standard wallets live on the basechain (workchain 0). */
export const TON_WORKCHAIN = 0;

function toHex(bytes: Uint8Array): string {
    let out = "";

    for (const b of bytes) out += b.toString(16).padStart(2, "0");

    return out;
}

/** BIP39 mnemonic → ed25519 keypair controlling the TON wallet contract. */
export async function tonKeyPairFromMnemonic(mnemonic: string): Promise<KeyPair> {
    const seed = await mnemonicToSeed(mnemonic.trim().toLowerCase());
    const { key } = derivePath(TON_DERIVATION_PATH, toHex(seed));

    return keyPairFromSeed(key);
}

/** Build the standard V4R2 wallet contract for a public key. */
export function tonWalletFromPublicKey(publicKey: Buffer): WalletContractV4 {
    return WalletContractV4.create({ workchain: TON_WORKCHAIN, publicKey });
}

/** BIP39 mnemonic → user-friendly TON address (non-bounceable `UQ…` by default). */
export async function tonAddressFromMnemonic(mnemonic: string, opts?: { testnet?: boolean; bounceable?: boolean }): Promise<string> {
    const { publicKey } = await tonKeyPairFromMnemonic(mnemonic);
    const wallet = tonWalletFromPublicKey(publicKey);

    return wallet.address.toString({
        bounceable: opts?.bounceable ?? false,
        testOnly: opts?.testnet ?? false,
        urlSafe: true,
    });
}

/** True when `address` parses as any valid TON address (raw or user-friendly). */
export function isValidTonAddress(address: string): boolean {
    if (!address) return false;

    try {
        Address.parse(address.trim());

        return true;
    } catch {
        return false;
    }
}
