import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

export interface PopoutDecryptionData {
    passwordId: string;
    publicData: {
        zelfProof: string;
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

    /**
     * Set decryption data for popout
     */
    setDecryptionData(data: PopoutDecryptionData): void {
        this.decryptionDataSubject.next(data);
    }

    /**
     * Get decryption data observable
     */
    get decryptionData$(): Observable<PopoutDecryptionData | null> {
        return this.decryptionDataSubject.asObservable();
    }

    /**
     * Get current decryption data
     */
    getDecryptionData(): PopoutDecryptionData | null {
        return this.decryptionDataSubject.value;
    }

    /**
     * Clear decryption data
     */
    clearDecryptionData(): void {
        this.decryptionDataSubject.next(null);
    }

    /**
     * Set decryption result
     */
    setDecryptionResult(result: PopoutDecryptionResult): void {
        this.decryptionResultSubject.next(result);
    }

    /**
     * Get decryption result observable
     */
    get decryptionResult$(): Observable<PopoutDecryptionResult | null> {
        return this.decryptionResultSubject.asObservable();
    }

    /**
     * Get current decryption result
     */
    getDecryptionResult(): PopoutDecryptionResult | null {
        return this.decryptionResultSubject.value;
    }

    /**
     * Clear decryption result
     */
    clearDecryptionResult(): void {
        this.decryptionResultSubject.next(null);
    }

    /**
     * Clear all data
     */
    clearAll(): void {
        this.clearDecryptionData();
        this.clearDecryptionResult();
    }
}
