import { inject, Injectable } from "@angular/core";
import { LangDefinition, TranslocoService } from "@jsverse/transloco";
import { ChromeService } from "./chrome.service";

@Injectable({
    providedIn: "root",
})
export class LanguageService {
    flagCodes = {
        ar: "ar",
        br: "br",
        cn: "cn",
        en: "us",
        es: "es",
        fr: "fr",
        in: "in",
        ja: "ja",
        kr: "kr",
        ph: "ph",
        ru: "ru",
        us: "us",
    };

    languageTranslations = {};

    constructor(private _translocoService: TranslocoService, private _chromeService: ChromeService) {
        this.languageTranslations = {
            ar: this._translocoService.translate("language.ar"),
            br: this._translocoService.translate("language.br"),
            cn: this._translocoService.translate("language.cn"),
            en: this._translocoService.translate("language.en"),
            es: this._translocoService.translate("language.es"),
            fr: this._translocoService.translate("language.fr"),
            in: this._translocoService.translate("language.in"),
            ja: this._translocoService.translate("language.ja"),
            kr: this._translocoService.translate("language.kr"),
            ph: this._translocoService.translate("language.ph"),
            ru: this._translocoService.translate("language.ru"),
            us: this._translocoService.translate("language.en"),
        };

        this._chromeService.getItem("currentLanguage").then((currentLanguage) => {
            const translocoActiveLanguage = this.getAppLanguage();

            if (translocoActiveLanguage === currentLanguage) return;

            if (currentLanguage) {
                this._translocoService.setActiveLang(currentLanguage === "us" ? "en" : currentLanguage);
            } else {
                this._chromeService.setItem("currentLanguage", "en");
            }
        });
    }

    setAppLanguage(lang: string): void {
        this._chromeService.setItem("currentLanguage", lang === "us" ? "en" : lang);
        this._translocoService.setActiveLang(lang === "us" ? "en" : lang);
    }

    getAppLanguage(): string {
        return this._translocoService.getActiveLang();
    }

    getAvailableLanguages(): LangDefinition[] {
        return this._translocoService.getAvailableLangs() as LangDefinition[];
    }
}
