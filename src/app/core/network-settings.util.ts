import { NetworkConfig } from "app/models/settings.model";

/** Canonical list; keep in sync with BlockchainTransactionsService chain ids. */
export const DEFAULT_NETWORK_CONFIGS: NetworkConfig[] = [
    { id: "ethereum", name: "Ethereum", symbol: "ETH", enabled: true },
    { id: "avalanche", name: "Avalanche", symbol: "AVAX", enabled: true },
    { id: "binance", name: "BNB Chain", symbol: "BNB", enabled: true },
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", enabled: true },
    { id: "blockdag", name: "BlockDAG", symbol: "BDAG", enabled: true },
    { id: "polygon", name: "Polygon", symbol: "POL", enabled: true },
    { id: "solana", name: "Solana", symbol: "SOL", enabled: true },
    { id: "stellar", name: "Stellar", symbol: "XLM", enabled: true },
    { id: "sui", name: "Sui", symbol: "SUI", enabled: true },
    { id: "polkadot", name: "Polkadot", symbol: "DOT", enabled: true },
    { id: "kusama", name: "Kusama", symbol: "KSM", enabled: true },
];

/**
 * Chain ids the app supports but `tags.wallet.networks` on the domain license may omit.
 * Merge these into the license allowlist so Manage Networks matches {@link DEFAULT_NETWORK_CONFIGS}.
 */
export const NETWORK_IDS_ENSURED_FROM_LICENSE_GAP: readonly string[] = ["stellar", "bitcoin", "sui", "polkadot", "kusama"];

/**
 * Merge saved toggles into defaults so new chains (e.g. stellar) appear enabled
 * for users whose stored settings predate them.
 */
export function mergeNetworkSettings(saved: NetworkConfig[] | undefined | null): NetworkConfig[] {
    if (!Array.isArray(saved) || !saved.length) {
        return DEFAULT_NETWORK_CONFIGS.map((n) => ({ ...n }));
    }

    return DEFAULT_NETWORK_CONFIGS.map((def) => {
        const existing = saved.find((s) => s.id === def.id);

        return existing ? { ...def, ...existing } : { ...def };
    });
}

/** True when persisted list is missing any default network id (needs re-save). */
export function shouldPersistNetworkMerge(saved: NetworkConfig[] | undefined | null, merged: NetworkConfig[]): boolean {
    if (!Array.isArray(saved) || !saved.length) {
        return merged.length > 0;
    }

    const savedIds = new Set(saved.map((n) => n.id));

    return DEFAULT_NETWORK_CONFIGS.some((d) => !savedIds.has(d.id));
}
