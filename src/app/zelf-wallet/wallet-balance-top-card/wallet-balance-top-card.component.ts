import { CurrencyPipe, NgIf } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { RouterLink } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";

@Component({
    imports: [CurrencyPipe, FlexLayoutModule, NgIf, RouterLink, TranslocoModule],
    selector: "wallet-balance-top-card",
    // Do not add main.scss here: with emulated encapsulation it rewrites app-global rules and breaks the card/icons.
    // Global styles (including .zelf-action-button) already load on AppComponent.
    styleUrls: ["./wallet-balance-top-card.component.scss"],
    templateUrl: "./wallet-balance-top-card.component.html",
})
export class WalletBalanceTopCardComponent {
    @Input({ required: true }) totalFiatBalance!: number;
    @Input({ required: true }) balancesLoading!: boolean;
    @Input({ required: true }) hideBalances!: boolean;

    @Output() readonly refresh = new EventEmitter<void>();
    @Output() readonly toggleHide = new EventEmitter<void>();

    emitRefresh(): void {
        this.refresh.emit();
    }

    emitToggleHide(): void {
        this.toggleHide.emit();
    }
}
