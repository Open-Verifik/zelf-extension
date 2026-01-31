import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { Subject, takeUntil } from "rxjs";

import { ThemeService } from "app/theme.service";

type UserModePreference = "system" | "dark" | "light";

@Component({
    imports: [CommonModule, MatButtonModule],
    selector: "zelf-theme",
    styleUrls: ["./zelf-theme.component.scss"],
    templateUrl: "./zelf-theme.component.html",
})
export class ZelfThemeComponent implements OnInit, OnDestroy {
    private unsubscriber$: Subject<void> = new Subject<void>();

    currentMode: UserModePreference = "system";

    constructor(private _themeService: ThemeService) {}

    ngOnInit(): void {
        this._themeService.currentMode$.pipe(takeUntil(this.unsubscriber$)).subscribe((mode: UserModePreference) => {
            this.currentMode = mode;
        });
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    async onThemeClick(): Promise<void> {
        this.currentMode = await this._themeService.cycleMode();
    }

    private async _loadCurrentMode(): Promise<void> {
        this.currentMode = await this._themeService.getUserModePreference();
    }
}
