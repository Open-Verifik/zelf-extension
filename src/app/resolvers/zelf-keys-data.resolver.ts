import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { ZelfKeysData, ZelfKeysDataService } from "../services/zelf-keys-data.service";
import { WalletService } from "../wallet.service";

export const ZelfKeysDataResolver: ResolveFn<ZelfKeysData> = async (
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
): Promise<ZelfKeysData> => {
    const zelfKeysDataService = inject(ZelfKeysDataService);
    const walletService = inject(WalletService);

    const wallet = await walletService.getCurrentWallet();

    console.log("[Zelf Keys] route resolver enter", {
        storageWallet: wallet?.fullTagName ?? null,
        url: _state.url,
    });

    try {
        return await zelfKeysDataService.reloadForWalletSwitch("route-resolver");
    } catch (error) {
        console.error("[Zelf Keys] route resolver reload failed:", error);

        return zelfKeysDataService.ensureLoadedForCurrentWallet({
            forceRefresh: true,
            reason: "route-resolver-fallback",
        });
    }
};
