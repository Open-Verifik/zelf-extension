import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

export interface PopoutDecryptionData {
    type?: "password" | "notes" | "credit_card" | "zotp" | "wallet";
    requestId: string;
    zelfProof?: string;
    publicData: {
        zelfProof?: string;
        title: string;
        website: string;
    };
    masterPassword?: string;
    fieldId?: string;
}

export interface PopoutDecryptionResult {
    success: boolean;
    data?: {
        username: string;
        password: string;
        website?: string;
        name?: string;
    };
    error?: string;
}

@Injectable({
    providedIn: "root",
})
export class PopoutCommunicationService {
    private decryptionDataSubject = new BehaviorSubject<PopoutDecryptionData | null>(null);
    private decryptionResultSubject = new BehaviorSubject<PopoutDecryptionResult | null>(null);

    constructor() {}

    get decryptionData$(): Observable<PopoutDecryptionData | null> {
        return this.decryptionDataSubject.asObservable();
    }

    get decryptionResult$(): Observable<PopoutDecryptionResult | null> {
        return this.decryptionResultSubject.asObservable();
    }

    setDecryptionData(data: PopoutDecryptionData): void {
        this.decryptionDataSubject.next(data);
    }

    getDecryptionData(): PopoutDecryptionData | null {
        return this.decryptionDataSubject.value;
    }

    clearDecryptionData(): void {
        this.decryptionDataSubject.next(null);
    }

    setDecryptionResult(result: PopoutDecryptionResult): void {
        this.decryptionResultSubject.next(result);
    }

    getDecryptionResult(): PopoutDecryptionResult | null {
        return this.decryptionResultSubject.value;
    }

    clearDecryptionResult(): void {
        this.decryptionResultSubject.next(null);
    }

    clearAll(): void {
        this.clearDecryptionData();
        this.clearDecryptionResult();
    }

    async isPopoutOpen(): Promise<boolean> {
        if (typeof browser === "undefined" || !browser.extension) return false;

        const views = browser.extension.getViews({ type: "popup" });

        return views.length > 0;
    }

    async openPopout(route: string, payload: any): Promise<void> {
        if (typeof chrome === "undefined" || !chrome.action) return;

        await chrome.action.openPopup();

        await this.redirectPopout(route, payload);
    }

    async redirectPopout(route: string, payload: any): Promise<void> {
        if (typeof chrome === "undefined" || !chrome.runtime) return;

        const views = chrome.extension.getViews({ type: "popup" });

        if (!views.length) return;

        const popoutWindow = views[0];

        popoutWindow.location.href = browser.runtime.getURL(`index.html#/${route}`);
        popoutWindow.focus();

        await new Promise((resolve, reject) =>
            chrome.runtime.sendMessage(
                {
                    type: "SEND_DECRYPTION_DATA_TO_POPOUT",
                    payload,
                },
                (response) => {
                    if (response?.success) resolve(response);
                    else reject(response?.error);
                }
            )
        );
    }
}
