import { NgClass, NgIf } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { RouterLink } from "@angular/router";
import { FooterMenuComponent } from "./footer-menu/footer-menu.component";

@Component({
    imports: [NgClass, RouterLink, NgIf],
    selector: "zelf-footer",
    styleUrls: ["../main.scss", "./footer.component.scss"],
    templateUrl: "./footer.component.html",
})
export class FooterComponent implements OnInit {
    @Input() shareables: any;

    constructor(private _dialog: MatDialog) {}

    ngOnInit(): void {}

    changeView(view: string): void {
        this.shareables.view = view;
    }

    openMenu(): void {
        this._dialog.open(FooterMenuComponent, {
            backdropClass: "zelf-backdrop",
            panelClass: "zelf-dialog",
            position: { bottom: "94px" },
            width: "100%",
            maxWidth: "90vw",
        });
    }
}
