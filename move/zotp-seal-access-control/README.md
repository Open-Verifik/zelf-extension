# ZOTP Seal Access Control Move Package

This Move package defines access control policies for ZOTP (Zelf One-Time Password) recovery using Seal SDK.

## Overview

The package provides `seal_approve*` functions that Seal SDK calls to verify if a user can decrypt encrypted ZOTP secrets. These functions implement the access control logic on-chain.

## Functions

### `seal_approve_zotp_recovery`
Approves access for ZOTP recovery/decryption.

**Parameters:**
- `id: vector<u8>` - The ZOTP identifier (identity in Seal)

**Current Implementation:**
- Open mode (allows anyone to decrypt) - suitable for testnet
- Can be extended with ownership checks, time-based conditions, etc.

### `seal_approve_zotp_share`
Approves access for ZOTP sharing with other users.

**Parameters:**
- `id: vector<u8>` - The ZOTP identifier
- `recipient: vector<u8>` - The recipient identifier

## Deployment

### Prerequisites
- Sui CLI installed
- Sui testnet account with SUI tokens

### Steps

1. **Build the package:**
```bash
cd move/zotp-seal-access-control
sui move build
```

2. **Publish to testnet:**
```bash
sui client publish --gas-budget 10000000
```

3. **Get the Package ID:**
After publishing, you'll get a package ID. Save this for use in the TypeScript code:
```typescript
const PACKAGE_ID = "0x..."; // Your package ID here
```

4. **Update Seal Service:**
Update the `packageId` in `seal.service.ts` when calling `encryptWithSealSDK()` and `decryptWithSealSDK()`.

## Access Control Customization

To add custom access control logic, modify the `seal_approve_zotp_recovery` function:

```move
public fun seal_approve_zotp_recovery(id: vector<u8>, ctx: &mut TxContext) {
    // Example: Check ownership
    let zotp_owner = get_zotp_owner(id);
    assert!(zotp_owner == tx_context::sender(ctx), 1);
    
    // Example: Check time window
    let current_time = timestamp::now_seconds();
    let recovery_window = get_recovery_window(id);
    assert!(current_time <= recovery_window, 2);
}
```

## Testing

Test the contract locally:
```bash
sui move test
```

## Resources

- [Seal Documentation](https://seal-docs.wal.app)
- [Sui Move Documentation](https://docs.sui.io/build/move)
- [Move Language Book](https://move-language.github.io/move/)

