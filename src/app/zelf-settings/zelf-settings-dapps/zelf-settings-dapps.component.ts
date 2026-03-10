import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
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
        private router: Router
    ) {}

    ngOnInit() {
        this.loadPermissions();
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

    goToHome() {
        this.router.navigate(["./"], { queryParams: { edit: "" } });
    }

    shortenAddress(address: string | undefined): string {
        if (!address) return "Unknown";
        if (address.length <= 12) return address;
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    async disconnectSite(origin: string) {
        try {
            const permissions = (await this.chromeService.getItem("dapp_permissions")) || {};
            delete permissions[origin];
            await this.chromeService.setItem("dapp_permissions", permissions);

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
            await this.chromeService.setItem("dapp_permissions", {});
            this.sites = [];
            this.selectedSite = null;
        } catch (error) {
            console.error("Failed to disconnect all sites", error);
        }
    }
}
