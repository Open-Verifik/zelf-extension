import { Component, Input, OnInit } from "@angular/core";
import { CurrencyPipe, DecimalPipe, NgClass } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { WalletService } from "app/wallet.service";

@Component({
    selector: "token-card",
    template: `
        <div class="card-container" fxLayout="row" fxLayoutAlign="start center" (click)="onClick()">
            <div class="status-icon-container">
                <img [src]="currentImage" [alt]="data.symbol" (error)="onImageError()" />
            </div>

            <div class="text-container" fxLayout="column" fxLayoutAlign="start start">
                <div class="token-card__network-info">
                    <p class="token-card__network">{{ data.symbol }}</p>
                    <p class="token-card__network-chip">{{ data.network }}</p>
                </div>

                <p class="token-card__name">{{ data.price | currency: "USD" : "symbol" : "1.2-5" }}</p>
            </div>

            <div class="amount-container" fxLayout="column" fxLayoutAlign="end end">
                <h4 class="stats stats--no-margin">
                    <div
                        class="stats__percentage"
                        [ngClass]="{
                            'stats__percentage--positive': false,
                            'stats__percentage--negative': false,
                        }"
                    >
                        <span class="stats__text stats__text--colored">{{ data.amount | number: "1.0-6" }}</span>
                    </div>
                </h4>

                <div class="token-card__balance">
                    {{ data.fiatBalance | currency: "USD" : "symbol" : "1.2-5" }}
                </div>
            </div>
        </div>
    `,
    styleUrls: ["./token-card.component.scss"],
    imports: [CurrencyPipe, NgClass, DecimalPipe, FlexLayoutModule],
})
export class TokenCardComponent implements OnInit {
    @Input() data: any;
    @Input() view: string;
    @Input() shareables: any;

    currentImage!: string;

    constructor(private _walletService: WalletService) {
        this.view = "default";
    }

    ngOnInit(): void {
        this.currentImage = this._walletService.getAssetImage(this.data.symbol, this.data?.image);
    }

    onImageError() {
        this.currentImage = this._walletService.getAssetImage(this.data.symbol, "/assets/images/token-placeholder.png");
    }

    onClick(): void {}
}
