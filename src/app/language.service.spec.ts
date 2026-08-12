import { TestBed } from "@angular/core/testing";
import { TranslocoService } from "@jsverse/transloco";

import { ChromeService } from "./chrome.service";
import { LanguageService } from "./language.service";

describe("LanguageService", () => {
    let activeLanguage = "kr";
    let service: LanguageService;

    const languageNames: Record<string, Record<string, string>> = {
        en: { en: "English", es: "Spanish", kr: "Korean" },
        es: { en: "Inglés", es: "Español", kr: "Coreano" },
        kr: { en: "영어", es: "스페인어", kr: "한국어" },
    };

    const translocoService = {
        getActiveLang: () => activeLanguage,
        getAvailableLangs: () => [],
        setActiveLang: (lang: string) => (activeLanguage = lang),
        translate: (key: string) => languageNames[activeLanguage][key.replace("language.", "")],
    };

    const chromeService = {
        getItem: () => Promise.resolve(activeLanguage),
        setItem: () => Promise.resolve(),
    };

    beforeEach(() => {
        activeLanguage = "kr";

        TestBed.configureTestingModule({
            providers: [
                LanguageService,
                { provide: TranslocoService, useValue: translocoService },
                { provide: ChromeService, useValue: chromeService },
            ],
        });

        service = TestBed.inject(LanguageService);
    });

    it("returns language names using the current locale after it changes", () => {
        expect(service.getLanguageName("es")).toBe("스페인어");

        translocoService.setActiveLang("es");

        expect(service.getLanguageName("es")).toBe("Español");
        expect(service.getLanguageName("kr")).toBe("Coreano");
    });
});
