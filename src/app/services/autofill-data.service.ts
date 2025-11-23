import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

export interface AutofillUrlInfo {
    hostname: string;
    protocol: string;
    port: string;
    pathname: string;
    search: string;
    hash: string;
    origin: string;
    href: string;
    title: string;
}

@Injectable({
    providedIn: "root",
})
export class AutofillDataService {
    private urlInfoSubject = new BehaviorSubject<AutofillUrlInfo | null>(null);

    constructor() {}

    public setUrlInfo(urlInfo: AutofillUrlInfo | null) {
        this.urlInfoSubject.next(urlInfo);
    }

    get urlInfo$(): Observable<AutofillUrlInfo | null> {
        return this.urlInfoSubject.asObservable();
    }

    public getUrlInfo(): AutofillUrlInfo | null {
        return this.urlInfoSubject.value;
    }

    public clearUrlInfo() {
        this.urlInfoSubject.next(null);
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
