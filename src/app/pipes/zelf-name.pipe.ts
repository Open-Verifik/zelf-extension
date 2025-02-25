import { Pipe, type PipeTransform, ChangeDetectorRef, Injectable, NgZone, OnDestroy } from "@angular/core";

/**
 * Pipe to format the Zelf name.
 *
 * Use pipe without arguments to return the name resized for different screen sizes.
 * Use pipe with a number argument to return the name resized for small screen sizes with a custom length.
 * Adjusts based on screen size;
 *
 * @example
 *  {{ "testinglargezelfname.zelf" | zelfName }} // TESTINGL...AME.ZELF
 *  {{ "testinglargezelfname.zelf" | zelfName: 10 }} // TESTINGL...ME.ZELF
 *  {{ "testinglargezelfname.zelf" | zelfName: 20 }} // TESTINGLARGEZELFNAME.ZELF
 */
@Pipe({
	name: "zelfName",
	standalone: true,
	pure: false,
})
@Injectable()
export class ZelfNamePipe implements PipeTransform, OnDestroy {
	private _onResize = this.onResize.bind(this);

	constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) {
		window.addEventListener("resize", this._onResize);
	}

	ngOnDestroy() {
		window.removeEventListener("resize", this._onResize);
	}

	transform(value?: string, ...args: number[]): unknown {
		if (typeof value !== "string" || !value?.trim()) return "****.zelf";

		const windowWidth = window.innerWidth;

		if (!isNaN(+args[0])) {
			if (+args[0] && args[0] <= 10) return value.trim().toUpperCase();

			if (windowWidth < 480 && value?.trim().length > +args[0]) {
				return `${value.slice(0, +args[0] - 10)}...${value.slice(-9)}`.toUpperCase();
			}
		} else {
			if (windowWidth < 480 && value?.trim().length > 12) {
				return `${value.slice(0, 12 - 10)}...${value.slice(-9)}`.toUpperCase();
			}

			if (windowWidth < 768 && value?.trim().length > 22) {
				return `${value.slice(0, 22 - 10)}...${value.slice(-9)}`.toUpperCase();
			}
		}

		return value.trim().toUpperCase();
	}

	private onResize() {
		this.ngZone.run(() => {
			this.cdr.markForCheck();
		});
	}
}
