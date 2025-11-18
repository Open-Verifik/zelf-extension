# Seal SDK Integration Guide

## Overview

The Seal SDK (`@mysten/seal`) provides production-grade threshold encryption with on-chain access control. This guide explains how to integrate it into Zelf Authenticator.

## What is Seal SDK?

Seal SDK provides:
- **Threshold Encryption**: BLS12381-based threshold encryption
- **Access Control**: On-chain Move contracts define who can decrypt
- **Key Servers**: Decentralized key servers manage encryption keys
- **Session Keys**: Backup keys for recovery

## Current Status

✅ **Installed**: `@mysten/seal@0.9.3`  
✅ **Integrated**: Basic structure in `SealService`  
⚠️ **Pending**: Full implementation requires:
- Key server configuration
- Move contract deployment
- Transaction building for access control

## Architecture

### Current Implementation (Shamir's Secret Sharing)
- Simple, self-contained
- No external dependencies
- Works offline
- Good for basic secret sharing

### Seal SDK Implementation (Production)
- Production-grade cryptography
- On-chain access control
- Key server infrastructure
- Requires Move contracts

## Setup Steps

### 1. Key Server Configuration

Seal requires key server configurations. For mainnet, you need:

```typescript
const keyServerConfigs = [
    {
        objectId: "0x...", // Key server object ID on Sui
        weight: 1,
        apiKeyName: "optional-api-key-name",
        apiKey: "optional-api-key"
    },
    // ... more key servers
];
```

**How to get key server configs:**
- Check Seal documentation: https://seal-docs.wal.app
- Contact Mysten Labs for mainnet key servers
- Use testnet key servers for development

### 2. Move Contract Deployment

Seal requires Move contracts with `seal_approve*` functions:

```move
module zotp::access_control {
    use seal::seal;

    /// Approve access for ZOTP recovery
    public fun seal_approve_zotp_recovery(
        id: vector<u8>,
        // Add your access control logic here
    ) {
        // Example: Check if user owns the ZOTP
        // Example: Check time-based conditions
        // Example: Check multi-sig requirements
    }
}
```

**Deploy steps:**
1. Write Move contract with `seal_approve*` functions
2. Build: `sui move build`
3. Publish: `sui client publish`
4. Get `packageId` from deployment

### 3. Initialize Seal SDK

**Easy way (Testnet):**
```typescript
import { SealService } from 'app/services/seal.service';

const sealService = new SealService();

// Initialize with testnet (uses Mysten Labs testnet key servers)
await sealService.initializeSealSDKWithTestnet();
```

**Custom configuration:**
```typescript
await sealService.initializeSealSDK({
    network: "testnet", // or "mainnet", "devnet"
    keyServerConfigs: [
        { objectId: "0x...", weight: 1 }
    ],
    verifyKeyServers: true,
    timeout: 30000
});
```

**Testnet Key Servers (Pre-configured):**
- `mysten-testnet-1`: `0x73d05d62c18d9374e3ea529e8e0ed6161da1a141a94d3f76ae3fe4e99356db75`
- `mysten-testnet-2`: `0xf5d14a81a982144ae441cd7d64b09027f116a468bd36e7eca494f750591623c8`

### 4. Encrypt with Seal SDK

```typescript
const { encryptedObject, sessionKey } = await sealService.encryptWithSealSDK(
    setupKey,
    {
        threshold: 3,
        packageId: "0x...", // Your Move package ID
        id: zotpId, // Unique identifier
        kemType: "BLS12381",
        demType: "AES256GCM"
    }
);

// Store encryptedObject in Walrus
// Store sessionKey securely (backup)
```

### 5. Decrypt with Seal SDK

```typescript
// Build transaction that calls seal_approve* function
const txBytes = await buildSealApproveTransaction(zotpId);

// Decrypt
const decryptedSecret = await sealService.decryptWithSealSDK(
    encryptedObject,
    sessionKey,
    txBytes
);
```

## Hybrid Approach

The current implementation supports both:

```typescript
// Use Shamir's Secret Sharing (current, working)
const shares = sealService.shareSecret(secret, config);

// Use Seal SDK (when configured)
const shares = sealService.shareSecret(secret, config, true); // useSealSDK = true
```

## Migration Path

### Phase 1: Setup (Current)
- ✅ Install Seal SDK
- ✅ Add initialization methods
- ✅ Create adapter layer
- ⏳ Configure key servers
- ⏳ Deploy Move contracts

### Phase 2: Integration
- ⏳ Implement Seal SDK encryption
- ⏳ Implement Seal SDK decryption
- ⏳ Add transaction building
- ⏳ Test with testnet

### Phase 3: Production
- ⏳ Deploy to mainnet
- ⏳ Migrate existing shares
- ⏳ Enable Seal SDK by default

## Key Differences

| Feature | Shamir's (Current) | Seal SDK |
|---------|-------------------|----------|
| Cryptography | Polynomial-based | BLS12381 TSS |
| Access Control | None | On-chain Move |
| Key Management | Self-contained | Key servers |
| Offline Support | ✅ Yes | ❌ No |
| Production Ready | ✅ Yes | ✅ Yes |
| Complexity | Low | High |

## Next Steps

1. **Get Key Server Configs**
   - Contact Mysten Labs or check Seal docs
   - Use testnet for development

2. **Deploy Move Contract**
   - Create `seal_approve_zotp_recovery` function
   - Define access control logic
   - Deploy to Sui

3. **Implement Transaction Building**
   - Create helper to build `seal_approve*` transactions
   - Integrate with SuiService

4. **Test Integration**
   - Test encryption/decryption flow
   - Verify access control
   - Test recovery scenarios

## Resources

- **Seal Documentation**: https://seal-docs.wal.app
- **GitHub**: https://github.com/MystenLabs/seal
- **NPM Package**: `@mysten/seal`
- **Move Language**: https://docs.sui.io/build/move

## Current Implementation

The service currently:
- ✅ Uses Shamir's Secret Sharing (working)
- ✅ Has Seal SDK structure (ready for implementation)
- ✅ Maintains backward compatibility
- ⏳ Waiting for key server configs and Move contracts

## For Hackathon

For the Walrus Hackathon, you can:
1. **Demo Current Implementation**: Show working secret sharing/recovery
2. **Show Seal SDK Integration**: Demonstrate the structure and explain next steps
3. **Highlight Innovation**: Explain how Seal SDK will enhance security

The foundation is ready - you just need key server configs and Move contracts to complete the integration!

