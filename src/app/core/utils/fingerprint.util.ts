/**
 * Centralized fingerprint generation utility
 * Used for both session management and public key retrieval
 */

export interface UserFingerPrint {
    hash: string;
    userAgent: string;
    height: number;
    width: number;
}

/**
 * Generates a device fingerprint based on browser/device characteristics
 * NOTE: This is NOT unique per user, only per device/browser combination
 * Use generateUniqueFingerprint() for user-specific identification
 */
export function generateDeviceFingerprint(): string {
    const fingerprintParts = [
        navigator.userAgent, // Browser and OS info
        navigator.language, // Primary language
        screen.colorDepth.toString(), // Screen color depth
        screen.width.toString(), // Screen width
        screen.height.toString(), // Screen height
        navigator.platform, // Platform/OS
        navigator.hardwareConcurrency.toString(), // Number of CPU cores
        Intl.DateTimeFormat().resolvedOptions().timeZone, // Timezone
    ];

    return fingerprintParts.join("|");
}

/**
 * Generates a UNIQUE fingerprint by combining device fingerprint with wallet-specific data
 * This ensures each user has a unique identifier for rate limiting and encryption
 *
 * @param walletAddress - Optional wallet address (ethAddress or similar)
 * @param tagName - Optional user's tag name
 * @param domain - Optional domain
 * @returns A unique fingerprint string
 */
export function generateUniqueFingerprint(walletAddress?: string | null, tagName?: string | null, domain?: string | null): string {
    const deviceFingerprint = generateDeviceFingerprint();

    // Combine device fingerprint with wallet-specific data for true uniqueness
    const uniqueParts = [deviceFingerprint];

    if (walletAddress) uniqueParts.push(`wallet:${walletAddress}`);
    if (tagName) uniqueParts.push(`tag:${tagName}`);
    if (domain) uniqueParts.push(`domain:${domain}`);

    return uniqueParts.join("||");
}

/**
 * Generates a user fingerprint object with hash and metadata
 * @param walletAddress - Optional wallet address for unique identification
 * @param tagName - Optional tag name for unique identification
 * @param domain - Optional domain for unique identification
 */
export function generateUserFingerprint(walletAddress?: string | null, tagName?: string | null, domain?: string | null): UserFingerPrint {
    const navigatorInfo = window.navigator;
    const screenInfo = window.screen;

    const fingerprintString = generateUniqueFingerprint(walletAddress, tagName, domain);

    return {
        hash: simpleHash(fingerprintString),
        userAgent: navigatorInfo.userAgent,
        height: screenInfo.height,
        width: screenInfo.width,
    };
}

/**
 * Simple hash function that ALWAYS returns a positive number as a string
 * This ensures consistent identifier format across the application
 *
 * @param input - The string to hash
 * @returns A positive number as a string (unsigned 32-bit integer)
 */
export function simpleHash(input: string): string {
    let hash = 0;

    if (input.length === 0) {
        return "0";
    }

    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        // Use DJB2 hashing algorithm (better distribution than simple addition)
        hash = (hash << 5) + hash + char; // hash * 33 + char
    }

    // Convert to unsigned 32-bit integer to ensure positive number
    // Use >>> 0 to convert signed to unsigned
    const unsignedHash = hash >>> 0;

    return unsignedHash.toString();
}
