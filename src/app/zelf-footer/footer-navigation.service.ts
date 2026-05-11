import { Injectable } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter, map, Observable, startWith } from "rxjs";

export interface FooterNavDestination {
    id: string;
    labelKey: string;
    iconUrl: string;
    route: string;
}

@Injectable({
    providedIn: "root",
})
export class FooterNavigationService {
    public readonly destinations: FooterNavDestination[] = [
        {
            id: "home",
            labelKey: "common.home",
            iconUrl: "assets/icons/home_icon.svg",
            route: "/home",
        },
        {
            id: "wallet",
            labelKey: "common.zelf_wallet",
            iconUrl: "assets/icons/wallet_icon.svg",
            route: "/wallet",
        },
        {
            id: "zelf-keys",
            labelKey: "common.zelf_keys",
            iconUrl: "assets/icons/key_icon.svg",
            route: "/zelf-keys",
        },
        {
            id: "zelf-authenticator",
            labelKey: "common.zelf_authenticator",
            iconUrl: "assets/icons/shield_icon.svg",
            route: "/zelf-authenticator",
        },
        {
            id: "manage-domains",
            labelKey: "common.manage_domains",
            iconUrl: "assets/icons/zelf_id_icon.svg",
            route: "/manage-domains",
        },
        {
            id: "zelf-chat",
            labelKey: "common.zelf_chat",
            iconUrl: "assets/icons/chat_icon.svg",
            route: "/zelf-chat",
        },
        {
            id: "zelf-signals",
            labelKey: "common.zelf_signals",
            iconUrl: "assets/icons/signals_icon.svg",
            route: "/zelf-signals",
        },
        {
            id: "zelf-ai",
            labelKey: "common.zelf_ai",
            iconUrl: "assets/icons/ai_icon.svg",
            route: "/zelf-ai",
        },
        {
            id: "settings",
            labelKey: "common.settings",
            iconUrl: "assets/icons/settings_icon.svg", // I might need to make sure this icon exists or use a material icon or fallback
            route: "/settings",
        },
    ];

    public activeDestination$: Observable<FooterNavDestination>;

    constructor(private _router: Router) {
        this.activeDestination$ = this._router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
            startWith(null),
            map(() => this.getActiveDestination(this._router.url))
        );
    }

    public isActive(url: string, destinationId: string): boolean {
        const cleanUrl = url.split("?")[0];
        
        switch (destinationId) {
            case "home":
                return cleanUrl === "/home";
            case "wallet":
                return cleanUrl === "/wallet";
            case "manage-domains":
                return cleanUrl === "/manage-domains" || cleanUrl.startsWith("/domain");
            case "zelf-keys":
                return cleanUrl.startsWith("/zelf-keys");
            case "zelf-authenticator":
                return cleanUrl.startsWith("/zelf-authenticator");
            default:
                const dest = this.destinations.find(d => d.id === destinationId);
                return dest ? cleanUrl.startsWith(dest.route) : false;
        }
    }

    public getActiveDestination(url: string): FooterNavDestination {
        // Find matching destination or fallback to home
        const active = this.destinations.find(d => this.isActive(url, d.id));
        return active || this.destinations[0];
    }

    public async navigate(destinationId: string): Promise<boolean> {
        const dest = this.destinations.find((d) => d.id === destinationId);
        if (dest) {
            return this._router.navigate([dest.route]);
        }
        return false;
    }

    /** Order for full-page apps hub (screenshot 1). */
    private readonly _hubDestinationIds: string[] = [
        "home",
        "wallet",
        "zelf-keys",
        "zelf-authenticator",
        "zelf-chat",
        "zelf-signals",
        "manage-domains",
        "zelf-ai",
    ];

    public getHubDestinations(): FooterNavDestination[] {
        return this._hubDestinationIds
            .map((id) => this.destinations.find((d) => d.id === id))
            .filter((d): d is FooterNavDestination => !!d);
    }

    /** Label key for hub list (e.g. zChats vs zChat). */
    public hubLabelKey(dest: FooterNavDestination): string {
        if (dest.id === "zelf-chat") {
            return "common.zelf_chats";
        }
        return dest.labelKey;
    }
}
