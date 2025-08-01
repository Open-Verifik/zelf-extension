import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { environment } from "environments/environment";

import { ChromeService } from "./chrome.service";
import { HttpWrapperService } from "./http-wrapper.service";

import { AssetChart, AssetDetails, AssetInterval, AssetIntervalOptions, AssetRange } from "./models/asset.model";
import { TokenData } from "./wallet";

export interface NetworkPermissions {
    AVAX?: boolean;
    BSC?: boolean;
    BTC?: boolean;
    ETH?: boolean;
    POLYGON?: boolean;
    SOL?: boolean;
    SUI?: boolean;
}

@Injectable({
    providedIn: "root",
})
export class AssetService {
    private _baseUrl = `${environment.apiUrl}/api/asset`;
    private _sourceAsset: Partial<TokenData> = {};
    private _sourceAsset$ = new BehaviorSubject<Partial<TokenData>>({});
    private _targetAsset: Partial<TokenData> = {};
    private _targetAsset$ = new BehaviorSubject<Partial<TokenData>>({});

    constructor(
        private _chromeService: ChromeService,
        private _httpWrapperService: HttpWrapperService
    ) {
        this._chromeService.getItem("sourceAsset").then((asset: Partial<TokenData>) => {
            if (asset) this.setSourceAsset(asset);
        });

        this._chromeService.getItem("targetAsset").then((asset: Partial<TokenData>) => {
            if (asset) this.setTargetAsset(asset);
        });
    }

    get sourceAsset$(): Observable<Partial<TokenData>> {
        return this._sourceAsset$.asObservable();
    }

    get sourceAsset(): Partial<TokenData> {
        return this._sourceAsset;
    }

    get targetAsset$(): Observable<Partial<TokenData>> {
        return this._targetAsset$.asObservable();
    }

    get targetAsset(): Partial<TokenData> {
        return this._targetAsset;
    }

    get canSwap(): NetworkPermissions {
        return {
            AVAX: true,
            BSC: false,
            BTC: false,
            ETH: true,
            POLYGON: false,
            SOL: true,
            SUI: false,
        };
    }

    get canSend(): NetworkPermissions {
        return {
            AVAX: true,
            BSC: true,
            BTC: true,
            ETH: true,
            POLYGON: true,
            SOL: true,
            SUI: true,
        };
    }

    get intervals(): AssetIntervalOptions {
        return [
            { label: "1D", range: "1d" },
            { label: "7D", range: "7d" },
            { label: "1M", range: "1M" },
            { label: "1Y", range: "1y" },
        ];
    }

    get rangeIntervalMap(): Record<AssetRange, AssetInterval> {
        return {
            "1d": "5m",
            "7d": "15m",
            "1M": "1h",
            "1y": "1d",
        };
    }

    private _setStartEndDates(range: AssetRange) {
        const endDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0].replace(/-/g, "-");

        let startDate = "";

        switch (range) {
            case "1d":
                startDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0].replace(/-/g, "-");
                break;
            case "7d":
                startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0].replace(/-/g, "-");
                break;
            case "1M":
                startDate = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split("T")[0].replace(/-/g, "-");
                break;
            case "1y":
                startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split("T")[0].replace(/-/g, "-");
                break;
            default:
                throw new Error("Invalid range");
        }

        return { startDate, endDate };
    }

    fetchAssetDetails(symbol: string, interval: AssetInterval, limit: number = 50) {
        return this._httpWrapperService.sendRequest<{ data: AssetDetails }>("get", `${this._baseUrl}/${symbol.toUpperCase()}/USD`, {
            interval,
            limit,
        });
    }

    fetchAssetChart(symbol: string, range: AssetRange) {
        const interval = this.rangeIntervalMap[range];
        const { startDate, endDate } = this._setStartEndDates(range);

        return this._httpWrapperService.sendRequest<{ data: AssetChart[] }>("get", `${this._baseUrl}/chart/${symbol.toUpperCase()}`, {
            interval,
            startDate,
            endDate,
        });
    }

    fetchAssetPrice(symbol: string) {
        return this._httpWrapperService.sendRequest<{ data: AssetChart[] }>("get", `${this._baseUrl}/chart/${symbol.toUpperCase()}`, {
            interval: "1m",
            limit: 1,
        });
    }

    async setSourceAsset(asset: Partial<TokenData>) {
        await this._chromeService.setItem("sourceAsset", asset);

        this._sourceAsset = asset;
        this._sourceAsset$.next(asset);
    }

    async setTargetAsset(asset: Partial<TokenData>) {
        await this._chromeService.setItem("targetAsset", asset);

        this._targetAsset = asset;
        this._targetAsset$.next(asset);
    }

    async removeSourceAsset() {
        await this._chromeService.removeItem("sourceAsset");

        this._sourceAsset = {};
        this._sourceAsset$.next(this._sourceAsset);
    }

    async loadTokensFromSession(): Promise<any[]> {
        const sessionTokenTtl = await this._chromeService.getItemSession("tokensTtl");

        if (!sessionTokenTtl || sessionTokenTtl <= Date.now()) return [];

        const sessionTokens = await this._chromeService.getItemSession("tokens");

        if (!sessionTokens || !sessionTokens.length) return [];

        return sessionTokens;
    }

    async saveTokensToSession(tokens: Array<any>): Promise<void> {
        this._chromeService.setItemSession("tokens", tokens);
        this._chromeService.setItemSession("tokensTtl", Date.now() + 3600000);
    }

    processTokens(network: string, tokens: Array<any>, processedTokens: Array<any> = [], permissions?: NetworkPermissions): Array<any> {
        for (const token of tokens) {
            if ((!token.symbol && !token.name) || /^nft/i.test(token?.tokenType)) continue;

            if (permissions) {
                if (
                    (network === "Ethereum" && !permissions.ETH) ||
                    (network === "Solana" && !permissions.SOL) ||
                    (network === "Bitcoin" && !permissions.BTC) ||
                    (network === "Avalanche" && !permissions.AVAX) ||
                    (network === "Sui" && !permissions.SUI) ||
                    (network === "Binance" && !permissions.BSC) ||
                    (network === "Polygon" && !permissions.POLYGON)
                ) {
                    continue;
                }
            }

            const formattedToken = {
                ...token,
                balance: parseFloat(token.balance || token.amount || "0"),
                fiatBalance: token.fiatBalance !== null ? parseFloat(token.fiatBalance || "0") : null,
                image: token.image || (token.tokenType === "AVAX" ? "assets/networks/avax.png" : token.image),
                network,
                price: parseFloat(token.price || "0"),
                tokenType: token.tokenType || (network === "Avalanche" ? "AVAX" : "ERC-20"),
            };

            const tokenKey = `${formattedToken.symbol}-${formattedToken.network}-${formattedToken.tokenType}`;
            const existingTokenIndex = processedTokens.findIndex((t) => `${t.symbol}-${t.network}-${t.tokenType}` === tokenKey);

            if (existingTokenIndex === -1) {
                processedTokens.push(formattedToken);
            } else {
                processedTokens[existingTokenIndex] = formattedToken;
            }
        }

        return processedTokens;
    }

    async processTokensFromResponse(response: any, permissions?: NetworkPermissions): Promise<{ tokens: any[]; totalFiatBalance: number }> {
        let tokens: any[] = [];

        if (response?.ethereum?.data?.tokenHoldings?.tokens && (!permissions || permissions.ETH)) {
            tokens = this.processTokens("Ethereum", response.ethereum.data.tokenHoldings.tokens, tokens, permissions);
        }

        if (response?.solana?.data?.tokenHoldings?.tokens && (!permissions || permissions.SOL)) {
            tokens = this.processTokens("Solana", response.solana.data.tokenHoldings.tokens, tokens, permissions);
        }

        if (response?.avalanche?.data?.tokenHoldings?.tokens && (!permissions || permissions.AVAX)) {
            tokens = this.processTokens("Avalanche", response.avalanche.data.tokenHoldings.tokens, tokens, permissions);
        }

        if (response?.bsc?.data?.tokenHoldings?.tokens && (!permissions || permissions.BSC)) {
            tokens = this.processTokens("Binance", response.bsc.data.tokenHoldings.tokens, tokens, permissions);
        }

        if (response?.polygon?.data?.tokenHoldings?.tokens && (!permissions || permissions.POLYGON)) {
            tokens = this.processTokens("Polygon", response.polygon.data.tokenHoldings.tokens, tokens, permissions);
        }

        if (response?.sui?.data?.tokenHoldings?.tokens && (!permissions || permissions.SUI)) {
            tokens = this.processTokens("Sui", response.sui.data.tokenHoldings.tokens, tokens, permissions);
        }

        if (response?.bitcoin?.data?.tokenHoldings?.tokens && (!permissions || permissions.BTC)) {
            tokens = this.processTokens("Bitcoin", response.bitcoin.data.tokenHoldings.tokens, tokens, permissions);
        }

        if (response?.bitcoinTestnet?.data?.tokenHoldings?.tokens && (!permissions || permissions.BTC)) {
            tokens = this.processTokens("Bitcoin", response.bitcoinTestnet.data.tokenHoldings.tokens, tokens, permissions);
        }

        tokens.sort((a, b) => b.fiatBalance - a.fiatBalance);

        if (!permissions) await this.saveTokensToSession(tokens);

        return { tokens, totalFiatBalance: tokens.reduce((acc, token) => acc + (token.fiatBalance || 0), 0) };
    }
}
