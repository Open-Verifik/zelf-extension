import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";

import { ChromeService } from "app/chrome.service";
import { SigningService } from "app/services/signing.service";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";
import { VerifyStatus, getChainConfig, SUPPORTED_CHAINS } from "@shared/types/dapp.types";
import { getPreferredChainIdForOrigin } from "@shared/services/dapp-mapping.service";

@Component({
    imports: [CommonModule, MatButtonModule, TranslocoModule, ZelfLoaderComponent],
    selector: "dapp-connect",
    templateUrl: "./dapp-connect.component.html",
    styleUrls: ["./dapp-connect.component.scss"],
})
export class DappConnectComponent implements OnInit {
    loading = true;
    requestId = "";
    origin = "";
    hostname = "";
    favicon = "";
    faviconError = false;
    activeTab: "accounts" | "permissions" = "accounts";
    accounts: { tagName: string; address: string; selected: boolean }[] = [];
    verifyStatus: VerifyStatus = "UNKNOWN";
    chainId = 1404;
    chainName = "BlockDAG";
    chainSymbol = "BDAG";
    showPicker = false;
    supportedChains = SUPPORTED_CHAINS;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _chromeService: ChromeService,
        private _router: Router,
        private _signingService: SigningService
    ) {}

    async ngOnInit(): Promise<void> {
        const urlParams = new URLSearchParams(window.location.search);
        this.requestId = urlParams.get("requestId") || this._activatedRoute.snapshot.queryParams?.requestId || "";

        if (!this.requestId) {
            this._router.navigate(["/home"]);
            return;
        }

        try {
            const allAccounts = await this._signingService.getAllWalletAccounts();

            this.accounts = allAccounts.map((acc, index) => ({
                tagName: acc.tagName,
                address: acc.address,
                selected: index === 0,
            }));

            const pendingData = await this._loadPendingData();

            if (pendingData) {
                this.origin = pendingData.origin || "";
                this.hostname = pendingData.hostname || this._extractHostname(this.origin);
                this.favicon = pendingData.favicon || "";
                this.verifyStatus = pendingData.verifyStatus || "UNKNOWN";

                const preferredChainId = getPreferredChainIdForOrigin(this.origin);
                const resolvedChainId = pendingData.chainId || preferredChainId || 1404;
                this.chainId = resolvedChainId;
                const chainConfig = getChainConfig(resolvedChainId);
                if (chainConfig) {
                    this.chainName = chainConfig.name;
                    this.chainSymbol = chainConfig.symbol;
                }
            }

            if (!this.favicon && this.hostname) {
                this.favicon = `https://www.google.com/s2/favicons?domain=${this.hostname}&sz=64`;
            }
        } catch (error) {
            console.error("Error loading dApp connect data:", error);
        }

        this.loading = false;
    }

    get selectedAccounts(): string[] {
        return this.accounts.filter((a) => a.selected).map((a) => a.address);
    }

    get verifyLabel(): string {
        switch (this.verifyStatus) {
            case "VALID":
                return "Verified";
            case "INVALID":
                return "Domain mismatch";
            case "THREAT":
                return "Malicious";
            default:
                return "Unverified";
        }
    }

    get verifyClass(): string {
        switch (this.verifyStatus) {
            case "VALID":
                return "verify--valid";
            case "INVALID":
                return "verify--invalid";
            case "THREAT":
                return "verify--threat";
            default:
                return "verify--unknown";
        }
    }

    get isThreat(): boolean {
        return this.verifyStatus === "THREAT";
    }

    get hostnameInitial(): string {
        return this.hostname ? this.hostname.charAt(0).toUpperCase() : "?";
    }

    setTab(tab: "accounts" | "permissions"): void {
        this.activeTab = tab;
    }

    toggleAccount(index: number): void {
        this.accounts[index].selected = !this.accounts[index].selected;
    }

    toggleNetworkPicker(): void {
        this.showPicker = !this.showPicker;
    }

    selectNetwork(chainId: number): void {
        this.chainId = chainId;
        const config = getChainConfig(chainId);
        if (config) {
            this.chainName = config.name;
            this.chainSymbol = config.symbol;
        }
        this.showPicker = false;
    }

    onFaviconError(): void {
        this.faviconError = true;
    }

    shortAddress(address: string): string {
        if (!address || address.length < 12) return address;
        return `${address.slice(0, 8)}...${address.slice(-6)}`;
    }

    async approve(): Promise<void> {
        if (this.isThreat || this.selectedAccounts.length === 0) return;

        try {
            await chrome.runtime.sendMessage({
                type: "DAPP_APPROVAL_RESULT",
                payload: {
                    requestId: this.requestId,
                    approved: true,
                    accounts: this.selectedAccounts,
                    chainId: this.chainId,
                },
                requestId: this.requestId,
            });
        } catch (error) {
            console.error("Error sending approval:", error);
        }

        window.close();
    }

    async reject(): Promise<void> {
        try {
            await chrome.runtime.sendMessage({
                type: "DAPP_APPROVAL_RESULT",
                payload: {
                    requestId: this.requestId,
                    approved: false,
                },
                requestId: this.requestId,
            });
        } catch (error) {
            console.error("Error sending rejection:", error);
        }

        window.close();
    }

    private async _loadPendingData(): Promise<any> {
        // Primary: query background directly (avoids cache race condition)
        try {
            const response = await chrome.runtime.sendMessage({
                type: "DAPP_GET_PENDING",
                requestId: this.requestId,
            });
            if (response?.success && response.data) {
                return response.data;
            }
        } catch {
            // Background might not support this message yet
        }

        // Fallback: read from chrome.storage.local
        const stored = await this._chromeService.getItem<any>("pending_dapp_request_" + this.requestId);
        if (stored && typeof stored === "object" && stored.origin) {
            return stored;
        }

        return null;
    }

    private _extractHostname(origin: string): string {
        if (!origin) return "";
        try {
            return new URL(origin).hostname;
        } catch {
            return origin;
        }
    }
}
