/**
 * `GET .../transaction/:hash` can return 200 with `data: []` while the indexer
 * lags. Empty arrays are truthy in JavaScript, so call sites must use this
 * instead of `if (!response.data)` alone.
 */
export function isEmptyTransactionApiPayload(data: unknown): boolean {
    if (data == null) return true;
    if (Array.isArray(data) && data.length === 0) return true;
    return false;
}
