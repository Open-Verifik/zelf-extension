import { inject, provideAppInitializer } from "@angular/core";
import { TranslocoService } from "@jsverse/transloco";

import { ChromeService } from "../../chrome.service";

/**
 * Restores the user's saved language preference from Chrome storage
 * before any component renders, ensuring onboarding texts display
 * in the correct language from the very first frame.
 */
async function initializeLanguage(): Promise<void> {
    const translocoService = inject(TranslocoService);
    const chromeService = inject(ChromeService);

    const savedLang = await chromeService.getItem("currentLanguage");

    if (savedLang && savedLang !== translocoService.getActiveLang()) {
        const lang = savedLang === "us" ? "en" : savedLang;

        translocoService.setActiveLang(lang);

        // Pre-load the translation file so it is available before render
        await translocoService.load(lang).toPromise();
    }
}

export function provideLanguageInitializer() {
    return provideAppInitializer(initializeLanguage);
}
