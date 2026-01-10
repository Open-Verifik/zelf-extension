import { inject, provideAppInitializer } from "@angular/core";

import { AppLoadingService } from "../../services/app-loading.service";

async function startAppLoading(): Promise<void> {
    const loadingService = inject(AppLoadingService);
    loadingService.start();
}

async function stopAppLoading(): Promise<void> {
    const loadingService = inject(AppLoadingService);
    loadingService.stop();
}

export function provideAppInitializing() {
    return provideAppInitializer(startAppLoading);
}

export function provideAppInitializerComplete() {
    return provideAppInitializer(stopAppLoading);
}
