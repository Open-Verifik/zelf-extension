import { CurrencyPipe, DecimalPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from "@angular/common";
import {
    ChangeDetectorRef,
    Component,
    DestroyRef,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup } from "@angular/forms";
import { MatRippleModule } from "@angular/material/core";
import { MatButtonModule } from "@angular/material/button";
import { TranslocoModule } from "@jsverse/transloco";

import { AssetService, NetworkPermissions } from "app/asset.service";
import { LifiService } from "app/services/lifi.service";
import { NetworkName, NetworkService, NetworkSymbol } from "app/services/network.service";
import { TokenData } from "@shared/types/wallet.types";
import { WalletService } from "app/wallet.service";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";
import { SettingsService } from "app/services/settings.service";

export interface AssetChangeData {
    asset: TokenData;
    source: "source" | "target";
}

@Component({
    imports: [
        NgIf,
        NgFor,
        NgClass,
        NgTemplateOutlet,
        ReactiveFormsModule,
        TranslocoModule,
        CurrencyPipe,
        DecimalPipe,
        MatRippleModule,
        MatButtonModule,
        ZelfLoaderComponent,
    ],
    selector: "swap-currency",
    styleUrls: ["./swap-currency.component.scss"],
    templateUrl: "./swap-currency.component.html",
})
export class SwapCurrencyComponent implements OnInit, OnChanges {
    @ViewChild("assetsContainer", { static: false }) assetsContainer!: ElementRef;

    @Input() source: "source" | "target" = "source";
    @Input() selectedAsset: Partial<TokenData> = {};
    @Input() myAssets: TokenData[] = [];
    @Input() showAllTokens: boolean = true;
    /** When set, only tokens on this chain (lowercase id, e.g. ethereum) are listed. */
    @Input() parentNetworkId: string | null = null;
    /** Token already chosen on the other swap side; hidden so the same asset cannot be selected twice. */
    @Input() excludeOppositeAsset: Partial<TokenData> | null = null;

    @Output() assetChange = new EventEmitter<AssetChangeData>();
    @Output() pickerBack = new EventEmitter<void>();

    tokenListTab: "yours" | "trusted" = "yours";

    private _pageSize = 40;
    private _myAssetsMap: Record<string, TokenData> = {};

    assets: TokenData[] = [];
    form!: UntypedFormGroup;
    loading = false;
    maxPage = 1;
    minPage = 1;
    networkOptions = [] as string[];
    selectedNetworkFilter = "all";

    constructor(
        private _assetService: AssetService,
        private _destroyRef: DestroyRef,
        private _fb: FormBuilder,
        private _lifiService: LifiService,
        private _networkService: NetworkService,
        private _walletService: WalletService,
        private _settingsService: SettingsService,
        private _cdr: ChangeDetectorRef
    ) {
        this.loading = true;

        this._initNetworkOptions();
        this._initForm();
    }

    private _initNetworkOptions(): void {
        const enabledNetworkIds = this._getEnabledNetworkIds();

        this.networkOptions = [
            "all",
            ...Object.keys(this._assetService.canSwap)
                .map((networkSymbol) => {
                    const canSwap = this._assetService.canSwap[networkSymbol as keyof NetworkPermissions];

                    if (!canSwap) return "";

                    const networkName = this._networkService.getNetworkName(networkSymbol as NetworkSymbol);

                    // Check if network is enabled in settings
                    if (enabledNetworkIds && !enabledNetworkIds.includes(networkName.toLowerCase())) {
                        return "";
                    }

                    return networkName;
                })
                .filter((networkName) => networkName !== "" && networkName !== undefined && networkName !== null),
        ];
    }

    async ngOnInit(): Promise<void> {
        this._ensureNetworkFilterDefaults();

        this._settingsService.settings$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
            this._initNetworkOptions();
            this._cdr.markForCheck();
        });

        try {
            await this._initializeAssets();
        } catch (error) {
            console.error("Error in ngOnInit:", error);
        } finally {
            this.loading = false;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["parentNetworkId"] && this.form) {
            this.form.patchValue({ networkFilter: "all" }, { emitEvent: false });
            this.selectedNetworkFilter = "all";
            this._resetPaging();

            const ch = changes["parentNetworkId"];

            if (!ch.isFirstChange() && ch.previousValue !== ch.currentValue) {
                void this._fetchAndMapTokens();
            }
        }

        if (changes["excludeOppositeAsset"] && this.form) {
            this._resetPaging();
        }

        this._ensureNetworkFilterDefaults();
    }

    get displayedAssets(): TokenData[] {
        return this.tabFilteredAssets.slice(this.minPage - 1, this.maxPage * this._pageSize);
    }

    get tabFilteredAssets(): TokenData[] {
        const base = this.filteredAssets;

        if (this.tokenListTab !== "yours") return base;

        return base.filter((a) => {
            const fiat = parseFloat(String(a.fiatBalance ?? 0)) || 0;
            const amt = parseFloat(String(a.amount ?? 0)) || 0;

            return fiat > 0 || amt > 0;
        });
    }

    private _getEnabledNetworkIds(): string[] | undefined {
        return this._settingsService.getEnabledNetworkIds();
    }

    private _isNetworkEnabled(networkName: string): boolean {
        const enabledNetworkIds = this._getEnabledNetworkIds();

        if (!enabledNetworkIds) return true;

        return enabledNetworkIds.includes(networkName.toLowerCase());
    }

    /** Aligns with swap form `_notMatchingValidator` (symbol + network). */
    private _swapAssetIdentityKey(asset: Pick<TokenData, "symbol" | "network"> | Partial<TokenData> | null | undefined): string | null {
        if (!asset?.symbol || !asset?.network) return null;

        return `${String(asset.symbol).toLowerCase()}-${String(asset.network).toLowerCase()}`;
    }

    get filteredAssets(): TokenData[] {
        const excludeKey = this._swapAssetIdentityKey(this.excludeOppositeAsset);

        return this.assets.filter((asset) => {
            if (!asset) return false;

            const networkName = asset.network || "";
            if (!this._isNetworkEnabled(networkName)) return false;

            if (excludeKey && this._swapAssetIdentityKey(asset) === excludeKey) return false;

            if (this.parentNetworkId && networkName.toLowerCase() !== this.parentNetworkId.toLowerCase()) return false;

            const raw = this.form.get("networkFilter")?.value;
            const selectedNetwork =
                typeof raw === "string" && raw.trim() !== "" ? raw.trim().toLowerCase() : "all";
            const matchesNetwork = selectedNetwork === "all" || networkName.toLowerCase() === selectedNetwork;

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
        this.loading = true;

        try {
            const allTokens: TokenData[] = [];

            const { tokens } = await this._lifiService.requestTokens(this.parentNetworkId);

            if (tokens && Object.keys(tokens).length) {
                Object.entries(tokens).forEach(([chainId, tokenList]) => this._mapTokenResponse([chainId, tokenList], allTokens));
            }

            this._appendWalletOnlySwappableTokens(allTokens);

            allTokens.sort((a, b) => this._sortAssets(a, b));

            this.assets = allTokens;
            this._resetPaging();

            this.loading = false;
            return this.assets;
        } catch (error) {
            this.loading = false;
            const fallback: TokenData[] = [];
            this._appendWalletOnlySwappableTokens(fallback);
            fallback.sort((a, b) => this._sortAssets(a, b));
            this.assets = fallback;
            this._resetPaging();
            return this.assets;
        }
    }

    /** LiFi catalog omits some enabled chains (e.g. Stellar); still list wallet balances for swap picker. */
    private _appendWalletOnlySwappableTokens(allTokens: TokenData[]): void {
        const seen = new Set<string>();

        for (const a of allTokens) {
            const id = this._swapAssetIdentityKey(a);

            if (id) seen.add(id);
        }

        for (const wallet of this.myAssets) {
            if (!wallet?.symbol || !wallet?.network) continue;

            const id = this._swapAssetIdentityKey(wallet);

            if (!id || seen.has(id)) continue;

            if (!this._isNetworkEnabled(wallet.network)) continue;

            if (
                this.parentNetworkId &&
                String(wallet.network).toLowerCase() !== this.parentNetworkId.toLowerCase()
            ) {
                continue;
            }

            const sym = this._networkService.getNetworkSymbol(String(wallet.network).toLowerCase() as NetworkName);

            if (!sym || !this._assetService.canSwap[sym as keyof NetworkPermissions]) continue;

            seen.add(id);

            const priceNum =
                typeof wallet.price === "number" ? wallet.price : parseFloat(String(wallet.price ?? 0)) || 0;
            const w = wallet as TokenData & { address_token?: string };

            allTokens.push({
                amount: wallet.amount ?? "0",
                balance: (wallet as TokenData & { balance?: string }).balance ?? String(wallet.amount ?? "0"),
                balanceUsd: (wallet as TokenData & { balanceUsd?: string }).balanceUsd ?? "0",
                contractAddress: wallet.contractAddress ?? w.address_token ?? "",
                decimals: wallet.decimals,
                fiatBalance: wallet.fiatBalance ?? "0",
                image: wallet.image ?? "",
                name: wallet.name ?? wallet.symbol,
                network: wallet.network,
                price: priceNum,
                symbol: wallet.symbol,
                tokenType: wallet.tokenType || "token",
            } as TokenData);
        }
    }

    private _ensureNetworkFilterDefaults(): void {
        if (!this.form) return;

        const v = this.form.get("networkFilter")?.value;

        if (v == null || v === "" || (typeof v === "string" && v.trim() === "")) {
            this.form.patchValue({ networkFilter: "all" }, { emitEvent: false });
            this.selectedNetworkFilter = "all";
        }
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

        try {
            await this._fetchAndMapTokens();
        } catch (error) {}

        this._resetPaging();

        this.loading = false;
    }

    private _mapTokenResponse = ([chainId, tokens]: [string, any], allTokens: TokenData[]): void => {
        if (!Array.isArray(tokens)) return;

        const chainMap: Record<string, boolean> = {};
        const network = this._lifiService.chainBucketKeyToInternalNetwork(chainId);
        const canSwap = this._assetService.canSwap[this._networkService.getNetworkSymbol(network as NetworkName) as keyof NetworkPermissions];

        if (!canSwap) return;

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
                chainId,
                decimals: token.decimals,
                fiatBalance: "0",
                tokenType: "token",
                ...myAsset,
                contractAddress: token.address,
                image: token.logoURI || "",
                name: token.name,
                network: network.charAt(0).toUpperCase() + network.slice(1),
                price: token.priceUSD ? parseFloat(token.priceUSD) : 0,
                symbol: token.symbol,
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

        if (!aBalance && !bBalance) return (a.priceUSD as string)?.localeCompare(b.priceUSD as string) || 0;

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

        if (atBottom && this.maxPage * this._pageSize < this.tabFilteredAssets.length) {
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

    setTokenListTab(tab: "yours" | "trusted"): void {
        this.tokenListTab = tab;
        this._resetPaging();
    }

    emitPickerBack(): void {
        this.pickerBack.emit();
    }

    formatTokenPrice(asset: TokenData): string {
        const p = asset.price as number | undefined;

        if (p == null || Number.isNaN(p) || p <= 0) return "—";

        if (p < 0.0001) return `$${p.toExponential(2)}`;

        return `$${p.toFixed(p < 1 ? 6 : 2)}`;
    }

    formatPriceChange(asset: TokenData): string | null {
        const pct = (asset as TokenData & { priceChangePercentage24h?: number }).priceChangePercentage24h;

        if (pct == null || Number.isNaN(pct)) return null;

        const sign = pct > 0 ? "+" : "";

        return `${sign}${pct.toFixed(2)}%`;
    }

    isPriceChangeNegative(asset: TokenData): boolean {
        const pct = (asset as TokenData & { priceChangePercentage24h?: number }).priceChangePercentage24h;

        return typeof pct === "number" && pct < 0;
    }

    getNetworkBadge(asset: TokenData): string {
        const n = (asset.network || "").toLowerCase();

        if (!n) return "";

        return this._walletService.getAssetImage(this._networkService.getNetworkSymbol(n as NetworkName));
    }
}
