/**
 * Zelf Wallet In-Page Provider
 *
 * Injected into the page context (not content script context).
 * Creates window.zelf as an EIP-1193 compatible provider and
 * announces via EIP-6963 for automatic wallet discovery.
 */

interface EIP1193Provider {
    isZelf: boolean;
    chainId: string;
    selectedAddress: string | null;
    isConnected(): boolean;
    request(args: { method: string; params?: any[] | Record<string, any> }): Promise<any>;
    on(event: string, callback: (...args: any[]) => void): void;
    removeListener(event: string, callback: (...args: any[]) => void): void;
    enable(): Promise<string[]>;
}

interface PendingRequest {
    resolve: (value: any) => void;
    reject: (reason: any) => void;
}

const ZELF_ICON =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iMjAiIGZpbGw9IiMxODE4MTgiLz4KPHBhdGggZD0iTTIwLjAxMDggOEMyMS4zNjMgOS44MzUxOCAyMy4wOTkzIDExLjkyNzIgMjUuMjg4MyAxNC4wODkzSDE1LjQ2MDlDMTcuNTg3MyAxMS44MzczIDE5LjA0MjYgOS42NzYyNSAyMC4wMTI4IDhIMjAuMDExOEgyMC4wMTA4WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTggMjAuMDI5MkM5LjczMDIgMTkuMTg5NiAxMi4wMDMxIDE3Ljg3MjIgMTQuMjg0MSAxNS44NTcxQzE0LjQ4NTIgMTUuNjc5MiAxNC42ODIzIDE1LjQ5OTIgMTQuODcxMyAxNS4zMjAzSDIzLjY1OTdDMjMuNjU5NyAxNS4zMjAzIDE3LjI5NDggMjQuMzE1MyAxMy44MTIxIDI0LjM0MjNDMTAuOTM4OSAyNC4zNjUyIDkuNzM1MjUgMjEuMDk5NyA4IDIwLjAyODJWMjAuMDI5MloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yMC41NzI3IDMxLjk5OTZDMTkuNTEyNSAzMC41NjAzIDE4LjE0NzIgMjguOTE3IDE2LjQxOCAyNy4yMTY4SDI0LjQ5OUMyMi43ODcgMjguOTQyIDIxLjUwODUgMzAuNjA3MyAyMC41NzM3IDMxLjk5OTZIMjAuNTcyN1oiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNS43Nzc3IDI1LjczMTZDMjUuNjgyNyAyNS44MTU1IDI1LjU4OTcgMjUuOTAwNSAyNS40OTc3IDI1Ljk4NDVIMTYuMDYyNUMxNi4wNjI1IDI1Ljk4NDUgMjIuNTMyNSAxNi44NzI2IDI2LjA2MTcgMTYuODUzNkMyOS4wMDY2IDE2LjgzODYgMzAuMjI2NSAyMC4xODIxIDMxLjk5OTEgMjEuMjc2NkMzMC4xOTYyIDIyLjI4OTEgMjguMDAxMSAyMy43Mjk1IDI1Ljc3NjcgMjUuNzMxNkgyNS43Nzc3WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==";

const DEFAULT_CHAIN_ID = "0x1"; // Ethereum mainnet

class ZelfProvider implements EIP1193Provider {
    isZelf = true;
    chainId = DEFAULT_CHAIN_ID;
    selectedAddress: string | null = null;

    private _connected = false;
    private _listeners: Map<string, Set<(...args: any[]) => void>> = new Map();
    private _pendingRequests: Map<string, PendingRequest> = new Map();
    private _requestId = 0;
    private _chainInitialized = false;

    constructor() {
        window.addEventListener("message", this._handleMessage.bind(this));
        this._initChainId();
        this._initAccounts();
    }

    isConnected(): boolean {
        return this._connected;
    }

    async request(args: { method: string; params?: any[] | Record<string, any> }): Promise<any> {
        const { method, params } = args;

        switch (method) {
            case "eth_chainId":
                return this.chainId;

            case "net_version":
                return String(parseInt(this.chainId, 16));

            case "eth_accounts":
                if (this.selectedAddress) return [this.selectedAddress];
                return this._sendToContentScript("DAPP_GET_ACCOUNTS", { method });

            case "eth_requestAccounts":
                return this._sendToContentScript("DAPP_REQUEST_ACCOUNTS", { method, params });

            case "eth_sendTransaction":
                return this._sendToContentScript("DAPP_SEND_TRANSACTION", { method, params });

            case "eth_signTransaction":
                return this._sendToContentScript("DAPP_SIGN_TRANSACTION", { method, params });

            case "personal_sign":
            case "eth_sign":
            case "eth_signTypedData_v4":
            case "eth_signTypedData_v3":
            case "eth_signTypedData":
                return this._sendToContentScript("DAPP_SIGN_MESSAGE", { method, params });

            case "wallet_switchEthereumChain":
                return this._sendToContentScript("DAPP_SWITCH_CHAIN", {
                    method,
                    chainId: (params as any)?.[0]?.chainId,
                });

            case "wallet_addEthereumChain":
                return this._sendToContentScript("DAPP_ADD_CHAIN", {
                    method,
                    chainId: (params as any)?.[0]?.chainId,
                });

            case "wallet_requestPermissions":
                return this._sendToContentScript("DAPP_REQUEST_ACCOUNTS", { method }).then(() => [{ parentCapability: "eth_accounts" }]);

            case "wallet_revokePermissions":
                return this._sendToContentScript("DAPP_DISCONNECT", { method });

            case "wallet_getPermissions":
                return this.selectedAddress ? [{ parentCapability: "eth_accounts" }] : [];

            default:
                throw new Error(`Zelf Wallet: Unsupported method ${method}`);
        }
    }

    on(event: string, callback: (...args: any[]) => void): void {
        if (!this._listeners.has(event)) {
            this._listeners.set(event, new Set());
        }
        this._listeners.get(event)!.add(callback);
    }

    removeListener(event: string, callback: (...args: any[]) => void): void {
        this._listeners.get(event)?.delete(callback);
    }

    async enable(): Promise<string[]> {
        return this.request({ method: "eth_requestAccounts" }) as Promise<string[]>;
    }

    private _emit(event: string, ...args: any[]): void {
        const callbacks = this._listeners.get(event);
        if (!callbacks) return;
        callbacks.forEach((cb) => {
            try {
                cb(...args);
            } catch (e) {
                console.error("Zelf: event listener error:", e);
            }
        });
    }

    private _initChainId(): void {
        this._sendToContentScript("DAPP_CHAIN_ID", {})
            .then((chainIdHex: string) => {
                if (chainIdHex && typeof chainIdHex === "string" && chainIdHex.startsWith("0x")) {
                    this.chainId = chainIdHex;
                }
                this._chainInitialized = true;
            })
            .catch(() => {
                this._chainInitialized = true;
            });
    }

    private _initAccounts(): void {
        this._sendToContentScript("DAPP_GET_ACCOUNTS", { method: "eth_accounts" })
            .then((accounts: string[]) => {
                if (
                    Array.isArray(accounts) &&
                    accounts.length > 0 &&
                    typeof accounts[0] === "string" &&
                    accounts[0].startsWith("0x") &&
                    accounts[0].length === 42
                ) {
                    this.selectedAddress = accounts[0];
                    this._connected = true;
                    this._emit("connect", { chainId: this.chainId });
                    this._emit("accountsChanged", accounts);
                }
            })
            .catch(() => {});
    }

    private _sendToContentScript(type: string, payload: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const requestId = `zelf_${++this._requestId}_${Date.now()}`;

            this._pendingRequests.set(requestId, { resolve, reject });

            window.postMessage(
                {
                    source: "zelf-inpage",
                    type,
                    payload,
                    requestId,
                },
                "*"
            );

            setTimeout(
                () => {
                    if (this._pendingRequests.has(requestId)) {
                        this._pendingRequests.delete(requestId);
                        reject(new Error("Request timed out"));
                    }
                },
                5 * 60 * 1000
            );
        });
    }

    private _handleMessage(event: MessageEvent): void {
        if (event.source !== (window as any)) return;
        if (!event.data || event.data.source !== "zelf-content-script") return;

        const { type, payload, requestId } = event.data;

        switch (type) {
            case "DAPP_PROVIDER_RESPONSE": {
                const pending = this._pendingRequests.get(requestId || payload?.requestId);
                if (!pending) return;

                this._pendingRequests.delete(requestId || payload?.requestId);

                if (payload?.error) {
                    const error = new Error(payload.error.message || "Request failed");
                    (error as any).code = payload.error.code || -32603;
                    pending.reject(error);
                } else {
                    const result = payload?.result;

                    if (
                        Array.isArray(result) &&
                        result.length > 0 &&
                        typeof result[0] === "string" &&
                        result[0].startsWith("0x") &&
                        result[0].length === 42
                    ) {
                        this.selectedAddress = result[0];
                        this._connected = true;
                        this._emit("connect", { chainId: this.chainId });
                        this._emit("accountsChanged", result);
                    }

                    pending.resolve(result);
                }
                break;
            }

            case "DAPP_ACCOUNTS_CHANGED": {
                const accounts = payload?.accounts || [];
                this.selectedAddress = accounts[0] || null;
                this._connected = accounts.length > 0;
                this._emit("accountsChanged", accounts);
                if (!this._connected) {
                    this._emit("disconnect", { code: 4900, message: "Disconnected" });
                }
                break;
            }

            case "DAPP_CHAIN_CHANGED": {
                const chainId = payload?.chainId;
                if (chainId) {
                    this.chainId = chainId;
                    this._emit("chainChanged", chainId);
                }
                break;
            }
        }
    }
}

// Only inject once
if (!(window as any).zelf) {
    console.log("ZelfProvider injecting...");
    const provider = new ZelfProvider();
    (window as any).zelf = provider;

    // Also set as window.ethereum if no other wallet has claimed it,
    // so generic dApps that only check window.ethereum can find us
    if (!(window as any).ethereum) {
        (window as any).ethereum = provider;
    }

    // EIP-6963: Multi Injected Provider Discovery
    const providerInfo = {
        uuid: crypto.randomUUID(),
        name: "Zelf Name Service",
        icon: ZELF_ICON,
        rdns: "world.zelf.wallet",
    };

    const announceEvent = new CustomEvent("eip6963:announceProvider", {
        detail: Object.freeze({ info: providerInfo, provider }),
    });

    window.dispatchEvent(announceEvent);

    window.addEventListener("eip6963:requestProvider", () => {
        window.dispatchEvent(
            new CustomEvent("eip6963:announceProvider", {
                detail: Object.freeze({ info: providerInfo, provider }),
            })
        );
    });
}
