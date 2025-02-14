import { Router, type CanActivateFn } from "@angular/router";

import { inject } from "@angular/core";
import { WalletService } from "./wallet.service";

export const LoginGuard: CanActivateFn = async (route, state) => {
	const router = inject(Router);
	const _walletService = inject(WalletService);

	const wallet = await _walletService.getWallet();

	if (!!wallet) return true;

	if (state.url !== "/onboarding") {
		router.navigate(["/onboarding"], { replaceUrl: true });

		return false;
	}

	return true;
};
