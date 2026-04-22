import { inject } from "@angular/core";
import { Router, type CanActivateFn } from "@angular/router";
import { VaultService } from "app/vault.service";

export const MnemonicInVaultGuard: CanActivateFn = () => {
    const _vaultService = inject(VaultService);
    const router = inject(Router);

    if (_vaultService.mnemonic && _vaultService.mnemonic.trim()) return true;

    router.navigate(["/welcome/find-import-mnemonic"]);

    return false;
};
