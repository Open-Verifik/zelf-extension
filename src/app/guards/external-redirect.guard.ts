import { type CanActivateFn } from "@angular/router";

export const ExternalRedirectGuard: CanActivateFn = (route) => {
    let url = route.queryParams["externalUrl"] || route.data["externalUrl"];

    window.open(url, "_blank");

    return false;
};
