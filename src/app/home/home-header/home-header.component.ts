import { NgIf } from "@angular/common";
import { Component, Input, OnDestroy } from "@angular/core";
import { MatBottomSheet, MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatDividerModule } from "@angular/material/divider";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslocoPipe } from "@jsverse/transloco";
import { Subject, takeUntil } from "rxjs";

import { ChromeService } from "app/chrome.service";
import { ZelfNamePipe } from "app/pipes/zelf-name.pipe";
import { Wallet } from "app/wallet";
import { HomeHeaderAccountsComponent } from "../home-header-accounts/home-header-accounts.component";

@Component({
    imports: [NgIf, MatBottomSheetModule, MatIconModule, MatMenuModule, MatDividerModule, TranslocoPipe, ZelfNamePipe],
    selector: "home-header",
    styleUrls: ["./home-header.component.scss", "../../main.scss"],
    template: `
        <div class="home-header" *ngIf="shareables.wallet">
            <div class="home-header__left home-header__container">&nbsp;</div>

            <div class="home-header__center home-header__container" (click)="openBottomSheet()">
                <div class="home-header__title-container">
                    <h4 class="home-header__title" *ngIf="shareables.wallet.publicData">
                        {{ shareables.wallet.publicData.zelfName | zelfName }}
                    </h4>

                    <svg class="home-header__dropdown-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M15.08 9.59L12 12.67L8.92 9.59L7.5 11L12 15.5L16.5 11L15.08 9.59ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z"
                        />
                    </svg>
                </div>
            </div>

            <div class="home-header__right home-header__container">
                <ng-container *ngIf="!(isExtension && (!isSidePanel || isPopout))">&nbsp;</ng-container>

                <button
                    [matMenuTriggerFor]="menu"
                    *ngIf="isExtension && (!isSidePanel || isPopout)"
                    class="zelf-icon-button zelf-icon-button--40 zelf-icon-button--anti-flash-white"
                    id="open-sidebar"
                    mat-flat-button
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                        <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
                    </svg>
                </button>

                <mat-menu class="zelf-menu" #menu>
                    <button
                        class="zelf-menu__button zelf-menu__button--icon-end"
                        mat-menu-item
                        (click)="openSidePanel()"
                        *ngIf="isPopout || !isSidePanel"
                    >
                        <span class="zelf-menu__button-text">{{ "common.open_in_sidebar" | transloco }}</span>

                        <mat-icon class="zelf-menu__button-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                                <path
                                    d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm440-80h120v-560H640v560Zm-80 0v-560H200v560h360Zm80 0h120-120Z"
                                />
                            </svg>
                        </mat-icon>
                    </button>

                    <button
                        class="zelf-menu__button zelf-menu__button--icon-end"
                        mat-menu-item
                        (click)="openFullScreen()"
                        *ngIf="isPopout || isSidePanel"
                    >
                        <span class="zelf-menu__button-text">{{ "common.open_fullscreen" | transloco }}</span>

                        <mat-icon class="zelf-menu__button-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                                <path
                                    d="M120-120v-200h80v120h120v80H120Zm520 0v-80h120v-120h80v200H640ZM120-640v-200h200v80H200v120h-80Zm640 0v-120H640v-80h200v200h-80Z"
                                />
                            </svg>
                        </mat-icon>
                    </button>
                </mat-menu>
            </div>
        </div>

        <mat-menu #settingsMenu="matMenu" xPosition="before" yPosition="above">
            <button mat-menu-item>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM19.46 9.12L16.68 10.27C16.17 8.91 15.1 7.83 13.73 7.33L14.88 4.55C16.98 5.35 18.65 7.02 19.46 9.12ZM12 15C10.34 15 9 13.66 9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12C15 13.66 13.66 15 12 15ZM9.13 4.54L10.3 7.32C8.92 7.82 7.83 8.91 7.32 10.29L4.54 9.13C5.35 7.02 7.02 5.35 9.13 4.54ZM4.54 14.87L7.32 13.72C7.83 15.1 8.91 16.18 10.29 16.68L9.12 19.46C7.02 18.65 5.35 16.98 4.54 14.87ZM14.88 19.46L13.73 16.68C15.1 16.17 16.18 15.09 16.68 13.71L19.46 14.88C18.65 16.98 16.98 18.65 14.88 19.46Z"
                        fill="#46464F"
                    />
                </svg>

                <span class="mat-menu-item-text">{{ "home.support_button" | transloco }}</span>
            </button>

            <mat-divider></mat-divider>

            <button mat-menu-item>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M19.4328 12.98C19.4728 12.66 19.5028 12.34 19.5028 12C19.5028 11.66 19.4728 11.34 19.4328 11.02L21.5428 9.37C21.7328 9.22 21.7828 8.95 21.6628 8.73L19.6628 5.27C19.5728 5.11 19.4028 5.02 19.2228 5.02C19.1628 5.02 19.1028 5.03 19.0528 5.05L16.5628 6.05C16.0428 5.65 15.4828 5.32 14.8728 5.07L14.4928 2.42C14.4628 2.18 14.2528 2 14.0028 2H10.0028C9.75277 2 9.54277 2.18 9.51277 2.42L9.13277 5.07C8.52277 5.32 7.96277 5.66 7.44277 6.05L4.95277 5.05C4.89277 5.03 4.83277 5.02 4.77277 5.02C4.60277 5.02 4.43277 5.11 4.34277 5.27L2.34277 8.73C2.21277 8.95 2.27277 9.22 2.46277 9.37L4.57277 11.02C4.53277 11.34 4.50277 11.67 4.50277 12C4.50277 12.33 4.53277 12.66 4.57277 12.98L2.46277 14.63C2.27277 14.78 2.22277 15.05 2.34277 15.27L4.34277 18.73C4.43277 18.89 4.60277 18.98 4.78277 18.98C4.84277 18.98 4.90277 18.97 4.95277 18.95L7.44277 17.95C7.96277 18.35 8.52277 18.68 9.13277 18.93L9.51277 21.58C9.54277 21.82 9.75277 22 10.0028 22H14.0028C14.2528 22 14.4628 21.82 14.4928 21.58L14.8728 18.93C15.4828 18.68 16.0428 18.34 16.5628 17.95L19.0528 18.95C19.1128 18.97 19.1728 18.98 19.2328 18.98C19.4028 18.98 19.5728 18.89 19.6628 18.73L21.6628 15.27C21.7828 15.05 21.7328 14.78 21.5428 14.63L19.4328 12.98ZM17.4528 11.27C17.4928 11.58 17.5028 11.79 17.5028 12C17.5028 12.21 17.4828 12.43 17.4528 12.73L17.3128 13.86L18.2028 14.56L19.2828 15.4L18.5828 16.61L17.3128 16.1L16.2728 15.68L15.3728 16.36C14.9428 16.68 14.5328 16.92 14.1228 17.09L13.0628 17.52L12.9028 18.65L12.7028 20H11.3028L10.9528 17.52L9.89277 17.09C9.46277 16.91 9.06277 16.68 8.66277 16.38L7.75277 15.68L6.69277 16.11L5.42277 16.62L4.72277 15.41L5.80277 14.57L6.69277 13.87L6.55277 12.74C6.52277 12.43 6.50277 12.2 6.50277 12C6.50277 11.8 6.52277 11.57 6.55277 11.27L6.69277 10.14L5.80277 9.44L4.72277 8.6L5.42277 7.39L6.69277 7.9L7.73277 8.32L8.63277 7.64C9.06277 7.32 9.47277 7.08 9.88277 6.91L10.9428 6.48L11.1028 5.35L11.3028 4H12.6928L13.0428 6.48L14.1028 6.91C14.5328 7.09 14.9328 7.32 15.3328 7.62L16.2428 8.32L17.3028 7.89L18.5728 7.38L19.2728 8.59L18.2028 9.44L17.3128 10.14L17.4528 11.27ZM12.0028 8C9.79277 8 8.00277 9.79 8.00277 12C8.00277 14.21 9.79277 16 12.0028 16C14.2128 16 16.0028 14.21 16.0028 12C16.0028 9.79 14.2128 8 12.0028 8ZM12.0028 14C10.9028 14 10.0028 13.1 10.0028 12C10.0028 10.9 10.9028 10 12.0028 10C13.1028 10 14.0028 10.9 14.0028 12C14.0028 13.1 13.1028 14 12.0028 14Z"
                        fill="#46464F"
                    />
                </svg>
                <span class="mat-menu-item-text">{{ "home.settings_button" | transloco }}</span>
            </button>
        </mat-menu>
    `,
})
export class HomeHeaderComponent implements OnDestroy {
    @Input() shareables: any;

    private unsubscriber$: Subject<void> = new Subject();

    balances: any;
    isExtension: boolean = false;
    isPopout: boolean = false;
    isSidePanel: boolean = false;
    selectedTab: string;
    title: string = "something";
    view: string;
    wallet!: Wallet;

    constructor(
        private _router: Router,
        private route: ActivatedRoute,
        private _chromeService: ChromeService,
        private _bottomSheet: MatBottomSheet
    ) {
        this.view = "home";
        this.selectedTab = "assets";

        this.isExtension = this._chromeService.isExtension;
        this.isPopout = this._chromeService.isPopout;
        this.isSidePanel = this._chromeService.isSidePanel;

        this._chromeService.isPopout$.pipe(takeUntil(this.unsubscriber$)).subscribe((isPopout) => {
            this.isPopout = isPopout;
        });

        this._chromeService.isSidePanel$.pipe(takeUntil(this.unsubscriber$)).subscribe((isSidePanel) => {
            this.isSidePanel = isSidePanel;
        });
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    async openSidePanel(): Promise<void> {
        if (browser.sidebarAction) return browser.sidebarAction.open();

        this._chromeService.openSidePanel();
    }

    openBottomSheet(): void {
        this._bottomSheet.open(HomeHeaderAccountsComponent, {
            backdropClass: "zelf-backdrop",
            panelClass: "zelf-bottom-sheet-seasalt",
            data: this.shareables,
        });
    }

    openAccountsPage(): void {
        this.shareables.view = this.shareables.view === "home" ? "accountsPage" : "home";

        this.updateView(this.shareables.view);
    }

    openNetworkPicker(): void {
        this.shareables.view = this.shareables.view === "home" ? "networkPickerPage" : "home";

        this.updateView(this.shareables.view);
    }

    openFullScreen(): void {
        this._chromeService.openFullPage("home");
    }

    // Method to update the URL when the variable changes
    updateView(newView: string): void {
        this.view = newView;

        this._router.navigate([], {
            relativeTo: this.route, // Keep the current route
            queryParams: { view: this.view }, // Set new query params
            queryParamsHandling: "merge", // Merge with existing query params
        });
    }
}
