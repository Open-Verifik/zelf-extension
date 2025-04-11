import { inject } from "@angular/core";
import type { ResolveFn } from "@angular/router";

import { AuthService } from "app/services/auth.service";

export const JWTResolver: ResolveFn<boolean> = async () => {
    const _authService = inject(AuthService);

    await _authService.checkAccessToken();

    return true;
};
