import { HttpClient } from "@angular/common/http";
import {
    TRANSLOCO_LOADER,
    Translation,
    TranslocoLoader,
    TRANSLOCO_CONFIG,
    translocoConfig,
    TranslocoModule,
    TranslocoService,
} from "@ngneat/transloco";
import { Injectable, NgModule, APP_INITIALIZER, inject } from "@angular/core";
import { environment } from "../../environments/environment";
import { MobileRestrictedComponent } from "./mobile-restricted/mobile-restricted.component";

@Injectable({ providedIn: "root" })
export class TranslocoHttpLoader implements TranslocoLoader {
    constructor(private http: HttpClient) {}

    getTranslation(lang: string) {
        return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
    }
}

@NgModule({
    imports: [TranslocoModule],
    exports: [TranslocoModule],
    providers: [
        {
            provide: TRANSLOCO_CONFIG,
            useValue: translocoConfig({
                availableLangs: [
                    {
                        id: "en",
                        label: "English",
                    },
                    // {
                    // 	id: "es",
                    // 	label: "Spanish",
                    // },
                    // {
                    // 	id: "br",
                    // 	label: "Portuguese",
                    // },
                    // {
                    // 	id: "fr",
                    // 	label: "French",
                    // },
                    // {
                    // 	id: "ru",
                    // 	label: "Russian",
                    // },
                    // {
                    // 	id: "kr",
                    // 	label: "Korean",
                    // },
                    // {
                    // 	id: "in",
                    // 	label: "Hindi",
                    // },
                    // {
                    // 	id: "cn",
                    // 	label: "Chinese",
                    // },
                    // {
                    // 	id: "ph",
                    // 	label: "Filipino",
                    // },
                    // {
                    // 	id: "ja",
                    // 	label: "Japanese",
                    // },
                    // {
                    // 	id: "ar",
                    // 	label: "Arabic",
                    // },
                ],
                defaultLang: "en",
                fallbackLang: "en",
                // Remove this option if your application doesn't support changing language in runtime.
                reRenderOnLangChange: true,
                prodMode: environment.production,
            }),
        },
        { provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader },
        {
            // Preload the default language before the app starts to prevent empty/jumping content
            provide: APP_INITIALIZER,
            useFactory: () => {
                const translocoService = inject(TranslocoService);
                const defaultLang = translocoService.getDefaultLang();
                translocoService.setActiveLang(defaultLang);

                return () => translocoService.load(defaultLang).toPromise();
            },
            multi: true,
        },
    ],
    declarations: [MobileRestrictedComponent],
})
export class TranslocoRootModule {}
