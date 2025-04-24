import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { LangDefinition, TranslocoService } from "@jsverse/transloco";
import { ChromeService } from "app/chrome.service";
import { LanguageService } from "app/language.service";
import { Subject, takeUntil } from "rxjs";

@Component({
    imports: [CommonModule, MatButtonModule, MatMenuModule],
    selector: "language",
    styleUrls: ["./language.component.scss"],
    templateUrl: "./language.component.html",
})
export class LanguageComponent implements OnInit, OnDestroy {
    private unsubscriber$: Subject<void> = new Subject<void>();

    activeLang: string = "";
    availableLangs: LangDefinition[] = [];
    flagCodes: any;
    languageTranslations: any;

    constructor(private _languageService: LanguageService, private _translocoService: TranslocoService, private _chromeService: ChromeService) {
        this.activeLang = this._languageService.getAppLanguage();
        this.availableLangs = this._languageService.getAvailableLanguages();
        this.flagCodes = this._languageService.flagCodes;
        this.languageTranslations = this._languageService.languageTranslations;

        this._translocoService.langChanges$.pipe(takeUntil(this.unsubscriber$)).subscribe((activeLang) => {
            this.activeLang = activeLang;
        });
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    async setActiveLang(lang: string): Promise<void> {
        this._translocoService.setActiveLang(lang);

        await this._chromeService.setItem("currentLanguage", lang);
    }
}
