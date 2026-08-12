import { DEFAULT_NETWORK_CONFIGS, mergeNetworkSettings } from "./network-settings.util";

describe("Canton network capability gate", () => {
    it("exposes Canton in Manage Networks as unavailable by default", () => {
        const canton = DEFAULT_NETWORK_CONFIGS.find((network) => network.id === "canton");

        expect(canton).toEqual(
            jasmine.objectContaining({
                available: false,
                enabled: false,
                symbol: "CC",
            })
        );
    });

    it("does not allow persisted settings to enable Canton before backend setup", () => {
        const merged = mergeNetworkSettings([
            { id: "canton", name: "Canton", symbol: "CC", enabled: true },
        ]);
        const canton = merged.find((network) => network.id === "canton");

        expect(canton?.enabled).toBeFalse();
        expect(canton?.available).toBeFalse();
    });
});
