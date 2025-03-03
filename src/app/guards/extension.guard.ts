import { inject } from "@angular/core";
import { Router, type CanActivateFn } from "@angular/router";
import { ChromeService } from "../chrome.service";

export const ExtensionGuard: CanActivateFn = () => {
    const _chromeService = inject(ChromeService);
    const router = inject(Router);

    if (!_chromeService.isExtension) return true;

    router.navigate(["/home"], { replaceUrl: true });

    return false;
};
