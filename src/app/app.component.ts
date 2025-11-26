import { Component, Injector, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { Subject, takeUntil } from "rxjs";

import { ChromeService } from "./chrome.service";
import { AutofillDataService } from "./services/autofill-data.service";
import { AutofillIntegrationService } from "./services/autofill-integration.service";
import { PopoutCommunicationService } from "./services/popout-communication.service";
import { AppLoadingService } from "./services/app-loading.service";

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: "app-root",
    standalone: false,
    styleUrls: ["./app.component.scss", "./main.scss"],
    template: `<div class="flex flex-col flex-auto main-div" [ngClass]="isPopout ? 'main-div--popout' : ''">
        <div class="app-loading-overlay" *ngIf="isLoading$ | async">
            <zelf-loader [diameter]="120" [absolute]="false"></zelf-loader>
        </div>
        <div class="flex flex-col flex-auto">
            <router-outlet></router-outlet>
        </div>
    </div>`,
})
export class AppComponent implements OnInit, OnDestroy {
    private unsubscriber$ = new Subject<void>();

    isPopout: boolean = false;
    isLoading$!: any;

    constructor(
        private _appLoadingService: AppLoadingService,
        private _chromeService: ChromeService,
        private _injector: Injector,
        private _popoutCommunicationService: PopoutCommunicationService
    ) {
        this.isLoading$ = this._appLoadingService.isLoading$;
        this._initializeRequiredServices();

        this.isPopout = this._chromeService.isPopout;

        this._chromeService.isPopout$.pipe(takeUntil(this.unsubscriber$)).subscribe((isPopout) => {
            this.isPopout = isPopout;
        });
    }

    ngOnInit(): void {
        this.checkForPendingDecryption();
        this.notifyPopupReady();
        this.setupNavigationListener();
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    private checkForPendingDecryption(): void {
        if (!this.isPopout) return;

        const decryptionData = this._popoutCommunicationService.getDecryptionData();

        if (!decryptionData) return;
    }

    private notifyPopupReady(): void {
        if (this.isPopout && typeof chrome !== "undefined" && chrome.runtime) {
            chrome.runtime.sendMessage({
                type: "POPUP_READY",
            });
        }
    }

    private setupNavigationListener(): void {
        if (typeof chrome === "undefined" || !chrome.runtime) return;
    }

    /**
     * These services are required and must be initialized along with the application.
     */
    private _initializeRequiredServices(): void {
        this._injector.get(AutofillIntegrationService);
        this._injector.get(AutofillDataService);
    }
}
