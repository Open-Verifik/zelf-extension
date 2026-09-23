import { requireCompleteTagSearch } from "./tag-search-result";

describe("tag availability", () => {
    it("accepts an explicitly available name only after a complete lookup", () => {
        expect(requireCompleteTagSearch({ available: true, ipfs: [], arweave: [] }).available).toBeTrue();
    });
    it("preserves an occupied result", () => {
        const result = { available: false, tagObject: { publicData: { ethAddress: "0xabc" } } };
        expect(requireCompleteTagSearch(result)).toBe(result);
    });
    it("rejects missing, partial, failed and contradictory results", () => {
        for (const result of [undefined, {}, { available: false }, { available: true, searchIncomplete: true },
            { available: true, error: "timeout" }, { available: true, tagObject: {} },
            { available: true, ipfs: [{}] }, { available: true, arweave: [{}] }]) {
            expect(() => requireCompleteTagSearch(result)).toThrowError();
        }
    });
});
