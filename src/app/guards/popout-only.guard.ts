import { inject } from "@angular/core";
import { type CanActivateFn, Router } from "@angular/router";
import { ChromeService } from "../chrome.service";

export const PopoutOnlyGuard: CanActivateFn = async () => {
    const _chromeService = inject(ChromeService);
    const _router = inject(Router);

    const isExtension = _chromeService.isExtension;
    const isPopout = _chromeService.isPopout;

    if (isExtension && !isPopout) {
        // If not in popout mode, redirect to dashboard
        _router.navigate(["/dashboard"]);
        return false;
    }

    return true;
};
