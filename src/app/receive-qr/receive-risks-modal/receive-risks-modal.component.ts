import { NgClass, NgFor, NgIf } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TranslocoModule } from "@jsverse/transloco";

export interface ReceiveRisksModalData {
    name: string;
    symbol: string;
    type: string;
}

interface Slide {
    titleKey: string;
    bodyKey: string;
    params: Record<string, string>;
}

@Component({
    selector: "receive-risks-modal",
    imports: [NgFor, NgIf, NgClass, MatButtonModule, TranslocoModule],
    templateUrl: "./receive-risks-modal.component.html",
    styleUrls: ["./receive-risks-modal.component.scss"],
})
export class ReceiveRisksModalComponent {
    current = 0;
    slides: Slide[];

    constructor(
        public dialogRef: MatDialogRef<ReceiveRisksModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ReceiveRisksModalData
    ) {
        const { name, symbol, type } = data;

        this.slides = [
            {
                titleKey: "receive.risks_modal.risk_1_title",
                bodyKey: "receive.risks_modal.risk_1",
                params: { name, symbol },
            },
            {
                titleKey: "receive.risks_modal.risk_2_title",
                bodyKey: "receive.risks_modal.risk_2",
                params: { name },
            },
            {
                titleKey: type ? "receive.risks_modal.risk_3_title" : "receive.risks_modal.risk_3_native_title",
                bodyKey: type ? "receive.risks_modal.risk_3" : "receive.risks_modal.risk_3_native",
                params: { type, symbol },
            },
            {
                titleKey: "receive.risks_modal.risk_4_title",
                bodyKey: "receive.risks_modal.risk_4",
                params: { symbol },
            },
        ];
    }

    next(): void {
        if (this.current < this.slides.length - 1) this.current++;
        else this.dialogRef.close();
    }

    prev(): void {
        if (this.current > 0) this.current--;
    }

    goTo(index: number): void {
        this.current = index;
    }

    get isLast(): boolean {
        return this.current === this.slides.length - 1;
    }
}
