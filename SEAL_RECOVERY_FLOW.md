# Seal Recovery Flow - Complete Implementation

## Overview

The Seal recovery flow allows users to recover ZOTP secrets by importing shares that were previously distributed using Seal secret sharing. This completes the full cycle: **Share → Distribute → Recover**.

---

## Complete Flow

### 1. **Share Generation** (Export → Share)
```
User exports ZOTP → Clicks "Share with Seal" → 
Configures threshold (e.g., 3 of 5) → 
Generates shares → Downloads shares file
```

**Location:** `src/app/zelf-authenticator/share-zotp/`

**Features:**
- Configurable threshold and total shares
- Optional participant assignment
- Share export/download as JSON
- Individual share copy functionality

### 2. **Share Distribution**
Users distribute shares to trusted parties:
- Family members
- Team members
- Backup locations
- Secure storage

### 3. **Recovery** (Import → Reconstruct)
```
User clicks "Recover ZOTP" → 
Imports shares (file upload or manual) → 
Verifies threshold met → 
Reconstructs secret → 
Creates ZOTP from recovered secret
```

**Location:** `src/app/zelf-authenticator/recover-zotp/`

**Features:**
- File upload (JSON shares file)
- Manual share entry
- Share validation
- Threshold checking
- Secret reconstruction
- ZOTP creation

---

## Technical Implementation

### Share File Format

```json
{
  "zotpId": "zotp_123",
  "zotpName": "My Account",
  "issuer": "Example Service",
  "threshold": 3,
  "totalShares": 5,
  "shares": [
    {
      "shareId": "share_123_1",
      "shareData": "eyJ4IjoxLCJ5IjoiMTIzNDU2Nzg5MC4uLiJ9",
      "partyIndex": 1,
      "threshold": 3,
      "totalShares": 5,
      "participant": "wallet1",
      "createdAt": 1234567890
    },
    // ... more shares
  ],
  "metadata": {
    "zotpId": "zotp_123",
    "name": "My Account",
    "issuer": "Example Service",
    "algorithm": "SHA1",
    "digits": 6,
    "period": 30
  },
  "createdAt": 1234567890
}
```

### Recovery Process

1. **Import Shares**
   - File upload: Parse JSON shares file
   - Manual entry: Paste base64-encoded share data
   - Extract metadata if available

2. **Validate Shares**
   - Check threshold requirements
   - Verify share format
   - Count available shares

3. **Reconstruct Secret**
   - Use Seal service to reconstruct
   - Verify secret by generating TOTP code
   - Display recovered setup key

4. **Create ZOTP**
   - Extract metadata from shares
   - Create ZOTP object
   - Save to local cache
   - Refresh ZOTP list

---

## User Interface

### Share Generation UI
- Threshold configuration (2-10)
- Total shares configuration (2-10)
- Optional participant fields
- Share list with copy buttons
- Download all shares button

### Recovery UI
- File upload area
- Manual share entry
- Imported shares list
- Threshold status indicator
- Reconstruct button
- Success confirmation

---

## Security Features

### Share Security
- ✅ Individual shares reveal no information about secret
- ✅ Need exact threshold (not less, not more)
- ✅ Shares can be stored separately
- ✅ No single point of failure

### Recovery Security
- ✅ Validates share format before reconstruction
- ✅ Verifies threshold requirements
- ✅ Tests reconstructed secret before creating ZOTP
- ✅ Stores recovered ZOTP locally (needs re-encryption for Walrus)

---

## Usage Examples

### Example 1: Family Recovery
```
1. User shares ZOTP with family (3 of 5 shares)
2. Distributes shares to:
   - Spouse (share 1)
   - Parent (share 2)
   - Sibling (share 3)
   - Friend (share 4)
   - Safe deposit box (share 5)
3. If user loses access:
   - Collect shares from any 3 parties
   - Import shares
   - Recover ZOTP
```

### Example 2: Team Account
```
1. Admin shares team ZOTP (2 of 3 shares)
2. Distributes to:
   - Admin (share 1)
   - Manager (share 2)
   - Backup location (share 3)
3. Either admin or manager can recover
```

### Example 3: Backup Redundancy
```
1. User creates 3 of 5 shares
2. Stores in:
   - Cloud storage (share 1)
   - USB drive (share 2)
   - Paper backup (share 3)
   - Bank safe (share 4)
   - Home safe (share 5)
3. Any 3 locations can recover
```

---

## Integration Points

### With Seal Service
- Uses `SealService.shareSecret()` for generation
- Uses `SealService.reconstructSecret()` for recovery
- Handles threshold validation

### With ZOTP Service
- Uses `ZOTPService.saveZOTP()` to store recovered ZOTP
- Uses `ZOTPService.loadZOTPsFromBackend()` to refresh list
- Extracts metadata from shares

### With Export Flow
- Accessible from export dialog
- "Share with Seal" button
- Seamless transition from export to sharing

---

## Testing the Flow

### Test Share Generation:
1. Export a ZOTP
2. Click "Share with Seal"
3. Configure 3 of 5 shares
4. Generate shares
5. Download shares file

### Test Recovery:
1. Click "Recover ZOTP" button
2. Upload shares file (or enter manually)
3. Verify threshold met
4. Click "Reconstruct Secret"
5. Verify secret reconstructed
6. Click "Create ZOTP from Recovery"
7. Verify ZOTP appears in list

### Test Edge Cases:
- ✅ Not enough shares (should show error)
- ✅ Invalid share format (should show error)
- ✅ Duplicate shares (should be detected)
- ✅ Missing metadata (should use defaults)

---

## Future Enhancements

### Phase 1: Walrus Storage
- Store shares in Walrus for decentralized backup
- Enable share recovery from Walrus
- Immutable audit trail

### Phase 2: Share Management
- Share expiration dates
- Share revocation
- Share rotation

### Phase 3: Advanced Recovery
- Multi-party recovery UI
- Recovery approval workflow
- Time-locked recovery

### Phase 4: Integration
- Direct share distribution via wallet addresses
- On-chain share storage
- Smart contract recovery

---

## Files Created/Modified

### New Files:
- `src/app/zelf-authenticator/recover-zotp/recover-zotp.component.ts`
- `src/app/zelf-authenticator/recover-zotp/recover-zotp.component.html`
- `src/app/zelf-authenticator/recover-zotp/recover-zotp.component.scss`

### Modified Files:
- `src/app/zelf-authenticator/zelf-authenticator.component.ts` - Added recover button
- `src/app/zelf-authenticator/zelf-authenticator.component.html` - Added recover button
- `src/app/zelf-authenticator/share-zotp/share-zotp.component.ts` - Added metadata to export
- `src/assets/i18n/en.json` - Added recovery translations

---

## Status

✅ **Complete** - Full recovery flow implemented and working!

**Features:**
- ✅ Share generation
- ✅ Share export/download
- ✅ Share import (file + manual)
- ✅ Secret reconstruction
- ✅ ZOTP recovery
- ✅ UI/UX complete
- ✅ Error handling
- ✅ Translation support

**Ready for:**
- Testing
- Demo
- Hackathon submission

---

**Last Updated:** 2024  
**Version:** 1.0

