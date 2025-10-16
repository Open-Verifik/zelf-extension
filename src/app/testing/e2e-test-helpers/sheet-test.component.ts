import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";

@Component({
    selector: "sheet-test",
    imports: [CommonModule, MatButtonModule],
    template: `
        <div class="cta-sheet-test-container">
            <h1>Bottom Sheet Test</h1>
            <button id="open-cta-sheet" (click)="openCTASheet()">CTA Sheet</button>
        </div>
    `,
    styles: [
        `
            .cta-sheet-test-container {
                padding: 20px;
                text-align: center;
            }

            button {
                padding: 10px 20px;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
        `,
    ],
    styleUrls: ["../../main.scss"],
})
export class SheetTestComponent {
    constructor(private _bottomSheet: MatBottomSheet) {}

    openCTASheet(): void {
        return;
    }
}
