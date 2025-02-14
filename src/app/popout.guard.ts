import { inject } from "@angular/core";
import { Router, type CanActivateFn } from "@angular/router";
import { ChromeService } from "./chrome.service";
import { WalletService } from "./wallet.service";

export const PopoutGuard: CanActivateFn = async () => {
	const router = inject(Router);
	const _chromeService = inject(ChromeService);
	const _walletService = inject(WalletService);

	const isInPopout = _chromeService.isInExtensionPopOut();
	const wallet = await _walletService.getWallet();

	if (isInPopout) {
		_chromeService.openFullPage("onboarding");

		return false;
	}

	if (!wallet) return true;

	router.navigate(["/"], { replaceUrl: true });

	return false;
};
