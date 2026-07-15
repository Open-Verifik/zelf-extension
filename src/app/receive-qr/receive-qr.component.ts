import { firstValueFrom, skip, Subject, takeUntil } from "rxjs";
import QRCodeStyling, { Options as QRCodeStylingOptions, Gradient as QRCodeStylingGradient } from "qr-code-styling";

import { NgIf, NgTemplateOutlet } from "@angular/common";
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { CopyToClipboardBase } from "app/base/copy-to-clipboard/copy-to-clipboard.base";
import { ChromeService } from "app/chrome.service";
import { readPublicDataDotAddress, readPublicDataKsmAddress } from "@shared/types/tag.types";
import { TagModel, TagsService } from "app/tags.service";
import { ReceiveGenerateSubstrateModalComponent } from "app/receive-qr/receive-generate-substrate-modal/receive-generate-substrate-modal.component";
import { SUBSTRATE_ADDRESS_PLACEHOLDER, WalletService } from "app/wallet.service";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";
import { ReceiveRisksModalComponent } from "app/receive-qr/receive-risks-modal/receive-risks-modal.component";

@Component({
    imports: [NgIf, NgTemplateOutlet, TranslocoModule, RouterLink, ZelfLoaderComponent, MatButtonModule],
    selector: "receive-qr",
    styleUrls: ["./receive-qr.component.scss"],
    templateUrl: "./receive-qr.component.html",
})
export class ReceiveQrComponent extends CopyToClipboardBase implements OnInit, OnDestroy {
    @ViewChild("qrCodeContainer", { static: false }) qrCodeContainer!: ElementRef<HTMLElement>;

    private unsubscriber$: Subject<void> = new Subject<void>();

    address: string = "";
    readonly substratePlaceholder: string = SUBSTRATE_ADDRESS_PLACEHOLDER;
    needsSubstrateAddress: boolean = false;
    loading: boolean = true;
    name: string = "";
    network: string = "";
    symbol: string = "";
    type: string = "";
    wallet: Partial<TagModel> = {};

    qrCode!: QRCodeStyling;
    qrCodeGradient: QRCodeStylingGradient = {
        type: "linear",
        rotation: 90,
        colorStops: [
            {
                color: "#181818",
                offset: 0,
            },
            {
                color: "#5e5e5e",
                offset: 100,
            },
        ],
    };

    qrCodeOptions: QRCodeStylingOptions = {
        data: "",
        height: 240,
        image: "./assets/icons/icon.png",
        margin: 0,
        type: "svg",
        width: 240,
        backgroundOptions: {
            color: "#ffffff",
        },
        cornersSquareOptions: {
            color: "#000000",
            type: "extra-rounded",
            gradient: this.qrCodeGradient,
        },
        cornersDotOptions: {
            color: "#000000",
            type: "dot",
            gradient: this.qrCodeGradient,
        },
        dotsOptions: {
            color: "#181818",
            type: "rounded",
            gradient: this.qrCodeGradient,
        },
        imageOptions: {
            crossOrigin: "anonymous",
            hideBackgroundDots: true,
            imageSize: 0.5,
            margin: 0,
        },
        qrOptions: {
            errorCorrectionLevel: "H",
            mode: "Byte",
            typeNumber: 0,
        },
    };

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _dialog: MatDialog,
        private _router: Router,
        private _tagsService: TagsService,
        private _walletService: WalletService,
        public _chromeService: ChromeService,
        public _snackBar: MatSnackBar,
        public _translocoService: TranslocoService
    ) {
        super(_chromeService, _snackBar, _translocoService);

        this.network = this._activatedRoute.snapshot.params["network"];

        this._activatedRoute.params.pipe(takeUntil(this.unsubscriber$)).subscribe((params) => {
            this.network = params["network"];

            this._setNetwork();

            this._setQRCode();
        });
    }

    async ngOnInit(): Promise<void> {
        this._chromeService.onWalletChanged$.pipe(skip(1), takeUntil(this.unsubscriber$)).subscribe(() => {
            void this._syncWalletAndQr();
        });

        await this._syncWalletAndQr();

        this.loading = false;
    }

    /** Load from Chrome storage, optional background tag search (TTL), then paint QR from local state. */
    private async _syncWalletAndQr(): Promise<void> {
        const w = (await this._walletService.getCurrentWallet()) as TagModel | null;
        this.wallet = w || {};

        if (this.wallet?.tagName) {
            this._tagsService.scheduleTagPublicDataRefreshIfDue(this.wallet as TagModel);
        }

        this._setNetwork();
        this._setQRCode();
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    /**
     * EVM receive routes use the same user address (stored as `ethAddress` on public data), including BlockDAG.
     * Do not use per-chain fields like `polygonAddress` or `blockDAGAddress` here.
     */
    private _applyEvmFromEthAddress(routeSegment: string): boolean {
        const n = routeSegment.toLowerCase();
        const evm: Record<string, { name: string; symbol: string; type: string }> = {
            avalanche: { name: "Avalanche", symbol: "AVAX", type: "ERC-20" },
            avax: { name: "Avalanche", symbol: "AVAX", type: "ERC-20" },
            binance: { name: "Binance", symbol: "BNB", type: "ERC-20" },
            bnb: { name: "Binance", symbol: "BNB", type: "ERC-20" },
            bsc: { name: "Binance", symbol: "BNB", type: "ERC-20" },
            bdag: { name: "BlockDAG", symbol: "BDAG", type: "" },
            blockdag: { name: "BlockDAG", symbol: "BDAG", type: "" },
            ethereum: { name: "Ethereum", symbol: "ETH", type: "ERC-20" },
            matic: { name: "Polygon", symbol: "MATIC", type: "ERC-20" },
            polygon: { name: "Polygon", symbol: "MATIC", type: "ERC-20" },
        };
        const meta = evm[n];
        if (!meta) {
            return false;
        }
        this.address = this.wallet.publicData?.ethAddress || "";
        this.name = meta.name;
        this.symbol = meta.symbol;
        this.type = meta.type;
        return true;
    }

    private _setNetwork(): void {
        if (!this.network) return;

        this.needsSubstrateAddress = false;

        const network = this.network.toLowerCase();

        if (this._applyEvmFromEthAddress(network)) {
            return;
        }

        if (network === "sui") {
            this.address = this.wallet.publicData?.suiAddress || "";
            this.name = "Sui";
            this.symbol = "SUI";
        } else if (network === "ton") {
            this.address = this.wallet.publicData?.tonAddress || "";
            this.name = "Ton";
            this.symbol = "TON";
        } else if (network === "solana") {
            this.address = this.wallet.publicData?.solanaAddress || "";
            this.name = "Solana";
            this.symbol = "SOL";
            this.type = "SPL";
        } else if (network === "bitcoin") {
            this.address = this.wallet.publicData?.btcAddress || "";
            this.name = "Bitcoin";
            this.symbol = "BTC";
        } else if (network === "stellar" || network === "xlm") {
            this.address = this.wallet.publicData?.xlmAddress || "";
            this.name = "Stellar";
            this.symbol = "XLM";
        } else if (network === "polkadot" || network === "dot") {
            this.address = readPublicDataDotAddress(this.wallet.publicData as Record<string, unknown> | null | undefined);
            this.name = "Polkadot";
            this.symbol = "DOT";
            this.needsSubstrateAddress = !this.address;
        } else if (network === "kusama" || network === "ksm") {
            this.address = readPublicDataKsmAddress(this.wallet.publicData as Record<string, unknown> | null | undefined);
            this.name = "Kusama";
            this.symbol = "KSM";
            this.needsSubstrateAddress = !this.address;
        }
    }

    private _setQRCode(): void {
        if (!this.qrCodeContainer || !this.qrCodeContainer.nativeElement) return;

        const el = this.qrCodeContainer.nativeElement;
        el.replaceChildren();

        if (this.needsSubstrateAddress) {
            return;
        }

        this.qrCodeOptions.data = this.address;

        this.qrCodeOptions.image = this._walletService.getAssetImage(this.symbol);

        this.qrCode = new QRCodeStyling(this.qrCodeOptions);

        this.qrCode.append(el);
    }

    public async copyToClipboard(): Promise<void> {
        this._copyToClipboard(this.address);
    }

    openRisksModal(): void {
        this._dialog.open(ReceiveRisksModalComponent, {
            panelClass: ["zelf-dialog", "zelf-dialog--receive-risks"],
            backdropClass: "zelf-backdrop",
            maxWidth: "min(340px, 92vw)",
            data: { name: this.name, symbol: this.symbol, type: this.type },
        });
    }

    onGenerateSubstrateClick(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        void this._openGenerateSubstrateModalAndGo();
    }

    private async _openGenerateSubstrateModalAndGo(): Promise<void> {
        if (!this.needsSubstrateAddress) return;

        const wallet = (await this._walletService.getCurrentWallet()) as TagModel | null;
        const fullTagName = (wallet?.fullTagName || wallet?.name || "").trim();
        if (!fullTagName) return;

        const sym = this.symbol === "KSM" ? "KSM" : "DOT";

        const ref = this._dialog.open(ReceiveGenerateSubstrateModalComponent, {
            backdropClass: "zelf-backdrop",
            data: { fullTagName, symbol: sym },
            maxWidth: "min(360px, 92vw)",
            panelClass: ["zelf-dialog", "zelf-dialog--receive-generate-substrate"],
        });

        const proceed = await firstValueFrom(ref.afterClosed());
        if (!proceed) return;

        await this._tagsService.setFlow("unlock");
        await this._router.navigate(["/security", "biometrics"], { queryParams: { return: `/receive/qr/${this.network}` } });
    }
}
