import { Injectable, NgZone } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { ChromeService } from "app/chrome.service";
import { VerifyContext, VerifyStatus } from "@shared/types/dapp.types";

export interface WCSession {
    topic: string;
    peerMeta: {
        name: string;
        description?: string;
        url: string;
        icons?: string[];
    };
    chains: string[];
    accounts: string[];
    expiry: number;
}

export interface WCPendingProposal {
    id: number;
    params: any;
    verifyContext?: VerifyContext;
}

export interface WCPendingRequest {
    id: number;
    topic: string;
    method: string;
    params: any;
    peerMeta?: any;
    verifyContext?: VerifyContext;
}

@Injectable({
    providedIn: "root",
})
export class WalletConnectService {
    private _sessions$ = new BehaviorSubject<WCSession[]>([]);
    private _pendingProposals$ = new BehaviorSubject<WCPendingProposal[]>([]);
    private _pendingRequests$ = new BehaviorSubject<WCPendingRequest[]>([]);
    private _initialized$ = new BehaviorSubject<boolean>(false);
    private _pairingUri$ = new BehaviorSubject<string>("");

    private _offscreenReady = false;

    constructor(
        private _chromeService: ChromeService,
        private _ngZone: NgZone
    ) {
        this._setupMessageListener();
    }

    get sessions$(): Observable<WCSession[]> {
        return this._sessions$.asObservable();
    }

    get pendingProposals$(): Observable<WCPendingProposal[]> {
        return this._pendingProposals$.asObservable();
    }

    get pendingRequests$(): Observable<WCPendingRequest[]> {
        return this._pendingRequests$.asObservable();
    }

    get initialized$(): Observable<boolean> {
        return this._initialized$.asObservable();
    }

    get pairingUri$(): Observable<string> {
        return this._pairingUri$.asObservable();
    }

    async initialize(): Promise<void> {
        try {
            await this._ensureOffscreenDocument();
            await this._sendToOffscreen("WC_INIT", {});
        } catch (error) {
            console.error("WalletConnect init error:", error);
        }
    }

    async pair(uri: string): Promise<void> {
        await this._ensureOffscreenDocument();
        await this._sendToOffscreen("WC_PAIR", { uri });
    }

    async approveSession(proposalId: number, accounts: string[]): Promise<any> {
        const response = await this._sendToOffscreen("WC_APPROVE_SESSION", { proposalId, accounts });

        this._removePendingProposal(proposalId);
        await this.refreshSessions();

        return response;
    }

    async rejectSession(proposalId: number): Promise<void> {
        await this._sendToOffscreen("WC_REJECT_SESSION", { proposalId });
        this._removePendingProposal(proposalId);
    }

    async approveRequest(topic: string, requestId: number, result: any): Promise<void> {
        await this._sendToOffscreen("WC_APPROVE_REQUEST", { topic, requestId, result });
        this._removePendingRequest(requestId);
    }

    async rejectRequest(topic: string, requestId: number): Promise<void> {
        await this._sendToOffscreen("WC_REJECT_REQUEST", { topic, requestId });
        this._removePendingRequest(requestId);
    }

    async disconnect(topic: string): Promise<void> {
        await this._sendToOffscreen("WC_DISCONNECT", { topic });
        await this.refreshSessions();
    }

    async refreshSessions(): Promise<void> {
        try {
            const response = await this._sendToOffscreen("WC_GET_SESSIONS", {});
            if (response?.data) {
                const sessions = this._parseSessions(response.data);
                this._ngZone.run(() => this._sessions$.next(sessions));
            }
        } catch (error) {
            console.error("Error refreshing WC sessions:", error);
        }
    }

    async emitAccountsChanged(accounts: string[]): Promise<void> {
        const sessions = this._sessions$.value;
        for (const session of sessions) {
            for (const chain of session.chains) {
                try {
                    await this._sendToOffscreen("WC_EVENT", {
                        topic: session.topic,
                        event: "accountsChanged",
                        data: accounts,
                        chainId: chain,
                    });
                } catch {
                    // Session may be disconnected
                }
            }
        }
    }

    async emitChainChanged(chainId: string): Promise<void> {
        const sessions = this._sessions$.value;
        for (const session of sessions) {
            try {
                await this._sendToOffscreen("WC_EVENT", {
                    topic: session.topic,
                    event: "chainChanged",
                    data: parseInt(chainId, 16),
                    chainId: `eip155:${parseInt(chainId, 16)}`,
                });
            } catch {
                // Session may be disconnected
            }
        }
    }

    getVerifyStatusLabel(status?: VerifyStatus): string {
        switch (status) {
            case "VALID":
                return "Verified dApp";
            case "INVALID":
                return "Domain mismatch - proceed with caution";
            case "THREAT":
                return "This site has been flagged as malicious";
            default:
                return "Unverified dApp";
        }
    }

    isThreat(verifyContext?: VerifyContext): boolean {
        if (!verifyContext) return false;
        return verifyContext.verified.validation === "THREAT" || verifyContext.verified.isScam === true;
    }

    private _setupMessageListener(): void {
        if (typeof chrome === "undefined" || !chrome.runtime) return;

        chrome.runtime.onMessage.addListener((message) => {
            this._ngZone.run(() => {
                switch (message.type) {
                    case "WC_READY":
                        this._offscreenReady = true;
                        this._initialized$.next(true);
                        this.refreshSessions();
                        break;

                    case "WC_SESSION_PROPOSAL":
                        this._addPendingProposal(message.payload);
                        break;

                    case "WC_SESSION_REQUEST":
                        this._addPendingRequest(message.payload);
                        break;

                    case "WC_SESSION_DELETE":
                        this.refreshSessions();
                        break;
                }
            });
        });
    }

    private _addPendingProposal(payload: any): void {
        const proposals = this._pendingProposals$.value;
        proposals.push({
            id: payload.id,
            params: payload.params,
            verifyContext: payload.verifyContext,
        });
        this._pendingProposals$.next([...proposals]);
    }

    private _removePendingProposal(id: number): void {
        const proposals = this._pendingProposals$.value.filter((p) => p.id !== id);
        this._pendingProposals$.next(proposals);
    }

    private _addPendingRequest(payload: any): void {
        const requests = this._pendingRequests$.value;
        requests.push({
            id: payload.id,
            topic: payload.topic,
            method: payload.params?.request?.method || "",
            params: payload.params?.request?.params || [],
            peerMeta: payload.peerMeta,
            verifyContext: payload.verifyContext,
        });
        this._pendingRequests$.next([...requests]);

        this._showRequestNotification(payload);
    }

    private _removePendingRequest(id: number): void {
        const requests = this._pendingRequests$.value.filter((r) => r.id !== id);
        this._pendingRequests$.next(requests);
    }

    private _parseSessions(rawSessions: Record<string, any>): WCSession[] {
        return Object.entries(rawSessions).map(([topic, session]) => ({
            topic,
            peerMeta: session.peer?.metadata || { name: "Unknown", url: "" },
            chains: Object.keys(session.namespaces || {}).flatMap((ns) => session.namespaces[ns]?.chains || []),
            accounts: Object.keys(session.namespaces || {}).flatMap((ns) => session.namespaces[ns]?.accounts || []),
            expiry: session.expiry || 0,
        }));
    }

    private async _showRequestNotification(payload: any): Promise<void> {
        try {
            if (typeof chrome !== "undefined" && chrome.notifications) {
                const peerName = payload.peerMeta?.name || "A dApp";
                const method = payload.params?.request?.method || "action";

                chrome.notifications.create(`wc-request-${payload.id}`, {
                    type: "basic",
                    iconUrl: "assets/icons/icon128.png",
                    title: "Zelf Wallet",
                    message: `${peerName} requests ${method}`,
                    priority: 2,
                });
            }
        } catch {
            // Notifications may not be available
        }
    }

    private async _ensureOffscreenDocument(): Promise<void> {
        if (this._offscreenReady) return;

        try {
            if (typeof chrome !== "undefined" && chrome.offscreen) {
                const existingContexts = await (chrome as any).runtime.getContexts({
                    contextTypes: ["OFFSCREEN_DOCUMENT"],
                });

                if (existingContexts.length === 0) {
                    await chrome.offscreen.createDocument({
                        url: "offscreen/walletconnect-offscreen.html",
                        reasons: [chrome.offscreen.Reason.WEB_RTC as any],
                        justification: "WalletConnect WebSocket connection",
                    });
                }
            }
        } catch (error) {
            console.error("Error creating offscreen document:", error);
        }
    }

    private _sendToOffscreen(type: string, payload: any): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                chrome.runtime.sendMessage({ type, payload }, (response) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        resolve(response);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}
