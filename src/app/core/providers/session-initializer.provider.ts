import { inject, provideAppInitializer } from "@angular/core";

import { AuthService } from "../../services/auth.service";

async function initializeSession(): Promise<void> {
    const authService = inject(AuthService);
    await authService.checkAccessToken();
}

export function provideSessionInitializer() {
    return provideAppInitializer(initializeSession);
}
