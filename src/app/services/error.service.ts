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

    private readonly API_MESSAGE_TO_KEY: Record<string, string> = {
        "FACE IS NOT CENTRAL, PLEASE USE AN IMAGE WITH A CENTRAL FACE.": "face_not_central",
    };

    translateErrorMessage(key: string, fallbackErrorKey: string = ""): string {
        const trimmed = key?.trim() || "";
        const mappedKey = this.API_MESSAGE_TO_KEY[trimmed] ?? key;
        const formattedKey = `errors.${mappedKey}`;

        const translation = this._translocoService.translate(formattedKey);

        return translation !== formattedKey
            ? translation
            : fallbackErrorKey
              ? this._translocoService.translate(fallbackErrorKey)
              : this._defaultErrorMessage;
    }
}
