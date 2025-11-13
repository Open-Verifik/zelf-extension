import { Injectable } from "@angular/core";

/**
 * Seal Service - Zero-Knowledge Proofs and Secret Sharing
 *
 * Seal is Sui's zero-knowledge proof system for:
 * - Secret sharing (threshold schemes)
 * - Zero-knowledge proofs of ownership
 * - Privacy-preserving operations
 *
 * This is a foundational implementation that can be extended with
 * full Seal SDK integration when available.
 */

export interface SecretShare {
    shareId: string;
    shareData: string; // Base64 encoded share
    partyIndex: number;
    threshold: number;
    totalShares: number;
    participant?: string; // Wallet address or identifier
    createdAt: number;
}

export interface ShareConfig {
    threshold: number; // Minimum shares needed
    totalShares: number; // Total number of shares
    participants?: string[]; // Optional participant identifiers
}

@Injectable({
    providedIn: "root",
})
export class SealService {
    /**
     * Split a secret into multiple shares using Shamir's Secret Sharing
     * This is a simplified implementation - in production, use Seal SDK
     *
     * @param secret - The secret to share (setup key)
     * @param config - Configuration for sharing
     * @returns Array of secret shares
     */
    shareSecret(secret: string, config: ShareConfig): SecretShare[] {
        const { threshold, totalShares, participants } = config;

        if (threshold > totalShares) {
            throw new Error("Threshold cannot be greater than total shares");
        }

        if (threshold < 2) {
            throw new Error("Threshold must be at least 2");
        }

        // Convert secret to bytes and preserve original length
        const secretBytes = new TextEncoder().encode(secret);
        const originalLength = secretBytes.length;
        const secretNumber = this._bytesToBigInt(secretBytes);

        // Store original length in the first share for reconstruction
        // We'll encode it in the share metadata

        // Generate random polynomial coefficients
        const coefficients: bigint[] = [secretNumber];
        for (let i = 1; i < threshold; i++) {
            // Generate random coefficient (simplified - use crypto.randomBytes in production)
            const randomBytes = new Uint8Array(32);
            crypto.getRandomValues(randomBytes);
            coefficients.push(this._bytesToBigInt(randomBytes));
        }

        // Generate shares by evaluating polynomial at different x values
        const shares: SecretShare[] = [];
        const prime = this._getLargePrime();

        for (let i = 1; i <= totalShares; i++) {
            const x = BigInt(i);
            const y = this._evaluatePolynomial(coefficients, x, prime);

            const shareData = {
                x: Number(x),
                y: y.toString(),
                originalLength: originalLength, // Store original secret length
            };

            shares.push({
                shareId: `share_${Date.now()}_${i}`,
                shareData: btoa(JSON.stringify(shareData)),
                partyIndex: i,
                threshold,
                totalShares,
                participant: participants?.[i - 1],
                createdAt: Date.now(),
            });
        }

        return shares;
    }

    /**
     * Reconstruct secret from shares using Lagrange interpolation
     *
     * @param shares - Array of secret shares (need at least threshold shares)
     * @returns The reconstructed secret
     */
    reconstructSecret(shares: SecretShare[]): string {
        if (shares.length === 0) {
            throw new Error("No shares provided");
        }

        const threshold = shares[0].threshold;

        if (shares.length < threshold) {
            throw new Error(`Need at least ${threshold} shares, got ${shares.length}`);
        }

        // Use first 'threshold' shares
        const sharesForReconstruction = shares.slice(0, threshold);

        // Parse shares and extract original length
        const points: Array<{ x: bigint; y: bigint }> = [];
        let originalLength: number | undefined;
        for (const share of sharesForReconstruction) {
            try {
                const shareData = JSON.parse(atob(share.shareData));
                if (!shareData.x || !shareData.y) {
                    throw new Error(`Invalid share format: missing x or y in share ${share.shareId}`);
                }
                points.push({
                    x: BigInt(shareData.x),
                    y: BigInt(shareData.y),
                });
                // Extract original length from any share (they should all have it if generated with new code)
                if (originalLength === undefined && shareData.originalLength !== undefined) {
                    originalLength = shareData.originalLength;
                }
            } catch (error: any) {
                throw new Error(`Failed to parse share ${share.shareId}: ${error.message}`);
            }
        }

        // Log warning if originalLength is missing (for backward compatibility with old shares)
        if (originalLength === undefined) {
            console.warn("Warning: originalLength not found in shares. Reconstruction may be inaccurate if secret had leading zeros.");
        }

        if (points.length !== threshold) {
            throw new Error(`Failed to parse all shares: got ${points.length}, need ${threshold}`);
        }

        const prime = this._getLargePrime();

        // Lagrange interpolation at x = 0 to get the secret
        let secret: bigint;
        try {
            secret = this._lagrangeInterpolate(points, BigInt(0), prime);
            console.log("Reconstructed secret bigint:", secret.toString());
        } catch (error: any) {
            throw new Error(`Lagrange interpolation failed: ${error.message}`);
        }

        // Ensure secret is positive and within prime field
        // Handle negative results from modular arithmetic
        if (secret < 0) {
            secret = (secret + prime) % prime;
        }
        secret = secret % prime;

        // Convert back to string, preserving original length
        try {
            const result = this._bigIntToBytes(secret, originalLength);
            console.log("Reconstructed secret string length:", result.length);
            console.log("Original length:", originalLength);
            console.log("Reconstructed secret preview:", result.substring(0, Math.min(20, result.length)));

            if (!result || result.length === 0) {
                throw new Error("Reconstructed secret is empty after conversion");
            }

            return result;
        } catch (error: any) {
            throw new Error(`Failed to convert secret to bytes: ${error.message}`);
        }
    }

    /**
     * Generate a zero-knowledge proof of ownership
     * (Simplified - in production, use Seal SDK for actual ZK proofs)
     *
     * @param secret - The secret to prove ownership of
     * @param publicData - Public data that can be revealed
     * @returns Promise with proof data
     */
    async generateOwnershipProof(secret: string, publicData: { zotpId: string; issuer?: string; name: string }): Promise<string> {
        // In production, this would use Seal SDK to generate actual ZK proofs
        // For now, we create a verifiable commitment

        const commitment = await this._createCommitment(secret, publicData);

        // Store proof structure (in production, this would be a proper ZK proof)
        const proof = {
            commitment,
            publicData,
            timestamp: Date.now(),
            proofType: "ownership",
        };

        return btoa(JSON.stringify(proof));
    }

    /**
     * Verify a zero-knowledge proof
     *
     * @param proof - The proof to verify
     * @param publicData - Public data
     * @returns True if proof is valid
     */
    verifyOwnershipProof(proof: string, publicData: { zotpId: string; issuer?: string; name: string }): boolean {
        try {
            const proofData = JSON.parse(atob(proof));

            if (proofData.proofType !== "ownership") {
                return false;
            }

            // Verify public data matches
            if (proofData.publicData.zotpId !== publicData.zotpId) {
                return false;
            }

            // In production, verify actual ZK proof using Seal SDK
            // For now, verify commitment structure
            return !!proofData.commitment;
        } catch {
            return false;
        }
    }

    // Private helper methods

    private _bytesToBigInt(bytes: Uint8Array): bigint {
        let result = BigInt(0);
        for (let i = 0; i < bytes.length; i++) {
            result = result * BigInt(256) + BigInt(bytes[i]);
        }
        return result;
    }

    private _bigIntToBytes(bigInt: bigint, originalLength?: number): string {
        const bytes: number[] = [];
        let n = bigInt;

        // Handle zero case
        if (n === BigInt(0)) {
            if (originalLength && originalLength > 0) {
                // Return string of zeros if original length is known
                return "\0".repeat(originalLength);
            }
            return "";
        }

        // Convert bigint to bytes
        while (n > 0) {
            bytes.unshift(Number(n % BigInt(256)));
            n = n / BigInt(256);
        }

        // Pad with leading zeros if original length is known
        // This is critical for secrets that start with null bytes or small values
        if (originalLength !== undefined && bytes.length < originalLength) {
            const padding = originalLength - bytes.length;
            for (let i = 0; i < padding; i++) {
                bytes.unshift(0);
            }
        } else if (originalLength !== undefined && bytes.length > originalLength) {
            // If we have more bytes than expected, something went wrong
            // But we'll still try to decode it
            console.warn(`Reconstructed bytes length (${bytes.length}) exceeds original length (${originalLength})`);
        }

        // Decode bytes back to string
        try {
            const byteArray = new Uint8Array(bytes);
            const decoded = new TextDecoder().decode(byteArray);

            // Verify length matches if we have originalLength
            if (originalLength !== undefined && decoded.length !== originalLength) {
                console.warn(`Decoded string length (${decoded.length}) doesn't match original length (${originalLength})`);
            }

            return decoded;
        } catch (error) {
            // If decoding fails, try to reconstruct as string character by character
            // This handles cases where the secret might not be valid UTF-8
            const result = bytes.map((b) => String.fromCharCode(b)).join("");
            console.warn("TextDecoder failed, using character-by-character reconstruction");
            return result;
        }
    }

    private _getLargePrime(): bigint {
        // Use a large prime for finite field arithmetic
        // In production, use a cryptographically secure prime
        // This is a simplified version using a known large prime
        return BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617");
    }

    private _evaluatePolynomial(coefficients: bigint[], x: bigint, prime: bigint): bigint {
        let result = BigInt(0);
        let xPower = BigInt(1);

        for (const coeff of coefficients) {
            result = (result + ((coeff * xPower) % prime)) % prime;
            xPower = (xPower * x) % prime;
        }

        // Ensure result is positive
        return (result + prime) % prime;
    }

    private _lagrangeInterpolate(points: Array<{ x: bigint; y: bigint }>, x: bigint, prime: bigint): bigint {
        let result = BigInt(0);

        for (let i = 0; i < points.length; i++) {
            let numerator = BigInt(1);
            let denominator = BigInt(1);

            for (let j = 0; j < points.length; j++) {
                if (i !== j) {
                    // Handle negative numbers correctly in modular arithmetic
                    const numDiff = (x - points[j].x + prime) % prime;
                    const denDiff = (points[i].x - points[j].x + prime) % prime;
                    numerator = (numerator * numDiff) % prime;
                    denominator = (denominator * denDiff) % prime;
                }
            }

            const inv = this._modInverse(denominator, prime);
            const lagrangeBasis = (numerator * inv) % prime;
            result = (result + ((points[i].y * lagrangeBasis) % prime)) % prime;
        }

        // Ensure result is positive
        return (result + prime) % prime;
    }

    private _modInverse(a: bigint, m: bigint): bigint {
        // Extended Euclidean Algorithm
        let [oldR, r] = [a, m];
        let [oldS, s] = [BigInt(1), BigInt(0)];

        while (r !== BigInt(0)) {
            const quotient = oldR / r;
            [oldR, r] = [r, oldR - quotient * r];
            [oldS, s] = [s, oldS - quotient * s];
        }

        if (oldR > BigInt(1)) {
            throw new Error("Modular inverse does not exist");
        }

        return ((oldS % m) + m) % m;
    }

    private async _createCommitment(secret: string, publicData: any): Promise<string> {
        // Create a cryptographic commitment (hash of secret + public data)
        // In production, use proper commitment scheme
        const data = JSON.stringify({ secret, publicData });
        const encoder = new TextEncoder();
        const dataBytes = encoder.encode(data);

        const hashBuffer = await crypto.subtle.digest("SHA-256", dataBytes);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    }
}
