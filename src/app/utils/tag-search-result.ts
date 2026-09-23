/** A failed or partial lookup must never authorize a new registration. */
export function requireCompleteTagSearch<T extends {
    available?: boolean;
    searchIncomplete?: boolean;
    error?: unknown;
    tagObject?: unknown;
    ipfs?: unknown[];
    arweave?: unknown[];
}>(data: T | null | undefined): T {
    if (!data || data.searchIncomplete || data.error || typeof data.available !== "boolean") {
        throw new Error("Tag availability could not be confirmed. Please try again.");
    }
    const hasRecords = Boolean(data.tagObject || data.ipfs?.length || data.arweave?.length);
    if ((data.available && hasRecords) || (!data.available && !data.tagObject)) {
        throw new Error("Tag availability could not be confirmed. Please try again.");
    }
    return data;
}
