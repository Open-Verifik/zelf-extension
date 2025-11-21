import { CommonModule, NgClass, NgFor, NgIf } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { debounce } from "lodash";
import { interval, Subject, takeUntil } from "rxjs";

import { CopyToClipboardBase } from "app/base/copy-to-clipboard/copy-to-clipboard.base";
import { ChromeService } from "app/chrome.service";
import { HomeHeaderComponent } from "app/home/home-header/home-header.component";
import { ZOTP } from "app/models/zotp.model";
import { FirstLetterPipe } from "app/pipes/first-letter.pipe";
import { TOTPService } from "app/services/totp.service";
import { ZOTPService } from "app/services/zotp.service";
import { TagModel } from "app/tags.service";
import { WalletService } from "app/wallet.service";
import { ZelfFooterComponent } from "app/zelf-footer/zelf-footer.component";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";
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
        HomeHeaderComponent,
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
    private _updateInterval$ = interval(1000); // Update every second
    private _codeCache: Map<string, string> = new Map(); // Cache of generated codes
    private _decryptedSecrets: Map<string, string> = new Map(); // In-memory cache of decrypted secrets (never persisted)

    currentTime: number = Math.floor(Date.now() / 1000);
    filteredZotps: ZOTP[] = [];
    loading: boolean = false;
    searchQuery: string = "";
    zotps: ZOTP[] = [];

    shareables: any = {
        view: "home",
        wallet: {} as Partial<TagModel>,
    };

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _dialog: MatDialog,
        private _totpService: TOTPService,
        private _walletService: WalletService,
        private _zotpService: ZOTPService,
        protected _chromeService: ChromeService,
        protected _snackBar: MatSnackBar,
        protected _translocoService: TranslocoService
    ) {
        super(_chromeService, _snackBar, _translocoService);

        this._searchDebounced = debounce(this._performSearch.bind(this), 300);

        this._chromeService.onWalletChanged$.pipe(takeUntil(this.unsubscriber$)).subscribe((wallet) => {
            if (!wallet) return;

            this.shareables.wallet = wallet;
        });

        this._walletService.getCurrentWallet().then((wallet: Partial<TagModel> | null) => {
            if (!wallet) return;

            this.shareables.wallet = wallet;
        });
    }

    async ngOnInit(): Promise<void> {
        await this._loadZOTPs();

        // Update time every second to refresh codes and timers
        this._updateInterval$.pipe(takeUntil(this.unsubscriber$)).subscribe(async () => {
            this.currentTime = Math.floor(Date.now() / 1000);
            // Update cached codes for decrypted ZOTPs
            await this._updateCodeCache();
            this._changeDetectorRef.detectChanges();
        });
    }

    ngOnDestroy(): void {
        // Clear all decrypted secrets from memory when component is destroyed
        this._decryptedSecrets.clear();
        this._codeCache.clear();

        // Clear decrypted secrets from all ZOTPs
        this.zotps.forEach((zotp) => {
            zotp.isDecrypted = false;
            zotp.decryptedSecret = undefined;
        });

        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    private async _loadZOTPs(): Promise<void> {
        this.loading = true;

        try {
            // Clear any decrypted secrets from memory when loading (coming back to screen)
            this._decryptedSecrets.clear();
            this._codeCache.clear();

            // Load ZOTPs from backend (uses cache internally)
            this.zotps = await this._zotpService.loadZOTPsFromBackend();

            // Ensure all ZOTPs are marked as not decrypted (secrets are not persisted)
            this.zotps.forEach((zotp) => {
                zotp.isDecrypted = false;
                zotp.decryptedSecret = undefined;
            });

            this.filteredZotps = this.zotps;
            // Initialize code cache for decrypted ZOTPs (will be empty since we cleared decrypted state)
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

        // Local search - filter by name and issuer
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
            data: {
                zotp: zotp,
            } as ZOTPDetailsData,
        });

        dialogRef.afterClosed().subscribe(() => {
            // Modal closed, no action needed
        });
    }

    async deleteZOTP(zotp: ZOTP): Promise<void> {
        const dialogRef = this._dialog.open(DeleteZotpComponent, {
            panelClass: "zelf-dialog",
            backdropClass: "zelf-backdrop",
            width: "90vw",
            maxWidth: "500px",
            data: {
                zotp: zotp,
            } as DeleteZOTPData,
        });

        dialogRef.afterClosed().subscribe(async (result) => {
            if (result) {
                // ZOTP was successfully deleted - clear cache and refresh
                this.zotps = await this._zotpService.clearCacheAndRefresh();
                // Ensure all ZOTPs are marked as not decrypted
                this.zotps.forEach((z) => {
                    z.isDecrypted = false;
                    z.decryptedSecret = undefined;
                });
                this.filteredZotps = this.zotps;
                await this._updateCodeCache();
                this._changeDetectorRef.detectChanges();
            }
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
            data: {
                zotp: zotp,
            } as ExportZOTPData,
        });

        dialogRef.afterClosed().subscribe(() => {
            // Modal closed, no action needed
        });
    }

    async recoverZOTP(): Promise<void> {
        const dialogRef = this._dialog.open(RecoverZotpComponent, {
            panelClass: "zelf-dialog",
            backdropClass: "zelf-backdrop",
            width: "90vw",
            maxWidth: "600px",
            minWidth: "320px",
            data: {} as RecoverZOTPData,
        });

        dialogRef.afterClosed().subscribe(async (recoveredZOTP: Partial<ZOTP> | null) => {
            if (recoveredZOTP) {
                // ZOTP was recovered - refresh the listx
                // Note: The recovered ZOTP needs to be added to the list
                // For now, we'll refresh to show any changes
                await this.refreshList();
                this._changeDetectorRef.detectChanges();
            }
        });
    }

    async toggleDecrypt(zotp: ZOTP): Promise<void> {
        // If already decrypted, copy the code instead of hiding it
        if (zotp.isDecrypted) {
            const code = this._codeCache.get(zotp.id);
            if (code) {
                // Remove spaces for copying (format: "XXX XXX" -> "XXXXXX")
                const codeToCopy = code.replace(/\s/g, "");
                await this._copyToClipboard(codeToCopy);
            }
            return;
        }

        // Check if we already have the decrypted secret in memory
        if (this._decryptedSecrets.has(zotp.id)) {
            zotp.isDecrypted = true;
            zotp.decryptedSecret = this._decryptedSecrets.get(zotp.id);
            await this._updateCodeCache();
            this._changeDetectorRef.detectChanges();
            return;
        }

        // Need to retrieve from backend - show biometrics modal
        if (!zotp.zelfProof) {
            this._snackBar.open(
                this._translocoService.translate("errors.cannot_decrypt_zotp_missing_zelfProof"),
                this._translocoService.translate("common.close"),
                { duration: 3000 }
            );
            return;
        }

        // Open unlock modal dialog
        const dialogRef = this._dialog.open(UnlockZotpComponent, {
            panelClass: "zelf-dialog",
            backdropClass: "zelf-backdrop",
            width: "90vw",
            maxWidth: "90vw",
            minWidth: "320px",
            data: {
                zotp: zotp,
            } as UnlockZOTPData,
        });

        dialogRef.afterClosed().subscribe(async (encryptedImage: string | false) => {
            if (!encryptedImage) {
                // User cancelled or biometrics failed
                return;
            }

            // User successfully scanned face - retrieve secret
            this.loading = true;

            try {
                // Retrieve decrypted secret from backend
                const secret = await this._zotpService.retrieveZOTPSecret(zotp, encryptedImage);

                if (!secret) {
                    throw new Error("Failed to retrieve ZOTP secret");
                }

                // Store decrypted secret in memory only (never persist)
                this._decryptedSecrets.set(zotp.id, secret);
                zotp.isDecrypted = true;
                zotp.decryptedSecret = secret;

                // Generate code immediately
                await this._updateCodeCache();
            } catch (error) {
                console.error("Error decrypting ZOTP:", error);
                // TODO: Show error message to user
            } finally {
                this.loading = false;
                this._changeDetectorRef.detectChanges();
            }
        });
    }

    hideSecret(zotp: ZOTP): void {
        // Hide the code - clear from memory
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
                    // Get decrypted secret from memory cache
                    const secret = this._decryptedSecrets.get(zotp.id) || zotp.decryptedSecret;

                    if (!secret) {
                        return;
                    }

                    const period = zotp.period || 30;
                    const digits = zotp.digits || 6;
                    const algorithm = zotp.algorithm || "SHA1";

                    const code = await this._totpService.generate(secret, period, digits, algorithm);

                    // Format as "XXX XXX" (3 digits, space, 3 digits)
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
        if (!zotp.isDecrypted || !zotp.decryptedSecret) {
            return "* * * * * *";
        }

        // Return cached code or generate synchronously on first call
        if (this._codeCache.has(zotp.id)) {
            return this._codeCache.get(zotp.id)!;
        }

        // If not in cache, trigger async update and return placeholder
        this._updateCodeCache();

        return "...";
    }

    getTimeRemaining(zotp: ZOTP): number {
        if (!zotp.isDecrypted) {
            return 0;
        }

        const period = zotp.period || 30;
        const remaining = period - (this.currentTime % period);

        return remaining;
    }

    async refreshList(): Promise<void> {
        this.loading = true;

        try {
            this.zotps = await this._zotpService.clearCacheAndRefresh();

            this.zotps.forEach((zotp) => {
                zotp.isDecrypted = false;
                zotp.decryptedSecret = undefined;
            });

            // Update filtered list based on current search query (local search)
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
            console.error("Error refreshing ZOTP list:", error);
        } finally {
            this.loading = false;
            this._changeDetectorRef.detectChanges();
        }
    }
}
