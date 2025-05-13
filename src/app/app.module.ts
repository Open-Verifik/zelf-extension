import { CommonModule } from "@angular/common";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { Router } from "@angular/router";
import { BrowserModule } from "@angular/platform-browser";

import { environment } from "environments/environment";
import { HttpInterceptorProviders } from "./interceptors";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { TranslocoRootModule } from "./core/transloco-root.module";

@NgModule({
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    imports: [AppRoutingModule, TranslocoRootModule, BrowserModule, CommonModule],
    providers: [HttpInterceptorProviders, provideHttpClient(withInterceptorsFromDi())],
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
