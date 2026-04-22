/**
 * Maps an arbitrary error thrown during a send/swap transaction to a stable
 * Transloco key. The goal is that the snackbar never shows raw `Error.message`
 * coming from ethers / web3 / RPC — those leak JSON-RPC payloads and provider
 * internals into the UI (see the Polygon `eth_getTransactionCount` regression).
 *
 * Always returns a key — never the original message. Callers should
 * `console.error` the original error themselves for debugging.
 */
export function mapTransactionErrorToTranslationKey(error: unknown): string {
    if (error instanceof Object) {
        const ethersKey = mapEthersError(error);
        if (ethersKey) return ethersKey;
    }

    if (looksLikeRpcOrTransportNoise(error)) {
        return "errors.send_transaction_network_error";
    }

    const messageKey = mapKnownErrorMessage(extractMessage(error));
    if (messageKey) return messageKey;

    return "errors.something_went_wrong";
}

const KNOWN_ERROR_KEYS = new Set([
    "errors.empty_password",
    "errors.insufficient_funds",
    "errors.invalid_credentials",
    "errors.invalid_private_key",
    "errors.private_key_locked",
    "errors.same_address",
    "errors.send_transaction_network_error",
    "errors.send_transaction_user_rejected",
    "errors.something_went_wrong",
]);

/** Allows callers (e.g. an inner layer) to throw with a translation key directly. */
function mapKnownErrorMessage(message: string): string | null {
    if (!message) return null;
    if (KNOWN_ERROR_KEYS.has(message)) return message;
    return null;
}

/**
 * ethers v6 `isError` lives in the same package as the wallet code; importing
 * it from this util pulled `ethers` into the same chunk graph as standalone
 * route components and triggered "Cannot access … before initialization" /
 * spurious "Cannot find module" chunk errors. We only need the `code` string
 * (ErrorCode) for mapping.
 */
const ETHERS_ERROR_CODE_TO_KEY: Record<string, string> = {
    INSUFFICIENT_FUNDS: "errors.insufficient_funds",
    ACTION_REJECTED: "errors.send_transaction_user_rejected",
    NETWORK_ERROR: "errors.send_transaction_network_error",
    TIMEOUT: "errors.send_transaction_network_error",
    SERVER_ERROR: "errors.send_transaction_network_error",
    BAD_DATA: "errors.send_transaction_network_error",
    NONCE_EXPIRED: "errors.send_transaction_network_error",
    REPLACEMENT_UNDERPRICED: "errors.send_transaction_network_error",
    UNCONFIGURED_NAME: "errors.send_transaction_network_error",
};

function mapEthersError(error: object): string | null {
    const code = (error as { code?: unknown }).code;
    if (typeof code !== "string") return null;
    return ETHERS_ERROR_CODE_TO_KEY[code] ?? null;
}

const RPC_NOISE_HINTS = [
    "jsonrpc",
    "json-rpc",
    "code=bad_data",
    "missing response for request",
    "missing revert data",
    "could not coalesce error",
    "eth_gettransactioncount",
    "eth_sendrawtransaction",
    "eth_estimategas",
    "eth_call",
    "eth_getlogs",
    "could not detect network",
    "underlying network changed",
    "value\" must be of type",
    "code=server_error",
    "code=network_error",
    "code=timeout",
];

function looksLikeRpcOrTransportNoise(error: unknown): boolean {
    const haystack = serializeForHeuristics(error).toLowerCase();
    if (!haystack) return false;
    if (RPC_NOISE_HINTS.some((hint) => haystack.includes(hint))) return true;
    if (haystack.length > 240) return true;
    return false;
}

function extractMessage(error: unknown): string {
    if (!error) return "";
    if (typeof error === "string") return error.trim();
    if (typeof error === "object" && "message" in (error as Record<string, unknown>)) {
        const value = (error as { message?: unknown }).message;
        if (typeof value === "string") return value.trim();
    }
    return "";
}

function serializeForHeuristics(error: unknown): string {
    if (!error) return "";
    if (typeof error === "string") return error;
    if (typeof error !== "object") return String(error);

    const parts: string[] = [];
    const message = extractMessage(error);
    if (message) parts.push(message);

    const code = (error as { code?: unknown }).code;
    if (code != null) parts.push(`code=${String(code)}`);

    try {
        parts.push(JSON.stringify(error, jsonReplacer));
    } catch {
        // Cyclic or unserializable errors fall through to the message-only haystack.
    }

    return parts.join(" ");
}

function jsonReplacer(_key: string, value: unknown): unknown {
    if (value instanceof Error) {
        return { name: value.name, message: value.message };
    }
    if (typeof value === "bigint") return value.toString();
    return value;
}
