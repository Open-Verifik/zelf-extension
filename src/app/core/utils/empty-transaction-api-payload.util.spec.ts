import { isEmptyTransactionApiPayload } from "./empty-transaction-api-payload.util";

describe("isEmptyTransactionApiPayload", () => {
    it("is true for undefined and null", () => {
        expect(isEmptyTransactionApiPayload(undefined)).toBeTrue();
        expect(isEmptyTransactionApiPayload(null)).toBeTrue();
    });

    it("is true for empty array (indexer not ready / empty data)", () => {
        expect(isEmptyTransactionApiPayload([])).toBeTrue();
    });

    it("is false for a non-empty object or array", () => {
        expect(isEmptyTransactionApiPayload({ hash: "0x1" })).toBeFalse();
        expect(isEmptyTransactionApiPayload([{ hash: "0x1" }])).toBeFalse();
    });
});
