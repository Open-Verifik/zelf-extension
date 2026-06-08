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
    imports: [CommonModule, MatButtonModule, RouterLink, TranslocoModule],
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
    designVariant: "current" | "modern" = "modern";
    showHomeButton: boolean = false;
    readonly slides = [
        {
            eyebrowKey: "welcome.onboarding.reinventing",
            highlights: [
                { id: "wallets", labelKey: "welcome.onboarding.features.wallets", icon: "wallet" },
                { id: "passwordManagers", labelKey: "welcome.onboarding.features.password_managers", icon: "password" },
                { id: "twoFactor", labelKey: "welcome.onboarding.features.two_factor", icon: "fingerprint" },
                { id: "inheritance", labelKey: "welcome.onboarding.features.inheritance", icon: "inheritance" },
            ],
            activeHighlight: "wallets",
            introLineKeys: [] as string[],
            featureBulletKeys: [] as string[],
        },
        {
            eyebrowKey: "welcome.onboarding.reinventing",
            highlights: [
                { id: "wallets", labelKey: "welcome.onboarding.features.wallets", icon: "wallet" },
                { id: "passwordManagers", labelKey: "welcome.onboarding.features.password_managers", icon: "password" },
                { id: "twoFactor", labelKey: "welcome.onboarding.features.two_factor", icon: "fingerprint" },
                { id: "inheritance", labelKey: "welcome.onboarding.features.inheritance", icon: "inheritance" },
            ],
            activeHighlight: "passwordManagers",
            introLineKeys: [] as string[],
            featureBulletKeys: [] as string[],
        },
        {
            eyebrowKey: "welcome.onboarding.reinventing",
            highlights: [
                { id: "wallets", labelKey: "welcome.onboarding.features.wallets", icon: "wallet" },
                { id: "passwordManagers", labelKey: "welcome.onboarding.features.password_managers", icon: "password" },
                { id: "twoFactor", labelKey: "welcome.onboarding.features.two_factor", icon: "fingerprint" },
                { id: "inheritance", labelKey: "welcome.onboarding.features.inheritance", icon: "inheritance" },
            ],
            activeHighlight: "twoFactor",
            introLineKeys: [] as string[],
            featureBulletKeys: [] as string[],
        },
        {
            eyebrowKey: "welcome.onboarding.reinventing",
            highlights: [
                { id: "wallets", labelKey: "welcome.onboarding.features.wallets", icon: "wallet" },
                { id: "passwordManagers", labelKey: "welcome.onboarding.features.password_managers", icon: "password" },
                { id: "twoFactor", labelKey: "welcome.onboarding.features.two_factor", icon: "fingerprint" },
                { id: "inheritance", labelKey: "welcome.onboarding.features.inheritance", icon: "inheritance" },
            ],
            activeHighlight: "inheritance",
            introLineKeys: [] as string[],
            featureBulletKeys: [] as string[],
        },
        {
            eyebrowKey: "welcome.onboarding.designed_for",
            highlights: [
                { id: "wallets", labelKey: "welcome.onboarding.features.wallets", icon: "wallet" },
                { id: "passwordManagers", labelKey: "welcome.onboarding.features.password_managers", icon: "password" },
                { id: "twoFactor", labelKey: "welcome.onboarding.features.two_factor", icon: "fingerprint" },
                { id: "inheritance", labelKey: "welcome.onboarding.features.inheritance", icon: "inheritance" },
            ],
            activeHighlight: "",
            introLineKeys: ["welcome.onboarding.summary_intro"],
            featureBulletKeys: [
                "welcome.onboarding.summary.self_custodian",
                "welcome.onboarding.summary.offline_feature",
                "welcome.onboarding.summary.human_authn",
            ],
        },
    ];

    isTransitioning: boolean = false;

    get currentSlide() {
        return this.slides[this.carouselIndex] ?? this.slides[0];
    }

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
        const slideDelayMs = 5000;
        const transitionDelayMs = 340;

        this.carouselProgress = 0;

        this._carouselItemInterval = setInterval(() => {
            this.isTransitioning = true;

            setTimeout(() => {
                this.carouselIndex = this.carouselIndex === this.slides.length - 1 ? 0 : this.carouselIndex + 1;
                this.carouselProgress = ((this.carouselIndex + 1) / this.slides.length) * 100;
                this.isTransitioning = false;
            }, transitionDelayMs);
        }, slideDelayMs);

        setTimeout(() => {
            this.carouselProgress = (1 / this.slides.length) * 100;
        });
    }

    goToEnterAccount(): void {
        this._router.navigate(["/welcome", "claim"], { queryParams: { mode: "enter" } });
    }

    goToCreateAccount(): void {
        this._router.navigate(["/welcome", "claim"]);
    }

    goToImportAccount(): void {
        this._router.navigate(["/welcome", "find"]);
    }
}
