import { HttpClient } from "@angular/common/http";
import { Injectable, NgModule, inject, provideAppInitializer } from "@angular/core";
import { Translation, TranslocoLoader, TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { translocoProvider } from "../../../transloco.config";

@Injectable({ providedIn: "root" })
export class TranslocoHttpLoader implements TranslocoLoader {
    private http = inject(HttpClient);

    getTranslation(lang: string) {
        return this.http.get<Translation>(`./assets/i18n/${lang}.json`);
    }
}

@NgModule({
    imports: [TranslocoModule],
    exports: [TranslocoModule],
    providers: [
        translocoProvider,
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
    declarations: [],
})
export class TranslocoRootModule {}
