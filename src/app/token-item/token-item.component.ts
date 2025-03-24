import { CurrencyPipe, DecimalPipe, NgIf } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
    imports: [NgIf, CurrencyPipe, DecimalPipe],
    selector: "token-item",
    standalone: true,
    styleUrls: ["./token-item.component.scss"],
    templateUrl: "./token-item.component.html",
})
export class TokenItemComponent {
    @Input("token") token: any;

    constructor() {
        this.token = {};
    }
}
