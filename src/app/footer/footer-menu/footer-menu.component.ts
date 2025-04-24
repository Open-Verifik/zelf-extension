import { NgIf, NgTemplateOutlet } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { RouterLink } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";
import { fadeScale } from "app/animations/fade-scale.animation";

@Component({
    selector: "footer-menu",
    animations: [fadeScale],
    imports: [NgIf, NgTemplateOutlet, TranslocoModule, RouterLink],
    templateUrl: "./footer-menu.component.html",
    styleUrls: ["./footer-menu.component.scss"],
})
export class FooterMenuComponent {
    showCloseButton: boolean = false;

    constructor(private _dialogRef: MatDialogRef<FooterMenuComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this._dialogRef.afterOpened().subscribe(() => {
            this.showCloseButton = true;
        });
    }

    private _animateThenClose(): void {
        this.showCloseButton = !this.showCloseButton;

        setTimeout(() => {
            this._dialogRef.close();
        }, 100);
    }

    close(): void {
        this._dialogRef.close();
    }

    onCloseButton(): void {
        this._animateThenClose();
    }
}
