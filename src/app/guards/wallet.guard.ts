import { inject } from "@angular/core";
import { Router, type CanActivateFn } from "@angular/router";
import { WalletService } from "app/wallet.service";

export const WalletGuard: CanActivateFn = async () => {
    const _walletService = inject(WalletService);
    const router = inject(Router);

    const wallet = await _walletService.getCurrentWallet();

    if (!wallet?.ethAddress) {
        router.navigate(["/welcome"]);

        return false;
    }

    return true;
};
