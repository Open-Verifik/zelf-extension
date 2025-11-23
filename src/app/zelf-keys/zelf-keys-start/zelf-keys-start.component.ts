import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";

@Component({
    imports: [CommonModule, TranslocoModule, RouterModule],
    selector: "zelf-keys-start",
    styleUrls: ["./zelf-keys-start.component.scss"],
    templateUrl: "./zelf-keys-start.component.html",
})
export class ZelfKeysStartComponent {}
