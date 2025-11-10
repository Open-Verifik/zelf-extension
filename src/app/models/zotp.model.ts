export interface ZOTP {
    id: string;
    name: string;
    secret: string; // Encrypted secret key (stored in ZelfKeys)
    issuer?: string;
    algorithm?: string; // Default: SHA1
    digits?: number; // Default: 6
    period?: number; // Default: 30 seconds
    createdAt: number;
    updatedAt: number;
    isDecrypted?: boolean; // Whether the code is currently visible
    decryptedSecret?: string; // Temporarily decrypted secret (not stored)
    zelfProof?: string; // Wallet zelfProof - identifies which wallet owns this ZOTP
    zelfKeysId?: string; // ID returned from ZelfKeys API for retrieval
    zelfProofQRCode?: string; // QR code image from backend response (data:image/png;base64,...)
    ipfs?: any; // Full IPFS data from backend response
}
