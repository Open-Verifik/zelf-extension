import { inject } from "@angular/core";
import { Router, type CanActivateFn } from "@angular/router";
import { WalletService } from "app/wallet.service";

export const WelcomeCompleteWalletGuard: CanActivateFn = async () => {
    const _walletService = inject(WalletService);
    const router = inject(Router);

    const wallet = await _walletService.getCurrentWallet();

    if (!wallet?.publicData?.ethAddress) {
        router.navigate(["/welcome"]);

        return false;
    }

    return true;
};
