import { inject } from "@angular/core";
import { Router, type CanActivateFn } from "@angular/router";

import { WalletService } from "../wallet.service";
import { TagModel } from "../tags.service";

export const ZelfWalletGuard: CanActivateFn = async () => {
    const _walletService = inject(WalletService);
    const _router = inject(Router);

    const { wallet, wallets } = await _walletService.getAllWalletsFromStorage();

    const isCurrentWalletValid = Boolean(wallet?._id || wallet?.fullTagName || wallet?.name || wallet?.publicData?.tagName);

    if (isCurrentWalletValid) return true;

    if (wallets.length > 0) {
        const firstValidWallet = wallets.find((w) => w._id || w.fullTagName || w.name || w.publicData?.tagName);

        if (firstValidWallet) {
            await _walletService.switchWallet(new TagModel(firstValidWallet));

            return true;
        }
    }

    _router.navigate(["/welcome"], { replaceUrl: true });

    return false;
};
