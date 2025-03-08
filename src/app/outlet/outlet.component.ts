import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
    selector: "outlet",
    standalone: true,
    imports: [RouterModule],
    templateUrl: "./outlet.component.html",
    styleUrls: ["./outlet.component.scss"],
})
export class OutletComponent {}
