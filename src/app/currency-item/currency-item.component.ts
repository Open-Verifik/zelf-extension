import { CurrencyPipe, NgIf } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
    imports: [NgIf, CurrencyPipe],
    selector: "currency-item",
    standalone: true,
    styleUrls: ["./currency-item.component.scss"],
    templateUrl: "./currency-item.component.html",
})
export class CurrencyItemComponent {
    @Input("currency") currency: any;

    constructor() {
        this.currency = {};
    }
}
