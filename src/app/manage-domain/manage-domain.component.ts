import { CommonModule, NgIf } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { ActivatedRoute, Router, RouterLink, RouterModule } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";
import { Subject, takeUntil } from "rxjs";

import { MyArNSComponent } from "app/my-arns/my-arns.component";
import { AddressMaskPipe } from "app/pipes/address-mask.pipe";
import { TagModel, TagsService } from "app/tags.service";
import { WalletSeedPhraseSheetComponent } from "app/wallet/wallet-seed-phrase-sheet/wallet-seed-phrase-sheet.component";
import { Network, WalletService } from "app/wallet.service";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";
import { environment } from "environments/environment";

@Component({
    selector: "manage-domain",
    imports: [CommonModule, NgIf, MatButtonModule, TranslocoModule, RouterLink, RouterModule, ZelfLoaderComponent, AddressMaskPipe],
    templateUrl: "./manage-domain.component.html",
    styleUrls: ["./manage-domain.component.scss"],
})
export class ManageDomainComponent implements OnInit, OnDestroy {
    private unsubscriber$ = new Subject<void>();
    private _selectedZelfName: string = "";

    loading: boolean = false;
    wallet: Partial<TagModel> = {};
    wallets: TagModel[] = [];

    // Paridad con iOS y Android (#509): acciones, direcciones e informacion del Zelf ID.
    networks: Network[] = [];
    selectedTab: "addresses" | "info" = "addresses";
    isCurrentWallet: boolean = false;
    copiedAddress: string = "";

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _tagsService: TagsService,
        private _walletService: WalletService,
        private _bottomSheet: MatBottomSheet,
    ) {
        this._selectedZelfName = this._activatedRoute.snapshot.queryParams.zelfName;

        this._activatedRoute.queryParams.pipe(takeUntil(this.unsubscriber$)).subscribe((params) => {
            this._selectedZelfName = params.zelfName;
        });
    }

    ngOnInit(): void {
        this._setWallets().then(() => {
            this.loading = false;

            void this._loadWalletExtras();

            this._updateWallet();
        });
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    private async _setWallets(): Promise<void> {
        this.loading = true;

        const { wallet, wallets } = await this._walletService.getAllWalletsFromStorage();

        if (this._selectedZelfName) {
            const fromList = wallets.find((w) => w.tagName.toLowerCase() === this._selectedZelfName.toLowerCase());

            if (fromList && wallet && this._walletService.walletIdentityEquals(fromList, wallet)) {
                this.wallet = wallet;
            } else {
                this.wallet = fromList || wallet || ({} as TagModel);
            }
        } else {
            this.wallet = wallet || ({} as TagModel);
        }
    }

    private async _updateWallet(): Promise<void> {
        const updatedWallet = await this._tagsService.refreshTagPublicData(this.wallet as TagModel);

        if (!updatedWallet) return;

        this.wallet = updatedWallet;

        this._walletService.updateWallet(this.wallet as TagModel);

        void this._loadWalletExtras();
    }

    private async _loadWalletExtras(): Promise<void> {
        // Las direcciones salen del Zelf ID que se esta viendo, no de la wallet activa.
        this.networks = await this._walletService.getAvailableWalletNetworks(this.wallet);

        const current = await this._walletService.getCurrentWallet();

        // La frase semilla y el Zelf Link resuelven la wallet activa por dentro. Solo se
        // ofrecen cuando el Zelf ID que se esta viendo es justamente esa, para no mostrar
        // datos de otra cuenta.
        this.isCurrentWallet = !!current && !!this.wallet?.tagName && this._walletService.walletIdentityEquals(current, this.wallet);
    }

    selectTab(tab: "addresses" | "info"): void {
        this.selectedTab = tab;
    }

    downloadQRCode(): void {
        if (!this.wallet?.image) return;

        const link = document.createElement("a");

        link.href = this.wallet.image as string;

        link.download = `zelfproof_${this.wallet?.fullTagName}.png`;

        link.click();
    }

    openSeedPhraseSheet(): void {
        if (!this.isCurrentWallet) return;

        this._bottomSheet.open(WalletSeedPhraseSheetComponent, {
            backdropClass: "zelf-backdrop",
            panelClass: "zelf-bottom-sheet",
            data: { wallet: this.wallet },
        });
    }

    openZelfLinkSheet(): void {
        if (!this.isCurrentWallet) return;

        this._bottomSheet.open(MyArNSComponent, {
            backdropClass: "zelf-backdrop",
            panelClass: "zelf-bottom-sheet",
            data: { wallet: this.wallet },
        });
    }

    async copyAddress(event: Event, network: Network): Promise<void> {
        event.preventDefault();
        event.stopPropagation();

        if (!network?.address) return;

        await navigator.clipboard.writeText(network.address);

        this.copiedAddress = network.address;

        setTimeout(() => {
            if (this.copiedAddress === network.address) this.copiedAddress = "";
        }, 1500);
    }

    async extendRegistration(): Promise<void> {
        // Get tagName (just the name part, without domain)
        const tagName = (this.wallet as TagModel)?.tagName;

        // Get domain separately
        const domain = (this.wallet as TagModel)?.publicData?.domain;

        const duration = 1;

        this._router.navigate(["/external-link"], {
            queryParams: {
                externalUrl: `${environment.paymentDomainUrl}?tagname=${tagName}&domain=${domain}&duration=${duration}`,
            },
        });
    }

    getWalletStatus(): string {
        if (this.wallet?.publicData?.isExpired) return "expired";

        return this.wallet?.publicData?.type === "mainnet" ? "active" : "hold";
    }

    isExpired(): boolean {
        return !!this.wallet?.publicData?.isExpired;
    }
}
