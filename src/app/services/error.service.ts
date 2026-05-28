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

    resolveErrorKey(error: unknown): string {
        if (!error || typeof error !== "object") {
            return "unknown_error";
        }

        const err = error as Record<string, unknown>;
        const body = err["error"];

        if (body && typeof body === "object") {
            const errorBody = body as Record<string, unknown>;

            if (typeof errorBody["code"] === "string" && errorBody["code"].startsWith("ERR_")) {
                return errorBody["code"];
            }

            if (typeof errorBody["message"] === "string" && errorBody["message"].trim()) {
                return this._normalizeErrorKey(errorBody["message"]);
            }
        }

        if (typeof err["message"] === "string" && err["message"].trim()) {
            return this._normalizeErrorKey(err["message"]);
        }

        return "unknown_error";
    }

    isLivenessError(key: string): boolean {
        const normalized = key.toLowerCase();

        return normalized.includes("liveness") || normalized.includes("err_liveness") || normalized.includes("face_not");
    }

    translateErrorMessage(key: string, fallbackErrorKey: string = ""): string {
        const trimmed = key?.trim() || "";
        const mappedKey = this.API_MESSAGE_TO_KEY[trimmed] ?? trimmed;
        const formattedKey = `errors.${mappedKey}`;

        const translation = this._translocoService.translate(formattedKey);

        return translation !== formattedKey
            ? translation
            : fallbackErrorKey
              ? this._translocoService.translate(fallbackErrorKey)
              : this._defaultErrorMessage;
    }

    private _normalizeErrorKey(message: string): string {
        const withoutStatus = message.replace(/^\d{3}:/, "").trim();

        if (withoutStatus.startsWith("ERR_")) {
            return withoutStatus;
        }

        return withoutStatus.toLowerCase().replace(/\s+/g, "_");
    }
}
