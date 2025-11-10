import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { Subject } from "rxjs";

import { CopyToClipboardBase } from "app/base/copy-to-clipboard/copy-to-clipboard.base";
import { ZelfKeysService } from "app/services/zelf-keys.service";
import { ChromeService } from "../../../chrome.service";
import { AutofillIntegrationService } from "../../../services/autofill-integration.service";
import { PasswordDataService } from "../../../services/password-data.service";
import { ScrollToSectionService } from "../../../services/scroll-to-section.service";
import {
    BiometricResult,
    BiometricsBottomSheetComponent,
    BiometricsBottomSheetData,
} from "../../shared/biometrics-bottom-sheet/biometrics-bottom-sheet.component";

@Component({
    imports: [CommonModule, TranslocoModule, RouterModule],
    selector: "zelf-keys-password-detail",
    styleUrls: ["./zelf-keys-password-detail.component.scss"],
    templateUrl: "./zelf-keys-password-detail.component.html",
})
export class ZelfKeysPasswordDetailComponent extends CopyToClipboardBase implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    decryptedData: any = null;
    decrypting = false;
    error: string | null = null;
    loading = false;
    password: any = null;
    showBiometrics = false;
    showPassword = false;

    constructor(
        private _autofillIntegrationService: AutofillIntegrationService,
        private _bottomSheet: MatBottomSheet,
        private _passwordDataService: PasswordDataService,
        private _router: Router,
        private _scrollToSectionService: ScrollToSectionService,
        private _zelfKeysService: ZelfKeysService,
        public _chromeService: ChromeService,
        public _snackBar: MatSnackBar,
        public _translocoService: TranslocoService
    ) {
        super(_chromeService, _snackBar, _translocoService);
    }

    async ngOnInit(): Promise<void> {
        this.loadPasswordData();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    async loadPasswordData(): Promise<void> {
        this.loading = true;
        this.error = null;

        try {
            // Get password data from the service
            const passwordData = this._passwordDataService.getCurrentPassword();

            if (!passwordData) {
                this.error = this._translocoService.translate("zelf_keys.passwords.detail.error.not_found");
                return;
            }

            this.password = passwordData;
        } catch (error) {
            this.error = this._translocoService.translate("zelf_keys.passwords.detail.error.load_failed");
        } finally {
            this.loading = false;
        }
    }

    onDecryptClick(prefill: boolean = false): void {
        if (this.decryptedData) {
            if (prefill) {
                this.prefillWebsite();
            } else {
                this._scrollToSectionService.scrollToSection("password-decrypted-content", "password");
            }

            return;
        }

        const bottomSheetRef = this._bottomSheet.open(BiometricsBottomSheetComponent, {
            backdropClass: "zelf-backdrop",
            panelClass: "zelf-bottom-sheet-biometrics",
            data: {
                itemData: this.password,
                itemType: "password",
                mode: "decrypt",
            } as BiometricsBottomSheetData,
        });

        bottomSheetRef.afterDismissed().subscribe((result: BiometricResult | undefined) => {
            if (!result) return;

            const decryptedItem = result.retrievedData;

            if (!decryptedItem) return;

            // Handle the actual response structure:
            // - username and password are in metadata (decrypted)
            // - website, timestamp, category, type are in publicData
            // - publicData.username may also exist as a fallback
            this.decryptedData = {
                category: decryptedItem.publicData?.category,
                difficulty: decryptedItem.difficulty,
                password: decryptedItem.metadata?.password || "",
                timestamp: decryptedItem.publicData?.timestamp,
                type: (decryptedItem.publicData as any)?.type,
                username: decryptedItem.metadata?.username || (decryptedItem.publicData as any)?.username || "",
                website: (decryptedItem.publicData as any)?.website || "",
                zelfName: decryptedItem.publicData?.zelfName,
            };

            if (prefill) {
                this.prefillWebsite();
            } else {
                this._scrollToSectionService.scrollToSection("password-decrypted-content", "password");
            }
        });
    }

    async decryptPassword(biometricData: any): Promise<void> {
        this.decrypting = true;
        this.error = null;

        try {
            const payload = {
                faceBase64: biometricData.faceBase64,
                password: biometricData.password || undefined, // Optional
                zelfProof: this.password.publicData.zelfProof,
            };

            const response = await this._zelfKeysService.retrievePassword(payload.faceBase64, payload.password, payload.zelfProof);

            if (response?.data?.metadata) {
                // Handle the actual response structure:
                // - username and password are in metadata (decrypted)
                // - website, timestamp, category, type are in publicData
                this.decryptedData = {
                    password: response.data.metadata?.password || "",
                    username: response.data.metadata?.username || response.data.publicData?.username || "",
                    category: response.data.publicData?.category,
                    difficulty: response.data.difficulty,
                    timestamp: response.data.publicData?.timestamp,
                    type: response.data.publicData?.type,
                    website: response.data.publicData?.website || "",
                    zelfName: response.data.publicData?.zelfName,
                };

                this.showBiometrics = false;
            } else {
                throw new Error("Failed to decrypt password data");
            }
        } catch (error) {
            console.error("Error decrypting password:", error);

            this.error = this._translocoService.translate("zelf_keys.passwords.detail.error.decrypt_failed");
        } finally {
            this.decrypting = false;
        }
    }

    onBackToList(): void {
        this._passwordDataService.clearCurrentPassword();

        this._router.navigate(["/zelf-keys/passwords"]);
    }

    onCopyPassword(): void {
        if (!this.decryptedData?.password) return;

        this._copyToClipboard(this.decryptedData.password);
    }

    onTogglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }

    onCopyWebsite(): void {
        if (!this.decryptedData?.website) return;

        this._copyToClipboard(this.decryptedData.website);
    }

    onImageError(event: Event): void {
        const img = event.target as HTMLImageElement;

        img.style.display = "none";

        const container = img.parentElement;

        if (container)
            container.innerHTML = `<div class="password-detail__image-error">${this._translocoService.translate("zelf_keys.common.image_not_available")}</div>`;
    }

    onDownloadZelfProof(): void {
        if (!this.password?.url) return;

        const link = document.createElement("a");

        link.href = this.password.url;
        link.download = `zelfproof-${this.password.publicData?.website || "password"}.png`;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    }

    getWebsiteHostname(website: string): string {
        if (!website) return "";

        try {
            const url = new URL(website);
            return url.hostname;
        } catch (error) {
            return website;
        }
    }

    getCategory(): string | null {
        const category = this.password?.publicData?.category;
        return ZelfKeysService.parseCategory(category);
    }

    getCategoryTranslationKey(): string | null {
        const category = this.getCategory();
        return category ? `zelf_keys.categories.${category}` : null;
    }

    copyWebsiteToClipboard(): void {
        if (!this.password?.publicData?.website) return;

        this._copyToClipboard(this.password.publicData.website);
    }

    async prefillWebsite(): Promise<void> {
        if (!this.password?.publicData?.website || !this.decryptedData) {
            console.warn("Cannot prefill: missing website or decrypted data");
            return;
        }

        try {
            const newTab = await browser.tabs.create({ url: this.password.publicData.website });

            if (!newTab?.id) return;

            await this._autofillIntegrationService.waitForFormAndFill(newTab.id, {
                username: this.decryptedData.username,
                password: this.decryptedData.password,
                website: this.password.publicData.website,
                tabId: newTab.id,
            });
        } catch (error) {
            console.error("Error prefilling website:", error);
        }
    }
}
