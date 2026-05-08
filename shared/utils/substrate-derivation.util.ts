/**
 * Matches Zelf backend `Repositories/Wallet/modules/polkadot-kusama.js`:
 * BIP39 mnemonic → `mnemonicToMiniSecret` → SR25519 keypair → SS58 (0 = Polkadot, 2 = Kusama).
 */
import { Keyring } from "@polkadot/keyring";
import { cryptoWaitReady, encodeAddress, mnemonicToMiniSecret, sr25519PairFromSeed } from "@polkadot/util-crypto";

export const SS58_POLKADOT = 0;
export const SS58_KUSAMA = 2;

export async function substrateCryptoReady(): Promise<void> {
    await cryptoWaitReady();
}

export function substrateMiniSecretFromMnemonic(mnemonic: string): Uint8Array {
    return mnemonicToMiniSecret(mnemonic.trim().toLowerCase());
}

export function substratePublicKeyFromMnemonic(mnemonic: string): Uint8Array {
    const seed = substrateMiniSecretFromMnemonic(mnemonic);
    return sr25519PairFromSeed(seed).publicKey;
}

export function substrateEncodeAddress(publicKey: Uint8Array, ss58Format: number): string {
    return encodeAddress(publicKey, ss58Format);
}

export async function substrateKeyringPairFromMnemonic(mnemonic: string, ss58Format: number) {
    await substrateCryptoReady();
    const seed = substrateMiniSecretFromMnemonic(mnemonic);
    const keyring = new Keyring({ type: "sr25519", ss58Format });
    return keyring.addFromSeed(seed);
}
