import { AsyncPipe, NgIf } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";

import { FooterNavigationService } from "../footer-navigation.service";

@Component({
    imports: [NgIf, AsyncPipe, TranslocoModule, RouterLink],
    selector: "footer-menu",
    styleUrls: ["./footer-menu.component.scss"],
    templateUrl: "./footer-menu.component.html",
})
export class FooterMenuComponent {
    @Input() shareables: any;

    constructor(
        public navService: FooterNavigationService,
        private readonly _router: Router
    ) {}

    openAppsHub(): void {
        const path = this._router.url.split("?")[0];
        let hubQuickContext: "zelf-keys" | "zelf-authenticator" | undefined;
        if (path.startsWith("/zelf-keys")) {
            hubQuickContext = "zelf-keys";
        } else if (path.startsWith("/zelf-authenticator")) {
            hubQuickContext = "zelf-authenticator";
        }
        void this._router.navigate(["/apps"], {
            state: hubQuickContext ? { hubQuickContext } : {},
        });
    }
}
