import { Component } from "@angular/core";
import { TranslocoModule } from "@ngneat/transloco";

@Component({
    imports: [TranslocoModule],
    selector: "zelf-pending",
    standalone: true,
    styleUrls: ["./zelf-pending.component.scss"],
    templateUrl: "./zelf-pending.component.html",
})
export class ZelfPendingComponent {}
