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
import { GlobalErrorHandler } from "./error-handler.service";
import { HttpInterceptorProviders } from "./interceptors";

@NgModule({
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    imports: [AppRoutingModule, TranslocoRootModule, BrowserModule, CommonModule],
    providers: [
        HttpInterceptorProviders,
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations(),
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
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
