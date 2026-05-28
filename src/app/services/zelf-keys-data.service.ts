import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { ChromeService } from "../chrome.service";
import { TagModel } from "../tags.service";
import { WalletService } from "../wallet.service";
import { AuthService } from "./auth.service";
import { ZelfKeysService } from "./zelf-keys.service";

export interface ZelfKeysData {
    notes: any[];
    passwords: any[];
    paymentCards: any[];
}

const TTL_ONE_HOUR = 3600000;
const CACHE_KEY_PREFIX = "zelfKeysData";
const CACHE_TTL_PREFIX = "zelfKeysDataTtl";
const LEGACY_CACHE_KEY = "zelfKeysData";
const LEGACY_CACHE_TTL_KEY = "zelfKeysDataTtl";

@Injectable({
    providedIn: "root",
})
export class ZelfKeysDataService {
    private _data$ = new BehaviorSubject<ZelfKeysData | null>(null);
    private _error$ = new BehaviorSubject<string | null>(null);
    private _loading$ = new BehaviorSubject<boolean>(false);
    private _memoryOwnerTag: string | null = null;
    private _legacyCacheMigrated = false;
    private _loadPromise: Promise<ZelfKeysData> | null = null;
    private _loadPromiseOwnerTag: string | null = null;
    private _loadGeneration = 0;
    private _walletSwitchPromise: Promise<ZelfKeysData> | null = null;

    constructor(
        private _authService: AuthService,
        private _chromeService: ChromeService,
        private _walletService: WalletService,
        private _zelfKeysService: ZelfKeysService
    ) {}

    get data$(): Observable<ZelfKeysData | null> {
        return this._data$.asObservable();
    }

    get loading$(): Observable<boolean> {
        return this._loading$.asObservable();
    }

    get error$(): Observable<string | null> {
        return this._error$.asObservable();
    }

    get data(): ZelfKeysData | null {
        return this._data$.value;
    }

    get loading(): boolean {
        return this._loading$.value;
    }

    get error(): string | null {
        return this._error$.value;
    }

    get dataOwnerTag(): string | null {
        return this._memoryOwnerTag;
    }

    walletTagForCache(wallet: Partial<TagModel> | null | undefined): string {
        return this._walletTagForCache(wallet);
    }

    private _log(message: string, details: Record<string, unknown>): void {
        console.log(`[Zelf Keys] ${message}`, details);
    }

    private _walletTagForCache(wallet: Partial<TagModel> | null | undefined): string {
        const raw = wallet?.fullTagName || wallet?.publicData?.tagName || "";
        const tag = String(raw).trim().toLowerCase();

        return tag || "_none";
    }

    private _emptyData(): ZelfKeysData {
        return {
            passwords: [],
            notes: [],
            paymentCards: [],
        };
    }

    private async _getCacheKeys(): Promise<{ cacheKey: string; ttlKey: string; ownerTag: string }> {
        const wallet = await this._walletService.getCurrentWallet();
        const ownerTag = this._walletTagForCache(wallet);

        return {
            ownerTag,
            cacheKey: `${CACHE_KEY_PREFIX}:${ownerTag}`,
            ttlKey: `${CACHE_TTL_PREFIX}:${ownerTag}`,
        };
    }

    private async _removeLegacyGlobalCacheOnce(): Promise<void> {
        if (this._legacyCacheMigrated) return;

        this._legacyCacheMigrated = true;
        await this._chromeService.removeItemSession(LEGACY_CACHE_KEY);
        await this._chromeService.removeItemSession(LEGACY_CACHE_TTL_KEY);
    }

    private async _ensureSessionForFetch(wallet: Partial<TagModel> | null): Promise<string> {
        let token = await this._authService.ensureAccessTokenForCurrentWallet({ forceReauth: false });

        if (!this._authService.jwtMatchesCurrentWallet(token, wallet)) {
            this._log("JWT still mismatched after ensure — forcing reauth", {
                storageWallet: wallet?.fullTagName ?? null,
                storageTag: wallet?.tagName || wallet?.name || null,
                jwtTag: this._authService.getJwtSessionTag(token).tagName,
            });

            token = await this._authService.reauthenticateSession();
        }

        return token;
    }

    private async _fetchDataFromApi(ownerTag: string, reason: string, loadGeneration: number): Promise<ZelfKeysData> {
        const wallet = await this._walletService.getCurrentWallet();
        const token = await this._ensureSessionForFetch(wallet);
        const jwtTag = this._authService.getJwtSessionTag(token);

        this._log("fetch list from API", {
            reason,
            storageWallet: wallet?.fullTagName ?? null,
            ownerTag,
            jwtTagName: jwtTag.tagName,
            jwtDomain: jwtTag.domain,
        });

        const [passwordsResponse, notesResponse, paymentCardsResponse] = await Promise.all([
            this._zelfKeysService.list("password"),
            this._zelfKeysService.list("notes"),
            this._zelfKeysService.list("credit_card"),
        ]);

        const currentOwnerTag = this._walletTagForCache(await this._walletService.getCurrentWallet());
        if (currentOwnerTag !== ownerTag || loadGeneration !== this._loadGeneration) {
            this._log("discarding fetch — wallet changed mid-flight", {
                reason,
                expectedOwner: ownerTag,
                currentOwner: currentOwnerTag,
            });

            return this._emptyData();
        }

        const postFetchToken = await this._authService.ensureAccessTokenForCurrentWallet({ forceReauth: false });
        const postFetchWallet = await this._walletService.getCurrentWallet();

        if (!this._authService.jwtMatchesCurrentWallet(postFetchToken, postFetchWallet)) {
            this._log("discarding fetch — JWT no longer matches wallet after API call", {
                reason,
                ownerTag,
                jwtTag: this._authService.getJwtSessionTag(postFetchToken).tagName,
            });

            return this._emptyData();
        }

        const passwords =
            passwordsResponse?.data && Array.isArray(passwordsResponse.data)
                ? passwordsResponse.data
                : passwordsResponse?.data?.data && Array.isArray(passwordsResponse.data.data)
                  ? passwordsResponse.data.data
                  : [];

        const notes =
            notesResponse?.data && Array.isArray(notesResponse.data)
                ? notesResponse.data
                : notesResponse?.data?.data && Array.isArray(notesResponse.data.data)
                  ? notesResponse.data.data
                  : [];

        let paymentCards: any[] = [];

        const paymentCardsData = paymentCardsResponse?.data || paymentCardsResponse;

        if (paymentCardsData?.data && Array.isArray(paymentCardsData.data)) {
            paymentCards = paymentCardsData.data;
        } else if (Array.isArray(paymentCardsData)) {
            paymentCards = paymentCardsData;
        }

        this._log("fetch list result", {
            reason,
            ownerTag,
            jwtTagName: jwtTag.tagName,
            passwordCount: passwords.length,
            notesCount: notes.length,
            paymentCardCount: paymentCards.length,
        });

        return {
            passwords,
            notes,
            paymentCards,
        };
    }

    async clearCache(): Promise<void> {
        await this._removeLegacyGlobalCacheOnce();

        const { cacheKey, ttlKey, ownerTag } = await this._getCacheKeys();

        await this._chromeService.removeItemSession(cacheKey);
        await this._chromeService.removeItemSession(ttlKey);

        this._memoryOwnerTag = null;
        this._data$.next(null);
        this._loading$.next(false);
        this._error$.next(null);

        this._log("cache cleared", { ownerTag });
    }

    /**
     * Wallet switch entry point: clear cache, reauth for current wallet, reload.
     */
    async reloadForWalletSwitch(reason: string): Promise<ZelfKeysData> {
        if (this._walletSwitchPromise) {
            this._log("wallet switch reload already in progress — awaiting", { reason });
            return this._walletSwitchPromise;
        }

        this._walletSwitchPromise = this._reloadForWalletSwitchInternal(reason).finally(() => {
            this._walletSwitchPromise = null;
        });

        return this._walletSwitchPromise;
    }

    private async _reloadForWalletSwitchInternal(reason: string): Promise<ZelfKeysData> {
        this._loadGeneration += 1;
        this._loadPromise = null;
        this._loadPromiseOwnerTag = null;

        await this.clearCache();

        try {
            await this._authService.reauthenticateSession();
        } catch (error) {
            console.error("[Zelf Keys] wallet switch reauth failed:", error);
        }

        return this.ensureLoadedForCurrentWallet({
            forceRefresh: true,
            reason,
        });
    }

    /**
     * Load data scoped to the current wallet. Rejects in-memory/session cache from another wallet.
     */
    async ensureLoadedForCurrentWallet(options: { forceRefresh?: boolean; reason?: string } = {}): Promise<ZelfKeysData> {
        const { forceRefresh = false, reason = "ensure-loaded" } = options;
        const wallet = await this._walletService.getCurrentWallet();
        const ownerTag = this._walletTagForCache(wallet);

        this._log("ensureLoadedForCurrentWallet", {
            reason,
            storageWallet: wallet?.fullTagName ?? null,
            ownerTag,
            memoryOwnerTag: this._memoryOwnerTag,
            hasMemoryData: !!this._data$.value,
            forceRefresh,
        });

        if (!forceRefresh && this._data$.value && this._memoryOwnerTag === ownerTag) {
            this._log("using in-memory list", {
                reason,
                ownerTag,
                passwordCount: this._data$.value.passwords.length,
                notesCount: this._data$.value.notes.length,
                paymentCardCount: this._data$.value.paymentCards.length,
            });

            return this._data$.value;
        }

        if (this._memoryOwnerTag && this._memoryOwnerTag !== ownerTag) {
            this._log("wallet changed — dropping in-memory list", {
                reason,
                previousOwner: this._memoryOwnerTag,
                ownerTag,
            });

            this._data$.next(null);
            this._memoryOwnerTag = null;
        }

        return this.load(forceRefresh, reason);
    }

    async load(forceRefresh: boolean = false, reason: string = "load"): Promise<ZelfKeysData> {
        const { ownerTag } = await this._getCacheKeys();

        if (this._loadPromise && this._loadPromiseOwnerTag !== ownerTag) {
            this._log("load in progress for different wallet — starting fresh", {
                reason,
                inFlightOwner: this._loadPromiseOwnerTag,
                requestedOwner: ownerTag,
            });

            this._loadGeneration += 1;
            this._loadPromise = null;
            this._loadPromiseOwnerTag = null;
        }

        if (this._loadPromise) {
            this._log("load already in progress — awaiting", { reason, ownerTag });
            return this._loadPromise;
        }

        const loadGeneration = this._loadGeneration;
        this._loadPromiseOwnerTag = ownerTag;

        this._loadPromise = this._loadInternal(forceRefresh, reason, loadGeneration).finally(() => {
            if (this._loadPromiseOwnerTag === ownerTag) {
                this._loadPromise = null;
                this._loadPromiseOwnerTag = null;
            }
        });

        return this._loadPromise;
    }

    private async _loadInternal(forceRefresh: boolean, reason: string, loadGeneration: number): Promise<ZelfKeysData> {
        const emptyData = this._emptyData();

        await this._removeLegacyGlobalCacheOnce();

        const { cacheKey, ttlKey, ownerTag } = await this._getCacheKeys();
        const wallet = await this._walletService.getCurrentWallet();

        this._log("load start", {
            reason,
            forceRefresh,
            storageWallet: wallet?.fullTagName ?? null,
            ownerTag,
        });

        this._loading$.next(true);
        this._error$.next(null);

        try {
            if (!forceRefresh) {
                const cacheTtl = await this._chromeService.getItemSession<number>(ttlKey);
                const cachedData = await this._chromeService.getItemSession<ZelfKeysData>(cacheKey);

                if (cacheTtl && cacheTtl > Date.now() && cachedData) {
                    const currentOwnerTag = this._walletTagForCache(await this._walletService.getCurrentWallet());

                    if (currentOwnerTag !== ownerTag || loadGeneration !== this._loadGeneration) {
                        this._log("discarding session cache — wallet changed mid-flight", {
                            reason,
                            expectedOwner: ownerTag,
                            currentOwner: currentOwnerTag,
                        });

                        return emptyData;
                    }

                    this._memoryOwnerTag = ownerTag;
                    this._data$.next(cachedData);
                    this._loading$.next(false);

                    this._log("load from session cache", {
                        reason,
                        ownerTag,
                        passwordCount: cachedData.passwords.length,
                        notesCount: cachedData.notes.length,
                        paymentCardCount: cachedData.paymentCards.length,
                    });

                    return cachedData;
                }
            }

            const data = await this._fetchDataFromApi(ownerTag, reason, loadGeneration);

            const currentOwnerTag = this._walletTagForCache(await this._walletService.getCurrentWallet());

            if (currentOwnerTag !== ownerTag || loadGeneration !== this._loadGeneration) {
                this._log("discarding load result — wallet changed mid-flight", {
                    reason,
                    expectedOwner: ownerTag,
                    currentOwner: currentOwnerTag,
                });

                this._loading$.next(false);
                return emptyData;
            }

            await this._chromeService.setItemSession(cacheKey, data);
            await this._chromeService.setItemSession(ttlKey, Date.now() + TTL_ONE_HOUR);

            this._memoryOwnerTag = ownerTag;
            this._data$.next(data);
            this._loading$.next(false);

            return data;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to load ZelfKeys data";

            this._error$.next(errorMessage);
            this._loading$.next(false);
            this._memoryOwnerTag = ownerTag;
            this._data$.next(emptyData);

            this._log("load failed", { reason, ownerTag, error: errorMessage });

            return emptyData;
        }
    }

    async refresh(reason: string = "refresh"): Promise<ZelfKeysData> {
        return this.load(true, reason);
    }
}
