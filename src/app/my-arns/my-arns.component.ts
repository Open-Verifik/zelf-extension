import { TranslocoModule } from "@jsverse/transloco";

import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Router } from "@angular/router";

import { ChromeService } from "app/chrome.service";
import { WalletService } from "app/wallet.service";
import { ZelfNameService } from "app/zelf-name-service.service";
import { TagModel } from "app/tags.service";

@Component({
    imports: [CommonModule, TranslocoModule, MatProgressSpinnerModule],
    selector: "my-arns",
    styleUrls: ["./my-arns.component.scss"],
    templateUrl: "./my-arns.component.html",
})
export class MyArNSComponent implements OnInit {
    arnsUrl: string | null = null;
    isLoadingArnsUrl: boolean = true;
    wallet: TagModel | null = null;
    isMainnet: boolean = false;

    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
        private _bottomSheetRef: MatBottomSheetRef<MyArNSComponent>,
        private _chromeService: ChromeService,
        private _router: Router,
        private _walletService: WalletService,
        private _zelfNameService: ZelfNameService
    ) {}

    async ngOnInit(): Promise<void> {
        // Check if ArNS exists and create it if it doesn't when the modal opens
        this.wallet = (await this._walletService.getCurrentWallet()) as TagModel;

        if (!this.wallet?.tagName) {
            this.isLoadingArnsUrl = false;
            return;
        }

        // Check if domain is mainnet
        this.isMainnet = this.wallet.isMainnet;

        // If not mainnet, don't fetch ArNS URL
        if (!this.isMainnet) {
            this.isLoadingArnsUrl = false;
            return;
        }

        // Check cache first - if cached, no need to show loading
        const cachedUrl = await this._getCachedArnsUrl(this.wallet.tagName as string, this.wallet.domain as string);

        if (cachedUrl) {
            this.arnsUrl = cachedUrl;
            this.isLoadingArnsUrl = false;
            return;
        }

        // If not cached, show loading and fetch from backend
        this.isLoadingArnsUrl = true;

        try {
            this.arnsUrl = await this.ensureArNS(this.wallet.tagName as string, this.wallet.domain as string);

            if (!this.arnsUrl) {
                console.error("Failed to ensure ArNS for", this.wallet.tagName);
            }
        } finally {
            this.isLoadingArnsUrl = false;
        }
    }

    /**
     * Get cache key for storing ArNS URL
     * @param tagName - The tagName to generate cache key for
     * @param domain - The domain to generate cache key for
     * @returns Cache key string
     */
    private _getArnsCacheKey(tagName: string, domain: string): string {
        return `arnsUrl_${tagName}_${domain}` + (domain === "zelf" ? "" : `_zelf`);
    }

    /**
     * Get cached ArNS URL from localStorage
     * @param tagName - The tagName to get cached URL for
     * @param domain - The domain to get cached URL for
     * @returns Cached URL or null if not found or expired
     */
    private async _getCachedArnsUrl(tagName: string, domain: string): Promise<string | null> {
        try {
            const cacheKey = this._getArnsCacheKey(tagName, domain);

            const cachedData = await this._chromeService.getItem(cacheKey);

            if (!cachedData) {
                return null;
            }

            // Check if cached data is in old format (string) or new format (object with timestamp)
            if (typeof cachedData === "string") {
                // Old format - treat as expired to force refresh
                return null;
            }

            const cache = cachedData as { url: string; timestamp: number };

            // Check if cache is expired (1 hour = 3600000 milliseconds)
            const oneHourInMs = 60 * 60 * 1000;
            const now = Date.now();
            const isExpired = now - cache.timestamp > oneHourInMs;

            if (isExpired) {
                // Cache expired, remove it and return null
                await this._chromeService.removeItem(cacheKey);
                return null;
            }

            return cache.url;
        } catch (error) {
            console.error("Error reading cached ArNS URL:", error);
            return null;
        }
    }

    /**
     * Cache ArNS URL in localStorage with 1 hour TTL
     * @param tagName - The tagName to cache URL for
     * @param domain - The domain to cache URL for
     * @param url - The URL to cache
     */
    private async _cacheArnsUrl(tagName: string, domain: string, url: string): Promise<void> {
        try {
            const cacheKey = this._getArnsCacheKey(tagName, domain);
            const cacheData = {
                url: url,
                timestamp: Date.now(),
            };
            await this._chromeService.setItem(cacheKey, cacheData);
        } catch (error) {
            console.error("Error caching ArNS URL:", error);
        }
    }

    /**
     * Check if ArNS exists and create it if it doesn't, then return the URL
     * @param tagName - The tagName to check/create
     * @param domain - The domain to check/create
     * @returns Promise with the ArNS URL
     */
    async ensureArNS(tagName: string, domain: string): Promise<string | null> {
        // First, check cache
        const cachedUrl = await this._getCachedArnsUrl(tagName, domain);

        if (cachedUrl) return cachedUrl;

        try {
            // First, check if ArNS exists
            const checkResponse = await this._zelfNameService.getArNS(tagName, domain);

            if (checkResponse?.exists && checkResponse?.primaryUrl && checkResponse.upToDate) {
                // Cache the URL for future use
                await this._cacheArnsUrl(tagName, domain, checkResponse.primaryUrl);

                return checkResponse.primaryUrl;
            }

            // If it doesn't exist, create it
            const createResponse = await this._zelfNameService.createArNS(tagName, domain);

            if (createResponse?.primaryUrl) {
                // Cache the URL for future use
                await this._cacheArnsUrl(tagName, domain, createResponse.primaryUrl);

                return createResponse.primaryUrl;
            }
        } catch (error: any) {
            console.error("Error ensuring ArNS:", error);
            // If there's a validation error, the backend will reject it
            // Return null to indicate failure
        }

        return null;
    }

    cancel(): void {
        this._bottomSheetRef.dismiss();
    }

    async close(): Promise<void> {
        // Use the URL that was already fetched in ngOnInit
        if (this.arnsUrl) {
            this._router.navigate(["/external-link"], { queryParams: { externalUrl: this.arnsUrl } });
        }

        this._bottomSheetRef.dismiss();
    }

    goToPurchase(): void {
        this._router.navigate(["/manage-domains"]);
        this._bottomSheetRef.dismiss();
    }

    async dontShowAgain(): Promise<void> {
        await this._chromeService.setItem("myArnsDontShowAgain", true);

        await this.close();
    }
}
