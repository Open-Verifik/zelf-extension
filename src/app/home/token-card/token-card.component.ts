import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: "token-card",
    template: `
        <div class="card-container" fxLayout="row" fxLayoutAlign="start center" (click)="onClick()">
            <div class="status-icon-container">
                <img [src]="currentImage" [alt]="data.symbol" (error)="onImageError($event)" />
            </div>

            <div class="text-container" fxLayout="column" fxLayoutAlign="start start">
                <div class="token-card__network-info">
                    <p class="token-card__network">{{ data.symbol }}</p>
                    <p class="token-card__network-chip">{{ data.network }}</p>
                </div>

                <p class="token-card__name">{{ data.price | currency : "USD" : "symbol" : "1.2-5" }}</p>
            </div>

            <div class="amount-container" fxLayout="column" fxLayoutAlign="end end">
                <div class="token-card__balance">
                    {{ data.fiatBalance | currency : "USD" : "symbol" : "1.2-5" }}
                </div>

                <h4 class="stats stats--no-margin">
                    <div
                        class="stats__percentage"
                        [ngClass]="{
                            'stats__percentage--positive': false,
                            'stats__percentage--negative': false
                        }"
                    >
                        <!-- <span class="stats__arrow">
                            <ng-container *ngIf="true">
                                <svg width="9" height="6" viewBox="0 0 9 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.5 0.530273L0.5 4.53027L1.44 5.47027L4.5 2.41694L7.56 5.47027L8.5 4.53027L4.5 0.530273Z" />
                                </svg>
                            </ng-container>

                            <ng-container *ngIf="false">
                                <svg width="9" height="6" viewBox="0 0 9 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.5 5.46973L8.5 1.46973L7.56 0.529726L4.5 3.58306L1.44 0.529726L0.5 1.46973L4.5 5.46973Z" />
                                </svg>
                            </ng-container>
                        </span> -->

                        <span class="stats__text stats__text--colored">{{ data.amount }}</span>
                    </div>
                </h4>
            </div>
        </div>
    `,
    styleUrls: ["./token-card.component.scss"],
})
export class TokenCardComponent implements OnInit {
    @Input() data: any;
    @Input() view: string;
    @Input() shareables: any;
    currentImage!: string;

    constructor() {
        this.view = "default";
    }

    ngOnInit(): void {
        this.currentImage = this.data?.image || "/assets/images/token-placeholder.png";
    }

    onImageError(event: any) {
        this.currentImage = "/assets/images/token-placeholder.png";
    }

    onClick(): void {}
}
