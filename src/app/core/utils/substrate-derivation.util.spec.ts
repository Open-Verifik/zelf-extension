import { cryptoWaitReady, encodeAddress, mnemonicToMiniSecret, sr25519PairFromSeed } from "@polkadot/util-crypto";

import {
    SS58_KUSAMA,
    SS58_POLKADOT,
    substrateEncodeAddress,
    substrateKeyringPairFromMnemonic,
    substrateMiniSecretFromMnemonic,
    substratePublicKeyFromMnemonic,
} from "@shared/utils/substrate-derivation.util";

/** Vector aligned with Zelf `Repositories/Wallet/modules/polkadot-kusama.js` (miniSecret → sr25519 → SS58). */
const VECTOR = {
    mnemonic: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
    dot: "13KVd4f2a4S5pLp4gTTFezyXdPWx27vQ9vS6xBXJ9yWVd7xo",
    ksm: "Etp93jqLeBY8TczVXDJQoWNvMoY8VBSXoYNBYou5ghUBeC1",
};

describe("substrate-derivation.util (Zelf polkadot-kusama parity)", () => {
    beforeAll(async () => {
        await cryptoWaitReady();
    });

    it("miniSecret + public key matches direct util-crypto pair", () => {
        const seed = substrateMiniSecretFromMnemonic(VECTOR.mnemonic);
        const pair = sr25519PairFromSeed(seed);
        expect(Buffer.from(pair.publicKey)).toEqual(Buffer.from(substratePublicKeyFromMnemonic(VECTOR.mnemonic)));
    });

    it("encodes Polkadot (0) and Kusama (2) addresses like encodeAddress", () => {
        const seed = mnemonicToMiniSecret(VECTOR.mnemonic);
        const pair = sr25519PairFromSeed(seed);
        expect(substrateEncodeAddress(pair.publicKey, SS58_POLKADOT)).toBe(encodeAddress(pair.publicKey, SS58_POLKADOT));
        expect(substrateEncodeAddress(pair.publicKey, SS58_KUSAMA)).toBe(encodeAddress(pair.publicKey, SS58_KUSAMA));
        expect(substrateEncodeAddress(pair.publicKey, SS58_POLKADOT)).toBe(VECTOR.dot);
        expect(substrateEncodeAddress(pair.publicKey, SS58_KUSAMA)).toBe(VECTOR.ksm);
    });

    it("keyring pair from mnemonic matches expected SS58 addresses", async () => {
        const dotPair = await substrateKeyringPairFromMnemonic(VECTOR.mnemonic, SS58_POLKADOT);
        const ksmPair = await substrateKeyringPairFromMnemonic(VECTOR.mnemonic, SS58_KUSAMA);
        expect(dotPair.address).toBe(VECTOR.dot);
        expect(ksmPair.address).toBe(VECTOR.ksm);
        expect(dotPair.publicKey).toEqual(ksmPair.publicKey);
    });
});
