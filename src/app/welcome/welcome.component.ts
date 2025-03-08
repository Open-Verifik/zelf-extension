import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

import { LanguageComponent } from "app/language/language.component";

@Component({
    selector: "welcome",
    standalone: true,
    imports: [CommonModule, RouterModule, LanguageComponent],
    templateUrl: "./welcome.component.html",
    styleUrls: ["./welcome.component.scss"],
})
export class WelcomeComponent {}
