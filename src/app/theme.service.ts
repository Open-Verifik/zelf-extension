import { Injectable } from "@angular/core";
import { DomainService, DomainConfig } from "./domain.service";
import { TagsService } from "./tags.service";

type Mode = "light" | "dark";

interface ZnsThemeSettings {
    enabled: boolean;
    currentMode: Mode;
    lightMode?: { colors?: Record<string, string> };
    darkMode?: { colors?: Record<string, string> };
}

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

        const znsTheme = config.themeSettings.zns as ZnsThemeSettings;
        if (!znsTheme.enabled) {
            this.resetTheme();
            this.activeClassName = "";
            this.lastPalette = {};
            return { className: this.activeClassName, palette: this.lastPalette };
        }

        this.applyZnsTheme(znsTheme, domain);

        return { className: this.activeClassName, palette: this.lastPalette };
    }

    private findConfigForDomain(domain: string): DomainConfig | undefined {
        if (!domain) return undefined;
        const exact = this.domainService.getDomainConfig(domain);

        if (exact) return exact;

        const all = this.domainService.getAllDomainConfigs() || {};
        const keys = Object.keys(all);
        const lower = domain.toLowerCase().trim();
        const matchKey = keys.find((k) => k.toLowerCase().trim() === lower);
        return matchKey ? all[matchKey] : undefined;
    }

    private applyZnsTheme(zns: ZnsThemeSettings | any, domainForClass: string): void {
        const mode = ((zns.currentMode as string) || "light").toLowerCase() as Mode;

        // Be resilient to casing differences coming from API: LightMode/DarkMode vs lightMode/darkMode
        const light = zns.lightMode?.colors || zns.LightMode?.colors || {};
        const dark = zns.darkMode?.colors || zns.DarkMode?.colors || {};
        const palette = (mode === "dark" ? dark : light) || {};

        // Tag the body with a data attribute for easy CSS targeting if needed
        document.body.setAttribute("data-zns-theme", mode);

        // Set CSS variables (keep camelCase keys as-is)
        Object.entries(palette).forEach(([key, value]) => {
            const safeKey = key ? `${key.charAt(0).toLowerCase()}${key.slice(1)}` : "";
            const varName = this.toCssVarName(safeKey || key);
            document.documentElement.style.setProperty(varName, String(value));
        });

        // Build and inject a concrete CSS class with the palette so templates can use ngClass
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
        // Remove data attribute
        document.body.removeAttribute("data-zns-theme");

        // Optionally clear known vars if you want a clean slate; otherwise leave as-is
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

        // Clear dynamic style
        const el = document.getElementById(this.styleElementId);
        if (el) el.textContent = "";
    }

    private toCssVarName(key: string): string {
        // Keep theme keys as-is (camelCase) to match SCSS references like --zns-textSecondary
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
