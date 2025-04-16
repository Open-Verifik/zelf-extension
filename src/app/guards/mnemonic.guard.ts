import { inject } from "@angular/core";
import { Router, type CanActivateFn } from "@angular/router";
import { VaultService } from "app/vault.service";
import { ZelfNameService } from "app/zelf-name-service.service";

export const MnemonicGuard: CanActivateFn = async () => {
    const _vaultService = inject(VaultService);
    const _zelfNameService = inject(ZelfNameService);
    const router = inject(Router);

    const mnemonicCount = await _zelfNameService.getMnemonicCount();

    if (!_vaultService.mnemonic && !mnemonicCount) {
        const flow = await _zelfNameService.getFlow();

        if (!flow) router.navigate(["/welcome/onboarding"]);
        else if (flow === "import") router.navigate(["/welcome/import"]);
        else if (flow === "create") router.navigate(["/security"]);
        else if (flow === "unlock" || flow === "recover") return true;

        return false;
    }

    return true;
};
