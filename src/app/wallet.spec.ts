import { WalletModel } from "./wallet";

describe("Wallet", () => {
    it("should create a wallet instance", () => {
        const wallet = new WalletModel();
        expect(wallet).toBeTruthy();
    });
});
