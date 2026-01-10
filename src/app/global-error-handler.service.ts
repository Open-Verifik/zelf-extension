import { ErrorHandler, Injectable, Injector } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    private _isHandlingSessionError = false;

    constructor(private _injector: Injector) {}

    handleError(error: any): void {
        if (this._isHandlingSessionError) {
            console.error("Error while handling session error:", error);

            return;
        }

        if (!this._isSessionError(error)) {
            console.error("Global error handler:", error);

            return;
        }

        const router = this._injector.get(Router);

        if (router.url.includes("/session-error")) return;

        this._isHandlingSessionError = true;

        setTimeout(() => {
            router.navigate(["/session-error"], { replaceUrl: true }).then(() => {
                this._isHandlingSessionError = false;
            });
        }, 0);
    }

    private _isSessionError(error: any): boolean {
        if (!error) return false;

        // Check HttpErrorResponse (most common case)
        if (error instanceof HttpErrorResponse) return error.url?.includes("/api/sessions") ?? false;

        // Extract URL from error object
        const errorUrl = error.url || error.error?.url;

        if (errorUrl?.includes("/api/sessions")) return true;

        // Check error messages as fallback
        const errorMessage = error.message || error.error?.message || "";

        return errorMessage.includes("/api/sessions") || errorMessage.includes("sessions");
    }
}
