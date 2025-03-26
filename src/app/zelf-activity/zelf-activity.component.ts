import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";

import { ZelfHistoryComponent } from "app/zelf-history/zelf-history.component";
import { ZelfPendingComponent } from "app/zelf-pending/zelf-pending.component";

type Tab = "history" | "pending";

@Component({
    imports: [CommonModule, ZelfHistoryComponent, ZelfPendingComponent, TranslocoModule, RouterModule, MatButtonModule],
    selector: "zelf-activity",
    standalone: true,
    styleUrls: ["./zelf-activity.component.scss"],
    templateUrl: "./zelf-activity.component.html",
})
export class ZelfActivityComponent {
    tab: Tab = "history";

    constructor() {}

    setTab(tab: Tab): void {
        this.tab = tab;
    }
}
