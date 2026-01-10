import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class AppLoadingService {
    private _isLoading$ = new BehaviorSubject<boolean>(true);

    get isLoading$(): Observable<boolean> {
        return this._isLoading$.asObservable();
    }

    get isLoading(): boolean {
        return this._isLoading$.value;
    }

    start(): void {
        this._isLoading$.next(true);
    }

    stop(): void {
        this._isLoading$.next(false);
    }
}
