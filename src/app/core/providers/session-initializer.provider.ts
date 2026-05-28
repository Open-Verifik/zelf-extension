import { inject, provideAppInitializer } from "@angular/core";

import { environment } from "environments/environment";
import { AuthService } from "../../services/auth.service";
import { ChromeService } from "../../chrome.service";
import { HttpWrapperService } from "../../http-wrapper.service";
import { WalletService } from "../../wallet.service";
import { generateUserFingerprint } from "../utils/fingerprint.util";

/**
 * Initializes both session and public key in a chained manner
 * This ensures they use the same identifier and are refreshed together
 * to prevent conflicts
 */
async function initializeSessionAndPublicKey(): Promise<void> {
    const authService = inject(AuthService);
    const httpWrapperService = inject(HttpWrapperService);
    const chromeService = inject(ChromeService);
    const walletService = inject(WalletService);
    const apiUrl = environment.apiUrl;

    // Step 1: Create/validate session (this also handles rate limiting)
    await authService.checkAccessToken();

    // Step 2: Get wallet data for unique fingerprint
    let walletAddress: string | null = null;
    let tagName: string | null = null;
    let domain: string | null = null;

    try {
        const currentWallet = await walletService.getCurrentWallet();
        if (currentWallet) {
            walletAddress = currentWallet.publicData?.ethAddress || null;
            tagName = currentWallet.tagName || currentWallet.name || null;
            domain = currentWallet.publicData?.domain || "zelf";
        }
    } catch (error) {
        // If wallet not available, use device fingerprint only
        console.warn("Could not get wallet for fingerprint:", error);
    }

    // Step 3: Fetch public key using the SAME unique identifier
    // This ensures consistency between session and encryption key
    const { hash } = generateUserFingerprint(walletAddress, tagName, domain);

    // Persist the canonical session identifier so the background script (which
    // can't compute a DOM-based fingerprint from its service worker context)
    // can read it from chrome.storage and stay aligned with the in-app session.
    await chromeService.setItem("sessionIdentifier", hash);

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
        // Don't throw - allow app to continue even if public key fetch fails
        // The app can retry later or handle encryption differently
    }
}

export function provideSessionInitializer() {
    return provideAppInitializer(initializeSessionAndPublicKey);
}
