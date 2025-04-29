import { HttpClient, provideHttpClient } from "@angular/common/http";
import { Injectable, NgModule } from "@angular/core";
import {
    Translation,
    TRANSLOCO_CONFIG,
    TRANSLOCO_FALLBACK_STRATEGY,
    TRANSLOCO_INTERCEPTOR,
    TRANSLOCO_LOADER,
    TRANSLOCO_MISSING_HANDLER,
    TRANSLOCO_TRANSPILER,
    translocoConfig,
    TranslocoConfig,
    TranslocoLoader,
    TranslocoModule,
} from "@jsverse/transloco";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class TranslocoTestingLoader implements TranslocoLoader {
    constructor(private http: HttpClient) {}

    getTranslation(lang: string): Observable<Translation> {
        return this.http.get<Translation>(`/base/src/assets/i18n/${lang}.json`).pipe(catchError(() => of({})));
    }
}

export class TranslocoTestingTranspiler {
    transpile(value: string, params = {}, translation = {}): string {
        return value;
    }
}

export class TranslocoTestingMissingHandler {
    handle(key: string, config: any): string {
        return key;
    }
}

export class TranslocoTestingInterceptor {
    intercept(key: string, value: string): string {
        return value;
    }

    preSaveTranslation(translation: any): any {
        return translation;
    }
}

export class TranslocoTestingFallbackStrategy {
    getNextLangs(failedLang: string): string[] {
        return ["en"];
    }
}

const defaultConfig: Partial<TranslocoConfig> = {
    defaultLang: "en",
    fallbackLang: "en",
    reRenderOnLangChange: true,
    prodMode: false,
    availableLangs: ["en", "es"],
};

@NgModule({
    imports: [TranslocoModule],
    exports: [TranslocoModule],
    providers: [
        provideHttpClient(),
        { provide: TRANSLOCO_CONFIG, useValue: translocoConfig(defaultConfig) },
        { provide: TRANSLOCO_LOADER, useClass: TranslocoTestingLoader },
        { provide: TRANSLOCO_TRANSPILER, useClass: TranslocoTestingTranspiler },
        { provide: TRANSLOCO_MISSING_HANDLER, useClass: TranslocoTestingMissingHandler },
        { provide: TRANSLOCO_INTERCEPTOR, useClass: TranslocoTestingInterceptor },
        { provide: TRANSLOCO_FALLBACK_STRATEGY, useClass: TranslocoTestingFallbackStrategy },
    ],
})
export class TranslocoTestingModule {}
