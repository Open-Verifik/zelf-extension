import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, Router, type CanActivateFn } from "@angular/router";
import { PasswordDataService } from "../services/password-data.service";

export const ZelfKeysPasswordGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const router = inject(Router);
    const _passwordDataService = inject(PasswordDataService);

    if (!_passwordDataService.getCurrentPassword()) {
        router.navigate(["/zelf-keys/vault"], { replaceUrl: true });

        return false;
    }

    return true;
};
