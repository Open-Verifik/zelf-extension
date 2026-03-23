/** Stellar-only send preview for confirm UI (native XLM and classic assets). */

export type StellarSendMode = "payment" | "create_only" | "create_and_pay";

export interface StellarSendPreview {
    mode: StellarSendMode;
    /** True when destination has no ledger account yet (native path only). */
    destinationAccountMissing: boolean;
    /** Minimum XLM balance a funded account must keep (2 × base reserve). */
    minReserveXlm: number;
    /** XLM locked as reserve when opening a new account (equals minReserveXlm for create paths). */
    reservePortionXlm?: number;
    /** Additional native XLM sent after reserve (create_and_pay only). */
    transferPortionXlm?: number;
    /** User-entered send amount in XLM (native) or token units (classic). */
    userAmount: number;
    /** True when amount is below minReserveXlm on a create path. */
    amountBelowMinimum: boolean;
    /** User-facing warning keys (translate via send.stellar.*). */
    warningKeys: string[];
}

export interface StellarFeeBreakdown {
    preview: StellarSendPreview;
    /** XLM leaving the sender excluding the network fee (native + classic). */
    xlmDebitedExcludingNetworkFee: number;
}
