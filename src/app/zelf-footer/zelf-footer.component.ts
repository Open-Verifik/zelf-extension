import { NgIf } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FooterMenuComponent } from "./footer-menu/footer-menu.component";

@Component({
    imports: [NgIf, FooterMenuComponent],
    selector: "zelf-footer",
    styleUrls: ["../main.scss", "./zelf-footer.component.scss"],
    templateUrl: "./zelf-footer.component.html",
})
export class ZelfFooterComponent {
    @Input() shareables: any;
}
