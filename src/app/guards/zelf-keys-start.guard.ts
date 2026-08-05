import { inject } from "@angular/core";
import { Router, type CanActivateFn } from "@angular/router";

import { ZelfKeysDataService } from "../services/zelf-keys-data.service";

/**
 * Instant redirect only when list data is already in memory.
 * Never blocks navigation on a network fetch — dashboard/vault load in-screen.
 */
export const ZelfKeysStartGuard: CanActivateFn = () => {
    const zelfKeysDataService = inject(ZelfKeysDataService);
    const router = inject(Router);

    const data = zelfKeysDataService.data;

    if (!data) return true;

    const hasAnyItems = data.passwords.length > 0 || data.paymentCards.length > 0;

    if (hasAnyItems) {
        void router.navigate(["/zelf-keys/vault"], { replaceUrl: true });

        return false;
    }

    return true;
};
