import { inject } from "@angular/core";
import { type CanActivateFn } from "@angular/router";
import { ChromeService } from "../chrome.service";

export const PopoutOnlyGuard: CanActivateFn = async () => {
    const _chromeService = inject(ChromeService);

    const isExtension = _chromeService.isExtension;
    const isPopout = _chromeService.isPopout;

    if (isExtension && !isPopout) return false;

    return true;
};
