import { inject } from "@angular/core";
import { Router, type CanActivateFn } from "@angular/router";

import { ZelfKeysDataService } from "../services/zelf-keys-data.service";

export const ZelfKeysStartGuard: CanActivateFn = async () => {
    const zelfKeysDataService = inject(ZelfKeysDataService);
    const router = inject(Router);

    const data = await zelfKeysDataService.ensureLoadedForCurrentWallet({ reason: "start-guard" });
    const hasAnyItems = data.passwords.length > 0 || data.paymentCards.length > 0;

    if (hasAnyItems) {
        await router.navigate(["/zelf-keys/vault"], { replaceUrl: true });

        return false;
    }

    return true;
};
