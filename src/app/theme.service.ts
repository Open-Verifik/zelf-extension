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
    private readonly activeDomainPreferenceKey = "active-theme-domain";

    private activeDomain: string = "";
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

    async applyThemeForDomain(domain: string): Promise<{ palette: Record<string, string> }> {
        const config = this._findConfigForDomain(domain);

        if (!config?.themeSettings?.zns) {
            this._resetTheme();
            this.activeDomain = "";
            this.lastPalette = {};

            return { palette: this.lastPalette };
        }

        const znsTheme = config.themeSettings.zns as ThemeSettings;

        if (!znsTheme.enabled) {
            this._resetTheme();
            this.activeDomain = "";
            this.lastPalette = {};

            return { palette: this.lastPalette };
        }

        await this._applyZnsTheme(znsTheme, domain);

        return { palette: this.lastPalette };
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

    private async _applyZnsTheme(zns: ThemeSettings, domain: string): Promise<void> {
        const userPreference = await this.getUserModePreference();
        const effectiveMode = await this._getEffectiveModeAsync(zns.currentMode);
        const light = zns.lightMode?.colors || {};
        const dark = zns.darkMode?.colors || {};
        const palette = (effectiveMode === "dark" ? dark : light) || {};

        this._applyThemeClass(userPreference);

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

        this.activeDomain = domain;
        await this._chromeService.setItem(this.activeDomainPreferenceKey, domain);
    }

    private _resetTheme(): void {
        this._removeThemeClass();

        const items = document.documentElement.style;

        for (let i = 0; i < items.length; i++) {
            const name = items[i];

            if (name.startsWith(this.cssVarPrefix)) {
                items.removeProperty(name);
            }
        }

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
        const saved = await this._chromeService.getItem<string>(this.userModePreferenceKey);

        if (saved) return;

        // Migrate from session storage (previous storage location) if available
        const sessionValue = await this._chromeService.getItemSession<string>(this.userModePreferenceKey);

        if (sessionValue) {
            await this._chromeService.setItem(this.userModePreferenceKey, sessionValue);
            await this._chromeService.removeItemSession(this.userModePreferenceKey);

            return;
        }

        await this._chromeService.setItem(this.userModePreferenceKey, "system");
    }

    private _toRgba(color: string, alpha: number): string {
        const [r, g, b] = (color.match(/\w\w/g) || []).map((c) => parseInt(c, 16));

        return `rgba(${r || 0}, ${g || 0}, ${b || 0}, ${alpha})`;
    }

    async getUserModePreference(): Promise<UserModePreference> {
        const saved = await this._chromeService.getItem<string>(this.userModePreferenceKey);

        if (saved) return saved as UserModePreference;

        // Fallback: check session storage (pre-migration location)
        const sessionSaved = await this._chromeService.getItemSession<string>(this.userModePreferenceKey);

        if (sessionSaved) return sessionSaved as UserModePreference;

        return "system";
    }

    async setUserModePreference(mode: UserModePreference): Promise<void> {
        await this._chromeService.setItem(this.userModePreferenceKey, mode);

        this.modeSubject.next(mode);
        this._setupSystemPreferenceListener();
        this._applyThemeClass(mode);

        if (this.activeDomain) {
            await this.applyThemeForDomain(this.activeDomain);
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

        if (this.activeDomain) {
            await this.applyThemeForDomain(this.activeDomain);
        }
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

    getActiveDomain(): string {
        return this.activeDomain;
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
