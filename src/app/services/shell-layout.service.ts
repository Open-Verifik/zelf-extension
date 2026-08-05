import { Injectable } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter, map, Observable, startWith } from "rxjs";

/**
 * Path matchers for deep shell layout (no hub header; footer shows + Add).
 * Add new deep screens here as one entry each.
 */
export const DEEP_SHELL_PATH_MATCHERS: ReadonlyArray<(path: string) => boolean> = [
    (path) => path.startsWith("/zelf-keys/passwords/detail"),
    (path) => path.startsWith("/zelf-keys/passwords/new"),
    (path) => path.startsWith("/zelf-keys/passwords/result"),
    (path) => path.startsWith("/zelf-keys/payment-cards/detail"),
    (path) => path.startsWith("/zelf-keys/payment-cards/new"),
    (path) => path.startsWith("/zelf-keys/payment-cards/result"),
    (path) => path.startsWith("/zelf-keys/billing"),
];

@Injectable({
    providedIn: "root",
})
export class ShellLayoutService {
    readonly isDeepShell$: Observable<boolean>;

    constructor(private readonly _router: Router) {
        this.isDeepShell$ = this._router.events.pipe(
            filter((event): event is NavigationEnd => event instanceof NavigationEnd),
            startWith(null),
            map(() => this.isDeepShell(this._router.url))
        );
    }

    cleanPath(url: string): string {
        return (url || "").split("?")[0].split("#")[0] || "";
    }

    isDeepShell(url: string = this._router.url): boolean {
        const path = this.cleanPath(url);

        return DEEP_SHELL_PATH_MATCHERS.some((match) => match(path));
    }

    /**
     * Destination for the deep-shell footer + Add control.
     * Context-aware by section; defaults to Zelf Keys password create.
     */
    getDeepAddRoute(url: string = this._router.url): string {
        const path = this.cleanPath(url);

        if (path.startsWith("/zelf-keys/payment-cards")) {
            return "/zelf-keys/payment-cards/new";
        }

        if (path.startsWith("/zelf-keys")) {
            return "/zelf-keys/passwords/new";
        }

        return "/zelf-keys/passwords/new";
    }

    navigateToDeepAdd(): Promise<boolean> {
        return this._router.navigate([this.getDeepAddRoute()]);
    }
}
