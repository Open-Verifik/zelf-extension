# Seal SDK Deployment Guide

Complete guide for deploying the Move contract and using Seal SDK with ZOTP.

## Step 1: Deploy Move Contract

### Prerequisites
1. Install Sui CLI:
```bash
curl -fsSL https://get.sui.io | sh
```

2. Set up Sui testnet account:
```bash
sui client new-address ed25519
sui client faucet
```

### Deploy Steps

1. **Navigate to Move package:**
```bash
cd move/zotp-seal-access-control
```

2. **Build the package:**
```bash
sui move build
```

3. **Publish to testnet:**
```bash
sui client publish --gas-budget 10000000
```

4. **Save the Package ID:**
After publishing, you'll see output like:
```
Published Objects:
  ┌──
  │ PackageID: 0x1234567890abcdef...
  └──
```

Copy the `PackageID` - you'll need it in the next step.

## Step 2: Configure Package ID in Code

Update the Seal service or create a configuration file:

```typescript
// In seal.service.ts or a config file
export const SEAL_PACKAGE_ID = "0x..."; // Your package ID from step 1
```

## Step 3: Initialize Seal SDK

```typescript
import { SealService } from 'app/services/seal.service';

const sealService = new SealService();

// Initialize with testnet
await sealService.initializeSealSDKWithTestnet();
```

## Step 4: Encrypt ZOTP Secret

```typescript
const setupKey = "LEFP7DRRE2FRKSWKSJBJ7X6D4E"; // Your ZOTP setup key
const zotpId = "019a7b8c-564a-7ad2-81cc-b383450608b4"; // Your ZOTP ID

const { encryptedObject, sessionKey } = await sealService.encryptWithSealSDK(
    setupKey,
    {
        threshold: 2, // Minimum shares needed
        packageId: SEAL_PACKAGE_ID, // From step 2
        id: zotpId, // ZOTP identifier
    }
);

// Store encryptedObject in Walrus or other storage
// Store sessionKey securely (backup key)
```

## Step 5: Decrypt ZOTP Secret

```typescript
// Retrieve encryptedObject from storage
const encryptedObject = ...; // From Walrus or storage
const sessionKey = ...; // From secure storage

// Decrypt using Seal SDK
const decryptedSecret = await sealService.decryptWithSealSDK(
    encryptedObject,
    sessionKey,
    SEAL_PACKAGE_ID,
    zotpId
);

console.log("Decrypted:", decryptedSecret);
```

## Complete Example

```typescript
import { SealService } from 'app/services/seal.service';

const SEAL_PACKAGE_ID = "0x..."; // Your deployed package ID

async function example() {
    const sealService = new SealService();
    
    // 1. Initialize
    await sealService.initializeSealSDKWithTestnet();
    
    // 2. Encrypt
    const secret = "LEFP7DRRE2FRKSWKSJBJ7X6D4E";
    const zotpId = "019a7b8c-564a-7ad2-81cc-b383450608b4";
    
    const { encryptedObject, sessionKey } = await sealService.encryptWithSealSDK(
        secret,
        {
            threshold: 2,
            packageId: SEAL_PACKAGE_ID,
            id: zotpId,
        }
    );
    
    // 3. Store encryptedObject and sessionKey
    
    // 4. Later, decrypt
    const decrypted = await sealService.decryptWithSealSDK(
        encryptedObject,
        sessionKey,
        SEAL_PACKAGE_ID,
        zotpId
    );
    
    console.log("Success:", decrypted === secret); // Should be true
}
```

## Troubleshooting

### Error: "Seal SDK is not initialized"
- Make sure you called `initializeSealSDKWithTestnet()` first

### Error: "Package not found"
- Verify the package ID is correct
- Make sure the package is deployed to the same network (testnet/mainnet)

### Error: "Transaction failed"
- Check that the Move contract is deployed correctly
- Verify the function name matches: `seal_approve_zotp_recovery`
- Check Sui network connectivity

### Error: "Key server error"
- Verify key server configs are correct
- Check network connectivity to key servers
- Ensure you're using testnet key servers for testnet

## Next Steps

1. **Customize Access Control:**
   - Modify `access_control.move` to add ownership checks
   - Add time-based conditions
   - Implement multi-signature requirements

2. **Store in Walrus:**
   - Upload `encryptedObject` to Walrus
   - Store the blob ID for later retrieval

3. **Production Deployment:**
   - Deploy to mainnet
   - Configure mainnet key servers
   - Update package ID in production config

## Resources

- [Seal Documentation](https://seal-docs.wal.app)
- [Sui Move Documentation](https://docs.sui.io/build/move)
- [Sui CLI Guide](https://docs.sui.io/build/cli)

