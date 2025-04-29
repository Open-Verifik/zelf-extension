import { CurrencyPipe, DecimalPipe, NgClass, NgFor, NgTemplateOutlet } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup } from "@angular/forms";
import { MatRippleModule } from "@angular/material/core";
import { TranslocoModule } from "@ngneat/transloco";
import { SwapSource, TokenData } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { LifiService } from "../services/lifi.service";
import { catchError, take } from "rxjs/operators";
import { of } from "rxjs";
import { firstValueFrom } from "rxjs";
import { HttpClient } from "@angular/common/http";

export interface AssetChangeData {
    asset: TokenData;
    source: "source" | "target";
}

@Component({
    imports: [NgFor, NgClass, NgTemplateOutlet, ReactiveFormsModule, TranslocoModule, CurrencyPipe, DecimalPipe, MatRippleModule],
    selector: "swap-currency",
    standalone: true,
    styleUrls: ["./swap-currency.component.scss"],
    templateUrl: "./swap-currency.component.html",
})
export class SwapCurrencyComponent implements OnInit {
    @Input() source: "source" | "target" = "source";
    @Input() selectedAsset: TokenData = {} as TokenData;
    @Input() myAssets: TokenData[] = [];
    @Input() showAllTokens: boolean = true;

    @Output() assetChange = new EventEmitter<AssetChangeData>();

    private _myAssetsMap: Record<string, TokenData> = {};
    private _allTokens: TokenData[] = [];

    form = this._fb.group({
        textFilter: [""],
        networkFilter: ["all"],
    });

    networkOptions = ["all", "ethereum", "avalanche", "polygon", "arbitrum"];
    loading = false;
    selectedNetworkFilter = "all";

    assets: TokenData[] = [];

    constructor(private _fb: FormBuilder, private http: HttpClient, private _walletService: WalletService, private _lifiService: LifiService) {}

    async ngOnInit(): Promise<void> {
        try {
            this.loading = true;
            const lifiTokens = await this.getTokensFromLiFi();
            this._allTokens = [...this.myAssets, ...lifiTokens];
            this.assets = this._allTokens;
            this._setMyAssetsMap(this._allTokens);
        } catch (error) {
            console.error("Error in ngOnInit:", error);
        } finally {
            this.loading = false;
        }
    }

    private _isTokenInMyAssets(token: TokenData): boolean {
        return this.myAssets.some(
            (asset) => asset.symbol.toLowerCase() === token.symbol.toLowerCase() && asset.network.toLowerCase() === token.network.toLowerCase()
        );
    }

    get filteredAssets(): TokenData[] {
        return this.assets.filter((asset) => {
            if (!asset) return false;

            const selectedNetwork = this.form.get("networkFilter")?.value?.toLowerCase();
            const matchesNetwork = selectedNetwork === "all" || asset.network?.toLowerCase() === selectedNetwork;

            const searchText = this.form.get("textFilter")?.value?.toLowerCase() || "";
            const matchesText =
                !searchText ||
                (asset.name && asset.name.toLowerCase().includes(searchText)) ||
                (asset.symbol && asset.symbol.toLowerCase().includes(searchText));

            return matchesNetwork && matchesText;
        });
    }

    get myAssetsMap(): Record<string, TokenData> {
        return this._myAssetsMap;
    }

    private _setMyAssetsMap(assets: TokenData[]): void {
        this._myAssetsMap = assets.reduce((acc, asset) => {
            const key = `${asset.symbol.toLowerCase()}-${asset.network.toLowerCase()}`;
            acc[key] = asset;
            return acc;
        }, {} as Record<string, TokenData>);
    }

    selectAsset(asset: TokenData): void {
        this.assetChange.emit({
            asset,
            source: this.source,
        });
    }

    toggleNetworkFilter(network: string): void {
        this.selectedNetworkFilter = network;
        this.form.patchValue({ networkFilter: network });
    }

    isNetworkSelected(network: string): boolean {
        return this.selectedNetworkFilter === network;
    }

    getAssetImage(symbol: string): string {
        const asset = this._allTokens.find((token) => token.symbol === symbol);
        if (asset) {
            return this._lifiService.getTokenImage(asset);
        }
        return "/assets/images/tokens/default-token.png";
    }

    handleImageError(event: any) {
        event.target.src = "/assets/images/tokens/default-token.png";
    }

    getMyAsset(key: string): TokenData | undefined {
        return this._myAssetsMap[key];
    }

    private async getTokensFromLiFi(): Promise<TokenData[]> {
        try {
            const response: any = await firstValueFrom(this.http.get("https://li.quest/v1/tokens"));
            console.log("LI.FI API response:", response);

            const allTokens: TokenData[] = [];

            if (response.tokens) {
                Object.entries(response.tokens).forEach(([chainId, tokens]) => {
                    if (!Array.isArray(tokens)) return;

                    const chainTokens = tokens.map(
                        (token: any) =>
                            ({
                                symbol: token.symbol,
                                name: token.name,
                                address: token.address,
                                decimals: token.decimals,
                                chainId: parseInt(chainId),
                                image: token.logoURI || "",
                                price: token.priceUSD ? parseFloat(token.priceUSD) : 0,
                                network: this.getNetworkFromChainId(parseInt(chainId)),
                                balance: "0",
                                balanceUsd: "0",
                                fiatBalance: "0",
                                tokenType: "token",
                                amount: "0",
                            } as TokenData)
                    );

                    allTokens.push(...chainTokens);
                });
            }

            return allTokens;
        } catch (error) {
            console.error("Error fetching tokens from LI.FI:", error);
            return [];
        }
    }

    private getNetworkFromChainId(chainId: number): string {
        const networkMap: Record<number, string> = {
            1: "ethereum",
            43114: "avalanche",
            137: "polygon",
            56: "binance",
            42161: "arbitrum",
        };
        return networkMap[chainId] || "unknown";
    }
}
