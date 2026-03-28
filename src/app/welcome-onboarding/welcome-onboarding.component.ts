import { Subject, takeUntil } from "rxjs";

import { CommonModule } from "@angular/common";
import { AfterContentInit, Component, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { Router, RouterLink } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";

import { swipeLeft } from "app/animations/swipe-left.animation";
import { ChromeService } from "app/chrome.service";
import { HttpWrapperService } from "app/http-wrapper.service";
import { VaultService } from "app/vault.service";
import { WalletService } from "app/wallet.service";
import { environment } from "environments/environment";

@Component({
    animations: [swipeLeft],
    imports: [
        CommonModule,
        MatButtonModule,
        RouterLink,
        TranslocoModule,
    ],
    selector: "welcome-onboarding",
    styleUrls: ["./welcome-onboarding.component.scss"],
    templateUrl: "./welcome-onboarding.component.html",
})
export class WelcomeOnboardingComponent implements OnInit, OnDestroy, AfterContentInit {
    // Static flag to track if this component has been loaded before in this session
    // This persists across component destruction/re-creation but resets on page refresh
    private static _hasLoadedInSession = false;

    private _carouselItemInterval!: ReturnType<typeof setInterval>;
    private unsubscriber$: Subject<void> = new Subject<void>();

    activeThemeClass: string = "";
    carouselIndex: number = 0;
    carouselProgress: number = 0;
    showHomeButton: boolean = false;

    constructor(
        private _chromeService: ChromeService,
        private _httpWrapperService: HttpWrapperService,
        private _router: Router,
        private _vaultService: VaultService,
        private _walletService: WalletService
    ) {
        this._clearChromeItems();

        this._vaultService.password = "";
        this._vaultService.mnemonic = "";

        this._chromeService.onWalletsChanged$.pipe(takeUntil(this.unsubscriber$)).subscribe(async () => {
            const wallets = await this._walletService.getWalletsFromStorage();

            if (wallets.length) this.showHomeButton = true;
        });
    }

    async ngOnInit(): Promise<void> {
        await this._walletService.setWalletsToColdStorage();

        this._initCarousel();

        // The App Initializer always fetches the key on app start (fresh load or refresh).
        // We only want to re-fetch if we are returning to this page (navigating back).
        if (WelcomeOnboardingComponent._hasLoadedInSession) {
            await this._initializePublicKey();
        } else {
            // First load in this session - App Initializer already handled it.
            // Mark as loaded so next time we know to fetch.
            WelcomeOnboardingComponent._hasLoadedInSession = true;
        }
    }

    async ngAfterContentInit(): Promise<void> {
        const wallets = await this._walletService.getWalletsFromStorage();

        if (wallets.length) this.showHomeButton = true;
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();

        clearInterval(this._carouselItemInterval);
    }

    private async _initializePublicKey(): Promise<void> {
        const { hash } = this._walletService.getUserFingerprint();
        const url = `${environment.apiUrl}/api/sessions/yek-cilbup`;

        try {
            const response = await this._httpWrapperService.sendRequest("get", url, {
                identifier: hash,
            });

            const publicKey = response.data;

            await this._chromeService.setItem("publicKey", publicKey);

            this._httpWrapperService.setPublicKey(publicKey);
        } catch (error) {
            console.error("Error loading public key:", error);
        }
    }

    private _clearChromeItems(): void {
        this._chromeService.removeItem("flow");
        this._chromeService.removeItem("mnemonicCount");
        this._chromeService.removeItem("network");
        this._chromeService.removeItem("newTagName");
        this._chromeService.removeItem("referralTagName");
        this._chromeService.removeItem("tagName");
        this._chromeService.removeItem("tagNameObject");
        this._chromeService.removeItem("tagNameReward");
        this._chromeService.removeItem("tagResponse");
        this._chromeService.removeItem("zelfNameObject");
        this._chromeService.removeItem("zelfProof");
    }

    private _initCarousel(): void {
        this.carouselProgress = 0;

        this._carouselItemInterval = setInterval(() => {
            const tempIndex = this.carouselIndex;

            this.carouselIndex = -1;

            setTimeout(() => {
                this.carouselIndex = tempIndex === 2 ? 0 : tempIndex + 1;
                this.carouselProgress = 33 * (this.carouselIndex + 1);
            }, 500);
        }, 15000);

        setTimeout(() => {
            this.carouselProgress = 33;
        });
    }

    goToCreateAccount(): void {
        this._router.navigate(["/welcome", "claim"]);
    }

    goToImportAccount(): void {
        this._router.navigate(["/welcome", "find"]);
    }
}
