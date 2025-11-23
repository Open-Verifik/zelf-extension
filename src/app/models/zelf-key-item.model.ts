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
export interface ZelfKeyWalrusMetadata {
    zelfProof: string;
    contentType: string;
    fileName: string;
    type: string;
    category: string;
    keyOwner: string;
    timestamp: string;
    username?: string;
    website?: string;
    uploadTimestamp: string;
    sizeBytes: number;
    network: string;
}

export interface ZelfKeyWalrusStorage {
    epochs: number;
    network: string;
    deletable: boolean;
}

export interface ZelfKeyWalrusBlobObject {
    id: {
        id: string;
    };
    registered_epoch: number;
    blob_id: string;
    size: string;
    encoding_type: number;
    certified_epoch: number;
    storage: {
        id: {
            id: string;
        };
        start_epoch: number;
        end_epoch: number;
        storage_size: string;
    };
    deletable: boolean;
}

export interface ZelfKeyWalrusUploadResult {
    blobId: string;
    blobObject: ZelfKeyWalrusBlobObject;
}

export interface ZelfKeyWalrusResponse {
    success: boolean;
    blobId?: string;
    publicUrl?: string;
    explorerUrl?: string;
    metadata?: ZelfKeyWalrusMetadata;
    storage?: ZelfKeyWalrusStorage;
    uploadResult?: ZelfKeyWalrusUploadResult;
    skipped?: boolean;
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
    ipfs_pin_hash?: string;
    ipfsHash?: string;
    cid?: string;
    size: number;
    user_id?: string;
    date_pinned: string;
    publicData: ZelfKeyIpfsPublicData;
    network?: string;
    pinned: boolean;
    saved: boolean;
    web3: boolean;
    name: string;
    created_at?: string;
    updated_at?: string;
    metadata?: ZelfKeyIpfsMetadata;
}

export interface ZelfKeyNFTAttribute {
    trait_type: string;
    value?: string;
}

export interface ZelfKeyNFTFile {
    type: string;
    uri: string;
}

export interface ZelfKeyNFTProperties {
    files: ZelfKeyNFTFile[];
    category: string;
}

export interface ZelfKeyNFTMetadata {
    name: string;
    description: string;
    external_url: string;
    image: string;
    attributes: ZelfKeyNFTAttribute[];
    properties: ZelfKeyNFTProperties;
}

export interface ZelfKeyNFTResponse {
    contractAddress: string;
    cost: string;
    explorerUrl: string;
    imageUrl: string;
    metadata: ZelfKeyNFTMetadata;
    metadataUrl: string;
    owner: string;
    recipient: string;
    success: boolean;
    tokenId: string;
    transactionHash: string;
}

export interface ZelfKeyPasswordResult {
    zelfProof: string | null;
    zelfProofQRCode: string;
    walrus: ZelfKeyWalrusResponse;
    ipfs: ZelfKeyIpfsResponse;
    NFT?: ZelfKeyNFTResponse | null;
    type: string;
    message: string;
}
