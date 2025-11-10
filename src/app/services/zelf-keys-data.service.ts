import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { ChromeService } from "../chrome.service";
import { ZelfKeysService } from "./zelf-keys.service";

export interface ZelfKeysData {
    notes: any[];
    passwords: any[];
    paymentCards: any[];
}

const TTL_ONE_HOUR = 3600000; // 1 hour in milliseconds
const CACHE_KEY = "zelfKeysData";
const CACHE_TTL_KEY = "zelfKeysDataTtl";

@Injectable({
    providedIn: "root",
})
export class ZelfKeysDataService {
    private _data$ = new BehaviorSubject<ZelfKeysData | null>(null);
    private _error$ = new BehaviorSubject<string | null>(null);
    private _loading$ = new BehaviorSubject<boolean>(false);

    constructor(
        private _chromeService: ChromeService,
        private _zelfKeysService: ZelfKeysService
    ) {
        this._initializeFromCache();
    }

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

    private async _fetchDataFromApi(): Promise<ZelfKeysData> {
        const [passwordsResponse, notesResponse, paymentCardsResponse] = await Promise.all([
            this._zelfKeysService.list("password"),
            this._zelfKeysService.list("notes"),
            this._zelfKeysService.list("credit_card"),
        ]);

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

        return {
            passwords,
            notes,
            paymentCards,
        };
    }

    private async _initializeFromCache(): Promise<void> {
        try {
            const cacheTtl = await this._chromeService.getItemSession<number>(CACHE_TTL_KEY);
            const cachedData = await this._chromeService.getItemSession<ZelfKeysData>(CACHE_KEY);

            if (cacheTtl && cacheTtl > Date.now() && cachedData) {
                this._data$.next(cachedData);
            }
        } catch (error) {
            console.error("Error initializing from cache:", error);
        }
    }

    async clearCache(): Promise<void> {
        await this._chromeService.removeItemSession(CACHE_KEY);
        await this._chromeService.removeItemSession(CACHE_TTL_KEY);

        this._data$.next(null);
        this._loading$.next(false);
        this._error$.next(null);
    }

    /**
     * Load data from API (with caching)
     * @param forceRefresh - If true, bypass cache and fetch fresh data
     */
    async load(forceRefresh: boolean = false): Promise<ZelfKeysData> {
        this._loading$.next(true);
        this._error$.next(null);

        try {
            if (!forceRefresh) {
                const cacheTtl = await this._chromeService.getItemSession<number>(CACHE_TTL_KEY);
                const cachedData = await this._chromeService.getItemSession<ZelfKeysData>(CACHE_KEY);

                if (cacheTtl && cacheTtl > Date.now() && cachedData) {
                    this._data$.next(cachedData);
                    this._loading$.next(false);

                    return cachedData;
                }
            }

            const data = await this._fetchDataFromApi();

            await this._chromeService.setItemSession(CACHE_KEY, data);
            await this._chromeService.setItemSession(CACHE_TTL_KEY, Date.now() + TTL_ONE_HOUR);

            this._data$.next(data);
            this._loading$.next(false);

            return data;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to load ZelfKeys data";

            this._error$.next(errorMessage);
            this._loading$.next(false);

            const emptyData: ZelfKeysData = {
                passwords: [],
                notes: [],
                paymentCards: [],
            };

            this._data$.next(emptyData);

            return emptyData;
        }
    }

    async refresh(): Promise<ZelfKeysData> {
        return this.load(true);
    }
}
