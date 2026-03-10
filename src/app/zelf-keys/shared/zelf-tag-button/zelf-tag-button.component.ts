import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    imports: [CommonModule],
    selector: "zelf-tag-button",
    styleUrls: ["./zelf-tag-button.component.scss"],
    templateUrl: "./zelf-tag-button.component.html",
})
export class ZelfTagButtonComponent {
    @Input() tagName?: string = "";
    @Input() showIcon: boolean = true;
    @Input() isConnected: boolean = false;

    @Output() clicked = new EventEmitter<void>();

    onClick(): void {
        this.clicked.emit();
    }
}
