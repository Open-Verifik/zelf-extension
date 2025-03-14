import { CommonModule } from "@angular/common";
import { Component, Input, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@ngneat/transloco";
import { EventEmitter } from "@angular/core";

@Component({
    imports: [CommonModule, RouterModule, TranslocoModule, MatButtonModule],
    selector: "welcome-error",
    standalone: true,
    styleUrls: ["./welcome-error.component.scss"],
    templateUrl: "./welcome-error.component.html",
})
export class WelcomeErrorComponent {
    @Output() goBack = new EventEmitter<void>();

    @Input("errorTitle") errorTitle: string = this._translocoService.translate("errors.generic_title");
    @Input("errorMessage") errorMessage: string = this._translocoService.translate("errors.generic");

    constructor(private _translocoService: TranslocoService) {}

    triggerGoBack() {
        this.goBack.emit();
    }
}
