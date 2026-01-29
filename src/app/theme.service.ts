import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, Observable, Subject, takeUntil } from "rxjs";

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
    private destroy$ = new Subject<void>();
    private lastPalette: Record<string, string> = {};
    private systemPreferenceListener?: MediaQueryList;

    private modeSubject = new BehaviorSubject<UserModePreference>("system");
    currentMode$: Observable<UserModePreference> = this.modeSubject.asObservable();

    constructor(
        private _chromeService: ChromeService,
        private _domainService: DomainService,
        private _tagsService: TagsService
    ) {
        this._initializeModePreference().then(() => {
            this.getUserModePreference().then((preference) => {
                this.modeSubject.next(preference);
                this._applyThemeClass(preference);
            });
        });

        this._setupSystemPreferenceListener();
        this._setupWalletChangeListener();
        this._setupDomainChangeListener();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();

        if (this.systemPreferenceListener) {
            this.systemPreferenceListener.removeEventListener("change", this._handleSystemPreferenceChange);
        }
    }

    async applyThemeForDomain(domain: string): Promise<{ className: string; palette: Record<string, string> }> {
        const config = this._findConfigForDomain(domain);

        if (!config?.themeSettings?.zns) {
            this._resetTheme();

            this.activeClassName = "";
            this.lastPalette = {};

            return { className: this.activeClassName, palette: this.lastPalette };
        }

        const znsTheme = config.themeSettings.zns as ThemeSettings;

        if (!znsTheme.enabled) {
            this._resetTheme();

            this.activeClassName = "";
            this.lastPalette = {};

            return { className: this.activeClassName, palette: this.lastPalette };
        }

        await this._applyZnsTheme(znsTheme, domain);

        return { className: this.activeClassName, palette: this.lastPalette };
    }

    private _findConfigForDomain(domain: string): DomainLicense | undefined {
        if (!domain) return undefined;

        const exact = this._domainService.getDomainLicense(domain);

        if (exact) return exact;

        const all = this._domainService.domainConfigs || {};
        const keys = Object.keys(all);
        const lower = domain.toLowerCase().trim();
        const matchKey = keys.find((k) => k.toLowerCase().trim() === lower);

        return matchKey ? all[matchKey] : undefined;
    }

    private async _applyZnsTheme(zns: ThemeSettings, domainForClass: string): Promise<void> {
        const userPreference = await this.getUserModePreference();
        const effectiveMode = await this._getEffectiveModeAsync(zns.currentMode);
        const light = zns.lightMode?.colors || {};
        const dark = zns.darkMode?.colors || {};
        const palette = (effectiveMode === "dark" ? dark : light) || {};

        this._applyThemeClass(userPreference);

        document.body.setAttribute("data-zns-theme", effectiveMode);

        Object.entries(palette).forEach(([key, value]) => {
            const safeKey = this._toKebabCase(key);
            const varName = this._toCssVarName(safeKey);

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

    private _resetTheme(): void {
        document.body.removeAttribute("data-zns-theme");
        this._removeThemeClass();

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
            document.documentElement.style.removeProperty(this._toCssVarName(key));
        }

        const el = document.getElementById(this.styleElementId);

        if (el) el.textContent = "";
    }

    private _toCssVarName(key: string): string {
        return `${this.cssVarPrefix}${key}`;
    }

    private _applyThemeClass(preference: UserModePreference): void {
        this._removeThemeClass();

        const effective = preference === "system" ? this.getSystemMode() : (preference as Mode);

        if (effective === "light") {
            document.documentElement.classList.add("zns-theme-light");
        } else if (effective === "dark") {
            document.documentElement.classList.add("zns-theme-dark");
        }
    }

    private _removeThemeClass(): void {
        document.documentElement.classList.remove("zns-theme-light", "zns-theme-dark");
    }

    private _toKebabCase(str: string): string {
        return str
            .replace(/([a-z])([A-Z])/g, "$1-$2")
            .toLowerCase()
            .replace(/^[A-Z]/, (match) => match.toLowerCase());
    }

    private async _initializeModePreference(): Promise<void> {
        const saved = await this._chromeService.getItemSession<string>(this.userModePreferenceKey);

        if (saved) return;

        await this._chromeService.setItemSession(this.userModePreferenceKey, "system");
    }

    private _toRgba(color: string, alpha: number): string {
        const [r, g, b] = color.match(/\w\w/g)?.map((c) => parseInt(c, 16)) || [0, 0, 0];

        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    async getUserModePreference(): Promise<UserModePreference> {
        const saved = await this._chromeService.getItemSession<string>(this.userModePreferenceKey);

        return (saved as UserModePreference) || "system";
    }

    async setUserModePreference(mode: UserModePreference): Promise<void> {
        await this._chromeService.setItemSession(this.userModePreferenceKey, mode);

        this.modeSubject.next(mode);
        this._setupSystemPreferenceListener();
        this._applyThemeClass(mode);

        // Re-apply theme if one is active
        if (!this.activeClassName) return;
        const domain = this.activeClassName.split("-")[2] || "";

        if (!domain) return;

        await this.applyThemeForDomain(domain);
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

    private async _getEffectiveModeAsync(domainMode?: Mode): Promise<Mode> {
        try {
            const preference = await this.getUserModePreference();

            if (preference === "system") return this.getSystemMode();

            return preference;
        } catch {
            return domainMode || "light";
        }
    }

    private _setupSystemPreferenceListener(): void {
        if (this.systemPreferenceListener) {
            this.systemPreferenceListener.removeEventListener("change", this._handleSystemPreferenceChange);
        }

        if (typeof window === "undefined" || !window.matchMedia) return;

        this.systemPreferenceListener = window.matchMedia("(prefers-color-scheme: dark)");

        this.systemPreferenceListener.addEventListener("change", this._handleSystemPreferenceChange);
    }

    private _handleSystemPreferenceChange = async (): Promise<void> => {
        const preference = await this.getUserModePreference();

        if (preference !== "system") return;

        this._applyThemeClass(preference);

        if (!this.activeClassName) return;

        const domain = this.activeClassName.split("-")[2] || "";

        if (!domain) return;

        await this.applyThemeForDomain(domain);
    };

    private _setupDomainChangeListener(): void {
        this._chromeService.onDomainChanged$.pipe(takeUntil(this.destroy$)).subscribe(async (domain: string) => {
            if (!domain) domain = "zelf";

            await this.applyThemeForDomain(domain);
        });
    }

    private _setupWalletChangeListener(): void {
        this._chromeService.onWalletChanged$.pipe(takeUntil(this.destroy$)).subscribe(async (wallet: TagModel) => {
            if (!wallet) return;

            let domain = wallet.publicData?.domain;

            if (!domain) {
                const tagName = wallet.fullTagName || wallet.name;

                if (tagName) {
                    const cleanTagName = tagName.replace(".hold", "");
                    const parts = cleanTagName.split(".");

                    if (parts.length >= 2) {
                        domain = parts[parts.length - 1];
                    } else {
                        domain = (await this._tagsService.getDomain()) || "zelf";
                    }
                } else {
                    domain = (await this._tagsService.getDomain()) || "zelf";
                }
            }

            if (!domain) domain = "zelf";

            this._tagsService.setDomain(domain);
        });
    }

    getActiveClass(): string {
        return this.activeClassName;
    }

    getCurrentPalette(): Record<string, string> {
        return this.lastPalette;
    }

    getCurrentThemeMaskColor(): string {
        const borderColor = this.lastPalette.border;

        if (!borderColor) return "rgba(255, 255, 255, 0.75)";

        return this._toRgba(borderColor, 0.75);
    }
}
