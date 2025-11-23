export interface BrowserAPI {
    runtime?: {
        sendMessage: (message: any, callback?: (response: any) => void) => void | Promise<any>;
        onMessage: {
            addListener: (listener: (message: any, sender: any, sendResponse: any) => void) => void;
        };
        onInstalled: {
            addListener: (listener: () => void) => void;
        };
        onStartup: {
            addListener: (listener: () => void) => void;
        };
        onSuspend: {
            addListener: (listener: () => void) => void;
        };
        getURL: (path: string) => string;
        lastError?: { message: string };
    };
    storage?: {
        local: {
            get: (keys: string | string[]) => Promise<any>;
            set: (items: Record<string, any>) => Promise<void>;
            remove: (keys: string | string[]) => Promise<void>;
            clear: () => Promise<void>;
        };
        session: {
            get: (keys: string | string[]) => Promise<any>;
            set: (items: Record<string, any>) => Promise<void>;
            remove: (keys: string | string[]) => Promise<void>;
            clear: () => Promise<void>;
        };
    };
    tabs?: {
        create: (createProperties: { url: string }) => Promise<{ id?: number }>;
        query: (queryInfo: { url?: string }) => Promise<Array<{ id?: number; url?: string }>>;
        sendMessage: (tabId: number, message: any) => Promise<any>;
    };
    windows?: {
        getCurrent: () => Promise<{ id?: number }>;
        update: (windowId: number, updateInfo: { state?: string }) => Promise<void>;
    };
    sidePanel?: {
        setOptions: (options: { path: string; enabled: boolean }) => void;
        open: (options: { windowId: number }) => Promise<void>;
    };
    menus?: {
        onClicked: {
            addListener: (listener: () => void) => void;
        };
    };
}

export interface AutofillMessage {
    type: "DECRYPT_PASSWORD" | "CREATE_PASSWORD" | "AUTHENTICATE" | "OPEN_BIOMETRICS_MODAL";
    payload?: any;
    requestId?: string;
    timestamp?: number;
}

export interface AutofillResponse {
    success: boolean;
    data?: any;
    error?: string;
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
