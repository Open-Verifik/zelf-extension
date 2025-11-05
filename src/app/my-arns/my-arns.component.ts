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
        const wallet = (await this._walletService.getCurrentWallet()) as TagModel;

        if (!wallet?.tagName) {
            this.isLoadingArnsUrl = false;
            return;
        }

        // Check cache first - if cached, no need to show loading
        const cachedUrl = await this._getCachedArnsUrl(wallet.tagName as string);
        if (cachedUrl) {
            this.arnsUrl = cachedUrl;
            this.isLoadingArnsUrl = false;
            return;
        }

        // If not cached, show loading and fetch from backend
        this.isLoadingArnsUrl = true;

        try {
            this.arnsUrl = await this.ensureArNS(wallet.tagName as string);

            console.log("arnsUrl", this.arnsUrl);

            if (!this.arnsUrl) {
                console.error("Failed to ensure ArNS for", wallet.tagName);
            }
        } finally {
            this.isLoadingArnsUrl = false;
        }
    }

    /**
     * Get cache key for storing ArNS URL
     * @param zelfName - The zelfName to generate cache key for
     * @returns Cache key string
     */
    private _getArnsCacheKey(zelfName: string): string {
        const cleanZelfName = zelfName.endsWith(".zelf") ? zelfName.slice(0, -5) : zelfName;
        return `arnsUrl_${cleanZelfName.toLowerCase()}`;
    }

    /**
     * Get cached ArNS URL from localStorage
     * @param zelfName - The zelfName to get cached URL for
     * @returns Cached URL or null if not found
     */
    private async _getCachedArnsUrl(zelfName: string): Promise<string | null> {
        try {
            const cacheKey = this._getArnsCacheKey(zelfName);
            const cachedUrl = await this._chromeService.getItem(cacheKey);
            return cachedUrl ? (cachedUrl as string) : null;
        } catch (error) {
            console.error("Error reading cached ArNS URL:", error);
            return null;
        }
    }

    /**
     * Cache ArNS URL in localStorage
     * @param zelfName - The zelfName to cache URL for
     * @param url - The URL to cache
     */
    private async _cacheArnsUrl(zelfName: string, url: string): Promise<void> {
        try {
            const cacheKey = this._getArnsCacheKey(zelfName);
            await this._chromeService.setItem(cacheKey, url);
        } catch (error) {
            console.error("Error caching ArNS URL:", error);
        }
    }

    /**
     * Check if ArNS exists and create it if it doesn't, then return the URL
     * @param zelfName - The zelfName to check/create
     * @returns Promise with the ArNS URL
     */
    async ensureArNS(zelfName: string): Promise<string | null> {
        // First, check cache
        const cachedUrl = await this._getCachedArnsUrl(zelfName);

        if (cachedUrl) return cachedUrl;

        try {
            // First, check if ArNS exists
            const checkResponse = await this._zelfNameService.getArNS(zelfName);

            if (checkResponse?.exists && checkResponse?.primaryUrl) {
                // Cache the URL for future use
                await this._cacheArnsUrl(zelfName, checkResponse.primaryUrl);

                return checkResponse.primaryUrl;
            }

            // If it doesn't exist, create it
            const createResponse = await this._zelfNameService.createArNS(zelfName);

            if (createResponse?.primaryUrl) {
                // Cache the URL for future use
                await this._cacheArnsUrl(zelfName, createResponse.primaryUrl);
                return createResponse.primaryUrl;
            }

            // Fallback to generated URL if response doesn't have primaryUrl
            const fallbackUrl = this._zelfNameService.generateArNS(zelfName);

            // Cache the fallback URL as well
            await this._cacheArnsUrl(zelfName, fallbackUrl);

            return fallbackUrl;
        } catch (error: any) {
            console.error("Error ensuring ArNS:", error);
            // If there's a validation error, the backend will reject it
            // Return null to indicate failure
            return null;
        }
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

    async dontShowAgain(): Promise<void> {
        await this._chromeService.setItem("myArnsDontShowAgain", true);

        await this.close();
    }
}
