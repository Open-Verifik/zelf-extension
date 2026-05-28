import { NgIf } from "@angular/common";
import { Component, EventEmitter, Input, OnDestroy, Output } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { RouterLink } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";
import { Subject, takeUntil } from "rxjs";

import { ChromeService } from "app/chrome.service";

@Component({
    selector: "home-hub-header",
    standalone: true,
    imports: [FlexLayoutModule, NgIf, RouterLink, TranslocoModule],
    templateUrl: "./home-hub-header.component.html",
    styleUrls: ["./home-hub-header.component.scss"],
})
export class HomeHubHeaderComponent implements OnDestroy {
    @Input() walletName = "";
    @Input() showName = false;

    @Output() profileClick = new EventEmitter<void>();
    @Output() toggleNameClick = new EventEmitter<void>();

    isPopout = false;
    isSidePanel = false;

    private readonly _destroy$ = new Subject<void>();

    /** Popup or full-page tab — offer opening the side panel. */
    get showOpenSidebar(): boolean {
        return this.isPopout || !this.isSidePanel;
    }

    /** Popup or side panel — offer opening full page. */
    get showOpenFullscreen(): boolean {
        return this.isPopout || this.isSidePanel;
    }

    constructor(private _chromeService: ChromeService) {
        this.isPopout = this._chromeService.isPopout;
        this.isSidePanel = this._chromeService.isSidePanel;

        this._chromeService.isPopout$.pipe(takeUntil(this._destroy$)).subscribe((isPopout) => {
            this.isPopout = isPopout;
        });

        this._chromeService.isSidePanel$.pipe(takeUntil(this._destroy$)).subscribe((isSidePanel) => {
            this.isSidePanel = isSidePanel;
        });
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    async openSidePanel(): Promise<void> {
        if (browser.sidebarAction) {
            await browser.sidebarAction.open();
            return;
        }

        await this._chromeService.openSidePanel();
    }

    openFullScreen(): void {
        this._chromeService.openFullPage();
    }
}
