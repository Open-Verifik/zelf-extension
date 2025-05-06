import { Component } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { TranslocoModule } from "@jsverse/transloco";

@Component({
    imports: [TranslocoModule, FlexLayoutModule],
    selector: "mobile-restricted",
    templateUrl: "./mobile-restricted.component.html",
    styleUrls: ["../../main.scss", "./mobile-restricted.component.scss"],
})
export class MobileRestrictedComponent {}
