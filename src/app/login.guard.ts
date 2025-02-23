import { Router, type CanActivateFn } from "@angular/router";

import { inject } from "@angular/core";
import { WalletService } from "./wallet.service";

export const LoginGuard: CanActivateFn = async (route, state) => {
    const _walletService = inject(WalletService);
    const router = inject(Router);

    const wallet = await _walletService.getWallet();
    const wallets = await _walletService.getWallets();

    if (!!wallet || wallets?.length) return true;

    if (state.url !== "/onboarding") {
        router.navigate(["/onboarding"], { replaceUrl: true });

        return false;
    }

    return true;
};
