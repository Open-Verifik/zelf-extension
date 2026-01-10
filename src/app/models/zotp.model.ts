export interface ZOTP {
    id: string;
    name: string;
    secret?: string; // DO NOT STORE - Only kept in memory when decrypted. Use zelfProof to retrieve from backend.
    issuer?: string;
    algorithm?: string; // Default: SHA1
    digits?: number; // Default: 6
    period?: number; // Default: 30 seconds
    createdAt: number;
    updatedAt: number;
    isDecrypted?: boolean; // Whether the code is currently visible
    decryptedSecret?: string; // Temporarily decrypted secret (only in memory, never persisted)
    zelfProof?: string; // Wallet zelfProof - identifies which wallet owns this ZOTP (required for retrieval)
    zelfKeysId?: string; // ID returned from ZelfKeys API for retrieval
    zelfProofQRCode?: string; // QR code image from backend response (data:image/png;base64,...)
    ipfs?: any; // Full IPFS data from backend response
    walrus?: any; // Full Walrus storage data from backend response
}
