import { Injectable } from "@angular/core";
import { TranslocoService } from "@ngneat/transloco";

@Injectable({
    providedIn: "root",
})
export class ErrorService {
    _defaultErrorMessage = this._translocoService.translate("errors.generic");

    constructor(private _translocoService: TranslocoService) {}

    translateErrorMessage(key: string, fallbackErrorKey: string = ""): string {
        const translation = this._translocoService.translate(`errors.${key}`);

        return translation !== key ? translation : fallbackErrorKey ? this._translocoService.translate(fallbackErrorKey) : this._defaultErrorMessage;
    }
}
