export interface ZelfKeyItem {
    id: string;
    name: string;
    url: string;
    size: number;
    timestamp: string;
    publicData: ZelfKeyPublicData;
}

export interface ZelfKeyPublicData {
    typ?: string;
    folder?: string;
    category?: string;
    zelfName?: string;
    timestamp?: string;
    zelfProof?: string;
}

export interface NotePublicData extends ZelfKeyPublicData {
    type: "notes";
    title: string;
}

export interface PasswordPublicData extends ZelfKeyPublicData {
    type: "website_password";
    website: string;
    username: string;
}

export interface PaymentCardPublicData extends ZelfKeyPublicData {
    type: "credit_card";
    card: string;
}

// Raw decrypted data structure from biometrics
export interface DecryptedItemData {
    identifier: string;
    metadata: any; // The actual decrypted content
    publicData: ZelfKeyPublicData;
    faceCropBase64?: string;
    difficulty?: string;
}

// Processed decrypted data for UI display
export interface DecryptedNoteData {
    title: string;
    content: string;
    folder: string;
}

export interface DecryptedPasswordData {
    username: string;
    password: string;
    website?: string;
    category?: string;
    difficulty?: string;
    timestamp?: string;
    type?: string;
    zelfName?: string;
}

export interface DecryptedPaymentCardData {
    name: string;
    number: string;
    expires: string;
    bankName: string;
    cvv: string;
}

export interface NoteItem extends ZelfKeyItem {
    publicData: NotePublicData;
}

export interface PasswordItem extends ZelfKeyItem {
    publicData: PasswordPublicData;
}

export interface PaymentCardItem extends ZelfKeyItem {
    publicData: PaymentCardPublicData;
}

export type ZelfKeyItemType = NoteItem | PasswordItem | PaymentCardItem;

export type ZelfKeyPublicDataType = NotePublicData | PasswordPublicData | PaymentCardPublicData;

export type DecryptedDataType = DecryptedNoteData | DecryptedPasswordData | DecryptedPaymentCardData;

// ZelfKeys API Response Types
export interface ZelfKeyWalrusResponse {
    success: boolean;
    skipped: boolean;
    reason?: string;
    error?: string;
}

export interface ZelfKeyIpfsPublicData {
    type: string;
    website?: string;
    username?: string;
    timestamp?: string;
    keyOwner?: string;
    category?: string;
    title?: string;
    [key: string]: any; // Allow additional properties
}

export interface ZelfKeyIpfsMetadata {
    type: string;
    website?: string;
    username?: string;
    timestamp?: string;
    keyOwner?: string;
    category?: string;
    [key: string]: any; // Allow additional properties
}

export interface ZelfKeyIpfsResponse {
    id: string;
    url: string;
    size: number;
    date_pinned: string;
    publicData: ZelfKeyIpfsPublicData;
    pinned: boolean;
    saved: boolean;
    web3: boolean;
    name: string;
    metadata: ZelfKeyIpfsMetadata;
}

export interface ZelfKeyPasswordResult {
    zelfProof: string | null;
    zelfProofQRCode: string;
    walrus: ZelfKeyWalrusResponse;
    ipfs: ZelfKeyIpfsResponse;
    type: string;
    message: string;
}
