import { SelectionModel } from "@angular/cdk/collections";
import { NgClass, NgFor, NgIf, NgTemplateOutlet } from "@angular/common";
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";
import { filter, Subject, takeUntil } from "rxjs";

import { ChromeService } from "app/chrome.service";
import { FirstLetterPipe } from "app/pipes/first-letter.pipe";
import { TagModel } from "app/tags.service";
import { WalletService } from "app/wallet.service";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";

@Component({
    imports: [NgClass, NgTemplateOutlet, NgIf, MatButtonModule, TranslocoModule, NgFor, RouterLink, FirstLetterPipe, ZelfLoaderComponent],
    selector: "home-header-accounts",
    styleUrls: ["./home-header-accounts.component.scss"],
    templateUrl: "./home-header-accounts.component.html",
})
export class HomeHeaderAccountsComponent implements OnInit, OnDestroy {
    private _destroy$: Subject<void> = new Subject<void>();

    currentRoute: string = "";
    currentWalletTagName: string = "";
    isZelfLinkActive: boolean = false;
    isZelfKeysLoading: boolean = false;
    loaded: boolean = false;
    selectionModel = new SelectionModel<string>(false);
    shareables: any;
    wallet: Partial<TagModel> = {};
    wallets: TagModel[] = [];

    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
        private _bottomSheetRef: MatBottomSheetRef<HomeHeaderAccountsComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _chromeService: ChromeService,
        private _router: Router,
        private _walletService: WalletService
    ) {
        this.shareables = data;
        this.loaded = false;
    }

    async ngOnInit(): Promise<void> {
        await this._initWallets();

        this._initRouteTracking();
        this._initWalletTracking();

        await this._updateCurrentRoute();
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();

        this.wallets = [];
        this.loaded = false;
    }

    private async _initWallets(): Promise<void> {
        const { wallet, wallets } = await this._walletService.getAllWalletsFromStorage();

        this.wallet = wallet || {};
        this.currentWalletTagName = wallet?.fullTagName || "";

        const currentWalletTagName = wallet?.fullTagName;

        this.wallets = currentWalletTagName ? wallets.filter((w) => w.fullTagName !== currentWalletTagName) : wallets;

        this.toggleWalletMenu(this.currentWalletTagName || "");

        this.loaded = true;
    }

    private _initRouteTracking(): void {
        this._router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntil(this._destroy$)
            )
            .subscribe(async () => {
                await this._updateCurrentRoute();

                this._changeDetectorRef.detectChanges();
            });
    }

    private _initWalletTracking(): void {
        this._chromeService.onWalletChanged$.pipe(takeUntil(this._destroy$)).subscribe(async (wallet) => {
            if (!wallet?.fullTagName) return;

            this.currentWalletTagName = wallet.fullTagName;

            await this._updateActiveStates();

            this._changeDetectorRef.detectChanges();
        });
    }

    private async _updateCurrentRoute(): Promise<void> {
        this.currentRoute = this._router.url.split("?")[0];

        await this._updateActiveStates();
        await this._updateCurrentWallet();
    }

    private async _updateCurrentWallet(): Promise<void> {
        const { wallet } = await this._walletService.getAllWalletsFromStorage();

        this.currentWalletTagName = wallet?.fullTagName || "";
    }

    private async _updateActiveStates(): Promise<void> {
        if (this.isRouteActive("/wallet")) {
            const parameters = await this._chromeService.getItem("parameters");

            this.isZelfLinkActive = parameters?.openMyArnsBottomSheet === true;
        } else {
            this.isZelfLinkActive = false;
        }
    }

    close(): void {
        this._bottomSheetRef.dismiss();
    }

    closeAllMenus(): void {
        this.selectionModel.clear();
    }

    isWalletMenuOpen(walletId: string): boolean {
        return this.selectionModel.isSelected(walletId);
    }

    async navigateToDownloadQR(selectedWallet: TagModel): Promise<void> {
        if (this.isZelfKeysLoading) return;

        await this._walletService.switchWallet(selectedWallet);

        await this._router.navigate(["/wallet"]);

        this.close();
    }

    async navigateToSeedPhrase(selectedWallet: TagModel): Promise<void> {
        if (this.isZelfKeysLoading) return;

        await this._walletService.switchWallet(selectedWallet);

        await this._router.navigate(["/wallet"]);

        this.close();
    }

    async navigateToWallet(selectedWallet: TagModel): Promise<void> {
        if (this.isZelfKeysLoading) return;

        await this._walletService.switchWallet(selectedWallet);

        await this._router.navigate(["/home"]);

        this.close();
    }

    async navigateToZelfLink(selectedWallet: TagModel): Promise<void> {
        if (this.isZelfKeysLoading) return;

        await this._walletService.switchWallet(selectedWallet);
        await this._chromeService.setItem("parameters", { openMyArnsBottomSheet: true });

        await this._router.navigate(["/wallet"]);

        this.close();
    }

    async navigateToZelfKeys(selectedWallet: TagModel): Promise<void> {
        if (this.isZelfKeysLoading) return;

        this.isZelfKeysLoading = true;

        await this._walletService.switchWallet(selectedWallet);

        const navigating = this._router.navigate(["/zelf-keys"]);

        navigating
            .then(() => {
                this.close();
            })
            .finally(() => {
                this.isZelfKeysLoading = false;
            });
    }

    async navigateToZelfAuthenticator(selectedWallet: TagModel): Promise<void> {
        if (this.isZelfKeysLoading) return;

        await this._walletService.switchWallet(selectedWallet);

        await this._router.navigate(["/zelf-authenticator"]);

        this.close();
    }

    async switchWallet(selectedWallet: TagModel): Promise<void> {
        await this._walletService.switchWallet(selectedWallet);

        this.close();
    }

    toggleWalletMenu(walletFullTagName: string): void {
        if (this.selectionModel.isSelected(walletFullTagName)) {
            this.selectionModel.deselect(walletFullTagName);
        } else {
            this.selectionModel.clear();
            this.selectionModel.select(walletFullTagName);
        }
    }

    isRouteActive(route: string): boolean {
        return this.currentRoute === route || this.currentRoute.startsWith(route + "/");
    }

    isWalletActive(walletTagName: string | undefined): boolean {
        if (!walletTagName) return false;

        return walletTagName === this.currentWalletTagName;
    }

    isDownloadQRActive(walletTagName?: string): boolean {
        if (!this.isRouteActive("/wallet")) return false;

        if (walletTagName && !this.isWalletActive(walletTagName)) return false;

        return !this.isZelfLinkActive;
    }

    isSeedPhraseActiveForWallet(walletTagName?: string): boolean {
        return this.isDownloadQRActive(walletTagName);
    }

    isZelfLinkActiveForWallet(walletTagName?: string): boolean {
        if (!this.isRouteActive("/wallet")) return false;

        if (walletTagName && !this.isWalletActive(walletTagName)) return false;

        return this.isZelfLinkActive;
    }

    isRouteActiveForWallet(route: string, walletTagName?: string): boolean {
        if (!this.isRouteActive(route)) return false;

        if (walletTagName && !this.isWalletActive(walletTagName)) return false;

        return true;
    }
}
