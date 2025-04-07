import { Injectable } from "@angular/core";
import { HttpWrapperService } from "./http-wrapper.service";
import { environment } from "environments/environment";
import { TokenData } from "./wallet";
import { ChromeService } from "./chrome.service";
import { BehaviorSubject, Observable } from "rxjs";
import { AssetChart, AssetDetails, AssetInterval, AssetIntervalOptions, AssetRange } from "./models/asset.model";

@Injectable({
    providedIn: "root",
})
export class AssetService {
    private _asset$ = new BehaviorSubject<Partial<TokenData>>({});
    private _asset: Partial<TokenData> = {};
    private _baseUrl = `${environment.apiUrl}/api/asset`;

    constructor(private _chromeService: ChromeService, private _httpWrapperService: HttpWrapperService) {
        this._chromeService.getItem("selectedAsset").then((asset: Partial<TokenData>) => {
            if (asset) this.setAsset(asset);
        });
    }

    get asset$(): Observable<Partial<TokenData>> {
        return this._asset$.asObservable();
    }

    get asset(): Partial<TokenData> {
        return this._asset;
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

    async setAsset(asset: Partial<TokenData>) {
        await this._chromeService.setItem("selectedAsset", asset);

        this._asset = asset;
        this._asset$.next(asset);
    }

    async removeAsset() {
        await this._chromeService.removeItem("selectedAsset");

        this._asset = {};
        this._asset$.next(this._asset);
    }
}
