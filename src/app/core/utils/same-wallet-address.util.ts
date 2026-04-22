import { ethers } from "ethers";

import { TransactionData } from "@shared/types/wallet.types";

/**
 * Normalize an address for case-insensitive equality where appropriate
 * (EVM checksum casing). Returns a comparable string for any chain.
 *
 * Out of scope: Bitcoin script-equivalent encodings (legacy vs SegWit).
 */
function normalizeAddressForChain(address: string, isEVM: boolean): string {
    const trimmed = (address || "").trim();

    if (!trimmed) return "";

    if (isEVM) {
        try {
            // Lowercase first: ethers v6 rejects wrong EIP-55 casing; we only need a canonical form for equality.
            return ethers.getAddress(trimmed.toLowerCase());
        } catch {
            return trimmed.toLowerCase();
        }
    }

    return trimmed;
}

/**
 * True when the sender and receiver resolve to the same on-chain address for
 * the network described by `transactionData`. Empty inputs are treated as
 * "not the same" so callers don't have to short-circuit.
 */
export function areSendAddressesSame(
    senderAddress: string | undefined | null,
    receiverAddress: string | undefined | null,
    transactionData: Pick<
        TransactionData,
        "isEthToken" | "isPolToken" | "isBscToken" | "isAvaxToken" | "isBDAGToken"
    >
): boolean {
    if (!senderAddress || !receiverAddress) return false;

    const isEVM = !!(
        transactionData.isEthToken ||
        transactionData.isPolToken ||
        transactionData.isBscToken ||
        transactionData.isAvaxToken ||
        transactionData.isBDAGToken
    );

    const sender = normalizeAddressForChain(senderAddress, isEVM);
    const receiver = normalizeAddressForChain(receiverAddress, isEVM);

    if (!sender || !receiver) return false;

    return sender === receiver;
}
