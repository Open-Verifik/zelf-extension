import { NgIf } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

type ConfirmationData = {
    title: string;
    message: string;
    cancel: string;
    confirm: string;
    destructiveButton?: boolean;
};

@Component({
    selector: "confirmation-dialog",
    imports: [NgIf, MatButtonModule],
    templateUrl: "./confirmation-dialog.component.html",
    styleUrls: ["./confirmation-dialog.component.scss"],
})
export class ConfirmationDialogComponent {
    cancel: string;
    confirm: string;
    destructiveButton?: boolean;
    message?: string;
    title: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) data: ConfirmationData,
        public dialogRef: MatDialogRef<ConfirmationDialogComponent>
    ) {
        this.cancel = data.cancel;
        this.confirm = data.confirm;
        this.destructiveButton = data.destructiveButton;
        this.message = data.message || "";
        this.title = data.title;
    }

    onConfirm(): void {
        this.dialogRef.close(true);
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
