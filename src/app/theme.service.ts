import { Injectable, OnDestroy } from "@angular/core";
import { Subject, takeUntil } from "rxjs";

import { ChromeService } from "./chrome.service";
import { DomainService } from "./domain.service";
import { TagsService } from "./tags.service";
import { DomainLicense, ThemeSettings } from "./core/models/domain.type";
import { TagModel } from "./tags.service";

type Mode = "light" | "dark";
type UserModePreference = "system" | "dark" | "light";

@Injectable({ providedIn: "root" })
export class ThemeService implements OnDestroy {
    private readonly cssVarPrefix = "--zns-theme-";
    private readonly styleElementId = "zns-theme-style";
    private readonly userModePreferenceKey = "user-theme-mode";

    private activeClassName: string = "";
    private lastPalette: Record<string, string> = {};
    private systemPreferenceListener?: MediaQueryList;
    private destroy$ = new Subject<void>();

    constructor(
        private _chromeService: ChromeService,
        private _domainService: DomainService,
        private _tagsService: TagsService
    ) {
        this.initializeModePreference().then(() => {
            this.getUserModePreference().then((preference) => {
                this.applyThemeClass(preference);
            });
        });

        this._chromeService.onWalletChanged$.pipe(takeUntil(this.destroy$)).subscribe(async (wallet: TagModel) => {
            if (!wallet) return;

            const domain = wallet.domain || wallet.publicData?.domain;

            if (!domain) return;

            await this.applyThemeForDomain(domain);
        });

        this.setupSystemPreferenceListener();
        this.setupWalletChangeListener();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();

        if (this.systemPreferenceListener) {
            this.systemPreferenceListener.removeEventListener("change", this.handleSystemPreferenceChange);
        }
    }

    async applyThemeForCurrentDomain(): Promise<{ className: string; palette: Record<string, string> }> {
        const domain = await this._tagsService.getDomain();

        return this.applyThemeForDomain(domain);
    }

    async applyThemeForDomain(domain: string): Promise<{ className: string; palette: Record<string, string> }> {
        const config = this.findConfigForDomain(domain);

        if (!config?.themeSettings?.zns) {
            this.resetTheme();

            this.activeClassName = "";
            this.lastPalette = {};

            return { className: this.activeClassName, palette: this.lastPalette };
        }

        const znsTheme = config.themeSettings.zns as ThemeSettings;

        if (!znsTheme.enabled) {
            this.resetTheme();
            this.activeClassName = "";
            this.lastPalette = {};

            return { className: this.activeClassName, palette: this.lastPalette };
        }

        await this.applyZnsTheme(znsTheme, domain);

        return { className: this.activeClassName, palette: this.lastPalette };
    }

    private findConfigForDomain(domain: string): DomainLicense | undefined {
        if (!domain) return undefined;

        const exact = this._domainService.getDomainLicense(domain);

        if (exact) return exact;

        const all = this._domainService.domainConfigs || {};
        const keys = Object.keys(all);
        const lower = domain.toLowerCase().trim();
        const matchKey = keys.find((k) => k.toLowerCase().trim() === lower);

        return matchKey ? all[matchKey] : undefined;
    }

    private async applyZnsTheme(zns: ThemeSettings, domainForClass: string): Promise<void> {
        const userPreference = await this.getUserModePreference();
        const effectiveMode = await this.getEffectiveModeAsync(zns.currentMode);
        const light = zns.lightMode?.colors || {};
        const dark = zns.darkMode?.colors || {};
        const palette = (effectiveMode === "dark" ? dark : light) || {};

        // Apply class to html element based on user preference
        this.applyThemeClass(userPreference);

        document.body.setAttribute("data-zns-theme", effectiveMode);

        // Map all theme colors to CSS custom properties (without mode prefix)
        // The class on html will scope these appropriately
        Object.entries(palette).forEach(([key, value]) => {
            const safeKey = this.toKebabCase(key);
            const varName = this.toCssVarName(safeKey);

            document.documentElement.style.setProperty(varName, String(value));
        });

        const header = String((palette as any).header || (palette as any).text || "").trim();
        const textSecondary = String((palette as any).textSecondary || "").trim();
        const primary = String((palette as any).primary || "").trim();
        const border = String((palette as any).border || "").trim();

        this.lastPalette = {
            primary,
            header,
            textSecondary,
            border,
        };

        const base = `zns-theme-${domainForClass}-${effectiveMode}`.replace(/[^a-z0-9-]/gi, "-").toLowerCase();

        this.activeClassName = base;
    }

    private resetTheme(): void {
        document.body.removeAttribute("data-zns-theme");
        this.removeThemeClass();

        const knownKeys = [
            "primary",
            "secondary",
            "background",
            "background-secondary",
            "text",
            "text-secondary",
            "text-muted",
            "header",
            "header-text",
            "button",
            "button-text",
            "button-hover",
            "button-secondary",
            "button-secondary-text",
            "border",
            "border-hover",
            "success",
            "success-text",
            "warning",
            "warning-text",
            "error",
            "error-text",
            "card",
            "card-border",
            "shadow",
        ];

        for (const key of knownKeys) {
            document.documentElement.style.removeProperty(this.toCssVarName(key));
        }

        const el = document.getElementById(this.styleElementId);

        if (el) el.textContent = "";
    }

    private toCssVarName(key: string): string {
        return `${this.cssVarPrefix}${key}`;
    }

    private applyThemeClass(preference: UserModePreference): void {
        this.removeThemeClass();

        if (preference === "light") {
            document.documentElement.classList.add("zns-theme-light");
        } else if (preference === "dark") {
            document.documentElement.classList.add("zns-theme-dark");
        }
        // "system" mode - no class applied
    }

    private removeThemeClass(): void {
        document.documentElement.classList.remove("zns-theme-light", "zns-theme-dark");
    }

    private toKebabCase(str: string): string {
        return str
            .replace(/([a-z])([A-Z])/g, "$1-$2")
            .toLowerCase()
            .replace(/^[A-Z]/, (match) => match.toLowerCase());
    }

    private async initializeModePreference(): Promise<void> {
        const saved = await this._chromeService.getItemSession<string>(this.userModePreferenceKey);

        if (!saved) {
            await this._chromeService.setItemSession(this.userModePreferenceKey, "system");
        }
    }

    async getUserModePreference(): Promise<UserModePreference> {
        const saved = await this._chromeService.getItemSession<string>(this.userModePreferenceKey);

        return (saved as UserModePreference) || "system";
    }

    async setUserModePreference(mode: UserModePreference): Promise<void> {
        await this._chromeService.setItemSession(this.userModePreferenceKey, mode);
        this.setupSystemPreferenceListener();
        this.applyThemeClass(mode);

        // Re-apply theme if one is active
        if (this.activeClassName) {
            const domain = this.activeClassName.split("-")[2] || "";

            if (domain) {
                await this.applyThemeForDomain(domain);
            }
        }
    }

    async cycleMode(): Promise<UserModePreference> {
        const current = await this.getUserModePreference();
        let next: UserModePreference;

        switch (current) {
            case "system":
                next = "dark";
                break;
            case "dark":
                next = "light";
                break;
            case "light":
                next = "system";
                break;
            default:
                next = "system";
        }

        await this.setUserModePreference(next);

        return next;
    }

    getSystemMode(): Mode {
        if (typeof window === "undefined" || !window.matchMedia) return "light";

        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    private async getEffectiveModeAsync(domainMode?: Mode): Promise<Mode> {
        try {
            const preference = await this.getUserModePreference();

            if (preference === "system") {
                return this.getSystemMode();
            }

            return preference;
        } catch {
            // Fallback to domain mode or light
            return domainMode || "light";
        }
    }

    private setupSystemPreferenceListener(): void {
        if (this.systemPreferenceListener) {
            this.systemPreferenceListener.removeEventListener("change", this.handleSystemPreferenceChange);
        }

        if (typeof window === "undefined" || !window.matchMedia) return;

        this.systemPreferenceListener = window.matchMedia("(prefers-color-scheme: dark)");

        this.systemPreferenceListener.addEventListener("change", this.handleSystemPreferenceChange);
    }

    private handleSystemPreferenceChange = async (): Promise<void> => {
        const preference = await this.getUserModePreference();

        if (preference === "system" && this.activeClassName) {
            const domain = this.activeClassName.split("-")[2] || "";

            if (domain) {
                await this.applyThemeForDomain(domain);
            }
        }
    };

    private setupWalletChangeListener(): void {
        this._chromeService.onWalletChanged$.pipe(takeUntil(this.destroy$)).subscribe(async (wallet: TagModel) => {
            if (!wallet) return;

            const domain = wallet.domain || wallet.publicData?.domain;

            if (!domain) return;

            // Check if domain license is cached
            const config = this._domainService.getDomainLicense(domain);

            if (config?.themeSettings?.zns) {
                await this.applyThemeForDomain(domain);
            }
        });
    }

    private injectStyle(css: string): void {
        let el = document.getElementById(this.styleElementId) as HTMLStyleElement | null;

        if (!el) {
            el = document.createElement("style");
            el.id = this.styleElementId;
            document.head.appendChild(el);
        }

        el.textContent = css;
    }

    getActiveClass(): string {
        return this.activeClassName;
    }

    getCurrentPalette(): Record<string, string> {
        return this.lastPalette;
    }
}
