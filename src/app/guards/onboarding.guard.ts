import { inject } from "@angular/core";
import { type CanActivateFn } from "@angular/router";
import { ChromeService } from "../chrome.service";

export const OnboardingGuard: CanActivateFn = async () => {
    const _chromeService = inject(ChromeService);

    const isExtension = _chromeService.isExtension;
    const isPopout = _chromeService.isPopout;
    const isSidePanel = _chromeService.isSidePanel;

    if (isExtension) {
        if (isSidePanel) {
            _chromeService.openFullPage("welcome");

            await chrome.sidePanel.setOptions({
                path: "index.html",
                enabled: false,
            });

            return false;
        }

        if (isPopout) {
            _chromeService.openFullPage("welcome");

            return false;
        }

        return true;
    }

    return true;
};
