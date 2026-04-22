import { TransactionData } from "@shared/types/wallet.types";

import { areSendAddressesSame } from "./same-wallet-address.util";

function evmTxData(): TransactionData {
    return new TransactionData({ token: { tokenType: "POL", network: "Polygon" } });
}

function solTxData(): TransactionData {
    return new TransactionData({ token: { tokenType: "SOL", network: "Solana" } });
}

describe("areSendAddressesSame", () => {
    it("returns false when either address is missing", () => {
        const txData = evmTxData();

        expect(areSendAddressesSame("", "0xabc", txData)).toBeFalse();
        expect(areSendAddressesSame("0xabc", "", txData)).toBeFalse();
        expect(areSendAddressesSame(null, null, txData)).toBeFalse();
    });

    it("matches EVM addresses across checksum casing", () => {
        const txData = evmTxData();
        const lower = "0x75f766ae57e08c9470cce2ac30db2b6b009fccde";
        const checksummed = "0x75F766ae57E08C9470CCe2AC30dB2b6B009Fccde";

        expect(areSendAddressesSame(lower, checksummed, txData)).toBeTrue();
    });

    it("returns true for identical EVM addresses with surrounding whitespace", () => {
        const txData = evmTxData();
        const addr = "0x75F766ae57E08C9470CCe2AC30dB2b6B009Fccde";

        expect(areSendAddressesSame(`  ${addr}  `, addr, txData)).toBeTrue();
    });

    it("returns false for distinct EVM addresses", () => {
        const txData = evmTxData();

        expect(
            areSendAddressesSame(
                "0x75F766ae57E08C9470CCe2AC30dB2b6B009Fccde",
                "0x0000000000000000000000000000000000000001",
                txData
            )
        ).toBeFalse();
    });

    it("compares non-EVM addresses with strict equality after trim", () => {
        const txData = solTxData();
        const addr = "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin";

        expect(areSendAddressesSame(addr, ` ${addr} `, txData)).toBeTrue();
        expect(areSendAddressesSame(addr.toLowerCase(), addr, txData)).toBeFalse();
    });
});
