import { inject } from "@angular/core";
import { Router, type CanActivateFn } from "@angular/router";
import { ZelfNameService } from "app/zelf-name-service.service";

export const ZelfNameGuard: CanActivateFn = async () => {
    const _zelfNameService = inject(ZelfNameService);
    const router = inject(Router);

    const zelfNameObject = await _zelfNameService.getZelfNameObject();
    const zelfName = await _zelfNameService.getZelfName();

    if (!zelfNameObject?.ethAddress && !zelfName) {
        router.navigate(["/welcome"]);

        return false;
    }

    return true;
};
