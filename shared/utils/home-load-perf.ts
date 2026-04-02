/**
 * Dev-only helpers for Home load verification: compare when `fullTagName` is set vs when
 * `balancesLoading` clears, and expose User Timing marks for Chrome Performance / DevTools.
 *
 * In Chrome: Performance recording → Timings row shows `homeLoad:*` marks and measures.
 * Console (non-production): `[HomeLoadPerf]` uses `console.log` so messages show with default DevTools filters.
 */
import { environment } from "../../src/environments/environment";

const NS = "homeLoad";

let t0 = 0;

export function homeLoadPerfStart(): void {
    if (environment.production) return;
    t0 = performance.now();
}

export function homeLoadPerfMark(name: string): void {
    if (environment.production) return;
    try {
        performance.mark(`${NS}:${name}`);
    } catch {
        /* duplicate mark name on repeat loads */
    }
}

export function homeLoadPerfLog(phase: string, payload: Record<string, unknown>): void {
    if (environment.production) return;
    const elapsedMs = t0 ? Math.round(performance.now() - t0) : undefined;
    console.log("[HomeLoadPerf]", phase, { ...payload, elapsedMs });
}

export function homeLoadPerfMeasure(label: string, startName: string, endName: string): void {
    if (environment.production) return;
    try {
        performance.measure(`${NS}:${label}`, `${NS}:${startName}`, `${NS}:${endName}`);
    } catch {
        // Missing marks if a code path was skipped
    }
}
