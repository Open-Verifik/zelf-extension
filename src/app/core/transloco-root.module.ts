import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { NgModule, inject, provideAppInitializer } from "@angular/core";
import { MobileRestrictedComponent } from "./mobile-restricted/mobile-restricted.component";
import { translocoProvider } from "../../../transloco.config";

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
    declarations: [MobileRestrictedComponent],
})
export class TranslocoRootModule {}
