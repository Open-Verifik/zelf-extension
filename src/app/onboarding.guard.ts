import { inject } from "@angular/core";
import { type CanActivateFn } from "@angular/router";
import { ChromeService } from "./chrome.service";

export const OnboardingGuard: CanActivateFn = async (route) => {
	const _chromeService = inject(ChromeService);

	const isPopout = _chromeService.isPopOut;
	const isSidePanel = _chromeService.isSidePanel;

	if (isPopout || isSidePanel) {
		_chromeService.openFullPage("onboarding");

		return false;
	}

	return true;
};
