import { NgClass, NgStyle } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
    selector: "zelf-loader",
    imports: [NgClass, NgStyle],
    templateUrl: "./zelf-loader.component.html",
    styleUrl: "./zelf-loader.component.scss",
})
export class ZelfLoaderComponent {
    @Input() absolute: boolean = true;
    @Input() diameter: number = 120;

    get logoDiameter(): number {
        return Math.max(this.diameter / 3, 24);
    }
}
