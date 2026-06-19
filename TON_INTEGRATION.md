# TON (Toncoin) Integration

Research notes and design decisions for adding **TON (The Open Network)** as a
first-class network in the Zelf wallet extension. Mirrors the existing non-EVM
precedents (Sui, Stellar, Polkadot/Kusama).

## Research summary

- **Token:** Toncoin (TON), native coin of The Open Network. 9 decimals (1 TON = 1e9 nanoton).
- **Account model:** TON is contract-based — a "wallet" is a smart contract that holds the balance and verifies an ed25519 signature. The standard wallet contract is **V4R2** (`WalletContractV4`); the newer **W5** (`WalletContractV5R1`) is gaining adoption.
- **Addresses:** derived from `(workchain, stateInit hash)`. Two user-facing forms exist:
  - **bounceable** (`EQ…`) — used for contracts/exchanges.
  - **non-bounceable** (`UQ…`) — recommended for funding a personal wallet. We display this form.
- **Key derivation:** TON has its own 24-word mnemonic scheme, but Zelf wallets use **one BIP39 mnemonic shared across all chains**. So we derive TON keys from the BIP39 seed via SLIP-0010 ed25519 at path **`m/44'/607'/0'`** (607 = TON's SLIP-44 coin type) — the same scheme Trust Wallet and other multi-chain wallets use.
- **RPC:** public access via **toncenter** (`https://toncenter.com/api/v2/jsonRPC`). An optional API key raises rate limits.

### References
- https://coinmarketcap.com/currencies/toncoin/
- https://github.com/mytonwallet-org/mytonwallet
- https://docs.ton.org/

## What this PR adds

| Area | File |
|---|---|
| Key derivation (BIP39 → ed25519 → V4R2 address) | `shared/utils/ton-derivation.util.ts` |
| Chain service (balance / fees / send via toncenter) | `src/app/services/ton.service.ts` |
| `publicData.tonAddress` reader + model field | `shared/types/tag.types.ts` |
| Network registry (name/symbol/chainId/image) | `src/app/services/network.service.ts` |
| Manage-Networks defaults | `src/app/core/network-settings.util.ts` |
| Wallet wiring (address, available networks, icon) | `src/app/wallet.service.ts` |
| Routing (balance / fees / send / explorer) | `src/app/services/blockchain-transactions.service.ts` |
| RPC config | `src/environments/environment*.ts` |
| Network icon | `src/assets/networks/ton.svg` |
| SDKs | `@ton/ton`, `@ton/core`, `@ton/crypto` |

## Contract with the backend

Like every other chain, the TON address is expected from the API in
`publicData.tonAddress`. The client-side derivation in
`ton-derivation.util.ts` **must match the backend derivation** so the derived
keypair controls the same address the API stores (same relationship documented
in `substrate-derivation.util.ts`). If the backend uses a different wallet
contract version or derivation path, align both sides.

## Known limitations / follow-ups

- **Fee estimation** uses a stable constant (~0.0055 TON, the typical simple-transfer cost) instead of `estimateExternalMessageFee`, which needs the signed body (and thus the mnemonic) — not available at fee-quote time. Dynamic estimation can be wired later.
- **Transaction history / tx-detail** for TON is not yet sourced (no `requestTransactionDetails` case); balances and sends are functional.
- Wallet contract is fixed to **V4R2**; consider exposing **W5** as the default for new wallets.
