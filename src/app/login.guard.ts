import { Router, type CanActivateFn } from "@angular/router";

import { inject } from "@angular/core";
import { WalletService } from "./wallet.service";

export const LoginGuard: CanActivateFn = async (route, state) => {
    const _walletService = inject(WalletService);
    const router = inject(Router);

    const { wallet, wallets } = await _walletService.getAllWalletsFromStorage();

    if (!!wallet?.name || wallets?.length) return true;

    if (state.url !== "/onboarding") {
        router.navigate(["/onboarding"], { replaceUrl: true });

        return false;
    }

    return true;
};
