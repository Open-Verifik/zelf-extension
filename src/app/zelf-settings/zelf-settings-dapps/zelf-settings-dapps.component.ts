import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";
import { ChromeService } from "app/chrome.service";
import { DappPermission, PendingDappRequest } from "@shared/types/dapp.types";

interface DappSite {
    origin: string;
    hostname: string;
    accounts: string[];
    chainId: number;
    connectedAt: number;
    initial: string;
}

@Component({
    selector: "zelf-settings-dapps",
    standalone: true,
    imports: [CommonModule, TranslocoModule],
    templateUrl: "./zelf-settings-dapps.component.html",
    styleUrls: ["./zelf-settings-dapps.component.scss"],
})
export class ZelfSettingsDappsComponent implements OnInit {
    sites: DappSite[] = [];
    selectedSite: DappSite | null = null;

    constructor(
        private chromeService: ChromeService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.loadPermissions();
        this.cleanupRequests();
    }

    cleanupRequests() {
        // Clean up from browser storage (background)
        if (this.chromeService.isExtension && typeof chrome !== "undefined" && chrome.runtime) {
            chrome.runtime
                .sendMessage({ type: "DAPP_CLEANUP_REQUESTS" })
                .then((res) => console.log("[Dapp Cleanup] Background cleanup response:", res))
                .catch((e) => console.error("[Dapp Cleanup] Background cleanup failed", e));
        }

        // Clean up from local storage (UI tab) - to wipe dead keys from developer tools
        try {
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith("pending_dapp_request_")) {
                    keysToRemove.push(key);
                }
            }
            if (keysToRemove.length > 0) {
                console.log(`[Dapp Cleanup] Found ${keysToRemove.length} orphaned dapp requests in window.localStorage. Removing:`, keysToRemove);
                keysToRemove.forEach((k) => localStorage.removeItem(k));
                console.log(`[Dapp Cleanup] Successfully cleaned up window.localStorage.`);
            } else {
                console.log(`[Dapp Cleanup] No orphaned dapp requests found in window.localStorage.`);
            }
        } catch (error) {
            console.error("[Dapp Cleanup] Failed to clean up window.localStorage:", error);
        }
    }

    async loadPermissions() {
        try {
            const permissions = await this.chromeService.getItem("dapp_permissions");
            if (permissions) {
                this.sites = Object.values(permissions).map((p: any) => {
                    let hostname = "";
                    try {
                        hostname = new URL(p.origin).hostname;
                    } catch {
                        hostname = p.origin;
                    }
                    return {
                        ...p,
                        hostname,
                        initial: hostname ? hostname.charAt(0).toUpperCase() : "?",
                    };
                });
            } else {
                this.sites = [];
            }
        } catch (error) {
            console.error("Failed to load dapp permissions", error);
            this.sites = [];
        }
    }

    selectSite(site: DappSite) {
        this.selectedSite = site;
    }

    backToList() {
        this.selectedSite = null;
    }

    backToSettingsMenu(): void {
        this._router.navigate([], {
            relativeTo: this._activatedRoute,
            queryParams: { edit: null },
        });
    }

    shortenAddress(address: string | undefined): string {
        if (!address) return "Unknown";
        if (address.length <= 12) return address;
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    async disconnectSite(origin: string) {
        try {
            if (this.chromeService.isExtension && typeof chrome !== "undefined" && chrome.runtime) {
                await chrome.runtime.sendMessage({ type: "DAPP_FORCE_DISCONNECT_SITE", payload: { origin } });
            } else {
                const permissions = (await this.chromeService.getItem("dapp_permissions")) || {};
                delete permissions[origin];
                await this.chromeService.setItem("dapp_permissions", permissions);
            }

            this.sites = this.sites.filter((s) => s.origin !== origin);
            if (this.selectedSite?.origin === origin) {
                this.selectedSite = null;
            }
        } catch (error) {
            console.error("Failed to disconnect site", error);
        }
    }

    async disconnectAll() {
        try {
            if (this.chromeService.isExtension && typeof chrome !== "undefined" && chrome.runtime) {
                await chrome.runtime.sendMessage({ type: "DAPP_FORCE_DISCONNECT_ALL" });
            } else {
                await this.chromeService.setItem("dapp_permissions", {});
            }

            this.sites = [];
            this.selectedSite = null;
        } catch (error) {
            console.error("Failed to disconnect all sites", error);
        }
    }
}
