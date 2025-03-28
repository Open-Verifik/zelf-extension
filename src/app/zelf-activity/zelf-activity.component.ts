import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";

import { ZelfPendingComponent } from "app/zelf-pending/zelf-pending.component";
import { ZelfHistoryComponent } from "app/zelf-history/zelf-history.component";

import { Transaction } from "app/services/blockchain-transactions.service";

type Tab = "history" | "pending";

@Component({
    imports: [CommonModule, ZelfPendingComponent, TranslocoModule, RouterModule, MatButtonModule, ZelfHistoryComponent],
    selector: "zelf-activity",
    standalone: true,
    styleUrls: ["./zelf-activity.component.scss"],
    templateUrl: "./zelf-activity.component.html",
})
export class ZelfActivityComponent implements OnInit {
    tab: Tab = "history";
    transactions: Transaction[] = [];

    constructor() {}

    ngOnInit(): void {}

    setTab(tab: Tab): void {
        this.tab = tab;
    }
}
