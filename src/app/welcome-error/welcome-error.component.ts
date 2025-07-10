import { CommonModule } from "@angular/common";
import { Component, Input, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { EventEmitter } from "@angular/core";

@Component({
    imports: [CommonModule, RouterModule, TranslocoModule, MatButtonModule],
    selector: "welcome-error",
    styleUrls: ["./welcome-error.component.scss"],
    templateUrl: "./welcome-error.component.html",
})
export class WelcomeErrorComponent {
    @Output() goBack = new EventEmitter<void>();

    @Input("errorTitle") errorTitle: string = "";
    @Input("errorMessage") errorMessage: string = "";

    constructor(private _translocoService: TranslocoService) {
        this.errorTitle = this._translocoService.translate("errors.generic_title");
        this.errorMessage = this._translocoService.translate("errors.generic");
    }

    triggerGoBack() {
        this.goBack.emit();
    }
}
