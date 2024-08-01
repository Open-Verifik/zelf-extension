import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslocoService } from "@ngneat/transloco";
import { ChromeService } from "app/chrome.service";

@Component({
	selector: "language-picker",
	templateUrl: "./language-picker.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: ["../main.scss", "./language-picker.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class LanguagePickerComponent implements OnInit, OnDestroy {
	availableLangs: any;
	activeLang: string = "";
	flagCodes: any;

	/**
	 * Constructor
	 */
	constructor(private _changeDetectorRef: ChangeDetectorRef, private _translocoService: TranslocoService, private _chromeService: ChromeService) {
		// Set the country iso codes for languages for flags
		this.flagCodes = {
			en: "us",
			es: "es",
			// br: "br",
			// fr: "fr",
			// it: "it",
			// ru: "ru",
			// kr: "kr",
			// in: "in",
			// cn: "cn",
			// ph: "ph",
		};
	}

	/**
	 * On init
	 */
	ngOnInit(): void {
		// Get the available languages from transloco
		this.availableLangs = this._translocoService.getAvailableLangs();

		const currentLanguage = localStorage.getItem("currentLanguage");

		if (currentLanguage) {
			this._translocoService.setActiveLang(currentLanguage);

			this._changeDetectorRef.markForCheck();
		}

		// Subscribe to language changes
		this._translocoService.langChanges$.subscribe((activeLang) => {
			// Get the active lang
			this.activeLang = activeLang;

			this._changeDetectorRef.markForCheck();
		});
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Set the active lang
	 *
	 * @param lang
	 */
	setActiveLang(lang: string): void {
		// Set the active lang
		this._translocoService.setActiveLang(lang);

		this._chromeService.setItem("currentLanguage", lang);
		// localStorage.setItem("currentLanguage", lang);
	}

	/**
	 * Track by function for ngFor loops
	 *
	 * @param index
	 * @param item
	 */
	trackByFn(index: number, item: any): any {
		return item.id || index;
	}
}
