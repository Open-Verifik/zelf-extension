import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";

import { ZelfPendingComponent } from "app/zelf-pending/zelf-pending.component";
import { ZelfHistoryComponent } from "app/zelf-history/zelf-history.component";

type Tab = "history" | "pending";

@Component({
    imports: [CommonModule, ZelfPendingComponent, TranslocoModule, RouterModule, MatButtonModule, ZelfHistoryComponent],
    selector: "zelf-activity",
    styleUrls: ["./zelf-activity.component.scss"],
    templateUrl: "./zelf-activity.component.html",
})
export class ZelfActivityComponent implements OnInit {
    tab: Tab = "history";

    constructor() {}

    ngOnInit(): void {}

    setTab(tab: Tab): void {
        this.tab = tab;
    }
}
