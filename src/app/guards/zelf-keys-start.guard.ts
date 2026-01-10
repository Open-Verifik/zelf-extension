import { inject } from "@angular/core";
import { Router, type CanActivateFn } from "@angular/router";

import { ZelfKeysDataService } from "../services/zelf-keys-data.service";

export const ZelfKeysStartGuard: CanActivateFn = async () => {
    const _zelfKeysDataService = inject(ZelfKeysDataService);
    const _router = inject(Router);

    // Get data from service (resolver should have already loaded it)
    // If not loaded yet, load it now
    let data = _zelfKeysDataService.data;

    if (!data) data = await _zelfKeysDataService.load();

    if (data) {
        const hasAnyItems = data.passwords.length > 0 || data.notes.length > 0 || data.paymentCards.length > 0;

        if (hasAnyItems) {
            _router.navigate(["/zelf-keys/passwords"], { replaceUrl: true });

            return false;
        }
    }

    return true;
};
