import { Subject, takeUntil } from "rxjs";
import QRCodeStyling, { Options as QRCodeStylingOptions, Gradient as QRCodeStylingGradient } from "qr-code-styling";

import { NgIf, NgTemplateOutlet } from "@angular/common";
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { CopyToClipboardBase } from "app/base/copy-to-clipboard/copy-to-clipboard.base";
import { ChromeService } from "app/chrome.service";
import { WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";

@Component({
    imports: [NgIf, NgTemplateOutlet, TranslocoModule, RouterLink, ZelfLoaderComponent],
    selector: "receive-qr",
    styleUrls: ["./receive-qr.component.scss"],
    templateUrl: "./receive-qr.component.html",
})
export class ReceiveQrComponent extends CopyToClipboardBase implements OnInit, OnDestroy {
    @ViewChild("qrCodeContainer", { static: false }) qrCodeContainer!: ElementRef<HTMLElement>;

    private unsubscriber$: Subject<void> = new Subject<void>();

    address: string = "";
    loading: boolean = true;
    name: string = "";
    network: string = "";
    symbol: string = "";
    type: string = "";
    wallet: Partial<WalletModel> = {};

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
        this.wallet = (await this._walletService.getFirstWalletFromStorage()) || {};

        this._setNetwork();
        this._setQRCode();

        this.loading = false;
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    private _setNetwork(): void {
        if (!this.network) return;

        const network = this.network.toLowerCase();

        if (network === "ethereum") {
            this.address = this.wallet.ethAddress || "";
            this.name = "Ethereum";
            this.symbol = "ETH";
            this.type = "ERC-20";
        } else if (network === "avalanche") {
            this.address = this.wallet.ethAddress || "";
            this.name = "Avalanche";
            this.symbol = "AVAX";
            this.type = "ERC-20";
        } else if (network === "sui") {
            this.address = this.wallet.suiAddress || "";
            this.name = "Sui";
            this.symbol = "SUI";
        } else if (network === "solana") {
            this.address = this.wallet.solanaAddress || "";
            this.name = "Solana";
            this.symbol = "SOL";
            this.type = "SPL";
        } else if (network === "bitcoin") {
            this.address = this.wallet.btcAddress || "";
            this.name = "Bitcoin";
            this.symbol = "BTC";
        }
    }

    private _setQRCode(): void {
        if (!this.qrCodeContainer || !this.qrCodeContainer.nativeElement) return;

        this.qrCodeOptions.data = this.address;
        this.qrCodeOptions.image = this._walletService.getAssetImage(this.symbol);

        this.qrCode = new QRCodeStyling(this.qrCodeOptions);

        this.qrCode.append(this.qrCodeContainer.nativeElement);
    }

    public async copyToClipboard(): Promise<void> {
        this._copyToClipboard(this.address);
    }
}
