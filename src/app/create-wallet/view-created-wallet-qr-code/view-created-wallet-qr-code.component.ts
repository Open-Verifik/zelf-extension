import { Component, Input, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

import { TranslocoService } from "@ngneat/transloco";

import { CopyToClipboardBase } from "app/base/copy-to-clipboard/copy-to-clipboard.base";
import { ChromeService } from "app/chrome.service";
import { VaultService } from "app/vault.service";
import { Wallet, WalletModel } from "app/wallet";

@Component({
    selector: "view-created-wallet-qr-code",
    template: `
        <div fxLayout="row" fxLayoutAlign="center center" class="zelf-card">
            <div class="view-wallet" fxLayout="column" fxLayoutAlign="start center" *ngIf="wallet">
                <div class="view-wallet-left">
                    <div class="view-wallet-left-header">
                        <div class="view-wallet-title-div">
                            <h2 class="m-0 text-center">{{ "create_wallet.view_wallet.title" | transloco }}</h2>
                        </div>

                        <div class="view-wallet-description">
                            {{ "create_wallet.view_wallet.description" | transloco }}
                            <br /><br />
                            {{ "create_wallet.view_wallet.description_2" | transloco }}
                        </div>
                    </div>

                    <mnemonic [wallet]="wallet"></mnemonic>
                </div>

                <div class="view-wallet-right mt-4">
                    <div class="view-wallet-image-container">
                        <img class="view-wallet-image" [src]="wallet.image" />
                    </div>

                    <div class="view-wallet-qr-code-description">
                        {{ "create_wallet.view_wallet.qr_code_description" | transloco }}
                    </div>

                    <button
                        class="zelf-button zelf-button--outlined zelf-button--wide"
                        fxLayout="row"
                        fxLayoutAlign="center center"
                        (click)="downloadQRCode()"
                    >
                        <div class="view-wallet-icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-6 h-6"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                                />
                            </svg>
                        </div>

                        <div class="view-wallet-qr-code-label" fxLayout="row" fxLayoutAlign="center center">
                            {{ "create_wallet.view_wallet.download_qr_code" | transloco }}
                        </div>
                    </button>

                    <div class="view-wallet-continue-container" *ngIf="holdData">
                        <button mat-flat-button class="zelf-button zelf-button--black zelf-button--wide" (click)="goToPaymentsPage()">
                            {{ "payments.pay_now" | transloco }}
                        </button>
                    </div>

                    <div class="view-wallet-continue-container" *ngIf="!holdData">
                        <button mat-flat-button class="zelf-button zelf-button--black zelf-button--wide" (click)="goToInstructions()">
                            {{ "common.continue" | transloco }}
                        </button>
                    </div>
                </div>
                <span class="link" (click)="goToInstructions()" *ngIf="holdData"> {{ "payments.continue_withoutpaying" | transloco }} </span>
            </div>
        </div>
    `,
    styleUrls: ["./view-created-wallet-qr-code.component.scss", "../../main.scss"],
})
export class ViewCreatedWalletQrCodeComponent extends CopyToClipboardBase implements OnInit {
    @Input() walletType!: string;

    holdData: any;
    session: any;
    wallet!: Wallet;

    constructor(
        private _router: Router,
        private _vaultService: VaultService,
        protected _chromeService: ChromeService,
        protected _translocoService: TranslocoService,
        protected snackBar: MatSnackBar
    ) {
        super(_chromeService, snackBar, _translocoService);
    }

    async ngOnInit(): Promise<void> {
        const walletType = this.walletType || "wallet";
        const wallet = await this._chromeService.getItem(walletType);

        this.holdData = wallet.ipfs?.publicData?.type === "hold" ? wallet.ipfs?.publicData : null;
        this.wallet = new WalletModel(wallet);

        if (!this.wallet.ethAddress) {
            this._chromeService.removeItem(walletType);
            this._router.navigate(["/onboarding"]);

            return;
        }
    }

    ngOnDestroy(): void {
        this._vaultService.password = "";
    }

    goToInstructions(): void {
        this.wallet.metadata = null;

        this._chromeService.setItem("wallet", this.wallet);

        this._router.navigate(["extension-instructions"]);
    }

    downloadQRCode(): void {
        const link = document.createElement("a");

        link.href = this.wallet?.image as string;
        link.download = `zelfproof_${this.wallet?.publicData?.zelfName}.png`;
        link.click();
    }

    async goToPaymentsPage(): Promise<void> {
        const durationToken = await this._chromeService.getItem("durationToken");

        window.open(`https://payment.zelf.world/purchase?zelfName=${this.wallet.name}&durationToken=${durationToken}`, "_blank");

        this.goToInstructions();
    }
}
