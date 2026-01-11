import { CommonModule } from "@angular/common";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { ErrorHandler, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { Router } from "@angular/router";

import { environment } from "environments/environment";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { TranslocoRootModule } from "./core/transloco-root.module";
import { GlobalErrorHandler } from "./global-error-handler.service";
import { HttpInterceptorProviders } from "./interceptors";
import { provideDomainInitializer } from "./core/providers/domain-initializer.provider";
import { provideSessionInitializer } from "./core/providers/session-initializer.provider";
import { provideAppInitializing, provideAppInitializerComplete } from "./core/providers/app-loading.provider";
import { ZelfLoaderComponent } from "./zelf-loader/zelf-loader.component";

@NgModule({
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    imports: [AppRoutingModule, TranslocoRootModule, BrowserModule, CommonModule, ZelfLoaderComponent],
    providers: [
        HttpInterceptorProviders,
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations(),
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
        provideAppInitializing(),
        provideSessionInitializer(), // Now handles both session AND public key
        provideDomainInitializer(),
        provideAppInitializerComplete(),
    ],
})
export class AppModule {
    constructor(private router: Router) {
        if (!this.isMobileDevice() || !environment.production) return;

        this.router.navigate(["/external-link"], { queryParams: { url: "https://zelf.world/download" } });
    }

    private isMobileDevice(): boolean {
        const userAgent = navigator.userAgent || navigator.vendor;

        return /android|iphone|ipad|ipod/i.test(userAgent);
    }
}
