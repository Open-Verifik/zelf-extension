import { NgFor, NgIf, NgTemplateOutlet } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, RouterLink } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { readPublicDataDotAddress, readPublicDataKsmAddress } from "@shared/types/tag.types";
import { firstValueFrom, skip, Subject, takeUntil } from "rxjs";
import { CopyToClipboardBase } from "app/base/copy-to-clipboard/copy-to-clipboard.base";
import { ChromeService } from "app/chrome.service";
import { AddressMaskPipe } from "app/pipes/address-mask.pipe";
import { ReceiveGenerateSubstrateModalComponent } from "app/receive-qr/receive-generate-substrate-modal/receive-generate-substrate-modal.component";
import { Network, SUBSTRATE_ADDRESS_PLACEHOLDER, WalletService } from "app/wallet.service";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";
import { SettingsService } from "app/services/settings.service";
import { TagModel, TagsService } from "app/tags.service";

@Component({
    imports: [NgIf, NgFor, NgTemplateOutlet, RouterLink, TranslocoModule, MatButtonModule, AddressMaskPipe, ZelfLoaderComponent],
    selector: "receive-currency",
    styleUrls: ["./receive-currency.component.scss"],
    templateUrl: "./receive-currency.component.html",
})
export class ReceiveCurrencyComponent extends CopyToClipboardBase implements OnInit, OnDestroy {
    private _destroy$ = new Subject<void>();

    loading: boolean = true;
    networks: Network[] = [];

    constructor(
        private _dialog: MatDialog,
        private _router: Router,
        private _walletService: WalletService,
        private _settingsService: SettingsService,
        private _tagsService: TagsService,
        public _chromeService: ChromeService,
        public _snackBar: MatSnackBar,
        public _translocoService: TranslocoService
    ) {
        super(_chromeService, _snackBar, _translocoService);
    }

    async ngOnInit(): Promise<void> {
        this._chromeService.onWalletChanged$.pipe(skip(1), takeUntil(this._destroy$)).subscribe(() => {
            void this._rebuildNetworkRowsFromCurrentWallet();
        });

        try {
            await this._rebuildNetworkRowsFromCurrentWallet();
        } finally {
            this.loading = false;
        }
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    /**
     * Storage-first: no blocking GET /api/tags/search. A background refresh runs only when the same 30m
     * session window as `refreshAllTagsPublicData` says so; `onWalletChanged$` reapplies the list when it finishes.
     */
    private async _rebuildNetworkRowsFromCurrentWallet(): Promise<void> {
        const wallet = (await this._walletService.getCurrentWallet()) as TagModel | null;

        if (wallet?.tagName) {
            this._tagsService.scheduleTagPublicDataRefreshIfDue(wallet);
        }

        if (!wallet) {
            this.networks = [];
            return;
        }

        const allNetworks = await this._walletService.getAvailableWalletNetworks(wallet);
        const enabledNetworkIds = this._getEnabledNetworkIds();

        let list = !enabledNetworkIds ? allNetworks : allNetworks.filter((network) => this._isNetworkEnabled(network, enabledNetworkIds));

        list = this._withSubstratePlaceholdersIfNeeded(list, wallet, enabledNetworkIds);

        this.networks = list;
    }

    private _isNetworkEnabled(network: Network, enabledNetworkIds: string[]): boolean {
        const networkId = this._mapSymbolToNetworkId(network.symbol);
        return enabledNetworkIds.includes(networkId);
    }

    private _withSubstratePlaceholdersIfNeeded(
        networks: Network[],
        wallet: TagModel,
        enabledNetworkIds: string[] | undefined
    ): Network[] {
        const zelfId = (wallet.fullTagName || wallet.name || "").trim();
        if (!zelfId) return networks;

        const pd = wallet.publicData as unknown as Record<string, unknown> | null | undefined;
        const hasDot = Boolean(readPublicDataDotAddress(pd));
        const hasKsm = Boolean(readPublicDataKsmAddress(pd));
        const out = [...networks];
        const showDot = this._shouldShowSubstrateInReceive("polkadot", enabledNetworkIds, out, "DOT");
        const showKsm = this._shouldShowSubstrateInReceive("kusama", enabledNetworkIds, out, "KSM");

        if (!hasDot && showDot) {
            out.push({
                address: SUBSTRATE_ADDRESS_PLACEHOLDER,
                image: this._walletService.getAssetImage("DOT"),
                name: "Polkadot",
                needsSubstrateAddress: true,
                symbol: "DOT",
            });
        }

        if (!hasKsm && showKsm) {
            out.push({
                address: SUBSTRATE_ADDRESS_PLACEHOLDER,
                image: this._walletService.getAssetImage("KSM"),
                name: "Kusama",
                needsSubstrateAddress: true,
                symbol: "KSM",
            });
        }

        return out;
    }

    private _shouldShowSubstrateInReceive(
        id: "polkadot" | "kusama",
        enabledNetworkIds: string[] | undefined,
        currentList: Network[],
        symbol: "DOT" | "KSM"
    ): boolean {
        if (currentList.some((n) => n.symbol === symbol && !n.needsSubstrateAddress)) return false;
        if (currentList.some((n) => n.symbol === symbol && n.needsSubstrateAddress)) return false;
        if (!enabledNetworkIds) return true;
        return enabledNetworkIds.includes(id);
    }

    private _getEnabledNetworkIds(): string[] | undefined {
        return this._settingsService.getEnabledNetworkIds();
    }

    private _mapSymbolToNetworkId(symbol: string): string {
        switch (symbol.toUpperCase()) {
            case "ETH":
                return "ethereum";
            case "AVAX":
                return "avalanche";
            case "BNB":
            case "BSC":
                return "binance";
            case "BTC":
                return "bitcoin";
            case "BDAG":
                return "blockdag";
            case "MATIC":
            case "POL":
                return "polygon";
            case "SOL":
                return "solana";
            case "SUI":
                return "sui";
            case "TON":
                return "ton";
            case "XLM":
                return "stellar";
            case "DOT":
                return "polkadot";
            case "KSM":
                return "kusama";
            default:
                return symbol.toLowerCase();
        }
    }

    public copyToClipboard(event: Event, network: Network): void {
        event.preventDefault();
        event.stopPropagation();

        this._copyToClipboard(network.address);
    }

    onGenerateSubstrateClick(event: Event, network: Network): void {
        event.preventDefault();
        event.stopPropagation();

        if (!network.needsSubstrateAddress) return;

        void this._openGenerateSubstrateModalAndGo(network);
    }

    private async _openGenerateSubstrateModalAndGo(network: Network): Promise<void> {
        const wallet = (await this._walletService.getCurrentWallet()) as TagModel | null;
        const fullTagName = (wallet?.fullTagName || wallet?.name || "").trim();
        if (!fullTagName) return;

        const symbol = network.symbol === "KSM" ? "KSM" : "DOT";

        const ref = this._dialog.open(ReceiveGenerateSubstrateModalComponent, {
            backdropClass: "zelf-backdrop",
            data: { fullTagName, symbol },
            maxWidth: "min(360px, 92vw)",
            panelClass: ["zelf-dialog", "zelf-dialog--receive-generate-substrate"],
        });

        const proceed = await firstValueFrom(ref.afterClosed());
        if (!proceed) return;

        await this._tagsService.setFlow("unlock");
        await this._router.navigate(["/security", "biometrics"], { queryParams: { return: "/receive" } });
    }
}
