import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { environment } from "environments/environment";

import { ChromeService } from "./chrome.service";
import { HttpWrapperService } from "./http-wrapper.service";

import { AssetChart, AssetDetails, AssetInterval, AssetIntervalOptions, AssetRange } from "./models/asset.model";
import { TokenData } from "@shared/types/wallet.types";

/** Solana wrapped SOL (SPL) mint — must not share native `SOL` tokenType with lamports balance */
const WSOL_MINT = "So11111111111111111111111111111111111111112";

export interface NetworkPermissions {
    AVAX?: boolean;
    BDAG?: boolean;
    BNB?: boolean;
    BTC?: boolean;
    DOT?: boolean;
    ETH?: boolean;
    KSM?: boolean;
    POL?: boolean;
    SOL?: boolean;
    SUI?: boolean;
    TON?: boolean;
    XLM?: boolean;
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
            BDAG: false,
            BNB: true,
            BTC: false,
            ETH: true,
            POL: true,
            SOL: true,
            SUI: true,
            TON: false,
            XLM: true,
        };
    }

    get canSend(): NetworkPermissions {
        return {
            AVAX: true,
            BDAG: true,
            BNB: true,
            BTC: true,
            DOT: true,
            ETH: true,
            KSM: true,
            POL: true,
            SOL: true,
            SUI: true,
            TON: false,
            XLM: true,
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

    private _isWrappedSolToken(token: any): boolean {
        const mint = `${token.tokenAddress || token.mint || ""}`.trim();
        if (mint === WSOL_MINT) return true;
        const name = `${token.name || ""}`.toUpperCase();
        return name === "WRAPPED SOL" || name.includes("WRAPPED SOL");
    }

    private _determineTokenType(token: any, network: string): string {
        if (network === "Solana" && this._isWrappedSolToken(token)) {
            return "SPL";
        }

        // If token already has a tokenType, use it
        if (token.tokenType && token.tokenType !== "ERC-20") return token.tokenType;

        // Check if this is a native token
        if (this._isNativeToken(token, network)) {
            switch (network) {
                case "Ethereum":
                    return "ETH";
                case "Avalanche":
                    return "AVAX";
                case "Solana":
                    return "SOL";
                case "Bitcoin":
                    return "BTC";
                case "Sui":
                    return "SUI";
                case "Ton":
                    return "TON";
                case "Binance":
                    return "BNB";
                case "Polygon":
                    return "MATIC";
                case "Stellar":
                    return "XLM";
                case "Polkadot":
                    return "DOT";
                case "Kusama":
                    return "KSM";
                default:
                    return "NATIVE";
            }
        }

        // Return appropriate non-native token type for each network
        switch (network) {
            case "Ethereum":
            case "Avalanche":
            case "Polygon":
                return "ERC-20";
            case "Binance":
                return "BEP-20";
            case "Solana":
                return "SPL";
            case "Sui":
                return "SUI-TOKEN";
            case "Ton":
                return "JETTON";
            case "Bitcoin":
                return "BTC-TOKEN";
            default:
                return "TOKEN";
        }
    }

    private _isNativeToken(token: any, network: string): boolean {
        const nativeTokenSymbols: Record<string, string[]> = {
            Avalanche: ["AVAX", "AVALANCHE"],
            Binance: ["BNB", "BINANCE", "BSC"],
            Bitcoin: ["BTC", "BITCOIN"],
            Ethereum: ["ETH", "ETHEREUM"],
            Polygon: ["MATIC", "POLYGON", "POL"],
            Solana: ["SOL", "SOLANA"],
            Stellar: ["XLM", "STELLAR"],
            Sui: ["SUI", "SUI-TOKEN"],
            Ton: ["TON", "TONCOIN"],
            Polkadot: ["DOT", "POLKADOT"],
            Kusama: ["KSM", "KUSAMA"],
        };

        const networkNativeSymbols = nativeTokenSymbols[network] || [];
        const tokenSymbol = token.symbol?.toUpperCase();
        const tokenName = token.name?.toUpperCase();

        return networkNativeSymbols.some((nativeSymbol) => tokenSymbol === nativeSymbol || tokenName === nativeSymbol);
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
        if (symbol === "BDAG") {
            return new Observable((observer) => {
                observer.next({ data: [] });
                observer.complete();
            });
        }

        const interval = this.rangeIntervalMap[range];
        const { startDate, endDate } = this._setStartEndDates(range);

        return this._httpWrapperService.sendRequest<{ data: AssetChart[] }>("get", `${this._baseUrl}/chart/${symbol.toUpperCase()}`, {
            interval,
            startDate,
            endDate,
        });
    }

    fetchAssetPrice(symbol: string) {
        if (symbol === "BDAG") {
            return new Observable((observer) => {
                observer.next({ data: [] });
                observer.complete();
            });
        }

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

    isNativeToken(token: any, network: string): boolean {
        return this._isNativeToken(token, network);
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
                    (network === "BlockDAG" && !permissions.BDAG) ||
                    (network === "Sui" && !permissions.SUI) ||
                    (network === "Ton" && !permissions.TON) ||
                    (network === "Binance" && !permissions.BNB) ||
                    (network === "Polygon" && !permissions.POL) ||
                    (network === "Stellar" && !permissions.XLM) ||
                    (network === "Polkadot" && !permissions.DOT) ||
                    (network === "Kusama" && !permissions.KSM)
                ) {
                    continue;
                }
            }

            const determinedTokenType = this._determineTokenType(token, network);

            const balance = parseFloat(token.balance || token.amount || "0");
            const formattedToken = {
                ...token,
                balance,
                amount: balance,
                fiatBalance: token.fiatBalance !== null ? parseFloat(token.fiatBalance || "0") : null,
                image: token.image || (determinedTokenType === "AVAX" ? "assets/networks/avax.png" : token.image),
                network,
                price: parseFloat(token.price || "0"),
                tokenType: determinedTokenType,
                isWrappedSol: network === "Solana" && this._isWrappedSolToken(token),
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

        if (response?.binance?.data?.tokenHoldings?.tokens && (!permissions || permissions.BNB)) {
            tokens = this.processTokens("Binance", response.binance.data.tokenHoldings.tokens, tokens, permissions);
        }

        if (response?.blockdag?.data?.tokenHoldings?.tokens && (!permissions || permissions.BDAG)) {
            tokens = this.processTokens("BlockDAG", response.blockdag.data.tokenHoldings.tokens, tokens, permissions);
        }

        if (response?.polygon?.data?.tokenHoldings?.tokens && (!permissions || permissions.POL)) {
            tokens = this.processTokens("Polygon", response.polygon.data.tokenHoldings.tokens, tokens, permissions);
        }

        if (response?.sui?.data?.tokenHoldings?.tokens && (!permissions || permissions.SUI)) {
            tokens = this.processTokens("Sui", response.sui.data.tokenHoldings.tokens, tokens, permissions);
        }

        if (response?.ton?.data?.tokenHoldings?.tokens && (!permissions || permissions.TON)) {
            tokens = this.processTokens("Ton", response.ton.data.tokenHoldings.tokens, tokens, permissions);
        }

        if (response?.polkadot?.data?.tokenHoldings?.tokens && (!permissions || permissions.DOT)) {
            tokens = this.processTokens("Polkadot", response.polkadot.data.tokenHoldings.tokens, tokens, permissions);
        }

        if (response?.kusama?.data?.tokenHoldings?.tokens && (!permissions || permissions.KSM)) {
            tokens = this.processTokens("Kusama", response.kusama.data.tokenHoldings.tokens, tokens, permissions);
        }

        if (response?.stellar?.data && (!permissions || permissions.XLM)) {
            tokens = this._processStellarTokens(response.stellar.data, tokens, permissions);
        }

        if (response?.bitcoin?.data?.tokenHoldings?.tokens && (!permissions || permissions.BTC)) {
            tokens = this.processTokens("Bitcoin", response.bitcoin.data.tokenHoldings.tokens, tokens, permissions);
        }

        if (response?.bitcoinTestnet?.data?.tokenHoldings?.tokens && (!permissions || permissions.BTC)) {
            tokens = this.processTokens("Bitcoin", response.bitcoinTestnet.data.tokenHoldings.tokens, tokens, permissions);
        }

        // Get pinned tokens and add isPinned flag
        const pinnedTokens = await this.getPinnedTokens();
        tokens = tokens.map((token) => ({
            ...token,
            isPinned: pinnedTokens.includes(this._getTokenKey(token)),
        }));

        // Sort: pinned tokens first, then by fiat balance
        tokens.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return b.fiatBalance - a.fiatBalance;
        });

        if (!permissions) await this.saveTokensToSession(tokens);

        return { tokens, totalFiatBalance: tokens.reduce((acc, token) => acc + (token.fiatBalance || 0), 0) };
    }

    private _processStellarTokens(stellarData: any, tokens: any[], permissions?: NetworkPermissions): any[] {
        const xlmBalance = parseFloat(stellarData.balance || "0") || 0;
        const xlmFiat = parseFloat(stellarData.fiatBalance || stellarData.account?.fiatValue || "0") || 0;
        const xlmPrice = parseFloat(stellarData.account?.price || "0") || 0;

        const xlmToken = {
            symbol: "XLM",
            name: "Stellar",
            balance: xlmBalance,
            fiatBalance: xlmFiat,
            price: xlmPrice,
            asset: "XLM",
            decimals: 7,
        };

        let result = this.processTokens("Stellar", [xlmToken], tokens, permissions);
        if (stellarData.tokenHoldings?.tokens?.length) {
            result = this.processTokens("Stellar", stellarData.tokenHoldings.tokens, result, permissions);
        }
        return result;
    }

    private _getTokenKey(token: any): string {
        return `${token.symbol}-${token.network}-${token.tokenType}`;
    }

    async getPinnedTokens(): Promise<string[]> {
        try {
            const pinned = await this._chromeService.getItem("pinnedTokens");
            return pinned || [];
        } catch (error) {
            console.error("Error getting pinned tokens:", error);
            return [];
        }
    }

    async pinToken(token: any): Promise<void> {
        try {
            const pinnedTokens = await this.getPinnedTokens();
            const tokenKey = this._getTokenKey(token);

            if (!pinnedTokens.includes(tokenKey)) {
                pinnedTokens.push(tokenKey);
                await this._chromeService.setItem("pinnedTokens", pinnedTokens);
            }
        } catch (error) {
            console.error("Error pinning token:", error);
        }
    }

    async unpinToken(token: any): Promise<void> {
        try {
            const pinnedTokens = await this.getPinnedTokens();
            const tokenKey = this._getTokenKey(token);
            const filtered = pinnedTokens.filter((key) => key !== tokenKey);

            await this._chromeService.setItem("pinnedTokens", filtered);
        } catch (error) {
            console.error("Error unpinning token:", error);
        }
    }

    async togglePinToken(token: any): Promise<boolean> {
        const pinnedTokens = await this.getPinnedTokens();
        const tokenKey = this._getTokenKey(token);
        const isPinned = pinnedTokens.includes(tokenKey);

        if (isPinned) {
            await this.unpinToken(token);
        } else {
            await this.pinToken(token);
        }

        return !isPinned;
    }
}
