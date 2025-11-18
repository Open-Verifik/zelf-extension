# Complete Seal SDK Integration Example

This guide shows a complete example of using Seal SDK with ZOTP encryption/decryption.

## Prerequisites

1. ✅ Seal SDK installed (`@mysten/seal@0.9.3`)
2. ✅ Move contract deployed (see `SEAL_DEPLOYMENT_GUIDE.md`)
3. ✅ Package ID from deployment

## Step-by-Step Example

### 1. Initialize Seal SDK

```typescript
import { SealService } from 'app/services/seal.service';

const sealService = new SealService();

// Initialize with testnet key servers
await sealService.initializeSealSDKWithTestnet();

console.log("Seal SDK initialized:", sealService.isSealSDKAvailable());
```

### 2. Encrypt a ZOTP Secret

```typescript
// Your ZOTP data
const setupKey = "LEFP7DRRE2FRKSWKSJBJ7X6D4E";
const zotpId = "019a7b8c-564a-7ad2-81cc-b383450608b4";
const PACKAGE_ID = "0x..."; // Your deployed package ID

// Encrypt using Seal SDK
const { encryptedObject, sessionKey } = await sealService.encryptWithSealSDK(
    setupKey,
    {
        threshold: 2, // Minimum 2 key servers needed
        packageId: PACKAGE_ID,
        id: zotpId,
    }
);

console.log("Encrypted object length:", encryptedObject.length);
console.log("Session key length:", sessionKey.length);

// Store encryptedObject in Walrus or other storage
// Store sessionKey securely (this is your backup key)
```

### 3. Store Encrypted Data (Optional - Walrus)

```typescript
// Example: Store in Walrus
import { WalrusClient } from '@mysten/walrus';

const walrusClient = new WalrusClient({
    network: 'testnet',
    suiClient: suiClient,
});

const blobId = await walrusClient.writeBlob(encryptedObject);
console.log("Stored in Walrus:", blobId);
```

### 4. Decrypt ZOTP Secret

```typescript
// Retrieve encryptedObject from storage
const encryptedObject = ...; // From Walrus or storage
const sessionKey = ...; // From secure storage

// Decrypt using Seal SDK
// This will call the Move contract's seal_approve_zotp_recovery function
const decryptedSecret = await sealService.decryptWithSealSDK(
    encryptedObject,
    sessionKey,
    PACKAGE_ID,
    zotpId
);

console.log("Decrypted secret:", decryptedSecret);
console.log("Match:", decryptedSecret === setupKey); // Should be true
```

## Complete Integration Example

```typescript
import { SealService } from 'app/services/seal.service';
import { SessionKey } from '@mysten/seal';

const PACKAGE_ID = "0x..."; // Your deployed package ID

async function sealSDKExample() {
    const sealService = new SealService();
    
    try {
        // 1. Initialize
        console.log("Initializing Seal SDK...");
        await sealService.initializeSealSDKWithTestnet();
        
        if (!sealService.isSealSDKAvailable()) {
            throw new Error("Failed to initialize Seal SDK");
        }
        console.log("✅ Seal SDK initialized");
        
        // 2. Prepare data
        const setupKey = "LEFP7DRRE2FRKSWKSJBJ7X6D4E";
        const zotpId = "019a7b8c-564a-7ad2-81cc-b383450608b4";
        
        // 3. Encrypt
        console.log("Encrypting secret...");
        const { encryptedObject, sessionKey } = await sealService.encryptWithSealSDK(
            setupKey,
            {
                threshold: 2,
                packageId: PACKAGE_ID,
                id: zotpId,
            }
        );
        console.log("✅ Secret encrypted");
        console.log("   Encrypted size:", encryptedObject.length, "bytes");
        console.log("   Session key size:", sessionKey.length, "bytes");
        
        // 4. Store (optional)
        // await storeInWalrus(encryptedObject);
        // await storeSessionKey(sessionKey);
        
        // 5. Decrypt
        console.log("Decrypting secret...");
        const decrypted = await sealService.decryptWithSealSDK(
            encryptedObject,
            sessionKey as SessionKey,
            PACKAGE_ID,
            zotpId
        );
        console.log("✅ Secret decrypted");
        console.log("   Decrypted:", decrypted);
        console.log("   Match:", decrypted === setupKey);
        
        return {
            success: true,
            encrypted: encryptedObject,
            sessionKey: sessionKey,
            decrypted: decrypted,
        };
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

// Run example
sealSDKExample()
    .then(result => console.log("Success!", result))
    .catch(error => console.error("Failed:", error));
```

## Integration with ZOTP Service

Here's how to integrate Seal SDK into your existing ZOTP sharing flow:

```typescript
// In share-zotp.component.ts

async shareWithSealSDK() {
    try {
        // 1. Initialize Seal SDK if not already
        if (!this._sealService.isSealSDKAvailable()) {
            await this._sealService.initializeSealSDKWithTestnet();
        }
        
        // 2. Encrypt the setup key
        const { encryptedObject, sessionKey } = await this._sealService.encryptWithSealSDK(
            this.setupKey,
            {
                threshold: this.threshold,
                packageId: SEAL_PACKAGE_ID,
                id: this.zotp.id,
            }
        );
        
        // 3. Store encrypted object (e.g., in Walrus)
        const blobId = await this.storeInWalrus(encryptedObject);
        
        // 4. Generate shares from session key (backup)
        const shares = this._sealService.shareSecret(
            this.arrayBufferToBase64(sessionKey),
            {
                threshold: this.threshold,
                totalShares: this.totalShares,
            }
        );
        
        // 5. Return shares and blob ID
        return {
            shares: shares,
            blobId: blobId,
            packageId: SEAL_PACKAGE_ID,
            zotpId: this.zotp.id,
        };
    } catch (error) {
        console.error("Error sharing with Seal SDK:", error);
        throw error;
    }
}
```

## Recovery Flow

```typescript
// In recover-zotp.component.ts

async recoverWithSealSDK(blobId: string, sessionKeyShares: SecretShare[], packageId: string, zotpId: string) {
    try {
        // 1. Initialize Seal SDK
        if (!this._sealService.isSealSDKAvailable()) {
            await this._sealService.initializeSealSDKWithTestnet();
        }
        
        // 2. Reconstruct session key from shares
        const sessionKeyBase64 = await this._sealService.reconstructSecret(sessionKeyShares);
        const sessionKey = this.base64ToUint8Array(sessionKeyBase64);
        
        // 3. Retrieve encrypted object from Walrus
        const encryptedObject = await this.retrieveFromWalrus(blobId);
        
        // 4. Decrypt using Seal SDK
        const decryptedSecret = await this._sealService.decryptWithSealSDK(
            encryptedObject,
            sessionKey as SessionKey,
            packageId,
            zotpId
        );
        
        // 5. Create ZOTP from recovered secret
        await this.createZOTPFromRecoveredSecret(decryptedSecret);
        
        return decryptedSecret;
    } catch (error) {
        console.error("Error recovering with Seal SDK:", error);
        throw error;
    }
}
```

## Helper Functions

```typescript
// Utility functions for conversion

function arrayBufferToBase64(buffer: Uint8Array): string {
    const bytes = Array.from(buffer);
    const binary = bytes.map(byte => String.fromCharCode(byte)).join('');
    return btoa(binary);
}

function base64ToUint8Array(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}
```

## Error Handling

```typescript
try {
    await sealService.decryptWithSealSDK(...);
} catch (error) {
    if (error.message.includes("not initialized")) {
        // Initialize first
        await sealService.initializeSealSDKWithTestnet();
    } else if (error.message.includes("Package not found")) {
        // Check package ID
        console.error("Invalid package ID");
    } else if (error.message.includes("Key server")) {
        // Check key server connectivity
        console.error("Key server error");
    } else {
        console.error("Decryption failed:", error);
    }
}
```

## Next Steps

1. Deploy Move contract (see `SEAL_DEPLOYMENT_GUIDE.md`)
2. Update `PACKAGE_ID` constant
3. Test encryption/decryption flow
4. Integrate with Walrus storage
5. Add to ZOTP sharing/recovery UI

