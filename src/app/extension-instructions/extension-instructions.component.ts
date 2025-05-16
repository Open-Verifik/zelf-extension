import { NgClass, NgIf } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { Router } from "@angular/router";
import { TranslocoPipe } from "@jsverse/transloco";

@Component({
    imports: [NgClass, NgIf, TranslocoPipe, FlexLayoutModule],
    selector: "extension-instructions",
    templateUrl: "./extension-instructions.component.html",
    styleUrls: ["./extension-instructions.component.scss", "../main.scss"],
})
export class ExtensionInstructionsComponent implements OnInit {
    currentSlide: number = 1;

    constructor(private _router: Router) {}

    ngOnInit(): void {}

    changeToSlide(slide: number): void {
        this.currentSlide = slide;

        if (this.currentSlide > 2) {
            this._router.navigate(["home"]);
        }
    }

    goBack(): void {
        this._router.navigate(["/onboarding"]);
    }
}
