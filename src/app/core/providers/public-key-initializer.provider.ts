import { inject, provideAppInitializer } from "@angular/core";

import { environment } from "environments/environment";
import { ChromeService } from "../../chrome.service";
import { HttpWrapperService } from "../../http-wrapper.service";
import { WalletService } from "../../wallet.service";

async function initializePublicKey(): Promise<void> {
    const walletService = inject(WalletService);
    const httpWrapperService = inject(HttpWrapperService);
    const chromeService = inject(ChromeService);
    const apiUrl = environment.apiUrl;

    const { hash } = walletService.getUserFingerprint();

    const url = `${apiUrl}/api/sessions/yek-cilbup`;

    try {
        const response = await httpWrapperService.sendRequest("get", url, {
            identifier: hash,
        });

        const publicKey = response.data;

        await chromeService.setItem("publicKey", publicKey);

        httpWrapperService.setPublicKey(publicKey);
    } catch (error) {
        console.error("Error loading public key:", error);
    }
}

export function providePublicKeyInitializer() {
    return provideAppInitializer(initializePublicKey);
}
