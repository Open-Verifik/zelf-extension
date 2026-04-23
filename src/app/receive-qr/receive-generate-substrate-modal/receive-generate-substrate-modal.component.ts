import { Component, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TranslocoModule } from "@jsverse/transloco";

export interface ReceiveGenerateSubstrateModalData {
    fullTagName: string;
    symbol: "DOT" | "KSM";
}

@Component({
    selector: "receive-generate-substrate-modal",
    imports: [MatButtonModule, TranslocoModule],
    styleUrls: ["./receive-generate-substrate-modal.component.scss"],
    templateUrl: "./receive-generate-substrate-modal.component.html",
})
export class ReceiveGenerateSubstrateModalComponent {
    constructor(
        public dialogRef: MatDialogRef<ReceiveGenerateSubstrateModalComponent, boolean>,
        @Inject(MAT_DIALOG_DATA) public data: ReceiveGenerateSubstrateModalData
    ) {}

    cancel(): void {
        this.dialogRef.close(false);
    }

    continue(): void {
        this.dialogRef.close(true);
    }
}
