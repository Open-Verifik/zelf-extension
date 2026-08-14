import { aptosAccountFromMnemonic, aptosAddressFromMnemonic, aptToOctas, isValidAptosAddress } from "@shared/utils/aptos-derivation.util";

describe("Aptos derivation", () => {
    const mnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
    const address = "0xeb663b681209e7087d681c5d3eed12aaa8e1915e7c87794542c3f96e94b3d3bf";
    const publicKey = "0xa686f0309ab80312979606cfccc10ea2740147ae6888351488d11c46f08fbf60";

    it("matches the backend legacy Ed25519 vector", () => {
        const account = aptosAccountFromMnemonic(mnemonic);

        expect(aptosAddressFromMnemonic(mnemonic)).toBe(address);
        expect(account.publicKey.toString()).toBe(publicKey);
    });

    it("validates canonical and short Aptos addresses", () => {
        expect(isValidAptosAddress(address)).toBeTrue();
        expect(isValidAptosAddress("0x1")).toBeTrue();
        expect(isValidAptosAddress("not-an-address")).toBeFalse();
    });

    it("converts decimal APT to octas without floating point", () => {
        expect(aptToOctas("1")).toBe(100_000_000n);
        expect(aptToOctas("0.00000001")).toBe(1n);
        expect(aptToOctas("12.34567890")).toBe(1_234_567_890n);
    });
});
