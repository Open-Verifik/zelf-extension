import { CommonModule, NgClass, NgFor, NgIf } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { debounce } from "lodash";
import { distinctUntilChanged, filter, interval, map, skip, Subject, takeUntil } from "rxjs";

import { CopyToClipboardBase } from "app/base/copy-to-clipboard/copy-to-clipboard.base";
import { ChromeService } from "app/chrome.service";
import { AuthService } from "app/services/auth.service";
import { HomeHubHeaderComponent } from "app/home/home-hub-header/home-hub-header.component";
import { HomeProfilePanelComponent } from "app/home/home-profile-panel/home-profile-panel.component";
import { ZOTP } from "app/models/zotp.model";
import { FirstLetterPipe } from "app/pipes/first-letter.pipe";
import { TOTPService } from "app/services/totp.service";
import { ZOTPService } from "app/services/zotp.service";
import { TagModel } from "app/tags.service";
import { WalletService } from "app/wallet.service";
import { ZelfFooterComponent } from "app/zelf-footer/zelf-footer.component";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";
import { AddZotpComponent } from "./add-zotp/add-zotp.component";
import { DeleteZotpComponent, DeleteZOTPData } from "./delete-zotp/delete-zotp.component";
import { ExportZotpComponent, ExportZOTPData } from "./export-zotp/export-zotp.component";
import { RecoverZotpComponent, RecoverZOTPData } from "./recover-zotp/recover-zotp.component";
import { UnlockZotpComponent, UnlockZOTPData } from "./unlock-zotp/unlock-zotp.component";
import { ZotpDetailsComponent, ZOTPDetailsData } from "./zotp-details/zotp-details.component";

@Component({
    imports: [
        CommonModule,
        FirstLetterPipe,
        FlexLayoutModule,
        FormsModule,
        HomeHubHeaderComponent,
        HomeProfilePanelComponent,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatSnackBarModule,
        NgClass,
        NgFor,
        NgIf,
        TranslocoModule,
        ZelfFooterComponent,
        ZelfLoaderComponent,
    ],
    selector: "zelf-authenticator",
    styleUrls: ["./zelf-authenticator.component.scss", "../main.scss"],
    templateUrl: "./zelf-authenticator.component.html",
})
export class ZelfAuthenticatorComponent extends CopyToClipboardBase implements OnInit, OnDestroy {
    private unsubscriber$ = new Subject<void>();
    private _searchDebounced: any;
    private _updateInterval$ = interval(1000);
    private _codeCache: Map<string, string> = new Map();
    private _decryptedSecrets: Map<string, string> = new Map();

    currentTime: number = Math.floor(Date.now() / 1000);
    filteredZotps: ZOTP[] = [];
    loading: boolean = false;
    searchQuery: string = "";
    zotps: ZOTP[] = [];

    shareables: any = {
        view: "home",
        wallet: {} as Partial<TagModel>,
    };

    wallet: Partial<TagModel> = {};
    showProfilePanel = false;
    allWallets: TagModel[] = [];
    showName = false;

    constructor(
        private _authService: AuthService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _dialog: MatDialog,
        private _router: Router,
        private _totpService: TOTPService,
        private _walletService: WalletService,
        private _zotpService: ZOTPService,
        protected _chromeService: ChromeService,
        protected _snackBar: MatSnackBar,
        protected _translocoService: TranslocoService
    ) {
        super(_chromeService, _snackBar, _translocoService);

        this._searchDebounced = debounce(this._performSearch.bind(this), 300);

        this._initWallet();
        this._initSubscriptions();
    }

    async ngOnInit(): Promise<void> {
        await this._reloadZotps(false);

        this._updateInterval$.pipe(takeUntil(this.unsubscriber$)).subscribe(async () => {
            this.currentTime = Math.floor(Date.now() / 1000);

            await this._updateCodeCache();

            this._changeDetectorRef.detectChanges();
        });
    }

    ngOnDestroy(): void {
        this._decryptedSecrets.clear();
        this._codeCache.clear();

        this.zotps.forEach((zotp) => {
            zotp.isDecrypted = false;
            zotp.decryptedSecret = undefined;
        });

        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    private _initWallet(): void {
        this._walletService.getCurrentWallet().then((wallet: Partial<TagModel> | null) => {
            if (!wallet) return;

            this.wallet = wallet;
            this.shareables.wallet = wallet;
        });
    }

    private _initSubscriptions(): void {
        this._chromeService.onWalletChanged$
            .pipe(
                map((w) => w?.fullTagName ?? ""),
                distinctUntilChanged(),
                filter((tag) => !!tag),
                skip(1),
                takeUntil(this.unsubscriber$)
            )
            .subscribe((fullTagName) => {
                void this._reloadZotpsForWalletSwitch(fullTagName);
            });
    }

    private async _reloadZotpsForWalletSwitch(fullTagName: string): Promise<void> {
        console.log(`[zAuth] reload for ${fullTagName}`);

        const wallet = await this._walletService.getCurrentWallet();
        if (wallet) this.shareables.wallet = wallet;

        this._decryptedSecrets.clear();
        this._codeCache.clear();
        this._zotpService.clearCache();

        try {
            await this._authService.reauthenticateSession();
        } catch (error) {
            console.error("[zAuth] session reauth failed:", error);
        }

        await this._reloadZotps(true);
    }

    private async _reloadZotps(forceRefresh: boolean): Promise<void> {
        this.loading = true;

        try {
            this._decryptedSecrets.clear();
            this._codeCache.clear();

            this.zotps = forceRefresh
                ? await this._zotpService.loadZOTPsFromBackend(true)
                : await this._zotpService.loadZOTPsFromBackend(false);

            this.zotps.forEach((zotp) => {
                zotp.isDecrypted = false;
                zotp.decryptedSecret = undefined;
            });

            if (this.searchQuery.trim()) {
                const lowerQuery = this.searchQuery.toLowerCase().trim();

                this.filteredZotps = this.zotps.filter((zotp) => {
                    const nameMatch = zotp.name.toLowerCase().includes(lowerQuery);
                    const issuerMatch = zotp.issuer?.toLowerCase().includes(lowerQuery);
                    return nameMatch || issuerMatch;
                });
            } else {
                this.filteredZotps = this.zotps;
            }

            await this._updateCodeCache();
        } catch (error) {
            console.error("Error loading ZOTPs:", error);
        } finally {
            this.loading = false;
            this._changeDetectorRef.detectChanges();
        }
    }

    private _performSearch(): void {
        if (!this.searchQuery.trim()) {
            this.filteredZotps = this.zotps;

            return;
        }

        const lowerQuery = this.searchQuery.toLowerCase().trim();

        this.filteredZotps = this.zotps.filter((zotp) => {
            const nameMatch = zotp.name.toLowerCase().includes(lowerQuery);
            const issuerMatch = zotp.issuer?.toLowerCase().includes(lowerQuery);

            return nameMatch || issuerMatch;
        });

        this._changeDetectorRef.detectChanges();
    }

    onSearchChange(): void {
        this._searchDebounced();
    }

    async showDetails(zotp: ZOTP): Promise<void> {
        const dialogRef = this._dialog.open(ZotpDetailsComponent, {
            panelClass: "zelf-dialog",
            backdropClass: "zelf-backdrop",
            width: "90vw",
            maxWidth: "600px",
            disableClose: true,
            data: {
                zotp: zotp,
            } as ZOTPDetailsData,
        });

        dialogRef.afterClosed().subscribe();
    }

    async deleteZOTP(zotp: ZOTP): Promise<void> {
        const dialogRef = this._dialog.open(DeleteZotpComponent, {
            panelClass: "zelf-dialog",
            backdropClass: "zelf-backdrop",
            width: "90vw",
            maxWidth: "500px",
            disableClose: true,
            data: {
                zotp: zotp,
            } as DeleteZOTPData,
        });

        dialogRef.afterClosed().subscribe(async (result) => {
            if (!result) return;

            this.zotps = await this._zotpService.clearCacheAndRefresh();

            this.zotps.forEach((z) => {
                z.isDecrypted = false;
                z.decryptedSecret = undefined;
            });

            this.filteredZotps = this.zotps;

            await this._updateCodeCache();

            this._changeDetectorRef.detectChanges();
        });
    }

    async exportZOTP(zotp: ZOTP): Promise<void> {
        if (!zotp.zelfProof) {
            this._snackBar.open(
                this._translocoService.translate("errors.cannot_decrypt_zotp_missing_zelfProof"),
                this._translocoService.translate("common.close"),
                { duration: 3000 }
            );

            return;
        }

        const dialogRef = this._dialog.open(ExportZotpComponent, {
            panelClass: "zelf-dialog",
            backdropClass: "zelf-backdrop",
            width: "90vw",
            maxWidth: "90vw",
            minWidth: "320px",
            disableClose: true,
            data: {
                zotp: zotp,
            } as ExportZOTPData,
        });

        dialogRef.afterClosed().subscribe();
    }

    openAddZotp(): void {
        const dialogRef = this._dialog.open(AddZotpComponent, {
            backdropClass: "zelf-backdrop",
            maxWidth: "500px",
            panelClass: "zelf-dialog",
            width: "90vw",
        });

        dialogRef.afterClosed().subscribe((added: boolean | undefined) => {
            if (added) void this.refreshList();
        });
    }

    async recoverZOTP(): Promise<void> {
        const dialogRef = this._dialog.open(RecoverZotpComponent, {
            panelClass: "zelf-dialog",
            backdropClass: "zelf-backdrop",
            width: "90vw",
            maxWidth: "600px",
            minWidth: "320px",
            disableClose: true,
            data: {} as RecoverZOTPData,
        });

        dialogRef.afterClosed().subscribe(async (recoveredZOTP: Partial<ZOTP> | null) => {
            if (!recoveredZOTP) return;

            await this.refreshList();

            this._changeDetectorRef.detectChanges();
        });
    }

    async toggleDecrypt(zotp: ZOTP): Promise<void> {
        if (zotp.isDecrypted) {
            const code = this._codeCache.get(zotp.id);

            if (code) {
                const codeToCopy = code.replace(/\s/g, "");

                await this._copyToClipboard(codeToCopy);
            }

            return;
        }

        if (this._decryptedSecrets.has(zotp.id)) {
            zotp.isDecrypted = true;
            zotp.decryptedSecret = this._decryptedSecrets.get(zotp.id);

            await this._updateCodeCache();

            this._changeDetectorRef.detectChanges();

            return;
        }

        if (!zotp.zelfProof) {
            this._snackBar.open(
                this._translocoService.translate("errors.cannot_decrypt_zotp_missing_zelfProof"),
                this._translocoService.translate("common.close"),
                { duration: 3000 }
            );

            return;
        }

        const dialogRef = this._dialog.open(UnlockZotpComponent, {
            panelClass: "zelf-dialog",
            backdropClass: "zelf-backdrop",
            width: "min(460px, 92vw)",
            maxWidth: "92vw",
            maxHeight: "calc(100vh - 48px)",
            minWidth: "320px",
            disableClose: true,
            data: {
                zotp: zotp,
            } as UnlockZOTPData,
        });

        dialogRef.afterClosed().subscribe(async (encryptedImage: string | false) => {
            if (!encryptedImage) return;

            this.loading = true;

            try {
                const secret = await this._zotpService.retrieveZOTPSecret(zotp, encryptedImage);

                if (!secret) throw new Error("Failed to retrieve ZOTP secret");

                this._decryptedSecrets.set(zotp.id, secret);

                zotp.isDecrypted = true;
                zotp.decryptedSecret = secret;

                await this._updateCodeCache();
            } catch (error) {
                console.error("Error decrypting ZOTP:", error);
            } finally {
                this.loading = false;
                this._changeDetectorRef.detectChanges();
            }
        });
    }

    hideSecret(zotp: ZOTP): void {
        zotp.isDecrypted = false;
        zotp.decryptedSecret = undefined;

        this._decryptedSecrets.delete(zotp.id);
        this._codeCache.delete(zotp.id);
        this._changeDetectorRef.detectChanges();
    }

    private async _updateCodeCache(): Promise<void> {
        const updatePromises = this.filteredZotps
            .filter((zotp) => zotp.isDecrypted && zotp.decryptedSecret)
            .map(async (zotp) => {
                try {
                    const secret = this._decryptedSecrets.get(zotp.id) || zotp.decryptedSecret;

                    if (!secret) return;

                    const period = zotp.period || 30;
                    const digits = zotp.digits || 6;
                    const algorithm = zotp.algorithm || "SHA1";

                    const code = await this._totpService.generate(secret, period, digits, algorithm);

                    const formattedCode = code.length === 6 ? `${code.substring(0, 3)} ${code.substring(3)}` : code;

                    this._codeCache.set(zotp.id, formattedCode);
                } catch (error) {
                    console.error("Error generating TOTP code:", error);
                    this._codeCache.set(zotp.id, "ERROR");
                }
            });

        await Promise.all(updatePromises);
    }

    getDisplayCode(zotp: ZOTP): string {
        if (!zotp.isDecrypted || !zotp.decryptedSecret) return "* * * * * *";

        if (this._codeCache.has(zotp.id)) return this._codeCache.get(zotp.id)!;

        this._updateCodeCache();

        return "...";
    }

    getTimeRemaining(zotp: ZOTP): number {
        if (!zotp.isDecrypted) return 0;

        const period = zotp.period || 30;
        const remaining = period - (this.currentTime % period);

        return remaining;
    }

    get walletName(): string {
        return (this.wallet?.fullTagName || this.wallet?.publicData?.tagName || "") as string;
    }

    async refreshList(): Promise<void> {
        await this._reloadZotps(true);
    }

    toggleName(): void {
        this.showName = !this.showName;
    }

    async openProfilePanel(): Promise<void> {
        const { wallets } = await this._walletService.getAllWalletsFromStorage();
        this.allWallets = wallets;
        this.showProfilePanel = true;
        this._changeDetectorRef.detectChanges();
    }

    closeProfilePanel(): void {
        this.showProfilePanel = false;
    }

    async onPanelWalletSelected(selectedWallet: TagModel): Promise<void> {
        this.closeProfilePanel();
        await this._walletService.switchWallet(selectedWallet);
    }

    onPanelSettings(): void {
        this.closeProfilePanel();
        void this._router.navigate(["/settings"], { state: { fromZAuthScreen: true } });
    }

    onPanelAddAccount(): void {
        this.closeProfilePanel();
        void this._router.navigate(["/wallet-manage"], { state: { fromZAuthScreen: true } });
    }
}
