import { Router, type CanActivateFn } from "@angular/router";
import { DataPassingService } from "../services/data-passing.service";
import { inject } from "@angular/core";

export const ZelfKeysResultGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const _dataPassingService = inject(DataPassingService);

    // Extract the form type from the current route
    const url = state.url;

    let formType: string;
    let redirectRoute: string;

    if (url.includes("/passwords/result")) {
        formType = "passwords";
        redirectRoute = "/zelf-keys/passwords";
    } else if (url.includes("/notes/result")) {
        formType = "notes";
        redirectRoute = "/zelf-keys/notes";
    } else if (url.includes("/payment-cards/result")) {
        formType = "payment-cards";
        redirectRoute = "/zelf-keys/payment-cards";
    } else {
        router.navigate(["/zelf-keys"], { replaceUrl: true });
        return false;
    }

    if (!_dataPassingService.getResult(formType)) {
        router.navigate([redirectRoute], { replaceUrl: true });
        return false;
    }

    return true;
};
