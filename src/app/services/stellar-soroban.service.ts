import { Injectable } from "@angular/core";

import { isLikelySorobanContractId } from "./stellar-transaction.util";

/**
 * Soroban uses RPC + simulation and must not share the classic Horizon `TransactionBuilder` path.
 * Full token transfers are not implemented here yet; this service isolates detection and messaging.
 */
@Injectable({
    providedIn: "root",
})
export class StellarSorobanService {
    isSorobanTokenRef(tokenAddress: string | undefined): boolean {
        return isLikelySorobanContractId(tokenAddress);
    }

    /** @throws Error with message `errors.stellar_soroban_not_supported` when ref is a contract id */
    assertClassicOrNativeOnly(tokenAddress: string | undefined): void {
        if (this.isSorobanTokenRef(tokenAddress)) {
            throw new Error("errors.stellar_soroban_not_supported");
        }
    }
}
