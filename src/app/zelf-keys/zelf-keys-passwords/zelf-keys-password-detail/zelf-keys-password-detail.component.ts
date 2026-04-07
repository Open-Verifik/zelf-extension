import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { Subject, takeUntil } from "rxjs";

import { CopyToClipboardBase } from "app/base/copy-to-clipboard/copy-to-clipboard.base";
import { ZelfKeysService } from "app/services/zelf-keys.service";
import { ChromeService } from "../../../chrome.service";
import { PopoutDecryptorComponent } from "../../../popout-decryptor/popout-decryptor.component";
import { AutofillIntegrationService } from "../../../services/autofill-integration.service";
import { PasswordDataService } from "../../../services/password-data.service";
import { PopoutCommunicationService, PopoutDecryptionResult } from "../../../services/popout-communication.service";
import { ScrollToSectionService } from "../../../services/scroll-to-section.service";

interface ZelfKeyPasswordRecord {
    id: string;
    url: string;
    zelfProof: string;
    publicData: {
        category: string;
        timestamp: number;
        username: string;
        website: string;
        zelfName: string;
    };
}

interface DecryptedPasswordData {
    category?: string;
    difficulty: string;
    notes?: string;
    password: string;
    timestamp?: number;
    type: "password";
    username: string;
    website: string;
    zelfName?: string;
}

@Component({
    imports: [CommonModule, TranslocoModule, RouterModule, PopoutDecryptorComponent],
    selector: "zelf-keys-password-detail",
    styleUrls: ["./zelf-keys-password-detail.component.scss"],
    templateUrl: "./zelf-keys-password-detail.component.html",
})
export class ZelfKeysPasswordDetailComponent extends CopyToClipboardBase implements OnInit, OnDestroy {
    private _destroy$ = new Subject<void>();

    decryptedData: DecryptedPasswordData | null = null;
    decrypting = false;
    error: string | null = null;
    isPopout = false;
    loading = false;
    showBiometrics = false;
    showPassword = false;
    showPopoutDecryptor = false;
    zelfKeyPasswordRecord: ZelfKeyPasswordRecord | null = null;

    constructor(
        private _autofillIntegrationService: AutofillIntegrationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _passwordDataService: PasswordDataService,
        private _popoutCommunicationService: PopoutCommunicationService,
        private _router: Router,
        private _scrollToSectionService: ScrollToSectionService,
        public _chromeService: ChromeService,
        public _snackBar: MatSnackBar,
        public _translocoService: TranslocoService
    ) {
        super(_chromeService, _snackBar, _translocoService);

        this.isPopout = this._chromeService.isPopout;

        this._initSubscriptions();
    }

    async ngOnInit(): Promise<void> {
        this._loadPasswordData();
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();

        this._popoutCommunicationService.clearDecryptionData();
        this._popoutCommunicationService.clearDecryptionResult();

        chrome.runtime.onMessage.removeListener(this._handleDecryptionResultListener);
    }

    get decryptionPayload(): any {
        if (!this.zelfKeyPasswordRecord) return null;

        return {
            requestId: this.zelfKeyPasswordRecord.id,
            type: "password",
            zelfProof: this.zelfKeyPasswordRecord.zelfProof || "",
            publicData: {
                title: this.zelfKeyPasswordRecord.publicData?.website || "Password",
                website: this.zelfKeyPasswordRecord.publicData?.website || "",
            },
        };
    }

    private _handleDecryptionResultListener = (message: any) => {
        if (message.type === "DECRYPTION_RESULT_FROM_POPOUT" && this.zelfKeyPasswordRecord?.id === message.payload?.requestId) {
            this.handleDecryptionResult(message.payload?.result?.data);

            chrome.runtime.onMessage.removeListener(this._handleDecryptionResultListener);
        }

        return true;
    };

    private _initSubscriptions(): void {
        this._chromeService.isPopout$.pipe(takeUntil(this._destroy$)).subscribe((isPopout: boolean) => {
            this.isPopout = isPopout;
        });

        this._popoutCommunicationService.decryptionResult$.pipe(takeUntil(this._destroy$)).subscribe((result: PopoutDecryptionResult | null) => {
            if (!result?.success || !this.showPopoutDecryptor) return;

            this.handleDecryptionResult(result.data);
            this.showPopoutDecryptor = false;
        });
    }

    private async _loadPasswordData(): Promise<void> {
        this.loading = true;
        this.error = null;

        try {
            const passwordData = this._passwordDataService.getCurrentPassword();

            if (!passwordData) {
                this.error = this._translocoService.translate("zelf_keys.passwords.detail.error.not_found");

                return;
            }

            this.zelfKeyPasswordRecord = passwordData;
        } catch (error) {
            this.error = this._translocoService.translate("zelf_keys.passwords.detail.error.load_failed");
        } finally {
            this.loading = false;
        }
    }

    private _setDecryptionDataForService(): void {
        if (!this.isPopout) return;

        this._popoutCommunicationService.setDecryptionData(this.decryptionPayload);
    }

    async onDecryptClick(prefill: boolean = false): Promise<void> {
        if (this.decryptedData) {
            if (prefill) {
                this.prefillWebsite();
            } else {
                this._scrollToSectionService.scrollToSection("password-decrypted-content", "password");
            }

            return;
        }

        if (this.isPopout) {
            this.showPopoutDecryptor = true;

            this._setDecryptionDataForService();

            return;
        }

        const isPopoutOpen = await this._popoutCommunicationService.isPopoutOpen();
        const payload = this.decryptionPayload;

        if (isPopoutOpen) {
            await this._popoutCommunicationService.redirectPopout("popout-decryptor", payload);
        } else {
            await this._popoutCommunicationService.openPopout("popout-decryptor", payload);
        }

        chrome.runtime.onMessage.addListener(this._handleDecryptionResultListener);
    }

    handleDecryptionResult(data: any): void {
        if (!data || !this.zelfKeyPasswordRecord) return;

        this.decryptedData = {
            category: this.zelfKeyPasswordRecord.publicData?.category,
            difficulty: data.difficulty || "",
            password: data.password || "",
            timestamp: this.zelfKeyPasswordRecord.publicData?.timestamp,
            type: "password",
            username: data.username || "",
            website: data.website || "",
            zelfName: this.zelfKeyPasswordRecord.publicData?.zelfName,
        };

        this._changeDetectorRef.detectChanges();

        setTimeout(() => {
            this._scrollToSectionService.scrollToSection("password-decrypted-content", "password");
        }, 500);
    }

    onBackToList(): void {
        this._passwordDataService.clearCurrentPassword();

        this._router.navigate(["/zelf-keys/vault"]);
    }

    onCopyPassword(): void {
        if (!this.decryptedData?.password) return;

        this._copyToClipboard(this.decryptedData.password);
    }

    onTogglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;

        this._changeDetectorRef.detectChanges();
    }

    onCopyWebsite(): void {
        if (!this.decryptedData?.website) return;

        this._copyToClipboard(this.decryptedData.website);
    }

    onImageError(event: Event): void {
        const img = event.target as HTMLImageElement;

        img.style.display = "none";

        const container = img.parentElement;

        if (!container) return;

        container.innerHTML = `<div class="password-detail__image-error">${this._translocoService.translate("zelf_keys.common.image_not_available")}</div>`;
    }

    onDownloadZelfProof(): void {
        if (!this.zelfKeyPasswordRecord?.url) return;

        const link = document.createElement("a");

        link.href = this.zelfKeyPasswordRecord.url;
        link.download = `zelfproof-${this.zelfKeyPasswordRecord.publicData?.website || "password"}.png`;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    }

    getWebsiteHostname(website: string | undefined): string {
        if (!website) return "";

        try {
            const url = new URL(website);
            return url.hostname;
        } catch (error) {
            return website;
        }
    }

    getCategory(): string | null {
        const category = this.zelfKeyPasswordRecord?.publicData?.category;
        return ZelfKeysService.parseCategory(category);
    }

    getCategoryTranslationKey(): string | null {
        const category = this.getCategory();
        return category ? `zelf_keys.categories.${category}` : null;
    }

    copyZelfProof(): void {
        if (!this.zelfKeyPasswordRecord?.zelfProof) return;

        this._copyToClipboard(this.zelfKeyPasswordRecord.zelfProof);
    }

    copyIpfsHash(): void {
        if (!this.zelfKeyPasswordRecord?.id) return;

        this._copyToClipboard(this.zelfKeyPasswordRecord.id);
    }

    getZelfProofPreview(maxLength: number): string {
        const full = this.zelfKeyPasswordRecord?.zelfProof;
        if (!full) return "";
        if (full.length <= maxLength) return full;
        return `${full.slice(0, maxLength)}…`;
    }

    getIpfsHashPreview(maxLength: number): string {
        const full = this.zelfKeyPasswordRecord?.id;
        if (!full) return "";
        if (full.length <= maxLength) return full;
        return `${full.slice(0, maxLength)}…`;
    }

    async prefillWebsite(): Promise<void> {
        if (!this.zelfKeyPasswordRecord?.publicData?.website || !this.decryptedData) {
            console.warn("Cannot prefill: missing website or decrypted data");
            return;
        }

        try {
            const newTab = await browser.tabs.create({ url: this.zelfKeyPasswordRecord.publicData.website });

            if (!newTab?.id) return;

            await this._autofillIntegrationService.waitForFormAndFill(newTab.id, {
                username: this.decryptedData.username,
                password: this.decryptedData.password,
                tabId: newTab.id,
                website: this.zelfKeyPasswordRecord.publicData.website,
            });
        } catch (error) {
            console.error("Error prefilling website:", error);
        }
    }
}
