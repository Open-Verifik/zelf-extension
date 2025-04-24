import { Injectable } from "@angular/core";
import { TranslocoService } from "@jsverse/transloco";

@Injectable({
    providedIn: "root",
})
export class ErrorService {
    _defaultErrorMessage = "";

    constructor(private _translocoService: TranslocoService) {
        this._defaultErrorMessage = this._translocoService.translate("errors.generic");
    }

    translateErrorMessage(key: string, fallbackErrorKey: string = ""): string {
        const formattedKey = `errors.${key}`;
        const translation = this._translocoService.translate(formattedKey);

        return translation !== formattedKey
            ? translation
            : fallbackErrorKey
            ? this._translocoService.translate(fallbackErrorKey)
            : this._defaultErrorMessage;
    }
}
