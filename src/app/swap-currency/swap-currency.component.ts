import { CurrencyPipe, DecimalPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from "@angular/common";
import { Component, DestroyRef, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup } from "@angular/forms";
import { MatRippleModule } from "@angular/material/core";
import { TranslocoModule } from "@jsverse/transloco";
import { LifiService } from "app/services/lifi.service";
import { TokenData } from "app/wallet";
import { WalletService } from "app/wallet.service";

export interface AssetChangeData {
    asset: TokenData;
    source: "source" | "target";
}

@Component({
    imports: [NgIf, NgFor, NgClass, NgTemplateOutlet, ReactiveFormsModule, TranslocoModule, CurrencyPipe, DecimalPipe, MatRippleModule],
    selector: "swap-currency",
    styleUrls: ["./swap-currency.component.scss"],
    templateUrl: "./swap-currency.component.html",
})
export class SwapCurrencyComponent implements OnInit {
    @ViewChild("assetsContainer", { static: false }) assetsContainer!: ElementRef;

    @Input() source: "source" | "target" = "source";
    @Input() selectedAsset: Partial<TokenData> = {};
    @Input() myAssets: TokenData[] = [];
    @Input() showAllTokens: boolean = true;

    @Output() assetChange = new EventEmitter<AssetChangeData>();

    private _pageSize = 40;
    private _myAssetsMap: Record<string, TokenData> = {};

    assets: TokenData[] = [];
    form!: UntypedFormGroup;
    loading = false;
    maxPage = 1;
    minPage = 1;
    networkOptions = ["all", "ethereum", "avalanche"];
    selectedNetworkFilter = "all";

    constructor(
        private _destroyRef: DestroyRef,
        private _fb: FormBuilder,
        private _lifiService: LifiService,
        private _walletService: WalletService
    ) {
        this.loading = true;

        this._initForm();
    }

    async ngOnInit(): Promise<void> {
        try {
            await this._initializeAssets();
        } catch (error) {
            console.error("Error in ngOnInit:", error);
        } finally {
            this.loading = false;
        }
    }

    get displayedAssets(): TokenData[] {
        return this.filteredAssets.slice(this.minPage - 1, this.maxPage * this._pageSize);
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

    private async _fetchAndMapTokens(): Promise<TokenData[]> {
        try {
            const allTokens: TokenData[] = [];
            const response: any = await this._lifiService.requestTokens();

            if (!response.tokens || !Object.keys(response.tokens).length) return allTokens;

            Object.entries(response.tokens).forEach(([chainId, tokens]) => this._mapTokenResponse([chainId, tokens], allTokens));

            allTokens.sort(this._sortAssets);

            return allTokens;
        } catch (error) {
            console.error("Error fetching tokens from LI.FI:", error);

            return [];
        }
    }

    private _getNetworkFromChainId(chainId: number): string {
        const networkMap: Record<number, string> = {
            1: "ethereum",
            43114: "avalanche",
            137: "polygon",
            56: "binance",
            42161: "arbitrum",
        };

        return networkMap[chainId] || "unknown";
    }

    private _initForm(): void {
        this.form = this._fb.group({
            textFilter: [""],
            networkFilter: ["all"],
        });

        this.form.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => this._resetPaging());
    }

    private async _initializeAssets(): Promise<void> {
        this._setMyAssetsMap(this.myAssets);

        this.assets = await this._fetchAndMapTokens();

        this._resetPaging();

        this.loading = false;
    }

    private _mapTokenResponse = ([chainId, tokens]: [string, any], allTokens: TokenData[]): void => {
        if (!Array.isArray(tokens)) return;

        const chainMap: Record<string, boolean> = {};
        const network = this._getNetworkFromChainId(parseInt(chainId));

        if (network !== "ethereum" && network !== "avalanche") return;

        const chainTokens: TokenData[] = [];

        tokens.forEach((token: any) => {
            const key = `${token.symbol.toLowerCase()}-${network}`;

            if (chainMap[key]) return;

            chainMap[key] = true;

            let myAsset = {};

            if (this._myAssetsMap[key]) myAsset = this._myAssetsMap[key];

            const asset = {
                amount: "0",
                balance: "0",
                balanceUsd: "0",
                fiatBalance: "0",
                tokenType: "token",
                ...myAsset,
                chainId: parseInt(chainId),
                decimals: token.decimals,
                image: token.logoURI || "",
                name: token.name,
                network: network.charAt(0).toUpperCase() + network.slice(1),
                price: token.priceUSD ? parseFloat(token.priceUSD) : 0,
                symbol: token.symbol,
                contractAddress: token.address,
            } as TokenData;

            if (asset.image) this._walletService.setAssetImage(asset.symbol, asset.image);

            chainTokens.push(asset);
        });

        allTokens.push(...chainTokens);
    };

    private _resetPaging(): void {
        this.minPage = 1;
        this.maxPage = 1;
    }

    private _setMyAssetsMap(assets: TokenData[]): void {
        this._myAssetsMap = assets.reduce(
            (acc, asset) => {
                const key = `${asset.symbol.toLowerCase()}-${asset.network.toLowerCase()}`;

                acc[key] = asset;

                return acc;
            },
            {} as Record<string, TokenData>
        );
    }

    private _sortAssets(a: TokenData, b: TokenData): number {
        const aBalance = parseFloat(`${a.fiatBalance}` || "0");
        const bBalance = parseFloat(`${b.fiatBalance}` || "0");

        if (aBalance === 0 && bBalance === 0) return a.network.localeCompare(b.network);

        return bBalance - aBalance;
    }

    getAssetImage(asset: TokenData): string {
        return this._walletService.getAssetImage(asset.symbol, asset.image);
    }

    isNetworkSelected(network: string): boolean {
        return this.selectedNetworkFilter === network;
    }

    onImageError(asset: TokenData): void {
        asset.image = "assets/tokens/placeholder-coin.png";
    }

    onScroll(event: Event): void {
        const el = event.target as HTMLElement;
        const threshold = 20;
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - threshold;
        const atTop = el.scrollTop <= threshold;

        if (atBottom && this.maxPage * this._pageSize < this.filteredAssets.length) {
            this.maxPage++;

            if (this.maxPage - this.minPage + 1 > 2) this.minPage++;
        } else if (atTop && this.minPage > 1) {
            this.minPage--;

            if (this.maxPage - this.minPage + 1 > 2) this.maxPage--;
        } else return;
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
}
