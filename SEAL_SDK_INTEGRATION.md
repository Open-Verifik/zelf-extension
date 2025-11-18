# Seal SDK Integration Plan

## Overview

Integrating the official Seal SDK (`@mystenlabs/seal-sdk`) to replace our custom Shamir's Secret Sharing implementation with production-grade threshold encryption and access control.

## Current Implementation

- ✅ Custom Shamir's Secret Sharing (working)
- ✅ Threshold secret distribution
- ✅ Secret reconstruction
- ✅ Basic zero-knowledge proof structure

## Seal SDK Features

- **Threshold Encryption**: Production-grade threshold encryption
- **Access Control Policies**: On-chain Move contracts for access control
- **Identity-Based Encryption**: Decentralized key management
- **Walrus Integration**: Native integration with Walrus storage
- **Zero-Knowledge Proofs**: True ZK proofs (not just commitments)

## Integration Strategy

### Phase 1: Install & Setup
1. Install `@mystenlabs/seal-sdk`
2. Initialize Seal client with Sui client
3. Create adapter layer for backward compatibility

### Phase 2: Hybrid Approach
- Keep custom implementation as fallback
- Use Seal SDK for new shares
- Support both formats for recovery

### Phase 3: Full Migration
- Migrate all operations to Seal SDK
- Remove custom implementation
- Add Move contract for access control

## Implementation Steps

### Step 1: Install Dependencies

```bash
npm install @mystenlabs/seal-sdk
```

### Step 2: Update Seal Service

Create adapter that:
- Uses Seal SDK for new operations
- Falls back to custom implementation for old shares
- Provides unified interface

### Step 3: Move Contract (Optional)

For advanced access control:
- Deploy Move package with `seal_approve*` functions
- Define access policies
- Enable on-chain verification

## API Comparison

### Current (Custom)
```typescript
shareSecret(secret: string, config: ShareConfig): SecretShare[]
reconstructSecret(shares: SecretShare[]): string
```

### Seal SDK (Expected)
```typescript
encrypt(data: string, options: EncryptOptions): EncryptedData
decrypt(encryptedData: EncryptedData, options: DecryptOptions): string
```

## Migration Path

1. **Backward Compatible**: Support both formats
2. **Gradual Migration**: New shares use Seal SDK
3. **Full Migration**: All operations use Seal SDK

