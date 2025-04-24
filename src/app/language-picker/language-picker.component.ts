import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslocoService } from "@jsverse/transloco";
import { ChromeService } from "app/chrome.service";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "language-picker",
    templateUrl: "./language-picker.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ["../main.scss", "./language-picker.component.scss"],
    encapsulation: ViewEncapsulation.None,
    standalone: false,
})
export class LanguagePickerComponent implements OnInit, OnDestroy {
    private unsubscriber$: Subject<void> = new Subject<void>();

    activeLang: string = "";
    availableLangs: any;
    flagCodes: any;

    /**
     * Constructor
     */
    constructor(private _changeDetectorRef: ChangeDetectorRef, private _translocoService: TranslocoService, private _chromeService: ChromeService) {
        this.flagCodes = {
            en: "us",
            es: "es",
            br: "br",
            fr: "fr",
            ru: "ru",
            kr: "kr",
            in: "in",
            cn: "cn",
            ph: "ph",
            ja: "ja",
            ar: "ar",
        };
    }

    /**
     * On init
     */
    async ngOnInit(): Promise<void> {
        this.availableLangs = this._translocoService.getAvailableLangs();

        const currentLanguage = await this._chromeService.getItem("currentLanguage");

        if (currentLanguage) {
            this._translocoService.setActiveLang(currentLanguage);

            this._changeDetectorRef.markForCheck();
        }

        this._translocoService.langChanges$.pipe(takeUntil(this.unsubscriber$)).subscribe((activeLang) => {
            this.activeLang = activeLang;

            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    /**
     * Set the active lang
     * @param lang
     */
    async setActiveLang(lang: string): Promise<void> {
        // Set the active lang
        this._translocoService.setActiveLang(lang);

        await this._chromeService.setItem("currentLanguage", lang);
    }

    /**
     * Track by function for ngFor loops
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
