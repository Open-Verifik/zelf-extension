import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { ZelfKeysData, ZelfKeysDataService } from "../services/zelf-keys-data.service";

export const ZelfKeysDataResolver: ResolveFn<ZelfKeysData> = async (
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
): Promise<ZelfKeysData> => {
    const _zelfKeysDataService = inject(ZelfKeysDataService);
    const existingData = _zelfKeysDataService.data;

    if (existingData) return existingData;

    return await _zelfKeysDataService.load();
};
