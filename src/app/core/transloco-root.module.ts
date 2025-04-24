import { HttpClient } from "@angular/common/http";
import { Translation, TranslocoLoader, TranslocoModule, TranslocoService, provideTransloco } from "@jsverse/transloco";
import { Injectable, NgModule, inject, provideAppInitializer } from "@angular/core";
import { environment } from "../../environments/environment";
import { MobileRestrictedComponent } from "./mobile-restricted/mobile-restricted.component";

@Injectable({ providedIn: "root" })
export class TranslocoHttpLoader implements TranslocoLoader {
    private http = inject(HttpClient);

    getTranslation(lang: string) {
        return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
    }
}

@NgModule({
    imports: [TranslocoModule],
    exports: [TranslocoModule],
    providers: [
        provideTransloco({
            loader: TranslocoHttpLoader,
            config: {
                defaultLang: "en",
                fallbackLang: "en",
                reRenderOnLangChange: true,
                prodMode: environment.production,
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
            },
        }),
        provideAppInitializer(() => {
            const initializerFn = (() => {
                const translocoService = inject(TranslocoService);
                const defaultLang = translocoService.getDefaultLang();

                translocoService.setActiveLang(defaultLang);

                return () => translocoService.load(defaultLang).toPromise();
            })();

            return initializerFn();
        }),
    ],
    declarations: [MobileRestrictedComponent],
})
export class TranslocoRootModule {}
