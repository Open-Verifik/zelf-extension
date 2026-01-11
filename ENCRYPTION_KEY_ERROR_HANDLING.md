# Encryption Key Mismatch Error Handling

## Overview

This document describes the automatic error recovery mechanism for encryption key mismatches between the client (wallet extension) and server.

## Problem

When a user's PGP encryption key on the server doesn't match the public key stored in the wallet extension, decryption fails. This can happen when:

- The server's PGP key is regenerated
- The user switches devices/browsers
- The session expires and a new key is generated
- There's a sync issue between session and public key

## Solution

We've implemented an automatic recovery mechanism that:

1. Detects encryption key mismatch errors (HTTP 412)
2. Automatically refreshes the public key from the server
3. Retries the failed request with the new key
4. All happens transparently to the user

## Implementation

### Backend (Server)

**File**: `/Users/miguel/zelf/Repositories/Session/modules/session.module.js`

When decryption fails in `sessionDecrypt()`, the server now throws a proper HTTP 412 error:

```javascript
const sessionDecrypt = async (content, authUser) => {
    if (!content) return null;

    let privateKey = null;
    try {
        privateKey = await _getPrivateKey(authUser);
        const decryptedContent = await PGPKeyModule.decryptContent("session", privateKey, content);
        return decryptedContent;
    } catch (exception) {
        console.error("Error during decryption:", { exception, authUser });

        const error = new Error("encryption_key_didnt_match");
        error.status = 412; // Precondition Failed
        throw error;
    }
};
```

**HTTP Status Code**: `412 Precondition Failed`

- **Why 412?** It indicates "the server does not meet one of the preconditions that the requester put on the request"
- In this case, the precondition is that the encryption key must match
- This is semantically correct and distinguishes it from other errors

### Frontend (Wallet Extension)

**File**: `/Users/miguel/verifik/verifik-wallet-extension/src/app/interceptors/encryption-key.interceptor.ts`

A new HTTP interceptor catches 412 errors and handles them automatically:

```typescript
@Injectable()
export class EncryptionKeyInterceptor implements HttpInterceptor {
    private _isRefreshing = false;
    private _refreshPromise: Promise<void> | null = null;

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return from(this.handle(req, next));
    }

    async handle(req: HttpRequest<any>, next: HttpHandler) {
        try {
            return await lastValueFrom(
                next.handle(req).pipe(
                    catchError((error: HttpErrorResponse) => {
                        if (this._isEncryptionKeyError(error)) {
                            return from(this._handleEncryptionKeyError(req, next));
                        }
                        return throwError(() => error);
                    })
                )
            );
        } catch (error) {
            throw error;
        }
    }

    private _isEncryptionKeyError(error: HttpErrorResponse): boolean {
        if (error.status !== 412) return false;
        const errorMessage = error.error?.message || error.message || "";
        return errorMessage.includes("encryption_key_didnt_match");
    }

    private async _handleEncryptionKeyError(req: HttpRequest<any>, next: HttpHandler): Promise<any> {
        // Prevent multiple simultaneous refresh attempts
        if (this._isRefreshing && this._refreshPromise) {
            await this._refreshPromise;
            return lastValueFrom(next.handle(req));
        }

        this._isRefreshing = true;
        this._refreshPromise = this._refreshPublicKey();

        try {
            await this._refreshPromise;
            console.log("Public key refreshed successfully, retrying request");

            // Retry the original request with the new public key
            return await lastValueFrom(next.handle(req));
        } catch (refreshError) {
            console.error("Failed to refresh public key:", refreshError);
            throw refreshError;
        } finally {
            this._isRefreshing = false;
            this._refreshPromise = null;
        }
    }

    private async _refreshPublicKey(): Promise<void> {
        // Get wallet data for unique fingerprint
        const currentWallet = await this._walletService.getCurrentWallet();
        const walletAddress = currentWallet?.publicData?.ethAddress || null;
        const tagName = currentWallet?.tagName || currentWallet?.name || null;
        const domain = currentWallet?.publicData?.domain || "zelf";

        // Generate the same unique identifier used for session
        const { hash } = generateUserFingerprint(walletAddress, tagName, domain);

        // Fetch new public key from server
        const url = `${environment.apiUrl}/api/sessions/yek-cilbup`;
        const response = await this._httpWrapperService.sendRequest("get", url, {
            identifier: hash,
        });

        const publicKey = response.data;

        // Update the stored public key
        await this._chromeService.setItem("publicKey", publicKey);
        this._httpWrapperService.setPublicKey(publicKey);

        console.log("Public key refreshed and stored successfully");
    }
}
```

**Registered in**: `/Users/miguel/verifik/verifik-wallet-extension/src/app/interceptors/index.ts`

```typescript
export const HttpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: EncryptionKeyInterceptor, multi: true },
];
```

## Flow Diagram

```
User Action (e.g., Create Wallet)
    ↓
Extension encrypts data with stored public key
    ↓
Sends encrypted data to server
    ↓
Server tries to decrypt with its private key
    ↓
Decryption fails (keys don't match)
    ↓
Server throws HTTP 412 "encryption_key_didnt_match"
    ↓
EncryptionKeyInterceptor catches the error
    ↓
Interceptor fetches new public key from server
    ↓
Interceptor updates stored public key
    ↓
Interceptor retries the original request
    ↓
Server decrypts successfully with matching keys
    ↓
User action completes successfully ✅
```

## Key Features

### 1. **Automatic Recovery**

- No user intervention required
- Transparent error handling
- Request is automatically retried

### 2. **Prevents Race Conditions**

- Uses `_isRefreshing` flag to prevent multiple simultaneous refreshes
- Subsequent requests wait for the first refresh to complete
- All waiting requests use the newly refreshed key

### 3. **Consistent Identifier**

- Uses the same `generateUserFingerprint()` function as session initialization
- Ensures the public key matches the session identifier
- Includes wallet-specific data (ethAddress, tagName, domain)

### 4. **Proper Error Handling**

- If refresh fails, the error is propagated to the user
- Logs are added for debugging
- Finally block ensures cleanup of refresh state

## Benefits

1. **Better UX**: Users don't see cryptic decryption errors
2. **Automatic Sync**: Keys are automatically synchronized when mismatched
3. **Resilient**: Handles edge cases like server key regeneration
4. **Transparent**: Works behind the scenes without user awareness
5. **Efficient**: Only refreshes when necessary (on 412 errors)

## Testing Scenarios

To test this functionality:

1. **Simulate Key Mismatch**:

    - Clear the public key from extension storage
    - Try to create a wallet
    - Should automatically fetch new key and succeed

2. **Server Key Regeneration**:

    - Delete PGP keys from server database
    - Try to decrypt data
    - Should get new key and retry

3. **Multiple Simultaneous Requests**:
    - Trigger multiple requests that would fail with 412
    - Only one refresh should occur
    - All requests should succeed after refresh

## Related Files

### Backend

- `/Users/miguel/zelf/Repositories/Session/modules/session.module.js` - Error throwing
- `/Users/miguel/zelf/Repositories/Session/controllers/session.controller.js` - Error handling

### Frontend

- `/Users/miguel/verifik/verifik-wallet-extension/src/app/interceptors/encryption-key.interceptor.ts` - New interceptor
- `/Users/miguel/verifik/verifik-wallet-extension/src/app/interceptors/index.ts` - Interceptor registration
- `/Users/miguel/verifik/verifik-wallet-extension/src/app/core/providers/session-initializer.provider.ts` - Initial key fetch
- `/Users/miguel/verifik/verifik-wallet-extension/src/app/core/utils/fingerprint.util.ts` - Fingerprint generation

## Monitoring

Look for these log messages:

### Success:

```
Public key refreshed successfully, retrying request
Public key refreshed and stored successfully
```

### Failure:

```
Failed to refresh public key: [error details]
Error refreshing public key: [error details]
```

## Future Enhancements

1. **Retry Limit**: Add maximum retry attempts to prevent infinite loops
2. **Exponential Backoff**: Add delays between retries
3. **Analytics**: Track how often this occurs to identify systemic issues
4. **User Notification**: Optionally notify users when keys are refreshed
5. **Key Versioning**: Add version numbers to track key changes
