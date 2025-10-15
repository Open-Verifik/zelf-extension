import { inject } from "@angular/core";
import { Router, type CanActivateFn } from "@angular/router";
import { WalletService } from "app/wallet.service";

export const WalletGuard: CanActivateFn = async () => {
    const _walletService = inject(WalletService);
    const router = inject(Router);

    const wallet = await _walletService.getCurrentWallet();

    console.log("WalletGuard - wallet:", wallet);
    console.log("WalletGuard - publicData:", wallet?.publicData);
    console.log("WalletGuard - ethAddress:", wallet?.publicData?.ethAddress);
    console.log("WalletGuard - publicData type:", wallet?.publicData?.constructor?.name);

    if (!wallet?.publicData?.ethAddress) {
        console.log("WalletGuard FAILED: No ethAddress found, redirecting to /welcome");
        router.navigate(["/welcome"]);

        return false;
    }

    console.log("WalletGuard PASSED: ethAddress found");
    return true;
};
