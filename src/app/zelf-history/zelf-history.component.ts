import { CurrencyPipe, DatePipe, DecimalPipe, KeyValuePipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from "@angular/common";
import { Component, OnInit, Input } from "@angular/core";
import { TranslocoModule } from "@ngneat/transloco";
import { AddressMaskPipe } from "app/pipes/address-mask.pipe";
import { Transaction } from "app/services/blockchain-transactions.service";
import { ActivityCardComponent } from "app/home/activity-card/activity-card.component";

type HistoryType = "send" | "receive" | "trade" | "approve";

type HistoryItem = {
    address: string;
    network: string;
    type: HistoryType;
    fiatAmount?: number | string;
    to: {
        address: string;
        amount: number | string;
        symbol: string;
        token: string;
        image: string;
    };
    from: {
        address: string;
        amount: number | string;
        symbol: string;
        token: string;
        image: string;
    };
};

type History = {
    [date: string]: HistoryItem[];
};

@Component({
    imports: [
        NgIf,
        NgClass,
        NgFor,
        NgTemplateOutlet,
        KeyValuePipe,
        DatePipe,
        TranslocoModule,
        DecimalPipe,
        CurrencyPipe,
        AddressMaskPipe,
        ActivityCardComponent,
    ],
    selector: "zelf-history",
    standalone: true,
    styleUrls: ["./zelf-history.component.scss"],
    templateUrl: "./zelf-history.component.html",
})
export class ZelfHistoryComponent implements OnInit {
    @Input() transactions: Transaction[] = [];

    history!: History;
    loading: boolean = true;

    ngOnInit(): void {
        this.loading = false;
    }
}
