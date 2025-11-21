import { Injectable } from "@angular/core";

import { DomainService } from "./domain.service";
import { TagsService } from "./tags.service";
import { DomainLicense, ThemeSettings } from "./core/models/domain.type";

type Mode = "light" | "dark";

@Injectable({ providedIn: "root" })
export class ThemeService {
    private readonly cssVarPrefix = "--zns-";
    private readonly styleElementId = "zns-theme-style";

    private activeClassName: string = "";
    private lastPalette: Record<string, string> = {};

    constructor(
        private domainService: DomainService,
        private tagsService: TagsService
    ) {}

    async applyThemeForCurrentDomain(): Promise<{ className: string; palette: Record<string, string> }> {
        const domain = await this.tagsService.getDomain();

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

        this.applyZnsTheme(znsTheme, domain);

        return { className: this.activeClassName, palette: this.lastPalette };
    }

    private findConfigForDomain(domain: string): DomainLicense | undefined {
        if (!domain) return undefined;

        const exact = this.domainService.getDomainLicense(domain);

        if (exact) return exact;

        const all = this.domainService.domainConfigs || {};
        const keys = Object.keys(all);
        const lower = domain.toLowerCase().trim();
        const matchKey = keys.find((k) => k.toLowerCase().trim() === lower);

        return matchKey ? all[matchKey] : undefined;
    }

    private applyZnsTheme(zns: ThemeSettings, domainForClass: string): void {
        const mode = ((zns.currentMode as string) || "light").toLowerCase() as Mode;

        const light = zns.lightMode?.colors || {};
        const dark = zns.darkMode?.colors || {};
        const palette = (mode === "dark" ? dark : light) || {};

        document.body.setAttribute("data-zns-theme", mode);

        Object.entries(palette).forEach(([key, value]) => {
            const safeKey = key ? `${key.charAt(0).toLowerCase()}${key.slice(1)}` : "";
            const varName = this.toCssVarName(safeKey || key);
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

        const base = `zns-theme-${domainForClass}-${mode}`.replace(/[^a-z0-9-]/gi, "-").toLowerCase();

        this.activeClassName = base;

        const css = `
.${base} .zelf-card__title { color: ${header || "inherit"}; }
.${base} .zelf-card__subtitle { color: ${textSecondary || "inherit"}; }
.${base} .carousel__progress { background-color: ${border || "transparent"}; }
.${base} .carousel__progress-bar { background-color: ${primary || "transparent"}; }
.${base} .carousel__title { color: ${primary || "inherit"}; }
`;

        this.injectStyle(css);
    }

    private resetTheme(): void {
        document.body.removeAttribute("data-zns-theme");

        const knownKeys = [
            "primary",
            "secondary",
            "background",
            "backgroundSecondary",
            "text",
            "textSecondary",
            "textMuted",
            "header",
            "headerText",
            "button",
            "buttonText",
            "buttonHover",
            "buttonSecondary",
            "buttonSecondaryText",
            "border",
            "borderHover",
            "success",
            "successText",
            "warning",
            "warningText",
            "error",
            "errorText",
            "card",
            "cardBorder",
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
