export interface AutofillUrlInfo {
    hostname: string;
    protocol: string;
    port: string;
    pathname: string;
    search: string;
    hash: string;
    origin: string;
    href: string;
}

export interface AutofillDataMessage {
    type: "AUTOFILL_CREATE_PASSWORD_DATA";
    payload: {
        urlInfo: AutofillUrlInfo;
    };
}

export class AutofillDataService {
    private static instance: AutofillDataService;

    private urlInfo: AutofillUrlInfo | null = null;
    private listeners: ((urlInfo: AutofillUrlInfo | null) => void)[] = [];

    private constructor() {
        this.setupMessageListener();
    }

    public static getInstance(): AutofillDataService {
        if (!AutofillDataService.instance) {
            AutofillDataService.instance = new AutofillDataService();
        }

        return AutofillDataService.instance;
    }

    private setupMessageListener() {
        if (typeof window === "undefined") return;

        const messageListener = (event: MessageEvent) => {
            if (event.source !== window) return;

            if (event.data && event.data.type === "AUTOFILL_CREATE_PASSWORD_DATA") {
                this.setUrlInfo(event.data.payload.urlInfo);
            }
        };

        window.addEventListener("message", messageListener);
    }

    public setUrlInfo(urlInfo: AutofillUrlInfo | null) {
        this.urlInfo = urlInfo;

        this.notifyListeners();
    }

    public getUrlInfo(): AutofillUrlInfo | null {
        return this.urlInfo;
    }

    public clearUrlInfo() {
        this.urlInfo = null;

        this.notifyListeners();
    }

    public subscribe(callback: (urlInfo: AutofillUrlInfo | null) => void): () => void {
        this.listeners.push(callback);

        // Return unsubscribe function
        return () => {
            const index = this.listeners.indexOf(callback);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }

    private notifyListeners() {
        this.listeners.forEach((listener) => listener(this.urlInfo));
    }

    public generateTitleFromUrl(urlInfo: AutofillUrlInfo): string {
        // Generate a friendly title from the URL
        const hostname = urlInfo.hostname;
        const pathname = urlInfo.pathname;

        // Remove 'www.' prefix if present
        const cleanHostname = hostname.replace(/^www\./, "");

        // Capitalize first letter
        const capitalizedHostname = cleanHostname.charAt(0).toUpperCase() + cleanHostname.slice(1);

        // Add path if it's not just '/'
        if (pathname && pathname !== "/") {
            const pathParts = pathname.split("/").filter((part) => part.length > 0);
            if (pathParts.length > 0) {
                return `${capitalizedHostname} - ${pathParts[0]}`;
            }
        }

        return capitalizedHostname;
    }
}
