import { SUPPORTED_CHAINS } from "../types/dapp.types";

/**
 * Maps dApp origins (or parts of origins) to their preferred/native networks.
 * These are smart defaults used when a dApp doesn't explicitly request a chain,
 * or when we want to provide the best user experience for known sites.
 */
export const DAPP_PREFERRED_NETWORKS: Record<string, number> = {
    // --- BlockDAG / Zelf Ecosystem (1404) ---
    "zelf.world": 1404,
    "zelf.world/nft": 1404,
    "dashboard.zelf.world": 1404,
    "bdagscan.com": 1404,
    "blockdag.network": 1404,

    // --- Avalanche (43114) ---
    "core.app": 43114,
    "avalanche.org": 43114,
    "traderjoexyz.com": 43114,
    "yieldyak.com": 43114,
    "pangolin.exchange": 43114,
    "platypus.finance": 43114,
    "benqi.fi": 43114,
    "gmx.io": 43114,
    "stargate.finance": 43114,
    "avascan.info": 43114,
    "snowtrace.io": 43114,
    "colony.lab": 43114,
    "joepegs.com": 43114,
    "axial.exchange": 43114,
    "steaks.finance": 43114,
    "vectorfinance.io": 43114,
    "moo.yieldyak.com": 43114,
    "app.wonderland.money": 43114,

    // --- Ethereum Mainnet (1) ---
    "uniswap.org": 1,
    "opensea.io": 1,
    "app.lido.fi": 1,
    "curve.fi": 1,
    "aave.com": 1,
    "compound.finance": 1,
    "sushiswap.com": 1,
    "balancer.fi": 1,
    "makerdao.com": 1,
    "app.1inch.io": 1,
    "yearn.fi": 1,
    "etherscan.io": 1,
    "ens.domains": 1,
    "snapshot.org": 1,
    "app.zerion.io": 1,
    "zapper.fi": 1,
    "blur.io": 1,
    "looksrare.org": 1,
    "fractal.is": 1,
    "coingecko.com": 1,
    "dexscreener.com": 1,
    "dextools.io": 1,
    "convexfinance.com": 1,
    "frax.finance": 1,
    "rocketpool.net": 1,
    "stakewise.io": 1,
    "eigenlayer.xyz": 1,
    "instadapp.io": 1,
    "morpho.org": 1,
    "pendle.finance": 1,

    // --- Arbitrum One (42161) ---
    "app.gmx.io": 42161,
    "arbitrum.io": 42161,
    "hop.exchange": 42161,
    "radiant.capital": 42161,
    "camelot.exchange": 42161,
    "arbiscan.io": 42161,
    "dypex.exchange": 42161,
    "arbitrum.network": 42161,
    "chronos.exchange": 42161,
    "vincit.fi": 42161,

    // --- Optimism (10) ---
    "optimism.io": 10,
    "velodrome.finance": 10,
    "lyra.finance": 10,
    "kwenta.eth.limo": 10,
    "synthetix.io": 10,
    "optimistic.etherscan.io": 10,
    "sonne.finance": 10,
    "beethovenx.io": 10,

    // --- Base (8453) ---
    "base.org": 8453,
    "aerodrome.finance": 8453,
    "friend.tech": 8453,
    "basescan.org": 8453,
    "moonwell.fi": 8453,
    "across.to": 8453,
    "extrabe.fi": 8453,
    "basename.app": 8453,

    // --- BNB Chain (56) ---
    "pancakeswap.finance": 56,
    "bnbchain.org": 56,
    "venus.io": 56,
    "bscscan.com": 56,
    "alpaca.finance": 56,
    "biswap.org": 56,
    "babyswap.finance": 56,
    "ellipsis.finance": 56,
    "ape-swap.finance": 56,
    "bakeryswap.org": 56,
    "bi-swap.com": 56,

    // --- Polygon (137) ---
    "quickswap.exchange": 137,
    "polygon.technology": 137,
    "polygonscan.com": 137,
    "sand.game": 137,
    "decentraland.org": 137,
    "mstable.org": 137,
    "clipper.exchange": 137,
    "peaseasy.com": 137,
    "gravity.finance": 137,
    "messina.exchange": 137,
};

/**
 * Returns the preferred chain ID for a given origin based on our mapped records.
 */
export function getPreferredChainIdForOrigin(origin: string): number | undefined {
    if (!origin) return undefined;

    const cleanOrigin = origin
        .toLowerCase()
        .replace(/^https?:\/\//, "")
        .replace(/\/$/, "");

    // 1. Exact match check
    if (DAPP_PREFERRED_NETWORKS[cleanOrigin]) {
        return DAPP_PREFERRED_NETWORKS[cleanOrigin];
    }

    // 2. Contains match (for subdomains and paths)
    for (const [key, chainId] of Object.entries(DAPP_PREFERRED_NETWORKS)) {
        if (cleanOrigin.includes(key)) {
            return chainId;
        }
    }

    return undefined;
}

/**
 * Returns the chain name for a preferred chain ID mapping if found.
 */
export function getPreferredNetworkName(origin: string): string | undefined {
    const chainId = getPreferredChainIdForOrigin(origin);
    if (!chainId) return undefined;

    return SUPPORTED_CHAINS.find((c) => c.chainId === chainId)?.name;
}
