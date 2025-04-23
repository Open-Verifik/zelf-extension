import { CurrencyPipe, DecimalPipe, NgClass, NgFor, NgTemplateOutlet } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup } from "@angular/forms";
import { MatRippleModule } from "@angular/material/core";
import { TranslocoModule } from "@ngneat/transloco";
import { SwapSource, TokenData } from "app/wallet";
import { WalletService } from "app/wallet.service";

export type AssetChangeData = {
    asset: TokenData;
    source: SwapSource;
};

@Component({
    imports: [NgFor, NgClass, NgTemplateOutlet, ReactiveFormsModule, TranslocoModule, CurrencyPipe, DecimalPipe, MatRippleModule],
    selector: "swap-currency",
    standalone: true,
    styleUrls: ["./swap-currency.component.scss"],
    templateUrl: "./swap-currency.component.html",
})
export class SwapCurrencyComponent implements OnInit {
    @Input() source: SwapSource = "";
    @Input() selectedAsset: Partial<TokenData> = {};
    @Input() myAssets: TokenData[] = [];

    @Output() assetChange: EventEmitter<AssetChangeData> = new EventEmitter<AssetChangeData>();

    private _myAssetsMap: Record<string, TokenData> = {};

    form!: UntypedFormGroup;
    networkOptions: string[] = ["all", "Ethereum", "Solana", "Avalanche", "Sui"];

    constructor(private _formBuilder: FormBuilder, private _walletService: WalletService) {
        this._initForm();
    }

    ngOnInit(): void {
        this._setMyAssetsMap(this.myAssets);
    }

    get filteredAssets(): TokenData[] {
        return Object.values(this.myAssetsMap).filter((asset) => {
            const matchesNetwork = this.form.get("networkFilter")?.value === "all" || asset.network === this.form.get("networkFilter")?.value;

            const matchesText =
                !this.form.get("textFilter")?.value ||
                asset.name.toLowerCase().includes(this.form.get("textFilter")?.value.toLowerCase()) ||
                asset.symbol.toLowerCase().includes(this.form.get("textFilter")?.value.toLowerCase());

            return matchesNetwork && matchesText;
        });
    }

    get myAssetsMap(): Record<string, TokenData> {
        return this._myAssetsMap;
    }

    private _initForm(): void {
        this.form = this._formBuilder.group({
            networkFilter: ["all"],
            textFilter: [""],
        });
    }

    private _setMyAssetsMap(assets: TokenData[]): void {
        this._myAssetsMap = assets.reduce((acc, asset) => {
            acc[`${asset.symbol}-${asset.network}`] = asset;
            return acc;
        }, {} as Record<string, TokenData>);
    }

    getAssetImage(symbol: string): string {
        return this._walletService.getAssetImage(symbol);
    }

    getMyAsset(key: string): TokenData | undefined {
        return this._myAssetsMap[key];
    }

    selectAsset(asset: TokenData): void {
        this.assetChange.emit({ asset, source: this.source });
    }

    toggleNetworkFilter(network: string): void {
        this.form.get("networkFilter")?.setValue(network);
    }
}
