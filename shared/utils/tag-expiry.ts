/** API tag timestamps without an explicit offset are UTC, not browser-local time. */
export function parseTagExpiry(value: string | null | undefined): Date {
    const iso = (value ?? "").trim().replace(" ", "T");
    const naiveUtc = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?$/.test(iso);
    const date = new Date(naiveUtc ? `${iso}Z` : iso);
    // Date silently normalizes impossible dates such as February 30.
    if (naiveUtc && Number.isFinite(date.getTime()) && date.toISOString().slice(0, 19) !== iso.slice(0, 19)) {
        return new Date(NaN);
    }
    return date;
}
