# RPC Usage Audit

## Summary

This extension currently keeps paid RPC credentials bundled in the environment files, while adding some targeted hardening around how they are used.

- `eth_subscribe` is not used by the current extension code paths.
- The extension uses HTTP JSON-RPC providers (`fetch`, `ethers.JsonRpcProvider`, `Web3.providers.HttpProvider`), not websocket subscriptions.
- The large `eth_subscribe` spike is therefore consistent with external abuse of exposed provider URLs, not normal in-extension behavior.

## Current RPC Buckets

### Wallet-native flows

These are initiated by wallet UI features and native send flows:

- `src/app/eth.service.ts`: Ethereum balance, fee, nonce, and send flows
- `src/app/services/avax.service.ts`: Avalanche balance, nonce, gas, and send flows
- `src/app/services/polygon.service.ts`: Polygon balance and send flows
- `src/app/services/bsc.service.ts`: BNB Chain balance and send flows
- `src/app/solana.service.ts`: Solana reads and sends
- `src/app/services/stellar.service.ts`: Stellar Horizon access
- `src/app/services/sui.service.ts`: Sui RPC access

### Swap flows

- `src/app/services/lifi.service.ts`: LiFi quote execution uses EVM RPC for fee data, nonce lookup, allowance checks, and signed transaction broadcast

### dApp-triggered flows

- `background-scripts/services/dapp-handler.ts`: read-only JSON-RPC proxy for connected dApps
- `src/app/services/dapp-gas-estimation.service.ts`: dApp gas estimation and fee lookups
- `src/app/services/signing.service.ts`: dApp EVM broadcast path uses the gas-estimation RPC resolver

## Runtime Source Of Truth

### Bundled environment RPCs

These are consumed by wallet-native flows and LiFi execution:

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`
- `src/environments/environment-ext.prod.ts`

### Shared dApp chain list

These power dApp read calls and most dApp gas-estimation resolution:

- `shared/types/dapp.types.ts`

## Chain Matrix

| Chain | Current usage | Source |
| --- | --- | --- |
| Ethereum | Wallet reads/sends, LiFi, dApp gas fallback | `environment*.ts`, `dapp.types.ts` |
| Avalanche | Wallet reads/sends, LiFi, dApp gas fallback | `environment*.ts`, `dapp.types.ts` |
| Polygon | Wallet reads/sends, LiFi, dApp gas fallback | `environment*.ts`, `dapp.types.ts` |
| BNB Chain | Wallet reads/sends, LiFi, dApp gas fallback | `environment*.ts`, `dapp.types.ts` |
| Solana | Wallet reads/sends | `environment*.ts` |
| Stellar | Wallet reads | `environment*.ts` |
| Sui | Wallet reads/sends | `environment*.ts` |
| Base | dApp gas/read only | `dapp.types.ts` |
| Arbitrum | dApp gas/read only | `dapp.types.ts` |
| Optimism | dApp gas/read only | `dapp.types.ts` |
| BlockDAG | dApp gas/read only | `dapp.types.ts` |
| Bitcoin | No active TypeScript consumer found | `environment*.ts` only |

## Immediate Hardening Applied

- Kept the existing bundled paid RPC URLs in place for now.
- Added dApp RPC method blocking for abusive or subscription-oriented methods such as `eth_subscribe`.
- Reduced unnecessary client churn in Solana and LiFi flows.

## Backend Follow-up

Protected server-side RPC proxy work now lives in the `zelf` backend under `Repositories/RPC/`, where JWT, session checks, chain policy, method allowlists, and request logging can be enforced without exposing provider credentials in the shipped extension.
