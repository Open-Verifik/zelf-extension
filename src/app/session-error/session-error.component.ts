import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";
import { LanguageComponent } from "app/language/language.component";

@Component({
    imports: [CommonModule, RouterModule, TranslocoModule, MatButtonModule, LanguageComponent],
    selector: "session-error",
    styleUrls: ["./session-error.component.scss"],
    templateUrl: "./session-error.component.html",
})
export class SessionErrorComponent {
    constructor(private _router: Router) {}

    tryAgain() {
        this._router.navigate(["/"], { replaceUrl: true });
    }

    async goToDownload(): Promise<void> {
        await this._router.navigate(["/external-link"], {
            queryParams: {
                externalUrl: "https://zelf.world/download/",
            },
        });
    }
}
