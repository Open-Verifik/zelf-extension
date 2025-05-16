import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { provideTransloco, TranslocoConfig } from "@jsverse/transloco";

import { environment } from "environments/environment";

@Injectable({
    providedIn: "root",
})
export class TranslocoHttpLoader {
    constructor(private http: HttpClient) {}

    getTranslation(lang: string) {
        return this.http.get(`/assets/i18n/${lang}.json`);
    }
}

export const translocoConfig: TranslocoConfig = {
    defaultLang: "en",
    failedRetries: 1,
    fallbackLang: "en",
    interpolation: ["{{", "}}"],
    prodMode: environment.production,
    reRenderOnLangChange: true,
    availableLangs: [
        {
            id: "en",
            label: "English",
        },
        {
            id: "es",
            label: "Spanish",
        },
        {
            id: "br",
            label: "Portuguese",
        },
        {
            id: "fr",
            label: "French",
        },
        {
            id: "ru",
            label: "Russian",
        },
        {
            id: "kr",
            label: "Korean",
        },
        {
            id: "in",
            label: "Hindi",
        },
        {
            id: "cn",
            label: "Chinese",
        },
        {
            id: "ph",
            label: "Filipino",
        },
        {
            id: "ja",
            label: "Japanese",
        },
        {
            id: "ar",
            label: "Arabic",
        },
    ],
    flatten: {
        aot: !environment.production,
    },
    missingHandler: {
        allowEmpty: true,
        logMissingKey: false,
        useFallbackTranslation: true,
    },
    scopes: {
        keepCasing: true,
    },
};

export const translocoProvider = provideTransloco({
    config: translocoConfig,
    loader: TranslocoHttpLoader,
});
