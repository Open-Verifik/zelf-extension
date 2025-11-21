import { Component, Injector, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { Subject, takeUntil } from "rxjs";

import { environment } from "environments/environment";

import { ChromeService } from "./chrome.service";
import { DomainService } from "./domain.service";
import { HttpWrapperService } from "./http-wrapper.service";
import { ThemeService } from "./theme.service";
import { AutofillDataService } from "./services/autofill-data.service";
import { AutofillIntegrationService } from "./services/autofill-integration.service";
import { PopoutCommunicationService } from "./services/popout-communication.service";
import { WalletService } from "./wallet.service";

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: "app-root",
    standalone: false,
    styleUrls: ["./app.component.scss", "./main.scss"],
    template: `<div class="flex flex-col flex-auto main-div" [ngClass]="isPopout ? 'main-div--popout' : ''">
        <div class="flex flex-col flex-auto">
            <router-outlet></router-outlet>
        </div>
    </div>`,
})
export class AppComponent implements OnInit, OnDestroy {
    private unsubscriber$ = new Subject<void>();
    private publicKey!: string;

    apiUrl: string = environment.apiUrl;
    isPopout: boolean = false;

    constructor(
        private _chromeService: ChromeService,
        private _domainService: DomainService,
        private _httpWrapperService: HttpWrapperService,
        private _injector: Injector,
        private _popoutCommunicationService: PopoutCommunicationService,
        private _themeService: ThemeService,
        private _walletService: WalletService
    ) {
        this._initializeRequiredServices();

        this.isPopout = this._chromeService.isPopout;

        this._chromeService.isPopout$.pipe(takeUntil(this.unsubscriber$)).subscribe((isPopout) => {
            this.isPopout = isPopout;
        });
    }

    ngOnInit(): void {
        this._getPublicKey();
        this._loadDomains();

        // Check if we're in a popup and have pending decryption data
        this.checkForPendingDecryption();

        // Notify background script that popup is ready
        this.notifyPopupReady();

        // Listen for navigation messages from background script
        this.setupNavigationListener();
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    private checkForPendingDecryption(): void {
        if (!this.isPopout) return;

        const decryptionData = this._popoutCommunicationService.getDecryptionData();

        if (!decryptionData) return;
    }

    private notifyPopupReady(): void {
        if (this.isPopout && typeof chrome !== "undefined" && chrome.runtime) {
            chrome.runtime.sendMessage({
                type: "POPUP_READY",
            });
        }
    }

    private setupNavigationListener(): void {
        if (typeof chrome === "undefined" || !chrome.runtime) return;
    }

    /**
     * These services are required and must be initialized along with the application.
     */
    private _initializeRequiredServices(): void {
        this._injector.get(AutofillIntegrationService);
        this._injector.get(AutofillDataService);
    }

    _getPublicKey(): void {
        let { hash } = this._walletService.getUserFingerprint();

        const url = `${this.apiUrl}/api/sessions/yek-cilbup`;

        this._httpWrapperService
            .sendRequest("get", url, {
                identifier: hash,
            })
            .then((response) => {
                this.publicKey = response.data;

                this._chromeService.setItem("publicKey", this.publicKey);
                this._httpWrapperService.setPublicKey(this.publicKey);
            });
    }

    private async _loadDomains(): Promise<void> {
        try {
            const loadedFromCache = await this._loadDomainsFromCache();

            if (loadedFromCache) {
                await this._ensureZelfDomainAvailable();
                return;
            }

            await this._loadDomainsFromAPI();
            await this._ensureZelfDomainAvailable();
        } catch (error) {
            console.error("Error loading domains:", error);
            await this._ensureZelfDomainAvailable();
        }
    }

    private async _loadDomainsFromCache(): Promise<boolean> {
        try {
            const isCacheValid = await this._domainService.isCacheValid();

            if (!isCacheValid) return false;

            await this._domainService.loadDomainsFromStorage();
            await this._applyDefaultThemeIfNeeded();

            return true;
        } catch (error) {
            console.error("Error loading domains from cache:", error);
            return false;
        }
    }

    private async _loadDomainsFromAPI(): Promise<void> {
        try {
            await this._domainService.getDomains();
        } catch (error) {
            console.error("Error loading domains from API:", error);
        } finally {
            await this._applyDefaultThemeIfNeeded();
        }
    }

    private async _applyDefaultThemeIfNeeded(): Promise<void> {
        try {
            const wallets = await this._walletService.getWalletsFromStorage();

            if (wallets.length > 0) return;

            await this._ensureZelfDomainAvailable();

            const zelfConfig = this._domainService.getDomainLicense("zelf");

            if (zelfConfig?.themeSettings?.zns) {
                await this._themeService.applyThemeForDomain("zelf");
            }
        } catch (error) {
            console.error("Error applying default theme:", error);
        }
    }

    private async _ensureZelfDomainAvailable(): Promise<void> {
        const zelfConfig = this._domainService.getDomainLicense("zelf");

        if (!zelfConfig) {
            const fallbackConfigs = this._domainService.defaultFallbackDomainConfigs;
            const zelfFallback = fallbackConfigs.find((config) => config.name === "zelf");

            if (zelfFallback) {
                const domainConfigs = this._domainService.domainConfigs;
                domainConfigs["zelf"] = zelfFallback;
            }
        }
    }
}
