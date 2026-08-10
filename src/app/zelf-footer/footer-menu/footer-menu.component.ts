import { AsyncPipe, NgIf } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";
import { Observable } from "rxjs";

import { ShellLayoutService } from "app/services/shell-layout.service";
import { FooterNavigationService } from "../footer-navigation.service";

@Component({
    imports: [NgIf, AsyncPipe, TranslocoModule, RouterLink],
    selector: "footer-menu",
    styleUrls: ["./footer-menu.component.scss"],
    templateUrl: "./footer-menu.component.html",
})
export class FooterMenuComponent {
    @Input() shareables: any;

    isDeepShell$: Observable<boolean>;

    constructor(
        public navService: FooterNavigationService,
        private readonly _router: Router,
        private readonly _shellLayout: ShellLayoutService
    ) {
        this.isDeepShell$ = this._shellLayout.isDeepShell$;
    }

    openAppsHub(): void {
        const path = this._router.url.split("?")[0];
        const hubQuickContext = path.startsWith("/zelf-authenticator") ? "zelf-authenticator" : undefined;
        void this._router.navigate(["/apps"], {
            state: hubQuickContext ? { hubQuickContext } : {},
        });
    }

    onDeepAdd(): void {
        void this._shellLayout.navigateToDeepAdd();
    }
}
