export const environment = {
    apiUrl: "http://localhost:3050",
    appUrl: "https://zelf.world",
    baseUrl: "/index.html",
    captchaKey: "6LcAhbIqAAAAANEZltlDqWutQ_kcujZ7IUKIQiK1",
    includeNonPaidDomains: true,
    keysUrl: "https://keys.zelf.world",
    paymentDomainUrl: "http://localhost:3009/tags/payment",
    production: false,
    testnetAddress: "",
    znsUsdPrice: 0.05,
    zelfKeysPasswordSaveZns: 10,
    networks: {
        ethereum: "sepolia",
        avalanche: "avalanche",
        solana: "solana",
    },
    bitcoin: {
        mainnet: "https://broken-few-valley.btc.quiknode.pro/b357e9fc23471664e4554a4b973b48df9f0d1b33/",
        testnet: "https://little-old-model.btc-testnet.quiknode.pro/bc869f0ab39ee934fa4369cb0c83254639c08ae7/",
    },
    ethereumRpc: {
        mainnet: "https://compatible-skilled-dew.quiknode.pro/817e4f1a5f57dfe63d5fab4ed729c8afcbd87363/",
        testnet: "https://practical-newest-sailboat.ethereum-sepolia.quiknode.pro/4206bb8d81ddc0bb93acf60f3c76608d7e21f975/",
    },
    polygonRpc: {
        mainnet: "https://responsive-wandering-choice.matic.quiknode.pro/d4a8a38223c463bd108ee7e6c38e68b0ac736e27/",
    },
    avalancheRpc: {
        mainnet: "https://wild-bitter-meadow.avalanche-mainnet.quiknode.pro/e2565749ca44c2873fe2a0a747f5ac68ae7eb14f/ext/bc/C/rpc/",
    },
    binanceRpc: {
        mainnet: "https://dark-rough-wildflower.bsc.quiknode.pro/82a34b9b4cb74f29bc8fcc2ea965657c631d6c3a/",
    },
    stellarRpc: {
        mainnet: "https://compatible-skilled-dew.stellar-mainnet.quiknode.pro/817e4f1a5f57dfe63d5fab4ed729c8afcbd87363",
    },
    suiRpc: {
        mainnet: "https://fullnode.mainnet.sui.io:443",
        testnet: "https://fullnode.testnet.sui.io:443",
        devnet: "https://fullnode.devnet.sui.io:443",
    },
    /** TON (The Open Network) JSON-RPC via toncenter. `apiKey` optional (raises rate limits). */
    tonRpc: {
        mainnet: "https://toncenter.com/api/v2/jsonRPC",
        testnet: "https://testnet.toncenter.com/api/v2/jsonRPC",
        apiKey: "",
    },
    /** Polkadot / Kusama relay JSON-RPC (HTTP) for @polkadot/api in the extension. */
    polkadotRelayRpc: "https://rpc.polkadot.io",
    kusamaRelayRpc: "https://kusama-rpc.polkadot.io",
    /** Kusama Asset Hub (parachain) — same SS58 as relay; Trust and many apps default native KSM here. */
    kusamaAssetHubRpc: "https://kusama-asset-hub-rpc.polkadot.io",
};
