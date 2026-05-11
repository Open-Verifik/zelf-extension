/**
 * Dev-only helpers for Zelf Wallet (portfolio) load verification.
 * Chrome Performance → Timings row shows `zelfWalletLoad:*` marks and measures.
 */
import { environment } from "../../src/environments/environment";

const NS = "zelfWalletLoad";

let t0 = 0;

export function zelfWalletLoadPerfStart(): void {
    if (environment.production) return;
    t0 = performance.now();
}

export function zelfWalletLoadPerfMark(name: string): void {
    if (environment.production) return;
    try {
        performance.mark(`${NS}:${name}`);
    } catch {
        /* duplicate mark name on repeat loads */
    }
}

export function zelfWalletLoadPerfLog(phase: string, payload: Record<string, unknown>): void {
    if (environment.production) return;
    const elapsedMs = t0 ? Math.round(performance.now() - t0) : undefined;
    console.log("[ZelfWalletLoadPerf]", phase, { ...payload, elapsedMs });
}

export function zelfWalletLoadPerfMeasure(label: string, startName: string, endName: string): void {
    if (environment.production) return;
    try {
        performance.measure(`${NS}:${label}`, `${NS}:${startName}`, `${NS}:${endName}`);
    } catch {
        // Missing marks if a code path was skipped
    }
}
