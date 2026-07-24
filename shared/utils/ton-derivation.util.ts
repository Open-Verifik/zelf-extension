/**
 * TON (The Open Network) key derivation for the Zelf extension wallet.
 *
 * Mirrors the Zelf backend derivation EXACTLY so the extension signs from the same address the
 * API stores in `publicData.tonAddress`:
 *   BIP39 seed -> ed25519 SLIP-0010 at `m/44'/607'/0'` -> `keyPairFromSeed` -> **Wallet V5R1**
 * (607 = TON's registered SLIP-44 coin type). Any drift from the backend (path, seed, or wallet
 * contract version) would derive a different address — keep this in sync with
 * `Repositories/Wallet/modules/ton.js` and `Repositories/TON/modules/ton-transfer.module.js`.
 *
 * The user-facing address uses the bounceable (`EQ…`) form, matching what the backend stores.
 */
import { Address } from "@ton/core";
import { keyPairFromSeed, type KeyPair } from "@ton/crypto";
import { WalletContractV5R1 } from "@ton/ton";
import { derivePath } from "ed25519-hd-key";
import { mnemonicToSeed } from "bip39";

/** TON registered SLIP-44 coin type derivation path (hardened) — same as the backend. */
export const TON_DERIVATION_PATH = "m/44'/607'/0'";

/** TON native token uses 9 decimals (1 TON = 1e9 nanoton). */
export const TON_DECIMALS = 9;

/** Standard wallets live on the basechain (workchain 0). */
export const TON_WORKCHAIN = 0;

/** BIP39 mnemonic -> ed25519 keypair controlling the TON Wallet V5R1 contract. */
export async function tonKeyPairFromMnemonic(mnemonic: string): Promise<KeyPair> {
    const seed = await mnemonicToSeed(mnemonic.trim());
    const { key } = derivePath(TON_DERIVATION_PATH, seed.toString("hex"));

    return keyPairFromSeed(key.slice(0, 32));
}

/** Build the standard Wallet V5R1 contract for a public key (workchain 0). */
export function tonWalletFromPublicKey(publicKey: Buffer): WalletContractV5R1 {
    return WalletContractV5R1.create({ workchain: TON_WORKCHAIN, publicKey });
}

/** BIP39 mnemonic -> user-friendly TON address (bounceable `EQ…`, matching the backend). */
export async function tonAddressFromMnemonic(mnemonic: string, opts?: { testnet?: boolean; bounceable?: boolean }): Promise<string> {
    const { publicKey } = await tonKeyPairFromMnemonic(mnemonic);
    const wallet = tonWalletFromPublicKey(publicKey);

    return wallet.address.toString({
        bounceable: opts?.bounceable ?? true,
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
