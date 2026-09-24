import { parseTagExpiry } from "../../../shared/utils/tag-expiry";
import { TagPublicDataModel } from "../../../shared/types/tag.types";

describe("UTC tag expiry", () => {
    const now = Date.parse("2026-09-24T00:36:00Z");
    const raw = "2026-09-24 05:31:41";

    it("uses the server expiry instead of adding the browser timezone", () => {
        expect(parseTagExpiry(raw).getTime() - now).toBe((4 * 3600 + 55 * 60 + 41) * 1000);
    });

    it("resolves legacy UTC and ISO timestamps to the same instant", () => {
        const expected = Date.parse("2026-09-24T05:31:41Z");
        for (const value of [raw, "2026-09-24T05:31:41Z", "2026-09-24T05:31:41.000Z",
            "2026-09-24T00:31:41-05:00", "2026-09-24T11:01:41+05:30", "2026-09-24 05:31:41.000"]) {
            expect(parseTagExpiry(value).getTime()).withContext(value).toBe(expected);
        }
    });

    it("does not invent an expiration for malformed or missing dates", () => {
        for (const value of [null, undefined, "", "not-a-date", "2026-02-30 12:00:00"]) {
            expect(Number.isNaN(parseTagExpiry(value).getTime())).toBeTrue();
        }
    });

    it("expires a hold at the UTC deadline without adding a grace period", () => {
        jasmine.clock().install();
        try {
            const model = new TagPublicDataModel({ expiresAt: raw, type: "hold" });
            const expiry = Date.parse("2026-09-24T05:31:41Z");
            jasmine.clock().mockDate(new Date(expiry - 1));
            expect(model.isExpired).toBeFalse();
            jasmine.clock().mockDate(new Date(expiry));
            expect(model.isExpired).toBeTrue();
            expect(model.isFullyExpired).toBeTrue();
            expect(model.isInGracePeriod).toBeFalse();
            expect(model.gracePeriod).toBeNull();
        } finally { jasmine.clock().uninstall(); }
    });

    it("keeps mainnet grace rules and the stored timestamp intact", () => {
        const hold = new TagPublicDataModel({ expiresAt: raw, type: "hold" });
        const mainnet = new TagPublicDataModel({ expiresAt: raw, type: "mainnet" });
        expect(hold.expiresAt).toBe(raw);
        expect(hold.gracePeriod).toBeNull();
        expect(mainnet.expiresAt).toBe(raw);
        expect(mainnet.gracePeriod!.getTime()).toBeGreaterThan(parseTagExpiry(raw).getTime());
    });
});
