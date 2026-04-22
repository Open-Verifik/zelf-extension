import { Injectable } from "@angular/core";
import { FetchRequest, JsonRpcProvider } from "ethers";
import { Connection } from "@solana/web3.js";
import Web3 from "web3";
import HttpProvider from "web3-providers-http";
import type { HttpProviderOptions } from "web3-providers-http";

import { AuthService } from "app/services/auth.service";
import { environment } from "environments/environment";
import { getChainKeyFromChainId } from "@shared/utils/evm-chain-key.util";

export interface SolanaConnectionOptions {
    /**
     * When true, use public mainnet HTTP only (no JWT) — not the Zelf protected proxy.
     * Prefer default (false): `POST /api/protected/rpc/solana` with Bearer JWT.
     */
    useDirectRpc?: boolean;
}

export interface RpcProviderOptions {
    /**
     * When false and JWT is unavailable, throws instead of using direct `environment.*Rpc` URLs.
     * Use for sends / swaps so traffic stays on `/api/protected/rpc/:chainKey` (server `EXTENSION_*_RPC_URL`).
     * Default true for backward compatibility.
     */
    allowDirectFallback?: boolean;
}

/**
 * EVM + Solana JSON-RPC via Zelf API `POST /api/protected/rpc/:chainKey` with Bearer JWT.
 * Falls back to chain-specific public RPC URLs when auth is unavailable (Solana: mainnet-beta), unless `allowDirectFallback: false`.
 */
@Injectable({
    providedIn: "root",
})
export class RpcProviderService {
    private _solanaConnection: Promise<Connection> | null = null;
    private _solanaDirectConnection: Promise<Connection> | null = null;

    constructor(private readonly _auth: AuthService) {}

    getProtectedProxyUrl(chainKey: string): string {
        const base = environment.apiUrl.replace(/\/$/, "");
        return `${base}/api/protected/rpc/${chainKey}`;
    }

    /** Direct RPC URL used when the protected proxy cannot be used (mirrors previous extension behavior). */
    getFallbackDirectRpcUrl(chainKey: string): string {
        switch (chainKey) {
            case "ethereum":
                return environment.ethereumRpc.mainnet;
            case "polygon":
                return environment.polygonRpc.mainnet;
            case "avalanche":
                return environment.avalancheRpc.mainnet;
            case "bsc":
                return environment.binanceRpc.mainnet;
            case "arbitrum":
                return "https://arb1.arbitrum.io/rpc";
            case "optimism":
                return "https://mainnet.optimism.io";
            case "base":
                return "https://mainnet.base.org";
            case "blockdag":
                return "https://rpc.bdagscan.com";
            case "solana":
                /** No QuickNode URL in env — unauthenticated fallback only (primary path is JWT proxy). */
                return "https://api.mainnet-beta.solana.com";
            default:
                return environment.ethereumRpc.mainnet;
        }
    }

    /**
     * Solana `Connection`: default is `/api/protected/rpc/solana` + JWT; `{ useDirectRpc: true }` uses public mainnet HTTP (no JWT).
     */
    getSolanaConnection(opts: SolanaConnectionOptions = {}): Promise<Connection> {
        if (opts.useDirectRpc) {
            if (!this._solanaDirectConnection) {
                const url = this.getFallbackDirectRpcUrl("solana");
                this._solanaDirectConnection = Promise.resolve(new Connection(url, { commitment: "confirmed" }));
            }
            return this._solanaDirectConnection;
        }
        if (!this._solanaConnection) {
            this._solanaConnection = this._createSolanaConnection();
        }
        return this._solanaConnection;
    }

    private async _createSolanaConnection(): Promise<Connection> {
        const endpoint = this.getProtectedProxyUrl("solana");
        const fallback = this.getFallbackDirectRpcUrl("solana");
        try {
            await this._auth.checkAccessToken();
        } catch {
            return new Connection(fallback, { commitment: "confirmed" });
        }

        return new Connection(endpoint, {
            commitment: "confirmed",
            fetchMiddleware: (info, init, callback) => {
                void this._auth
                    .checkAccessToken()
                    .then((token) => {
                        const headers = new Headers(init?.headers as HeadersInit);
                        headers.set("Authorization", `Bearer ${token}`);
                        headers.set("Content-Type", "application/json");
                        callback(info, { ...init, headers });
                    })
                    .catch(() => {
                        callback(info, init);
                    });
            },
        });
    }

    /**
     * ethers v6 provider: `FetchRequest.preflightFunc` refreshes the Bearer token before each batch.
     *
     * `batchMaxCount: 1` is forced on the protected proxy path so each `JsonRpcProvider`
     * call is sent as a single JSON-RPC object. The proxy validates a single object body
     * via Joi; sending a batch array (ethers v6 default) was producing `code: -32600`
     * `"value" must be of type object` and ethers `BAD_DATA` "missing response for request"
     * with the raw payload leaking into the UI.
     */
    async getEthersProvider(chainKey: string, opts: RpcProviderOptions = {}): Promise<JsonRpcProvider> {
        const allowDirectFallback = opts.allowDirectFallback !== false;
        const url = this.getProtectedProxyUrl(chainKey);
        try {
            await this._auth.checkAccessToken();
        } catch (err) {
            if (!allowDirectFallback) {
                throw new Error("Session required for RPC. Sign in and try again.");
            }
            if (!environment.production) {
                console.warn(`[RpcProviderService] Direct RPC fallback for ${chainKey} (no JWT)`, err);
            }
            return new JsonRpcProvider(
                this.getFallbackDirectRpcUrl(chainKey),
                undefined,
                chainKey === "blockdag" ? { batchMaxCount: 1 } : undefined,
            );
        }

        const fr = new FetchRequest(url);
        fr.setHeader("Content-Type", "application/json");
        fr.preflightFunc = async (req) => {
            const token = await this._auth.checkAccessToken();
            req.setHeader("Authorization", `Bearer ${token}`);
            return req;
        };

        return new JsonRpcProvider(fr, undefined, { batchMaxCount: 1 });
    }

    async getEthersProviderForChainId(chainId: number, opts: RpcProviderOptions = {}): Promise<JsonRpcProvider> {
        const key = getChainKeyFromChainId(chainId);
        if (!key) {
            throw new Error(`Unsupported chainId for protected RPC: ${chainId}`);
        }
        return this.getEthersProvider(key, opts);
    }

    /**
     * web3.js v4 HTTP provider with auth headers (token at construction time; recreate via this service if token rotates).
     */
    async getWeb3(chainKey: string, opts: RpcProviderOptions = {}): Promise<Web3> {
        const allowDirectFallback = opts.allowDirectFallback !== false;
        const url = this.getProtectedProxyUrl(chainKey);
        try {
            const token = await this._auth.checkAccessToken();
            const httpOpts: HttpProviderOptions = {
                providerOptions: {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                },
            };
            const http = new HttpProvider(url, httpOpts);
            return new Web3(http);
        } catch (err) {
            if (!allowDirectFallback) {
                throw new Error("Session required for RPC. Sign in and try again.");
            }
            if (!environment.production) {
                console.warn(`[RpcProviderService] Direct RPC fallback for ${chainKey} (no JWT)`, err);
            }
            return new Web3(new HttpProvider(this.getFallbackDirectRpcUrl(chainKey)));
        }
    }
}
