import { CommonModule, NgFor, NgIf } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";
import { Subject, interval, takeUntil } from "rxjs";
import { debounce } from "lodash";
import { FooterComponent } from "app/footer/footer.component";
import { FirstLetterPipe } from "app/pipes/first-letter.pipe";
import { ZOTP } from "app/models/zotp.model";
import { ZOTPService } from "app/services/zotp.service";
import { TOTPService } from "app/services/totp.service";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";
import { AddZotpComponent } from "./add-zotp/add-zotp.component";
import { ZotpDetailsComponent, ZOTPDetailsData } from "./zotp-details/zotp-details.component";
import { UnlockZotpComponent, UnlockZOTPData } from "./unlock-zotp/unlock-zotp.component";

@Component({
    imports: [
        CommonModule,
        FirstLetterPipe,
        FlexLayoutModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        NgFor,
        NgIf,
        RouterLink,
        TranslocoModule,
        FooterComponent,
        ZelfLoaderComponent,
    ],
    selector: "zelf-authenticator",
    styleUrls: ["./zelf-authenticator.component.scss", "../main.scss"],
    templateUrl: "./zelf-authenticator.component.html",
})
export class ZelfAuthenticatorComponent implements OnInit, OnDestroy {
    private unsubscriber$ = new Subject<void>();
    private _searchDebounced: any;
    private _updateInterval$ = interval(1000); // Update every second
    private _codeCache: Map<string, string> = new Map(); // Cache of generated codes
    private _decryptedSecrets: Map<string, string> = new Map(); // In-memory cache of decrypted secrets (never persisted)

    loading: boolean = false;
    searchQuery: string = "";
    zotps: ZOTP[] = [];
    filteredZotps: ZOTP[] = [];
    currentTime: number = Math.floor(Date.now() / 1000);

    shareables: any = {
        view: "home",
    };

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _dialog: MatDialog,
        private _zotpService: ZOTPService,
        private _totpService: TOTPService
    ) {
        this._searchDebounced = debounce(this._performSearch.bind(this), 300);
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

            this.zotps = await this._zotpService.getAllZOTPs();

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

    private async _performSearch(): Promise<void> {
        if (!this.searchQuery.trim()) {
            this.filteredZotps = this.zotps;

            return;
        }

        this.filteredZotps = await this._zotpService.searchZOTPs(this.searchQuery);
        this._changeDetectorRef.detectChanges();
    }

    onSearchChange(): void {
        this._searchDebounced();
    }

    async addZOTP(): Promise<void> {
        const dialogRef = this._dialog.open(AddZotpComponent, {
            panelClass: "zelf-dialog",
            backdropClass: "zelf-backdrop",
            width: "90vw",
            maxWidth: "500px",
        });

        dialogRef.afterClosed().subscribe(async (result) => {
            if (result) {
                await this._loadZOTPs();
            }
        });
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
        await this._zotpService.deleteZOTP(zotp.id);
        await this._loadZOTPs();
    }

    async toggleDecrypt(zotp: ZOTP): Promise<void> {
        if (zotp.isDecrypted) {
            // Hide the code - clear from memory
            zotp.isDecrypted = false;
            zotp.decryptedSecret = undefined;
            this._decryptedSecrets.delete(zotp.id);
            this._codeCache.delete(zotp.id);
            this._changeDetectorRef.detectChanges();
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
            console.error("Cannot decrypt ZOTP: missing zelfProof");
            // TODO: Show error message to user
            return;
        }

        // Open unlock modal dialog
        const dialogRef = this._dialog.open(UnlockZotpComponent, {
            panelClass: "zelf-dialog",
            backdropClass: "zelf-backdrop",
            width: "90vw",
            maxWidth: "500px",
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
}
