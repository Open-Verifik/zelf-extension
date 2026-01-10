import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

export interface ScrollToSectionEvent {
    sectionId: string;
    component: "password" | "note" | "payment-card";
}

@Injectable({
    providedIn: "root",
})
export class ScrollToSectionService {
    private _scrollEvent$ = new BehaviorSubject<ScrollToSectionEvent | null>(null);

    /**
     * Trigger a scroll to a specific section
     */
    scrollToSection(sectionId: string, component: "password" | "note" | "payment-card"): void {
        this._scrollEvent$.next({ sectionId, component });
    }

    /**
     * Get the scroll event observable
     */
    get scrollEvent$(): Observable<ScrollToSectionEvent | null> {
        return this._scrollEvent$.asObservable();
    }

    /**
     * Clear the current scroll event
     */
    clearScrollEvent(): void {
        this._scrollEvent$.next(null);
    }
}
