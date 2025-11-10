import { WalletModel } from "@shared/types/wallet.types";

describe("Wallet", () => {
    it("should create a wallet instance", () => {
        const wallet = new WalletModel();
        expect(wallet).toBeTruthy();
    });
});
