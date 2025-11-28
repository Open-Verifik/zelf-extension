export type MessageType =
    | "AUTHENTICATE"
    | "AUTOFILL_CREATE_PASSWORD_DATA"
    | "CLOSE_POPUP"
    | "CREATE_PASSWORD"
    | "DECRYPT_PASSWORD"
    | "DECRYPTION_RESULT_FROM_POPOUT"
    | "DECRYPTION_RESULT"
    | "GET_PASSWORDS"
    | "OPEN_BIOMETRICS_MODAL"
    | "OPEN_PASSWORD_DECRYPTOR"
    | "PASSWORD_DECRYPTOR_DATA"
    | "POPUP_READY"
    | "RETRIEVAL_ERROR"
    | "SEND_DECRYPTION_DATA_TO_POPOUT"
    | "SERVICE_WORKER_READY"
    | "STORAGE_ERROR"
    | "SYNC_PASSWORDS"
    | "TEST_MESSAGE"
    | "FILL_PASSWORD_FORM";

export interface AutofillMessage {
    type: MessageType;
    payload?: any;
    requestId?: string;
    timestamp?: number;
}

export interface AutofillResponse {
    success: boolean;
    data?: any;
    error?: string;
    message?: string;
}

export interface PasswordEntry {
    id: string;
    cid: string;
    url: string;
    website?: string;
    username?: string;
    zelfProof?: string;
    zelfProofQRCode?: string;
    createdAt: string;
    publicData: {
        category: string;
        folder?: string;
        keyOwner: string;
        timestamp: string;
        type: string;
        username?: string;
        website?: string;
    };
}

export interface DecryptedPasswordData {
    identifier: string;
    metadata: {
        password: string;
        username: string;
    };
    publicData: {
        category: string;
        zelfName: string;
        username: string;
        timestamp: string;
        type: string;
        website: string;
    };
    faceCropBase64: string;
    difficulty: string;
}

export interface MessageSender {
    tab?: {
        id?: number;
        url?: string;
    };
    frameId?: number;
}

export interface SendResponse {
    (response: AutofillResponse): void;
}

export interface AutofillRequest {
    type: MessageType;
    payload?: any;
    requestId: string;
    timestamp: number;
}

export interface UrlInfo {
    hash: string;
    hostname: string;
    href: string;
    origin: string;
    pathname: string;
    port: string;
    protocol: string;
    search: string;
    title: string;
}

export interface FormField {
    element: HTMLInputElement;
    type: "username" | "email" | "password";
    name?: string;
    id?: string;
    placeholder?: string;
}

export interface DetectedForm {
    fields: FormField[];
    form: HTMLFormElement;
    website: string;
}

export interface AutofillResponse {
    success: boolean;
    data?: any;
    error?: string;
}

export interface DecryptedPasswordData {
    username: string;
    password: string;
    website?: string;
    name?: string;
}

export interface ZelfKeyIcon {
    element: HTMLElement;
    field: FormField;
    position: { top: number; left: number };
}

export interface DecryptionRequest {
    requestId: string;
    type?: "password" | "notes" | "credit_card" | "zotp";
    publicData: {
        zelfProof: string;
        title: string;
        website: string;
    };
    fieldId?: string;
    fieldType?: "username" | "email" | "password";
}

export interface DecryptionResult {
    success: boolean;
    data?: DecryptedPasswordData;
    error?: string;
}

export interface TabInfo {
    id: number;
    url: string;
    active?: boolean;
}

export interface MessagePayload {
    website?: string;
    urlInfo?: UrlInfo;
    requestId?: string;
    type?: "password" | "notes" | "credit_card" | "zotp";
    publicData?: any;
    fieldId?: string;
    fieldType?: string;
    result?: DecryptionResult;
    tabId?: number;
    fillData?: {
        username: string;
        password: string;
    };
}
