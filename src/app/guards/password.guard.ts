import { inject } from "@angular/core";
import { Router, type CanActivateFn } from "@angular/router";
import { VaultService } from "app/vault.service";

export const PasswordGuard: CanActivateFn = () => {
    const _vaultService = inject(VaultService);
    const router = inject(Router);

    if (!_vaultService.password) {
        router.navigate(["/security/password"], { replaceUrl: true });

        return false;
    }

    return true;
};
